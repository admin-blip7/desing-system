/* ═══════════════════════════════════════════════
     22 ELECTRONIC DESIGN SYSTEM - MAIN SCRIPT
     ═══════════════════════════════════════════════ */

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════
     THEME MANAGEMENT
     ═══════════════════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Check for saved theme preference or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Toggle theme function
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Animate theme change
    gsap.from('body', {
        opacity: 0.8,
        duration: 0.3,
        ease: 'power2.out'
    });
}

// Update theme icon
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('ph-sun');
        themeIcon.classList.add('ph-moon');
    } else {
        themeIcon.classList.remove('ph-moon');
        themeIcon.classList.add('ph-sun');
    }
}

// Theme toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

/* ═══════════════════════════════════════════════
     GSAP INTRO ANIMATIONS
     ═══════════════════════════════════════════════ */
function initIntroAnimations() {
    // Hero section animations
    gsap.from('.reveal-text', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2
    });

    // Sidebar animation
    gsap.from('.sidebar', {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
    });

    // Main content fade in
    gsap.from('main', {
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
    });
}

/* ═══════════════════════════════════════════════
     SCROLL ANIMATIONS
     ═══════════════════════════════════════════════ */
function initScrollAnimations() {
    // Animate sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section.children, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });
    });

    // Animate cards on scroll
    gsap.utils.toArray('.hover-lift').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
    });
}

/* ═══════════════════════════════════════════════
      NAVIGATION ACTIVE STATE + PROGRESS
      ═══════════════════════════════════════════════ */
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('progressBar');

    function updateActiveNav() {
        let current = '';
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        // Update progress bar
        if (progressBar) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / scrollHeight) * 100;
            progressBar.style.height = `${scrollPercent}%`;
        }
    }

    // Update on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Initial call
    updateActiveNav();

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ═══════════════════════════════════════════════
     COPY TO CLIPBOARD FUNCTION
     ═══════════════════════════════════════════════ */
function copyColor(color) {
    navigator.clipboard.writeText(color).then(() => {
        showToast(`Color copied: ${color}`);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy color', true);
    });
}

function copyIcon(iconName) {
    navigator.clipboard.writeText(iconName).then(() => {
        showToast(`Icon copied: ${iconName}`);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy icon', true);
    });
}

/* ═══════════════════════════════════════════════
     TOAST NOTIFICATION
     ═══════════════════════════════════════════════ */
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    
    if (!toast || !toastMsg) return;
    
    toastMsg.innerText = message;
    
    // Update toast icon based on error state
    const toastIcon = toast.querySelector('i');
    if (isError) {
        toastIcon.classList.remove('ph-check-circle', 'text-accent');
        toastIcon.classList.add('ph-warning-circle', 'text-red-500');
    } else {
        toastIcon.classList.remove('ph-warning-circle', 'text-red-500');
        toastIcon.classList.add('ph-check-circle', 'text-accent');
    }
    
    // Show toast
    toast.classList.remove('translate-y-24', 'opacity-0');
    
    // Hide after delay
    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 2000);
}

/* ═══════════════════════════════════════════════
     SEARCH FUNCTIONALITY
     ═══════════════════════════════════════════════ */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            const sectionId = section.getAttribute('id');
            
            if (searchTerm === '' || text.includes(searchTerm)) {
                section.style.display = 'block';
                
                // Highlight matching sections
                if (searchTerm !== '' && text.includes(searchTerm)) {
                    section.classList.add('search-highlight');
                    gsap.to(section, {
                        backgroundColor: 'var(--accent-dim)',
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1,
                        onComplete: () => {
                            section.classList.remove('search-highlight');
                        }
                    });
                }
            } else {
                section.style.display = 'none';
            }
        });
    });
    
    // Clear search on Escape key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
        }
    });
}

/* ═══════════════════════════════════════════════
     PRODUCT CARD INTERACTIONS
     ═══════════════════════════════════════════════ */
