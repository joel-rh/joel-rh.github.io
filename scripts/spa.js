window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-include]').forEach(el => {
        fetch(el.getAttribute('data-include'))
            .then(res => res.text())
            .then(html => {
                el.innerHTML = html;
                el.classList.add('fade-in');
            });
    });

    function updateActiveLink(page) {
        document.querySelectorAll('.menu-links a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${page}`);
        });
    }

    function loadPage(page, isInitialLoad = false) {
        const main = document.getElementById('spa-content');
        if (!isInitialLoad) {
            main.classList.remove('fade-in');
            main.classList.add('fade-out');
        }
        setTimeout(() => {
            fetch(`pages/${page}.html`)
                .then(res => {
                    if (!res.ok) throw new Error(`Page ${page} not found`);
                    return res.text();
                })
                .then(html => {
                    main.innerHTML = html; 
                    main.classList.remove('fade-out');
                    main.classList.add('fade-in'); 
                    updateActiveLink(page); // Update the active link
                })
                .catch(err => {
                    console.error(err);
                    main.innerHTML = `<p>Error loading page: ${page}</p>`;
                });
        }, !isInitialLoad ? 300 : 0); 
    }

    const initialPage = window.location.hash.replace('#', '') || 'home';
    fetch(`pages/${initialPage}.html`)
        .then(res => res.text())
        .then(html => {
            const main = document.getElementById('spa-content');
            main.innerHTML = html;
            setTimeout(() => {
                main.classList.add('fade-in'); 
            }, 0);
            updateActiveLink(initialPage); // Set the active link on initial load
        });

    document.body.addEventListener('click', e => {
        const link = e.target.closest('a[data-spa="true"]');
        if (link) {
            e.preventDefault();
            const page = link.getAttribute('href').replace('#', '');
            loadPage(page);
            window.location.hash = page;
        }
    });

    window.addEventListener('hashchange', () => {
        const page = window.location.hash.replace('#', '') || 'home';
        loadPage(page);
    });
});