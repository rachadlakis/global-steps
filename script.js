// Global Steps — interactions
document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Mobile Navigation Toggle ---------- */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu   = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const open = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ---------- Smooth scroll for in-page anchors ---------- */
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const headerH = document.querySelector('.header')?.offsetHeight || 0;
            window.scrollTo({
                top: target.offsetTop - headerH - 8,
                behavior: 'smooth'
            });
        });
    });

    /* ---------- Header background on scroll ---------- */
    const header = document.querySelector('.header');
    const onScroll = () => {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Toast utility ---------- */
    function showToast(message, opts = {}) {
        const toast = document.getElementById('toast');
        if (!toast) { alert(message); return; }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toast.classList.remove('show'), opts.duration || 3500);
    }

    /* ---------- Contact form ---------- */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // (In production, POST to server here)
            this.reset();
            showToast('Thanks — we\'ll get back to you within 2 business days.');
        });
    }

    /* ---------- Newsletter form ---------- */
    const newsForm = document.querySelector('.newsletter-form');
    if (newsForm) {
        newsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email.');
                return;
            }
            this.reset();
            showToast('You\'re subscribed. Welcome aboard.');
        });
    }

    /* ---------- Donation form ---------- */
    const donateForm = document.querySelector('.donate-form');
    if (donateForm) {
        const amountInput = donateForm.querySelector('#donate-amount');
        donateForm.querySelectorAll('.amount-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                donateForm.querySelectorAll('.amount-chip').forEach(c => c.classList.remove('is-selected'));
                chip.classList.add('is-selected');
                if (amountInput) amountInput.value = chip.dataset.amount;
            });
        });
        donateForm.addEventListener('submit', e => {
            e.preventDefault();
            const amount = amountInput?.value || '0';
            showToast('Thank you! Redirecting to secure checkout for $' + amount + '...');
        });
    }

    /* ---------- Volunteer form ---------- */
    const volForm = document.querySelector('.volunteer-form');
    if (volForm) {
        volForm.addEventListener('submit', e => {
            e.preventDefault();
            volForm.reset();
            showToast('Application received — our team will be in touch.');
        });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const open = item.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });

    /* ---------- Intersection animations ---------- */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.stat-card, .program-card, .involvement-card, .story-card, .team-card, .event-card, .value-card, .timeline-item, .post-card').forEach(el => observer.observe(el));
    }
});
