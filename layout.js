document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const basePath = 'https://post4ex.github.io/postman/';

    // Determine the current page to set the active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'main.html';

    const loadComponent = async (url, element) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const text = await response.text();
                element.innerHTML = text;
            } else {
                element.innerHTML = `<p class="text-red-500 text-center">Failed to load component from ${url}</p>`;
            }
        } catch (error) {
            console.error(`Error fetching component from ${url}:`, error);
            element.innerHTML = `<p class="text-red-500 text-center">Could not load content.</p>`;
        }
    };

    const setActiveNav = () => {
        const navLinks = document.querySelectorAll('#main-nav a, #dropdownMenu a');
        navLinks.forEach(link => {
            const linkPage = link.href.split('/').pop();
            // Default 'main.html' for root link
            const targetPage = (linkPage === '' || linkPage === 'postman') ? 'main.html' : linkPage;

            if (targetPage === currentPage) {
                link.classList.remove('bg-blue-900', 'hover:bg-blue-800');
                link.classList.add('bg-blue-700', 'font-semibold');
            }
        });
    };

    const initializeLayoutScripts = () => {
        const menuButton = document.getElementById('menuButton');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const contactModal = document.getElementById('contactModal');
        
        if (contactModal) {
            const contactButton = document.getElementById('contactButton');
            const contactButtonMobile = document.getElementById('contactButtonMobile');
            const closeContactModalButton = document.getElementById('closeContactModalButton');

            if (contactButton) contactButton.addEventListener('click', () => contactModal.classList.remove('hidden'));
            if (contactButtonMobile) contactButtonMobile.addEventListener('click', () => {
                contactModal.classList.remove('hidden');
                if (dropdownMenu) dropdownMenu.classList.add('hidden');
            });
            if (closeContactModalButton) closeContactModalButton.addEventListener('click', () => contactModal.classList.add('hidden'));
            contactModal.addEventListener('click', (e) => {
                if (e.target === contactModal) contactModal.classList.add('hidden');
            });
        }

        if (menuButton && dropdownMenu) {
             menuButton.addEventListener('click', (event) => {
                event.stopPropagation();
                dropdownMenu.classList.toggle('hidden');
            });
            document.addEventListener('click', (event) => {
                if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                    dropdownMenu.classList.add('hidden');
                }
            });
        }
        // Set the active navigation link style
        setActiveNav();
    };

    // Load header and footer, then initialize their scripts
    Promise.all([
        loadComponent(`${basePath}_header.html`, headerPlaceholder),
        loadComponent(`${basePath}_footer.html`, footerPlaceholder)
    ]).then(() => {
        initializeLayoutScripts();
    });
});
