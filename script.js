const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setupYear() {
  const el = $("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileNav() {
  const toggle = $(".nav-toggle");
  const links = $("#nav-links");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    links.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.contains("is-open");
    if (isOpen) close();
    else open();
  });

  // Close when clicking a nav link (mobile).
  links.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) close();
  });

  // Close on escape.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Close if resizing to desktop.
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 821px)").matches) close();
  });
}

function setupActiveNav() {
  const sections = $$("main section[id]");
  const links = $$(".nav-link");
  if (sections.length === 0 || links.length === 0) return;

  const linkById = new Map(
    links
      .map((a) => {
        const id = a.getAttribute("href")?.replace("#", "");
        return id ? [id, a] : null;
      })
      .filter(Boolean),
  );

  const setActive = (id) => {
    links.forEach((a) => a.classList.remove("is-active"));
    const a = linkById.get(id);
    if (a) a.classList.add("is-active");
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    {
      root: null,
      threshold: [0.2, 0.35, 0.5, 0.65],
      rootMargin: "-15% 0px -70% 0px",
    },
  );

  sections.forEach((s) => io.observe(s));
}

function setupRevealOnScroll() {
  const nodes = $$(".reveal");
  if (nodes.length === 0) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    nodes.forEach((n) => n.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 },
  );

  nodes.forEach((n) => io.observe(n));
}

setupYear();
setupMobileNav();
setupActiveNav();
setupRevealOnScroll();
