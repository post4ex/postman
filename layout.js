/**
 * Fetches and injects HTML content from a component file into a placeholder element,
 * and executes any scripts within the component.
 * @param {string} componentUrl - The URL of the HTML component to load.
 * @param {string} placeholderId - The ID of the element to inject the content into.
 * @returns {Promise<void>}
 */
async function loadComponent(componentUrl, placeholderId) {
// ... existing code ...
        }
    }
}


/**
 * Fetches, injects, and initializes dynamic page content (like tracking, services).
// ... existing code ...
    }
}


/**
 * Sets the active state for a navigation link based on a page identifier.
// ... existing code ...
};
window.setActiveNav = setActiveNav;

/**
 * Checks login status from localStorage and updates the UI accordingly, including role-based permissions.
 */
function checkLoginStatus() {
    const loginDataJSON = localStorage.getItem('loginData');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const sidebarToggleContainer = document.getElementById('sidebar-toggle-container');
    
    // Get home links to make them dynamic
    const homeLink = document.getElementById('nav-main');
    const homeLinkMobile = document.getElementById('dropdown-main');
    
    // Mobile auth buttons
    const loginButtonMobile = document.getElementById('login-button-mobile');
    const logoutButtonMobile = document.getElementById('logout-button-mobile');

    // Sidebar menu items for role-based access
    const ledgerMenuItem = document.getElementById('ledger-menu-item');
    const mastersMenuItem = document.getElementById('masters-menu-item');

    if (!loginButton || !logoutButton || !sidebarToggleContainer) return;

    let isLoggedIn = false;
    let userRole = null;
    if (loginDataJSON) {
        const loginData = JSON.parse(loginDataJSON);
        const now = new Date().getTime();
        if (now <= loginData.expires) {
            isLoggedIn = true;
            userRole = loginData.ROLE; // Get the user's role
        } else {
            localStorage.removeItem('loginData'); // Clear expired session
        }
    }

    if (isLoggedIn) {
        // --- UI for LOGGED IN user ---
        loginButton.classList.add('hidden');
        logoutButton.classList.remove('hidden');
        if(loginButtonMobile) loginButtonMobile.classList.add('hidden');
        if(logoutButtonMobile) logoutButtonMobile.classList.remove('hidden');
        
        sidebarToggleContainer.classList.remove('hidden');
        // Update home links to point to the dashboard
        if (homeLink) homeLink.href = 'https://post4ex.github.io/postman/dashboard.html';
        if (homeLinkMobile) homeLinkMobile.href = 'https://post4ex.github.io/postman/dashboard.html';
        
        // --- Role-Based Access Control for Sidebar ---
        if (ledgerMenuItem && mastersMenuItem) {
            if (userRole === 'Client' || userRole === 'Branch') {
                // Hide for non-admin roles
                ledgerMenuItem.classList.add('hidden');
                mastersMenuItem.classList.add('hidden');
            } else {
                // Show for Admin or other roles
                ledgerMenuItem.classList.remove('hidden');
                mastersMenuItem.classList.remove('hidden');
            }
        }

    } else {
        // --- UI for LOGGED OUT user ---
        loginButton.classList.remove('hidden');
        logoutButton.classList.add('hidden');
        if(loginButtonMobile) loginButtonMobile.classList.remove('hidden');
        if(logoutButtonMobile) logoutButtonMobile.classList.add('hidden');

        sidebarToggleContainer.classList.add('hidden');
        // Update home links to point to the main public page
        if (homeLink) homeLink.href = 'https://post4ex.github.io/postman/main.html';
        if (homeLinkMobile) homeLinkMobile.href = 'https://post4ex.github.io/postman/main.html';

        // Ensure sidebar menus are hidden if logged out
        if (ledgerMenuItem) ledgerMenuItem.classList.add('hidden');
        if (mastersMenuItem) mastersMenuItem.classList.add('hidden');
    }
}


/**
// ... existing code ...
 * Main function to initialize the UI event listeners after components are loaded.
 */
function initializeUI() {
    const menuButton = document.getElementById('menuButton');
// ... existing code ...
    checkLoginStatus();
}

/**
 * Sets the active navigation link based on the current page URL.
// ... existing code ...
    setActiveNav(pageId);
};

// --- SCRIPT EXECUTION STARTS HERE ---
document.addEventListener('DOMContentLoaded', () => {
// ... existing code ...
