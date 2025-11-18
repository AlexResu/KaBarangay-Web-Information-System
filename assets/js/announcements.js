import { initHeader } from "./header.js";
import { loadPartials } from "./partials.js";
import { initLoginModal } from "./login-modal.js";

// Run the script once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ Load reusable page sections (partials) first to ensure consistent UI structure
  await loadPartials();

  // 2️⃣ Initialize the header AFTER partials are loaded
  await initHeader();

  // 3️⃣ Initialize the login modal AFTER header setup
  await initLoginModal();

  // ------------------------------------------------------------
  // 🔽 ANNOUNCEMENTS LOGIC STARTS HERE
  // ------------------------------------------------------------

  // Determine base URL (adjusted for GitHub Pages or local file paths)
  const base = window.location.pathname.includes("kabarangay-website")
    ? "/kabarangay-website"
    : "";

  // Initialize announcement list
  let announcementList = [];

  // Check if announcements are already stored in sessionStorage
  const storedData = sessionStorage.getItem("sortedAnnouncements");
  if (!storedData) {
    // 🔹 Fetch announcements data from JSON file if not in sessionStorage
    fetch(`${base}/data/announcements.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load announcement data");
        }
        return response.json();
      })
      .then((announcements) => {
        announcementList = announcements.data;
        renderAnnouncements();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    // 🔹 If data already exists in sessionStorage, use it directly
    announcementList = JSON.parse(storedData);
    renderAnnouncements();
  }

  /**
   * Function: Render Announcements
   * Loops through visible announcements and dynamically generates DOM elements
   */
  function renderAnnouncements() {
    // Find the container where announcements will appear
    const container = document.getElementById("announcement-list");
    announcementList
      .filter((announcement) => !announcement.is_hidden)
      .forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("announcement-item");
        div.innerHTML = `
          <h3>${item.title}</h3>
          <span class="announcement-date">Date: ${item.date}</span>
          <p>${item.description}</p>
        `;
        // Append to main container
        container.appendChild(div);
      });
  }
});
