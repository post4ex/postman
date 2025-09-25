// --- IMMEDIATE SECURITY CHECK ---
// This IIFE (Immediately Invoked Function Expression) runs instantly, before the rest of the page loads.
(function() {
    const path = window.location.pathname;
    
    // The comprehensive list of all pages that require a user to be logged in.
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
            // If not logged in, redirect immediately to the absolute login page URL.
            window.location.href = 'https://post4ex.github.io/postman/login.html';
        }
    }
})();


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
        if (document.getElementById(placeholderId)) {
            document.getElementById(placeholderId).innerHTML = `<p class="text-red-500 text-center">Failed to load component.</p>`;
        }
    }
}


/**
 * Fetches and injects dynamic page content.
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
        if (mainContent) {
            targetElement.innerHTML = mainContent.innerHTML;
            // Re-run the script logic for the dynamically loaded content
            const pageScriptTag = doc.querySelector('body > script:last-of-type');
            if (pageScriptTag && pageScriptTag.textContent) {
                const script = document.createElement('script');
                script.textContent = pageScriptTag.textContent;
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
 * Sets the active state for a navigation link.
 * @param {string} pageId - Identifier for the page (e.g., 'main', 'tracking').
 */
const setActiveNav = (pageId) => {
    setTimeout(() => {
        document.querySelectorAll('#main-nav a, #dropdownMenu a').forEach(link => {
            link.classList.remove('bg-gray-600', 'font-bold');
            link.classList.add('bg-blue-900');
            if (link.id && link.id.split('-')[1] === pageId) {
                link.classList.remove('bg-blue-900');
                link.classList.add('bg-gray-600', 'font-bold');
            }
        });
    }, 100);
};


/**
 * Checks login status and updates UI, including role-based permissions.
 */
function checkLoginStatus() {
    const loginDataJSON = localStorage.getItem('loginData');
    const elements = {
        loginButton: document.getElementById('login-button'),
        logoutButton: document.getElementById('logout-button'),
        sidebarToggle: document.getElementById('sidebar-toggle-container'),
        homeLink: document.getElementById('nav-main'),
        homeLinkMobile: document.getElementById('dropdown-main'),
        loginButtonMobile: document.getElementById('login-button-mobile'),
        logoutButtonMobile: document.getElementById('logout-button-mobile'),
        ledgerMenu: document.getElementById('ledger-menu-item'),
        mastersMenu: document.getElementById('masters-menu-item')
    };

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

    const base_url = 'https://post4ex.github.io/postman/';
    if (isLoggedIn) {
        elements.loginButton?.classList.add('hidden');
        elements.logoutButton?.classList.remove('hidden');
        elements.loginButtonMobile?.classList.add('hidden');
        elements.logoutButtonMobile?.classList.remove('hidden');
        elements.sidebarToggle?.classList.remove('hidden');
        if (elements.homeLink) elements.homeLink.href = `${base_url}dashboard.html`;
        if (elements.homeLinkMobile) elements.homeLinkMobile.href = `${base_url}dashboard.html`;

        if (elements.ledgerMenu && elements.mastersMenu) {
            const isRestricted = userRole === 'CLIENT' || userRole === 'BRANCH';
            elements.ledgerMenu.classList.toggle('hidden', isRestricted);
            elements.mastersMenu.classList.toggle('hidden', isRestricted);
        }
    } else {
        elements.loginButton?.classList.remove('hidden');
        elements.logoutButton?.classList.add('hidden');
        elements.loginButtonMobile?.classList.remove('hidden');
        elements.logoutButtonMobile?.classList.add('hidden');
        elements.sidebarToggle?.classList.add('hidden');
        if (elements.homeLink) elements.homeLink.href = `${base_url}main.html`;
        if (elements.homeLinkMobile) elements.homeLinkMobile.href = `${base_url}main.html`;
        elements.ledgerMenu?.classList.add('hidden');
        elements.mastersMenu?.classList.add('hidden');
    }
}


/**
 * Main function to initialize the UI event listeners.
 */
function initializeUI() {
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (menuButton && dropdownMenu) {
        menuButton.addEventListener('click', e => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', () => dropdownMenu?.classList.add('hidden'));

    const handleLogout = () => {
        localStorage.removeItem('loginData');
        window.location.href = 'https://post4ex.github.io/postman/login.html';
    };
    document.getElementById('logout-button')?.addEventListener('click', handleLogout);
    document.getElementById('logout-button-mobile')?.addEventListener('click', handleLogout);
    
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
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
    let pageId = 'main';
    if (path.includes('dashboard.html')) pageId = 'main';
    else if (path.includes('tracking.html')) pageId = 'tracking';
    else if (path.includes('services.html')) pageId = 'services';
    else if (path.includes('complaint.html')) pageId = 'complaint';
    setActiveNav(pageId);
};

// --- SCRIPT EXECUTION STARTS HERE ---
document.addEventListener('DOMContentLoaded', () => {
    const base_url = 'https://post4ex.github.io/postman/';
    Promise.all([
        loadComponent(`${base_url}header.html`, 'header-placeholder'),
        loadComponent(`${base_url}footer.html`, 'footer-placeholder')
    ]).then(() => {
        initializeUI();
        setActiveNavOnLoad();
        
        const path = window.location.pathname;
        const isMainPage = path.endsWith('/') || path.endsWith('main.html') || path.endsWith('/postman/');
        if (isMainPage) {
            loadDynamicContent(`${base_url}tracking.html`, 'tracking-content-area');
            loadDynamicContent(`${base_url}services.html`, 'services-content-area');
        }
    }).catch(error => console.error("Failed to initialize page layout:", error));
});

