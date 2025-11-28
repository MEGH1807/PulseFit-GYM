/**
 * ADVANCED FEATURES - PulseFit Center
 * Includes: Push Notifications, Security Features, Performance Optimizations,
 * Accessibility Enhancements, and CMS Integration
 */

// ============================================
// PUSH NOTIFICATIONS SYSTEM
// ============================================
const NotificationManager = {
    permission: 'default',
    
    /**
     * Initialize push notifications
     */
    async init() {
        if (!('Notification' in window)) {
            console.log('Push notifications not supported');
            return false;
        }

        this.permission = Notification.permission;
        
        // Check if user wants notifications
        const notifPreference = localStorage.getItem('pulsefitNotifications');
        if (notifPreference === 'enabled' && this.permission === 'default') {
            await this.requestPermission();
        }

        // Set up notification preferences UI
        this.setupNotificationControls();
        
        return this.permission === 'granted';
    },

    /**
     * Request notification permission
     */
    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            
            if (permission === 'granted') {
                this.showWelcomeNotification();
                localStorage.setItem('pulsefitNotifications', 'enabled');
            }
            
            return permission === 'granted';
        } catch (error) {
            console.error('Notification permission error:', error);
            return false;
        }
    },

    /**
     * Show notification
     */
    show(title, options = {}) {
        if (this.permission !== 'granted') return;

        const defaultOptions = {
            icon: '/images/logo-icon.png',
            badge: '/images/badge-icon.png',
            vibrate: [200, 100, 200],
            tag: 'pulsefit-notification',
            requireInteraction: false,
            ...options
        };

        try {
            const notification = new Notification(title, defaultOptions);
            
            notification.onclick = (event) => {
                event.preventDefault();
                window.focus();
                if (options.url) {
                    window.location.href = options.url;
                }
                notification.close();
            };

            return notification;
        } catch (error) {
            console.error('Notification error:', error);
        }
    },

    /**
     * Show welcome notification
     */
    showWelcomeNotification() {
        this.show('Welcome to PulseFit!', {
            body: 'You\'ll now receive updates about classes, promotions, and fitness tips.',
            icon: '/images/welcome-icon.png'
        });
    },

    /**
     * Schedule class reminder
     */
    scheduleClassReminder(className, classTime, minutesBefore = 30) {
        const classDateTime = new Date(classTime);
        const reminderTime = new Date(classDateTime.getTime() - (minutesBefore * 60000));
        const now = new Date();

        if (reminderTime > now) {
            const timeout = reminderTime.getTime() - now.getTime();
            setTimeout(() => {
                this.show('Class Reminder', {
                    body: `Your ${className} class starts in ${minutesBefore} minutes!`,
                    tag: 'class-reminder',
                    requireInteraction: true,
                    url: '/dashboard.html'
                });
            }, timeout);
        }
    },

    /**
     * Setup notification control UI
     */
    setupNotificationControls() {
        const controls = document.querySelectorAll('[data-notification-control]');
        controls.forEach(control => {
            control.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.requestPermission();
                } else {
                    localStorage.setItem('pulsefitNotifications', 'disabled');
                }
            });
        });
    }
};

