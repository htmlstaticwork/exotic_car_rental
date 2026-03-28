/* 
   EXOTICA - Exotic Car Rental Website
   Main JavaScript Logic - Standardized Components Version
*/

// --- 1. IMMEDIATE INITIALIZATION (Prevents Flicker & Logic Errors) ---
// Note: This runs immediately as the script is loaded.
(function() {
    const savedTheme = localStorage.getItem('theme');
    const savedRTL = localStorage.getItem('rtl') === 'true';
    const html = document.documentElement;

    // Apply Theme
    if (savedTheme === 'dark') {
        // Use documentElement if body is not yet available
        html.classList.add('dark-mode');
        if (document.body) document.body.classList.add('dark-mode');
    }

    // Apply RTL
    if (savedRTL) {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
        // Note: Bootstrap CSS swap happens in syncInitialStates to ensure the link tag is accessible
    }
})();

document.addEventListener('DOMContentLoaded', async () => {
    // 2. Check if we need to load common components
    const isExcludedPage = window.location.pathname.includes('login.html') || 
                          window.location.pathname.includes('register.html') || 
                          window.location.pathname.includes('dashboard.html');

    if (!isExcludedPage) {
        await initCommonComponents();
    }

    // 2. Initialize Core Logic
    syncInitialStates(); // Synchronize all UI states
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
            // syncInitialStates will be called after this in DOMContentLoaded
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

// --- 3. EVENT DELEGATION (Robust handling for dynamic elements) ---
document.addEventListener('click', (e) => {
    // Theme Toggle Handler
    const themeToggle = e.target.closest('.theme-toggle');
    if (themeToggle) {
        const body = document.body;
        const html = document.documentElement;
        
        body.classList.toggle('dark-mode');
        html.classList.toggle('dark-mode'); // For consistency
        
        const currentlyDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
        updateAllThemeIcons(currentlyDark);
        return;
    }

    // RTL Toggle Handler
    const rtlToggle = e.target.closest('.rtl-toggle');
    if (rtlToggle) {
        const html = document.documentElement;
        const isCurrentlyRTL = html.getAttribute('dir') === 'rtl';
        applyRTL(!isCurrentlyRTL);
        return;
    }
});

/**
 * Synchronizes all UI elements with saved preferences
 */
function syncInitialStates() {
    const savedTheme = localStorage.getItem('theme');
    const savedRTL = localStorage.getItem('rtl') === 'true';
    
    // Theme Sync
    const isDark = savedTheme === 'dark';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
    }
    updateAllThemeIcons(isDark);

    // RTL Sync
    applyRTL(savedRTL);
}

/**
 * Updates all theme toggle icons across the document
 */
function updateAllThemeIcons(isDark) {
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
        if (isDark) {
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
        } else {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
        }
    });
}

/**
 * Applies RTL or LTR attributes and stylesheets
 */
function applyRTL(enable) {
    const html = document.documentElement;
    const bootstrapCss = document.getElementById('bootstrap-css');
    
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
    
    // Update any RTL specific components or icons if needed
}

/**
 * Header Scroll Effect
 */
function initScrollEffects() {
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
    updateHeader();
}

/**
 * Smooth Scrolling
 */
function initSmoothScrolling() {
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor && anchor.getAttribute('href') !== '#') {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

/**
 * Back to Top
 */
function initBackToTop() {
    // Only add if not already present
    if (document.querySelector('.back-to-top')) return;

    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTop.className = 'btn btn-primary position-fixed bottom-0 end-0 m-4 d-none back-to-top';
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
