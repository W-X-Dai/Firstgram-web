"use strict";

/* =========================
   DOM Elements
========================= */

const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

const modeButtons = document.querySelectorAll("[data-mode-target]");
const modePanels = document.querySelectorAll("[data-mode-panel]");

const revealItems = document.querySelectorAll(".reveal");

const waitlistForm = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");
const successState = document.getElementById("success-state");
const resetFormButton = document.getElementById("reset-form");

const currentYear = document.getElementById("current-year");

const instructionItems = document.querySelectorAll(".instruction");
const matchScore = document.getElementById("match-score");

const shutterButton = document.querySelector(".shutter");

/* =========================
   Header Scroll Effect
========================= */

function updateHeaderState() {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

updateHeaderState();

window.addEventListener("scroll", updateHeaderState, {
  passive: true,
});

/* =========================
   Mobile Navigation
========================= */

function closeMobileMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.classList.remove("is-active");
  siteNav.classList.remove("is-open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "開啟導覽選單");

  document.body.classList.remove("menu-open");
}

function openMobileMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.classList.add("is-active");
  siteNav.classList.add("is-open");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "關閉導覽選單");

  document.body.classList.add("menu-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.contains("is-open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMobileMenu();
    }
  });
}

/* =========================
   Smooth Anchor Scroll
========================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const targetElement = document.querySelector(targetId);

    if (!targetElement) {
      return;
    }

    event.preventDefault();

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/* =========================
   Mode Switcher
========================= */

function activateMode(modeName) {
  modeButtons.forEach((button) => {
    const isActive = button.dataset.modeTarget === modeName;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));

    if (isActive) {
      button.focus({
        preventScroll: true,
      });
    }
  });

  modePanels.forEach((panel) => {
    const isActive = panel.dataset.modePanel === modeName;

    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

modeButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const modeName = button.dataset.modeTarget;

    if (modeName) {
      activateMode(modeName);
    }
  });

  button.addEventListener("keydown", (event) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];

    if (!keys.includes(event.key)) {
      return;
    }

    event.preventDefault();

    let newIndex = index;

    if (event.key === "ArrowRight") {
      newIndex = (index + 1) % modeButtons.length;
    }

    if (event.key === "ArrowLeft") {
      newIndex =
        (index - 1 + modeButtons.length) % modeButtons.length;
    }

    if (event.key === "Home") {
      newIndex = 0;
    }

    if (event.key === "End") {
      newIndex = modeButtons.length - 1;
    }

    const newButton = modeButtons[newIndex];
    const newModeName = newButton.dataset.modeTarget;

    if (newModeName) {
      activateMode(newModeName);
    }
  });
});

/* =========================
   Scroll Reveal Animation
========================= */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
} else if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -45px 0px",
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}

/* =========================
   Number Animation
========================= */

function animateNumber(
  element,
  startValue,
  endValue,
  duration = 500,
  suffix = ""
) {
  if (!element) {
    return;
  }

  if (prefersReducedMotion) {
    element.textContent = `${endValue}${suffix}`;
    return;
  }

  const startTime = performance.now();
  const difference = endValue - startValue;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    const currentValue = Math.round(
      startValue + difference * easedProgress
    );

    element.textContent = `${currentValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* =========================
   Shutter Interaction
========================= */

if (shutterButton) {
  shutterButton.addEventListener("click", () => {
    shutterButton.classList.add("is-capturing");

    document.body.classList.add("camera-flash");

    window.setTimeout(() => {
      shutterButton.classList.remove("is-capturing");
      document.body.classList.remove("camera-flash");
    }, 260);
  });
}

/* =========================
   Waitlist Form Validation
========================= */

function validateEmail(email) {
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  return emailPattern.test(email);
}

function setEmailError(message) {
  if (!emailInput || !emailError) {
    return;
  }

  emailError.textContent = message;

  if (message) {
    emailInput.setAttribute("aria-invalid", "true");
  } else {
    emailInput.removeAttribute("aria-invalid");
  }
}

if (emailInput) {
  emailInput.addEventListener("input", () => {
    if (emailInput.value.trim() !== "") {
      setEmailError("");
    }
  });

  emailInput.addEventListener("blur", () => {
    const email = emailInput.value.trim();

    if (email === "") {
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("請輸入有效的 Email 地址。");
    }
  });
}

if (
  waitlistForm &&
  emailInput &&
  successState
) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (email === "") {
      setEmailError("請輸入 Email 地址。");
      emailInput.focus();
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("請輸入有效的 Email 地址。");
      emailInput.focus();
      return;
    }

    setEmailError("");

    waitlistForm.hidden = true;
    successState.hidden = false;

    successState.focus();
  });
}

if (
  resetFormButton &&
  waitlistForm &&
  emailInput &&
  successState
) {
  resetFormButton.addEventListener("click", () => {
    successState.hidden = true;
    waitlistForm.hidden = false;

    waitlistForm.reset();
    setEmailError("");

    emailInput.focus();
  });
}

/* =========================
   Current Year
========================= */

if (currentYear) {
  currentYear.textContent = String(
    new Date().getFullYear()
  );
}

/* =========================
   Active Navigation Link
========================= */

const navigationLinks = Array.from(
  document.querySelectorAll(
    '.site-nav a[href^="#"]:not(.nav-cta)'
  )
);

const navigationSections = navigationLinks
  .map((link) => {
    const id = link.getAttribute("href");

    if (!id) {
      return null;
    }

    return document.querySelector(id);
  })
  .filter(Boolean);

if (
  navigationLinks.length > 0 &&
  navigationSections.length > 0 &&
  "IntersectionObserver" in window
) {
  const navigationObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio -
            a.intersectionRatio
        );

      if (visibleEntries.length === 0) {
        return;
      }

      const activeId =
        `#${visibleEntries[0].target.id}`;

      navigationLinks.forEach((link) => {
        const isActive =
          link.getAttribute("href") === activeId;

        link.classList.toggle(
          "is-current",
          isActive
        );

        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      threshold: [0.2, 0.45, 0.7],
      rootMargin: "-25% 0px -55% 0px",
    }
  );

  navigationSections.forEach((section) => {
    navigationObserver.observe(section);
  });
}