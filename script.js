// ===================================
// Configuration & Constants
// ===================================
const CONFIG = {
    typingSpeed: 100,
    typingDelay: 2000,
    emailServiceURL: 'https://formspree.io/f/YOUR_FORM_ID', // TODO: Replace YOUR_FORM_ID with your ID from formspree.io
    animationThreshold: 0.15
};

window.Portfolio = {};

const typingTexts = [
    'Web Development',
    'Machine Learning',
    'IoT Systems',
    'Full-Stack Applications',
    'Data-Driven Solutions'
];

// ===================================
// DOM Elements
// ===================================
const DOM = {
    loadingScreen: document.getElementById('loading-screen'),
    navbar: document.getElementById('navbar'),
    themeToggle: document.getElementById('themeToggle'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    backToTop: document.getElementById('backToTop'),
    contactForm: document.getElementById('contactForm'),
    formStatus: document.getElementById('formStatus'),
    resumeBtn: document.getElementById('resumeBtn'),
    particles: document.getElementById('particles'),
    typedText: document.querySelector('.typed-text'),
    statNumbers: document.querySelectorAll('.stat-number'),
    skillItems: document.querySelectorAll('.skill-item')
};

// ===================================
// Initialization
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initTypingEffect();
    initParticles();
    initScrollAnimations();
    initContactForm();
    initSkillBars();
    initStatCounters();
    initLazyLoading();
    initFormValidation();

    DOM.loadingScreen.classList.add('hidden');
});

// ===================================
// Theme Management
// ===================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    DOM.themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = DOM.themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    // Mobile menu toggle
    DOM.mobileMenuToggle.addEventListener('click', () => {
        DOM.mobileMenuToggle.classList.toggle('active');
        DOM.navMenu.classList.toggle('active');
        const isOpen = DOM.navMenu.classList.contains('active');
        DOM.mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    });
    
    // Smooth scroll for navigation links
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu
                    DOM.navMenu.classList.remove('active');
                    DOM.mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Single debounced scroll handler replacing three separate listeners
    function handleScroll() {
        const scrollY = window.scrollY;
        DOM.navbar.classList.toggle('scrolled', scrollY > 100);
        DOM.backToTop.classList.toggle('visible', scrollY > 500);
        updateActiveNavLink();
    }
    window.addEventListener('scroll', debounce(handleScroll, 100));

    DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Resume download — add resume.pdf to project root to enable
    DOM.resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = 'resume.pdf';
        link.download = 'Pranav_Pankhawala_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===================================
// Typing Effect
// ===================================
function initTypingEffect() {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            DOM.typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            DOM.typedText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = CONFIG.typingSpeed;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = CONFIG.typingDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// ===================================
// Particles Animation
// ===================================
function initParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const count = window.innerWidth < 768 ? 10 : 20;
    for (let i = 0; i < count; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;

    DOM.particles.appendChild(particle);
}


// ===================================
// Scroll Animations (AOS-like)
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: CONFIG.animationThreshold,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// Stat Counters
// ===================================
function initStatCounters() {
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    DOM.statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-count'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            // Format the final value: if it's a decimal, show one decimal place, otherwise show integer
            const finalValue = target % 1 === 0 ? target : target.toFixed(1);
            element.textContent = finalValue + suffix;
            clearInterval(timer);
        } else {
            // During animation, show integer for whole numbers, or one decimal place for decimals
            if (target % 1 === 0) {
                element.textContent = Math.floor(current);
            } else {
                element.textContent = current.toFixed(1);
            }
        }
    }, 16);
}

// ===================================
// Skill Bars Animation
// ===================================
function initSkillBars() {
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const progress = entry.target.querySelector('.skill-progress');
                const level = entry.target.getAttribute('data-level');
                
                setTimeout(() => {
                    progress.style.width = level + '%';
                }, 200);
            }
        });
    }, observerOptions);
    
    DOM.skillItems.forEach(item => observer.observe(item));
}

// ===================================
// Contact Form with Email Integration
// ===================================
function initContactForm() {
    DOM.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = DOM.contactForm.querySelector('.btn-submit');
        const formData = new FormData(DOM.contactForm);
        
        // Show loading state
        submitBtn.classList.add('loading');
        DOM.formStatus.style.display = 'none';
        
        try {
            // Using Formspree for form handling
            // Replace CONFIG.emailServiceURL with your Formspree endpoint
            const response = await fetch(CONFIG.emailServiceURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormStatus('success', 'Thank you! Your message has been sent successfully.');
                DOM.contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Fallback: Send email using mailto (less reliable but works without backend)
            sendEmailViaMailto(formData);
        } finally {
            submitBtn.classList.remove('loading');
        }
    });
}

function sendEmailViaMailto(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    const mailtoLink = `mailto:pranav.pankhawala@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    DOM.formStatus.className = 'form-status error';
    DOM.formStatus.innerHTML = '';
    DOM.formStatus.style.display = 'block';

    const msg = document.createElement('p');
    msg.textContent = 'Automatic submission unavailable. Use the link below to send via email client:';

    const link = document.createElement('a');
    link.href = mailtoLink;
    link.textContent = 'Open Email Client';
    link.style.cssText = 'display:inline-block;margin-top:0.5rem;color:var(--primary-color);font-weight:600;text-decoration:underline;';

    DOM.formStatus.appendChild(msg);
    DOM.formStatus.appendChild(link);
    DOM.contactForm.reset();
}

function showFormStatus(type, message) {
    DOM.formStatus.className = `form-status ${type}`;
    DOM.formStatus.textContent = message;
    DOM.formStatus.style.display = 'block';
    
    setTimeout(() => {
        DOM.formStatus.style.display = 'none';
    }, 5000);
}

// ===================================
// Performance Optimizations
// ===================================

// Debounce function for scroll events
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

// Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}


// ===================================
// Keyboard Navigation
// ===================================
document.addEventListener('keydown', (e) => {
    // Press 'Esc' to close mobile menu
    if (e.key === 'Escape' && DOM.navMenu.classList.contains('active')) {
        DOM.navMenu.classList.remove('active');
        DOM.mobileMenuToggle.classList.remove('active');
    }
    
    // Press 'Home' to scroll to top
    if (e.key === 'Home' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ===================================
// Form Validation Enhancement
// ===================================
function initFormValidation() {
    const inputs = DOM.contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.add('error');
        field.classList.remove('valid');
    }
    
    return isValid;
}

// ===================================
// Console Message (Easter Egg)
// ===================================
console.log(
    '%c👨‍💻 Pranav Pankhawala',
    'color: #2563eb; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cLooking for something? Feel free to reach out!',
    'color: #6b7280; font-size: 14px;'
);
console.log(
    '%c📧 pranav.pankhawala@gmail.com',
    'color: #2563eb; font-size: 14px;'
);


