import { initHeader } from "./header.js";
import { loadPartials } from "./partials.js";
import { initLoginModal } from "./login-modal.js";

// assets/js/faq.js
document.addEventListener("DOMContentLoaded", async () => {
  // Load partials first
  await loadPartials();

  // Then initialize header
  await initHeader();

  // Load login-modal
  await initLoginModal();

  // Scripts for FAQ
  const initFaq = () => {
    const faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return false;

    faqItems.forEach((item, index) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!question || !answer) return;

      // Generate a unique ID if missing
      if (!answer.id) answer.id = `faq-answer-${index + 1}`;

      // Set ARIA attributes (for accessibility)
      question.setAttribute("aria-expanded", "false");
      question.setAttribute("aria-controls", answer.id);
      answer.setAttribute("role", "region");
      answer.setAttribute(
        "aria-labelledby",
        question.id || `faq-question-${index + 1}`
      );
      answer.hidden = true;

      // Prevent duplicate listeners
      if (!question._faqBound) {
        question.addEventListener("click", () => {
          const isExpanded = question.getAttribute("aria-expanded") === "true";
          question.setAttribute("aria-expanded", String(!isExpanded));
          item.classList.toggle("active");
          answer.hidden = isExpanded; // toggle visibility based on state
        });

        question._faqBound = true;
      }
    });

    return true;
  };

  // Try immediately (in case FAQ is inline, not loaded)
  if (!initFaq()) {
    // MutationObserver fallback (waits for partials.js to inject FAQ)
    const observer = new MutationObserver(() => {
      if (initFaq()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
});
