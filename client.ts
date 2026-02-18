const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const nav = document.querySelector<HTMLElement>("[data-nav]");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });
}

const heroButtons = document.querySelectorAll<HTMLButtonElement>("[data-hero-toggle]");
const heroPanels = document.querySelectorAll<HTMLElement>("[data-hero-panel]");

const setHeroPanel = (target: string) => {
  heroButtons.forEach((button) => {
    const isActive = button.dataset.heroToggle === target;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  heroPanels.forEach((panel) => {
    const isActive = panel.dataset.heroPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });
};

heroButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.heroToggle;
    if (target) {
      setHeroPanel(target);
    }
  });
});

const parentsButtons = document.querySelectorAll<HTMLButtonElement>("[data-parents-toggle]");
const parentsPanels = document.querySelectorAll<HTMLElement>("[data-parents-panel]");

let parentsManual = false;

const setParentsPanel = (target: string) => {
  parentsButtons.forEach((button) => {
    const isActive = button.dataset.parentsToggle === target;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  parentsPanels.forEach((panel) => {
    const isActive = panel.dataset.parentsPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });
};

parentsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.parentsToggle;
    if (target) {
      parentsManual = true;
      setParentsPanel(target);
    }
  });
});

const revealElements = document.querySelectorAll<HTMLElement>("[data-reveal]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const parentsSection = document.querySelector<HTMLElement>("#parents");
if (parentsSection && "IntersectionObserver" in window) {
  const parentsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => {
            if (!parentsManual) {
              setParentsPanel("after");
            }
          }, 30000);
          parentsObserver.disconnect();
        }
      });
    },
    { threshold: 0.6 }
  );
  parentsObserver.observe(parentsSection);
}

const sectionLinks = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");
const sections = Array.from(sectionLinks)
  .map((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    const section = id ? document.getElementById(id) : null;
    return { link, section };
  })
  .filter((item): item is { link: HTMLAnchorElement; section: HTMLElement } => Boolean(item.section));

if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sections.forEach(({ link, section }) => {
            link.classList.toggle("is-active", section === entry.target);
          });
        }
      });
    },
    { threshold: 0.55 }
  );

  sections.forEach(({ section }) => sectionObserver.observe(section));
}
