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
var partnersTrack = document.querySelector(".partners-track");
var partnersScroll = document.querySelector(".partners-scroll");
if (partnersTrack && partnersScroll) {
  const logos = Array.from(partnersTrack.children);
  logos.forEach((logo) => partnersTrack.appendChild(logo.cloneNode(true)));
  let offset = 0;
  let paused = false;
  const speed = 0.5;
  partnersScroll.addEventListener("mouseenter", () => paused = true);
  partnersScroll.addEventListener("mouseleave", () => paused = false);
  const tick = () => {
    if (!paused) {
      offset += speed;
      const first = partnersTrack.firstElementChild;
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
var testimonialContainer = document.querySelector("[data-testimonial]");
if (testimonialContainer) {
  const slides = testimonialContainer.querySelectorAll("[data-slide]");
  const dots = testimonialContainer.querySelectorAll("[data-dot]");
  let currentSlide = 0;
  let testimonialPaused = false;
  const showSlide = (index) => {
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
  testimonialContainer.addEventListener("mouseenter", () => testimonialPaused = true);
  testimonialContainer.addEventListener("mouseleave", () => testimonialPaused = false);
  testimonialContainer.addEventListener("focusin", () => testimonialPaused = true);
  testimonialContainer.addEventListener("focusout", () => testimonialPaused = false);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    setInterval(() => {
      if (!testimonialPaused && slides.length > 1) {
        showSlide((currentSlide + 1) % slides.length);
      }
    }, 8000);
  }
}
