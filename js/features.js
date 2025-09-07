// ===== TFTL-INSPIRED FEATURES JAVASCRIPT =====
// Advanced animations and interactions inspired by TFTL agency

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initVideoHero();
    initCarousel();
    initScrollAnimations();
    initHoverEffects();
});

// ===== TFTL-INSPIRED PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('tftlPreloader');
    const counterNumber = document.querySelector('.counter-number');
    const words = document.querySelectorAll('.word-line');
    
    if (!preloader) return;
    
    let currentPercent = 0;
    let loadedAssets = 0;
    let totalAssets = 0;
    
    // Set ARIA attributes for accessibility
    preloader.setAttribute('aria-busy', 'true');
    preloader.setAttribute('role', 'status');
    preloader.setAttribute('aria-live', 'polite');
    
    // Collect assets to track
    const assetsToLoad = [];
    
    // Track fonts
    assetsToLoad.push(
        document.fonts.ready,
        // Track images in viewport
        ...Array.from(document.querySelectorAll('img')).slice(0, 5),
        // Track hero video
        document.getElementById('heroVideo')
    );
    
    // Filter out null assets
    const validAssets = assetsToLoad.filter(asset => asset);
    totalAssets = validAssets.length;
    
    // Track progress
    function updateProgress() {
        const progressPercent = totalAssets > 0 ? (loadedAssets / totalAssets) * 100 : 100;
        let targetPercent = Math.min(progressPercent, 100);

        // Snap to target when close to avoid asymptotic stall
        if (Math.abs(targetPercent - currentPercent) < 0.5) {
            currentPercent = targetPercent;
        }

        // Smooth progress animation
        const progressAnimation = () => {
            if (currentPercent < targetPercent) {
                currentPercent += (targetPercent - currentPercent) * 0.2; // a bit faster easing

                if (counterNumber) {
                    counterNumber.textContent = Math.round(currentPercent);
                }

                requestAnimationFrame(progressAnimation);
            } else {
                // Ensure final snap to 100 when all assets accounted for
                if (loadedAssets >= totalAssets) {
                    currentPercent = 100;
                }
                if (counterNumber) {
                    counterNumber.textContent = Math.round(currentPercent);
                }
                if (currentPercent >= 100) {
                    completeLoading();
                }
            }
        };

        progressAnimation();
    }
    
    // Load assets with timeout fallback
    function loadAssets() {
        let timeoutReached = false;
        
        // Set timeout fallback (max 6 seconds)
        const timeoutId = setTimeout(() => {
            timeoutReached = true;
            loadedAssets = totalAssets;
            updateProgress();
        }, 6000);
        
        // Track font loading
        if (document.fonts) {
            document.fonts.ready.then(() => {
                if (!timeoutReached) {
                    loadedAssets++;
                    updateProgress();
                }
            });
        } else {
            loadedAssets++;
        }
        
        // Track images
        const images = Array.from(document.querySelectorAll('img')).slice(0, 5);
        images.forEach(img => {
            if (img.complete) {
                loadedAssets++;
            } else {
                img.onload = img.onerror = () => {
                    if (!timeoutReached) {
                        loadedAssets++;
                        updateProgress();
                    }
                };
            }
        });
        
        // Track hero video
        const heroVideo = document.getElementById('heroVideo');
        if (heroVideo) {
            const handleVideoLoad = () => {
                if (!timeoutReached) {
                    loadedAssets++;
                    updateProgress();
                }
            };
            
            if (heroVideo.readyState >= 3) { // HAVE_FUTURE_DATA
                handleVideoLoad();
            } else {
                heroVideo.addEventListener('canplaythrough', handleVideoLoad, { once: true });
                heroVideo.addEventListener('loadedmetadata', handleVideoLoad, { once: true });
                
                // Video timeout fallback
                setTimeout(() => {
                    if (!timeoutReached && loadedAssets < totalAssets) {
                        handleVideoLoad();
                    }
                }, 2000);
            }
        }
        
        // Clear timeout if all assets loaded
        const checkComplete = () => {
            if (loadedAssets >= totalAssets) {
                clearTimeout(timeoutId);
            }
        };
        
        // Start checking
        setTimeout(checkComplete, 100);
        updateProgress();
    }
    
    function completeLoading() {
        // Remove ARIA busy state
        preloader.removeAttribute('aria-busy');

        // Run a quick compression wave on preloader words before fade-out
        preloader.classList.add('compressing');

        // After compression, fade out the preloader
        setTimeout(() => {
            preloader.classList.add('loaded');

            // Enable scrolling again
            document.body.style.overflow = '';

            // Announce completion and remove preloader from DOM after transition
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('preloader:complete'));
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
                startIntroAnimations();
            }, 800);
        }, 550);
    }
    
    // Allow ESC to dismiss if stuck
    const handleEscape = (e) => {
        if (e.key === 'Escape' && !preloader.classList.contains('loaded')) {
            const timeSinceStart = Date.now() - startTime;
            if (timeSinceStart > 6000) { // Only allow after 6 seconds
                completeLoading();
                document.removeEventListener('keydown', handleEscape);
            }
        }
    };
    
    const startTime = Date.now();
    document.addEventListener('keydown', handleEscape);
    
    // Prevent scrolling during preloader
    document.body.style.overflow = 'hidden';
    
    // Start loading
    loadAssets();
}

