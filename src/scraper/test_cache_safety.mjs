import assert from 'assert';
import { normalizeSlug, isCacheStale } from './utils.mjs';
import { extractPostersFromHtml } from './fetch_list.mjs';

console.log('\n🧪 Running Cache Safety & Zero-Omission Test Suite...\n');

let passedTests = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ PASS: ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`  ❌ FAIL: ${name}`);
        console.error(err);
        process.exit(1);
    }
}

// ----------------------------------------------------
// TEST 1: Catalog films (released, valid ID) are stable
// ----------------------------------------------------
test('Stable catalog film with valid TMDb ID is not marked stale', () => {
    const classicMovie = {
        title: 'The Godfather',
        release_year: '1972',
        clean_title: '/film/the-godfather/',
        adult: false,
        id: 238,
        imdb_id: 'tt0068646',
        cached_at: '2024-01-01T00:00:00.000Z'
    };

    assert.strictEqual(isCacheStale(classicMovie), false, 'Classic film with valid TMDb should not be stale');
});

// ----------------------------------------------------
// TEST 2: Missing TMDb ID (id === 0) MUST be refreshed
// ----------------------------------------------------
test('Film with missing TMDb ID (id === 0) is flagged for refresh', () => {
    const missingTmdb = {
        title: 'Some Indie Gem',
        release_year: '2023',
        clean_title: '/film/some-indie-gem/',
        adult: false,
        id: 0,
        imdb_id: 'tt1234567'
    };

    assert.strictEqual(isCacheStale(missingTmdb), true, 'Film with id: 0 must be flagged as stale to retry TMDb resolution');
});

// ----------------------------------------------------
// TEST 3: Tentative titles ("Untitled", "Project") MUST be refreshed
// ----------------------------------------------------
test('Film with tentative name ("Untitled", "Project", "TBA") is flagged for refresh', () => {
    const tentative1 = {
        title: 'Untitled Spider-Man Sequel',
        release_year: '2026',
        clean_title: '/film/spider-man-brand-new-day/',
        adult: false,
        id: 969681
    };

    const tentative2 = {
        title: 'Project Hail Mary',
        release_year: '2026',
        clean_title: '/film/project-hail-mary/',
        adult: false,
        id: 687163
    };

    assert.strictEqual(isCacheStale(tentative1), true, 'Untitled movie must be flagged for refresh');
    assert.strictEqual(isCacheStale(tentative2), true, 'Project movie must be flagged for refresh');
});

// ----------------------------------------------------
// TEST 4: Upcoming / Current year film TTL refresh (TTL >= 3 days)
// ----------------------------------------------------
test('Upcoming film older than 3 days is flagged for refresh to catch title/date changes', () => {
    const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();

    const upcomingOld = {
        title: 'Toy Story 5',
        release_year: '2026',
        clean_title: '/film/toy-story-5/',
        adult: false,
        id: 1084244,
        cached_at: fourDaysAgo
    };

    const upcomingFresh = {
        title: 'Toy Story 5',
        release_year: '2026',
        clean_title: '/film/toy-story-5/',
        adult: false,
        id: 1084244,
        cached_at: oneHourAgo
    };

    assert.strictEqual(isCacheStale(upcomingOld), true, 'Upcoming film older than 3 days should be refreshed');
    assert.strictEqual(isCacheStale(upcomingFresh), false, 'Upcoming film refreshed recently should be kept');
});

