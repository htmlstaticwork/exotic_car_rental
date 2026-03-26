/* 
   EXOTICA - Dashboard Specific Logic
*/

document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle for Mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Dashboard Tab Switching (Sections)
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
    const sections = document.querySelectorAll('.section-content');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                e.preventDefault();

                // Update Active Link State
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Toggle Visibility of Sections
                sections.forEach(sec => {
                    if (sec.id === targetId) {
                        sec.classList.remove('d-none');
                    } else {
                        sec.classList.add('d-none');
                    }
                });

                // Auto-close sidebar on mobile
                if (window.innerWidth <= 1100 && sidebar) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });

    // Logout functionality (Simulation)
    const logoutBtn = document.querySelector('.sidebar-link.text-danger');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            if (!confirm('Are you sure you want to log out of the executive portal?')) {
                e.preventDefault();
            }
        });
    }

    // Dynamic Greeting (Simple extra touch)
    const greeting = document.querySelector('.main-content h2 span');
    if (greeting) {
        const hour = new Date().getHours();
        let timeText = 'Overview';
        if (hour < 12) timeText = 'Morning Brief';
        else if (hour < 18) timeText = 'Afternoon Brief';
        else timeText = 'Evening Brief';
        // Only update if it contains "Overview"
        if (greeting.textContent.includes('Overview')) {
            greeting.textContent = timeText;
        }
    }
});
