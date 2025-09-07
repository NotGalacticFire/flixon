// ===== COMPONENTS JAVASCRIPT FILE =====
// Handles interactive components: carousels, testimonials, accordions, before/after sliders, etc.

// ===== IMAGE CAROUSEL / SLIDER =====
class ImageCarousel {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.prevBtn = this.container.querySelector('.carousel-prev');
        this.nextBtn = this.container.querySelector('.carousel-next');
        this.indicators = this.container.querySelectorAll('.indicator');
        
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.autoplayInterval = null;
        this.autoplayDelay = parseInt(this.container.dataset.autoplay) || 5000;
        
        this.init();
    }
    
    init() {
        if (this.slideCount === 0) return;
        
        this.bindEvents();
        this.updateSlide();
        
        if (this.autoplayDelay > 0) {
            this.startAutoplay();
        }
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: true });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const touch = e.touches[0];
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            if (!distX || !distY) return;
            
            if (Math.abs(distX) > Math.abs(distY)) {
                if (distX > 50) {
                    this.prevSlide();
                } else if (distX < -50) {
                    this.nextSlide();
                }
            }
            
            startX = startY = distX = distY = 0;
        }, { passive: true });
    }
    
    updateSlide() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slideCount;
        this.updateSlide();
    }
    
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slideCount - 1 : this.currentSlide - 1;
        this.updateSlide();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
    
    startAutoplay() {
        if (this.autoplayDelay > 0) {
            this.stopAutoplay();
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoplayDelay);
        }
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// ===== TESTIMONIAL SLIDER =====
class TestimonialSlider {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.testimonial-item');
        this.prevBtn = this.container.querySelector('.testimonial-prev');
        this.nextBtn = this.container.querySelector('.testimonial-next');
        this.dotsContainer = this.container.querySelector('.testimonial-dots');
        
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.autoplayInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slideCount === 0) return;
        
        this.createDots();
        this.bindEvents();
        this.updateSlide();
        this.startAutoplay();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
        this.dots = this.dotsContainer.querySelectorAll('.dot');
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    updateSlide() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slideCount;
        this.updateSlide();
    }
    
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slideCount - 1 : this.currentSlide - 1;
        this.updateSlide();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// ===== ACCORDION =====
class Accordion {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.items = this.container.querySelectorAll('.accordion-item');
        this.allowMultiple = this.container.hasAttribute('data-multiple');
        
        this.init();
    }
    
    init() {
        this.items.forEach((item, index) => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            if (header && content) {
                header.addEventListener('click', () => this.toggleItem(item));
                
                // Keyboard navigation
                header.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleItem(item);
                    }
                });
                
                // Set initial state
                if (item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    }
    
    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        if (!this.allowMultiple) {
            this.closeAllItems();
        }
        
        if (isActive) {
            this.closeItem(item);
        } else {
            this.openItem(item);
        }
    }
    
    openItem(item) {
        const content = item.querySelector('.accordion-content');
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Trigger custom event
        item.dispatchEvent(new CustomEvent('accordion:open'));
    }
    
    closeItem(item) {
        const content = item.querySelector('.accordion-content');
        item.classList.remove('active');
        content.style.maxHeight = '0';
        
        // Trigger custom event
        item.dispatchEvent(new CustomEvent('accordion:close'));
    }
    
    closeAllItems() {
        this.items.forEach(item => {
            if (item.classList.contains('active')) {
                this.closeItem(item);
            }
        });
    }
}

// ===== BEFORE/AFTER SLIDER =====
class BeforeAfterSlider {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.afterImage = this.container.querySelector('.ba-after');
        this.slider = this.container.querySelector('.ba-slider');
        this.handle = this.container.querySelector('.ba-handle');
        
        this.isDragging = false;
        this.containerRect = null;
        