// ===== INTRO ANIMATIONS =====
function startIntroAnimations() {
    // Animate title lines - only target TFTL features section
    const titleLines = document.querySelectorAll('.tftl-features .intro-line');
    titleLines.forEach((line, index) => {
        const span = document.createElement('span');
        span.textContent = line.textContent;
        line.innerHTML = '';
        line.appendChild(span);
        
        setTimeout(() => {
            span.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Trigger CSS animations for subtitle and button - only in TFTL section
    const subtitle = document.querySelector('.tftl-features .intro-subtitle');
    const button = document.querySelector('.tftl-features .explore-btn');
    
    if (subtitle) subtitle.style.animationPlayState = 'running';
    if (button) button.style.animationPlayState = 'running';
}

// ===== VIDEO HERO SECTION =====
function initVideoHero() {
    const video = document.getElementById('heroVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const timelineTrack = document.querySelector('.timeline-track');
    const timelineProgress = document.querySelector('.timeline-progress');
    
    if (!video) return;
    
    let isPlaying = false;
    let isMuted = true;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Don't autoplay, show poster
        video.removeAttribute('autoplay');
        video.pause();
        return;
    }
    
    // Auto-play video when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const videoSection = entry.target.closest('.video-hero-section');
            if (entry.isIntersecting) {
                videoSection?.classList.add('in-view');
                playVideo();
            } else {
                videoSection?.classList.remove('in-view');
                pauseVideo();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(video);
    
    // Handle video loading errors
    video.addEventListener('error', () => {
        console.log('Video failed to load, showing poster');
        video.style.display = 'none';
        // Show poster image if video fails
        const poster = video.poster;
        if (poster) {
            const posterImg = document.createElement('img');
            posterImg.src = poster;
            posterImg.alt = 'Hero Video Background';
            posterImg.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;';
            video.parentNode.appendChild(posterImg);
        }
    });
    
    // Play/Pause functionality
    function playVideo() {
        video.play().catch(e => console.log('Video play error:', e));
        isPlaying = true;
        updatePlayPauseIcon();
    }
    
    function pauseVideo() {
        video.pause();
        isPlaying = false;
        updatePlayPauseIcon();
    }
    
    function updatePlayPauseIcon() {
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }
    
    function updateVolumeIcon() {
        const volumeOn = volumeBtn.querySelector('.volume-on');
        const volumeOff = volumeBtn.querySelector('.volume-off');
        
        if (isMuted) {
            volumeOn.style.display = 'none';
            volumeOff.style.display = 'block';
        } else {
            volumeOn.style.display = 'block';
            volumeOff.style.display = 'none';
        }
    }
    
    // Event listeners
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseVideo();
            } else {
                playVideo();
            }
        });
    }
    
    if (volumeBtn) {
        volumeBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            video.muted = isMuted;
            updateVolumeIcon();
        });
    }
    
    // Timeline functionality
    if (timelineTrack) {
        timelineTrack.addEventListener('click', (e) => {
            const rect = timelineTrack.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            video.currentTime = video.duration * percentage;
        });
    }
    
    // Update timeline progress
    video.addEventListener('timeupdate', () => {
        if (video.duration && timelineProgress) {
            const percentage = (video.currentTime / video.duration) * 100;
            timelineProgress.style.width = percentage + '%';
        }
    });
    
    // Initialize icons
    updatePlayPauseIcon();
    updateVolumeIcon();
}

