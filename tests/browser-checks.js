async (page) => {
  const origin = "http://127.0.0.1:4173";
  const diagnostics = "/tmp/cvg-local-check";
  const unexpectedRequests = [];
  const failedResources = [];
  const errors = [];
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const near = (actual, expected, label, tolerance = 3) => {
    assert(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, got ${actual}`);
  };
  const visible = (selector) => page.locator(selector).isVisible();
  const focused = (id) => page.evaluate((target) => document.activeElement.id === target, id);
  const activeSlide = () => page.locator('[data-slide][aria-current="true"]').getAttribute("data-slide");
  const waitForSlide = (index) => page.waitForFunction((expected) => document.querySelector('[data-slide][aria-current="true"]').dataset.slide === expected, String(index));
  const scrollTo = async (top) => {
    await page.locator("#page-scroll").evaluate((element, value) => { element.scrollTop = value; }, top);
    await page.waitForTimeout(100);
  };
  const screenshot = (filename) => page.screenshot({ path: `${diagnostics}/${filename}` });
  const onRequest = (request) => {
    const url = request.url();
    const local = url.startsWith(`${origin}/`) || url.startsWith("file:///home/joaquinbianciotto/Projects/CVG-phishing/") || url.startsWith("data:");
    if (!local || request.method() !== "GET" || ["xhr", "fetch", "websocket", "eventsource"].includes(request.resourceType())) {
      unexpectedRequests.push(`${request.method()} ${url}`);
    }
  };
  const onResponse = (response) => {
    if (response.status() >= 400) failedResources.push(`${response.status()} ${response.url()}`);
  };
  const onFailure = (request) => failedResources.push(`${request.failure()?.errorText} ${request.url()}`);
  const onError = (error) => errors.push(error.message);
  page.on("request", onRequest);
  page.on("response", onResponse);
  page.on("requestfailed", onFailure);
  page.on("pageerror", onError);

  const checkResourcesAndSafety = async () => {
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(() => ({
      images: [...document.images].map((image) => ({ source: image.getAttribute("src"), loaded: image.complete && image.naturalWidth > 0 })),
      resources: performance.getEntriesByType("resource").map((entry) => entry.name),
      inputs: [...document.querySelectorAll("input")].map((input) => input.type),
      embedded: document.querySelectorAll("iframe, object, embed").length,
      storage: localStorage.length + sessionStorage.length,
      cookies: document.cookie,
      fonts: document.fonts.check('15px "Open Sans"') && document.fonts.check('24px Roboto'),
    }));
    assert(state.images.length === 9 && state.images.every((image) => image.loaded && image.source.startsWith("imagenes/")), "All nine local images must load");
    assert(state.resources.every((url) => url.startsWith(`${origin}/`) || url.startsWith("file:") || url.startsWith("data:")), "Runtime resources must stay local");
    assert(state.inputs.length === 2 && state.inputs.every((type) => type === "search"), "Only search inputs are permitted, never credentials");
    assert(state.embedded === 0 && state.storage === 0 && state.cookies === "", "No embeds, cookies or persistent storage");
    assert((await page.context().cookies()).length === 0, "No browser cookies");
    assert(state.fonts, "Local fonts must load");
    assert(await visible(".demo-badge"), "The nonofficial local-demo label must remain visible");
    assert((await page.locator(".demo-badge").innerText()).includes("No es el sitio oficial"), "Demo label must be explicit");
  };
  const checkOverflow = async () => {
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector("#page-scroll").scrollWidth <= innerWidth), "No horizontal overflow");
  };
  const escapeAndReturn = async (panel, opener) => {
    assert(await visible(panel), `${panel} must open`);
    await page.keyboard.press("Escape");
    await page.waitForFunction((selector) => !document.querySelector(selector).open && (document.querySelector(selector).hidden || document.querySelector(selector).tagName === "DIALOG"), panel);
    assert(await focused(opener), `${panel} must restore opener focus`);
    if (opener !== "login") {
      await page.waitForFunction((id) => document.getElementById(id).getAttribute("aria-expanded") === "false", opener);
    }
  };

  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${origin}/`);
    await checkResourcesAndSafety();
    await checkOverflow();
    const desktop = await page.locator("main").boundingBox();
    const header = await page.locator(".site-header").boundingBox();
    const hero = await page.locator(".slide-viewport").boundingBox();
    const square = await page.locator("#prevention").boundingBox();
    const logo = await page.locator(".wordmark").boundingBox();
    near(header.height, 131.75, "Desktop header height");
    near(logo.x, 14, "Logo x"); near(logo.y, 49, "Logo y"); near(logo.width, 250, "Logo width");
    near(hero.x, 20, "Hero x"); near(hero.y, 143, "Hero y"); near(hero.width, 1400, "Hero width"); near(hero.height, 310.09, "Hero reserved height");
    near(desktop.x, 49, "Main x"); near(desktop.y, 549, "Main y"); near(desktop.width, 1342, "Main width");
    near(square.x, 225, "Square x"); near(square.y, 683, "Square y"); near(square.width, 990, "Square width");
    near((await page.locator("#schedule").boundingBox()).width, 950, "Schedule width");
    assert(await visible(".site-footer") && !(await visible("#mobile-toggle")), "Desktop visibility");

    await page.locator("#next").click(); await waitForSlide(1);
    await screenshot("desktop.png");
    await page.locator("#previous").click(); await waitForSlide(0);
    await page.locator('[data-slide="2"]').click(); await waitForSlide(2);
    await page.locator("#carousel").focus();
    await page.keyboard.press("ArrowRight"); await waitForSlide(0);
    await page.keyboard.press("End"); await waitForSlide(2);
    await page.keyboard.press("Home"); await waitForSlide(0);
    assert(await page.locator(".slide").first().evaluate((element) => getComputedStyle(element).transitionDuration === "0s"), "Reduced motion removes transition");
    await page.locator("#login").focus(); await page.mouse.move(1, 1);
    await page.waitForTimeout(5300);
    assert(await activeSlide() === "0", "Reduced motion disables automatic carousel changes");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    assert(await page.locator(".slide").first().evaluate((element) => getComputedStyle(element).transitionDuration === "0.6s"), "Ordinary carousel transition is 0.6 seconds");
    await page.waitForTimeout(5300); await waitForSlide(1);
    await page.locator("#carousel").hover();
    const hovered = await activeSlide(); await page.waitForTimeout(5300);
    assert(await activeSlide() === hovered, "Hover pauses automatic carousel changes");
    await page.mouse.move(1, 1); await page.locator("#carousel").focus();
    const focusedSlide = await activeSlide(); await page.waitForTimeout(5300);
    assert(await activeSlide() === focusedSlide, "Focus pauses automatic carousel changes");
    await page.locator("#carousel-pause").focus(); await page.keyboard.press("Enter");
    assert(await page.locator("#carousel-pause").getAttribute("aria-pressed") === "true", "Explicit pause works");
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.locator("#language-toggle").click();
    assert(await page.locator("[data-language]").count() === 2, "Expose both reference languages");
    await page.keyboard.press("ArrowDown");
    assert(await page.locator('[data-language="es"]').evaluate((element) => element === document.activeElement), "Language keyboard navigation");
    await escapeAndReturn("#language-menu", "language-toggle");
    await page.locator("#language-toggle").click(); await page.locator('[data-language="en"]').click();
    assert((await page.locator("#demo-message").innerText()).includes("no traduce"), "Language feedback must not claim full translation");
    await escapeAndReturn("#demo-dialog", "language-toggle");

    await page.locator("#search-toggle").click(); await escapeAndReturn("#header-search", "search-toggle");
    await page.locator("#search-toggle").click();
    await page.locator("#header-query").fill("Novedades"); await page.locator("#header-query").press("Enter");
    assert((await page.locator("#header-feedback").innerText()).includes("Se encontraron"), "Header search matches local content");
    await page.locator("#header-query").fill("zzzz-nothing"); await page.locator("#header-query").press("Enter");
    assert((await page.locator("#header-feedback").innerText()).includes("Sin coincidencias"), "Header search reports absent content");
    await page.locator("#header-query").fill(""); await page.locator("#header-query").press("Enter");
    assert((await page.locator("#header-feedback").innerText()).includes("Escriba"), "Empty header search feedback");
    await page.locator("#search-close").click(); assert(await focused("search-toggle"), "Search close returns focus");

    await page.locator("#login").click();
    await page.keyboard.press("Tab");
    assert(await page.locator("#demo-dialog").evaluate((dialog) => dialog.contains(document.activeElement)), "Dialog traps focus");
    await escapeAndReturn("#demo-dialog", "login");
    await page.locator("#blocks-toggle").click(); await escapeAndReturn("#blocks-drawer", "blocks-toggle");
    await page.locator("#blocks-toggle").click(); await page.getByRole("button", { name: "Comunidad", exact: true }).click();
    await page.keyboard.press("Escape"); assert(await visible("#blocks-drawer"), "Nested demo leaves blocks open");
    await page.getByRole("button", { name: "Cerrar cajón de bloques", exact: true }).click();
    assert(await focused("blocks-toggle"), "Blocks close returns focus");

    await scrollTo(850 + header.height); await screenshot("desktop-lower-1.png");
    await scrollTo(1700 + header.height); await screenshot("desktop-lower-2.png");
    await scrollTo(10000); await screenshot("desktop-footer.png");
    await page.getByRole("button", { name: "Hacer un comentario en este tema", exact: true }).click();
    await page.keyboard.press("Escape");
    assert(await page.getByRole("button", { name: "Hacer un comentario en este tema", exact: true }).evaluate((button) => button === document.activeElement), "Community feedback returns focus");
    await page.locator("#course-query").fill("Álgebra"); await page.locator("#course-query").press("Enter");
    const courseFeedback = await page.locator("#course-feedback").innerText();
    assert(courseFeedback.includes("ni se envían datos"), `Course search is informational only; actual feedback: ${JSON.stringify(courseFeedback)}`);
    await page.locator("#course-query").fill(""); await page.locator("#course-query").press("Enter");
    assert((await page.locator("#course-feedback").innerText()).includes("Escriba"), "Empty course feedback");
    await page.locator("#back-to-top").click();
    near(await page.locator("#page-scroll").evaluate((element) => element.scrollTop), 0, "Back to top", 1);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${origin}/`); await checkResourcesAndSafety(); await checkOverflow();
    const mobileMain = await page.locator("main").boundingBox();
    const mobileSquare = await page.locator("#prevention").boundingBox();
    near((await page.locator(".site-header").boundingBox()).height, 113, "Mobile header height");
    near(mobileMain.x, 16, "Mobile main x"); near(mobileMain.y, 258, "Mobile main y"); near(mobileMain.width, 358, "Mobile main width");
    near(mobileSquare.x, 41, "Mobile square x"); near(mobileSquare.y, 392, "Mobile square y"); near(mobileSquare.width, 308, "Mobile square width");
    assert(!(await visible(".wordmark")) && !(await visible("#carousel")) && !(await visible(".site-footer")), "Hide desktop-only content on mobile");
    await screenshot("mobile.png");
    await page.locator("#mobile-toggle").click();
    near((await page.locator("#mobile-drawer").boundingBox()).width, 285, "Mobile drawer width");
    assert(await page.locator("#mobile-drawer a, #mobile-drawer input").count() === 0, "Mobile drawer remains empty");
    await escapeAndReturn("#mobile-drawer", "mobile-toggle");
    await page.locator("#mobile-toggle").click(); await page.getByRole("button", { name: "Cerrar caja", exact: true }).click();
    assert(await focused("mobile-toggle"), "Mobile drawer close returns focus");
    await page.locator("#search-toggle").click(); await escapeAndReturn("#header-search", "search-toggle");
    await page.locator("#language-toggle").click(); await escapeAndReturn("#language-menu", "language-toggle");
    await page.locator("#login").click(); await escapeAndReturn("#demo-dialog", "login");
    await page.locator("#blocks-toggle").click(); await escapeAndReturn("#blocks-drawer", "blocks-toggle");
    await scrollTo(650); await screenshot("mobile-lower-1.png");
    await scrollTo(1070); await screenshot("mobile-lower-2.png"); await checkOverflow();
    const publicLink = page.locator(".site-footer a");
    assert(await publicLink.getAttribute("href") === "https://ria.utn.edu.ar/" && (await publicLink.getAttribute("rel")).includes("noreferrer"), "Only RIA has a safe public external destination");

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("file:///home/joaquinbianciotto/Projects/CVG-phishing/index.html");
    await checkResourcesAndSafety(); await checkOverflow();
    await page.locator("#next").click(); await waitForSlide(1);
    await page.locator("#login").click(); await escapeAndReturn("#demo-dialog", "login");
    await screenshot("file-desktop.png");
    assert(unexpectedRequests.length === 0, `No external requests or submissions: ${unexpectedRequests.join(", ")}`);
    assert(failedResources.length === 0, `No failed resources: ${failedResources.join(", ")}`);
    assert(errors.length === 0, `No JavaScript errors: ${errors.join(", ")}`);
    return { result: "PASS", desktop, mobileMain, mobileSquare, screenshots: diagnostics, fileSmoke: "PASS", unexpectedRequests, failedResources, errors };
  } finally {
    page.off("request", onRequest);
    page.off("response", onResponse);
    page.off("requestfailed", onFailure);
    page.off("pageerror", onError);
  }
}
