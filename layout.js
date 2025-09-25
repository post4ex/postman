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
            // Get role, trim whitespace, and convert to uppercase for reliable comparison.
            userRole = loginData.ROLE ? loginData.ROLE.trim().toUpperCase() : null; 
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
            // Compare against uppercase roles for consistency.
            if (userRole === 'CLIENT' || userRole === 'BRANCH') {
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
 * Main function to initialize the UI event listeners after components are loaded.
 */
function initializeUI() {
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutButton = document.getElementById('logout-button');
    const logoutButtonMobile = document.getElementById('logout-button-mobile');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
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

    const handleLogout = () => {
        localStorage.removeItem('loginData');
        window.location.href = 'https://post4ex.github.io/postman/login.html';
    };
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (logoutButtonMobile) logoutButtonMobile.addEventListener('click', handleLogout);

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
    let pageId = 'main'; // Default to main
    if (path.includes('dashboard.html')) pageId = 'main'; // Treat dashboard as home
    if (path.includes('tracking.html')) pageId = 'tracking';
    if (path.includes('services.html')) pageId = 'services';
    if (path.includes('complaint.html')) pageId = 'complaint';
    
    setActiveNav(pageId);
};

// --- SCRIPT EXECUTION STARTS HERE ---
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // **FIX:** Create a comprehensive list of all pages that require a user to be logged in.
    const protectedPages = [
        'dashboard.html', 'pincode.html', 'CreateOrder.html', 'PickupRequest.html', 'BookOrder.html', 
        'AssignCarrier.html', 'EditOrder.html', 'Shipments.html', 'Calculator.html', 'OutMenifest.html', 
        'InMenifest.html', 'RunSheet.html', 'Update.html', 'POD.html', 'CRM.html', 'ReportBooking.html', 
        'ReportMenifest.html', 'ReportUpdate.html', 'ReportRunsheet.html', 'ReportCRM.html', 'Billing.html', 
        'LedgerSummary.html', 'LedgerAccounts.html', 'LedgerReceipts.html', 'LedgerPayments.html', 
        'LedgerExpenseClaims.html', 'LedgerCustomers.html', 'LedgerSalesInvoices.html', 'LedgerCreditNotes.html', 
        'LedgerDeliveryNotes.html', 'LedgerSuppliers.html', 'LedgerPurchaseInvoices.html', 'LedgerDebitNotes.html', 
        'LedgerEmployees.html', 'LedgerJournalEntries.html', 'LedgerReports.html', 'Branches.html', 
        'Customer.html', 'Clients.html', 'Suppliers.html', 'Vendors.html', 'Staff.html', 'Stock.html'
    ]; 

    // Check if the current page is in the protected list.
    const isProtected = protectedPages.some(page => path.includes(page));

    if (isProtected) {
        const loginDataJSON = localStorage.getItem('loginData');
        let isLoggedIn = false;
        if (loginDataJSON) {
            const loginData = JSON.parse(loginDataJSON);
            if (new Date().getTime() <= loginData.expires) {
                isLoggedIn = true;
            }
        }
        if (!isLoggedIn) {
            // Redirect to login page if not logged in
            window.location.href = 'https://post4ex.github.io/postman/login.html';
            return; // Stop further script execution for this page
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
            loadDynamicContent('https://post4ex.github.io/postman/services.html', 'services-content-area');
        }
    }).catch(error => {
        console.error("Failed to initialize page layout:", error);
    });
});

