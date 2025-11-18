// partials.js
// ==========================================
// Dynamically loads HTML partials into elements
// using the "data-include" attribute.
// Example usage in HTML:
// <div data-include="partials/header.html"></div>
// ==========================================

export const loadPartials = () => {
  // --- Select all elements that have the data-include attribute ---
  const includeElements = document.querySelectorAll("[data-include]");
  const promises = []; // Stores all fetch promises for async loading

  // --- Loop through each element and load its corresponding file ---
  includeElements.forEach((el) => {
    const file = el.getAttribute("data-include");

    // --- Fetch the partial HTML file ---
    const promise = fetch(file)
      .then((res) => {
        // Validate the response
        if (!res.ok) throw new Error(`Could not fetch ${file}`);
        return res.text(); // Convert response to text
      })
      .then((data) => {
        // --- Replace the placeholder element with the fetched HTML ---
        el.outerHTML = data;
      })
      .catch((err) => {
        // --- Handle fetch or rendering errors gracefully ---
        console.error("Error loading partial:", err);
        el.outerHTML = `<p style="color:red;">Error loading content.</p>`;
      });
    // --- Add this fetch operation to the list of promises ---
    promises.push(promise);
  });

  // --- Wait for all partials to finish loading ---
  return Promise.all(promises).then(() => {
    // Dispatch a custom event once all partials are successfully inserted
    document.dispatchEvent(new CustomEvent("partialsLoaded"));
    console.log("All partials loaded successfully.");
  });
};
