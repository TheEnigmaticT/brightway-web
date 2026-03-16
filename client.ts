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

// Safety section tabs
const safetyButtons = document.querySelectorAll<HTMLButtonElement>("[data-safety-toggle]");
const safetyPanels = document.querySelectorAll<HTMLElement>("[data-safety-panel]");

const setSafetyPanel = (target: string) => {
  safetyButtons.forEach((button) => {
    const isActive = button.dataset.safetyToggle === target;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  safetyPanels.forEach((panel) => {
    const isActive = panel.dataset.safetyPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });
};

safetyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.safetyToggle;
    if (target) {
      setSafetyPanel(target);
    }
  });
});

// Access gate (for password-protected pages)
const gate = document.querySelector<HTMLElement>("[data-gate]");
const gateForm = document.querySelector<HTMLFormElement>("[data-gate-form]");
const gateInput = document.querySelector<HTMLInputElement>("[data-gate-input]");
const gateError = document.querySelector<HTMLElement>("[data-gate-error]");
const gatedContent = document.querySelector<HTMLElement>("[data-gated-content]");

if (gate && gateForm && gateInput && gatedContent) {
  const GATE_CODE = "crestway101";
  const GATE_KEY = "crestway_gate";

  if (sessionStorage.getItem(GATE_KEY) === "granted") {
    gate.style.display = "none";
    gatedContent.style.display = "";
  } else {
    gatedContent.style.display = "none";
  }

  gateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (gateInput.value.trim().toLowerCase() === GATE_CODE) {
      sessionStorage.setItem(GATE_KEY, "granted");
      gate.style.display = "none";
      gatedContent.style.display = "";
    } else {
      if (gateError) gateError.hidden = false;
      gateInput.value = "";
      gateInput.focus();
    }
  });
}

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
