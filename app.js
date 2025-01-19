document.addEventListener("DOMContentLoaded", function () {
    // Select the placeholder element
    const navbarPlaceholder = document.getElementById("navbar");

    // Load the navbar HTML
    fetch("navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch navbar");
            }
            return response.text();
        })
        .then(data => {
            // Insert the fetched navbar into the placeholder
            navbarPlaceholder.innerHTML = data;

            // Now that the navbar is loaded, select the toggle button and menu
            const toggleButton = document.querySelector(".navbar__toggle");
            const menu = document.querySelector(".navbar__menu");

            // Add the event listener for the toggle button
            toggleButton.addEventListener("click", () => {
                menu.classList.toggle("active");
            });
        })
        .catch(error => console.error("Error loading navbar:", error));
});
