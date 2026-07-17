const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const normalize = (value) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim();

const archiveSearch = document.querySelector(".archive-search input");
const archiveCards = [...document.querySelectorAll(".archive-card")];
const archiveButtons = [...document.querySelectorAll(".archive-tags button")];
const archiveCount = document.querySelector(".archive-count");
let archiveTag = "todos";

function filterArchive() {
  const query = normalize(archiveSearch?.value || "");
  let visible = 0;

  archiveCards.forEach((card) => {
    const text = normalize(card.textContent || "");
    const matchesQuery = !query || text.includes(query);
    const matchesTag = archiveTag === "todos" || text.includes(archiveTag);
    card.hidden = !(matchesQuery && matchesTag);
    if (!card.hidden) visible += 1;
  });

  if (archiveCount) archiveCount.textContent = `${visible} artículo${visible === 1 ? "" : "s"}`;
}

archiveSearch?.addEventListener("input", filterArchive);
archiveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    archiveTag = normalize(button.textContent || "todos");
    archiveButtons.forEach((candidate) => candidate.classList.toggle("active", candidate === button));
    filterArchive();
  });
});

const resourceSearch = document.querySelector(".search-box input");
const resourceCards = [...document.querySelectorAll(".result-card")];
const resourceButtons = [...document.querySelectorAll(".filter-tabs button")];
const resourceCount = document.querySelector(".result-count");
let resourceTag = "todos";

function filterResources() {
  const query = normalize(resourceSearch?.value || "");
  let visible = 0;

  resourceCards.forEach((card) => {
    const text = normalize(card.textContent || "");
    const matchesQuery = !query || text.includes(query);
    const matchesTag = resourceTag === "todos" || text.includes(resourceTag);
    card.hidden = !(matchesQuery && matchesTag);
    if (!card.hidden) visible += 1;
  });

  if (resourceCount) resourceCount.textContent = `${visible} recursos encontrados`;
}

resourceSearch?.addEventListener("input", filterResources);
resourceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resourceTag = normalize(button.textContent || "todos");
    resourceButtons.forEach((candidate) => candidate.classList.toggle("active", candidate === button));
    filterResources();
  });
});

const mathContainer = document.querySelector(".prose-content");

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.append(script);
  });
}

async function renderArticleMath() {
  if (!mathContainer) return;

  if (!window.katex) {
    await loadExternalScript("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js");
  }

  mathContainer.querySelectorAll(".katex").forEach((element) => {
    if (element.querySelector(".katex-html")) return;
    const source = element.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
    if (!source) return;
    window.katex.render(source, element, {
      displayMode: false,
      throwOnError: false,
      strict: "ignore",
      trust: false,
    });
  });

  if (!window.renderMathInElement) {
    await loadExternalScript("https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js");
  }

  window.renderMathInElement(mathContainer, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
    strict: "ignore",
    trust: false,
  });
}

renderArticleMath().catch((error) => {
  console.error("No fue posible renderizar las ecuaciones LaTeX.", error);
});