// ----------------------------------------------------
// TEST 5: ZERO-DROP GUARANTEE: Never omit new movies
// ----------------------------------------------------
test('Zero-Drop Guarantee: all Letterboxd slugs are preserved in exact order, even on fetch error', () => {
    const liveLetterboxdSlugs = [
        '/film/the-godfather/',
        '/film/brand-new-unseen-film-2026/',
        '/film/parasite-2019/',
        '/film/network-error-film/',
        '/film/renamed-movie-slug/'
    ];

    const mockExistingMap = new Map([
        ['the-godfather', { title: 'The Godfather', release_year: '1972', clean_title: '/film/the-godfather/', id: 238 }],
        ['parasite-2019', { title: 'Parasite', release_year: '2019', clean_title: '/film/parasite-2019/', id: 496243 }],
        ['renamed-movie-slug', { title: 'Old Tentative Title (Untitled Project)', release_year: '2026', clean_title: '/film/renamed-movie-slug/', id: 9999 }]
    ]);

    const mockMovieCache = {};

    // 1. Identification step
    const toFetchSlugs = [];
    for (const slug of liveLetterboxdSlugs) {
        const norm = normalizeSlug(slug);
        const movie = mockExistingMap.get(norm) || mockMovieCache[norm];
        if (!movie || isCacheStale(movie)) {
            toFetchSlugs.push(slug);
        }
    }

    assert.deepStrictEqual(toFetchSlugs, [
        '/film/brand-new-unseen-film-2026/', // brand new movie
        '/film/network-error-film/',         // brand new movie
        '/film/renamed-movie-slug/'          // tentative title needs refresh!
    ], 'Correctly identified new and stale movies requiring fetch');

    // 2. Simulate fetch results (one succeeds, one fails with null, one is renamed)
    const simulatedFetches = {
        '/film/brand-new-unseen-film-2026/': { name: 'Brand New Film', published: '2026', tmdb: 77777, imdb: 'tt77777' },
        '/film/network-error-film/': null, // simulation of network error / 404
        '/film/renamed-movie-slug/': { name: 'Official Official Title', published: '2026', tmdb: 9999, imdb: 'tt9999' } // name changed!
    };

    for (const slug of toFetchSlugs) {
        const detail = simulatedFetches[slug];
        if (detail) {
            const norm = normalizeSlug(slug);
            const record = {
                title: detail.name,
                release_year: detail.published || '',
                clean_title: slug,
                adult: false,
                id: detail.tmdb || 0,
                imdb_id: detail.imdb || null,
                cached_at: new Date().toISOString()
            };
            mockMovieCache[norm] = record;
            mockExistingMap.set(norm, record);
        }
    }

    // 3. Assemble radarrData using the Zero-Drop Guarantee assembly logic
    const radarrData = [];
    for (const slug of liveLetterboxdSlugs) {
        const norm = normalizeSlug(slug);
        const movie = mockExistingMap.get(norm) || mockMovieCache[norm];
        if (movie && movie.title) {
            radarrData.push({
                title: movie.title,
                release_year: movie.release_year || '',
                clean_title: movie.clean_title,
                adult: false,
                id: movie.id || 0,
                ...(movie.imdb_id ? { imdb_id: movie.imdb_id } : {})
            });
        } else {
            // ZERO-DROP GUARANTEE Fallback
            const fallbackTitle = norm
                .split('-')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
            radarrData.push({
                title: fallbackTitle,
                release_year: '',
                clean_title: slug,
                adult: false,
                id: 0
            });
        }
    }

    // Verify lengths match EXACTLY
    assert.strictEqual(radarrData.length, liveLetterboxdSlugs.length, 'Output length MUST strictly match input slugs length');

    // Verify ordering is 100% preserved
    assert.strictEqual(radarrData[0].title, 'The Godfather');
    assert.strictEqual(radarrData[1].title, 'Brand New Film');
    assert.strictEqual(radarrData[1].id, 77777);
    assert.strictEqual(radarrData[2].title, 'Parasite');

    // Verify network-failed film was NOT dropped
    assert.strictEqual(radarrData[3].title, 'Network Error Film', 'Failed fetch should fallback to humanized slug title');
    assert.strictEqual(radarrData[3].clean_title, '/film/network-error-film/');
    assert.strictEqual(radarrData[3].id, 0);

    // Verify renamed film got its updated official title!
    assert.strictEqual(radarrData[4].title, 'Official Official Title', 'Renamed movie must receive updated title');
});

// ----------------------------------------------------
// TEST 6: Watchlist HTML grid markup parsing
// ----------------------------------------------------
test('Watchlist parsing: accurately extracts slugs from Letterboxd watchlist grid markup (li.griditem)', () => {
    const mockWatchlistHtml = `
        <div class="site-body">
            <div class="poster-grid">
                <ul class="grid -p125 -scaled128">
                    <li class="griditem">
                        <div class="react-component" data-component-class="LazyPoster" data-target-link="/film/the-witch-2015/">
                            <div class="poster film-poster"></div>
                        </div>
                    </li>
                    <li class="griditem">
                        <div class="react-component" data-component-class="LazyPoster" data-target-link="/film/the-lighthouse-2019/">
                            <div class="poster film-poster"></div>
                        </div>
                    </li>
                    <li class="griditem">
                        <div class="react-component" data-component-class="LazyPoster" data-target-link="/film/werwulf/">
                            <div class="poster film-poster"></div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="paginate-nextprev">
                <a class="next" href="/sternpaul/watchlist/page/2/">Older</a>
            </div>
        </div>
    `;

    const result = extractPostersFromHtml(mockWatchlistHtml);
    assert.strictEqual(result.posters.length, 3, 'Should extract all 3 posters from watchlist grid');
    assert.deepStrictEqual(result.posters, [
        '/film/the-witch-2015/',
        '/film/the-lighthouse-2019/',
        '/film/werwulf/'
    ]);
    assert.strictEqual(result.nextPage, 2, 'Should extract page 2 next pagination link');
});

// ----------------------------------------------------
// TEST 7: Regular list parsing & Sidebar/Footer preview exclusion
// ----------------------------------------------------
test('Regular list parsing: extracts main list items and ignores sidebar/footer preview widgets', () => {
    const mockListHtml = `
        <div class="site-body">
            <ul class="poster-list -p125">
                <li class="posteritem numbered-list-item">
                    <div class="react-component" data-component-class="LazyPoster" data-target-link="/film/psycho/"></div>
                </li>
                <li class="posteritem numbered-list-item">
                    <div class="react-component" data-component-class="LazyPoster" data-target-link="/film/the-shining/"></div>
                </li>
            </ul>
            <aside class="sidebar">
                <a class="poster-list-link">
                    <ul class="posterlist">
                        <li class="posteritem">
                            <div class="react-component" data-component-class="LazyPoster" data-target-link="/"></div>
                        </li>
                    </ul>
                </a>
            </aside>
        </div>
    `;

    const result = extractPostersFromHtml(mockListHtml);
    assert.strictEqual(result.posters.length, 2, 'Should extract exactly 2 main list items and ignore sidebar preview item');
    assert.deepStrictEqual(result.posters, [
        '/film/psycho/',
        '/film/the-shining/'
    ]);
});

console.log(`\n🎉 All ${passedTests} tests passed successfully!\n`);
