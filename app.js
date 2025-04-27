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
})

// Create hover image element for services
const serviceHoverImage = document.createElement('div');
serviceHoverImage.className = 'service-hover-image';
document.body.appendChild(serviceHoverImage);

// Track current image index for each service
const serviceImageIndices = {};

// Add hover and wheel functionality to service cards
document.querySelectorAll('.service-card__title').forEach(title => {
    const images = title.dataset.images ? title.dataset.images.split(',') : [];
    const serviceId = title.textContent.trim();
    serviceImageIndices[serviceId] = 0;

    // Mouse enter handler
    title.addEventListener('mouseenter', (e) => {
        if (images.length > 0) {
            serviceHoverImage.style.display = 'block';
            serviceHoverImage.innerHTML = `
                <img src="${images[0]}" alt="${title.textContent}">
                <div class="image-counter">1/${images.length}</div>
            `;
            positionHoverImage(e, serviceHoverImage);
        }
    });

    // Mouse move handler
    title.addEventListener('mousemove', (e) => {
        positionHoverImage(e, serviceHoverImage);
    });

    // Mouse leave handler
    title.addEventListener('mouseleave', () => {
        serviceHoverImage.style.display = 'none';
    });

    // Mouse wheel handler
    title.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (images.length > 1) {
            const serviceId = title.textContent.trim();
            const delta = Math.sign(e.deltaY);
            
            // Update image index
            serviceImageIndices[serviceId] += delta;
            
            // Wrap around if needed
            if (serviceImageIndices[serviceId] >= images.length) {
                serviceImageIndices[serviceId] = 0;
            } else if (serviceImageIndices[serviceId] < 0) {
                serviceImageIndices[serviceId] = images.length - 1;
            }
            
            // Update displayed image
            serviceHoverImage.innerHTML = `
                <img src="${images[serviceImageIndices[serviceId]]}" alt="${title.textContent}">
                <div class="image-counter">${serviceImageIndices[serviceId] + 1}/${images.length}</div>
            `;
        }
    });
});

// Position the hover image relative to mouse
function positionHoverImage(event, element) {
    element.style.left = `${event.pageX + 20}px`;
    element.style.top = `${event.pageY + 20}px`;
}

// Initialize service area map if element exists
if (document.getElementById('service-map')) {
    initMap();
}

// Create hover image element
const hoverImage = document.createElement('img');
hoverImage.className = 'hover-image';
document.body.appendChild(hoverImage);

// Add hover and click functionality to all h3 elements
document.querySelectorAll('.service h3').forEach(h3 => {
    // Click handler
    h3.addEventListener('click', () => {
        // Add your click action here (e.g., navigate to service page)
        alert(`Redirecting to ${h3.textContent} service page`);
    });

    // Hover handlers
    h3.addEventListener('mouseover', (e) => {
        const imgUrl = h3.dataset.hoverImage;
        if (imgUrl) {
            hoverImage.src = imgUrl;
            hoverImage.style.display = 'block';
        }
    });

    h3.addEventListener('mousemove', (e) => {
        hoverImage.style.left = `${e.pageX + 15}px`;
        hoverImage.style.top = `${e.pageY + 15}px`;
    });

    h3.addEventListener('mouseout', () => {
        hoverImage.style.display = 'none';
    });
});

// Initialize Leaflet map
function initMap() {
    // Set the map view to center on the Inland Empire area
    const map = L.map('service-map').setView([33.8, -117.3], 9);
    
    // Add the tile layer (map background)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add service area markers with coordinates for all cities
    const cities = [
        { name: "Riverside", coords: [33.9806, -117.3755] },
        { name: "San Bernardino", coords: [34.1083, -117.2898] },
        { name: "Corona", coords: [33.8753, -117.5664] },
        { name: "Moreno Valley", coords: [33.9375, -117.2306] },
        { name: "Redlands", coords: [34.0556, -117.1825] },
        { name: "Fontana", coords: [34.0922, -117.4350] },
        { name: "Rancho Cucamonga", coords: [34.1064, -117.5931] },
        { name: "Ontario", coords: [34.0633, -117.6509] },
        { name: "Temecula", coords: [33.4936, -117.1484] },
        { name: "Winchester", coords: [33.7069, -117.0845] },
        { name: "Murrieta", coords: [33.5719, -117.1906] },
        { name: "Beaumont", coords: [33.9295, -116.9773] },
        { name: "Menifee", coords: [33.6974, -117.1763] }
    ];
    
    // Add markers for each city
    cities.forEach(city => {
        L.marker(city.coords)
            .addTo(map)
            .bindPopup(`<b>${city.name}</b><br>We service this area!`);
    });
    
    // Adjust the service area polygon to cover all these cities
    L.polygon([
        [33.4, -117.8],  // Southwest corner
        [34.2, -117.8],  // Northwest corner
        [34.2, -116.9],  // Northeast corner
        [33.4, -116.9]   // Southeast corner
    ], { 
        color: 'blue', 
        fillOpacity: 0.1, 
        weight: 2 
    }).addTo(map);
}