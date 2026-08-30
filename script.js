/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — GAME DEVELOPER
   script.js — Minimal JS: scroll animations + navbar + mobile menu
   ═══════════════════════════════════════════════════════════ */


// ───────────────────────────────────────
// 1. SCROLL-TRIGGERED FADE-IN ANIMATIONS
//    Uses IntersectionObserver (no library needed)
// ───────────────────────────────────────
(function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-up');

  if (!fadeElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after triggering to save memory
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,        // Trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px' // Slight offset for better feel
    }
  );

  fadeElements.forEach((el) => observer.observe(el));
})();


// ───────────────────────────────────────
// 2. NAVBAR — SCROLL STATE + ACTIVE LINK
// ───────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Add scrolled class when page scrolls down
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on init in case page reloads scrolled
})();


// ───────────────────────────────────────
// 3. MOBILE MENU — HAMBURGER TOGGLE
// ───────────────────────────────────────
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  // Toggle menu open/close
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close menu when a link is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


// ───────────────────────────────────────
// 4. SMOOTH SCROLL — POLYFILL FALLBACK
//    (Most modern browsers support scroll-behavior: smooth in CSS,
//     but this ensures it works everywhere)
// ───────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
})();


// ───────────────────────────────────────
// 5. THEME — TỰ ĐỘNG / SÁNG / TỐI
//    'auto' theo prefers-color-scheme của máy người dùng,
//    hoặc ép cứng 'light' / 'dark' theo lựa chọn, lưu localStorage.
//    (data-theme ban đầu đã được set bởi script chặn trong <head>
//    để tránh nháy sai màu lúc tải trang — đoạn này chỉ đồng bộ
//    trạng thái nút bấm + gắn tương tác + theo dõi đổi hệ thống.)
// ───────────────────────────────────────
(function initTheme() {
  const STORAGE_KEY = 'theme-preference';
  const root = document.documentElement;
  const buttons = document.querySelectorAll('.theme-btn');
  const mql = window.matchMedia('(prefers-color-scheme: dark)');

  if (!buttons.length) return;

  function getPreference() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function resolve(pref) {
    return pref === 'auto' ? (mql.matches ? 'dark' : 'light') : pref;
  }

  function apply(pref) {
    root.setAttribute('data-theme', resolve(pref));
    buttons.forEach((btn) => {
      const isActive = btn.dataset.themeChoice === pref;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  apply(getPreference());

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.themeChoice;
      try {
        localStorage.setItem(STORAGE_KEY, choice);
      } catch (e) {}
      apply(choice);
    });
  });

  // Nếu đang ở chế độ "tự động", theo dõi khi hệ điều hành đổi sáng/tối
  mql.addEventListener('change', () => {
    if (getPreference() === 'auto') apply('auto');
  });
})();