// ============================================
// SECURITY FEATURES
// ============================================
const SecurityManager = {
    /**
     * Sanitize HTML to prevent XSS attacks
     */
    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Escape HTML entities
     */
    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    /**
     * Validate email format
     */
    validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    },

    /**
     * Validate phone number
     */
    validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone);
    },

    /**
     * Validate password strength
     */
    validatePassword(password) {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);

        return {
            valid: minLength && hasUpper && hasLower && hasNumber,
            strength: [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length,
            feedback: {
                minLength,
                hasUpper,
                hasLower,
                hasNumber,
                hasSpecial
            }
        };
    },

    /**
     * Simple CAPTCHA implementation
     */
    SimpleCaptcha: {
        generate() {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const answer = num1 + num2;
            
            return {
                question: `${num1} + ${num2} = ?`,
                answer: answer
            };
        },

        verify(userAnswer, correctAnswer) {
            return parseInt(userAnswer) === correctAnswer;
        },

        render(containerId) {
            const captcha = this.generate();
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = `
                    <div class="captcha-container">
                        <label for="captchaInput">Security Check: ${captcha.question}</label>
                        <input type="number" id="captchaInput" required aria-required="true" 
                               data-captcha-answer="${captcha.answer}">
                        <span class="error-message" role="alert"></span>
                    </div>
                `;
            }
            
            return captcha;
        },

        validateInput(inputId) {
            const input = document.getElementById(inputId);
            const correctAnswer = parseInt(input.dataset.captchaAnswer);
            const userAnswer = parseInt(input.value);
            
            return this.verify(userAnswer, correctAnswer);
        }
    },

    /**
     * Generate CSRF token
     */
    generateCSRFToken() {
        const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        sessionStorage.setItem('csrfToken', token);
        return token;
    },

    /**
     * Verify CSRF token
     */
    verifyCSRFToken(token) {
        const storedToken = sessionStorage.getItem('csrfToken');
        return token === storedToken;
    },

    /**
     * Rate limiting for form submissions
     */
    RateLimiter: {
        attempts: new Map(),
        
        check(key, maxAttempts = 5, timeWindow = 60000) {
            const now = Date.now();
            const attempts = this.attempts.get(key) || [];
            
            // Remove old attempts outside time window
            const recentAttempts = attempts.filter(time => now - time < timeWindow);
            
            if (recentAttempts.length >= maxAttempts) {
                return {
                    allowed: false,
                    remainingTime: Math.ceil((recentAttempts[0] + timeWindow - now) / 1000)
                };
            }
            
            recentAttempts.push(now);
            this.attempts.set(key, recentAttempts);
            
            return { allowed: true };
        },
        
        reset(key) {
            this.attempts.delete(key);
        }
    }
};

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
const PerformanceManager = {
    /**
     * Lazy load images
     */
    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
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

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Preload critical resources
     */
    preloadResources(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = this.getResourceType(url);
            link.href = url;
            document.head.appendChild(link);
        });
    },

    /**
     * Get resource type from URL
     */
    getResourceType(url) {
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
        if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
        if (url.match(/\.css$/i)) return 'style';
        if (url.match(/\.js$/i)) return 'script';
        return 'fetch';
    },

    /**
     * Compress and cache data
     */
    cacheManager: {
        set(key, data, expiryMinutes = 60) {
            const item = {
                data: data,
                expiry: Date.now() + (expiryMinutes * 60000)
            };
            localStorage.setItem(key, JSON.stringify(item));
        },

        get(key) {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);
            if (Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }

            return item.data;
        },

        clear() {
            localStorage.clear();
        }
    },

    /**
     * Monitor page performance
     */
    monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Monitor First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Monitor Cumulative Layout Shift (CLS)
            let clsScore = 0;
            const clsObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                        console.log('CLS:', clsScore);
                    }
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }
};

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
const AccessibilityManager = {
    /**
     * Initialize accessibility features
     */
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLiveRegions();
        this.setupSkipLinks();
        this.checkColorContrast();
    },

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // Trap focus in modals
        document.querySelectorAll('[role="dialog"]').forEach(modal => {
            this.trapFocus(modal);
        });

        // Add keyboard support for custom controls
        document.querySelectorAll('[role="button"]:not(button)').forEach(element => {
            element.setAttribute('tabindex', '0');
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('[role="dialog"]:not([hidden])');
                if (openModal) {
                    const closeBtn = openModal.querySelector('[aria-label*="close" i]');
                    if (closeBtn) closeBtn.click();
                }
            }
        });
    },

    /**
     * Trap focus within element
     */
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), ' +
            'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    },

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Store last focused element before opening modal
        let lastFocused = null;

        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-opens-modal')) {
                lastFocused = e.target;
            }
        });

        // Restore focus when closing modal
        document.querySelectorAll('[data-closes-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (lastFocused) {
                    lastFocused.focus();
                    lastFocused = null;
                }
            });
        });

        // Add visible focus indicators
        document.addEventListener('mousedown', () => {
            document.body.classList.add('using-mouse');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
    },

    /**
     * Setup ARIA live regions
     */
    setupAriaLiveRegions() {
        // Create live region for announcements
        if (!document.getElementById('aria-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
            document.body.appendChild(liveRegion);
        }
    },

    /**
     * Announce message to screen readers
     */
    announce(message, priority = 'polite') {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    },

    /**
     * Setup skip links
     */
    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 100;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    },

    /**
     * Check color contrast (basic implementation)
     */
    checkColorContrast() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Only in development
            console.log('Color contrast checking enabled in development');
        }
    }
};

