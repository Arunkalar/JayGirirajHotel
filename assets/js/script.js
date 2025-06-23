// ===== GLOBAL VARIABLES =====
let currentPage = '';
let isMenuFilterActive = false;

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

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showMessage(elementId, message, type = 'success') {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const fieldElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    if (fieldElement) {
        fieldElement.style.borderColor = '#dc3545';
    }
}

function clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const fieldElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    if (fieldElement) {
        fieldElement.style.borderColor = '#e0e0e0';
    }
}

function clearAllErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const errorElements = form.querySelectorAll('.error-message');
        const inputElements = form.querySelectorAll('input, select, textarea');
        
        errorElements.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        inputElements.forEach(input => {
            input.style.borderColor = '#e0e0e0';
        });
    }
}

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Sticky navbar on scroll
    if (navbar) {
        const handleScroll = debounce(() => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    }
}

// ===== FADE-IN ANIMATIONS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== MENU FILTERING =====
function initializeMenuFilter() {
    const menuButtons = document.querySelectorAll('.menu-cat-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    if (menuButtons.length === 0 || menuCategories.length === 0) return;
    
    isMenuFilterActive = true;
    
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            menuButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show/hide categories
            menuCategories.forEach(categoryElement => {
                const categoryType = categoryElement.getAttribute('data-category');
                
                if (category === 'all' || categoryType === category) {
                    categoryElement.style.display = 'block';
                    // Re-trigger fade-in animation
                    const fadeElements = categoryElement.querySelectorAll('.fade-in');
                    fadeElements.forEach(element => {
                        element.classList.add('visible');
                    });
                } else {
                    categoryElement.style.display = 'none';
                }
            });
            
            // Smooth scroll to menu section
            const menuSection = document.querySelector('.menu-section');
            if (menuSection) {
                menuSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== STAR RATING FUNCTIONALITY =====
function initializeStarRating() {
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        const ratingType = rating.getAttribute('data-rating');
        const hiddenInput = document.getElementById(`${ratingType}Rating`);
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                highlightStars(stars, index + 1);
            });
            
            star.addEventListener('click', () => {
                const value = index + 1;
                setRating(stars, value);
                if (hiddenInput) {
                    hiddenInput.value = value;
                    clearFieldError(`${ratingType}Rating`);
                }
            });
        });
        
        rating.addEventListener('mouseleave', () => {
            const currentValue = hiddenInput ? hiddenInput.value : 0;
            setRating(stars, parseInt(currentValue) || 0);
        });
    });
}

