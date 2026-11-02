// ============================================================
// CHARACTER SWIPER — Home centrepiece
// Swipe / click / arrow through Nashwa's illustrated "modes".
// Auto-advances unless the viewer prefers reduced motion.
// ============================================================
(function () {
  'use strict';
  var swiper = document.querySelector('.char-swiper');
  if (!swiper) return;

  var slides = Array.prototype.slice.call(swiper.querySelectorAll('.char-slide'));
  var dots = Array.prototype.slice.call(swiper.querySelectorAll('.char-dots button'));
  var label = swiper.querySelector('[data-mode-label]');
  var modeTag = swiper.querySelector('.char-mode');
  var prevBtn = swiper.querySelector('.char-nav.prev');
  var nextBtn = swiper.querySelector('.char-nav.next');
  if (slides.length < 2) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx = 0, timer = null, DELAY = 4200;

  function show(n, dir) {
    n = (n + slides.length) % slides.length;
    if (n === idx && slides[idx].classList.contains('is-active')) return;
    // direction: forward removes toward the left
    swiper.classList.toggle('rev', dir === 1);
    slides[idx].classList.remove('is-active');
    dots[idx] && dots[idx].setAttribute('aria-selected', 'false');
    idx = n;
    slides[idx].classList.add('is-active');
    dots[idx] && dots[idx].setAttribute('aria-selected', 'true');
    var mode = slides[idx].getAttribute('data-mode') || '';
    if (label) label.textContent = mode;
    if (modeTag && !reduce) { modeTag.classList.remove('pop'); void modeTag.offsetWidth; modeTag.classList.add('pop'); }
  }
  function next() { show(idx + 1, 1); }
  function prev() { show(idx - 1, -1); }

  // ---- autoplay (skipped for reduced motion) ----
  function start() { if (reduce) return; stop(); timer = setInterval(next, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function bump() { stop(); start(); }   // restart countdown after a manual move

  if (nextBtn) nextBtn.addEventListener('click', function () { next(); bump(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); bump(); });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i, i > idx ? 1 : -1); bump(); }); });

  // keyboard (when the swiper or its controls hold focus)
  swiper.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); bump(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); bump(); }
  });

  // pause when not visible / hovered / focused
  swiper.addEventListener('mouseenter', stop);
  swiper.addEventListener('mouseleave', start);
  swiper.addEventListener('focusin', stop);
  swiper.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

  // ---- drag / swipe ----
  var x0 = null, drag = false;
  function down(x) { x0 = x; drag = true; stop(); }
  function up(x) {
    if (!drag) return; drag = false;
    var dx = x - x0;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    start();
  }
  swiper.addEventListener('mousedown', function (e) { down(e.clientX); });
  window.addEventListener('mouseup', function (e) { up(e.clientX); });
  swiper.addEventListener('touchstart', function (e) { down(e.touches[0].clientX); }, { passive: true });
  swiper.addEventListener('touchend', function (e) { up((e.changedTouches[0] || {}).clientX || x0); });

  start();
})();
