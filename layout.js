/**
 * Fetches and injects HTML content from a component file into a placeholder element,
 * and executes any scripts within the component.
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
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const componentBody = doc.body;

            // Find and execute any script tags within the component
            const scripts = componentBody.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript).remove();
            });

            // Append the component's HTML content to the placeholder
            while (componentBody.firstChild) {
                placeholder.appendChild(componentBody.firstChild);
            }
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
                const regex = /document\.addEventListener\(\s*['"]DOMContentLoaded['"]\s*,\s*(?:function\s*\(\s*\)\s*\{|(?:\(\s*\)\s*=>\s*\{))([\s\S]*)\}\s*\)\s*;/;
                const match = scriptContent.match(regex);
                
                if (match && match[1]) {
                    scriptContent = match[1];
                }

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
    setTimeout(() => {
        const navLinks = document.querySelectorAll('#main-nav a, #dropdownMenu a');
        navLinks.forEach(link => {
            link.classList.remove('bg-gray-600', 'font-bold');
            link.classList.add('bg-blue-900');
            
            const linkPage = link.id ? link.id.split('-')[1] : '';
            if (linkPage === pageId) {
                link.classList.remove('bg-blue-900');
                link.classList.add('bg-gray-600', 'font-bold');
            }
        });
    }, 100);
};
window.setActiveNav = setActiveNav;

/**
 * Checks login status from localStorage and updates the UI accordingly, including role-based permissions.
 */
function checkLoginStatus() {
    const loginDataJSON = localStorage.getItem('loginData');
    
    // Desktop auth elements
    const loginButton = document.getElementById('login-button');
    const profileSection = document.getElementById('profile-section');
    const searchButton = document.getElementById('nav-search');

    // Mobile auth elements
    const loginButtonMobile = document.getElementById('login-button-mobile');
    const profileSectionMobile = document.getElementById('profile-section-mobile');
    const searchButtonMobile = document.getElementById('dropdown-search');

    // Sidebar elements
    const sidebarToggleContainer = document.getElementById('sidebar-toggle-container');
    const ledgerMenuItem = document.getElementById('ledger-menu-item');
    const mastersMenuItem = document.getElementById('masters-menu-item');
    
    // Dynamic home links
    const homeLink = document.getElementById('nav-bookorder'); 
    const homeLinkMobile = document.getElementById('dropdown-bookorder');

    if (!loginButton) return;

    let isLoggedIn = false;
    let userRole = null;
    let userName = null;
    let userCode = null;

    if (loginDataJSON) {
        const loginData = JSON.parse(loginDataJSON);
        const now = new Date().getTime();
        if (now <= loginData.expires) {
            isLoggedIn = true;
            userRole = loginData.ROLE ? loginData.ROLE.trim().toUpperCase() : 'N/A';
            userName = loginData.NAME || 'User';
            userCode = loginData.CODE || 'N/A';
        } else {
            localStorage.removeItem('loginData'); // Clear expired session
        }
    }

    if (isLoggedIn) {
        // --- UI for LOGGED IN user ---
        loginButton.classList.add('hidden');
        profileSection.classList.remove('hidden');
        if (searchButton) searchButton.classList.remove('hidden');
        
        sidebarToggleContainer.classList.remove('hidden');
        if (homeLink) homeLink.href = 'https://post4ex.github.io/postman/dashboard.html';
        
        // Update profile dropdown
        document.getElementById('profile-name').textContent = userName;
        document.getElementById('profile-role').textContent = userRole;
        document.getElementById('profile-code').textContent = userCode;
        document.getElementById('profile-name-short').textContent = userName.split(' ')[0];

        // Mobile UI
        if (loginButtonMobile) loginButtonMobile.classList.add('hidden');
        if (profileSectionMobile) profileSectionMobile.classList.remove('hidden');
        if (searchButtonMobile) searchButtonMobile.classList.remove('hidden');
        if (homeLinkMobile) homeLinkMobile.href = 'https://post4ex.github.io/postman/dashboard.html';

        // Update mobile profile info
        document.getElementById('mobile-profile-name').textContent = userName;
        document.getElementById('mobile-profile-role').textContent = userRole;
        document.getElementById('mobile-profile-code').textContent = userCode;

        // --- Role-Based Access Control for Sidebar ---
        if (ledgerMenuItem && mastersMenuItem) {
            if (userRole === 'CLIENT' || userRole === 'BRANCH') {
                ledgerMenuItem.classList.add('hidden');
                mastersMenuItem.classList.add('hidden');
            } else {
                ledgerMenuItem.classList.remove('hidden');
                mastersMenuItem.classList.remove('hidden');
            }
        }

    } else {
        // --- UI for LOGGED OUT user ---
        loginButton.classList.remove('hidden');
        profileSection.classList.add('hidden');
        if (searchButton) searchButton.classList.add('hidden');

        sidebarToggleContainer.classList.add('hidden');
        if (homeLink) homeLink.href = 'https://post4ex.github.io/postman/BookOrder.html'; 

        // Mobile UI
        if (loginButtonMobile) loginButtonMobile.classList.remove('hidden');
        if (profileSectionMobile) profileSectionMobile.classList.add('hidden');
        if (searchButtonMobile) searchButtonMobile.classList.add('hidden');
        if (homeLinkMobile) homeLinkMobile.href = 'https://post4ex.github.io/postman/BookOrder.html';

        if (ledgerMenuItem) ledgerMenuItem.classList.add('hidden');
        if (mastersMenuItem) mastersMenuItem.classList.add('hidden');
    }
}


