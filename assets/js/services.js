// services.js
// ==========================================================
// Handles document request form submission logic
// - Loads partial HTML files (header, footer, etc.)
// - Initializes header navigation and login modal
// - Manages document request creation, ID generation, and
//   storage using sessionStorage
// ==========================================================
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

  // Determine base URL (adjusted for GitHub Pages or local file paths)
  const base = window.location.pathname.includes("kabarangay-website")
    ? "/kabarangay-website"
    : "";

  // Other scripts for services page
  const form = document.querySelector(".document-request__form");
  const requiredFields = form.querySelectorAll("[required]");
  const errorMsg = form.querySelectorAll(".error-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.forEach((msg) => msg.remove());

    let isValid = true;

    requiredFields.forEach((field) => {
      const fieldContainer =
        field.closest(".document-request__field") || field.parentElement;
      // Remove previous error styling

      field.classList.remove("input-error");
      // Remove any leftover error message (just in case)
      const oldError = fieldContainer.querySelector(".error-message");

      if (oldError) oldError.remove();
      if (!field.value.trim()) {
        field.classList.add("input-error");

        isValid = false;
        const errorMsg = document.createElement("small");
        errorMsg.className = "error-message text-danger";
        errorMsg.textContent = "This field is required";
        fieldContainer.appendChild(errorMsg);
      } else {
        field.classList.remove("input-error");
      }
    });

    if (!isValid) {
      alert("Please fill out all required fields before submitting.");
      const firstError = form.querySelector(".input-error");

      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return;
    }

    // Load existing documents from sessionStorage or start with empty array
    let documents = [];

    const storedData = sessionStorage.getItem("documents");
    if (!storedData) {
      try {
        const response = await fetch(`${base}/data/document-request.json`);
        const data = await response.json();
        documents = data.documents;
      } catch (err) {
        console.error("Failed to load request.json:", err);
        cardContainer.innerHTML =
          "<p class='text-danger'>Error loading request data.</p>";
        return; // Stop execution if fetch failed
      }
    } else {
      documents = JSON.parse(storedData);
    }

    // Helper function to generate request ID like BL2025-001, BL2025-002...
    function generateRequestId() {
      const year = new Date().getFullYear();
      const prefix = "BL" + year;
      // Find max number used so far
      let maxNumber = 0;
      documents.forEach((req) => {
        if (req.request_id && req.request_id.startsWith(prefix)) {
          const num = parseInt(req.request_id.slice(prefix.length + 1));
          if (num > maxNumber) maxNumber = num;
        }
      });
      return prefix + "-" + String(maxNumber + 1).padStart(3, "0");
    }

    // Collect form values
    const form = e.target;
    const applicantName = form.fullName.value.trim();
    const contact = form.contactNumber.value.trim();
    const email = form.email.value.trim();
    const documentType = form.documentType.value;
    const purpose = form.purpose.value;
    const today = new Date();

    // Format dates as YYYY-MM-DD (ISO-like)
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    const dateRequested = formatDate(today);
    const expectedCompletion = formatDate(
      new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)
    ); // +5 days

    // Build timeline steps
    const timeline = [
      { step: "Request Submitted", date: dateRequested, status: "Completed" },
      { step: "Initial Review", date: null, status: "Pending" },
      { step: "Document Verification", date: null, status: "Pending" },
      { step: "Final Approval", date: null, status: "Pending" },
      { step: "Ready for Pickup", date: null, status: "Pending" },
    ];

    // New request object
    const newRequest = {
      request_id: generateRequestId(),
      status: "Pending",
      document: documentType,
      applicant: {
        name: applicantName,
        contact: contact,
        email: email,
      },
      purpose: purpose,
      date_requested: dateRequested,
      expected_completion: expectedCompletion,
      timeline: timeline,
    };

    // Add new request and save back to sessionStorage
    documents.push(newRequest);
    sessionStorage.setItem("documents", JSON.stringify(documents));

    alert("Your document request has been submitted!");

    // Optionally reset the form
    form.reset();
  });

  // remove red border on input once user types
  form.addEventListener("input", (e) => {
    const field = e.target;
    if (field.required && field.value.trim() !== "") {
      field.classList.remove("input-error");
      const msg = field
        .closest(".document-request__field")
        ?.querySelector(".error-message");
      if (msg) {
        msg.remove();
      }
    }
  });
});
