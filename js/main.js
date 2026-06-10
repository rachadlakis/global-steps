// Global Steps — interactions
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Theme Toggle (Dark/Light Mode) ---------- */
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved theme or use system preference
    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return prefersDark.matches ? 'dark' : 'light';
    }

    // Apply theme to document
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update toggle button aria-label
        if (themeToggle) {
            themeToggle.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    }

    // Initialize theme
    setTheme(getPreferredTheme());

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    /* ---------- Mobile Navigation Toggle ---------- */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

    if (navToggle && navMenu) {
        // Toggle menu on click
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

            // Focus first menu item when opening
            if (isOpen && navLinks.length > 0) {
                navLinks[0].focus();
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            const isMenuOpen = navMenu.classList.contains('active');

            // Close on Escape
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
                navToggle.focus(); // Return focus to toggle button
            }

            // Arrow key navigation within menu
            if (isMenuOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                const currentIndex = Array.from(navLinks).indexOf(document.activeElement);
                if (currentIndex === -1) return;

                e.preventDefault();
                let nextIndex;

                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % navLinks.length;
                } else {
                    nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                }

                navLinks[nextIndex].focus();
            }
        });

        function closeMenu() {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        }
    }

    /* ---------- Smooth scroll for in-page anchors ---------- */
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const headerH = document.querySelector('.header')?.offsetHeight || 0;

            const scrollOptions = {
                top: target.offsetTop - headerH - 8,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            };

            window.scrollTo(scrollOptions);

            // Set focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });

    /* ---------- Back to Top Button ---------- */
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.setAttribute('title', 'Back to top');
    backToTop.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });

    /* ---------- Header background on scroll ---------- */
    const header = document.querySelector('.header');
    let ticking = false;

    function updateHeader() {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 16);

        // Show/hide back to top button
        backToTop.classList.toggle('visible', window.scrollY > 400);

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeader();

    /* ---------- Toast utility ---------- */
    const toastTimers = new WeakMap();

    function showToast(message, opts = {}) {
        const toast = document.getElementById('toast');
        if (!toast) {
            console.log(message);
            return;
        }

        toast.textContent = message;
        toast.classList.add('show');

        // Clear any existing timer
        const existingTimer = toastTimers.get(toast);
        if (existingTimer) clearTimeout(existingTimer);

        const newTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, opts.duration || 3500);

        toastTimers.set(toast, newTimer);
    }

    /* ---------- Form utilities ---------- */
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.classList.add('btn-loading');
            button.dataset.originalText = button.textContent;
        } else {
            button.disabled = false;
            button.classList.remove('btn-loading');
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    /* ---------- Contact form ---------- */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const button = this.querySelector('button[type="submit"]');

            setButtonLoading(button, true);

            // Simulate network request
            setTimeout(() => {
                setButtonLoading(button, false);
                this.reset();
                showToast('Thanks — we\'ll get back to you within 2 business days.');
            }, 800);
        });
    }

    /* ---------- Newsletter form ---------- */
    const newsForm = document.querySelector('.newsletter-form');
    if (newsForm) {
        newsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput?.value.trim() || '';
            const button = this.querySelector('button[type="submit"]');

            if (!validateEmail(email)) {
                showToast('Please enter a valid email.');
                emailInput?.focus();
                return;
            }

            setButtonLoading(button, true);

            setTimeout(() => {
                setButtonLoading(button, false);
                this.reset();
                showToast('You\'re subscribed. Welcome aboard.');
            }, 600);
        });
    }

    /* ---------- Donation form ---------- */
    const donateForm = document.querySelector('.donate-form');
    if (donateForm) {
        const amountInput = donateForm.querySelector('#donate-amount');
        const amountChips = donateForm.querySelectorAll('.amount-chip');

        amountChips.forEach(chip => {
            chip.addEventListener('click', () => {
                amountChips.forEach(c => c.classList.remove('is-selected'));
                chip.classList.add('is-selected');
                if (amountInput) amountInput.value = chip.dataset.amount;
            });
        });

        // Sync custom amount with chips
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                const customValue = amountInput.value;
                const matchingChip = Array.from(amountChips).find(
                    chip => chip.dataset.amount === customValue
                );

                amountChips.forEach(c => c.classList.remove('is-selected'));
                if (matchingChip) {
                    matchingChip.classList.add('is-selected');
                }
            });
        }

        donateForm.addEventListener('submit', e => {
            e.preventDefault();
            const amount = amountInput?.value || '0';
            const button = donateForm.querySelector('button[type="submit"]');

            if (parseFloat(amount) <= 0) {
                showToast('Please enter a valid donation amount.');
                amountInput?.focus();
                return;
            }

            setButtonLoading(button, true);

            setTimeout(() => {
                setButtonLoading(button, false);
                showToast('Thank you! Redirecting to secure checkout for $' + amount + '...');
            }, 800);
        });
    }

    /* ---------- Volunteer form ---------- */
    const volForm = document.querySelector('.volunteer-form');
    if (volForm) {
        volForm.addEventListener('submit', e => {
            e.preventDefault();
            const button = volForm.querySelector('button[type="submit"]');

            setButtonLoading(button, true);

            setTimeout(() => {
                setButtonLoading(button, false);
                volForm.reset();
                showToast('Application received — our team will be in touch.');
            }, 800);
        });
    }

    /* ---------- FAQ accordion ---------- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!btn || !answer) return;

        // Set up ARIA
        const answerId = 'faq-answer-' + Math.random().toString(36).substr(2, 9);
        answer.id = answerId;
        btn.setAttribute('aria-controls', answerId);

        btn.addEventListener('click', () => {
            const isOpen = item.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });

    /* ---------- Counter animation for stats ---------- */
    function animateCounter(element, target, duration = 2000) {
        if (prefersReducedMotion) {
            element.textContent = target.toLocaleString() + (target > 100 ? '+' : '');
            return;
        }

        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);

            element.textContent = current.toLocaleString() + (target > 100 ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /* ---------- Intersection animations ---------- */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');

                    // Animate counters if present
                    const counter = entry.target.querySelector('.stat-number');
                    if (counter && counter.dataset.target) {
                        const target = parseInt(counter.dataset.target, 10);
                        animateCounter(counter, target);
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        const animatedElements = document.querySelectorAll(
            '.stat-card, .program-card, .involvement-card, .story-card, ' +
            '.team-card, .event-card, .value-card, .timeline-item, .post-card'
        );

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show elements immediately
        document.querySelectorAll(
            '.stat-card, .program-card, .involvement-card, .story-card, ' +
            '.team-card, .event-card, .value-card, .timeline-item, .post-card'
        ).forEach(el => el.classList.add('animate'));
    }
});
