# Run the local CVG demo

From this repository, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open **http://127.0.0.1:4173/**. Stop your own server with Ctrl+C.
Alternatively, open `index.html` directly in a modern browser (`file://`): no build,
installation, network connection, or runtime CDN is needed.

This is a visibly labeled, nonofficial **local demo** of the public CVG homepage
and login layout, not an authentication service or a replacement for the
university's services. It cannot accept real credentials.

## Manual login path

1. Open `index.html` and choose **Entrar** to navigate to `login.html`.
2. Review the **Maqueta local · No es el sitio oficial** notice. The nameless
   username/password fields are disabled and contain fixed demonstration values.
3. **Acceder** only calls `window.location.assign` with the exact constant
   `https://frre.cvg.utn.edu.ar/login/index.php`. It reads no input values,
   cookies, or stored data and forwards no query string, request body, or
   credentials. Actual sign-in happens only on the official page, not in this demo.
4. The password-recovery link opens the genuine public official recovery page.
   Guest access, language information, and the cookie notice are local
   information disclosures, not connected university services.
5. **Volver a la página principal** returns to `index.html`.

`login.html`, `login.css`, and `login.js` are standalone vanilla files. The login
does not load the homepage's `script.js`. CSP blocks connections and form actions;
there is no form, backend, SSO, tracking, or browser storage. A no-referrer policy
also avoids forwarding the local page address when leaving the login demo.

## Minimum login checks

```sh
node --check login.js
node --check tests/browser-checks.js
```

Targeted source readback checks the local Entrar anchor, disabled nameless fields,
constant data-free redirect, and local resource paths. New login visual/browser
review and manual navigation were left to the user. The official Acceder redirect
was not exercised, and the existing full browser harness was not rerun for this
login change.

## Optional homepage harness

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
submissions, external requests, cookies, or storage on the homepage. Entrar is
checked as a local semantic anchor without following it; this harness does not
verify the new login page. It also opens the homepage with `file://` in that
same browser. Comparison screenshots go to `/tmp/cvg-local-check/`;
they retain the demo label. The harness currently uses this checkout's absolute
path; update it and the command if relocating the repository.

## Intentional differences

- The persistent Spanish demo badge is never hidden, including in screenshots.
- Entrar now opens the local login demonstration. Profiles, community actions,
  comments, and permanent-link actions still open informational dialogs.
  The only credential-shaped fields are disabled, nameless static demo fields
  on the login page; no account or credential handling is implemented.
- The login adds a visible safety notice, demonstration explanation, and a
  return-home link with the existing local logo. Its mobile card fits the
  viewport rather than reproducing the reference card's horizontal overflow.
  Secondary login services show local information, except the observed genuine
  public password-recovery link. Acceder only leaves for the constant official
  login URL; no authentication or SSO is implemented.
- Both observed language alternatives are exposed; selecting one explains that
  the reference content remains in Spanish. No full translation is claimed.
- Header search checks page text and image descriptions locally; course search
  explains that no course catalog is connected. Neither submits data.
- The failed remote Canva embed is replaced by the observed blank space. No
  iframe or third-party service is contacted. The supplied QR code and email
  addresses remain image artwork, not interactive forms or links.
- The right block drawer provides demo-only feedback; its live behavior was not
  verified. The observed empty mobile drawer has only its close control.
- RIA remains the homepage's sole public external link, opened only on user
  activation with `noopener noreferrer`. The login additionally offers the
  observed official password-recovery link and the data-free Acceder redirect.
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

The login reference was inspected only at
https://frre.cvg.utn.edu.ar/login/index.php, without authentication, submission,
or private-page navigation. Public reference screenshots at desktop 1440×1000
and mobile 390×844 are `/tmp/cvg-login-reference/desktop-t4-reference.png` and
`/tmp/cvg-login-reference/mobile-t4-reference.png`; these are not local UI
verification. The public page used Open Sans, Roboto, a white desktop 500px card,
a pale-blue Acceder button, and teal secondary controls. No logo appeared inside
the reference form; the local return-home link and favicon reuse the existing
logo without adding artwork or downloading assets.

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

The accepted homepage is checkpoint
`3ea7ed0f980acb9e63f16f7f9e42fde027a305ee` on `feat/cvg-homepage`; it is not
being visually refined. The new login changes remain uncommitted, with visual
review and manual navigation left to the user. No native-review approval or
pixel-identity claim is made.

The T4 rollback boundary is only the new `login.html`, `login.css`, and `login.js`,
plus the changes to `index.html`, `styles.css`, `tests/browser-checks.js`, and
`README.md` relative to that checkpoint. Preserve the accepted homepage, its
original and added assets/fonts, `script.js`, `.gitignore`, `.codegraph/`, and
`odd/`. No staging, second commit, publication, or actual rollback is part of
this login implementation.
