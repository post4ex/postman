document.addEventListener('DOMContentLoaded', () => {
    const base = 'https://post4ex.github.io/postman/';
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const currentPage = window.location.pathname.split('/').pop() || 'main.html';

    const initializeHeaderScripts = () => {
        const menuButton = document.getElementById('menuButton');
        const dropdownMenu = document.getElementById('dropdownMenu');
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
    };

    const initializeFooterScripts = () => {
        const contactModal = document.getElementById('contactModal');
        const contactButton = document.querySelector('#header-placeholder #contactButton');
        const contactButtonMobile = document.querySelector('#header-placeholder #contactButtonMobile');
        const closeContactModalButton = document.getElementById('closeContactModalButton');

        const openModal = () => contactModal.classList.remove('hidden');
        const closeModal = () => contactModal.classList.add('hidden');

        if (contactButton) contactButton.addEventListener('click', openModal);
        if (contactButtonMobile) {
            contactButtonMobile.addEventListener('click', () => {
                openModal();
                const dropdownMenu = document.getElementById('dropdownMenu');
                if (dropdownMenu) dropdownMenu.classList.add('hidden');
            });
        }
        if (closeContactModalButton) closeContactModalButton.addEventListener('click', closeModal);
        if (contactModal) contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) closeModal();
        });
    };

    if (headerPlaceholder) {
        fetch(`${base}header.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load component from ${base}header.html`);
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                const navId = `nav-${currentPage.replace('.html', '')}`;
                const activeLink = document.getElementById(navId);
                if (activeLink) {
                    activeLink.classList.remove('bg-blue-900', 'hover:bg-blue-800');
                    activeLink.classList.add('bg-blue-700', 'font-semibold');
                }
                initializeHeaderScripts();
                if (footerPlaceholder.innerHTML) {
                    initializeFooterScripts();
                }
            })
            .catch(error => console.error('Error loading header:', error));
    }

    if (footerPlaceholder) {
        fetch(`${base}footer.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load component from ${base}footer.html`);
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                if (headerPlaceholder.innerHTML) {
                    initializeFooterScripts();
                }
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});

