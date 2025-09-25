/**
 * Immediately checks if the current page is protected and if the user is logged in.
 * Redirects to the absolute login URL if access is denied.
 */
function enforceSecurity() {
    const BASE_URL = 'https://post4ex.github.io/postman/';
    const LOGIN_URL = `${BASE_URL}login.html`;

    // A list of all pages that require a user to be logged in.
    const protectedPages = [
        'dashboard.html', 'pincode.html', 'Calculator.html', 'CreateOrder.html', 'PickupRequest.html',
        'BookOrder.html', 'AssignCarrier.html', 'EditOrder.html', 'Shipments.html', 'OutMenifest.html',
        'InMenifest.html', 'RunSheet.html', 'Update.html', 'POD.html', 'CRM.html', 'ReportBooking.html',
        'ReportMenifest.html', 'ReportUpdate.html', 'ReportRunsheet.html', 'ReportCRM.html', 'Billing.html',
        'LedgerSummary.html', 'LedgerAccounts.html', 'LedgerReceipts.html', 'LedgerPayments.html',
        'LedgerExpenseClaims.html', 'LedgerCustomers.html', 'LedgerSalesInvoices.html', 'LedgerCreditNotes.html',
        'LedgerDeliveryNotes.html', 'LedgerSuppliers.html', 'LedgerPurchaseInvoices.html', 'LedgerDebitNotes.html',
        'LedgerEmployees.html', 'LedgerJournalEntries.html', 'LedgerReports.html', 'Branches.html',
        'Customer.html', 'Clients.html', 'Suppliers.html', 'Vendors.html', 'Staff.html', 'Stock.html'
    ];

    const currentPath = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPath)) {
        const loginDataJSON = localStorage.getItem('loginData');
        let isLoggedIn = false;

        if (loginDataJSON) {
            const loginData = JSON.parse(loginDataJSON);
            if (new Date().getTime() <= loginData.expires) {
                isLoggedIn = true;
            }
        }

        if (!isLoggedIn) {
            window.location.href = LOGIN_URL;
            return false; // Stop further script execution
        }
    }
    return true; // Access granted
}

// --- SCRIPT EXECUTION STARTS HERE ---
// Enforce security immediately. If it returns false, stop everything.
if (enforceSecurity()) {
    document.addEventListener('DOMContentLoaded', () => {
        const BASE_URL = 'https://post4ex.github.io/postman/';

        // Load header and footer components using absolute paths
        Promise.all([
            loadComponent(`${BASE_URL}header.html`, 'header-placeholder'),
            loadComponent(`${BASE_URL}footer.html`, 'footer-placeholder')
        ]).then(() => {
            initializeUI();
            setActiveNavOnLoad();

            const path = window.location.pathname;
            const isMainPage = path.endsWith('/') || path.endsWith('main.html') || path.endsWith('/postman/') || path === '/postman';

            if (isMainPage) {
                loadDynamicContent(`${BASE_URL}tracking.html`, 'tracking-content-area');
                loadDynamicContent(`${BASE_URL}services.html`, 'services-content-area');
            }
        }).catch(error => {
            console.error("Failed to initialize page layout:", error);
        });
    });
}


/**
 * Fetches and injects HTML content from a component file into a placeholder element.
 * @param {string} componentUrl - The absolute URL of the HTML component to load.
 * @param {string} placeholderId - The ID of the element to inject the content into.
 */
async function loadComponent(componentUrl, placeholderId) {
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) throw new Error(`Failed to load component: ${componentUrl}`);
        const text = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) placeholder.innerHTML = text;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Main function to initialize the UI event listeners after components are loaded.
 */
function initializeUI() {
    const BASE_URL = 'https://post4ex.github.io/postman/';
    const LOGIN_URL = `${BASE_URL}login.html`;

    // --- Session & UI Management ---
    const loginDataJSON = localStorage.getItem('loginData');
    let isLoggedIn = false;
    let userRole = null;

    if (loginDataJSON) {
        const loginData = JSON.parse(loginDataJSON);
        if (new Date().getTime() <= loginData.expires) {
            isLoggedIn = true;
            userRole = loginData.ROLE ? loginData.ROLE.trim().toUpperCase() : null;
        } else {
            localStorage.removeItem('loginData');
        }
    }

    // --- Element Selectors ---
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginButtonMobile = document.getElementById('login-button-mobile');
    const logoutButtonMobile = document.getElementById('logout-button-mobile');
    const sidebarToggleContainer = document.getElementById('sidebar-toggle-container');
    const homeLink = document.getElementById('nav-main');
    const homeLinkMobile = document.getElementById('dropdown-main');
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const ledgerMenuItem = document.getElementById('ledger-menu-item');
    const mastersMenuItem = document.getElementById('masters-menu-item');

    // --- UI Updates based on Login Status ---
    if (isLoggedIn) {
        if(loginButton) loginButton.classList.add('hidden');
        if(logoutButton) logoutButton.classList.remove('hidden');
        if(loginButtonMobile) loginButtonMobile.classList.add('hidden');
        if(logoutButtonMobile) logoutButtonMobile.classList.remove('hidden');
        if(sidebarToggleContainer) sidebarToggleContainer.classList.remove('hidden');

        // Update home links to point to the dashboard
        if (homeLink) homeLink.href = `${BASE_URL}dashboard.html`;
        if (homeLinkMobile) homeLinkMobile.href = `${BASE_URL}dashboard.html`;

        // Role-based menu visibility
        if (userRole === 'CLIENT' || userRole === 'BRANCH') {
            if (ledgerMenuItem) ledgerMenuItem.classList.add('hidden');
            if (mastersMenuItem) mastersMenuItem.classList.add('hidden');
        }

    } else {
        if(loginButton) loginButton.classList.remove('hidden');
        if(logoutButton) logoutButton.classList.add('hidden');
        if(loginButtonMobile) loginButtonMobile.classList.remove('hidden');
        if(logoutButtonMobile) logoutButtonMobile.classList.add('hidden');
        if(sidebarToggleContainer) sidebarToggleContainer.classList.add('hidden');
        
        if (homeLink) homeLink.href = `${BASE_URL}main.html`;
        if (homeLinkMobile) homeLinkMobile.href = `${BASE_URL}main.html`;
    }

    // --- Event Listeners ---
    const handleLogout = () => {
        localStorage.removeItem('loginData');
        window.location.href = LOGIN_URL;
    };

    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (logoutButtonMobile) logoutButtonMobile.addEventListener('click', handleLogout);

    if (menuButton && dropdownMenu) {
        menuButton.addEventListener('click', () => dropdownMenu.classList.toggle('hidden'));
    }

    if (sidebar && sidebarToggle && sidebarOverlay) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebarOverlay.classList.toggle('hidden');
        };
        sidebarToggle.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
}

/**
 * Sets the active navigation link based on the current page URL.
 */
const setActiveNavOnLoad = () => {
    const path = window.location.pathname;
    let pageId = 'main';
    if (path.includes('dashboard.html')) pageId = 'main';
    if (path.includes('tracking.html')) pageId = 'tracking';
    if (path.includes('services.html')) pageId = 'services';
    if (path.includes('complaint.html')) pageId = 'complaint';

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

// --- Helper Functions from header.html script ---
function toggleSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    const arrow = submenu.previousElementSibling.querySelector('svg');
    if (submenu) {
        submenu.classList.toggle('hidden');
        if (arrow) arrow.classList.toggle('rotate-180');
    }
}