/**
 * Main function to initialize the UI event listeners after components are loaded.
 */
function initializeUI() {
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    // Desktop profile dropdown toggle
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', (event) => {
            event.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });
    }

    if (menuButton && dropdownMenu) {
        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });
    }

    // Global click listener to close dropdowns
    document.addEventListener('click', (event) => {
        // Close mobile dropdown
        if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
            const isClickInsideMenuButton = menuButton ? menuButton.contains(event.target) : false;
            const isClickInsideDropdownMenu = dropdownMenu.contains(event.target);
            if (!isClickInsideMenuButton && !isClickInsideDropdownMenu) {
                dropdownMenu.classList.add('hidden');
            }
        }
        // Close profile dropdown
        if (profileDropdown && !profileDropdown.classList.contains('hidden')) {
            const isClickInsideProfileButton = profileButton ? profileButton.contains(event.target) : false;
            if (!isClickInsideProfileButton) {
                profileDropdown.classList.add('hidden');
            }
        }
    });

    // Logout functionality
    const handleLogout = () => {
        localStorage.removeItem('loginData');
        window.location.href = 'https://post4ex.github.io/postman/login.html';
    };
    const logoutButton = document.getElementById('profile-logout-button');
    const logoutButtonMobile = document.getElementById('logout-button-mobile');
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (logoutButtonMobile) logoutButtonMobile.addEventListener('click', handleLogout);

    // Sidebar functionality
    if (sidebar && sidebarToggle && sidebarOverlay) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebarOverlay.classList.toggle('hidden');
        };
        sidebarToggle.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    checkLoginStatus();
}

/**
 * Sets the active navigation link based on the current page URL.
 */
const setActiveNavOnLoad = () => {
    const path = window.location.pathname;
    let pageId = 'bookorder'; // Default to bookorder
    if (path.includes('dashboard.html')) pageId = 'bookorder'; 
    if (path.includes('tracking.html')) pageId = 'tracking';
    if (path.includes('Calculator.html')) pageId = 'calculator';
    if (path.includes('ticket.html')) pageId = 'ticket';
    if (path.includes('task.html')) pageId = 'task';
    if (path.includes('search.html')) pageId = 'search';
    
    setActiveNav(pageId);
};

// --- SCRIPT EXECUTION STARTS HERE ---
document.addEventListener('DOMContentLoaded', () => {
    // Protect the dashboard page from unauthorized access
    const path = window.location.pathname;
    const protectedPages = ['dashboard.html', 'BookOrder.html', 'Calculator.html', 'ticket.html', 'task.html', 'search.html'];
    
    if (protectedPages.some(page => path.includes(page))) {
        const loginDataJSON = localStorage.getItem('loginData');
        let isLoggedIn = false;
        if (loginDataJSON) {
            const loginData = JSON.parse(loginDataJSON);
            if (new Date().getTime() <= loginData.expires) {
                isLoggedIn = true;
            }
        }
        if (!isLoggedIn) {
            window.location.href = 'https://post4ex.github.io/postman/login.html';
            return; 
        }
    }

    // Load header and footer components first
    Promise.all([
        loadComponent('https://post4ex.github.io/postman/header.html', 'header-placeholder'),
        loadComponent('https://post4ex.github.io/postman/footer.html', 'footer-placeholder')
    ]).then(() => {
        initializeUI();
        setActiveNavOnLoad();
        
        const isMainPage = path.endsWith('/') || path.endsWith('main.html') || path.endsWith('/postman/') || path === '/postman';
        
        if (isMainPage) {
            loadDynamicContent('https://post4ex.github.io/postman/tracking.html', 'tracking-content-area');
        }
    }).catch(error => {
        console.error("Failed to initialize page layout:", error);
    });
});

