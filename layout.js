// --- CONFIGURATION ---
// Add the filenames of all pages that should be protected by the login.
const protectedPages = [
    'dashboard.html',
    'CreateOrder.html', 'PickupRequest.html', 'BookOrder.html', 'AssignCarrier.html', 'EditOrder.html',
    'Shipments.html',
    'Pincode.html', 'Calculator.html',
    'OutMenifest.html', 'InMenifest.html', 'RunSheet.html', 'Update.html', 'POD.html',
    'CRM.html',
    'ReportBooking.html', 'ReportMenifest.html', 'ReportUpdate.html', 'ReportRunsheet.html', 'ReportCRM.html',
    'Billing.html',
    'LedgerSummary.html', 'LedgerAccounts.html', 'LedgerReceipts.html', 'LedgerPayments.html', 'LedgerExpenseClaims.html', 'LedgerCustomers.html', 'LedgerSalesInvoices.html', 'LedgerCreditNotes.html', 'LedgerDeliveryNotes.html', 'LedgerSuppliers.html', 'LedgerPurchaseInvoices.html', 'LedgerDebitNotes.html','LedgerEmployees.html', 'LedgerJournalEntries.html', 'LedgerReports.html',
    'Branches.html', 'Customer.html', 'Clients.html', 'Suppliers.html', 'Vendors.html', 'Staff.html', 'Stock.html'
];

/**
 * Checks the user's login status from localStorage.
 * This is the primary security check for the application.
 */
function checkLoginStatus() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const loginData = JSON.parse(localStorage.getItem('loginData'));

    if (loginData && new Date().getTime() < loginData.expires) {
        // --- User is Logged In ---
        if (currentPage === 'login.html') {
            // If a logged-in user tries to access the login page, redirect them to the dashboard.
            window.location.href = 'dashboard.html';
        }
        return true; // Indicate that the user is authenticated.

    } else {
        // --- User is Not Logged In (or session expired) ---
        localStorage.removeItem('loginData'); // Clean up any expired session data.
        
        if (protectedPages.includes(currentPage)) {
            // If they are trying to access a protected page, redirect them to the login page.
            window.location.href = 'login.html';
        }
        return false; // Indicate that the user is not authenticated.
    }
}

// --- INITIALIZE ---
// Run the security check as the very first step when the script loads.
const isLoggedIn = checkLoginStatus();


/**
 * Fetches and injects HTML content into a placeholder element.
 * It now also executes any script tags found within the loaded HTML.
 */
async function loadComponent(elementId, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to load component from ${url}. Status: ${response.status}`);
            return;
        }
        const text = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = text;
            // Find and execute any scripts within the loaded component
            element.querySelectorAll("script").forEach(script => {
                const newScript = document.createElement("script");
                // Copy attributes
                for (const attr of script.attributes) {
                    newScript.setAttribute(attr.name, attr.value);
                }
                // Copy script content
                newScript.innerHTML = script.innerHTML;
                script.parentNode.replaceChild(newScript, script);
            });
        }
    } catch (error) {
        console.error(`Error loading component from ${url}:`, error);
    }
}


// --- DOMContentLoaded ---
// This ensures the rest of the script runs after the basic HTML document is ready.
document.addEventListener('DOMContentLoaded', () => {
    // Load the header and footer on all relevant pages.
    // The login page is standalone and does not need these.
    if (window.location.pathname.split('/').pop() !== 'login.html') {
        loadComponent('header-placeholder', 'header.html');
        loadComponent('footer-placeholder', 'footer.html');
    }
});

