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
    if (!targetElement) return;

    try {
        targetElement.innerHTML = `<div class="card text-center"><p class="text-gray-500">Loading...</p></div>`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load content. Status: ${response.status}`);
        
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        const mainContent = doc.querySelector('main .container');
        const pageScriptTag = doc.querySelector('body > script:last-of-type');
        
        if (mainContent) {
            targetElement.innerHTML = mainContent.innerHTML;

            if (pageScriptTag && pageScriptTag.textContent) {
                let scriptContent = pageScriptTag.textContent;
                // This regex is designed to extract the content from the DOMContentLoaded listener
                const regex = /document\.addEventListener\(\s*['"]DOMContentLoaded['"]\s*,\s*(?:function\s*\(\s*\)\s*\{|(?:\(\s*\)\s*=>\s*\{))([\s\S]*)\}\s*\)\s*;/;
                const match = scriptContent.match(regex);
                
                if (match && match[1]) {
                    scriptContent = match[1];
                }

                // Execute the extracted script
                const script = document.createElement('script');
                script.textContent = scriptContent;
                document.body.appendChild(script).remove();
            }
        } else {
            throw new Error('Could not find main content in the fetched page.');
        }
    } catch (error) {
        console.error('Error loading dynamic content:', error);
        targetElement.innerHTML = `<div class="card text-center text-red-600"><p>Sorry, could not load the content.</p></div>`;
    }
}


/**
 * Sets the active state for a navigation link based on a page identifier.
 * @param {string} pageId - Identifier for the page (e.g., 'main', 'tracking').
 */
const setActiveNav = (pageId) => {
    // Use a small timeout to ensure the header has been loaded
    setTimeout(() => {
        const navLinks = document.querySelectorAll('#main-nav a, #dropdownMenu a');
        navLinks.forEach(link => {
            link.classList.remove('bg-gray-600', 'font-bold');
            link.classList.add('bg-blue-900'); // Default style
            
            // Extract page identifier from link ID (e.g., 'nav-main' -> 'main')
            const linkPage = link.id ? link.id.split('-')[1] : '';
            if (linkPage === pageId) {
                link.classList.remove('bg-blue-900');
                link.classList.add('bg-gray-600', 'font-bold'); // Active style
            }
        });
    }, 100); // 100ms delay
};
window.setActiveNav = setActiveNav;

/**
 * Checks login status from localStorage and updates the UI accordingly.
 */
function checkLoginStatus() {
    const loginDataJSON = localStorage.getItem('loginData');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const sidebarToggleContainer = document.getElementById('sidebar-toggle-container');
    
    if (!loginButton || !logoutButton || !sidebarToggleContainer) return;

    if (loginDataJSON) {
        const loginData = JSON.parse(loginDataJSON);
        const now = new Date().getTime();

        // Check if the session is expired
        if (now > loginData.expires) {
            localStorage.removeItem('loginData'); // Clear expired session
            loginButton.classList.remove('hidden');
            logoutButton.classList.add('hidden');
            sidebarToggleContainer.classList.add('hidden');
        } else {
            // User is logged in and session is valid
            loginButton.classList.add('hidden');
            logoutButton.classList.remove('hidden');
            sidebarToggleContainer.classList.remove('hidden');
        }
    } else {
        // User is not logged in
        loginButton.classList.remove('hidden');
        logoutButton.classList.add('hidden');
        sidebarToggleContainer.classList.add('hidden');
    }
}


/**
 * Main function to initialize the UI event listeners after components are loaded.
 */
function initializeUI() {
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutButton = document.getElementById('logout-button');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    // Mobile menu toggle
    if (menuButton && dropdownMenu) {
        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });
        dropdownMenu.addEventListener('click', () => dropdownMenu.classList.add('hidden'));
    }

    // Close mobile menu on outside click
    document.addEventListener('click', (event) => {
        const isClickInsideMenuButton = menuButton ? menuButton.contains(event.target) : false;
        const isClickInsideDropdownMenu = dropdownMenu ? dropdownMenu.contains(event.target) : false;
        if (!isClickInsideMenuButton && !isClickInsideDropdownMenu && dropdownMenu) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loginData');
            // Redirect to login page for a clean state
            window.location.href = 'https://post4ex.github.io/postman/login.html';
        });
    }

    // Sidebar toggle functionality
    if (sidebar && sidebarToggle && sidebarOverlay) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebarOverlay.classList.toggle('hidden');
        };
        sidebarToggle.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Initial check of login status to set the correct UI state
    checkLoginStatus();
}

/**
 * Sets the active navigation link based on the current page URL.
 */
const setActiveNavOnLoad = () => {
    const path = window.location.pathname;
    let pageId = 'main'; // Default to main
    if (path.includes('tracking.html')) pageId = 'tracking';
    if (path.includes('services.html')) pageId = 'services';
    if (path.includes('complaint.html')) pageId = 'complaint';
    
    setActiveNav(pageId);
};

// --- SCRIPT EXECUTION STARTS HERE ---
document.addEventListener('DOMContentLoaded', () => {
    // Load header and footer components first
    Promise.all([
        loadComponent('https://post4ex.github.io/postman/header.html', 'header-placeholder'),
        loadComponent('https://post4ex.github.io/postman/footer.html', 'footer-placeholder')
    ]).then(() => {
        // Once components are loaded, initialize UI elements and check states
        initializeUI();
        setActiveNavOnLoad();
        
        // Determine if we are on the main page to auto-load content
        const path = window.location.pathname;
        const isMainPage = path.endsWith('/') || path.endsWith('main.html') || path.endsWith('/postman/') || path === '/postman';
        
        if (isMainPage) {
            loadDynamicContent('https://post4ex.github.io/postman/tracking.html', 'tracking-content-area');
            loadDynamicContent('https://post4ex.github.io/postman/services.html', 'services-content-area');
        }
    }).catch(error => {
        console.error("Failed to initialize page layout:", error);
    });
});