        this.init();
    }
    
    init() {
        if (!this.afterImage || !this.slider) return;
        
        this.bindEvents();
        this.updateSlider(50); // Start at 50%
    }
    
    bindEvents() {
        // Mouse events
        this.handle.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        
        // Touch events
        this.handle.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]), { passive: false });
        document.addEventListener('touchmove', (e) => this.drag(e.touches[0]), { passive: false });
        document.addEventListener('touchend', () => this.stopDrag());
        
        // Click on container
        this.container.addEventListener('click', (e) => {
            if (!this.isDragging) {
                this.handleClick(e);
            }
        });
        
        // Keyboard navigation
        this.handle.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.containerRect = this.container.getBoundingClientRect();
        this.container.classList.add('dragging');
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.isDragging || !this.containerRect) return;
        
        e.preventDefault();
        const x = e.clientX - this.containerRect.left;
        const percentage = Math.max(0, Math.min(100, (x / this.containerRect.width) * 100));
        this.updateSlider(percentage);
    }
    
    stopDrag() {
        this.isDragging = false;
        this.containerRect = null;
        this.container.classList.remove('dragging');
    }
    
    handleClick(e) {
        this.containerRect = this.container.getBoundingClientRect();
        const x = e.clientX - this.containerRect.left;
        const percentage = (x / this.containerRect.width) * 100;
        this.updateSlider(percentage);
    }
    
    handleKeydown(e) {
        const currentLeft = parseFloat(this.slider.style.left) || 50;
        let newLeft = currentLeft;
        
        switch (e.key) {
            case 'ArrowLeft':
                newLeft = Math.max(0, currentLeft - 5);
                break;
            case 'ArrowRight':
                newLeft = Math.min(100, currentLeft + 5);
                break;
            default:
                return;
        }
        
        e.preventDefault();
        this.updateSlider(newLeft);
    }
    
    updateSlider(percentage) {
        this.slider.style.left = percentage + '%';
        this.afterImage.style.clipPath = `polygon(${percentage}% 0%, 100% 0%, 100% 100%, ${percentage}% 100%)`;
    }
}

// ===== MASONRY GRID =====
class MasonryGrid {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.items = this.container.querySelectorAll('.masonry-item');
        this.filters = document.querySelectorAll('.filter-btn');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.layoutItems();
        
        window.addEventListener('resize', this.debounce(() => {
            this.layoutItems();
        }, 250));
    }
    
    bindEvents() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                this.handleFilter(filter);
            });
        });
    }
    
    handleFilter(activeFilter) {
        // Update active filter
        this.filters.forEach(filter => filter.classList.remove('active'));
        activeFilter.classList.add('active');
        
        const filterValue = activeFilter.dataset.filter;
        
        // Filter items
        this.items.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = filterValue === 'all' || category === filterValue;
            
            item.style.display = shouldShow ? 'block' : 'none';
        });
        
        // Re-layout after filtering
        setTimeout(() => {
            this.layoutItems();
        }, 100);
    }
    
    layoutItems() {
        if (window.innerWidth <= 768) {
            // Single column on mobile
            this.container.style.columnCount = '1';
        } else if (window.innerWidth <= 1024) {
            // Two columns on tablet
            this.container.style.columnCount = '2';
        } else {
            // Three columns on desktop
            this.container.style.columnCount = '3';
        }
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

// ===== LOGO CAROUSEL =====
class LogoCarousel {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.track = this.container.querySelector('.logo-track, .tech-track');
        if (!this.track) return;
        
        this.init();
    }
    
    init() {
        // Clone items for infinite scroll
        this.cloneItems();
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => {
            this.track.style.animationPlayState = 'paused';
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.track.style.animationPlayState = 'running';
        });
    }
    
    cloneItems() {
        const items = this.track.children;
        const itemCount = items.length;
        
        // Clone each item to create seamless loop
        for (let i = 0; i < itemCount; i++) {
            const clone = items[i].cloneNode(true);
            this.track.appendChild(clone);
        }
    }
}

// ===== TAB SYSTEM =====
class TabSystem {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.tabs = this.container.querySelectorAll('.demo-tab');
        this.contents = this.container.querySelectorAll('.demo-item');
        
