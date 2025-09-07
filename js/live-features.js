// ===== LIVE FEATURES SHOWCASE JAVASCRIPT =====
// Interactive functionality for the live features demonstrations

class LiveFeaturesShowcase {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.carouselInterval = null;
        this.init();
    }

    init() {
        this.initVideoDemo();
        this.initCarousel();
        this.initAnimations();
        this.initCounters();
        this.initMasonry();
        this.initForm();
        this.setupIntersectionObserver();
    }

    // Hero Video Background Demo
    initVideoDemo() {
        const controls = document.querySelectorAll('.demo-btn[data-bg]');
        const videoBackground = document.querySelector('.video-background');

        controls.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                controls.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Remove all background classes
                videoBackground.className = 'video-background';
                // Add selected background class
                const bgClass = btn.dataset.bg;
                videoBackground.classList.add(bgClass);
            });
        });

        // Set initial active state
        if (controls.length > 0) {
            controls[0].classList.add('active');
        }
    }

    // Carousel Demo
    initCarousel() {
        const slides = document.querySelector('.carousel-slides');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        if (!slides) return;

        // Update carousel position
        const updateCarousel = () => {
            const translateX = -this.currentSlide * 100;
            slides.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        };

        // Next slide
        const nextSlide = () => {
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            updateCarousel();
        };

        // Previous slide
        const prevSlide = () => {
            this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            updateCarousel();
        };

        // Go to specific slide
        const goToSlide = (index) => {
            this.currentSlide = index;
            updateCarousel();
        };

        // Event listeners
        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Auto-play carousel
        this.carouselInterval = setInterval(nextSlide, 5000);

        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer?.addEventListener('mouseenter', () => {
            clearInterval(this.carouselInterval);
        });

        carouselContainer?.addEventListener('mouseleave', () => {
            this.carouselInterval = setInterval(nextSlide, 5000);
        });

        // Initialize
        updateCarousel();
    }

    // Scroll-Triggered Animations Demo
    initAnimations() {
        const triggerBtn = document.querySelector('.trigger-animations');
        const animationBoxes = document.querySelectorAll('.animation-box');

        const triggerAnimations = () => {
            animationBoxes.forEach((box, index) => {
                // Reset animation
                box.classList.remove('animate');
                
                // Trigger animation with delay
                setTimeout(() => {
                    box.classList.add('animate');
                }, index * 200);
            });
        };

        triggerBtn?.addEventListener('click', triggerAnimations);

        // Auto-trigger on scroll (handled by intersection observer)
    }

    // Animated Counters & Progress Bars Demo
    initCounters() {
        const triggerBtn = document.querySelector('.trigger-counters');
        
        const animateCounters = () => {
            // Animate counters
            const counters = document.querySelectorAll('.counter-value');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const increment = target / 50;
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                counter.textContent = '0';
                updateCounter();
            });

            // Animate progress bars
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const target = parseInt(bar.dataset.target);
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = target + '%';
                }, 200);
            });

            // Animate circular progress
            const circularProgress = document.querySelector('.progress-bar-circle');
            if (circularProgress) {
                const target = parseInt(circularProgress.dataset.target);
                const circumference = 314;
                const offset = circumference - (target / 100) * circumference;
                
                circularProgress.style.strokeDashoffset = circumference;
                setTimeout(() => {
                    circularProgress.style.strokeDashoffset = offset;
                }, 200);
            }
        };

        triggerBtn?.addEventListener('click', animateCounters);

        // Auto-trigger on scroll (handled by intersection observer)
        this.animateCounters = animateCounters;
    }

    // Masonry Gallery Demo
    initMasonry() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                // Filter items
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Set initial active filter
        if (filterBtns.length > 0) {
            filterBtns[0].classList.add('active');
        }
    }

    // Interactive Form Demo
    initForm() {
        const form = document.querySelector('.demo-form');
        const inputs = document.querySelectorAll('.form-input');
        const submitBtn = document.querySelector('.form-submit');

        if (!form) return;

        // Input validation
        const validateInput = (input) => {
            const value = input.value.trim();
            const type = input.type;
            let isValid = true;
            let errorMessage = '';

            // Remove existing error messages
            const existingError = input.parentNode.querySelector('.form-error');
            if (existingError) existingError.remove();

            // Validation rules
            if (input.required && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            } else if (input.name === 'phone' && value) {
                const phoneRegex = /^[\d\s\-\(\)\+]+$/;
                if (!phoneRegex.test(value) || value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
            }

            // Update input styling
            if (isValid) {
                input.classList.remove('error');
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
                input.classList.add('error');
                
                // Show error message
                const errorEl = document.createElement('div');
                errorEl.className = 'form-error show';
                errorEl.textContent = errorMessage;
                input.parentNode.appendChild(errorEl);
            }

            return isValid;
        };

        // Add validation to inputs
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate all inputs
            let allValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    allValid = false;
                }
            });

            if (allValid) {
                // Simulate form submission
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success';
                    successMessage.textContent = '✅ Form submitted successfully! This is a demo form.';
                    
                    // Remove existing success messages
                    const existingSuccess = form.querySelector('.form-success');
                    if (existingSuccess) existingSuccess.remove();
                    
                    form.appendChild(successMessage);
                    
                    // Reset form
                    form.reset();
                    inputs.forEach(input => {
                        input.classList.remove('valid', 'error');
                    });
                    
                    // Reset button
                    submitBtn.textContent = 'Submit Message';
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }

    // Intersection Observer for auto-triggering animations
    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    // Trigger animations
                    if (target.classList.contains('animations-grid')) {
                        const boxes = target.querySelectorAll('.animation-box');
                        boxes.forEach((box, index) => {
                            setTimeout(() => {
                                box.classList.add('animate');
                            }, index * 200);
                        });
                    }
                    
                    // Trigger counters
                    if (target.classList.contains('counters-grid')) {
                        this.animateCounters();
                    }
                    
                    // Only trigger once
                    observer.unobserve(target);
                }
            });
        }, options);

        // Observe elements
        const animationsGrid = document.querySelector('.animations-grid');
        const countersGrid = document.querySelector('.counters-grid');
        
        if (animationsGrid) observer.observe(animationsGrid);
        if (countersGrid) observer.observe(countersGrid);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LiveFeaturesShowcase();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Clear any intervals
    if (window.liveFeaturesShowcase && window.liveFeaturesShowcase.carouselInterval) {
        clearInterval(window.liveFeaturesShowcase.carouselInterval);
    }
});