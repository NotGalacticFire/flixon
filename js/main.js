// ===== MAIN JAVASCRIPT FILE =====
// Handles core functionality: theme toggle, navigation, page loader, utilities

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight * (1 - threshold)) && ((rect.top + rect.height) >= (windowHeight * threshold));
    const horInView = (rect.left <= windowWidth * (1 - threshold)) && ((rect.left + rect.width) >= (windowWidth * threshold));
    
    return (vertInView && horInView);
}

// Smooth scroll to element
function scrollToElement(element, offset = 80) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ===== PAGE LOADER =====
class PageLoader {
    constructor() {
        this.loader = $('#page-loader');
        this.init();
    }
    
    init() {
        if (this.loader) {
            // Hide loader after page loads
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.hide();
                }, 500);
            });
        }
    }
    
    show() {
        if (this.loader) {
            this.loader.classList.remove('hidden');
        }
    }
    
    hide() {
        if (this.loader) {
            this.loader.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                if (this.loader.parentNode) {
                    this.loader.parentNode.removeChild(this.loader);
                }
            }, 500);
        }
    }
}

// ===== THEME TOGGLE =====
class ThemeManager {
    constructor() {
        this.themeToggle = $('#theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Theme toggle event
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(() => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(mediaQuery.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.style.transform = theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a subtle animation
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navbar = $('#main-nav');
        this.navLinks = $$('.nav-link');
        this.mobileToggle = $('.mobile-menu-toggle');
        this.navMenu = $('.nav-menu');
        this.lastScrollY = 0;
        this.init();
    }
    
    init() {
        if (this.navbar) {
            // Handle scroll events
            window.addEventListener('scroll', throttle(() => {
                this.handleScroll();
            }, 16));
            
            // Handle navigation link clicks
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    this.handleNavClick(e, link);
                });
            });
            
            // Handle mobile menu toggle
            if (this.mobileToggle) {
                this.mobileToggle.addEventListener('click', () => {
                    this.toggleMobileMenu();
                });
            }
            
            // Close mobile menu on resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.navMenu) {
                    this.navMenu.classList.remove('active');
                    this.mobileToggle.classList.remove('active');
                }
            });
        }
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            this.navbar.style.transform = 'translateY(0)';
        }
        
        this.lastScrollY = currentScrollY;
        
        // Update active navigation link
        this.updateActiveNavLink();
    }
    
    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        
        // Handle anchor links
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = $(`#${targetId}`);
            
            if (targetElement) {
                scrollToElement(targetElement);
                
                // Update active link
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu if open
                if (this.navMenu) {
                    this.navMenu.classList.remove('active');
                    this.mobileToggle.classList.remove('active');
                }
            }
        }
    }
    
    updateActiveNavLink() {
        const sections = $$('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.navMenu && this.mobileToggle) {
            this.navMenu.classList.toggle('active');
            this.mobileToggle.classList.toggle('active');
        }
    }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Handle all anchor links
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = $(`#${targetId}`);
            
            if (targetElement) {
                scrollToElement(targetElement);
            }
        });
    });
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.contactForm = $('.contact-form');
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                this.handleSubmit(e);
            });
            
            // Handle floating labels
            const formGroups = this.contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                if (input) {
                    input.addEventListener('focus', () => this.handleFocus(group));
                    input.addEventListener('blur', () => this.handleBlur(group));
                    input.addEventListener('input', () => this.handleInput(group));
                }
            });
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (this.validateForm(data)) {
            this.showSuccess('Thank you for your message! We\'ll get back to you soon.');
            this.contactForm.reset();
        } else {
            this.showError('Please fill in all required fields.');
        }
    }
    
    validateForm(data) {
        return data.name && data.email && data.subject && data.message;
    }
    
    handleFocus(group) {
        group.classList.add('focused');
    }
    
    handleBlur(group) {
        const input = group.querySelector('input, textarea');
        if (!input.value) {
            group.classList.remove('focused');
        }
    }
    
    handleInput(group) {
        const input = group.querySelector('input, textarea');
        if (input.value) {
            group.classList.add('has-value');
        } else {
            group.classList.remove('has-value');
        }
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// ===== PERFORMANCE UTILITIES =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Add will-change properties to elements that will animate
        this.optimizeAnimations();
        
        // Lazy load images
        this.initLazyLoading();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    optimizeAnimations() {
        // Add will-change to hoverable elements
        $$('.hover-lift, .hover-tilt, .hover-scale').forEach(el => {
            el.style.willChange = 'transform';
        });
        
        // Add GPU acceleration to frequently animated elements
        $$('[data-aos], .parallax-element').forEach(el => {
            el.style.transform = 'translateZ(0)';
            el.style.backfaceVisibility = 'hidden';
        });
    }
    
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            $$('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    preloadResources() {
        // Avoid preloading CSS font manifests that aren't guaranteed to be used
        // Fonts are already requested in <head>; removing extra preloads prevents console warnings
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Enhanced keyboard navigation
        this.enhanceKeyboardNav();
        
        // Focus management
        this.manageFocus();
        
        // ARIA enhancements
        this.enhanceARIA();
        
        // Reduced motion support
        this.handleReducedMotion();
    }
    
    enhanceKeyboardNav() {
        // Add keyboard navigation to custom elements
        $$('.carousel-slide, .testimonial-slide, .accordion-header').forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
            
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    }
    
    manageFocus() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    enhanceARIA() {
        // Add ARIA labels to interactive elements without labels
        $$('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
            if (!btn.textContent.trim()) {
                btn.setAttribute('aria-label', 'Interactive button');
            }
        });
        
        // Mark decorative images
        $$('img:not([alt])').forEach(img => {
            img.setAttribute('alt', '');
            img.setAttribute('role', 'presentation');
        });
    }
    
    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable autoplay animations
            $$('[data-autoplay]').forEach(el => {
                el.removeAttribute('data-autoplay');
            });
            
            // Reduce animation duration
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    // PageLoader removed - using TFTL preloader only
    
    // Hero title animation disabled per updated design: preloader words compress, hero appears static.
    new ThemeManager();
    new Navigation();
    new FormHandler();
    new PerformanceOptimizer();
    new AccessibilityManager();

    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Add loaded class to body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Initialize hero rotating typing
    initHeroTyping();
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PageLoader,
        ThemeManager,
        Navigation,
        FormHandler,
        PerformanceOptimizer,
        AccessibilityManager,
        initHeroTyping,
        debounce,
        throttle,
        isInViewport,
        scrollToElement
    };
}

// ===== HERO ROTATING TYPING =====
function initHeroTyping() {
    const el = document.getElementById('heroTyping');
    if (!el) return;
    let words = [];
    try {
        words = JSON.parse(el.dataset.words || '[]');
    } catch (e) {}
    if (!Array.isArray(words) || words.length === 0) {
        words = ['results'];
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        el.textContent = words[0];
        el.style.borderRight = 'none';
        return;
    }

    const typeSpeed = 80;
    const eraseSpeed = 50;
    const holdTime = 1200;
    let wordIndex = 0;
    let charIndex = 0;
    let typing = true;

    function tick() {
        const word = words[wordIndex % words.length];
        if (typing) {
            el.textContent = word.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === word.length) {
                typing = false;
                setTimeout(tick, holdTime);
                return;
            }
            setTimeout(tick, typeSpeed);
        } else {
            el.textContent = word.slice(0, Math.max(0, charIndex - 1));
            charIndex--;
            if (charIndex === 0) {
                typing = true;
                wordIndex++;
                setTimeout(tick, 300);
                return;
            }
            setTimeout(tick, eraseSpeed);
        }
    }

    tick();
}

// Hero title compression removed per updated design
