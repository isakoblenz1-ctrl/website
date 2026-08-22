// Reveal on scroll
(function () {
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  setTimeout(function () {
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(function (el) { el.classList.add('in'); });
  }, 2500);
})();

// Mobile nav toggle
(function () {
  const ham = document.querySelector('.hamburger');
  const links = document.getElementById('nav-links');
  if (ham && links) {
    ham.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }
})();

// Event / Blog filter
(function () {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('[data-cat]').forEach(function (card) {
        if (cat === 'All' || card.dataset.cat === cat) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.style.transition = 'opacity .4s ease, transform .4s ease';
              card.style.opacity = '1';
              card.style.transform = 'none';
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// FAQ accordion
(function () {
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// Founder slider (homepage)
(function () {
  const slider = document.querySelector('[data-founder-slider]');
  if (!slider) return;
  const track = slider.querySelector('.founder-track');
  const slides = Array.prototype.slice.call(slider.querySelectorAll('.founder-slide'));
  const dots = Array.prototype.slice.call(slider.querySelectorAll('[data-founder-go]'));
  if (!track || slides.length < 2) return;

  let index = 0;
  let timer = null;

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    slides.forEach(function (slide, n) {
      const active = n === index;
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      // Keep off-screen slides out of the tab order
      slide.querySelectorAll('a, button').forEach(function (el) {
        if (active) el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', '-1');
      });
    });
    dots.forEach(function (dot, n) {
      dot.classList.toggle('is-active', n === index);
      dot.setAttribute('aria-current', n === index ? 'true' : 'false');
    });
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function start() {
    if (timer) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function () { go(index + 1); }, 8000);
  }

  function manual(i) { stop(); go(i); }

  const prev = slider.querySelector('[data-founder-prev]');
  const next = slider.querySelector('[data-founder-next]');
  if (prev) prev.addEventListener('click', function () { manual(index - 1); });
  if (next) next.addEventListener('click', function () { manual(index + 1); });
  dots.forEach(function (dot, n) {
    dot.addEventListener('click', function () { manual(n); });
  });

  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { manual(index - 1); }
    else if (e.key === 'ArrowRight') { manual(index + 1); }
  });

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);

  // Touch swipe
  const viewport = slider.querySelector('.founder-viewport');
  if (viewport) {
    let startX = null;
    viewport.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) manual(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });
  }

  go(0);
  start();
})();

// Note: real form submissions (membership, newsletter, lead capture) are
// handled in forms.js, which POSTs to the /api functions.