        this.init();
    }
    
    init() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                this.switchTab(tab, index);
            });
            
            // Keyboard navigation
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.switchTab(tab, index);
                }
            });
        });
    }
    
    switchTab(activeTab, activeIndex) {
        // Update tabs
        this.tabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
        
        // Update content
        this.contents.forEach((content, index) => {
            content.classList.toggle('active', index === activeIndex);
        });
    }
}

// ===== MODAL SYSTEM =====
class ModalSystem {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.triggers = document.querySelectorAll('[data-modal]');
        this.activeModal = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createBackdrop();
    }
    
    createBackdrop() {
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'modal-backdrop';
        this.backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            z-index: 1040;
        `;
        document.body.appendChild(this.backdrop);
        
        this.backdrop.addEventListener('click', () => this.closeModal());
    }
    
    bindEvents() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                this.openModal(modalId);
            });
        });
        
        this.modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });
    }
    
    openModal(modalId) {
        const modal = document.querySelector(`#${modalId}`);
        if (!modal) return;
        
        this.activeModal = modal;
        document.body.classList.add('modal-open');
        
        this.backdrop.style.opacity = '1';
        this.backdrop.style.visibility = 'visible';
        
        modal.style.display = 'block';
        modal.classList.add('active');
        
        // Focus management
        const focusableElement = modal.querySelector('input, button, textarea, select, [tabindex]');
        if (focusableElement) {
            focusableElement.focus();
        }
    }
    
    closeModal() {
        if (!this.activeModal) return;
        
        document.body.classList.remove('modal-open');
        
        this.backdrop.style.opacity = '0';
        this.backdrop.style.visibility = 'hidden';
        
        this.activeModal.classList.remove('active');
        setTimeout(() => {
            this.activeModal.style.display = 'none';
            this.activeModal = null;
        }, 300);
    }
}

// ===== TOOLTIP SYSTEM =====
class TooltipSystem {
    constructor() {
        this.elements = document.querySelectorAll('[data-tooltip]');
        this.tooltip = null;
        
        this.init();
    }
    
    init() {
        this.createTooltip();
        this.bindEvents();
    }
    
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.style.cssText = `
            position: absolute;
            background: var(--bg-primary);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-lg);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            z-index: 1070;
            pointer-events: none;
        `;
        document.body.appendChild(this.tooltip);
    }
    
    bindEvents() {
        this.elements.forEach(element => {
            element.addEventListener('mouseenter', (e) => this.showTooltip(e));
            element.addEventListener('mouseleave', () => this.hideTooltip());
            element.addEventListener('mousemove', (e) => this.updatePosition(e));
        });
    }
    
    showTooltip(e) {
        const text = e.target.dataset.tooltip;
        this.tooltip.textContent = text;
        this.updatePosition(e);
        
        this.tooltip.style.opacity = '1';
        this.tooltip.style.visibility = 'visible';
    }
    
    hideTooltip() {
        this.tooltip.style.opacity = '0';
        this.tooltip.style.visibility = 'hidden';
    }
    
    updatePosition(e) {
        const x = e.clientX + 10;
        const y = e.clientY - 40;
        
        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = y + 'px';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ImageCarousel('.generic-carousel');
    new TestimonialSlider('.testimonials-slider');
    new Accordion('.features-accordion');
    new Accordion('.accordion-container');
    new BeforeAfterSlider('.before-after-container, .ba-container');
    new MasonryGrid('.masonry-grid');
    new LogoCarousel('.tech-carousel');
    new LogoCarousel('.logo-carousel-demo');
    new TabSystem('.demo-container');
    new ModalSystem();
    new TooltipSystem();
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ImageCarousel,
        TestimonialSlider,
        Accordion,
        BeforeAfterSlider,
        MasonryGrid,
        LogoCarousel,
        TabSystem,
        ModalSystem,
        TooltipSystem
    };
}