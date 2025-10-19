// ============================================================
// FLOATING ACTION BUTTON (FAB) ENGINE
// This file contains all the logic to make the FAB work.
// It reads the configuration from fab-config.js and builds
// the buttons automatically. You should not need to edit this file.
// ============================================================

// MODIFIED: Wait for the 'footerLoaded' event from layout.js to prevent race conditions
window.addEventListener('footerLoaded', () => {
    const fabContainer = document.getElementById('fab-container');
    if (!fabContainer) {
        console.error('FAB Error: fab-container element not found in the footer.');
        return;
    }

    const fabMain = document.getElementById('fab-main');
    const fabActions = document.getElementById('fab-actions');

    function initializeFab() {
        // Check if the configuration object from fab-config.js exists
        if (typeof fabPageActions === 'undefined') {
            console.warn('FAB configuration (fab-config.js) not found.');
            fabContainer.classList.add('hidden');
            return;
        }

        // Get the current page's filename (e.g., "BookOrder.html")
        const currentPage = window.location.pathname.split('/').pop();
        const actions = fabPageActions[currentPage];

        // If there are no actions defined for the current page, hide the FAB
        if (!actions || actions.length === 0) {
            fabContainer.classList.add('hidden');
            return;
        }

        // If actions exist, ensure the FAB is visible
        fabContainer.classList.remove('hidden');

        // Clear any previous actions and build the new ones
        fabActions.innerHTML = '';
        actions.forEach(action => {
            const actionButton = document.createElement('a');
            actionButton.className = 'fab-action';
            actionButton.setAttribute('data-action', action.action);
            actionButton.innerHTML = `
                <span class="fab-action-label">${action.label}</span>
                <div class="fab-action-icon">${action.icon}</div>
            `;
            fabActions.appendChild(actionButton);
        });
    }

    // Event listener for the main FAB to open/close the menu
    fabMain.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the document click listener from closing it immediately
        fabContainer.classList.toggle('active');
    });

    // Event listener for the action buttons container
    fabActions.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent clicks on the menu from closing it
        const target = e.target.closest('.fab-action');
        if (target) {
            const action = target.dataset.action;
            
            // This is the core logic: it finds a function on the page with the specified name and calls it
            if (window[action] && typeof window[action] === 'function') {
                window[action]();
            } 
            // This allows triggering clicks on buttons, e.g., 'book_button_click'
            else if (action.endsWith('_click')) {
                 const buttonId = action.replace('_click', '');
                 const button = document.getElementById(buttonId);
                 if(button) {
                     button.click();
                 } else {
                    console.warn(`FAB action error: Button with ID "${buttonId}" not found.`);
                 }
            } 
            else {
                console.warn(`FAB action error: Function named "${action}" was not found on this page (window object).`);
            }
            
            // Close the menu after an action is clicked
            fabContainer.classList.remove('active');
        }
    });

    // Add a global listener to close the FAB menu when clicking anywhere else on the page
    document.addEventListener('click', () => {
        fabContainer.classList.remove('active');
    });

    // Initialize the FAB logic
    initializeFab();
});

