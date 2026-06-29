// БГОО «Ветераны пограничных войск» — Main JS

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');

    // Burger menu toggle
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('header__nav--open');
            burger.classList.toggle('burger--active');
            document.body.style.overflow = nav.classList.contains('header__nav--open') ? 'hidden' : '';
        });

        // Close menu on link click
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('header__nav--open');
                burger.classList.remove('burger--active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header shadow on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        if (scroll > 50) {
            header.style.borderBottomColor = 'rgba(255,255,255,0.15)';
        } else {
            header.style.borderBottomColor = 'rgba(255,255,255,0.08)';
        }
        lastScroll = scroll;
    });

    // Fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.work__card, .partners__item, .docs__card, .gallery__item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox?.querySelector('.lightbox__img');
    const lightboxClose = lightbox?.querySelector('.lightbox__close');

    document.querySelectorAll('[data-lightbox]').forEach(img => {
        img.addEventListener('click', (e) => {
            lightboxImg.src = e.target.src;
            lightbox.classList.add('lightbox--open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('lightbox--open');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox?.classList.contains('lightbox--open')) {
            closeLightbox();
        }
    });

    // Scroll to top button
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('scroll-top--visible');
            } else {
                scrollBtn.classList.remove('scroll-top--visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Floating tooltip — уплывает от быстрого движения курсора
    document.querySelectorAll('.partners__item').forEach(item => {
        let rafId = null;
        let lastX = 0, lastY = 0;
        let svx = 0, svy = 0; // smoothed velocity

        item.addEventListener('mouseenter', () => { lastX = 0; lastY = 0; });

        item.addEventListener('mousemove', (e) => {
            if (lastX === 0 && lastY === 0) { lastX = e.clientX; lastY = e.clientY; return; }
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            // Smooth velocity — большие резкие движения дают заметный сдвиг
            svx += (dx - svx) * 0.2;
            svy += (dy - svy) * 0.2;
            if (!rafId) rafId = requestAnimationFrame(tick);
        });

        function tick() {
            const tx = Math.max(-12, Math.min(12, svx * 0.7));
            const ty = Math.max(-6, Math.min(6, svy * 0.7));
            item.style.setProperty('--tx', tx.toFixed(1) + 'px');
            item.style.setProperty('--ty', ty.toFixed(1) + 'px');
            // Плавное затухание — тултип мягко возвращается на место
            svx *= 0.93;
            svy *= 0.93;
            if (Math.abs(svx) > 0.3 || Math.abs(svy) > 0.3) {
                rafId = requestAnimationFrame(tick);
            } else {
                svx = 0; svy = 0;
                item.style.setProperty('--tx', '0px');
                item.style.setProperty('--ty', '0px');
                rafId = null;
            }
        }

        item.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            svx = 0; svy = 0;
            item.style.setProperty('--tx', '0px');
            item.style.setProperty('--ty', '0px');
            rafId = null;
        });
    });
});
