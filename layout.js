document.addEventListener('DOMContentLoaded', () => {
    const base = 'https://post4ex.github.io/postman/';
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const currentPage = window.location.pathname.split('/').pop() || 'main.html';

    // Function to initialize header scripts
    const initializeHeaderScripts = () => {
        const menuButton = document.getElementById('menuButton');
        const dropdownMenu = document.getElementById('dropdownMenu');
        if(menuButton && dropdownMenu) {
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
    };

    // Function to initialize footer scripts
    const initializeFooterScripts = () => {
        const contactModal = document.getElementById('contactModal');
        const contactButton = document.querySelector('#header-placeholder #contactButton'); // Scoped to header
        const contactButtonMobile = document.querySelector('#header-placeholder #contactButtonMobile'); // Scoped to header
        const closeContactModalButton = document.getElementById('closeContactModalButton');

        if(contactButton) contactButton.addEventListener('click', () => contactModal.classList.remove('hidden'));
        if(contactButtonMobile) contactButtonMobile.addEventListener('click', () => {
            contactModal.classList.remove('hidden');
            const dropdownMenu = document.getElementById('dropdownMenu');
            if(dropdownMenu) dropdownMenu.classList.add('hidden');
        });
        if(closeContactModalButton) closeContactModalButton.addEventListener('click', () => contactModal.classList.add('hidden'));
        if(contactModal) contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) contactModal.classList.add('hidden');
        });
    };

    // Fetch and inject header
    if (headerPlaceholder) {
        fetch(`${base}header.html`) // CORRECTED: No underscore
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load component from ${base}header.html`);
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                
                // Highlight the active navigation link
                const navId = `nav-${currentPage.replace('.html', '')}`;
                const activeLink = document.getElementById(navId);
                if (activeLink) {
                    activeLink.classList.remove('bg-blue-900', 'hover:bg-blue-800');
                    activeLink.classList.add('bg-blue-700', 'font-semibold');
                }
                initializeHeaderScripts();
                initializeFooterScripts(); // Call footer init after header is ready for contact buttons
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // Fetch and inject footer
    if (footerPlaceholder) {
        fetch(`${base}footer.html`) // CORRECTED: No underscore
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load component from ${base}footer.html`);
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                // Footer-specific scripts are already initialized above
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});

