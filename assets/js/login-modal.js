// modal-login.js
// ===============================
// Initializes the Staff Login Modal logic
// Handles opening, closing, and login validation
// ===============================
export const initLoginModal = () => {
  console.log("Initializing login modal...");

  // --- Select modal-related elements from the DOM ---
  const loginModal = document.getElementById("loginModal");
  const openModalBtn = document.getElementById("staffLoginBtn");
  const closeModalBtn = document.getElementById("closeModal");
  const overlay = loginModal
    ? loginModal.querySelector(".modal__overlay")
    : null;
  const loginForm = document.getElementById("loginFormModal");
  const errorMsg = document.getElementById("loginError");

  // --- Safety check: Skip initialization if modal elements are missing ---
  if (!loginModal || !openModalBtn) {
    console.warn(
      "Login modal elements not found. Skipping modal initialization."
    );
    return;
  }

  // --- Open Modal ---
  // Triggered when the "Staff Login" button is clicked
  openModalBtn.addEventListener("click", () => {
    console.log("Opening login modal...");
    loginModal.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  // --- Close Modal ---
  // Closes modal when clicking the close button or overlay
  const closeElements = [closeModalBtn, overlay].filter(Boolean);
  closeElements.forEach((el) => {
    el.addEventListener("click", () => {
      loginModal.classList.remove("show");
      document.body.style.overflow = "";
      if (errorMsg) errorMsg.style.display = "none";
    });
  });

  // --- Login Form Validation ---
  // Basic hardcoded validation for demo purposes
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get entered credentials
      const username = document.getElementById("modalUsername").value.trim();
      const password = document.getElementById("modalPassword").value.trim();

      // --- Authentication Logic (Temporary Demo Credentials) ---
      if (username === "admin" && password === "1234") {
        // SUCCESS: Save login session and redirect to dashboard
        sessionStorage.setItem("loginTime", new Date().toISOString());
        sessionStorage.setItem("isLoggedIn", "true");
        window.location.href = "admin-dashboard.html";
      } else {
        // FAILURE: Show alert and inline error message
        alert("Invalid username or password.");
        if (errorMsg) {
          errorMsg.textContent = "Invalid username or password.";
          errorMsg.style.display = "block";
        }
      }
    });
  }

  console.log("Login modal initialized successfully.");
};
