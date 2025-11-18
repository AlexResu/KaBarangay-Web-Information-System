/**
 * ==============================================================
 *  ADMIN ANNOUNCEMENTS DASHBOARD SCRIPT
 * ---------------------------------------------------------------
 *  Handles CRUD operations for announcements (Add, Edit, Delete, Hide)
 *  within the KaBarangay Admin Dashboard.
 *
 *  Features:
 *  - Dynamic rendering of announcements
 *  - Edit and delete capabilities
 *  - Hide/Unhide functionality
 *  - Session persistence using sessionStorage
 *  - Data fetching from a local JSON file (for initial load)
 *  - Modular imports for authentication and reusable partials
 * ==============================================================
 */
import { loadPartials } from "../partials.js"; // Reusable UI components (header, footer, etc.)
import { protectPage, initLogout } from "./auth.js"; // Authentication and logout utilities

// Wait until all DOM elements are fully loaded before executing
document.addEventListener("DOMContentLoaded", async () => {
  // ==============================================================
  // BASE PATH DETECTION
  // ---------------------------------------------------------------
  // Automatically detects whether the current path includes "kabarangay-website"
  // This is useful for relative paths when hosting in subdirectories.
  // ==============================================================
  const base = window.location.pathname.includes("kabarangay-website")
    ? "/kabarangay-website"
    : "";

  // ==============================================================
  // PAGE PROTECTION
  // ---------------------------------------------------------------
  // Prevents unauthorized users from accessing this admin page.
  // If protectPage() returns false, stop further script execution.
  // ==============================================================
  if (!protectPage()) return;

  // ==============================================================
  // LOAD REUSABLE PARTIALS
  // ---------------------------------------------------------------
  // Loads the shared UI elements (like header, footer, modals, etc.)
  // from external HTML partials for code modularity.
  // ==============================================================
  await loadPartials();

  // ==============================================================
  // INITIALIZE LOGOUT FUNCTIONALITY
  // ---------------------------------------------------------------
  // Enables the logout button to clear session data and redirect user.
  // ==============================================================
  await initLogout();

  // ==============================================================
  // GLOBAL VARIABLES
  // ---------------------------------------------------------------
  // announcementsData: stores all announcements
  // isEditMode: indicates if form is currently editing an existing entry
  // currentEditIndex: holds index of the announcement being edited
  // priorityOrder: defines sorting order for high → low
  // ==============================================================
  let announcementsData = [];
  let isEditMode = false;
  let currentEditIndex = null;

  const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1,
  };

  // ==============================================================
  // DOM ELEMENTS REFERENCES
  // ---------------------------------------------------------------
  // form: Add/Edit announcement form
  // formHeader: Heading text inside the form (changes between Add/Edit mode)
  // submitBtn: Button label that switches dynamically based on mode
  // ==============================================================
  const form = document.getElementById("add-announcement-form");
  const formHeader = document.querySelector(".form-container h3");
  const submitBtn = form.querySelector(".add-btn");

  // ==============================================================
  // FORM SUBMISSION HANDLER
  // ---------------------------------------------------------------
  // Handles both "Add" and "Edit" functionality.
  // Validates inputs, updates announcementsData, resets form, and re-renders.
  // ==============================================================
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get input values
      const titleInput = form.querySelector("#title");
      const contentInput = form.querySelector("#content");
      const prioritySelect = form.querySelector("#priority");

      // Create new announcement object
      const newAnnouncement = {
        title: titleInput.value.trim(),
        description: contentInput.value.trim(),
        priority: prioritySelect.value.toLowerCase(),
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        is_hidden: false, // Default: visible
      };

      // Validation: Ensure all required fields are filled
      if (!newAnnouncement.title || !newAnnouncement.description) {
        alert("Please fill in all required fields.");
        return;
      }

      // EDIT MODE: Update existing announcement
      if (isEditMode && currentEditIndex !== null) {
        // Update existing announcement
        const existing = announcementsData[currentEditIndex];
        newAnnouncement.is_hidden = existing.is_hidden; // retain hidden state
        announcementsData[currentEditIndex] = newAnnouncement;
      } else {
        // ADD MODE: Append new announcement to the array
        announcementsData.push(newAnnouncement);
      }

      // Reset form and state
      titleInput.value = "";
      contentInput.value = "";
      prioritySelect.value = "medium";

      isEditMode = false;
      currentEditIndex = null;

      formHeader.textContent = "➕ Add New Announcement";
      submitBtn.textContent = "+ Add";

      renderAnnouncements();
    });
  }

  // ==============================================================
  // ANNOUNCEMENT LIST CONTAINER
  // ---------------------------------------------------------------
  // All announcement cards will be dynamically rendered inside this container.
  // ==============================================================
  const container = document.getElementById("announcement-list");

  // ==============================================================
  // RENDER FUNCTION
  // ---------------------------------------------------------------
  // Clears and re-renders the announcement list.
  // Sorts announcements by date (newest first), then by priority.
  // Updates sessionStorage for persistence between reloads.
  // ==============================================================
  function renderAnnouncements() {
    container.innerHTML = "";

    // Sort by date, then by priority
    const sortedAnnouncements = announcementsData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;

      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Save current data state to sessionStorage
    sessionStorage.setItem(
      "sortedAnnouncements",
      JSON.stringify(sortedAnnouncements)
    );

    // Generate a card for each announcement
    sortedAnnouncements.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "announcement-card";

      // Add 'hidden' class for visually hidden announcements
      if (item.is_hidden) {
        card.classList.add("hidden");
      }

      // Card HTML structure
      card.innerHTML = `
        <h4>${item.title}</h4>
        <div class="meta">
          <span class="tag ${item.priority}">${item.priority}</span>
          <span class="date">📅 ${new Date(
            item.date
          ).toLocaleDateString()}</span>
        </div>
        <p>${item.description}</p>
        <div class="actions">
          <button class="btn view">👁 ${
            item.is_hidden ? "Unhide" : "Hide"
          }</button>
          <button class="btn edit">✏️ Edit</button>
          <button class="btn delete">🗑 Delete</button>
        </div>
      `;

      // Toggle hide
      card.querySelector(".btn.view").addEventListener("click", () => {
        item.is_hidden = !item.is_hidden;
        renderAnnouncements();
      });

      // Delete
      card.querySelector(".btn.delete").addEventListener("click", () => {
        if (confirm(`Delete ${item.title}?`)) {
          announcementsData.splice(index, 1); // Remove from data array
          renderAnnouncements(); // Re-render
        }
      });

      // Edit
      card.querySelector(".btn.edit").addEventListener("click", () => {
        isEditMode = true;
        currentEditIndex = index;

        // Populate form with existing data
        form.querySelector("#title").value = item.title;
        form.querySelector("#content").value = item.description;
        form.querySelector("#priority").value = item.priority;

        // Update UI
        formHeader.textContent = "✏️ Edit Announcement";
        submitBtn.textContent = "Update";

        // Smooth scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      // Append card to container
      container.appendChild(card);
    });
  }

  // ==============================================================
  // INITIAL DATA LOAD
  // ---------------------------------------------------------------
  // 1. Checks if announcements are already stored in sessionStorage
  //    (keeps user’s data after refresh)
  // 2. If not found, fetches from local JSON file (/data/announcements.json)
  // ==============================================================
  const storedData = sessionStorage.getItem("sortedAnnouncements");
  if (!storedData) {
    fetch(`${base}/data/announcements.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load announcement data");
        }
        return response.json();
      })
      .then((announcements) => {
        announcementsData = announcements.data;
        renderAnnouncements();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    // Load announcements from sessionStorage
    announcementsData = JSON.parse(storedData);
    renderAnnouncements();
  }
});
