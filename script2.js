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

        // Handle hero buttons with audience data (expand first, then scroll on second click)
        const heroButtons = document.querySelectorAll('a[data-audience]');
        heroButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                console.log('Audience button clicked:', this.textContent);
                e.preventDefault();
                const audience = this.getAttribute('data-audience');
                
                // Check if the hero box is already expanded
                const heroBox = this.closest('.hero-side-inner');
                const isAlreadyExpanded = heroBox && heroBox.classList.contains('expanded');
                
                // Always expand the appropriate hero box
                if (heroBox && window.expandHeroBox) {
                    window.expandHeroBox(heroBox);
                }
                
                // Switch to the correct audience
                switchAudience(audience);
                
                // Only scroll if the box was already expanded (second click)
                if (isAlreadyExpanded) {
                    setTimeout(() => {
                        // Scroll to the how-it-works section which contains both audience contents
                        const howItWorksSection = document.querySelector('#how-it-works');
                        if (howItWorksSection) {
                            const navHeight = document.querySelector('.nav').offsetHeight || 0;
                            const targetPosition = howItWorksSection.offsetTop - navHeight;
                            
                            console.log('Box was expanded, scrolling to how-it-works section at position:', targetPosition);
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }, 100); // Small delay to ensure content is switched first
                }
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
    
    // Testimonials Carousel Functionality
    function initTestimonialsCarousel() {
        const track = document.getElementById('testimonialsTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicators = document.querySelectorAll('.indicator');
        
        if (!track || !prevBtn || !nextBtn) return;
        
        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let currentSlide = 0;
        const cardsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        const maxSlides = Math.max(0, totalCards - cardsPerView);
        
        function updateCarousel() {
            const cardWidth = track.querySelector('.testimonial-card').offsetWidth;
            const gap = 24; // var(--space-lg) in pixels
            const translateX = currentSlide * (cardWidth + gap);
            track.style.transform = `translateX(-${translateX}px)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === Math.floor(currentSlide / cardsPerView * 3));
            });
            
            // Update button states
            prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentSlide >= maxSlides ? '0.5' : '1';
        }
        
        function nextSlide() {
            if (currentSlide < maxSlides) {
                currentSlide++;
                updateCarousel();
            }
        }
        
        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = Math.min(index * Math.ceil(cardsPerView), maxSlides);
                updateCarousel();
            });
        });
        
        // Auto-play functionality
        let autoPlayInterval;
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                if (currentSlide >= maxSlides) {
                    currentSlide = 0;
                } else {
                    currentSlide++;
                }
                updateCarousel();
            }, 5000);
        };
        
        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };
        
        // Touch/swipe support
        let startX, endX;
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoPlay();
        });
        
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoPlay();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        // Pause auto-play on hover
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        
        // Resize handler
        window.addEventListener('resize', utils.debounce(() => {
            const newCardsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
            if (newCardsPerView !== cardsPerView) {
                currentSlide = 0;
                updateCarousel();
            }
        }, 250));
        
        // Initialize
        updateCarousel();
        startAutoPlay();
    }
    
    // Initialize carousel after DOM is loaded
    initTestimonialsCarousel();
    
    // Testimonial Modal Functionality
    function initTestimonialModal() {
        const modal = document.getElementById('testimonialModal');
        const closeBtn = document.getElementById('closeModal');
        const modalAuthorName = document.getElementById('modalAuthorName');
        const modalAuthorTitle = document.getElementById('modalAuthorTitle');
        const modalTestimonialText = document.getElementById('modalTestimonialText');
        const modalProfileImg = document.getElementById('modalProfileImg');
        
        // Full testimonial data
        const testimonialData = {
            lucy: {
                name: "Lucy Williamson",
                title: "Director @ ESME LLC & ESLDN | Event Management",
                text: "Over the past few months, we've been growing our event staffing services here in Dubai — supporting everything from corporate functions to private events with a team of reliable, hardworking professionals. It's been rewarding to see how much of a difference the right staff can make on the day of an event.\n\nOn an exciting note, our UK-based company, Event Staff LDN, has recently partnered with RISER to help find and support some of the best event talent across the UK. This collaboration means a lot to us — bringing together experience, aligned goals, and a shared commitment to quality staffing.\n\nHere's to great people, great partnerships, and great events — in Dubai, the UK, and beyond."
            },
            dayana: {
                name: "Dayana Collazos Ibarra",
                title: "Top 25 Marketer to follow in 2025 | Social Media Executive @ The Folio Society",
                text: "Did I go to one of the best networking events? 🤔\n\nLast Wednesday, I went to RISER event 'Design the Life You Want'.\n\nWhen I saw Sophie and Allanah post about this event, of course, I had to go.\n\nIt was so inspiring hearing from Sophie Miller, Billie Bhatia and Faye Longhurst and taking in all of their wisdom and advice from their experiences so far.\n\nBut I LOVED the way the team at Riser, Lamees Butt and Suz Bannister, hosted this event.\n\nRISER is reimagining the term networking, because it is such a buzzword that a lot of people actually hate and are scared off by.\n\nI saw the vision the team has, and I am absolutely here for it.\n\nI hope others planning events take note of how they can make the networking element of an event more FUN and less awkward.\n\nWhat do you think? Does the term networking need a revamp? 🧠"
            },
            gabriela: {
                name: "Gabriela Flax",
                title: "Career Wellness Coach | Creative Content Specialist",
                text: "If your cover letter starts with 'I am an XYZ expert with 10 years of experience...' → DELETE it.\n\nInstead try something like:\n\n'[Company Name] has the audience and authority to shape how Australians think about mental health. But without a cohesive tone of voice, that influence risks feeling fragmented. That's where I come in.'\n\nSee the difference?\n\nOne introduces a résumé.\nThe other introduces a value proposition.\n\nA cover letter isn't an invitation to paraphrase your CV.\nIt's your first pitch.\nYour best shot.\nA chance to demonstrate that you understand the business, the opportunity, and what's at stake.\n\nYou want to make them nod.\nYou want them to say: 'Finally, someone who gets it.'\n\nHere's another Before/After from a client I recently worked with:\n\nBEFORE: 'I'm writing to express my interest in the Marketing Manager position at X Company.'\n\nAFTER: 'X Company's recent pivot toward community-led growth opens the door for deeper brand trust, but only if the content strategy evolves with it. I build content ecosystems that turn followers into advocates.'\n\nWhen you lead with insight, you position yourself as a peer.\nWhen you lead with 'I', you stay in applicant mode.\n\nHere's your litmus test:\nIf your first line could be copied and pasted into a dozen other applications, start again.\n\nAnd if you're staring at a blank page thinking 'how do I know what to say?'\n\nStart with the job description.\nIt's not just a list of tasks.\nIt's a window into the company's pain points, priorities, and growth plans.\n\nThat's your material.\nThat's where the story starts.\n\nCherry on top? Make it a 30 second video.\nRISER is championing this approach."
            },
            sarah: {
                name: "Sarah Johnson",
                title: "Hiring Manager | Tech Startup",
                text: "This will truly change how we discover opportunities. It's democratizing access to people and networks.\n\nThe future of professional networking is here with RISER's innovative approach to connecting talent with opportunities.\n\nWhat I love most is how it removes the traditional barriers and biases that have plagued hiring for decades. Instead of filtering through endless resumes, we get to see the person behind the application.\n\nThe video-first approach means we can assess cultural fit, communication skills, and passion in ways that a CV simply cannot capture.\n\nThis is exactly what the industry needed - a platform that puts human connection back at the center of professional networking."
            },
            mike: {
                name: "Mike Chen",
                title: "Software Developer | Recently Hired Through RISER",
                text: "I was rejected from 500+ jobs. One I got rejected for, I ended up landing through RISER.\n\nThe platform connects you directly with decision makers who value your skills over just keywords.\n\nAfter months of sending applications into the void and getting automated rejections, RISER was a breath of fresh air.\n\nInstead of trying to game ATS systems or fit my experience into rigid job descriptions, I could just be myself and showcase what I'm actually capable of.\n\nThe hiring manager who eventually hired me said my video pitch showed exactly the kind of problem-solving mindset they were looking for - something that never would have come through in a traditional application.\n\nRISER didn't just help me find a job; it helped me find the right job with people who actually wanted to work with me."
            }
        };
        
        // Show modal function
        function showModal(testimonialKey) {
            const data = testimonialData[testimonialKey];
            if (!data) return;
            
            const modalPostAuthor = document.getElementById('modalPostAuthor');
            const modalEngagementStats = document.getElementById('modalEngagementStats');
            const modalProfileImg = document.getElementById('modalProfileImg');
            
            // Set author initials
            const initials = data.name.split(' ').map(n => n[0]).join('');
            modalPostAuthor.setAttribute('data-initials', initials);
            
            // Set profile image if available
            const profileImages = {
                lucy: 'assets-inspiration/lucy.png',
                dayana: 'assets-inspiration/dayana.png',
                gabriela: 'assets-inspiration/gabriela.png'
            };
            if (profileImages[testimonialKey]) {
                modalProfileImg.src = profileImages[testimonialKey];
                modalProfileImg.style.display = 'inline-block';
            } else {
                modalProfileImg.src = '';
                modalProfileImg.style.display = 'none';
            }
            
            modalAuthorName.textContent = data.name;
            modalAuthorTitle.textContent = data.title;
            modalTestimonialText.textContent = data.text;
            
            // Set engagement stats based on testimonial
            const engagementStats = {
                lucy: "❤️ 47 • 💬 8 comments",
                dayana: "🔥 92 • 💬 15 comments • 3 reposts",
                gabriela: "💡 156 • 💬 23 comments • 12 reposts",
                sarah: "🚀 73 • 💬 12 comments • 5 reposts",
                mike: "🎉 234 • 💬 31 comments • 18 reposts"
            };
            
            modalEngagementStats.innerHTML = `<span>${engagementStats[testimonialKey] || "💬 Comments • 🔄 Reposts • ❤️ Reactions"}</span>`;
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        
        // Hide modal function
        function hideModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
        
        // Event listeners for show more buttons using event delegation
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('show-more-btn')) {
                e.stopPropagation();
                e.preventDefault();
                
                const testimonialKey = e.target.getAttribute('data-testimonial');
                console.log('Show more clicked for:', testimonialKey);
                
                if (testimonialKey && testimonialData[testimonialKey]) {
                    showModal(testimonialKey);
                } else {
                    console.error('Invalid testimonial key:', testimonialKey);
                }
            }
        });
        
        // Event listeners for closing modal
        closeBtn.addEventListener('click', hideModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                hideModal();
            }
        });
    }
    
    // Initialize modal functionality
    initTestimonialModal();
}); 