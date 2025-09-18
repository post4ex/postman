/**
 * Fetches and injects HTML content from a component file into a placeholder element.
 * @param {string} componentUrl - The URL of the HTML component to load.
 * @param {string} placeholderId - The ID of the element to inject the content into.
 * @returns {Promise<void>}
 */
async function loadComponent(componentUrl, placeholderId) {
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${componentUrl}. Status: ${response.status}`);
        }
        const text = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = text;
        } else {
            console.warn(`Placeholder element with ID '${placeholderId}' not found.`);
        }
    } catch (error) {
        console.error(error);
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = `<p class="text-red-500 text-center">Failed to load component.</p>`;
        }
    }
}

/**
 * Sets the active state for a navigation link based on a page identifier.
 * @param {string} pageId - Identifier for the page (e.g., 'main', 'tracking').
 */
const setActiveNav = (pageId) => {
    // Wait a moment for the header to be loaded before trying to find the nav links
    setTimeout(() => {
        const navLinks = document.querySelectorAll('#main-nav a, #dropdownMenu a');
        
        navLinks.forEach(link => {
            // Reset styles for all links
            link.classList.remove('bg-gray-600', 'font-bold');
            link.classList.add('bg-blue-900');

            const linkPage = link.id.split('-')[1]; // e.g., 'nav-tracking' -> 'tracking'

            // Apply active styles to the matching link
            if (linkPage === pageId) {
                link.classList.remove('bg-blue-900');
                link.classList.add('bg-gray-600', 'font-bold');
            }
        });
    }, 100); // 100ms delay should be enough for the header to render
};
window.setActiveNav = setActiveNav; // Expose to global scope for other scripts to use

/**
 * Main function to initialize the UI after components are loaded.
 */
function initializeUI() {
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const contactModal = document.getElementById('contactModal');
    
    // Toggle mobile dropdown menu
    if (menuButton && dropdownMenu) {
        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        dropdownMenu.addEventListener('click', () => dropdownMenu.classList.add('hidden'));
    }

    document.addEventListener('click', (event) => {
        const isClickInsideMenuButton = menuButton ? menuButton.contains(event.target) : false;
        const isClickInsideDropdownMenu = dropdownMenu ? dropdownMenu.contains(event.target) : false;
        if (!isClickInsideMenuButton && !isClickInsideDropdownMenu && dropdownMenu) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // Handle Contact Modal
    const contactButtons = document.querySelectorAll('#contactButton, #contactButtonMobile');
    const closeContactModalButton = document.getElementById('closeContactModalButton');
    
    if (contactModal) {
        contactButtons.forEach(button => button.addEventListener('click', () => {
            contactModal.classList.remove('hidden');
            if (dropdownMenu) dropdownMenu.classList.add('hidden');
        }));
        
        if (closeContactModalButton) {
            closeContactModalButton.addEventListener('click', () => contactModal.classList.add('hidden'));
        }

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) contactModal.classList.add('hidden');
        });
    }
}

/**
 * Sets the active navigation link based on the current page URL.
 */
const setActiveNavOnLoad = () => {
    const path = window.location.pathname;
    let pageId = 'main'; // Default to home
    if (path.includes('tracking.html')) pageId = 'tracking';
    if (path.includes('services.html')) pageId = 'services';
    if (path.includes('complaint.html')) pageId = 'complaint';
    
    setActiveNav(pageId);
};


// --- SCRIPT EXECUTION STARTS HERE ---

// When the DOM is ready, load components and then initialize the UI.
document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        loadComponent('https://post4ex.github.io/postman/header.html', 'header-placeholder'),
        loadComponent('https://post4ex.github.io/postman/footer.html', 'footer-placeholder')
    ]).then(() => {
        // All components loaded, setup event listeners and initial state
        initializeUI();
        setActiveNavOnLoad();
    }).catch(error => {
        console.error("Failed to initialize page layout:", error);
    });
});

