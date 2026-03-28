/* 
   EXOTICA - Exotic Car Rental Website
   Main JavaScript Logic - Standardized Components Version
*/

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check if we need to load common components
    const isExcludedPage = window.location.pathname.includes('login.html') || 
                          window.location.pathname.includes('register.html') || 
                          window.location.pathname.includes('dashboard.html');

    if (!isExcludedPage) {
        await initCommonComponents();
    }

    // 2. Initialize Core Logic
    initThemeManager();
    initScrollEffects();
    initSmoothScrolling();
    initBackToTop();
});

/**
 * Loads and initializes shared header and footer components
 */
async function initCommonComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        try {
            const response = await fetch('assets/components/header.html');
            const html = await response.text();
            headerPlaceholder.innerHTML = html;
            setActiveNavLink();
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    if (footerPlaceholder) {
        try {
            const response = await fetch('assets/components/footer.html');
            const html = await response.text();
            footerPlaceholder.innerHTML = html;
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }
}

/**
 * Sets the 'active' class on the current navigation link
 */
function setActiveNavLink() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    // Map of filenames to data-page attributes
    const pageMap = {
        'index.html': 'home-1',
        'home-2.html': 'home-2',
        'cars.html': 'cars',
        'car-details.html': 'cars',
        'about.html': 'about',
        'services.html': 'services',
        'blog.html': 'blog',
        'blog-details.html': 'blog',
        'contact.html': 'contact',
        'pricing.html': 'pricing'
    };

    const activePage = pageMap[page];
    if (activePage) {
        document.querySelectorAll(`.nav-link[data-page="${activePage}"]`).forEach(link => {
            link.classList.add('active');
        });
    }
}

/**
 * Theme Toggle Logic
 */
function initThemeManager() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });

    function updateThemeIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        } else {
            icon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        }
    }
}

/**
 * Header Scroll Effect
 */
function initScrollEffects() {
    // Note: Since header is injected, we use event delegation or re-query
    const updateHeader = () => {
        const header = document.querySelector('.main-header');
        if (!header) return;
        
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check
}

/**
 * Smooth Scrolling for internal links
 */
function initSmoothScrolling() {
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTop.className = 'btn btn-primary position-fixed bottom-0 end-0 m-4 d-none';
    backToTop.style.zIndex = '1000';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.remove('d-none');
        } else {
            backToTop.classList.add('d-none');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
