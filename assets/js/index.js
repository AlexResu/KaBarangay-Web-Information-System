// main.js
import { initHeader } from "./header.js";
import { loadPartials } from "./partials.js";
import { initLoginModal } from "./login-modal.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Load partials first
  await loadPartials();

  // Then initialize header
  await initHeader();

  // Load login-modal
  await initLoginModal();

  // For index page other js scripts
});
