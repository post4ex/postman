// ============================================================
// FLOATING ACTION BUTTON (FAB) ENGINE
// This file contains all the logic to make the FAB work.
// It reads the configuration from fab-config.js and builds
// the buttons automatically. You should not need to edit this file.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // This needs to run after the main layout has finished loading components.
    // A small delay ensures the footer and FAB HTML are present.
    setTimeout(() => {
        const fabContainer = document.getElementById('fab-container');
        if (!fabContainer) {
            // This can happen if the footer isn't loaded yet. Silently fail.
            return;
        }

        const fabMain = document.getElementById('fab-main');
        const fabActions = document.getElementById('fab-actions');

        function initializeFab() {
            if (typeof fabPageActions === 'undefined') {
                console.warn('FAB configuration (fab-config.js) not found.');
                fabContainer.classList.add('hidden');
                return;
            }

            const currentPage = window.location.pathname.split('/').pop();
            const actions = fabPageActions[currentPage];

            if (!actions || actions.length === 0) {
                fabContainer.classList.add('hidden'); // Hide FAB if no actions for this page
                return;
            }

            // If there are actions, make sure the button is visible
            fabContainer.classList.remove('hidden');

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

        fabMain.addEventListener('click', (e) => {
            e.stopPropagation();
            fabContainer.classList.toggle('active');
        });

        fabActions.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = e.target.closest('.fab-action');
            if (target) {
                const action = target.dataset.action;
                
                // This is the magic: it finds the function on the page and calls it.
                if (window[action] && typeof window[action] === 'function') {
                    window[action]();
                } 
                // Special case for triggering button clicks, e.g., action: 'book_button_click'
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
                
                fabContainer.classList.remove('active');
            }
        });

        document.addEventListener('click', () => {
            fabContainer.classList.remove('active');
        });

        initializeFab();
    }, 500); // A 500ms delay is robust enough to wait for layout.js to finish loading components.
});

