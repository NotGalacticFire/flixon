// ===== ANIMATIONS JAVASCRIPT FILE =====
// Handles scroll-triggered animations, counters, progress bars, and advanced animation effects

// ===== ANIMATE ON SCROLL (AOS) IMPLEMENTATION =====
class AnimateOnScroll {
    constructor() {
        this.elements = [];
        this.windowHeight = window.innerHeight;
        this.init();
    }
    
    init() {
        // Find all elements with data-aos attributes
        this.elements = Array.from(document.querySelectorAll('[data-aos]'));
        
        if (this.elements.length === 0) return;
        
        // Bind scroll event
        this.bindEvents();
        
        // Initial check
        this.checkElements();
        
        // Setup intersection observer for better performance
        this.setupIntersectionObserver();
    }
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(this.checkElements.bind(this), 16));
        window.addEventListener('resize', this.debounce(() => {
            this.windowHeight = window.innerHeight;
            this.checkElements();
        }, 100));
    }
    
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                } else if (entry.target.dataset.aosOnce !== 'true') {
                    this.resetElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
    
    checkElements() {
        this.elements.forEach(element => {
            if (this.isInViewport(element)) {
                this.animateElement(element);
            } else if (element.dataset.aosOnce !== 'true') {
                this.resetElement(element);
            }
        });
    }
    
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const offset = element.dataset.aosOffset || 120;
        
        return (
            rect.top <= (this.windowHeight - offset) &&
            rect.bottom >= offset
        );
    }
    
    animateElement(element) {
        if (!element.classList.contains('aos-animate')) {
            element.classList.add('aos-animate');
            
            // Trigger custom event
            element.dispatchEvent(new CustomEvent('aos:in'));
        }
    }
    
    resetElement(element) {
        if (element.classList.contains('aos-animate')) {
            element.classList.remove('aos-animate');
            
            // Trigger custom event
            element.dispatchEvent(new CustomEvent('aos:out'));
        }
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ===== ANIMATED COUNTERS =====
class AnimatedCounter {
    constructor() {
        this.counters = document.querySelectorAll('[data-target]');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        // Use Intersection Observer for better performance
        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateCounter(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            this.counters.forEach(counter => observer.observe(counter));
        } else {
            // Fallback for browsers without Intersection Observer
            window.addEventListener('scroll', this.throttle(() => {
                this.counters.forEach(counter => {
                    if (this.isInViewport(counter) && !this.animated.has(counter)) {
                        this.animateCounter(counter);
                        this.animated.add(counter);
                    }
                });
            }, 100));
        }
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = parseInt(element.dataset.duration) || 2000;
        const startValue = parseInt(element.dataset.start) || 0;
        const increment = target / (duration / 16);
        
        let currentValue = startValue;
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= target) {
                currentValue = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(currentValue);
        }, 16);
        
        // Add animation class for CSS effects
        element.classList.add('counting');
        
        setTimeout(() => {
            element.classList.remove('counting');
        }, duration);
    }
    
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight * 0.8;
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ===== PROGRESS BARS =====
class ProgressBarAnimator {
    constructor() {
        this.progressBars = document.querySelectorAll('[data-width]');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        if (this.progressBars.length === 0) return;
        
        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateProgressBar(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            this.progressBars.forEach(bar => observer.observe(bar));
        } else {
            window.addEventListener('scroll', this.throttle(() => {
                this.progressBars.forEach(bar => {
                    if (this.isInViewport(bar) && !this.animated.has(bar)) {
                        this.animateProgressBar(bar);
                        this.animated.add(bar);
                    }
                });
            }, 100));
        }
    }
    
    animateProgressBar(element) {
        const targetWidth = element.dataset.width;
        const duration = parseInt(element.dataset.duration) || 1500;
        
        // Start animation after a brief delay for better effect
        setTimeout(() => {
            element.style.width = `${targetWidth}%`;
            element.classList.add('animating');
            
            setTimeout(() => {
                element.classList.remove('animating');
            }, duration);
        }, 200);
    }
    
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight * 0.8;
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ===== PARALLAX SCROLLING =====
class ParallaxController {
    constructor() {
        this.elements = document.querySelectorAll('.parallax-element, [data-parallax]');
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) return;
        
        this.bindEvents();
        this.updateParallax();
    }
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(this.updateParallax.bind(this), 8));
        window.addEventListener('resize', this.debounce(this.updateParallax.bind(this), 100));
    }
    
    updateParallax() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = parseFloat(element.dataset.speed) || 0.5;
            
            // Only animate elements that are in or near the viewport
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                const yPos = -(scrollTop * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ===== TYPEWRITER EFFECT =====
class TypewriterEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-typewriter]');
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.speed) || 50;
            const delay = parseInt(element.dataset.delay) || 0;
            
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            setTimeout(() => {
                this.typeText(element, text, speed);
            }, delay);
        });
    }
    
    typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }
}

