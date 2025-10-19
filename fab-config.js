// ============================================================
// FLOATING ACTION BUTTON (FAB) CONFIGURATION BLUEPRINT
// ============================================================
// This is the only file you need to edit to add, remove,
// or change the floating buttons that appear on each page.
//
// HOW IT WORKS:
// 1. The key (e.g., 'BookOrder.html') is the name of the page.
// 2. 'label': The text that appears next to the button.
// 3. 'icon': The SVG icon for the button.
// 4. 'action': The EXACT name of the JavaScript function that
//    should be called when the button is clicked. This function
//    must already exist on that specific page.
// ============================================================

const fabPageActions = {
    'BookOrder.html': [
        { 
            label: 'Clear All', 
            icon: `<svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`, 
            action: 'resetFullForm' // Connects to the resetFullForm() function on BookOrder.html
        },
        { 
            label: 'Book Order', 
            icon: `<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`, 
            action: 'book_button_click' // This will trigger a click on the button with id="book_button"
        }
    ],
    'AssignCarrier.html': [
        { 
            label: 'Refresh List', 
            icon: `<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 11A8.995 8.995 0 0013 4.055M4 9a9 9 0 0115.12-4.38M20 20v-5h-5"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15a9 9 0 0115.12 4.38"></path></svg>`, 
            action: 'fetchShipments' // Connects to the fetchShipments() function on AssignCarrier.html
        }
    ]
    // Add more pages here as needed
};

