"use strict";

const byId = (id) => document.getElementById(id);
const scroller = byId("page-scroll");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileViewport = window.matchMedia("(max-width: 991.98px)");
const dialogOpeners = new Map();

function openDialog(dialog, opener) {
  dialogOpeners.set(dialog, opener);
  dialog.showModal();
  dialog.querySelector("button").focus();
}

function restoreDialogFocus(dialog) {
  const opener = dialogOpeners.get(dialog);
  dialogOpeners.delete(dialog);
  opener?.setAttribute("aria-expanded", "false");
  opener?.focus();
}

function closeDialog(dialog) {
  dialog.close();
  restoreDialogFocus(dialog);
}

for (const dialog of document.querySelectorAll("dialog")) {
  dialog.querySelector("[data-close]").addEventListener("click", () => closeDialog(dialog));
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button, a[href], input, [tabindex='0']")]
      .filter((element) => !element.disabled && element.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey ? document.activeElement === first : document.activeElement === last) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  });
  dialog.addEventListener("close", () => {
    // A queued close event must not disturb a dialog reopened in the meantime.
    if (!dialog.open) restoreDialogFocus(dialog);
  });
}

for (const [toggleId, drawerId] of [["mobile-toggle", "mobile-drawer"], ["blocks-toggle", "blocks-drawer"]]) {
  const toggle = byId(toggleId);
  toggle.addEventListener("click", () => {
    closePopup(false);
    toggle.setAttribute("aria-expanded", "true");
    openDialog(byId(drawerId), toggle);
  });
}

function showDemo(message, opener) {
  byId("demo-message").textContent = message;
  openDialog(byId("demo-dialog"), opener);
}

for (const button of document.querySelectorAll("[data-demo]")) {
  button.addEventListener("click", () => showDemo(button.dataset.demo, button));
}

let activePopup = null;
function closePopup(returnFocus = true) {
  if (!activePopup) return;
  const { panel, toggle } = activePopup;
  panel.hidden = true;
  toggle.setAttribute("aria-expanded", "false");
  activePopup = null;
  if (returnFocus) toggle.focus();
}

function togglePopup(panel, toggle) {
  if (activePopup?.panel === panel) {
    closePopup();
    return;
  }
  closePopup(false);
  panel.hidden = false;
  toggle.setAttribute("aria-expanded", "true");
  activePopup = { panel, toggle };
  panel.querySelector("input, button").focus();
}

byId("language-toggle").addEventListener("click", () => togglePopup(byId("language-menu"), byId("language-toggle")));
byId("search-toggle").addEventListener("click", () => togglePopup(byId("header-search"), byId("search-toggle")));
byId("search-close").addEventListener("click", () => closePopup());
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activePopup) {
    event.preventDefault();
    closePopup();
  }
});
document.addEventListener("click", (event) => {
  if (activePopup && !activePopup.panel.contains(event.target) && !activePopup.toggle.contains(event.target)) {
    closePopup(false);
  }
});
document.addEventListener("focusin", (event) => {
  if (activePopup && !activePopup.panel.contains(event.target) && !activePopup.toggle.contains(event.target)) {
    closePopup(false);
  }
});

byId("language-menu").addEventListener("keydown", (event) => {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const choices = [...byId("language-menu").querySelectorAll("button")];
  const current = choices.indexOf(document.activeElement);
  const next = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + choices.length) % choices.length;
  choices[next].focus();
});
for (const option of document.querySelectorAll("[data-language]")) {
  option.addEventListener("click", () => {
    closePopup();
    const message = option.dataset.language === "en"
      ? "English (en): opción ilustrativa. Esta maqueta local no traduce el contenido de referencia, que permanece en español."
      : "Español - Internacional (es): el contenido de referencia permanece en español en esta maqueta local.";
    showDemo(message, byId("language-toggle"));
  });
}

