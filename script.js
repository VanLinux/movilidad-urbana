const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".main-navigation");
const searchInput = document.querySelector("#site-search");
const searchStatus = document.querySelector("#search-status");
const noResults = document.querySelector("#no-results");
const searchableItems = [...document.querySelectorAll(".searchable")];
const resourceCards = [...document.querySelectorAll(".resource-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];

let activeResourceFilter = "all";

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function applyFilters() {
  const query = normalizeText(searchInput.value);
  let visibleCount = 0;

  searchableItems.forEach((item) => {
    const searchText = normalizeText(`${item.dataset.search || ""} ${item.textContent}`);
    const matchesSearch = query === "" || searchText.includes(query);
    const matchesCategory =
      !item.classList.contains("resource-card") ||
      activeResourceFilter === "all" ||
      item.dataset.category === activeResourceFilter;
    const shouldShow = matchesSearch && matchesCategory;

    item.hidden = !shouldShow;

    if (shouldShow) {
      visibleCount += 1;
    }
  });

  const visibleResources = resourceCards.filter((card) => !card.hidden).length;
  noResults.hidden = visibleResources !== 0 || (query === "" && activeResourceFilter === "all");

  if (query) {
    searchStatus.textContent = `${visibleCount} contenido${visibleCount === 1 ? "" : "s"} encontrado${
      visibleCount === 1 ? "" : "s"
    }.`;
  } else {
    searchStatus.textContent = "";
  }
}

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("title", isOpen ? "Cerrar menú" : "Abrir menú");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("title", "Abrir menú");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeResourceFilter = button.dataset.filter;

    filterButtons.forEach((candidate) => {
      const isActive = candidate === button;
      candidate.classList.toggle("is-active", isActive);
      candidate.setAttribute("aria-pressed", String(isActive));
    });

    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);
document.querySelector("#current-year").textContent = new Date().getFullYear();
