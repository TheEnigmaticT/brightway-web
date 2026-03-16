// client.ts
var menuToggle = document.querySelector("[data-menu-toggle]");
var nav = document.querySelector("[data-nav]");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });
}
var heroButtons = document.querySelectorAll("[data-hero-toggle]");
var heroPanels = document.querySelectorAll("[data-hero-panel]");
var setHeroPanel = (target) => {
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
var parentsButtons = document.querySelectorAll("[data-parents-toggle]");
var parentsPanels = document.querySelectorAll("[data-parents-panel]");
var parentsManual = false;
var setParentsPanel = (target) => {
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
var safetyButtons = document.querySelectorAll("[data-safety-toggle]");
var safetyPanels = document.querySelectorAll("[data-safety-panel]");
var setSafetyPanel = (target) => {
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
var gate = document.querySelector("[data-gate]");
var gateForm = document.querySelector("[data-gate-form]");
var gateInput = document.querySelector("[data-gate-input]");
var gateError = document.querySelector("[data-gate-error]");
var gatedContent = document.querySelector("[data-gated-content]");
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
      if (gateError)
        gateError.hidden = false;
      gateInput.value = "";
      gateInput.focus();
    }
  });
}
var revealElements = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
var parentsSection = document.querySelector("#parents");
if (parentsSection && "IntersectionObserver" in window) {
  const parentsObserver = new IntersectionObserver((entries) => {
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
  }, { threshold: 0.6 });
  parentsObserver.observe(parentsSection);
}
var sectionLinks = document.querySelectorAll("[data-nav-link]");
var sections = Array.from(sectionLinks).map((link) => {
  const id = link.getAttribute("href")?.replace("#", "");
  const section = id ? document.getElementById(id) : null;
  return { link, section };
}).filter((item) => Boolean(item.section));
if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        sections.forEach(({ link, section }) => {
          link.classList.toggle("is-active", section === entry.target);
        });
      }
    });
  }, { threshold: 0.55 });
  sections.forEach(({ section }) => sectionObserver.observe(section));
}
