// ===== GROUNDBREAKING ANIMATIONS SYSTEM =====
// Award-winning animation system inspired by top Awwwards sites
// Featuring Lenis, GSAP, ScrollTrigger, and SplitType

class GroundbreakingAnimations {
    constructor() {
        this.lenis = null;
        this.magneticElements = [];
        this.customCursor = null;
        this.portfolioItems = [];
        this.splitTexts = [];

        this.init();
    }

    init() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            return;
        }

        // Initialize libraries and effects
        this.initLenis();
        this.initGSAP();
        this.initCustomCursor();
        this.initMagneticEffects();
        this.initTextAnimations();
        this.initScrollAnimations();
        this.initPortfolioAnimations();
        this.initRevolutionarySections();

        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.initAllAnimations();
        });
    }

    // ===== LENIS SMOOTH SCROLLING =====
    initLenis() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false // Keep native touch scrolling on mobile
        });

        // Integrate with GSAP
        this.lenis.on('scroll', (e) => {
            ScrollTrigger.update();
        });

        // Animation loop
        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }

    // ===== GSAP INITIALIZATION =====
    initGSAP() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Set up ScrollTrigger with Lenis
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                return arguments.length ? window.scrollTo(0, value) : window.pageYOffset;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            }
        });

        // Default GSAP settings
        gsap.defaults({
            duration: 1,
            ease: "power2.out"
        });
    }

    // ===== CUSTOM CURSOR SYSTEM =====
    initCustomCursor() {
        if (window.innerWidth <= 768) return; // Skip on mobile

        // Create cursor elements
        this.customCursor = {
            dot: null,
            outline: null,
            preview: null
        };

        const cursor = document.createElement('div');
        cursor.className = 'groundbreaking-cursor';
        cursor.innerHTML = `
            <div class="cursor-dot"></div>
            <div class="cursor-outline"></div>
            <div class="cursor-preview">
                <img src="" alt="" />
                <div class="preview-overlay"></div>
            </div>
        `;
        document.body.appendChild(cursor);

        this.customCursor.dot = cursor.querySelector('.cursor-dot');
        this.customCursor.outline = cursor.querySelector('.cursor-outline');
        this.customCursor.preview = cursor.querySelector('.cursor-preview');

        this.setupCursorMovement();
        this.setupCursorStates();
    }

    setupCursorMovement() {
        let cursorX = 0, cursorY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            // Move dot instantly
            gsap.to(this.customCursor.dot, {
                x: cursorX,
                y: cursorY,
                duration: 0
            });
        });

        // Smooth follow for outline
        const updateOutline = () => {
            outlineX += (cursorX - outlineX) * 0.15;
            outlineY += (cursorY - outlineY) * 0.15;

            gsap.set(this.customCursor.outline, {
                x: outlineX,
                y: outlineY
            });

            requestAnimationFrame(updateOutline);
        };
        updateOutline();
    }

    setupCursorStates() {
        // Hover states for different elements
        document.querySelectorAll('a, button, .portfolio-item, .service-card').forEach(el => {
            el.addEventListener('mouseenter', () => this.setCursorState('hover'));
            el.addEventListener('mouseleave', () => this.setCursorState('default'));
        });

        // Portfolio preview states
        document.querySelectorAll('.portfolio-item').forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                item.addEventListener('mouseenter', () => {
                    this.setCursorState('portfolio', img.src);
                });
                item.addEventListener('mouseleave', () => {
                    this.setCursorState('default');
                });
            }
        });
    }

    setCursorState(state, imageSrc = null) {
        const cursor = document.querySelector('.groundbreaking-cursor');

        cursor.className = `groundbreaking-cursor cursor-${state}`;

        switch (state) {
            case 'hover':
                gsap.to(this.customCursor.outline, {
                    scale: 1.5,
                    borderWidth: 1,
                    duration: 0.3
                });
                break;
            case 'portfolio':
                if (imageSrc) {
                    this.customCursor.preview.querySelector('img').src = imageSrc;
                    gsap.to(this.customCursor.preview, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        ease: "back.out(1.7)"
                    });
                }
                break;
            default:
                gsap.to([this.customCursor.outline, this.customCursor.preview], {
                    scale: 1,
                    opacity: state === 'default' ? 0 : 1,
                    borderWidth: 2,
                    duration: 0.3
                });
                break;
        }
    }

    // ===== MAGNETIC EFFECTS =====
    initMagneticEffects() {
        this.magneticElements = document.querySelectorAll('.magnetic-btn, .portfolio-item, .service-card');

        this.magneticElements.forEach(element => {
            this.setupMagneticEffect(element);
        });
    }

    setupMagneticEffect(element) {
        const strength = element.classList.contains('portfolio-item') ? 0.4 : 0.2;

        element.addEventListener('mouseenter', () => {
            gsap.to(element, {
                z: 50,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * strength;
            const deltaY = (e.clientY - centerY) * strength;

            gsap.to(element, {
                x: deltaX,
                y: deltaY,
                rotationX: deltaY * 0.1,
                rotationY: deltaX * 0.1,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                z: 0,
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.8)"
            });
        });
    }

    // ===== TEXT ANIMATIONS =====
    initTextAnimations() {
        // Split text elements for character-by-character animation
        document.querySelectorAll('.split-text, .hero-title, .section-title').forEach(element => {
            const splitText = new SplitType(element, {
                types: 'chars,words,lines',
                tagName: 'span'
            });

            this.splitTexts.push({
                element: element,
                splitText: splitText
            });
        });

        this.animateTextElements();
    }

    animateTextElements() {
        this.splitTexts.forEach(({ element, splitText }) => {
            if (element.classList.contains('hero-title')) {
                this.animateHeroTitle(splitText);
            } else {
                this.animateScrollText(splitText);
            }
        });
    }

    animateHeroTitle(splitText) {
        // Hero title animation - immediate reveal with stagger
        gsap.fromTo(splitText.chars,
            {
                y: 100,
                opacity: 0,
                rotationX: 90
            },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 1.2,
                stagger: 0.03,
                ease: "back.out(1.7)",
                delay: 0.5
            }
        );
    }

    animateScrollText(splitText) {
        // Scroll-triggered text animations
        gsap.fromTo(splitText.chars,
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.02,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: splitText.chars[0].closest('.section-title, .split-text'),
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // ===== SCROLL ANIMATIONS =====
    initScrollAnimations() {
        // Advanced scroll-triggered animations
        this.setupHeroAnimations();
        this.setupSectionReveals();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
    }

    setupHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-description, .hero-actions');

        heroElements.forEach((element, index) => {
            gsap.fromTo(element,
                {
                    y: 80,
                    opacity: 0,
                    scale: 0.8
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    delay: 1 + (index * 0.2),
                    ease: "elastic.out(1, 0.8)"
                }
            );
        });

        // Floating elements animation
        document.querySelectorAll('.floating-element').forEach((element, index) => {
            gsap.to(element, {
                rotation: 360,
                duration: 20 + (index * 5),
                repeat: -1,
                ease: "none"
            });

            gsap.to(element, {
                y: -20,
                duration: 3 + index,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }

    setupSectionReveals() {
        document.querySelectorAll('[data-scroll-reveal]').forEach(element => {
            gsap.fromTo(element,
                {
                    y: 100,
                    opacity: 0,
                    scale: 0.8,
                    rotationX: 45
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotationX: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    setupParallaxEffects() {
        // Background parallax
        document.querySelectorAll('.hero-image, [data-parallax]').forEach(element => {
            gsap.to(element, {
                yPercent: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: element.closest('section'),
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Floating decorations
        document.querySelectorAll('.floating-element').forEach((element, index) => {
            gsap.to(element, {
                y: -100 * (index + 1),
                rotation: 180,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });
    }

    setupCounterAnimations() {
        document.querySelectorAll('[data-counter]').forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const obj = { value: 0 };

            gsap.to(obj, {
                value: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    counter.textContent = Math.floor(obj.value);
                },
                scrollTrigger: {
                    trigger: counter,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });
    }

    // ===== PORTFOLIO ANIMATIONS =====
    initPortfolioAnimations() {
        this.portfolioItems = document.querySelectorAll('.portfolio-item');

        this.portfolioItems.forEach((item, index) => {
            this.setupPortfolioItem(item, index);
        });

        this.setupPortfolioGrid();
    }

    setupPortfolioItem(item, index) {
        const image = item.querySelector('img');
        const overlay = item.querySelector('.portfolio-overlay');

        // Enhanced hover animations
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -20,
                rotationX: 5,
                rotationY: 5,
                z: 50,
                duration: 0.6,
                ease: "back.out(1.7)"
            });

            gsap.to(image, {
                scale: 1.1,
                filter: "blur(2px)",
                duration: 0.8,
                ease: "power2.out"
            });

            gsap.to(overlay, {
                opacity: 1,
                backdropFilter: "blur(10px)",
                duration: 0.4,
                ease: "power2.out"
            });

            // Animate overlay content
            gsap.fromTo(overlay.querySelectorAll('h3, p, .portfolio-tech span'),
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    delay: 0.2,
                    ease: "back.out(1.7)"
                }
            );
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                rotationX: 0,
                rotationY: 0,
                z: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.8)"
            });

            gsap.to(image, {
                scale: 1,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power2.out"
            });

            gsap.to(overlay, {
                opacity: 0,
                backdropFilter: "blur(0px)",
                duration: 0.3,
                ease: "power2.out"
            });
        });

        // Scroll-triggered entrance animation
        gsap.fromTo(item,
            {
                y: 200,
                opacity: 0,
                rotationX: 45,
                scale: 0.8
            },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                scale: 1,
                duration: 1.5,
                delay: index * 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    setupPortfolioGrid() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;

        // Grid entrance animation
        gsap.fromTo(portfolioGrid,
            {
                scale: 0.5,
                opacity: 0,
                rotationX: 45
            },
            {
                scale: 1,
                opacity: 1,
                rotationX: 0,
                duration: 1.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: portfolioGrid,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // ===== INITIALIZATION =====
    initAllAnimations() {
        // Add CSS for animations
        this.injectAnimationStyles();

        // Update ScrollTrigger on resize
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });

        console.log('🚀 Groundbreaking animations initialized!');
    }

    injectAnimationStyles() {
        const styles = `
            /* Custom Cursor Styles */
            .groundbreaking-cursor {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 10000;
                mix-blend-mode: difference;
            }

            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #fff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            }

            .cursor-outline {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.3s ease;
            }

            .cursor-preview {
                position: absolute;
                width: 120px;
                height: 80px;
                border-radius: 8px;
                overflow: hidden;
                transform: translate(-50%, -150%) scale(0);
                opacity: 0;
                pointer-events: none;
            }

            .cursor-preview img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .preview-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8));
                mix-blend-mode: multiply;
            }

            /* Disable default cursor */
            .groundbreaking-cursor ~ * {
                cursor: none !important;
            }

            /* 3D Transform Setup */
            .portfolio-item,
            .service-card,
            .magnetic-btn {
                transform-style: preserve-3d;
                will-change: transform;
            }

            /* Smooth Performance */
            .portfolio-item img,
            .floating-element,
            .hero-image {
                will-change: transform;
                backface-visibility: hidden;
            }

            /* Reduced Motion */
            @media (prefers-reduced-motion: reduce) {
                .groundbreaking-cursor {
                    display: none;
                }

                * {
                    animation-duration: 0.01ms !important;
                    transition-duration: 0.01ms !important;
                }
            }

            /* Mobile Optimizations */
            @media (max-width: 768px) {
                .groundbreaking-cursor {
                    display: none;
                }

                .portfolio-item,
                .service-card {
                    transform: none !important;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // ===== REVOLUTIONARY SECTIONS ANIMATIONS =====
    initRevolutionarySections() {
        this.initAboutSection();
        this.initTeamSection();
        this.initTestimonialsSection();
    }

    initAboutSection() {
        // Timeline animations
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            ScrollTrigger.create({
                trigger: item,
                start: "top 75%",
                onEnter: () => {
                    item.classList.add('animate-in');
                }
            });
        });

        // Skills animation
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(skill => {
            const skillLevel = parseInt(skill.dataset.skill) || 90;

            ScrollTrigger.create({
                trigger: skill,
                start: "top 80%",
                onEnter: () => {
                    skill.classList.add('animate-fill');
                    // Set the actual width for the skill fill
                    const fill = skill.querySelector('.skill-fill');
                    if (fill) {
                        fill.style.transform = `scaleX(${skillLevel / 100})`;
                    }
                }
            });
        });

        // Floating badge animation
        const badges = document.querySelectorAll('.animated-badge, .magnetic-badge');
        badges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                gsap.to(badge, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });

            badge.addEventListener('mouseleave', () => {
                gsap.to(badge, {
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
        });
    }

    initTeamSection() {
        // Team member magnetic effects
        const teamMembers = document.querySelectorAll('.team-member.magnetic-item');
        teamMembers.forEach(member => {
            this.setupTeamMagneticEffect(member);
        });

        // Team member hover animations
        const memberImages = document.querySelectorAll('.team-member .image-placeholder');
        memberImages.forEach(imageContainer => {
            const img = imageContainer.querySelector('img');
            const overlay = imageContainer.querySelector('.image-overlay');

            if (img && overlay) {
                imageContainer.addEventListener('mouseenter', () => {
                    gsap.to(img, {
                        scale: 1.1,
                        rotation: 2,
                        duration: 0.6,
                        ease: "power2.out"
                    });

                    gsap.to(overlay, {
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });

                imageContainer.addEventListener('mouseleave', () => {
                    gsap.to(img, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    });

                    gsap.to(overlay, {
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
            }
        });

        // Culture stats counter animation
        const cultureNumbers = document.querySelectorAll('.culture-number');
        cultureNumbers.forEach(number => {
            const text = number.textContent.trim();
            const hasPercent = text.includes('%');
            const hasSlash = text.includes('/');

            let targetValue = 0;
            if (hasPercent) {
                targetValue = parseInt(text.replace('%', ''));
            } else if (hasSlash) {
                // For ratings like "4.9/5", just animate the first number
                targetValue = parseFloat(text.split('/')[0]) * 10; // Multiply by 10 for smoother animation
            } else {
                targetValue = parseInt(text.replace('+', '')) || 0;
            }

            ScrollTrigger.create({
                trigger: number,
                start: "top 80%",
                onEnter: () => {
                    const obj = { value: 0 };
                    gsap.to(obj, {
                        value: targetValue,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: () => {
                            if (hasSlash) {
                                number.textContent = `${(obj.value / 10).toFixed(1)}/5`;
                            } else if (hasPercent) {
                                number.textContent = `${Math.floor(obj.value)}%`;
                            } else {
                                number.textContent = `${Math.floor(obj.value)}${text.includes('+') ? '+' : ''}`;
                            }
                        }
                    });
                }
            });
        });
    }

    setupTeamMagneticEffect(element) {
        const strength = 0.15;

        element.addEventListener('mouseenter', () => {
            gsap.to(element, {
                z: 30,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * strength;
            const deltaY = (e.clientY - centerY) * strength;

            gsap.to(element, {
                x: deltaX,
                y: deltaY,
                rotationX: deltaY * 0.05,
                rotationY: deltaX * 0.05,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                z: 0,
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.8)"
            });
        });
    }

    initTestimonialsSection() {
        // Testimonial carousel functionality
        const carousel = document.querySelector('.testimonials-carousel');
        const slides = document.querySelectorAll('.testimonial-slide');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.querySelector('.testimonial-nav.prev');
        const nextBtn = document.querySelector('.testimonial-nav.next');

        if (!carousel || slides.length === 0) return;

        let currentSlide = 0;
        const totalSlides = slides.length;

        // Auto-play carousel
        let autoPlayInterval = setInterval(() => {
            this.nextTestimonial();
        }, 5000);

        // Navigation event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextTestimonial();
                this.resetAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevTestimonial();
                this.resetAutoPlay();
            });
        }

        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });

        // Store references for carousel methods
        this.testimonialCarousel = {
            carousel,
            slides,
            indicators,
            currentSlide,
            totalSlides,
            autoPlayInterval
        };

        // Initialize first slide
        this.updateTestimonialSlide();

        // Testimonial metrics animation
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            ScrollTrigger.create({
                trigger: metric,
                start: "top 80%",
                onEnter: () => {
                    const text = metric.textContent.trim();
                    if (text.includes('%')) {
                        const value = parseInt(text.replace('%', ''));
                        const obj = { value: 0 };
                        gsap.to(obj, {
                            value,
                            duration: 2,
                            ease: "power2.out",
                            onUpdate: () => {
                                metric.textContent = `${Math.floor(obj.value)}%`;
                            }
                        });
                    } else if (text.includes('s')) {
                        const value = parseFloat(text.replace('s', ''));
                        const obj = { value: 0 };
                        gsap.to(obj, {
                            value,
                            duration: 2,
                            ease: "power2.out",
                            onUpdate: () => {
                                metric.textContent = `${obj.value.toFixed(1)}s`;
                            }
                        });
                    }
                }
            });
        });
    }

    nextTestimonial() {
        if (!this.testimonialCarousel) return;

        this.testimonialCarousel.currentSlide = (this.testimonialCarousel.currentSlide + 1) % this.testimonialCarousel.totalSlides;
        this.updateTestimonialSlide();
    }

    prevTestimonial() {
        if (!this.testimonialCarousel) return;

        this.testimonialCarousel.currentSlide = (this.testimonialCarousel.currentSlide - 1 + this.testimonialCarousel.totalSlides) % this.testimonialCarousel.totalSlides;
        this.updateTestimonialSlide();
    }

    goToSlide(index) {
        if (!this.testimonialCarousel) return;

        this.testimonialCarousel.currentSlide = index;
        this.updateTestimonialSlide();
    }

    updateTestimonialSlide() {
        if (!this.testimonialCarousel) return;

        const { slides, indicators, currentSlide } = this.testimonialCarousel;

        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
                gsap.fromTo(slide,
                    { opacity: 0, x: 50 },
                    { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
                );
            } else {
                slide.classList.remove('active');
            }
        });

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    resetAutoPlay() {
        if (!this.testimonialCarousel) return;

        clearInterval(this.testimonialCarousel.autoPlayInterval);
        this.testimonialCarousel.autoPlayInterval = setInterval(() => {
            this.nextTestimonial();
        }, 5000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GroundbreakingAnimations();
    });
} else {
    new GroundbreakingAnimations();
}