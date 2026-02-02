const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll(".nav-links a");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");
const revealTargets = document.querySelectorAll("[data-reveal]");
const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const toast = document.querySelector("#toast");
const form = document.querySelector("#contact-form");
const successMessage = document.querySelector(".form-success");
const copyButton = document.querySelector("#copy-email");
const contactEmail = document.querySelector("#contact-email");

const projectDetails = {
  nova: {
    title: "Nova Legal",
    description:
      "Kompletní redesign s důrazem na důvěryhodnost. Struktura obsahu zkrátila cestu k poptávce a zvýšila konverze o 46 %.",
  },
  urban: {
    title: "Urban Fitness",
    description:
      "Landing page postavená pro PPC kampaně. Jasné benefity, přehledné členství a jednoduché CTA vedly k dvojnásobné konverzi.",
  },
  green: {
    title: "GreenGrid",
    description:
      "B2B web pro energetiku s důrazem na odborný obsah a SEO. Lepší struktura přinesla vyšší organickou návštěvnost.",
  },
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((target) => observer.observe(target));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach((section) => sectionObserver.observe(section));

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const openModal = (projectKey) => {
  const data = projectDetails[projectKey];
  if (!data) return;
  modalTitle.textContent = data.title;
  modalDescription.textContent = data.description;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  const focusable = modal.querySelectorAll("button, [href]");
  if (focusable.length) {
    focusable[0].focus();
  }
};

const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

const trapFocus = (event) => {
  if (!modal.classList.contains("open")) return;
  const focusable = modal.querySelectorAll("button, [href]");
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.key === "Tab") {
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
};

const modalTriggers = document.querySelectorAll("[data-modal-trigger]");
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openModal(trigger.dataset.project));
});

modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-modal-close]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
  trapFocus(event);
});

const accordion = document.querySelector("[data-accordion]");
accordion.addEventListener("click", (event) => {
  const trigger = event.target.closest(".accordion-trigger");
  if (!trigger) return;
  const item = trigger.parentElement;
  const isOpen = item.classList.contains("open");
  accordion.querySelectorAll(".accordion-item").forEach((panel) => {
    panel.classList.remove("open");
    panel.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
    panel.querySelector(".accordion-panel").setAttribute("aria-hidden", "true");
  });
  if (!isOpen) {
    item.classList.add("open");
    trigger.setAttribute("aria-expanded", "true");
    item.querySelector(".accordion-panel").setAttribute("aria-hidden", "false");
  }
});

const validateField = (field) => {
  const errorEl = document.querySelector(`[data-error-for="${field.name}"]`);
  if (!field.checkValidity()) {
    const message = field.value.trim() === "" ? "Vyplňte prosím toto pole." : "Zadejte platnou hodnotu.";
    errorEl.textContent = message;
    field.setAttribute("aria-invalid", "true");
    return false;
  }
  errorEl.textContent = "";
  field.removeAttribute("aria-invalid");
  return true;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = Array.from(form.querySelectorAll("input, select, textarea"));
  const valid = fields.every(validateField);
  if (!valid) return;
  successMessage.textContent = "Odesíláme...";
  setTimeout(() => {
    form.reset();
    successMessage.textContent = "Děkujeme! Ozveme se do 24 hodin.";
    showToast("Poptávka byla odeslána.");
  }, 800);
});

form.addEventListener("input", (event) => {
  if (event.target.matches("input, select, textarea")) {
    validateField(event.target);
  }
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(contactEmail.textContent.trim());
    showToast("Email zkopírován do schránky.");
  } catch (error) {
    showToast("Nepodařilo se zkopírovat email.");
  }
});