// ===== CAROUSEL =====
function initCarousel() {
    const carousel = document.getElementById('mainCarousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = carousel.querySelector('.progress-bar');
    const track = carousel.querySelector('.carousel-wrapper');
    
    let currentSlide = 0;
    let isAnimating = false;
    let autoplayInterval;
    
    // Initialize carousel
    showSlide(0);
    startAutoplay();
    
    function showSlide(index) {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Update current slide index
        const previousSlide = currentSlide;
        currentSlide = index;
        
        // Update ARIA attributes for accessibility
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.removeAttribute('aria-hidden');
                slide.setAttribute('inert', '');
                setTimeout(() => slide.removeAttribute('inert'), 600);
            } else {
                slide.setAttribute('aria-hidden', 'true');
                slide.setAttribute('inert', '');
            }
        });
        
        // Transform track to show current slide
        const translateX = -currentSlide * 100;
        if (track) {
            track.style.transform = `translateX(${translateX}%)`;
        }
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
            dot.setAttribute('aria-pressed', i === currentSlide);
        });
        
        // Update progress bar
        const progressPercentage = ((currentSlide + 1) / slides.length) * 100;
        if (progressBar) {
            progressBar.style.width = progressPercentage + '%';
        }
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000); // 5 seconds
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoplay(); // Restart autoplay
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoplay(); // Restart autoplay
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoplay(); // Restart autoplay
        });
    });
    
    // Pause autoplay on hover and when out of view
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // IntersectionObserver for autoplay control
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target.closest('.carousel-section');
            if (entry.isIntersecting) {
                section?.classList.add('in-view');
                startAutoplay();
            } else {
                section?.classList.remove('in-view');
                stopAutoplay();
            }
        });
    }, { threshold: 0.3 });
    
    carouselObserver.observe(carousel);
    
    // Scoped keyboard navigation - only when carousel is focused
    carousel.addEventListener('keydown', (e) => {
        if (!carousel.closest('.carousel-section')?.classList.contains('in-view')) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
            startAutoplay();
        }
    });
    
    // Make carousel focusable for keyboard navigation
    if (!carousel.hasAttribute('tabindex')) {
        carousel.setAttribute('tabindex', '0');
    }
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
            startAutoplay();
        }
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // GSAP-like scroll animations with Intersection Observer
    const animatedElements = document.querySelectorAll('[data-scroll-section]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Trigger specific animations based on section
                if (entry.target.classList.contains('video-hero-section')) {
                    animateVideoText();
                } else if (entry.target.classList.contains('carousel-section')) {
                    animateSectionTitle(entry.target);
                } else if (entry.target.classList.contains('features-grid-section')) {
                    animateFeatureItems(entry.target);
                }
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => scrollObserver.observe(el));
    
    function animateVideoText() {
        const videoTitle = document.querySelector('.video-title');
        const videoDescription = document.querySelector('.video-description');
        
        if (videoTitle) {
            const spans = videoTitle.querySelectorAll('span');
            spans.forEach((span, index) => {
                setTimeout(() => {
                    span.style.animation = 'slideInLeft 1s cubic-bezier(0.32, 0, 0.12, 1) forwards';
                }, index * 200);
            });
        }
        
        if (videoDescription) {
            setTimeout(() => {
                videoDescription.style.animation = 'fadeInUp 1s cubic-bezier(0.32, 0, 0.12, 1) forwards';
            }, 800);
        }
    }
    
    function animateSectionTitle(section) {
        const title = section.querySelector('.section-title');
        if (title) {
            const spans = title.querySelectorAll('span');
            spans.forEach((span, index) => {
                setTimeout(() => {
                    span.style.transform = 'translateY(0)';
                    span.style.opacity = '1';
                }, index * 100);
            });
        }
    }
    
    function animateFeatureItems(section) {
        const items = section.querySelectorAll('.feature-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(0)';
                item.style.opacity = '1';
            }, index * 200);
        });
    }
}

// ===== HOVER EFFECTS =====
function initHoverEffects() {
    // Enhanced hover effects for feature items
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            // Add magnetic effect
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            document.addEventListener('mousemove', magneticEffect);
            
            function magneticEffect(e) {
                const deltaX = (e.clientX - centerX) * 0.1;
                const deltaY = (e.clientY - centerY) * 0.1;
                
                item.style.transform = `translateY(-10px) translateX(${deltaX}px) translateZ(${deltaY}px)`;
            }
            
            item.addEventListener('mouseleave', () => {
                document.removeEventListener('mousemove', magneticEffect);
                item.style.transform = 'translateY(0) translateX(0) translateZ(0)';
            }, { once: true });
        });
    });
    
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.explore-btn, .nav-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// ===== UTILITY FUNCTIONS =====
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

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Add custom CSS animations dynamically
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .in-view {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .feature-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.32, 0, 0.12, 1);
        }
        
        .section-title span {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.32, 0, 0.12, 1);
        }
    `;
    document.head.appendChild(style);
}

// Initialize custom styles
addCustomStyles();
