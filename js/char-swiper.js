// ============================================================
// CHARACTER CYCLE — Home centrepiece
// The illustrations alternate on their own with a soft
// cross-fade. No controls. Honors prefers-reduced-motion
// (stays on the first pose) and pauses when the tab is hidden.
// ============================================================
(function () {
  'use strict';
  var cont = document.querySelector('.char-cycle');
  if (!cont) return;
  var slides = Array.prototype.slice.call(cont.querySelectorAll('.char-slide'));
  if (slides.length < 2) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var i = 0, timer = null, DELAY = 3800;
  function next() {
    slides[i].classList.remove('is-active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('is-active');
  }
  function start() { stop(); timer = setInterval(next, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  start();
})();
