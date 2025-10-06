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
    
    // Auth elements
    const loginButton = document.getElementById('login-button');
    const profileSection = document.getElementById('profile-section');
    const loginButtonMobile = document.getElementById('login-button-mobile');
    const profileSectionMobile = document.getElementById('profile-section-mobile');

    // Nav Items
    const publicNavItems = [
        document.getElementById('nav-home-public'),
        document.getElementById('nav-services-public'),
        document.getElementById('nav-complaint-public'),
        document.getElementById('dropdown-home-public'),
        document.getElementById('dropdown-services-public'),
        document.getElementById('dropdown-complaint-public')
    ];
    const privateNavItems = [
        document.getElementById('nav-bookorder-private'),
        document.getElementById('nav-calculator-private'),
        document.getElementById('nav-ticket-private'),
        document.getElementById('nav-task-private'),
        document.getElementById('nav-search'),
        document.getElementById('dropdown-bookorder-private'),
        document.getElementById('dropdown-calculator-private'),
        document.getElementById('dropdown-ticket-private'),
        document.getElementById('dropdown-task-private'),
        document.getElementById('dropdown-search-private')
    ];

    // Sidebar elements
    const sidebarToggleContainer = document.getElementById('sidebar-toggle-container');
    const ledgerMenuItem = document.getElementById('ledger-menu-item');
    const mastersMenuItem = document.getElementById('masters-menu-item');
    
    // Logo link
    const logoLink = document.getElementById('logoLink');

    if (!loginButton) return;

    let isLoggedIn = false;

    if (loginDataJSON) {
        const loginData = JSON.parse(loginDataJSON);
        if (new Date().getTime() <= loginData.expires) {
            isLoggedIn = true;
        } else {
            localStorage.removeItem('loginData');
        }
    }

    if (isLoggedIn) {
        const loginData = JSON.parse(loginDataJSON);
        const userRole = loginData.ROLE ? loginData.ROLE.trim().toUpperCase() : 'N/A';
        const userName = loginData.NAME || 'User';

        // --- UI for LOGGED IN user ---
        loginButton.classList.add('hidden');
        profileSection.classList.remove('hidden');
        loginButtonMobile.classList.add('hidden');
        profileSectionMobile.classList.remove('hidden');
        
        publicNavItems.forEach(item => item && item.classList.add('hidden'));
        privateNavItems.forEach(item => item && item.classList.remove('hidden'));
        
        sidebarToggleContainer.classList.remove('hidden');
        if (logoLink) logoLink.href = 'https://post4ex.github.io/postman/dashboard.html';
        
        // --- Populate Profile Dropdowns ---
        document.getElementById('profile-name-short').textContent = userName.split(' ')[0];
        
        const profileDetailsContainer = document.getElementById('profile-details-container');
        const mobileProfileDetailsContainer = document.getElementById('mobile-profile-details-container');

        if (profileDetailsContainer) profileDetailsContainer.innerHTML = '';
        if (mobileProfileDetailsContainer) mobileProfileDetailsContainer.innerHTML = '';

        for (const key in loginData) {
            if (Object.hasOwnProperty.call(loginData, key) && key !== 'expires') {
                const value = loginData[key];
                const keyFormatted = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase().replace(/_/g, ' ');

                // Populate desktop dropdown
                if(profileDetailsContainer){
                    const detailWrapper = document.createElement('div');
                    detailWrapper.innerHTML = `
                        <p class="text-xs text-gray-500">${keyFormatted}</p>
                        <p class="font-semibold text-sm text-gray-800">${value}</p>
                    `;
                    profileDetailsContainer.appendChild(detailWrapper);
                }

                // Populate mobile dropdown
                if(mobileProfileDetailsContainer){
                    const mobileDetailItem = document.createElement('p');
                    mobileDetailItem.className = 'text-sm text-gray-700';
                    mobileDetailItem.innerHTML = `<span class="font-semibold">${keyFormatted}:</span> ${value}`;
                    mobileProfileDetailsContainer.appendChild(mobileDetailItem);
                }
            }
        }

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
        loginButtonMobile.classList.remove('hidden');
        profileSectionMobile.classList.add('hidden');

        publicNavItems.forEach(item => item && item.classList.remove('hidden'));
        privateNavItems.forEach(item => item && item.classList.add('hidden'));

        sidebarToggleContainer.classList.add('hidden');
        if (logoLink) logoLink.href = 'https://post4ex.github.io/postman/main.html'; 

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
        if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
            const isClickInsideMenuButton = menuButton ? menuButton.contains(event.target) : false;
            const isClickInsideDropdownMenu = dropdownMenu.contains(event.target);
            if (!isClickInsideMenuButton && !isClickInsideDropdownMenu) {
                dropdownMenu.classList.add('hidden');
            }
        }
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
    let pageId = 'home'; 
    if (path.includes('dashboard.html')) pageId = 'bookorder'; 
    if (path.includes('tracking.html')) pageId = 'tracking';
    if (path.includes('services.html')) pageId = 'services';
    if (path.includes('complaint.html')) pageId = 'complaint';
    if (path.includes('Calculator.html')) pageId = 'calculator';
    if (path.includes('ticket.html')) pageId = 'ticket';
    if (path.includes('task.html')) pageId = 'task';
    if (path.includes('search.html')) pageId = 'search';
    
    setActiveNav(pageId);
};

// --- SCRIPT EXECUTION STARTS HERE ---
document.addEventListener('DOMContentLoaded', () => {
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

