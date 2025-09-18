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
 * Fetches, injects, and initializes dynamic page content (like tracking, services).
 * @param {string} url - The URL of the page to load.
 * @param {string} targetElementId - The ID of the element to inject the content into.
 */
async function loadDynamicContent(url, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) {
        console.error(`Dynamic content target element #${targetElementId} not found.`);
        return;
    }

    try {
        // Show a loading indicator
        targetElement.innerHTML = `<div class="card text-center mt-8"><p class="text-gray-500">Loading...</p></div>`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load content. Status: ${response.status}`);
        
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        const mainContent = doc.querySelector('main');
        // Find the page-specific inline script. We assume it's the last script tag in the body.
        const pageScriptTag = doc.querySelector('body > script:last-of-type');
        
        if (mainContent) {
            targetElement.innerHTML = mainContent.innerHTML;

            // If a page-specific inline script exists, extract and run its core logic.
            if (pageScriptTag && pageScriptTag.textContent) {
                let scriptContent = pageScriptTag.textContent;

                // This regex robustly finds and removes the DOMContentLoaded wrapper.
                const regex = /document\.addEventListener\(\s*['"]DOMContentLoaded['"]\s*,\s*(?:function\s*\(\s*\)\s*\{|(?:\(\s*\)\s*=>\s*\{))([\s\S]*)\}\s*\)\s*;/;
                const match = scriptContent.match(regex);
                
                // If a match is found, use the inner content of the wrapper.
                if (match && match[1]) {
                    scriptContent = match[1];
                }

                // Execute the cleaned script by creating a new script element.
                const script = document.createElement('script');
                script.textContent = scriptContent;
                document.body.appendChild(script).remove(); // Append to run, then immediately remove.
            }
        } else {
            throw new Error('Could not find main content in the fetched page.');
        }
    } catch (error) {
        console.error('Error loading dynamic content:', error);
        targetElement.innerHTML = `<div class="card text-center mt-8 text-red-600"><p>Sorry, could not load the content. Please try again.</p></div>`;
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

            // The link's ID should be in the format 'nav-main', 'nav-tracking', etc.
            const linkPage = link.id ? link.id.split('-')[1] : '';

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

    // Add event listeners for the dynamic content buttons on the main page.
    const dynamicButtons = document.querySelectorAll('.dynamic-loader-btn');
    dynamicButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.dataset.url;
            const page = button.dataset.page;
            const welcomeSection = document.getElementById('welcome-section');
            
            if (welcomeSection) {
                welcomeSection.classList.add('hidden');
            }
            
            // Load the new content
            loadDynamicContent(url, 'dynamic-content-area');

            // Update the active nav link
            setActiveNav(page);
        });
    });
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

