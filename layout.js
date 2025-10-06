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
 * Checks login status from localStorage and updates the UI accordingly.
 */
function checkLoginStatus() {
    const loginDataJSON = localStorage.getItem('loginData');
    
    // Auth-related elements
    const loginButton = document.getElementById('login-button');
    const profileSection = document.getElementById('profile-section');
    const loginButtonMobile = document.getElementById('login-button-mobile');
    const profileSectionMobile = document.getElementById('profile-section-mobile');
    const searchButtonPrivate = document.getElementById('nav-search-private');
    const manualRefreshButton = document.getElementById('manual-refresh-button');

    // Navigation sections
    const mainNavPublic = document.getElementById('main-nav-public');
    const mainNavPrivate = document.getElementById('main-nav-private');
    const dropdownPublicLinks = document.getElementById('dropdown-public-links');
    const dropdownPrivateLinks = document.getElementById('dropdown-private-links');
    
    // Sidebar elements
    const sidebarToggleContainer = document.getElementById('sidebar-toggle-container');
    const ledgerMenuItem = document.getElementById('ledger-menu-item');
    const mastersMenuItem = document.getElementById('masters-menu-item');

    let isLoggedIn = false;
    let userData = null;
    if (loginDataJSON) {
        try {
            const loginData = JSON.parse(loginDataJSON);
            const now = new Date().getTime();
            if (loginData.expires && now <= loginData.expires) {
                isLoggedIn = true;
                userData = loginData;
            } else {
                localStorage.removeItem('loginData');
                localStorage.removeItem('appData');
            }
        } catch (e) {
            console.error("Failed to parse login data from localStorage", e);
            localStorage.removeItem('loginData');
        }
    }

    if (isLoggedIn && userData) {
        // --- UI for LOGGED IN user ---
        loginButton.classList.add('hidden');
        profileSection.classList.remove('hidden');
        searchButtonPrivate.classList.remove('hidden');
        manualRefreshButton.classList.remove('hidden');
        loginButtonMobile.classList.add('hidden');
        profileSectionMobile.classList.remove('hidden');
        
        mainNavPublic.classList.add('hidden');
        mainNavPrivate.classList.remove('hidden');
        dropdownPublicLinks.classList.add('hidden');
        dropdownPrivateLinks.classList.remove('hidden');
        
        sidebarToggleContainer.classList.remove('hidden');
        
        const profileFieldsToShow = ['name', 'code', 'role', 'branch', 'email', 'mobile', 'token'];
        
        const populateDetails = (container, templateGenerator) => {
            if (container) {
                container.innerHTML = ''; 
                profileFieldsToShow.forEach(field => {
                    const userDataKey = Object.keys(userData).find(k => k.toLowerCase() === field);
                    if (userDataKey && userData[userDataKey]) {
                        const displayKey = field.charAt(0).toUpperCase() + field.slice(1);
                        container.appendChild(templateGenerator(displayKey, userData[userDataKey]));
                    }
                });
            }
        };

        populateDetails(document.getElementById('profile-details-container'), (key, value) => {
            const detailEl = document.createElement('div');
            detailEl.innerHTML = `<p class="text-sm"><strong class="font-semibold text-gray-600">${key}:</strong> <span class="text-gray-800">${value}</span></p>`;
            return detailEl;
        });

        populateDetails(document.getElementById('mobile-profile-details-container'), (key, value) => {
            const detailEl = document.createElement('div');
            detailEl.innerHTML = `<p class="text-xs text-white"><strong class="font-semibold text-gray-300">${key}:</strong> <span>${value}</span></p>`;
            return detailEl;
        });

        const userRole = userData.ROLE ? userData.ROLE.trim().toUpperCase() : null;
        if (ledgerMenuItem && mastersMenuItem) {
            if (userRole === 'CLIENT' || userRole === 'BRANCH') {
                ledgerMenuItem.classList.add('hidden');
                mastersMenuItem.classList.add('hidden');
            } else {
                ledgerMenuItem.classList.remove('hidden');
                mastersMenuItem.classList.remove('hidden');
            }
        }

    } else {
        // --- UI for LOGGED OUT user ---
        loginButton.classList.remove('hidden');
        profileSection.classList.add('hidden');
        searchButtonPrivate.classList.add('hidden');
        manualRefreshButton.classList.add('hidden');
        loginButtonMobile.classList.remove('hidden');
        profileSectionMobile.classList.add('hidden');

        mainNavPublic.classList.remove('hidden');
        mainNavPrivate.classList.add('hidden');
        dropdownPublicLinks.classList.remove('hidden');
        dropdownPrivateLinks.classList.add('hidden');

        sidebarToggleContainer.classList.add('hidden');
        if (ledgerMenuItem) ledgerMenuItem.classList.add('hidden');
        if (mastersMenuItem) mastersMenuItem.classList.add('hidden');
    }
}

