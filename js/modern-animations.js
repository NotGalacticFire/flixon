// ===== MODERN ANIMATIONS & INTERACTIONS =====
// Ultra-smooth animations for award-winning website experience

class ModernAnimations {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.scrollElements = [];
        this.magneticElements = [];
        this.counters = [];

        this.init();
    }

    init() {
        if (this.isReducedMotion) {
            // Respect user's reduced motion preference
            document.body.classList.add('reduced-motion');
            return;
        }

        this.initScrollReveal();
        this.initMagneticButtons();
        this.initCounters();
        this.initParallaxElements();
        this.initSmoothScrolling();
        this.initHeroAnimations();
        this.setupEventListeners();
    }

    // ===== SCROLL REVEAL ANIMATIONS =====
    initScrollReveal() {
        this.scrollElements = document.querySelectorAll('[data-scroll-reveal]');
        this.observeScrollElements();
    }

    observeScrollElements() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.scrollElements.forEach(element => {
            observer.observe(element);
        });
    }

    revealElement(element) {
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
            element.classList.add('revealed');

            // Add stagger effect for child elements
            const children = element.querySelectorAll('[data-scroll-reveal]');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('revealed');
                }, index * 100);
            });
        }, delay);
    }

    // ===== MAGNETIC BUTTON EFFECTS =====
    initMagneticButtons() {
        this.magneticElements = document.querySelectorAll('.magnetic-btn');

        this.magneticElements.forEach(element => {
            this.setupMagneticEffect(element);
        });
    }

    setupMagneticEffect(element) {
        const strength = 0.3; // Magnetic strength
        const rect = element.getBoundingClientRect();

        element.addEventListener('mouseenter', (e) => {
            element.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * strength;
            const deltaY = (e.clientY - centerY) * strength;

            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    }

    // ===== ANIMATED COUNTERS =====
    initCounters() {
        this.counters = document.querySelectorAll('[data-counter]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current);

            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    // ===== PARALLAX EFFECTS =====
    initParallaxElements() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');

        if (this.parallaxElements.length > 0) {
            this.handleParallax = this.throttle(this.updateParallax.bind(this), 16);
            window.addEventListener('scroll', this.handleParallax);
        }
    }

    updateParallax() {
        const scrollTop = window.pageYOffset;

        this.parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // ===== SMOOTH SCROLLING ENHANCEMENTS =====
    initSmoothScrolling() {
        // Enhanced smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }

    smoothScrollTo(element) {
        const targetPosition = element.offsetTop - 80; // Account for navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + (distance * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // ===== HERO ANIMATIONS =====
    initHeroAnimations() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        // Animate hero title words
        const titleLines = heroTitle.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(40px)';
            line.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s`;

            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });

        // Animate hero elements
        const heroElements = [
            '.hero-badge',
            '.hero-description',
            '.hero-actions',
            '.hero-stats'
        ];

        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 1200 + (index * 150));
            }
        });
    }

    // ===== PORTFOLIO INTERACTIONS =====
    initPortfolioAnimations() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.animatePortfolioHover(item, true);
            });

            item.addEventListener('mouseleave', () => {
                this.animatePortfolioHover(item, false);
            });
        });
    }

    animatePortfolioHover(item, isHover) {
        const overlay = item.querySelector('.portfolio-overlay');
        const image = item.querySelector('.portfolio-image img');

        if (isHover) {
            overlay.style.opacity = '1';
            image.style.transform = 'scale(1.05)';
        } else {
            overlay.style.opacity = '0';
            image.style.transform = 'scale(1)';
        }
    }

    // ===== CURSOR ENHANCEMENT =====
    initCustomCursor() {
        if (window.innerWidth < 768) return; // Skip on mobile

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = `
            <div class="cursor-dot"></div>
            <div class="cursor-outline"></div>
        `;
        document.body.appendChild(cursor);

        let cursorX = 0;
        let cursorY = 0;
        let pageX = 0;
        let pageY = 0;

        document.addEventListener('mousemove', (e) => {
            pageX = e.clientX;
            pageY = e.clientY;
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const updateCursor = () => {
            cursorX += (pageX - cursorX) * 0.1;
            cursorY += (pageY - cursorY) * 0.1;

            const outline = cursor.querySelector('.cursor-outline');
            outline.style.left = cursorX - 15 + 'px';
            outline.style.top = cursorY - 15 + 'px';

            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .portfolio-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            element.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Intersection Observer for scroll-based animations
        this.initScrollBasedAnimations();

        // Portfolio animations
        this.initPortfolioAnimations();

        // Custom cursor
        this.initCustomCursor();

        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    initScrollBasedAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Add specific animations based on element type
                    if (element.classList.contains('service-card')) {
                        this.animateServiceCard(element);
                    }

                    if (element.classList.contains('portfolio-item')) {
                        this.animatePortfolioItem(element);
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe elements for scroll-based animations
        document.querySelectorAll('.service-card, .portfolio-item').forEach(el => {
            observer.observe(el);
        });
    }

    animateServiceCard(card) {
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
    }

    animatePortfolioItem(item) {
        item.style.transform = 'translateY(0)';
        item.style.opacity = '1';
    }

    handleResize() {
        // Recalculate positions and reinitialize if needed
        this.magneticElements.forEach(element => {
            this.setupMagneticEffect(element);
        });
    }

    // ===== UTILITY FUNCTIONS =====
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
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
}

// ===== CUSTOM CURSOR STYLES =====
const cursorStyles = `
.custom-cursor {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
}

.cursor-dot {
    width: 4px;
    height: 4px;
    background: #3b82f6;
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: all 0.1s ease;
}

.cursor-outline {
    width: 30px;
    height: 30px;
    border: 2px solid rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: all 0.15s ease;
}

.custom-cursor.cursor-hover .cursor-dot {
    background: #10b981;
    transform: translate(-50%, -50%) scale(2);
}

.custom-cursor.cursor-hover .cursor-outline {
    border-color: rgba(16, 185, 129, 0.5);
    transform: translate(-50%, -50%) scale(1.5);
}

/* Hide default cursor on interactive elements */
.custom-cursor ~ * {
    cursor: none !important;
}

@media (max-width: 768px) {
    .custom-cursor {
        display: none;
    }
}
`;

// ===== REDUCED MOTION STYLES =====
const reducedMotionStyles = `
.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
}
`;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Add cursor styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = cursorStyles + reducedMotionStyles;
    document.head.appendChild(styleSheet);

    // Initialize modern animations
    new ModernAnimations();
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernAnimations;
}