# Run the local homepage

From this repository, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open **http://127.0.0.1:4173/**. Stop your own server with Ctrl+C.
Alternatively, open `index.html` directly in a modern browser (`file://`): no build,
installation, network connection, or runtime CDN is needed.

This is a visibly labeled, nonofficial **local demo** of the public CVG homepage,
not a login page or a replacement for the university's services.

## Check the page

With the server running and the existing `playwright-cli` browser installed:

```sh
node --check script.js
node --check tests/browser-checks.js
mkdir -p /tmp/cvg-local-check
cd /tmp/cvg-local-check
playwright-cli -s=cvg-local-check open http://127.0.0.1:4173/
playwright-cli -s=cvg-local-check run-code --filename=/home/joaquinbianciotto/Projects/CVG-phishing/tests/browser-checks.js
playwright-cli -s=cvg-local-check close
```

The plain async page function throws on failure and returns `PASS` on success.
Inspect the CLI result, not only its process exit code. It checks desktop/mobile
geometry, loaded images/fonts, overflow, carousel motion and controls, menus,
drawers, dialog focus/Escape, local search, and absence of credentials,
submissions, external requests, cookies, or storage. It also opens `file://` in
that same browser. Comparison screenshots go to `/tmp/cvg-local-check/`;
they retain the demo label. The harness currently uses this checkout's absolute
path; update it and the command if relocating the repository.

## Intentional differences

- The persistent Spanish demo badge is never hidden, including in screenshots.
- Entrar, profiles, community actions, comments, and permanent-link actions open
  informational dialogs. There are no credential fields, account endpoints,
  login redirects, tracking, backend, cookies, or persistent browser storage.
- Both observed language alternatives are exposed; selecting one explains that
  the reference content remains in Spanish. No full translation is claimed.
- Header search checks page text and image descriptions locally; course search
  explains that no course catalog is connected. Neither submits data.
- The failed remote Canva embed is replaced by the observed blank space. No
  iframe or third-party service is contacted. The supplied QR code and email
  addresses remain image artwork, not interactive forms or links.
- The right block drawer provides demo-only feedback; its live behavior was not
  verified. The observed empty mobile drawer has only its close control.
- RIA is the sole public external link, opened only on user activation with
  `noopener noreferrer`.
- The reference carousel interval was not measured: **5 seconds** is an explicit
  assumption, with the observed **0.6-second** transition. Autoplay pauses on
  hover/focus, hidden tabs, mobile, or reduced motion. A keyboard-focusable
  pause/resume button and arrow/Home/End controls are also available.
- The 992px desktop breakpoint reproduces the observed desktop/mobile hiding.
  An internal scroller preserves the blank brand strip while browsing lower
  content. These measured views are faithful approximations, not pixel identity.

## Local resources and provenance

The original eight PNG files under `imagenes/` are preserved unchanged. Their
artwork and order were matched to https://frre.cvg.utn.edu.ar/ by appearance and
intrinsic dimensions, not byte hashes. No license for the university artwork
was established; public availability does not grant redistribution rights.
This demonstration makes no university affiliation claim.

| Added file | Exact public source | License / use |
| --- | --- | --- |
| `imagenes/logo-utn.png` | https://frre.cvg.utn.edu.ar/pluginfile.php/1/theme_adaptable/logo/1767757234/logo-utn-siglas.png | Public reference wordmark; no redistribution license established |
| `fonts/open-sans-latin.woff2` | https://fonts.gstatic.com/s/opensans/v44/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2 | Open Sans, normal Latin variable weights 400–700; SIL OFL 1.1 |
| `fonts/roboto-latin.woff2` | https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2 | Roboto, normal Latin variable weights 400–700; SIL OFL 1.1 |
| `fonts/OFL-OpenSans.txt` | https://raw.githubusercontent.com/google/fonts/main/ofl/opensans/OFL.txt | Full Open Sans license and copyright notice |
| `fonts/OFL-Roboto.txt` | https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/OFL.txt | Full Roboto license and copyright notice |

The WOFF2 URLs were returned by this Google Fonts CSS request using a modern
Chrome user agent:
https://fonts.googleapis.com/css2?family=Open+Sans:wght@400..700&family=Roboto:wght@400..700&display=swap

Only the Latin subsets needed for the Spanish UI were downloaded. All runtime
references are relative local files; the CSS/source URLs above are provenance,
not runtime requests. Icons are small inline SVG drawings, not Font Awesome.

## Review and rollback boundary

Review initial desktop/mobile whitespace and image order first, then lower-page
news and controls. Only these newly added files belong to this work unit:
`index.html`, `styles.css`, `script.js`, `README.md`, `tests/browser-checks.js`,
`imagenes/logo-utn.png`, the two listed WOFF2 files and two OFL notices. A rollback
must leave the original eight images, `.gitignore`, `.codegraph`, and `odd/`
untouched. No commit, stage, publication, or automated deletion is part of this
implementation.
