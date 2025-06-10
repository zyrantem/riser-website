// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Typing animation for hero titles
    const hirerTypingElement = document.getElementById('typing-text-hirers');
    const talentTypingElement = document.getElementById('typing-text-talent');
    
    const hirerJobTypes = ['Hire', 'Freelancer', 'Content Creator', 'Marketer', 'Producer', 'Consultant'];
    const talentJobTypes = ['Gig', 'Role', 'Client', 'Project', 'Collab', 'Opportunity'];

    function createTypingAnimation(element, jobTypes, startDelay = 0) {
        let currentIndex = 0;
        let isDeleting = false;
        let currentText = '';
        let typeSpeed = 100;

        function typeText() {
            const currentJobType = jobTypes[currentIndex];
            
            if (isDeleting) {
                currentText = currentJobType.substring(0, currentText.length - 1);
                typeSpeed = 50; // Faster deletion
            } else {
                currentText = currentJobType.substring(0, currentText.length + 1);
                typeSpeed = 100; // Faster typing speed
            }

            if (element) {
                element.textContent = currentText;
            }

            if (!isDeleting && currentText === currentJobType) {
                // Finished typing, pause then start deleting
                typeSpeed = 1500; // Shorter pause for 1.5 seconds
                isDeleting = true;
            } else if (isDeleting && currentText === '') {
                // Finished deleting, move to next job type
                isDeleting = false;
                currentIndex = (currentIndex + 1) % jobTypes.length;
                typeSpeed = 300; // Shorter pause before typing next word
            }

            setTimeout(typeText, typeSpeed);
        }

        // Start animation with delay
        setTimeout(() => {
            if (element) {
                typeText();
            }
        }, startDelay);
    }

    // Start both typing animations
    createTypingAnimation(hirerTypingElement, hirerJobTypes, 0);
    createTypingAnimation(talentTypingElement, talentJobTypes, 1000);

    // Hero box click expansion (initialize BEFORE audience toggle)
    function initHeroBoxes() {
        const heroBoxes = document.querySelectorAll('.hero-side-inner');
        
        heroBoxes.forEach(box => {
            box.addEventListener('click', function(e) {
                // Don't expand if clicking on buttons with data-audience (let them handle navigation)
                if (e.target.closest('a[data-audience]')) {
                    return;
                }
                // Always expand when clicking anywhere else in the box
                expandBox(this);
            });
        });
        
        // Function to expand a specific box
        function expandBox(targetBox) {
            const isExpanded = targetBox.classList.contains('expanded');
            
            // Close all boxes first
            heroBoxes.forEach(otherBox => {
                otherBox.classList.remove('expanded');
            });
            
            // If this box wasn't expanded, expand it
            if (!isExpanded) {
                targetBox.classList.add('expanded');
            }
        }
        
        // Close boxes when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.hero-side-inner')) {
                heroBoxes.forEach(box => {
                    box.classList.remove('expanded');
                });
            }
        });
        
        // Expose expandBox function for use by button handlers
        window.expandHeroBox = expandBox;
        
        // Add click handlers for the main hero CTA text buttons - SIMPLE EXPAND ONLY
        const heroCtaButtons = document.querySelectorAll('.hero-cta-text');
        heroCtaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                console.log('CTA text button clicked:', this.textContent);
                
                // Stop any event propagation to prevent conflicts
                e.stopPropagation();
                e.preventDefault();
                
                const heroBox = this.closest('.hero-side-inner');
                if (heroBox) {
                    expandBox(heroBox);
                    console.log('Box expanded for:', this.textContent);
                }
                
                // That's it - no scrolling, no audience switching, just expand
            });
        });
    }

    // Initialize hero boxes FIRST
    initHeroBoxes();

    // Audience Toggle Functionality
    function initAudienceToggle() {
        const hirerRadio = document.getElementById('toggle-hirers');
        const talentRadio = document.getElementById('toggle-talent');
        const hirersContent = document.getElementById('hirers-content');
        const talentContent = document.getElementById('talent-content');
        const pricingSection = document.querySelector('.hirers-only');

        function switchAudience(audience) {
            // Remove active class from all content
            hirersContent.classList.remove('active');
            talentContent.classList.remove('active');
            
            // Add active class to selected audience
            if (audience === 'hirers') {
                hirerRadio.checked = true;
                hirersContent.classList.add('active');
                pricingSection.classList.add('show');
            } else {
                talentRadio.checked = true;
                talentContent.classList.add('active');
                pricingSection.classList.remove('show');
            }

            // Update navigation link for pricing
            const pricingNavLink = document.querySelector('a[href="#pricing"]');
            if (pricingNavLink) {
                if (audience === 'hirers') {
                    pricingNavLink.style.display = 'block';
                } else {
                    pricingNavLink.style.display = 'none';
                }
            }
        }

        // Handle radio button changes
        hirerRadio.addEventListener('change', function() {
            if (this.checked) {
                switchAudience('hirers');
            }
        });

        talentRadio.addEventListener('change', function() {
            if (this.checked) {
                switchAudience('talent');
            }
        });

        // Handle hero buttons with audience data (the link buttons that should scroll)
        const heroButtons = document.querySelectorAll('a[data-audience]');
        heroButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                console.log('Audience button clicked:', this.textContent);
                e.preventDefault();
                const audience = this.getAttribute('data-audience');
                const targetId = this.getAttribute('href');
                
                // Expand the appropriate hero box immediately
                const heroBox = this.closest('.hero-side-inner');
                if (heroBox && window.expandHeroBox) {
                    window.expandHeroBox(heroBox);
                }
                
                // Switch to the correct audience first
                switchAudience(audience);
                
                // Then scroll to the section containing the audience content
                setTimeout(() => {
                    // Always scroll to the how-it-works section which contains both audience contents
                    const howItWorksSection = document.querySelector('#how-it-works');
                    if (howItWorksSection) {
                        const navHeight = document.querySelector('.nav').offsetHeight || 0;
                        const targetPosition = howItWorksSection.offsetTop - navHeight;
                        
                        console.log('Scrolling to how-it-works section at position:', targetPosition);
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100); // Small delay to ensure content is switched first
            });
        });

        // Initialize with hirers by default
        switchAudience('hirers');

        // Expose function globally for external use
        window.switchAudience = switchAudience;
    }

    // Initialize toggle functionality
    initAudienceToggle();

    // Handle navigation links (excluding audience buttons which are handled separately)
    const navLinks = document.querySelectorAll('a[href^="#"]:not([data-audience])');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle background videos
    const videos = document.querySelectorAll('.hero-video, .talent-video, .cta-video');
    
    videos.forEach(video => {
        // Add loaded class when video can play
        video.addEventListener('canplay', function() {
            this.classList.add('loaded');
        });
        
        // Handle video load errors
        video.addEventListener('error', function() {
            console.log('Video failed to load, hiding video background');
            const videoBackground = this.closest('[class*="video-background"]');
            if (videoBackground) {
                videoBackground.style.display = 'none';
            }
        });
        
        // Attempt to play video
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Auto-play prevented, video will remain paused');
                // On mobile or when autoplay is blocked, hide video
                if (window.innerWidth < 768) {
                    const videoBackground = video.closest('[class*="video-background"]');
                    if (videoBackground) {
                        videoBackground.style.display = 'none';
                    }
                }
            });
        }
    });

    // Optimize video playback based on connection
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            // Hide videos on slow connections
            videos.forEach(video => {
                const videoBackground = video.closest('[class*="video-background"]');
                if (videoBackground) {
                    videoBackground.style.display = 'none';
                }
            });
        }
    }

    // Mobile navigation toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = navMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Add scroll effect to navigation
    const nav = document.querySelector('.nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.section, .card, .pricing-card, .testimonial');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Form handling (if needed)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add your form submission logic here
            const formData = new FormData(this);
            
            // Example: Show success message
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            button.textContent = 'Success!';
            button.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                this.reset();
            }, 2000);
        });
    });

    // Video performance optimization
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                if (video.paused) {
                    video.play().catch(() => {
                        // Auto-play failed, that's okay
                    });
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, {
        threshold: 0.25
    });

    // Observe videos for performance
    videos.forEach(video => {
        videoObserver.observe(video);
    });
});

// Add some utility functions
const utils = {
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Check if user prefers reduced motion
    prefersReducedMotion: function() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
};

// Add smooth transitions on page load
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Handle visibility change to pause/play videos
document.addEventListener('visibilitychange', function() {
    const videos = document.querySelectorAll('.hero-video, .talent-video, .cta-video');
    
    if (document.hidden) {
        videos.forEach(video => {
            if (!video.paused) {
                video.pause();
                video.dataset.wasPlaying = 'true';
            }
        });
    } else {
        videos.forEach(video => {
            if (video.dataset.wasPlaying === 'true') {
                video.play().catch(() => {
                    // Auto-play failed, that's okay
                });
                delete video.dataset.wasPlaying;
            }
        });
    }
});

// Add CSS for page load transition
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        body {
            opacity: 0;
        }
        
        .nav {
            transition: transform 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 4rem;
                left: -100%;
                width: 100%;
                height: calc(100vh - 4rem);
                background-color: white;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 2rem;
                transition: left 0.3s ease;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);
}); 