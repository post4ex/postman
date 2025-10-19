// This is the FAB "Engine" file. You should not need to edit it.

// Self-invoking function to encapsulate all FAB logic.
(() => {
    let fabContainer;

    // This function builds the button menu based on the current page.
    function initializeFAB() {
        fabContainer = document.getElementById('fab-container');
        const fabMain = document.getElementById('fab-main');
        const fabActions = document.getElementById('fab-actions');

        if (!fabContainer || !fabMain || !fabActions) {
            console.error('FAB HTML structure not found.');
            return;
        }

        // Determine the current page filename (e.g., "BookOrder.html")
        const path = window.location.pathname;
        const currentPage = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

        // Check if the fabPageActions configuration is loaded
        if (typeof fabPageActions === 'undefined') {
            console.error('fabPageActions configuration is not loaded.');
            return;
        }

        const globalActions = fabPageActions.global || [];
        const pageSpecificActions = fabPageActions[currentPage] || [];
        const actionsToShow = [...pageSpecificActions, ...globalActions];


        if (actionsToShow.length === 0) {
            fabContainer.classList.add('hidden');
            return;
        }

        // If there are actions, make sure the container is visible
        fabContainer.classList.remove('hidden');

        // Clear any previous actions and build the new ones.
        fabActions.innerHTML = '';
        actionsToShow.forEach(action => {
            const actionElement = document.createElement('div');
            actionElement.className = 'fab-action';
            
            // Create the label
            const label = document.createElement('span');
            label.className = 'fab-action-label';
            label.textContent = action.label;
            
            // Create the icon container
            const iconContainer = document.createElement('div');
            iconContainer.className = 'fab-action-icon';
            iconContainer.innerHTML = action.icon; // Use the SVG string from the config
            
            actionElement.appendChild(label);
            actionElement.appendChild(iconContainer);

            // Add the click event listener
            actionElement.addEventListener('click', () => {
                // Special handling for navigation actions
                if (action.action.startsWith('navigate_')) {
                    const url = action.action.split('_')[1];
                    // Check if it's an external link
                    if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('https:')) {
                        window.open(url, '_blank');
                    } else {
                        window.location.href = url;
                    }
                } else {
                    // Dispatch a custom event for page-specific functions
                    window.dispatchEvent(new CustomEvent('fabAction', { detail: { action: action.action } }));
                }
                // Close the menu after an action is triggered
                fabContainer.classList.remove('active');
            });
            
            fabActions.appendChild(actionElement);
        });

        // Main button listener to toggle the menu
        fabMain.addEventListener('click', (e) => {
            e.stopPropagation();
            fabContainer.classList.toggle('active');
        });
    }

    // This is the trigger. It waits until the footer is fully loaded.
    window.addEventListener('footerLoaded', initializeFAB);

    // Add a listener to close the FAB menu if the user clicks anywhere else on the page.
    document.addEventListener('click', () => {
        if (fabContainer && fabContainer.classList.contains('active')) {
            fabContainer.classList.remove('active');
        }
    });

})();

