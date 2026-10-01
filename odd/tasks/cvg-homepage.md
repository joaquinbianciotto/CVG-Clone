# CVG homepage and local login demonstration

## Objective and authorization
Recreate the public CVG pages in vanilla HTML/CSS/JavaScript using `imagenes/`. The user accepted the current homepage, authorized a checkpoint commit, then requested a new `login.html` linked from Entrar and based on https://frre.cvg.utn.edu.ar/login/index.php. Acceder must redirect to that exact official URL without sending data. The user wants minimal checks and will review visuals manually; cancel further homepage refinement.

Use only in-chat subagents. No publishing, backend, real authentication, credential collection/forwarding, or second commit is authorized. A visible nonofficial local-demo notice and disabled demonstration login fields preserve the educational scope.

## Constraints and route
- Preserve original images, `.gitignore`, `.atl/`, and generated `.codegraph/`; do not stage unrelated diagnostics.
- No frameworks, package installs, build step, runtime CDN, remote embeds, tracking, cookies, localStorage/sessionStorage, or network submissions.
- Reference UI remains Spanish; technical artifacts are English. Keep local fonts/artwork and documented public sources. Artwork/logo redistribution permission remains unknown.
- Desktop1440x1000/mobile390x844 follow the measured homepage geometry. Mobile hides brand/carousel/footer. The fixed demo badge, informational access, and omitted broken Canva embed are deliberate differences. Carousel interval5s is a documented assumption.
- Organic delegated-direct route, not SDD. Eight-file mapping and multifile writing triggered in-chat delegation. Parent owns this file and full Engram mirror `odd/cvg-homepage/tasks` (7712).
- Strict TDD not configured/established; ordinary functional checks only, no RED/GREEN claim. Following the user's latest request, use minimal syntax/targeted structural checks for the login and leave visual review/manual navigation to them rather than repeat exhaustive E2E.
- RDD globally on, unchanged. No review receipt/approval exists. The homepage native review consent was declined for its exact pre-commit candidate; unavailable native assessment was treated as high and independent functional verification completed. Never carry that decline/approval claim to different content.
- Checkpoint delivery is one coherent homepage commit on a feature branch, no push/PR. Forecast650–900 lines; writer reported828 text lines and native scope1013 with font notices. No forced formatting/behavior split. Rollback concerns only new app/check/doc/logo/font files, excluding original assets/configuration; never delete automatically.

## Tasks
- [x] T1 — Inspect the public homepage/reference assets. Delegated read-only; evidence below.
- [x] T2 — Implement the homepage, local controls, browser harness, and README. One in-chat writer; checks passed.
- [x] T3 — Compare desktop/mobile and verify behavior. Functional PASS; user accepted remaining minor visual differences and canceled additional refinement.

## Acceptance and checks
Homepage uses local assets, opens over HTTP and file://, avoids overflow/errors, reproduces artwork/news/layout, and provides accessible carousel, menu, drawer, search, demo-dialog, and back-to-top controls without credential collection. No pixel-identity, artwork-permission, or native-approval claim.

Observed homepage commands: `node --check script.js`; `node --check tests/browser-checks.js`; owned `python3 -m http.server 4173 --bind 127.0.0.1`; installed `playwright-cli` open/run-code/close with `tests/browser-checks.js`. Required browser harness PASS; independent27/27 checks PASS. Check assertion output, not only CLI exit. Owned processes/listener were stopped. Parent syntax spot-check also passed.

## Evidence and decisions
- Initial repository: unborn `main`, no commits/remotes; original untracked `.gitignore`/eight images. Explorer-generated `.codegraph/` is preserved/unrelated.
- T1 tasks `mupywxd4-1-p68m` and `mupz20gg-2-9erl`: `/tmp/cvg-reference-inspection/reference-notes.md` plus desktop/mobile and overlapping lower screenshots. Image mapping is dimensions/order/appearance, not byte authentication. Internal scrolling prevents a truthful single full-page screenshot. Public Canva403 errors are excluded locally.
- T2 writer `mupzg0ri-3-2x4l` added `index.html`, `styles.css`, `script.js`, `tests/browser-checks.js`, `README.md`, `imagenes/logo-utn.png`, two local WOFF2 fonts, and two SIL OFL notices. Model reported `gpt-6.1-sol`, effort unavailable. Initial focus/timing/bind-probe failures were resolved and the unchanged required commands passed. No assets/configuration replaced, commits, or publication. Screenshots: `/tmp/cvg-local-check/`.
- Parent read full index/script, compared initial desktop/mobile screenshots, and reran the syntax check successfully.
- Native inspect selected18 app/image/font/test/doc paths, excluding diagnostics and this task file. Candidate `sha256:4df26f20c6d4fd836d819b2433066388c1b4b130a4d8f3ea34798c2dae90b2cb`: consent declined, no lineage/mutation/receipt; native assessment unavailable due untracked declaration requirements, independent verification required and completed.
- Independent verifier `muq0ejpn-4-kpgv`: harness PASS plus27/27 independent checks; zero external/failed requests, console/JS errors; all25 existing non-Git files preserved by before/after hashes. Owned server/browser stopped; port4173 had no listener. Report/screenshots: `/tmp/cvg-independent-check/`.
- Observed minor gaps: lower mobile article approx14px lower/wrapping variation, back-to-top23px higher, desktop footer7px earlier, small SVG differences. User explicitly said the page is correct and canceled additional refinement; no correction writer was launched. These accepted deviations are not claimed pixel-perfect.
- Latest instruction: commit the accepted homepage first, then create the demo login; keep checks minimal and manual review human-owned.

## Next step
Read back/mirror this progress and project the completed homepage tasks into todo. Create the explicitly authorized checkpoint commit on a feature branch, then record its identity and add one bounded login task before writing login source. If commit fails, preserve work and resolve only the actual blocker; do not silently change Git identity/signing or publish.
