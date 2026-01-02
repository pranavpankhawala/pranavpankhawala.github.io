// ===================================
// Trial Registration System
// ===================================

const TRIAL_CONFIG = {
    apiBaseURL: 'https://your-backend-api.railway.app', // Replace with your Railway URL
    studentTrialDays: 14,
    professionalTrialDays: 300
};

class TrialRegistrationSystem {
    constructor() {
        this.overlay = null;
        this.modal = null;
        this.form = null;
        this.selectedUserType = null;
        this.init();
    }

    init() {
        this.createModalHTML();
        this.attachEventListeners();
        console.log('✅ Trial Registration System initialized');
    }

    createModalHTML() {
        // Create overlay and modal
        const overlayHTML = `
            <div class="trial-overlay" id="trialOverlay">
                <div class="trial-modal">
                    <!-- Loading Overlay -->
                    <div class="trial-loading-overlay" id="trialLoading">
                        <div class="trial-spinner"></div>
                    </div>

                    <!-- Main Form -->
                    <div id="trialFormContainer">
                        <div class="trial-modal-header">
                            <button class="trial-close-btn" id="trialCloseBtn" aria-label="Close">
                                <i class="fas fa-times"></i>
                            </button>
                            <div class="trial-icon">
                                <i class="fas fa-rocket"></i>
                            </div>
                            <h2 class="trial-modal-title">Start Your Free Trial</h2>
                            <p class="trial-modal-subtitle">Get instant access to all premium features</p>
                        </div>

                        <div class="trial-modal-body">
                            <form class="trial-form" id="trialRegistrationForm">
                                <!-- User Type Selection -->
                                <div class="trial-form-group">
                                    <label class="trial-form-label">
                                        Choose Your Trial Type <span class="required">*</span>
                                    </label>
                                    <div class="trial-options">
                                        <div class="trial-option-card" data-user-type="student">
                                            <span class="trial-option-checkmark">
                                                <i class="fas fa-check"></i>
                                            </span>
                                            <div class="trial-option-icon">
                                                <i class="fas fa-graduation-cap"></i>
                                            </div>
                                            <h3>Student</h3>
                                            <div class="trial-duration">14 Days Free</div>
                                            <p>Perfect for learning and academic projects</p>
                                        </div>
                                        <div class="trial-option-card" data-user-type="professional">
                                            <span class="trial-option-checkmark">
                                                <i class="fas fa-check"></i>
                                            </span>
                                            <div class="trial-option-icon">
                                                <i class="fas fa-briefcase"></i>
                                            </div>
                                            <h3>Professional</h3>
                                            <div class="trial-duration">300 Days Free</div>
                                            <p>Ideal for commercial & enterprise use</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Name -->
                                <div class="trial-form-group">
                                    <label for="trialName" class="trial-form-label">
                                        Full Name <span class="required">*</span>
                                    </label>
                                    <div style="position: relative;">
                                        <input 
                                            type="text" 
                                            id="trialName" 
                                            name="name" 
                                            class="trial-form-input"
                                            placeholder="John Doe"
                                            required
                                        >
                                        <i class="fas fa-user trial-input-icon"></i>
                                        <div class="trial-error-message">Please enter your full name</div>
                                    </div>
                                </div>

                                <!-- Email -->
                                <div class="trial-form-group">
                                    <label for="trialEmail" class="trial-form-label">
                                        Email Address <span class="required">*</span>
                                    </label>
                                    <div style="position: relative;">
                                        <input 
                                            type="email" 
                                            id="trialEmail" 
                                            name="email" 
                                            class="trial-form-input"
                                            placeholder="john@example.com"
                                            required
                                        >
                                        <i class="fas fa-envelope trial-input-icon"></i>
                                        <div class="trial-error-message">Please enter a valid email address</div>
                                    </div>
                                </div>

                                <!-- Phone (Optional) -->
                                <div class="trial-form-group">
                                    <label for="trialPhone" class="trial-form-label">
                                        Phone Number (Optional)
                                    </label>
                                    <div style="position: relative;">
                                        <input 
                                            type="tel" 
                                            id="trialPhone" 
                                            name="phone" 
                                            class="trial-form-input"
                                            placeholder="+1 234 567 8900"
                                        >
                                        <i class="fas fa-phone trial-input-icon"></i>
                                    </div>
                                </div>

                                <!-- Conditional: University for Students -->
                                <div class="trial-form-group trial-conditional-field" id="universityField">
                                    <label for="trialUniversity" class="trial-form-label">
                                        University/College <span class="required">*</span>
                                    </label>
                                    <div style="position: relative;">
                                        <input 
                                            type="text" 
                                            id="trialUniversity" 
                                            name="university" 
                                            class="trial-form-input"
                                            placeholder="Your University Name"
                                        >
                                        <i class="fas fa-school trial-input-icon"></i>
                                        <div class="trial-error-message">Please enter your university name</div>
                                    </div>
                                </div>

                                <!-- Conditional: Company for Professionals -->
                                <div class="trial-form-group trial-conditional-field" id="companyField">
                                    <label for="trialCompany" class="trial-form-label">
                                        Company Name <span class="required">*</span>
                                    </label>
                                    <div style="position: relative;">
                                        <input 
                                            type="text" 
                                            id="trialCompany" 
                                            name="company" 
                                            class="trial-form-input"
                                            placeholder="Your Company Name"
                                        >
                                        <i class="fas fa-building trial-input-icon"></i>
                                        <div class="trial-error-message">Please enter your company name</div>
                                    </div>
                                </div>

                                <!-- Benefits -->
                                <div class="trial-benefits">
                                    <h4>
                                        <i class="fas fa-gift"></i>
                                        What's Included in Your Trial
                                    </h4>
                                    <ul>
                                        <li>Full access to all premium features</li>
                                        <li>No credit card required</li>
                                        <li>3-day payment reminder before expiry</li>
                                        <li>Priority email support</li>
                                        <li>Cancel anytime, no commitments</li>
                                    </ul>
                                </div>

                                <!-- Submit Button -->
                                <button type="submit" class="trial-submit-btn" id="trialSubmitBtn">
                                    <span class="btn-text">
                                        <i class="fas fa-rocket"></i>
                                        Start My Free Trial
                                    </span>
                                    <span class="btn-loader">
                                        <i class="fas fa-spinner fa-spin"></i>
                                        Processing...
                                    </span>
                                </button>

                                <!-- Message Container -->
                                <div class="trial-message" id="trialMessage"></div>

                                <!-- Privacy Notice -->
                                <div class="trial-privacy">
                                    By starting your trial, you agree to our 
                                    <a href="#terms" target="_blank">Terms of Service</a> and 
                                    <a href="#privacy" target="_blank">Privacy Policy</a>.
                                    Your data is secure and will never be shared.
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Success Screen -->
                    <div class="trial-success-screen" id="trialSuccessScreen">
                        <div class="trial-success-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <h3>Welcome Aboard! 🎉</h3>
                        <p>Your trial has been activated successfully. Check your email for your license key and next steps.</p>
                        
                        <div class="trial-license-key">
                            <div class="trial-license-key-label">Your Trial License Key</div>
                            <div class="trial-license-key-value" id="licenseKeyDisplay">XXXX-XXXX-XXXX-XXXX</div>
                            <button class="trial-copy-btn" id="copyLicenseBtn">
                                <i class="fas fa-copy"></i> Copy License Key
                            </button>
                        </div>

                        <div class="trial-success-actions">
                            <button class="btn btn-primary" onclick="window.trialSystem.closeModal()">
                                <i class="fas fa-rocket"></i>
                                Get Started
                            </button>
                            <button class="btn btn-outline" onclick="window.open('mailto:pranav.pankhawala@gmail.com')">
                                <i class="fas fa-envelope"></i>
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Store references
        this.overlay = document.getElementById('trialOverlay');
        this.modal = this.overlay.querySelector('.trial-modal');
        this.form = document.getElementById('trialRegistrationForm');
    }

    attachEventListeners() {
        // Close button
        document.getElementById('trialCloseBtn').addEventListener('click', () => this.closeModal());

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.closeModal();
            }
        });

        // User type selection
        document.querySelectorAll('.trial-option-card').forEach(card => {
            card.addEventListener('click', () => this.selectUserType(card));
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Copy license key
        document.getElementById('copyLicenseBtn').addEventListener('click', () => this.copyLicenseKey());

        // Real-time validation
        this.form.querySelectorAll('.trial-form-input').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    selectUserType(card) {
        // Remove previous selection
        document.querySelectorAll('.trial-option-card').forEach(c => c.classList.remove('selected'));
        
        // Add selection
        card.classList.add('selected');
        this.selectedUserType = card.getAttribute('data-user-type');

        // Show/hide conditional fields
        const universityField = document.getElementById('universityField');
        const companyField = document.getElementById('companyField');
        const universityInput = document.getElementById('trialUniversity');
        const companyInput = document.getElementById('trialCompany');

        if (this.selectedUserType === 'student') {
            universityField.classList.add('active');
            companyField.classList.remove('active');
            universityInput.required = true;
            companyInput.required = false;
        } else {
            companyField.classList.add('active');
            universityField.classList.remove('active');
            companyInput.required = true;
            universityInput.required = false;
        }

        console.log('Selected user type:', this.selectedUserType);
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;

        // Check if required and empty
        if (input.required && !value) {
            isValid = false;
        }

        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        // Phone validation (basic)
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[+]?[\d\s-]{10,}$/;
            isValid = phoneRegex.test(value);
        }

        // Update UI
        if (isValid) {
            input.classList.remove('error');
        } else {
            input.classList.add('error');
        }

        return isValid;
    }

    validateForm() {
        let isValid = true;

        // Check user type selected
        if (!this.selectedUserType) {
            this.showMessage('Please select a trial type (Student or Professional)', 'error');
            return false;
        }

        // Validate all required fields
        const requiredInputs = this.form.querySelectorAll('.trial-form-input[required]');
        requiredInputs.forEach(input => {
            // Skip if field is not visible
            const fieldGroup = input.closest('.trial-form-group');
            if (fieldGroup && fieldGroup.classList.contains('trial-conditional-field') && !fieldGroup.classList.contains('active')) {
                return;
            }

            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            console.log('Form validation failed');
            return;
        }

        // Collect form data
        const formData = {
            name: document.getElementById('trialName').value.trim(),
            email: document.getElementById('trialEmail').value.trim(),
            phone: document.getElementById('trialPhone').value.trim() || null,
            userType: this.selectedUserType,
            company: this.selectedUserType === 'professional' ? document.getElementById('trialCompany').value.trim() : null,
            university: this.selectedUserType === 'student' ? document.getElementById('trialUniversity').value.trim() : null
        };

        console.log('Submitting form data:', formData);

        // Show loading
        this.showLoading(true);

        try {
            // Call API
            const response = await fetch(`${TRIAL_CONFIG.apiBaseURL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success!
                this.showSuccessScreen(result.data);
            } else {
                // API error
                throw new Error(result.error || 'Registration failed');
            }

        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage(
                error.message || 'Something went wrong. Please try again or contact support.',
                'error'
            );
        } finally {
            this.showLoading(false);
        }
    }

    showSuccessScreen(data) {
        // Hide form, show success
        document.getElementById('trialFormContainer').style.display = 'none';
        document.getElementById('trialSuccessScreen').classList.add('active');

        // Display license key
        document.getElementById('licenseKeyDisplay').textContent = data.licenseKey;

        // Track conversion
        this.trackEvent('trial_registration_success', {
            userType: this.selectedUserType,
            trialDays: data.daysRemaining
        });
    }

    copyLicenseKey() {
        const licenseKey = document.getElementById('licenseKeyDisplay').textContent;
        
        navigator.clipboard.writeText(licenseKey).then(() => {
            const btn = document.getElementById('copyLicenseBtn');
            const originalHTML = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            btn.style.background = '#10b981';
            btn.style.color = 'white';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('Failed to copy. Please select and copy manually.');
        });
    }

    showMessage(message, type = 'error') {
        const messageEl = document.getElementById('trialMessage');
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        
        messageEl.className = `trial-message ${type} active`;
        messageEl.innerHTML = `
            <span class="trial-message-icon">
                <i class="fas fa-${icon}"></i>
            </span>
            ${message}
        `;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.classList.remove('active');
        }, 5000);
    }

    showLoading(show) {
        const loadingEl = document.getElementById('trialLoading');
        const submitBtn = document.getElementById('trialSubmitBtn');

        if (show) {
            loadingEl.classList.add('active');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            loadingEl.classList.remove('active');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    openModal() {
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form
        this.resetForm();
        
        // Track event
        this.trackEvent('trial_modal_opened');
        
        console.log('Trial modal opened');
    }

    closeModal() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Track event
        this.trackEvent('trial_modal_closed');
        
        console.log('Trial modal closed');
    }

    resetForm() {
        // Reset form
        this.form.reset();
        
        // Clear selections
        document.querySelectorAll('.trial-option-card').forEach(c => c.classList.remove('selected'));
        this.selectedUserType = null;
        
        // Hide conditional fields
        document.querySelectorAll('.trial-conditional-field').forEach(f => f.classList.remove('active'));
        
        // Clear errors
        document.querySelectorAll('.trial-form-input').forEach(i => i.classList.remove('error'));
        
        // Hide messages
        document.getElementById('trialMessage').classList.remove('active');
        
        // Show form, hide success
        document.getElementById('trialFormContainer').style.display = '';
        document.getElementById('trialSuccessScreen').classList.remove('active');
    }

    trackEvent(eventName, data = {}) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Trial Registration',
                ...data
            });
        }
        
        console.log('Event tracked:', eventName, data);
    }
}

// Initialize system
document.addEventListener('DOMContentLoaded', () => {
    window.trialSystem = new TrialRegistrationSystem();
    
    // Attach click handlers to all project cards
    attachProjectClickHandlers();
    
    console.log('✅ Trial Registration System ready');
});

// Attach click handlers to project cards
function attachProjectClickHandlers() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Make card clickable (excluding links inside)
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on GitHub/demo links
            if (e.target.closest('.project-link-icon')) {
                return;
            }
            
            // Get project title
            const projectTitle = card.querySelector('.project-title')?.textContent || 'Project';
            
            console.log(`Project clicked: ${projectTitle}`);
            
            // Track which project was clicked
            if (window.trialSystem) {
                window.trialSystem.trackEvent('project_card_clicked', {
                    project_name: projectTitle
                });
            }
            
            // Open trial modal
            window.openTrialModal();
        });
    });
    
    console.log(`✅ Attached trial triggers to ${projectCards.length} project cards`);
}

// Export for use globally
window.openTrialModal = () => window.trialSystem?.openModal();
window.closeTrialModal = () => window.trialSystem?.closeModal();