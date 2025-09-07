// ===== ADVANCED EFFECTS JAVASCRIPT =====
// Ultra-smooth navigation, particle systems, magnetic effects, and immersive interactions

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isEnabled = true;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getParticleColor()
            });
        }
    }
    
    getParticleColor() {
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--accent-color')
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Listen for customizer changes
        document.addEventListener('theme-changed', () => {
            this.particles.forEach(particle => {
                particle.color = this.getParticleColor();
            });
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= dx * force * 0.001;
                particle.vy -= dy * force * 0.001;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary conditions
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Add slight random movement
            particle.vx += (Math.random() - 0.5) * 0.01;
            particle.vy += (Math.random() - 0.5) * 0.01;
            
            // Limit velocity
            particle.vx = Math.max(-2, Math.min(2, particle.vx));
            particle.vy = Math.max(-2, Math.min(2, particle.vy));
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.particles.forEach((particle, i) => {
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    this.ctx.strokeStyle = particle.color + Math.floor((1 - distance / 120) * 50).toString(16).padStart(2, '0');
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        if (this.isEnabled) {
            this.updateParticles();
            this.drawParticles();
        }
        requestAnimationFrame(() => this.animate());
    }
    
    toggle(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// ===== MAGNETIC CURSOR EFFECTS =====
class MagneticCursor {
    constructor() {
        this.cursor = document.getElementById('cursor-trail');
        if (!this.cursor) return;
        
        this.mouse = { x: 0, y: 0 };
        this.cursorPos = { x: 0, y: 0 };
        this.magneticElements = document.querySelectorAll('.magnetic, .btn-advanced, .customizer-toggle, .btn, .cta-primary, .cta-secondary, .nav-link, .dot, .nav-btn');
        this.isEnabled = true;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.animate();
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            if (this.isEnabled) {
                this.cursor.style.opacity = '1';
            }
        });
        
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });
        
        // Magnetic effect on hover
        this.magneticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-magnetic');
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-magnetic');
                element.style.transform = '';
            });
            
            element.addEventListener('mousemove', (e) => {
                if (!this.isEnabled) return;
                
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) * 0.2;
                const deltaY = (e.clientY - centerY) * 0.2;
                
                element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });
        });
    }
    
    animate() {
        // Smooth cursor following
        this.cursorPos.x += (this.mouse.x - this.cursorPos.x) * 0.15;
        this.cursorPos.y += (this.mouse.y - this.cursorPos.y) * 0.15;
        
        if (this.isEnabled) {
            this.cursor.style.transform = `translate(${this.cursorPos.x - 10}px, ${this.cursorPos.y - 10}px)`;
            // Ensure cursor stays visible
            this.cursor.style.opacity = '0.8';
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    toggle(enabled) {
        this.isEnabled = enabled;
        this.cursor.style.display = enabled ? 'block' : 'none';
    }
}

// ===== ULTRA SMOOTH SCROLL =====
class UltraSmoothScroll {
    constructor() {
        this.isEnabled = true;
        this.scrollTarget = 0;
        this.currentScroll = 0;
        this.ease = 0.1;
        
        this.init();
    }
    
    init() {
        if (!this.isEnabled) return;
        
        document.body.style.height = document.body.scrollHeight + 'px';
        document.body.style.position = 'fixed';
        document.body.style.top = '0';
        document.body.style.left = '0';
        document.body.style.width = '100%';
        
        this.bindEvents();
        this.animate();
    }
    
    bindEvents() {
        window.addEventListener('wheel', (e) => {
            if (!this.isEnabled) return;
            
            e.preventDefault();
            this.scrollTarget += e.deltaY * 0.8;
            this.scrollTarget = Math.max(0, Math.min(this.scrollTarget, document.body.scrollHeight - window.innerHeight));
        }, { passive: false });
        
        // Handle anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && this.isEnabled) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollTarget = targetElement.offsetTop - 80;
                }
            }
        });
    }
    
    animate() {
        if (this.isEnabled) {
            this.currentScroll += (this.scrollTarget - this.currentScroll) * this.ease;
            document.body.style.transform = `translateY(${-this.currentScroll}px)`;
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    toggle(enabled) {
        this.isEnabled = enabled;
        
        if (enabled) {
            this.init();
        } else {
            document.body.style.position = '';
            document.body.style.height = '';
            document.body.style.transform = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.width = '';
            window.scrollTo(0, this.currentScroll);
        }
    }
}

// ===== ADVANCED SCROLL EFFECTS =====
class AdvancedScrollEffects {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll-effect]');
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateElements();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateElements();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
    
    updateElements() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const elementHeight = rect.height;
            const effect = element.dataset.scrollEffect;
            
            // Calculate progress (0 to 1)
            const progress = Math.max(0, Math.min(1, 
                (scrollTop + windowHeight - elementTop) / (windowHeight + elementHeight)
            ));
            
            this.applyEffect(element, effect, progress);
        });
    }
    
    applyEffect(element, effect, progress) {
        switch (effect) {
            case 'parallax':
                const speed = parseFloat(element.dataset.speed) || 0.5;
                element.style.transform = `translateY(${-progress * 100 * speed}px)`;
                break;
                
            case 'scale':
                const scale = 0.8 + (progress * 0.2);
                element.style.transform = `scale(${scale})`;
                break;
                
            case 'rotate':
                const rotation = progress * 360;
                element.style.transform = `rotate(${rotation}deg)`;
                break;
                
            case 'fade':
                element.style.opacity = progress;
                break;
                
            case 'slide-up':
                const slideDistance = (1 - progress) * 100;
                element.style.transform = `translateY(${slideDistance}px)`;
                element.style.opacity = progress;
                break;
                
            case 'perspective':
                const rotateX = (0.5 - progress) * 60;
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg)`;
                break;
        }
    }
}

// ===== MICRO INTERACTIONS =====
class MicroInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupButtonEffects();
        this.setupCardEffects();
        this.setupFormEffects();
        this.setupNavigationEffects();
    }
    
    setupButtonEffects() {
        const buttons = document.querySelectorAll('button, .btn, .cta-primary, .cta-secondary');
        
        buttons.forEach(button => {
            // Ripple effect
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
            
            // Hover sound effect (visual feedback)
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            background-color: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupCardEffects() {
        const cards = document.querySelectorAll('.card, .service-card, .portfolio-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }
    
    setupFormEffects() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('input-focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('input-focused');
            });
            
            input.addEventListener('input', () => {
                if (input.value) {
                    input.parentElement.classList.add('input-has-value');
                } else {
                    input.parentElement.classList.remove('input-has-value');
                }
            });
        });
    }
    
    setupNavigationEffects() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });
    }
}

// ===== LOADING ANIMATIONS =====
class LoadingAnimations {
    constructor() {
        this.createStyleSheet();
    }
    
    createStyleSheet() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .input-focused {
                transform: scale(1.02);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }
            
            .input-has-value label {
                transform: translateY(-20px) scale(0.9);
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        
        this.monitor();
    }
    
    monitor() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Adjust effects based on performance
            if (this.fps < 30) {
                this.reduceEffects();
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
    
    reduceEffects() {
        // Reduce particle count
        if (window.particleSystem) {
            window.particleSystem.particles = window.particleSystem.particles.slice(0, 20);
        }
        
        // Disable some expensive effects
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (!prefersReducedMotion.matches) {
        // Initialize all advanced effects
        window.particleSystem = new ParticleSystem();
        window.magneticCursor = new MagneticCursor();
        // UltraSmoothScroll is now opt-in via customizer
        window.ultraSmoothScroll = null;
        window.advancedScrollEffects = new AdvancedScrollEffects();
        window.microInteractions = new MicroInteractions();
        window.loadingAnimations = new LoadingAnimations();
        window.performanceMonitor = new PerformanceMonitor();
    } else {
        // Provide fallbacks for reduced motion
        window.particleSystem = { toggle: () => {} };
        window.magneticCursor = { toggle: () => {} };
        window.ultraSmoothScroll = null;
    }
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystem,
        MagneticCursor,
        UltraSmoothScroll,
        AdvancedScrollEffects,
        MicroInteractions,
        LoadingAnimations,
        PerformanceMonitor
    };
}