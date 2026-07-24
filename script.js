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

const COUNTER_NAMESPACE = "movilidad-urbana-vanlinux";
const GITHUB_PAGES_BASE = "/movilidad-urbana";
const SESSION_PREFIX = "movilidad-urbana:visit:";
const footerMeta = document.querySelector(".site-footer > p");

function pageVisitKey(pathname) {
  let path = pathname;

  if (path === GITHUB_PAGES_BASE) {
    path = "/";
  } else if (path.startsWith(`${GITHUB_PAGES_BASE}/`)) {
    path = path.slice(GITHUB_PAGES_BASE.length);
  }

  path = path.replace(/\/+$/, "") || "/";

  return path === "/"
    ? "inicio"
    : path.replace(/^\/+/, "").replace(/\/+/g, "--").toLocaleLowerCase("es-MX");
}

function formatVisits(value) {
  const numericValue = typeof value === "number"
    ? value
    : Number(String(value).replace(/[^\d.-]/g, ""));

  return Number.isFinite(numericValue)
    ? new Intl.NumberFormat("es-MX").format(numericValue)
    : null;
}

async function renderVisitCounter() {
  if (!footerMeta) return;

  const style = document.createElement("style");
  style.textContent = `
    .footer-meta { display: flex; flex-direction: column; align-items: center; gap: 7px; margin: 0; text-align: center; }
    .footer-visit-counter { min-height: 26px; display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; color: #545450; background: #e8e8e4; border: 1px solid #c9c9c4; border-radius: 999px; white-space: nowrap; }
    .footer-visit-counter svg { width: 15px; height: 15px; color: #b14e35; }
    .footer-visit-counter span { color: inherit; font-size: .7rem; font-variant-numeric: tabular-nums; }
    @media (max-width: 760px) { .footer-meta { align-items: flex-start; text-align: left; } }
  `;
  document.head.append(style);

  footerMeta.classList.add("footer-meta");

  const counter = document.createElement("span");
  counter.className = "footer-visit-counter";
  counter.setAttribute("aria-label", "Cargando visitas");
  counter.setAttribute("aria-live", "polite");
  counter.innerHTML = `
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
      <circle cx="12" cy="12" r="2.7"></circle>
    </svg>
    <span>— visitas</span>
  `;
  footerMeta.append(counter);

  const key = pageVisitKey(window.location.pathname);
  const sessionKey = `${SESSION_PREFIX}${key}`;
  let countedInSession = false;

  try {
    countedInSession = window.sessionStorage.getItem(sessionKey) === "1";
    if (!countedInSession) window.sessionStorage.setItem(sessionKey, "1");
  } catch {
    countedInSession = false;
  }

  const endpoint = new URL(
    `https://counterapi.com/api/${COUNTER_NAMESPACE}/view/${encodeURIComponent(key)}`,
  );
  endpoint.searchParams.set("unique", "true");
  if (countedInSession) endpoint.searchParams.set("readOnly", "true");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(endpoint, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Counter response: ${response.status}`);

    const data = await response.json();
    const visits = formatVisits(data.value);
    if (!visits) throw new Error("Counter response has no numeric value");

    counter.querySelector("span").textContent = `${visits} visitas`;
    counter.setAttribute("aria-label", `${visits} visitas a esta página`);
  } catch {
    counter.remove();
  } finally {
    window.clearTimeout(timeout);
  }
}

renderVisitCounter();
