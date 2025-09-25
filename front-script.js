/**
 * Student Portal Authentication System
 * Created by Stranger Bot
 * Secure front-end authentication with password management
 */

class AuthenticationSystem {
    constructor() {
        // Default credentials (stored securely in production)
        this.credentials = {
            portalPassword: 'strangerbot05',
            developerUsername: 'rehaan05',
            developerPassword: 'sonimess1400'
        };
        
        // Load saved credentials from memory (simulating secure storage)
        this.loadCredentials();
        
        this.initializeElements();
        this.bindEvents();
        this.initializeApp();
    }

    initializeElements() {
        // Main cards
        this.mainCard = document.getElementById('mainCard');
        this.developerCard = document.getElementById('developerCard');
        this.developerDashboard = document.getElementById('developerDashboard');
        
        // Portal login elements
        this.portalLoginForm = document.getElementById('portalLoginForm');
        this.portalPasswordInput = document.getElementById('portalPassword');
        this.togglePortalPassword = document.getElementById('togglePortalPassword');
        
        // Developer login elements
        this.developerLoginBtn = document.getElementById('developerLoginBtn');
        this.developerLoginForm = document.getElementById('developerLoginForm');
        this.developerUsernameInput = document.getElementById('developerUsername');
        this.developerPasswordInput = document.getElementById('developerPassword');
        this.toggleDeveloperPassword = document.getElementById('toggleDeveloperPassword');
        this.backToMainBtn = document.getElementById('backToMainBtn');
        
        // Dashboard elements
        this.changePortalPasswordForm = document.getElementById('changePortalPasswordForm');
        this.changeDeveloperPasswordForm = document.getElementById('changeDeveloperPasswordForm');
        this.accessPortalBtn = document.getElementById('accessPortalBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Password toggle elements
        this.toggleNewPortalPassword = document.getElementById('toggleNewPortalPassword');
        this.toggleNewDeveloperPassword = document.getElementById('toggleNewDeveloperPassword');
        
        // Alert container
        this.alertContainer = document.getElementById('alertContainer');
    }

    bindEvents() {
        // Portal login
        this.portalLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePortalLogin();
        });
        
        // Developer login button
        this.developerLoginBtn.addEventListener('click', () => {
            this.showDeveloperLogin();
        });
        