byId("header-search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = byId("header-query").value.trim().toLocaleLowerCase("es");
  const searchableSections = [byId("news"), document.querySelector(".artwork")];
  const matches = query ? searchableSections.filter((section) => {
    const labels = [...section.querySelectorAll("img")].map((image) => image.alt).join(" ");
    return `${section.textContent} ${labels}`.toLocaleLowerCase("es").includes(query);
  }) : [];
  byId("header-feedback").textContent = !query ? "Escriba un término para buscar en esta página local."
    : matches.length ? `Se encontraron ${matches.length} secciones en esta página local. No se consultó el campus oficial.`
    : "Sin coincidencias en esta página local. No se consultó el campus oficial.";
});
byId("course-search").addEventListener("submit", (event) => {
  event.preventDefault();
  byId("course-feedback").textContent = byId("course-query").value.trim()
    ? "Búsqueda local de demostración: no hay un catálogo de cursos conectado ni se envían datos."
    : "Escriba un término. Esta maqueta local no está conectada al catálogo de cursos.";
});

const carousel = byId("carousel");
const slides = [...carousel.querySelectorAll(".slide")];
const dots = [...carousel.querySelectorAll("[data-slide]")];
let currentSlide = 0;
let timer = null;
let paused = false;
let hovered = false;
function setSlide(index, announce = false) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => {
    const active = position === currentSlide;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
    dots[position].setAttribute("aria-current", String(active));
  });
  if (announce) byId("carousel-status").textContent = `Diapositiva ${currentSlide + 1} de ${slides.length}`;
}
function updateAutoplay() {
  window.clearInterval(timer);
  timer = null;
  if (paused || hovered || carousel.contains(document.activeElement) || motionPreference.matches || mobileViewport.matches || document.hidden) return;
  // The reference interval is unverified; this demo uses a documented five seconds.
  timer = window.setInterval(() => setSlide(currentSlide + 1), 5000);
}
function navigateSlide(index) {
  setSlide(index, true);
  updateAutoplay();
}
byId("next").addEventListener("click", () => navigateSlide(currentSlide + 1));
byId("previous").addEventListener("click", () => navigateSlide(currentSlide - 1));
dots.forEach((dot) => dot.addEventListener("click", () => navigateSlide(Number(dot.dataset.slide))));
carousel.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const index = event.key === "Home" ? 0 : event.key === "End" ? slides.length - 1 : currentSlide + (event.key === "ArrowRight" ? 1 : -1);
  navigateSlide(index);
});
carousel.addEventListener("mouseenter", () => { hovered = true; updateAutoplay(); });
carousel.addEventListener("mouseleave", () => { hovered = false; updateAutoplay(); });
carousel.addEventListener("focusin", updateAutoplay);
carousel.addEventListener("focusout", () => window.setTimeout(updateAutoplay, 0));
byId("carousel-pause").addEventListener("click", () => {
  paused = !paused;
  byId("carousel-pause").setAttribute("aria-pressed", String(paused));
  byId("carousel-pause").textContent = paused ? "Reanudar carrusel" : "Pausar carrusel";
  updateAutoplay();
});
motionPreference.addEventListener("change", updateAutoplay);
mobileViewport.addEventListener("change", () => {
  closePopup(false);
  if (!mobileViewport.matches && byId("mobile-drawer").open) {
    closeDialog(byId("mobile-drawer"));
    byId("login").focus();
  }
  updateAutoplay();
});
document.addEventListener("visibilitychange", updateAutoplay);
updateAutoplay();

scroller.addEventListener("scroll", () => {
  byId("back-to-top").hidden = scroller.scrollTop < 250;
  document.body.classList.toggle("header-scrolled", scroller.scrollTop >= document.querySelector(".site-header").offsetHeight);
}, { passive: true });
byId("back-to-top").addEventListener("click", () => {
  scroller.scrollTo({ top: 0, behavior: motionPreference.matches ? "instant" : "smooth" });
  scroller.focus({ preventScroll: true });
});
