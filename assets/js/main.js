/* 
   EXOTICA - Exotic Car Rental Website
   Main JavaScript Logic - Standardized Components Version
*/

// 1. Immediate Theme Application (Minimizes Flicker)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

document.addEventListener('DOMContentLoaded', async () => {
    // 2. Check if we need to load common components
    const isExcludedPage = window.location.pathname.includes('login.html') || 
                          window.location.pathname.includes('register.html') || 
                          window.location.pathname.includes('dashboard.html');

    if (!isExcludedPage) {
        await initCommonComponents();
    }

    // 2. Initialize Core Logic
    initThemeManager();
    initRTLManager(); // Added RTL Manager
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
            // Re-init managers after common components loaded
            initThemeManager();
            initRTLManager();
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
    
    // Synchronize Initial State
    const isDark = savedTheme === 'dark';
    if (isDark) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
    updateThemeIcon(isDark);

    // Remove existing listener to prevent duplicates if re-initialized
    const newToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newToggle, themeToggle);

    newToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const currentlyDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
        updateThemeIcon(currentlyDark);
    });

    function updateThemeIcon(isDark) {
        const icon = newToggle.querySelector('i');
        if (!icon) return;
        
        if (isDark) {
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
        } else {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
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

/**
 * RTL Management Logic
 */
function initRTLManager() {
    const rtlToggle = document.getElementById('rtl-toggle');
    const bootstrapCss = document.getElementById('bootstrap-css');
    const html = document.documentElement;
    
    // Initial Setup from LocalStorage
    const savedRTL = localStorage.getItem('rtl') === 'true';
    if (savedRTL) {
        applyRTL(true);
    }

    if (!rtlToggle) return;

    // Remove existing listeners to avoid duplicates if re-inited
    const newToggle = rtlToggle.cloneNode(true);
    rtlToggle.parentNode.replaceChild(newToggle, rtlToggle);

    newToggle.addEventListener('click', () => {
        const isCurrentlyRTL = html.getAttribute('dir') === 'rtl';
        applyRTL(!isCurrentlyRTL);
    });

    function applyRTL(enable) {
        if (enable) {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
            if (bootstrapCss) {
                bootstrapCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css';
            }
            localStorage.setItem('rtl', 'true');
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            if (bootstrapCss) {
                bootstrapCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
            }
            localStorage.setItem('rtl', 'false');
        }
    }
}