        // Developer login form
        this.developerLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDeveloperLogin();
        });
        
        // Back to main button
        this.backToMainBtn.addEventListener('click', () => {
            this.showMainCard();
        });
        
        // Password change forms
        this.changePortalPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleChangePortalPassword();
        });
        
        this.changeDeveloperPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleChangeDeveloperPassword();
        });
        
        // Dashboard actions
        this.accessPortalBtn.addEventListener('click', () => {
            this.accessPortal();
        });
        
        this.logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });
        
        // Password toggle functionality
        this.togglePortalPassword.addEventListener('click', () => {
            this.togglePasswordVisibility(this.portalPasswordInput, this.togglePortalPassword);
        });
        
        this.toggleDeveloperPassword.addEventListener('click', () => {
            this.togglePasswordVisibility(this.developerPasswordInput, this.toggleDeveloperPassword);
        });
        
        this.toggleNewPortalPassword.addEventListener('click', () => {
            const input = document.getElementById('newPortalPassword');
            this.togglePasswordVisibility(input, this.toggleNewPortalPassword);
        });
        
        this.toggleNewDeveloperPassword.addEventListener('click', () => {
            const input = document.getElementById('newDeveloperPassword');
            this.togglePasswordVisibility(input, this.toggleNewDeveloperPassword);
        });
        
        // Enhanced enter key handling
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const activeForm = document.querySelector('form:not([style*="display: none"])');
                if (activeForm) {
                    const submitButton = activeForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.click();
                    }
                }
            }
        });
        
        // Auto-focus on visible inputs
        document.addEventListener('transitionend', (e) => {
            if (e.target.classList.contains('auth-card') && !e.target.classList.contains('hide')) {
                const firstInput = e.target.querySelector('input:not([type="hidden"])');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 100);
                }
            }
        });
    }

    initializeApp() {
        console.log('🔐 Authentication System initialized');
        console.log('📝 Created by Stranger Bot');
        
        this.addWelcomeAnimation();
        this.showAlert('Welcome to Student Portal Access Control', 'info');
    }

    loadCredentials() {
        // In production, this would load from secure storage
        // For demo, we'll use the default values
        const saved = this.getFromStorage('auth_credentials');
        if (saved) {
            this.credentials = { ...this.credentials, ...saved };
        }
    }

    saveCredentials() {
        // In production, this would save to secure storage
        this.saveToStorage('auth_credentials', this.credentials);
    }

    getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Storage access error:', error);
            return null;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('Storage save error:', error);
        }
    }

    addWelcomeAnimation() {
        const cards = document.querySelectorAll('.auth-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
        });
        
        setTimeout(() => {
            this.mainCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            this.mainCard.style.opacity = '1';
            this.mainCard.style.transform = 'translateY(0)';
        }, 300);
    }

    // Authentication Methods
    handlePortalLogin() {
        const password = this.portalPasswordInput.value.trim();
        
        if (!password) {
            this.showAlert('Please enter the portal password', 'warning');
            this.focusInput(this.portalPasswordInput);
            return;
        }

        if (password === this.credentials.portalPassword) {
            this.showAlert('Access granted! Redirecting to portal...', 'success');
            this.showLoadingOverlay();
            
            // Simulate redirect delay
            setTimeout(() => {
                this.redirectToPortal();
            }, 2000);
        } else {
            this.showAlert('Invalid portal password. Please try again.', 'error');
            this.focusInput(this.portalPasswordInput);
            this.portalPasswordInput.value = '';
        }
    }

    handleDeveloperLogin() {
        const username = this.developerUsernameInput.value.trim();
        const password = this.developerPasswordInput.value.trim();
        
        if (!username || !password) {
            this.showAlert('Please enter both username and password', 'warning');
            return;
        }

        if (username === this.credentials.developerUsername && 
            password === this.credentials.developerPassword) {
            this.showAlert('Developer access granted!', 'success');
            setTimeout(() => {
                this.showDeveloperDashboard();
            }, 1000);
        } else {
            this.showAlert('Invalid developer credentials. Access denied.', 'error');
            this.developerUsernameInput.value = '';
            this.developerPasswordInput.value = '';
            this.focusInput(this.developerUsernameInput);
        }
    }

    handleChangePortalPassword() {
        const newPassword = document.getElementById('newPortalPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPortalPassword').value.trim();
        
        if (!newPassword || !confirmPassword) {
            this.showAlert('Please fill in both password fields', 'warning');
            return;
        }

        if (newPassword.length < 6) {
            this.showAlert('Password must be at least 6 characters long', 'warning');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showAlert('Passwords do not match', 'error');
            return;
        }

        if (newPassword === this.credentials.portalPassword) {
            this.showAlert('New password must be different from current password', 'warning');
            return;
        }

        // Update credentials
        this.credentials.portalPassword = newPassword;
        this.saveCredentials();
        
        this.showAlert('Portal password updated successfully!', 'success');
        
        // Clear form
        document.getElementById('newPortalPassword').value = '';
        document.getElementById('confirmPortalPassword').value = '';
    }

    handleChangeDeveloperPassword() {
        const currentPassword = document.getElementById('currentDeveloperPassword').value.trim();
        const newPassword = document.getElementById('newDeveloperPassword').value.trim();
        const confirmPassword = document.getElementById('confirmDeveloperPassword').value.trim();
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showAlert('Please fill in all password fields', 'warning');
            return;
        }

        if (currentPassword !== this.credentials.developerPassword) {
            this.showAlert('Current password is incorrect', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showAlert('Password must be at least 6 characters long', 'warning');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showAlert('New passwords do not match', 'error');
            return;
        }

        if (newPassword === this.credentials.developerPassword) {
            this.showAlert('New password must be different from current password', 'warning');
            return;
        }

        // Update credentials
        this.credentials.developerPassword = newPassword;
        this.saveCredentials();
        
        this.showAlert('Developer password updated successfully!', 'success');
        
        // Clear form
        document.getElementById('currentDeveloperPassword').value = '';
        document.getElementById('newDeveloperPassword').value = '';
        document.getElementById('confirmDeveloperPassword').value = '';
    }

    // Navigation Methods
    showMainCard() {
        this.hideAllCards();
        setTimeout(() => {
            this.mainCard.style.display = 'block';
            this.mainCard.classList.remove('hide');
            this.focusInput(this.portalPasswordInput);
        }, 300);
    }

    showDeveloperLogin() {
        this.hideAllCards();
        setTimeout(() => {
            this.developerCard.style.display = 'block';
            this.developerCard.classList.remove('hide');
            this.focusInput(this.developerUsernameInput);
        }, 300);
    }

    showDeveloperDashboard() {
        this.hideAllCards();
        setTimeout(() => {
            this.developerDashboard.style.display = 'block';
            this.developerDashboard.classList.remove('hide');
        }, 300);
    }

    hideAllCards() {
        const cards = [this.mainCard, this.developerCard, this.developerDashboard];
        cards.forEach(card => {
            card.classList.add('hide');
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        });
    }

    handleLogout() {
        this.showAlert('Logging out...', 'info');
        setTimeout(() => {
            this.showMainCard();
            this.clearAllForms();
        }, 1000);
    }

    accessPortal() {
        this.showAlert('Accessing portal with developer privileges...', 'success');
        this.showLoadingOverlay();
        
        setTimeout(() => {
            this.redirectToPortal();
        }, 2000);
    }

    redirectToPortal() {
        // In production, redirect to the actual portal
        // For demo, we'll show how this would work
        window.location.href = 'portal.html'; // Your main portal page
    }

    // Utility Methods
    togglePasswordVisibility(input, toggleButton) {
        const icon = toggleButton.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    focusInput(input) {
        setTimeout(() => {
            input.focus();
            input.select();
        }, 100);
    }

    clearAllForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
    }

    showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p style="color: white; margin-top: 20px; font-size: 1.1em;">Please wait...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';
        
        // Auto-remove after 5 seconds (fallback)
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 5000);
    }

    showAlert(message, type = 'info') {
        const alertId = 'alert_' + Date.now();
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.id = alertId;
        alert.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        this.alertContainer.appendChild(alert);
        
        // Show alert with animation
        setTimeout(() => {
            alert.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideAlert(alertId);
        }, 5000);
        
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    hideAlert(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 500);
        }
    }

    // Security Methods
    validatePassword(password, minLength = 6) {
        if (!password || password.length < minLength) {
            return false;
        }
        
        // Additional security checks can be added here
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        
        return hasNumber && hasLetter;
    }

    sanitizeInput(input) {
        return input.trim().replace(/[<>]/g, '');
    }

    // Debug Methods (remove in production)
    getCredentials() {
        console.log('Current credentials:', this.credentials);
        return this.credentials;
    }

    resetCredentials() {
        this.credentials = {
            portalPassword: 'strangerbot05',
            developerUsername: 'rehaan05',
            developerPassword: 'sonimess1400'
        };
        this.saveCredentials();
        this.showAlert('Credentials reset to defaults', 'info');
        console.log('Credentials reset to defaults');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Loading Authentication System...');
    console.log('📝 Created by Stranger Bot');
    
    // Initialize the authentication system
    const authSystem = new AuthenticationSystem();
    
    // Make auth system globally accessible for debugging
    window.AuthSystem = authSystem;
    
    console.log('✅ Authentication System loaded successfully!');
    console.log('💡 Debug commands:');
    console.log('   - AuthSystem.getCredentials() - View current credentials');
    console.log('   - AuthSystem.resetCredentials() - Reset to defaults');
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👀 Page is now visible');
    } else {
        console.log('🙈 Page is now hidden');
    }
});

// Handle browser back/forward navigation
window.addEventListener('popstate', (event) => {
    console.log('🔄 Navigation detected');
});

// Prevent form submission on Enter in password fields (handled by custom logic)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.type === 'password') {
        e.preventDefault();
        // Let our custom handler deal with it
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        document.dispatchEvent(event);
    }
});