function initProductCards() {
    const productCards = document.querySelectorAll('.group');
    
    productCards.forEach(card => {
        // Heart button toggle
        const heartBtn = card.querySelector('.ph-heart');
        if (heartBtn) {
            heartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                heartBtn.classList.toggle('ph-heart');
                heartBtn.classList.toggle('ph-heart-fill');
                heartBtn.classList.toggle('text-red-500');
                
                // Animate heart
                gsap.fromTo(heartBtn, 
                    { scale: 1 },
                    { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }
                );
            });
        }
        
        // Add to cart animation
        const addToCartBtn = card.querySelector('.ph-plus');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Create flying cart animation
                const cart = document.createElement('div');
                cart.innerHTML = '<i class="ph-fill ph-shopping-cart text-accent"></i>';
                cart.style.cssText = `
                    position: fixed;
                    top: ${e.clientY}px;
                    left: ${e.clientX}px;
                    z-index: 1000;
                    font-size: 24px;
                    pointer-events: none;
                `;
                document.body.appendChild(cart);
                
                gsap.to(cart, {
                    x: window.innerWidth - 100,
                    y: -window.innerHeight + 100,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        cart.remove();
                        showToast('Added to cart!');
                    }
                });
            });
        }
    });
}

/* ═══════════════════════════════════════════════
     KEYBOARD NAVIGATION
     ═══════════════════════════════════════════════ */
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // Toggle theme with T key
        if (e.key === 't' || e.key === 'T') {
            if (document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                toggleTheme();
            }
        }
        
        // Focus search with / key
        if (e.key === '/') {
            if (document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        }
    });
}

/* ═══════════════════════════════════════════════
     LAZY LOADING IMAGES
     ═══════════════════════════════════════════════ */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ═══════════════════════════════════════════════
     PERFORMANCE OPTIMIZATION
     ═══════════════════════════════════════════════ */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScroll = debounce(() => {
    // Any scroll-dependent operations
}, 100);

window.addEventListener('scroll', debouncedScroll);

/* ═══════════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initIntroAnimations();
    initScrollAnimations();
    initNavigation();
    initSearch();
    initProductCards();
    initKeyboardNav();
    initLazyLoading();
    
    // Log initialization
    console.log('🎨 22 Electronic Design System v2.0 initialized');
    console.log('📱 Press "T" to toggle theme');
    console.log('🔍 Press "/" to focus search');
});

/* ═══════════════════════════════════════════════
     EXPORT FUNCTIONS FOR GLOBAL USE
     ═══════════════════════════════════════════════ */
window.copyColor = copyColor;
window.copyIcon = copyIcon;
window.showToast = showToast;

/* ═══════════════════════════════════════════════
      THEME CUSTOMIZER
      ═══════════════════════════════════════════════ */
function setColor(variable, color) {
    document.documentElement.style.setProperty(variable, color);
    updateCodeExport();
    showToast(`Color changed to ${color}`);
}

function setRadius(radius) {
    document.documentElement.style.setProperty('--radius', radius);
    updateCodeExport();
}

function updateCodeExport() {
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const radius = getComputedStyle(document.documentElement).getPropertyValue('--radius').trim();
    const codeExport = document.getElementById('codeExport');
    if (codeExport) {
        codeExport.textContent = `:root {
  --accent: ${accent};
  --radius: ${radius};
}`;
    }
}

function copyCode() {
    const codeExport = document.getElementById('codeExport');
    if (codeExport) {
        navigator.clipboard.writeText(codeExport.textContent).then(() => {
            showToast('CSS copied to clipboard!');
        });
    }
}

function resetTheme() {
    document.documentElement.style.setProperty('--accent', '#FFD600');
    document.documentElement.style.setProperty('--radius', '4px');
    updateCodeExport();
    showToast('Theme reset to default');
}

/* ═══════════════════════════════════════════════
      DROPDOWN TOGGLE
      ═══════════════════════════════════════════════ */
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    if (dropdown) {
        dropdown.classList.toggle('opacity-0');
        dropdown.classList.toggle('invisible');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    document.querySelectorAll('[id^="dropdown"]').forEach(dropdown => {
        if (!dropdown.contains(e.target) && !e.target.closest('button')) {
            dropdown.classList.add('opacity-0', 'invisible');
        }
    });
});
