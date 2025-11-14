document.addEventListener('DOMContentLoaded', function () {
    const debounce = (fn, interval = 300) => {
        let timer = null;
        return function (...args) {
            const context = this;
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(context, args);
            }, interval);
        };
    };

    const slider = document.getElementById('certificatesSlider');
    if (!slider) return;
    const wrapper = slider.querySelector('.certificates__slider-wrapper');
    const slides = Array.from(slider.querySelectorAll('.certificates__slide'));
    const controls = slider.querySelectorAll('[data-certificate-control]');
    if (!wrapper || slides.length === 0) return;
    const computeSlideWidth = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const halfSlideWidth = Math.floor(slideWidth / 2)
        const gap = parseFloat(getComputedStyle(wrapper).gap) || 0;
        return slideWidth + gap;
    };
    wrapper.style.overflowX = 'auto';
    wrapper.style.scrollBehavior = 'smooth';
    wrapper.style.webkitOverflowScrolling = 'touch';


    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;
    let dragPreventClick = false;
    const onPointerDown = (clientX) => {
        isDown = true;
        startX = clientX;
        scrollLeft = wrapper.scrollLeft;
        isDragging = false;
    };
    const onPointerMove = (clientX) => {
        if (!isDown) return;
        const x = clientX;
        const walk = startX - x; 
        if (Math.abs(walk) > 5) isDragging = true;

        wrapper.scrollLeft = scrollLeft + walk;
        dragPreventClick = isDragging;
    };
    const onPointerUp = () => {
        if (!isDown) return;
        isDown = false;
        if (isDragging) snapToClosest();
        setTimeout(() => { dragPreventClick = false; }, 0);
    };

    wrapper.addEventListener('mousedown', (e) => {
        if (e.target.closest('[data-certificate-control]')) return;
        wrapper.classList.add('grabbing');
        onPointerDown(e.clientX);
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        onPointerMove(e.clientX);
    });
    document.addEventListener('mouseup', (e) => {
        wrapper.classList.remove('grabbing');
        onPointerUp();
    });

    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        onPointerDown(e.touches[0].clientX);
    }, { passive: true });
    wrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        onPointerMove(e.touches[0].clientX);
    }, { passive: true });
    wrapper.addEventListener('touchend', () => {
        onPointerUp();
    });
    wrapper.addEventListener('click', (e) => {
        if (dragPreventClick) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }, true);
    const snapToClosest = () => {
        const slideW = computeSlideWidth();
        const index = Math.round(wrapper.scrollLeft / slideW);
        scrollToSlide(index);
    };
    const scrollToSlide = (index) => {
        const slideW = computeSlideWidth();
        const clamped = Math.max(0, Math.min(index, slides.length - 1));
        const targetScroll = Math.round(clamped * slideW);

        wrapper.scrollTo({ left: targetScroll, behavior: 'smooth' });
        setActiveDot(clamped);
    };
    const setActiveDot = (activeIndex) => {
        controls.forEach(btn => {
            const idx = Number(btn.getAttribute('data-certificate-control'));
            if (idx === activeIndex) {
                btn.classList.add('brown');
                btn.setAttribute('aria-current', 'true');
            } else {
                btn.classList.remove('brown');
                btn.setAttribute('aria-current', 'false');
            }
        });
    };
    controls.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(btn.getAttribute('data-certificate-control'));
            scrollToSlide(idx);
        });
    });
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            snapToClosest();
        }, 120);
    });
    const initActive = () => {
        const activeBtn = Array.from(controls).find(b => b.getAttribute('aria-current') === 'true');
        const startIndex = activeBtn ? Number(activeBtn.getAttribute('data-certificate-control')) : 0;
        requestAnimationFrame(() => {
            scrollToSlide(startIndex);
        });
    };

    let scrollDebounce;
    wrapper.addEventListener('scroll', debounce(() => {
        clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(() => {
            const slideW = computeSlideWidth();
            const idx = Math.round(wrapper.scrollLeft / slideW);
            setActiveDot(Math.max(0, Math.min(idx, slides.length - 1)));
        }, 100);
    }));

    if (!wrapper.hasAttribute('tabindex')) wrapper.setAttribute('tabindex', '0');
    let keyInterval = null;
    let keyAcceleration = 1;
    const KEY_STEP_BASE = 8;
    const KEY_INTERVAL_MS = 16;
    const startKeyScroll = (direction) => {

        if (keyInterval) return;
        keyAcceleration = 1;
        keyInterval = setInterval(() => {
            keyAcceleration = Math.min(4, keyAcceleration + 0.02);
            const step = KEY_STEP_BASE * keyAcceleration;
            wrapper.scrollLeft += step * direction;
        }, KEY_INTERVAL_MS);
    };
    const stopKeyScroll = () => {
        if (keyInterval) {
            clearInterval(keyInterval);
            keyInterval = null;
            snapToClosest();
        }
    };

    wrapper.addEventListener('keydown', (e) => {
        if (e.target.closest('[data-certificate-control]')) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            startKeyScroll(+1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            startKeyScroll(-1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            scrollToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            scrollToSlide(slides.length - 1);
        } else if (e.key === 'PageDown') {
            e.preventDefault();
            const cur = Math.round(wrapper.scrollLeft / computeSlideWidth());
            scrollToSlide(Math.min(slides.length - 1, cur + 1));
        } else if (e.key === 'PageUp') {
            e.preventDefault();
            const cur = Math.round(wrapper.scrollLeft / computeSlideWidth());
            scrollToSlide(Math.max(0, cur - 1));
        }
    });
    wrapper.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            stopKeyScroll();
        }
    });

    window.addEventListener('blur', stopKeyScroll);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopKeyScroll();
    });

    document.addEventListener('mouseup', stopKeyScroll);
    document.addEventListener('touchend', stopKeyScroll);

    initActive();
});