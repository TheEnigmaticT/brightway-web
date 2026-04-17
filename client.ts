const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const nav = document.querySelector<HTMLElement>("[data-nav]");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });
}

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

// Seamless infinite logo scroll
const partnersTrack = document.querySelector<HTMLElement>(".partners-track");
const partnersScroll = document.querySelector<HTMLElement>(".partners-scroll");

if (partnersTrack && partnersScroll && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const logos = Array.from(partnersTrack.children) as HTMLElement[];
  logos.forEach((logo) => partnersTrack.appendChild(logo.cloneNode(true)));

  let offset = 0;
  let paused = false;
  const speed = 0.5;

  partnersScroll.addEventListener("mouseenter", () => (paused = true));
  partnersScroll.addEventListener("mouseleave", () => (paused = false));

  const tick = () => {
    if (!paused) {
      offset += speed;
      const first = partnersTrack.firstElementChild as HTMLElement;
      if (first && offset >= first.offsetWidth + 80) {
        offset -= first.offsetWidth + 80;
        partnersTrack.appendChild(first);
      }
      partnersTrack.style.transform = `translateX(-${offset}px)`;
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
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

// Testimonial rotation
const testimonialContainer = document.querySelector<HTMLElement>("[data-testimonial]");
if (testimonialContainer) {
  const slides = testimonialContainer.querySelectorAll<HTMLElement>("[data-slide]");
  const dots = testimonialContainer.querySelectorAll<HTMLButtonElement>("[data-dot]");
  let currentSlide = 0;
  let testimonialPaused = false;

  const showSlide = (index: number) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-selected", String(i === index));
    });
    currentSlide = index;
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.dot);
      showSlide(index);
      testimonialPaused = true;
    });
  });

  testimonialContainer.addEventListener("mouseenter", () => (testimonialPaused = true));
  testimonialContainer.addEventListener("mouseleave", () => (testimonialPaused = false));
  testimonialContainer.addEventListener("focusin", () => (testimonialPaused = true));
  testimonialContainer.addEventListener("focusout", () => (testimonialPaused = false));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    setInterval(() => {
      if (!testimonialPaused && slides.length > 1) {
        showSlide((currentSlide + 1) % slides.length);
      }
    }, 8000);
  }
}