let silentRefreshInterval = null;

function initializeUI() {
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    const profileLogoutButton = document.getElementById('profile-logout-button');
    const logoutButtonMobile = document.getElementById('logout-button-mobile');
    
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const manualRefreshButton = document.getElementById('manual-refresh-button');
    
    if (menuButton && dropdownMenu) {
        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });
    }

    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', (event) => {
            event.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });
    }

    if (manualRefreshButton) {
        const staticIcon = document.getElementById('refresh-icon-static');
        const spinningIcon = document.getElementById('refresh-icon-spinning');

        manualRefreshButton.addEventListener('click', async () => {
            staticIcon.classList.add('hidden');
            spinningIcon.classList.remove('hidden');
            manualRefreshButton.disabled = true;

            try {
                await verifyAndFetchAppData(true); // Force refresh
            } catch (error) {
                console.error("Manual refresh failed:", error);
            } finally {
                staticIcon.classList.remove('hidden');
                spinningIcon.classList.add('hidden');
                manualRefreshButton.disabled = false;
            }
        });
    }

    document.addEventListener('click', (event) => {
        if (dropdownMenu && !dropdownMenu.contains(event.target) && menuButton && !menuButton.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
        if (profileDropdown && !profileDropdown.contains(event.target) && profileButton && !profileButton.contains(event.target)) {
            profileDropdown.classList.add('hidden');
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('loginData');
        localStorage.removeItem('appData');
        if (silentRefreshInterval) {
            clearInterval(silentRefreshInterval);
        }
        window.location.href = 'https://post4ex.github.io/postman/login.html';
    };
    if (profileLogoutButton) profileLogoutButton.addEventListener('click', handleLogout);
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

const setActiveNavOnLoad = () => {
    const path = window.location.pathname;
    let pageId = 'home'; 
    if (path.includes('dashboard.html')) pageId = 'home';
    else if (path.includes('Pincode.html')) pageId = 'pincode';
    else if (path.includes('complaint.html')) pageId = 'complaint';
    else if (path.includes('BookOrder.html')) pageId = 'bookorder';
    else if (path.includes('tracking.html')) pageId = 'tracking';
    else if (path.includes('Calculator.html')) pageId = 'calculator';
    else if (path.includes('ticket.html')) pageId = 'ticket';
    else if (path.includes('task.html')) pageId = 'task';
    else if (path.includes('wallet.html')) pageId = 'wallet';
    else if (path.includes('search.html')) pageId = 'search';
    
    setTimeout(() => {
        document.querySelectorAll('a[id^="nav-"], a[id^="dropdown-"]').forEach(link => {
            const linkId = link.id || '';
            const linkPage = linkId.split('-')[1];

            link.classList.remove('bg-gray-600', 'font-bold');
             if (!link.id.includes('search')) {
                 link.classList.add('bg-blue-900');
            }

            if (linkPage === pageId) {
                link.classList.remove('bg-blue-900');
                link.classList.add('bg-gray-600', 'font-bold');
            }
        });
    }, 150);
};

async function verifyAndFetchAppData(force = false) {
    const loginDataJSON = localStorage.getItem('loginData');
    if (!loginDataJSON) return;
    
    const appDataJSON = localStorage.getItem('appData');
    if (appDataJSON && !force) {
        try {
            const appData = JSON.parse(appDataJSON);
            if (new Date().getTime() < appData.expires) {
                console.log('App data exists and is valid. Skipping fetch.');
                startSilentRefresh();
                return;
            }
        } catch (e) {
            console.error('Could not parse appData from localStorage.', e);
        }
    }

    try {
        const loginData = JSON.parse(loginDataJSON);
        const code = loginData.CODE || loginData.code;
        const token = loginData.TOKEN || loginData.token;

        if (!code || !token) {
            console.error('Code or Token is missing from login data.');
            return;
        }

        const DATA_LOADER_URL = 'https://script.google.com/macros/s/AKfycbwq2ZIniCkLN-3SCaPKgVhy74Rqpt9b9Kovz1ANj2z0Iwg-Ad3jHC9N3xrYatDnbpwR5A/exec';
        
        console.log(force ? 'Forcing data refresh...' : 'Verifying token and fetching initial application data...');
        const response = await fetch(`${DATA_LOADER_URL}?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`);

        if (!response.ok) {
            throw new Error(`Network error while fetching app data: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
            const expiry = new Date().getTime() + (2 * 60 * 60 * 1000); // 2 hours
            const appDataToStore = {
                data: result.data,
                expires: expiry
            };
            localStorage.setItem('appData', JSON.stringify(appDataToStore));
            console.log('App data was fetched and stored successfully.');
            
            startSilentRefresh();
            
            window.dispatchEvent(new CustomEvent('appDataLoaded', { detail: result.data }));
        } else {
            console.error('Failed to verify and fetch app data:', result.message);
        }

    } catch (error) {
        console.error('An unexpected error occurred during app data fetch:', error);
    }
}

function startSilentRefresh() {
    if (silentRefreshInterval) {
        clearInterval(silentRefreshInterval);
    }

    const FIVE_MINUTES = 5 * 60 * 1000;
    
    silentRefreshInterval = setInterval(async () => {
        const loginDataJSON = localStorage.getItem('loginData');
        if (!loginDataJSON) {
            clearInterval(silentRefreshInterval);
            return;
        }

        try {
            const loginData = JSON.parse(loginDataJSON);
            const code = loginData.CODE || loginData.code;
            const token = loginData.TOKEN || loginData.token;
            if (!code || !token) return;

            console.log('Performing silent data refresh...');
            const DATA_LOADER_URL = 'https://script.google.com/macros/s/AKfycbwq2ZIniCkLN-3SCaPKgVhy74Rqpt9b9Kovz1ANj2z0Iwg-Ad3jHC9N3xrYatDnbpwR5A/exec';
            const response = await fetch(`${DATA_LOADER_URL}?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`);
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const appDataJSON = localStorage.getItem('appData');
                    if (appDataJSON) {
                        const existingAppData = JSON.parse(appDataJSON);
                        existingAppData.data = result.data;
                        localStorage.setItem('appData', JSON.stringify(existingAppData));
                        console.log('Silent data refresh successful.');
                         window.dispatchEvent(new CustomEvent('appDataRefreshed', { detail: result.data }));
                    }
                }
            }
        } catch (error) {
            console.error('Silent refresh failed:', error);
        }
    }, FIVE_MINUTES);
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const protectedPages = [
        'dashboard.html', 'BookOrder.html', 'tracking.html', 'Calculator.html', 
        'ticket.html', 'task.html', 'wallet.html', 'search.html', 'uploader.html'
    ];
    const isProtected = protectedPages.some(page => path.includes(page));

    let isLoggedIn = false;
    const loginDataJSON = localStorage.getItem('loginData');
    if (loginDataJSON) {
        const loginData = JSON.parse(loginDataJSON);
        if (new Date().getTime() <= loginData.expires) {
            isLoggedIn = true;
        }
    }

    if (isProtected && !isLoggedIn) {
        window.location.href = 'https://post4ex.github.io/postman/login.html';
        return; 
    }

    Promise.all([
        loadComponent('https://post4ex.github.io/postman/header.html', 'header-placeholder'),
        loadComponent('https://post4ex.github.io/postman/footer.html', 'footer-placeholder')
    ]).then(() => {
        initializeUI();
        setActiveNavOnLoad();
        
        if (isLoggedIn) {
            verifyAndFetchAppData();
        }
        
        if (path.includes('main.html') || path.endsWith('/postman/') || path.endsWith('/')) {
            loadDynamicContent('https://post4ex.github.io/postman/tracking.html', 'tracking-content-area');
            loadDynamicContent('https://post4ex.github.io/postman/services.html', 'services-content-area');

            const trackingArea = document.getElementById('tracking-content-area');
            const servicesArea = document.getElementById('services-content-area');
            if (trackingArea && servicesArea) {
                const observer = new MutationObserver(() => {
                    const resultsContainer = trackingArea.querySelector('#results-container');
                    const searchButton = trackingArea.querySelector('#tracking-search-button');

                    if (resultsContainer && resultsContainer.innerHTML.trim() !== '' && !resultsContainer.classList.contains('hidden')) {
                        servicesArea.classList.add('hidden');
                    }

                    if (searchButton && !searchButton.hasAttribute('data-listener-added')) {
                        searchButton.addEventListener('click', () => {
                            if (servicesArea) {
                                servicesArea.classList.remove('hidden');
                            }
                        });
                        searchButton.setAttribute('data-listener-added', 'true');
                    }
                });
                observer.observe(trackingArea, { childList: true, subtree: true });
            }
        }
    }).catch(error => {
        console.error("Failed to initialize page layout:", error);
    });
});