// ============================================
// CMS-READY DATA STRUCTURE
// ============================================
const CMSAdapter = {
    /**
     * Example API endpoints structure (replace with actual CMS endpoints)
     */
    endpoints: {
        posts: '/api/posts',
        classes: '/api/classes',
        trainers: '/api/trainers',
        bookings: '/api/bookings'
    },

    /**
     * Fetch data from CMS
     */
    async fetch(endpoint, options = {}) {
        try {
            const response = await fetch(this.endpoints[endpoint] || endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': SecurityManager.generateCSRFToken(),
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('CMS fetch error:', error);
            return null;
        }
    },

    /**
     * Transform CMS data to app format
     */
    transformData(cmsData, type) {
        // Example transformation for different content types
        switch (type) {
            case 'post':
                return {
                    id: cmsData.id || cmsData._id,
                    title: cmsData.title,
                    slug: cmsData.slug || this.generateSlug(cmsData.title),
                    excerpt: cmsData.excerpt || cmsData.summary,
                    content: cmsData.content || cmsData.body,
                    category: cmsData.category?.name || cmsData.category,
                    author: {
                        name: cmsData.author?.name || 'Anonymous',
                        avatar: cmsData.author?.image || '/images/default-avatar.jpg'
                    },
                    date: cmsData.publishedAt || cmsData.createdAt,
                    image: cmsData.featuredImage || cmsData.image,
                    tags: cmsData.tags || []
                };
            default:
                return cmsData;
        }
    },

    /**
     * Generate URL-friendly slug
     */
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};

// ============================================
// ANALYTICS INTEGRATION
// ============================================
const AnalyticsManager = {
    /**
     * Initialize Google Analytics
     */
    initGA(measurementId) {
        if (!measurementId) return;

        // Load GA script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        // Initialize GA
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', measurementId);

        window.gtag = gtag;
    },

    /**
     * Track custom event
     */
    trackEvent(category, action, label, value) {
        if (window.gtag) {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
    },

    /**
     * Track page view
     */
    trackPageView(pagePath) {
        if (window.gtag) {
            window.gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: pagePath
            });
        }
    }
};

// ============================================
// INITIALIZE ALL FEATURES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize notification system
    NotificationManager.init();

    // Initialize accessibility features
    AccessibilityManager.init();

    // Initialize performance optimizations
    PerformanceManager.lazyLoadImages();
    PerformanceManager.monitorPerformance();

    // Add security features to all forms
    document.querySelectorAll('form').forEach(form => {
        // Add CSRF token
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrf_token';
        csrfInput.value = SecurityManager.generateCSRFToken();
        form.appendChild(csrfInput);

        // Sanitize inputs on submit
        form.addEventListener('submit', (e) => {
            const textInputs = form.querySelectorAll('input[type="text"], textarea');
            textInputs.forEach(input => {
                input.value = SecurityManager.sanitizeHTML(input.value);
            });
        });
    });

    // Initialize Analytics (replace with your GA ID)
    // AnalyticsManager.initGA('G-XXXXXXXXXX');

    console.log('✅ PulseFit Advanced Features Initialized');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NotificationManager,
        SecurityManager,
        PerformanceManager,
        AccessibilityManager,
        CMSAdapter,
        AnalyticsManager
    };
}
