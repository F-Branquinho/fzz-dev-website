const grid = document.getElementById("project-grid");
const filtersEl = document.getElementById("filters");
const emptyEl = document.getElementById("empty");
const heroVisual = document.getElementById("hero-visual");

const STATUS = {
  "Completed": { cls: "done", icon: "check" },
  "In development": { cls: "wip", icon: "clock" },
  "Planned": { cls: "planned", icon: "bulb" }
};

const CATEGORY_ICON = {
  "Discord Bot": "bot",
  "Website": "globe",
  "FACEIT": "zap",
  "Tool": "code"
};

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function icon(name, cls = "") {
  return `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function projectIcon(p) {
  return p.icon || CATEGORY_ICON[p.category] || "layers";
}

function card(p, index) {
  const status = STATUS[p.status] || STATUS["Planned"];
  const links = p.links || {};
  const media = p.image
    ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)} preview" loading="lazy">`
    : `<span class="card-placeholder">${icon(projectIcon(p))}</span>`;
  const actions = [
    links.demo && `<a class="link-primary" href="${escapeHtml(links.demo)}" target="_blank" rel="noopener">Visit project ${icon("external")}</a>`,
    links.code && `<a href="${escapeHtml(links.code)}" target="_blank" rel="noopener">${icon("github")} Code</a>`
  ].filter(Boolean).join("");

  return `
    <article class="card reveal${p.featured ? " featured" : ""}" style="--delay:${index * 80}ms">
      <div class="card-media">
        ${media}
        <span class="card-badge">${icon(projectIcon(p))}</span>
        ${p.featured ? `<span class="featured-label">Featured</span>` : ""}
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="category">${escapeHtml(p.category)}</span>
          <span class="status ${status.cls}">${icon(status.icon)}${escapeHtml(p.status)}</span>
        </div>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <ul class="tags">${(p.tags || []).map(t => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
        ${actions ? `<div class="card-actions">${actions}</div>` : ""}
      </div>
    </article>`;
}

function render(category) {
  const list = category === "All" ? PROJECTS : PROJECTS.filter(p => p.category === category);
  grid.innerHTML = list.map(card).join("");
  emptyEl.hidden = list.length > 0;
  observeReveals(grid);
  attachSpotlight();
}

function renderFilters() {
  const categories = ["All", ...new Set(PROJECTS.map(p => p.category))];
  filtersEl.innerHTML = categories.map((c, i) => {
    const count = c === "All" ? PROJECTS.length : PROJECTS.filter(p => p.category === c).length;
    const ic = c === "All" ? "layers" : CATEGORY_ICON[c] || "layers";
    return `<button role="tab" aria-selected="${i === 0}" data-cat="${escapeHtml(c)}">${icon(ic)}${escapeHtml(c)}<span class="count">${count}</span></button>`;
  }).join("");
  filtersEl.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    filtersEl.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", b === btn));
    render(btn.dataset.cat);
  });
}

function renderStats() {
  const values = {
    "stat-total": PROJECTS.length,
    "stat-done": PROJECTS.filter(p => p.status === "Completed").length,
    "stat-wip": PROJECTS.filter(p => p.status === "In development").length
  };
  for (const [id, target] of Object.entries(values)) {
    const el = document.getElementById(id);
    // Hide the "In development" stat when there is nothing in progress
    if (id === "stat-wip") el.closest(".stat").hidden = target === 0;
    if (reducedMotion || target === 0) { el.textContent = target; continue; }
    let n = 0;
    const step = () => { el.textContent = ++n; if (n < target) setTimeout(step, 600 / target); };
    step();
  }
}

// Stacked project previews in the hero
function renderHeroVisual() {
  const withImages = PROJECTS.filter(p => p.image).slice(0, 3);
  heroVisual.innerHTML = withImages.map((p, i) => `
    <figure class="float-card float-${i + 1}">
      <img src="${escapeHtml(p.image)}" alt="">
      <figcaption>${icon(projectIcon(p))}${escapeHtml(p.title)}</figcaption>
    </figure>`).join("");
}

// Scroll reveal
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealObserver = "IntersectionObserver" in window && !reducedMotion
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

function observeReveals(root = document) {
  root.querySelectorAll(".reveal:not(.visible)").forEach(el => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add("visible");
  });
}

// Cursor-following glow on cards
function attachSpotlight() {
  grid.querySelectorAll(".card").forEach(c => {
    c.addEventListener("pointermove", e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

// Nav shadow once the page scrolls
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 10), { passive: true });

renderFilters();
renderStats();
renderHeroVisual();
render("All");
observeReveals();
document.getElementById("year").textContent = new Date().getFullYear();