// ===== MORPHING SHAPES =====
class MorphingShapes {
    constructor() {
        this.shapes = document.querySelectorAll('.morphing-shape, [data-morph]');
        this.init();
    }
    
    init() {
        this.shapes.forEach(shape => {
            const duration = parseInt(shape.dataset.morphDuration) || 8000;
            shape.style.animation = `morphShape ${duration}ms ease-in-out infinite`;
        });
    }
}

// ===== FLOATING ELEMENTS =====
class FloatingElements {
    constructor() {
        this.elements = document.querySelectorAll('.floating, [data-float]');
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            const duration = parseInt(element.dataset.floatDuration) || 3000;
            const intensity = parseInt(element.dataset.floatIntensity) || 20;
            
            element.style.animation = `float ${duration}ms ease-in-out infinite`;
            element.style.setProperty('--float-intensity', `${intensity}px`);
        });
    }
}

// ===== MAGNETIC HOVER EFFECT =====
class MagneticHover {
    constructor() {
        this.elements = document.querySelectorAll('.magnetic, [data-magnetic]');
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            const strength = parseFloat(element.dataset.magnetic) || 0.3;
            
            element.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e, element, strength);
            });
            
            element.addEventListener('mouseleave', () => {
                this.resetPosition(element);
            });
        });
    }
    
    handleMouseMove(e, element, strength) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
    
    resetPosition(element) {
        element.style.transform = 'translate(0, 0)';
    }
}

// ===== STAGGER ANIMATIONS =====
class StaggerAnimations {
    constructor() {
        this.containers = document.querySelectorAll('[data-stagger]');
        this.init();
    }
    
    init() {
        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStaggered(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            this.containers.forEach(container => observer.observe(container));
        }
    }
    
    animateStaggered(container) {
        const children = container.children;
        const delay = parseInt(container.dataset.staggerDelay) || 100;
        
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('stagger-animate');
            }, index * delay);
        });
    }
}

// ===== REVEAL TEXT ANIMATION =====
class TextReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-text, [data-text-reveal]');
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            this.prepareText(element);
        });
        
        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.revealText(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            this.elements.forEach(element => observer.observe(element));
        }
    }
    
    prepareText(element) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span class="word">${word.split('').map(letter => 
                `<span class="letter">${letter}</span>`
            ).join('')}</span>`
        ).join(' ');
    }
    
    revealText(element) {
        const letters = element.querySelectorAll('.letter');
        
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.transform = 'translateY(0)';
                letter.style.opacity = '1';
            }, index * 30);
        });
    }
}

// ===== SCROLL-TRIGGERED TIMELINE =====
class ScrollTimeline {
    constructor() {
        this.timeline = document.querySelector('.timeline-container');
        this.items = document.querySelectorAll('.timeline-item');
        this.init();
    }
    
    init() {
        if (!this.timeline) return;
        
        this.createProgressLine();
        
        window.addEventListener('scroll', this.throttle(() => {
            this.updateProgress();
            this.revealItems();
        }, 16));
    }
    
    createProgressLine() {
        const progressLine = document.createElement('div');
        progressLine.className = 'timeline-progress';
        progressLine.style.cssText = `
            position: absolute;
            left: 50%;
            top: 0;
            width: 4px;
            height: 0%;
            background: var(--primary-color);
            transform: translateX(-50%);
            border-radius: 2px;
            transition: height 0.3s ease;
        `;
        this.timeline.appendChild(progressLine);
        this.progressLine = progressLine;
    }
    
    updateProgress() {
        const timelineRect = this.timeline.getBoundingClientRect();
        const timelineTop = timelineRect.top + window.scrollY;
        const timelineHeight = timelineRect.height;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        const progress = Math.max(0, Math.min(1, 
            (scrollY + windowHeight - timelineTop) / timelineHeight
        ));
        
        this.progressLine.style.height = `${progress * 100}%`;
    }
    
    revealItems() {
        this.items.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                setTimeout(() => {
                    item.classList.add('revealed');
                }, index * 200);
            }
        });
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (!prefersReducedMotion.matches) {
        // Initialize all animation components
        new AnimateOnScroll();
        new AnimatedCounter();
        new ProgressBarAnimator();
        new ParallaxController();
        new TypewriterEffect();
        new MorphingShapes();
        new FloatingElements();
        new MagneticHover();
        new StaggerAnimations();
        new TextReveal();
        new ScrollTimeline();
    } else {
        // For users who prefer reduced motion, still initialize counters and progress bars
        new AnimatedCounter();
        new ProgressBarAnimator();
    }
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimateOnScroll,
        AnimatedCounter,
        ProgressBarAnimator,
        ParallaxController,
        TypewriterEffect,
        MorphingShapes,
        FloatingElements,
        MagneticHover,
        StaggerAnimations,
        TextReveal,
        ScrollTimeline
    };
}