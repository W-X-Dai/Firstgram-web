const form = document.querySelector("#waitlist-form");
const nameInput = document.querySelector("#name");
const nameError = document.querySelector("#name-error");
const emailInput = document.querySelector("#email");
const emailError = document.querySelector("#email-error");
const successState = document.querySelector("#success-state");
const resetButton = document.querySelector("#reset-form");
const heroMedia = document.querySelector(".hero-media");
const cameraCoach = document.querySelector("#camera-coach");
const cameraCoachText = document.querySelector("#camera-coach-text");
const guideDemo = document.querySelector("#guide-demo");
const guideStatus = document.querySelector("#guide-status");
const guideSteps = [...document.querySelectorAll("[data-guide-step]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const cameraHints = ["向左一步", "鏡頭抬高一點", "構圖完成，可以拍了"];
const guideStates = {
  background: "背景已鎖定",
  person: "人物位置已找到",
  final: "構圖完成，可以拍了",
};

cameraCoach.addEventListener("click", () => {
  const nextStep = (Number(heroMedia.dataset.hintStep) + 1) % cameraHints.length;
  heroMedia.dataset.hintStep = String(nextStep);
  cameraCoachText.textContent = cameraHints[nextStep];
});

if (window.matchMedia("(pointer: fine)").matches && !reducedMotion.matches) {
  heroMedia.addEventListener("pointermove", (event) => {
    const bounds = heroMedia.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroMedia.style.setProperty("--focus-x", `${x * 0.7}rem`);
    heroMedia.style.setProperty("--focus-y", `${y * 0.7}rem`);
  });

  heroMedia.addEventListener("pointerleave", () => {
    heroMedia.style.removeProperty("--focus-x");
    heroMedia.style.removeProperty("--focus-y");
  });
}

guideSteps.forEach((step) => {
  step.addEventListener("click", () => {
    const state = step.dataset.guideStep;

    guideDemo.dataset.guideState = state;
    guideStatus.textContent = guideStates[state];
    guideSteps.forEach((item) => {
      const isActive = item === step;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
  });
});

const revealTargets = document.querySelectorAll(
  ".section > h2, .feature-item, .guide-copy, .guide-demo, .waitlist-heading, .form-shell",
);

revealTargets.forEach((target) => target.classList.add("reveal-target"));

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 },
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

function validateName() {
  const message = nameInput.value.trim() ? "" : "請輸入姓名。";

  nameInput.setAttribute("aria-invalid", String(Boolean(message)));
  nameError.textContent = message;
  return !message;
}

function validateEmail() {
  const value = emailInput.value.trim();
  let message = "";

  if (!value) {
    message = "請輸入 Email。";
  } else if (!emailInput.validity.valid) {
    message = "請輸入有效的 Email 格式。";
  }

  emailInput.setAttribute("aria-invalid", String(Boolean(message)));
  emailError.textContent = message;
  return !message;
}

nameInput.addEventListener("blur", validateName);
nameInput.addEventListener("input", () => {
  if (nameInput.getAttribute("aria-invalid") === "true") {
    validateName();
  }
});

emailInput.addEventListener("blur", validateEmail);
emailInput.addEventListener("input", () => {
  if (emailInput.getAttribute("aria-invalid") === "true") {
    validateEmail();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();

  if (!isNameValid || !isEmailValid) {
    (isNameValid ? emailInput : nameInput).focus();
    return;
  }

  form.hidden = true;
  successState.hidden = false;
  successState.focus();
});

resetButton.addEventListener("click", () => {
  form.reset();
  nameError.textContent = "";
  emailError.textContent = "";
  nameInput.removeAttribute("aria-invalid");
  emailInput.removeAttribute("aria-invalid");
  successState.hidden = true;
  form.hidden = false;
  nameInput.focus();
});
