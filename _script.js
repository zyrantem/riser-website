// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Device Detection for QR Codes
function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Reset all QR codes
    document.querySelectorAll('.device-specific-qr').forEach(qr => {
        qr.classList.remove('active');
    });
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // iOS device
        const iosQr = document.querySelector('.ios-qr');
        if (iosQr) {
            iosQr.classList.add('active');
        }
    } else if (/android/i.test(userAgent)) {
        // Android device
        const androidQr = document.querySelector('.android-qr');
        if (androidQr) {
            androidQr.classList.add('active');
        }
    } else {
        // Desktop or other devices - show default
        const defaultQr = document.querySelector('.default-qr');
        if (defaultQr) {
            defaultQr.classList.add('active');
        }
    }
}

// Run device detection on page load
window.addEventListener('load', detectDevice);

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe elements with data-aos attributes
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Counter Animation for Hero Stats
function animateCounter(element, start, end, duration) {
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = formatNumber(current);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K+';
    }
    return num + '%';
}

// Trigger counter animation when hero section is visible
const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const targets = [10000, 500, 95]; // Target numbers
                const formatted = ['10K+', '500+', '95%'];
                setTimeout(() => {
                    stat.textContent = formatted[index];
                }, index * 200);
            });
            heroStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroStatsObserver.observe(heroStats);
}

// Enhanced Parallax Effect for Hero Background
function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shape');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrolled * speed);
        const rotation = scrolled * 0.1;
        element.style.transform = `translateY(${yPos}px) rotate(${rotation + (index * 120)}deg)`;
    });
}

// Debounced parallax for better performance
const debouncedParallax = debounce(updateParallax, 10);
window.addEventListener('scroll', debouncedParallax);

// Form Submission Handler
const emailForm = document.querySelector('.email-form');
if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('.email-input');
        const submitBtn = this.querySelector('.submit-btn');
        
        // Basic email validation
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailRegex.test(email)) {
            // Show loading state
            submitBtn.textContent = 'Joining...';
            submitBtn.disabled = true;
            submitBtn.style.background = 'rgba(255, 255, 255, 0.8)';
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.textContent = 'Joined! ✓';
                submitBtn.style.background = '#10b981';
                emailInput.value = '';
                
                // Show success message
                showNotification('🎉 Welcome to Riser! You\'re on the waitlist.', 'success');
                
                // Reset after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = 'Join Waitlist';
                    submitBtn.style.background = 'white';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        } else {
            // Show error state
            emailInput.style.borderColor = '#ff4e45';
            emailInput.style.background = 'rgba(255, 78, 69, 0.1)';
            emailInput.placeholder = 'Please enter a valid email';
            showNotification('Please enter a valid email address', 'error');
            
            setTimeout(() => {
                emailInput.style.borderColor = '';
                emailInput.style.background = '';
                emailInput.placeholder = 'Enter your email';
            }, 3000);
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ff4e45' : '#000000'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Typing Effect for Hero Title (disabled for now as requested)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Enhanced Feature Cards Tilt Effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return; // Disable on mobile
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Enhanced Step Cards Hover Effect
document.querySelectorAll('.step').forEach(step => {
    step.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 768) return; // Disable on mobile
        
        step.style.transform = 'translateY(-10px) scale(1.02)';
        step.style.borderColor = 'rgba(255, 78, 69, 0.5)';
    });
    
    step.addEventListener('mouseleave', () => {
        step.style.transform = 'translateY(0) scale(1)';
        step.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});

// Testimonial Cards Enhanced Hover Effect
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(255, 78, 69, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
    });
});

// QR Code Interaction
document.querySelectorAll('.qr-code').forEach(qr => {
    qr.addEventListener('click', () => {
        const label = qr.querySelector('.qr-label').textContent;
        
        if (label.includes('iOS')) {
            showNotification('📱 Redirecting to App Store...', 'info');
            // In real implementation: window.open('https://apps.apple.com/app/riser', '_blank');
        } else if (label.includes('Google Play')) {
            showNotification('📱 Redirecting to Google Play...', 'info');
            // In real implementation: window.open('https://play.google.com/store/apps/details?id=com.riser', '_blank');
        } else {
            showNotification('📱 Choose your platform above to download', 'info');
        }
    });
});

// Download Button Enhanced Click Tracking
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add click animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
        
        const isAppStore = btn.querySelector('img').alt.includes('App Store');
        const platform = isAppStore ? 'iOS App Store' : 'Google Play Store';
        
        console.log('Download button clicked:', platform);
        showNotification(`🚀 ${platform} coming soon! Join our waitlist for early access.`, 'info');
    });
});

// Smooth scroll to sections with offset for fixed navbar
function smoothScrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Enhanced Mobile Experience
function handleMobileOptimizations() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce parallax on mobile for better performance
        document.querySelectorAll('.floating-shape').forEach(shape => {
            shape.style.animation = 'float 8s ease-in-out infinite';
        });
        
        // Optimize touch interactions
        document.querySelectorAll('.feature-card, .step, .testimonial-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}

// Run mobile optimizations on load and resize
window.addEventListener('load', handleMobileOptimizations);
window.addEventListener('resize', debounce(handleMobileOptimizations, 250));

// Lazy Loading for Images (enhanced)
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
            }
            imageObserver.unobserve(img);
        }
    });
}, { rootMargin: '50px' });

// Apply lazy loading to images
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Easter Egg: Konami Code (Updated for new brand)
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated - Riser themed
        document.body.style.filter = 'hue-rotate(180deg) saturate(1.5)';
        showNotification('🚀 Riser Easter Egg Activated! You found the secret!', 'success');
        
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
        
        console.log('🚀 Riser Easter egg activated! Welcome to the inner circle!');
        konamiCode = [];
    }
});

// Performance optimization: Debounce function
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

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'assets-inspiration/Frame-182.png',
        'assets-inspiration/RISERROCKET_WHITE-768x230.png',
        'assets-inspiration/1-e1740571502825.png',
        'assets-inspiration/2-e1740571422777.png',
        'assets-inspiration/3-e1740571371474.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize everything
function initializeWebsite() {
    preloadImages();
    detectDevice();
    handleMobileOptimizations();
    
    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

// Run initialization
window.addEventListener('load', initializeWebsite);

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Focus management for better accessibility
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableContent = document.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
});

console.log('🚀 Riser website loaded successfully with enhanced features!'); 