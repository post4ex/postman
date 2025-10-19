// ============================================================
// FLOATING ACTION BUTTON (FAB) CONFIGURATION
// This is the "blueprint" file. Edit this to change which
// buttons appear on which page.
//
// HOW IT WORKS:
// 1. 'PageName.html': The key must match the HTML file name.
// 2. label: The text that appears next to the button.
// 3. icon: An SVG string for the button's icon.
// 4. action: The name of the function to call on the page.
//    - 'myFunction': Calls `window.myFunction()` on the page.
//    - 'myButton_click': Simulates a click on the element with `id="myButton"`.
//    - 'navigate_PageName': Navigates to `PageName.html`.
// ============================================================

const fabPageActions = {
    'BookOrder.html': [
        { 
            label: 'Add Client', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>`, 
            action: 'navigate_Clients'
        },
        { 
            label: 'Add Customer', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`, 
            action: 'navigate_Customer' 
        },
        { 
            label: 'Delete Order', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
            action: 'deleteOrder' // Assumes a function `deleteOrder()` exists on the page
        },
        { 
            label: 'Update Order', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>`, 
            action: 'updateOrder' // Assumes a function `updateOrder()` exists on the page
        },
        { 
            label: 'Assign Carrier', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path stroke-linecap="round" stroke-linejoin="round" d="M18 8h1a1 1 0 011 1v5a1 1 0 01-1 1h-1" /></svg>`, 
            action: 'navigate_AssignCarrier'
        }
    ],
    'AssignCarrier.html': [
        { 
            label: 'Refresh List', 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M4 9a9 9 0 0115.12-4.38M20 20v-5h-5M20 15a9 9 0 01-15.12 4.38" /></svg>`, 
            action: 'refreshShipments' // Assumes a function `refreshShipments()` exists on the page
        }
    ]
};

