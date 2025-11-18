import { loadPartials } from "../partials.js";
import { protectPage, initLogout } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const base = window.location.pathname.includes("kabarangay-website")
    ? "/kabarangay-website"
    : "";

  if (!protectPage()) return;

  // 2. Load reusable UI parts
  await loadPartials();

  // 3. Initialize logout button
  await initLogout();
  let officialsData = []; // Store loaded data for reuse
  let editingIndex = null; // Track the index of the official being edited
  const formTitle = document.querySelector(".form-container h3");
  const submitButton = document.querySelector(
    '#add-official-form button[type="submit"]'
  );

  // Load JSON and generate cards

  const storedData = sessionStorage.getItem("officials");
  if (!storedData) {
    fetch(`${base}/data/officials.json`)
      .then((response) => response.json())
      .then((data) => {
        officialsData = data.officials;
        renderOfficials();
      })
      .catch((error) => console.error("Error loading officials.json:", error));
  } else {
    officialsData = JSON.parse(storedData);
    renderOfficials();
  }

  // Function to render all officials
  function renderOfficials() {
    const container = document.getElementById("officials-container");
    container.innerHTML = ""; // Clear previous content

    sessionStorage.setItem("officials", JSON.stringify(officialsData));
    officialsData.forEach((official, index) => {
      const card = document.createElement("div");
      card.className = "card mb-4";
      card.setAttribute("data-index", index);

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const row = document.createElement("div");
      row.className = "row";

      // Left Column
      const leftCol = document.createElement("div");
      leftCol.className = "col-md-6";
      leftCol.innerHTML = `
      <h5 class="card-title font-weight-bold">${official.name}</h5>
      <p class="card-text mb-1">${official.position}</p>
      <p class="card-text mb-1">${official.contact_number}</p>
      <p class="card-text mb-1">${official.email}</p>
      <p class="card-text">${official.location}</p>
    `;

      // Right Column
      const rightCol = document.createElement("div");
      rightCol.className =
        "col-md-6 d-flex flex-column justify-content-between";

      const responsibilities = document.createElement("div");
      responsibilities.innerHTML = `
      <h6 class="font-weight-bold">Key Responsibilities:</h6>
      <ul class="mb-3">
        ${official.key_responsibility.map((res) => `<li>${res}</li>`).join("")}
      </ul>
    `;

      const buttonGroup = document.createElement("div");
      buttonGroup.className = "text-right mt-auto";
      buttonGroup.innerHTML = `
      <button class="btn btn-sm btn-primary mr-2 edit-btn">Edit</button>
      <button class="btn btn-sm btn-danger delete-btn">Delete</button>
    `;

      // Button event listeners
      buttonGroup.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm(`Delete ${official.name}?`)) {
          officialsData.splice(index, 1); // Remove from data array
          renderOfficials(); // Re-render
        }
      });

      buttonGroup.querySelector(".edit-btn").addEventListener("click", () => {
        editingIndex = index;
        fillFormWithOfficial(official);
      });

      rightCol.appendChild(responsibilities);
      rightCol.appendChild(buttonGroup);

      row.appendChild(leftCol);
      row.appendChild(rightCol);
      cardBody.appendChild(row);
      card.appendChild(cardBody);
      container.appendChild(card);
    });
  }

  // Function to fill form with existing official data
  function fillFormWithOfficial(official) {
    document.getElementById("full_name").value = official.name;
    document.getElementById("position").value = official.position;
    document.getElementById("contact_number").value = official.contact_number;
    document.getElementById("email").value = official.email;
    document.getElementById("office_address").value = official.location;
    document.getElementById("responsibilities").value =
      official.key_responsibility.join(", ");

    formTitle.textContent = "✏️ Edit Barangay Official";
    submitButton.textContent = "Update";
    document
      .getElementById("add-official-form")
      .scrollIntoView({ behavior: "smooth" });
  }

  // Handle form submission (update or add)
  document
    .getElementById("add-official-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const newOfficial = {
        name: document.getElementById("full_name").value,
        position: document.getElementById("position").value,
        contact_number: document.getElementById("contact_number").value,
        email: document.getElementById("email").value,
        location: document.getElementById("office_address").value,
        key_responsibility: document
          .getElementById("responsibilities")
          .value.split(",")
          .map((s) => s.trim()),
      };

      if (editingIndex !== null) {
        // Update
        officialsData[editingIndex] = newOfficial;
        editingIndex = null;
      } else {
        // Add new
        officialsData.push(newOfficial);
      }

      // Reset form
      this.reset();
      formTitle.textContent = "➕ Add New Barangay Official";
      submitButton.textContent = "Add";
      renderOfficials();
    });
});