function highlightStars(stars, count) {
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function setRating(stars, value) {
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// ===== FORM VALIDATION =====
function validateContactForm() {
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors('contactForm');
    
    // First Name validation
    const firstName = document.getElementById('firstName');
    if (!firstName.value.trim()) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    } else if (firstName.value.trim().length < 2) {
        showFieldError('firstName', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Last Name validation
    const lastName = document.getElementById('lastName');
    if (!lastName.value.trim()) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    } else if (lastName.value.trim().length < 2) {
        showFieldError('lastName', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const email = document.getElementById('email');
    if (!email.value.trim()) {
        showFieldError('email', 'Email address is required');
        isValid = false;
    } else if (!validateEmail(email.value.trim())) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (optional but if provided should be valid)
    const phone = document.getElementById('phone');
    if (phone.value.trim() && !validatePhone(phone.value.trim())) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Subject validation
    const subject = document.getElementById('subject');
    if (!subject.value) {
        showFieldError('subject', 'Please select a subject');
        isValid = false;
    }
    
    // Message validation
    const message = document.getElementById('message');
    if (!message.value.trim()) {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateFeedbackForm() {
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors('feedbackForm');
    
    // Customer Name validation
    const customerName = document.getElementById('customerName');
    if (!customerName.value.trim()) {
        showFieldError('customerName', 'Your name is required');
        isValid = false;
    } else if (customerName.value.trim().length < 2) {
        showFieldError('customerName', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const customerEmail = document.getElementById('customerEmail');
    if (!customerEmail.value.trim()) {
        showFieldError('customerEmail', 'Email address is required');
        isValid = false;
    } else if (!validateEmail(customerEmail.value.trim())) {
        showFieldError('customerEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (optional)
    const customerPhone = document.getElementById('customerPhone');
    if (customerPhone.value.trim() && !validatePhone(customerPhone.value.trim())) {
        showFieldError('customerPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Overall rating validation (required)
    const overallRating = document.getElementById('overallRating');
    if (!overallRating.value) {
        showFieldError('overallRating', 'Overall rating is required');
        isValid = false;
    }
    
    // Comments validation
    const feedbackComments = document.getElementById('feedbackComments');
    if (!feedbackComments.value.trim()) {
        showFieldError('feedbackComments', 'Please share your comments');
        isValid = false;
    } else if (feedbackComments.value.trim().length < 10) {
        showFieldError('feedbackComments', 'Comments must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

// ===== FORM SUBMISSION =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateContactForm()) {
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (in real implementation, send to server)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            console.log('Contact form submitted:', data);
            
            // Show success message
            showMessage('form-message', 'Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            clearAllErrors('contactForm');
            
        } catch (error) {
            console.error('Contact form submission error:', error);
            showMessage('form-message', 'Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Hide loading state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

function initializeFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) return;
    
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateFeedbackForm()) {
            return;
        }
        
        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (in real implementation, send to server)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Collect form data
            const formData = new FormData(feedbackForm);
            const data = Object.fromEntries(formData.entries());
            
            console.log('Feedback form submitted:', data);
            
            // Show success message
            showMessage('feedback-message', 'Thank you for your valuable feedback! We appreciate your time and input.', 'success');
            
            // Reset form
            feedbackForm.reset();
            clearAllErrors('feedbackForm');
            
            // Reset star ratings
            const starRatings = document.querySelectorAll('.star-rating');
            starRatings.forEach(rating => {
                const stars = rating.querySelectorAll('.star');
                setRating(stars, 0);
                const ratingType = rating.getAttribute('data-rating');
                const hiddenInput = document.getElementById(`${ratingType}Rating`);
                if (hiddenInput) {
                    hiddenInput.value = '';
                }
            });
            
        } catch (error) {
            console.error('Feedback form submission error:', error);
            showMessage('feedback-message', 'Sorry, there was an error submitting your feedback. Please try again.', 'error');
        } finally {
            // Hide loading state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    const handleScroll = debounce(() => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scroll for anchor links
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
}

// ===== HERO SCROLL INDICATOR =====
function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.welcome-section') || 
                               document.querySelector('.services-section') ||
                               document.querySelector('main');
            
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// ===== FORM FIELD REAL-TIME VALIDATION =====
function initializeRealTimeValidation() {
    // Contact form fields
    const contactFields = [
        { id: 'firstName', validator: (value) => value.trim().length >= 2 },
        { id: 'lastName', validator: (value) => value.trim().length >= 2 },
        { id: 'email', validator: (value) => validateEmail(value.trim()) },
        { id: 'phone', validator: (value) => !value.trim() || validatePhone(value.trim()) },
        { id: 'message', validator: (value) => value.trim().length >= 10 }
    ];
    
    // Feedback form fields
    const feedbackFields = [
        { id: 'customerName', validator: (value) => value.trim().length >= 2 },
        { id: 'customerEmail', validator: (value) => validateEmail(value.trim()) },
        { id: 'customerPhone', validator: (value) => !value.trim() || validatePhone(value.trim()) },
        { id: 'feedbackComments', validator: (value) => value.trim().length >= 10 }
    ];
    
    const allFields = [...contactFields, ...feedbackFields];
    
    allFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.addEventListener('blur', () => {
                if (element.value.trim()) {
                    if (field.validator(element.value)) {
                        clearFieldError(field.id);
                    }
                }
            });
            
            element.addEventListener('input', debounce(() => {
                if (element.value.trim()) {
                    if (field.validator(element.value)) {
                        clearFieldError(field.id);
                    }
                }
            }, 500));
        }
    });
}

// ===== PAGE-SPECIFIC FUNCTIONALITY =====
function initializePageSpecific() {
    currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'menu':
            initializeMenuFilter();
            break;
        case 'contact':
            initializeContactForm();
            break;
        case 'feedback':
            initializeFeedbackForm();
            initializeStarRating();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('menu.html')) return 'menu';
    if (path.includes('contact.html')) return 'contact';
    if (path.includes('feedback.html')) return 'feedback';
    if (path.includes('services.html')) return 'services';
    if (path.includes('about.html')) return 'about';
    return 'home';
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Keyboard navigation for star ratings
    const starRatings = document.querySelectorAll('.star-rating');
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.setAttribute('tabindex', '0');
            star.setAttribute('role', 'button');
            star.setAttribute('aria-label', `Rate ${index + 1} out of 5 stars`);
            
            star.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    star.click();
                }
            });
        });
    });
    
    // Ensure all interactive elements have proper focus states
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('aria-label') && !element.textContent.trim()) {
            const placeholder = element.getAttribute('placeholder');
            if (placeholder) {
                element.setAttribute('aria-label', placeholder);
            }
        }
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initializePerformanceOptimizations() {
    // Lazy load images when they're available
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical pages
    const criticalLinks = document.querySelectorAll('a[href*="menu.html"], a[href*="contact.html"]');
    criticalLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const linkEl = document.createElement('link');
            linkEl.rel = 'prefetch';
            linkEl.href = link.href;
            document.head.appendChild(linkEl);
        }, { once: true });
    });
}

// ===== MAIN INITIALIZATION =====
function initializeApp() {
    // Core functionality
    initializeNavigation();
    initializeAnimations();
    initializeSmoothScrolling();
    initializeScrollIndicator();
    initializeRealTimeValidation();
    
    // Page-specific functionality
    initializePageSpecific();
    
    // Enhancements
    initializeAccessibility();
    initializePerformanceOptimizations();
    
    console.log('Jay Giriraj Hotel & Restaurant website initialized successfully!');
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// ===== DOM READY AND LOAD EVENTS =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Additional initialization after all resources are loaded
window.addEventListener('load', () => {
    // Any functionality that needs all resources to be loaded
    console.log('All resources loaded, website ready!');
});

// ===== EXPORT FOR TESTING (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePhone,
        validateContactForm,
        validateFeedbackForm
    };
}
