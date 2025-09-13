// Ultra-smooth page/section transition overlay
// Inspired by curve-like reveal from the reference site

(function() {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  function withTransition(toHash, onMid) {
    const overlay = $('#page-transition');
    if (!overlay) return onMid();

    // Enter
    window.__overlayTransitioning = true;
    overlay.classList.add('active');

    // Scroll in the middle of the overlay animation
    setTimeout(() => {
      onMid();
    }, 200);

    // Exit
    setTimeout(() => {
      overlay.classList.remove('active');
      // Allow nav handler again
      setTimeout(() => { window.__overlayTransitioning = false; }, 100);
    }, 700);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Intercept same-page anchors for a seamless reveal
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();

        withTransition(href, () => {
          const y = Math.max(0, target.offsetTop - 80);
          window.scrollTo({ top: y, behavior: 'smooth' });
          history.pushState(null, '', href);
        });
      });
    });
  });
})();
