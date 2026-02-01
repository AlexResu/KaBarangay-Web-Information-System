# Kabarangay Web Information System

A static website providing barangay-level services and community information. Residents can view announcements, access a directory of local officials, submit service requests, and track requests.

## Features

- News and announcements
- Directory of barangay officials
- Service request and tracking forms
- Frequently asked questions
- Admin dashboard and sections for administrative management

## Project Structure

- `index.html`: Homepage and main entry point
- `announcements.html`: Barangay news and updates
- `directory.html`: Directory of officials
- `services.html`: Overview of available services
- `contact.html`: Barangay contact information
- `faq.html`: Frequently asked questions
- `track-request.html`: Track your service requests
- `document-request.html`: Submit document requests
- `home.html`: Main content landing page
- `admin-header.html`: Header for admin pages
- **Admin sections:**
  - `admin-dashboard.html`: Admin dashboard for announcement management
  - `admin-documents.html`: Admin interface for handling documents
  - `admin-officials.html`: Admin management for barangay officials
- `assets/css/`: Modular CSS files for styling each section
- `assets/js/`: JavaScript for dynamic content and loading partials
- `data/`: Static JSON files for announcements and officials
- `partials/`: Reusable HTML snippets (header, footer, request form, etc.)

## Setup Instructions

1. **Clone the repository:**
git clone https://github.com/charlespogi123-cyber/kabarangay-website.git

2. **Recommended:** Use the VS Code Live Server Extension  
- Open the project folder in VS Code  
- Right-click `index.html` and select “Open with Live Server”
- Or, open HTML files directly in your browser

## Bootstrap via CDN

This project uses Bootstrap for responsive design by loading CSS and JS files from a Content Delivery Network (CDN). This ensures faster load times and always up-to-date files, without the need to store Bootstrap assets locally.

## Developer Documentation

### Workflow & Collaboration

- **Branching:**  
  Create a new branch for each feature or bugfix (e.g., `feature/admin-dashboard`, `bugfix/request-tracking`).

- **Commits:**  
  Use clear and descriptive commit messages referencing what was changed.

- **Pull Requests:**  
  Open a pull request for each new feature or fix. Assign teammates for code review.

- **Testing:**  
  Test all new and changed functionality in both user and admin sections before merging.

- **Code Style:**  
  Keep HTML, CSS, and JS modular and organized. Use comments in code for complex logic. Place shared elements in `partials/` for reusability.

### Editing Content and Admin Pages

- To update announcements or officials, edit the relevant JSON in `data/`.
- Modify admin layouts in their respective `admin-*` HTML files.
- For reusable navigation, footer, or forms, update the related partial in `partials/` and verify JavaScript loads them correctly.
- Always check your changes in the browser before submitting or merging.

### Notes for Future Developers

- Consistently use Bootstrap classes for layout and interface elements.
- Structure JavaScript in small, maintainable functions with meaningful names.
- Keep CDN links up-to-date with the latest Bootstrap version as needed.
- Refer to this README for onboarding, workflow steps, and project file structure.
