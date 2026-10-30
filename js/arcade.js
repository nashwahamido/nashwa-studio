// ============================================================
// ARCADE HERO MENU — arrow-key navigation (progressive enhancement)
// The menu items are plain anchors; this just adds a keyboard
// highlight + Enter-to-open, like the reference site.
// ============================================================
(function () {
  'use strict';
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-amenu]'));
  if (!items.length) return;

  var idx = -1;
  function setActive(i) {
    if (idx > -1 && items[idx]) items[idx].classList.remove('is-active');
    idx = (i + items.length) % items.length;
    items[idx].classList.add('is-active');
    items[idx].focus({ preventScroll: true });
  }

  // Hover syncs the highlight so mouse + keyboard agree.
  items.forEach(function (el, i) {
    el.addEventListener('mouseenter', function () {
      if (idx > -1 && items[idx]) items[idx].classList.remove('is-active');
      idx = i; el.classList.add('is-active');
    });
    el.addEventListener('mouseleave', function () { el.classList.remove('is-active'); idx = -1; });
  });

  document.addEventListener('keydown', function (e) {
    // Only drive the menu while the hero is in view near the top.
    var home = document.getElementById('home');
    if (!home) return;
    if (home.getBoundingClientRect().bottom < window.innerHeight * 0.4) return;

    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(idx + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(idx - 1); }
    else if (e.key === 'Enter' && idx > -1) { items[idx].click(); }
    else if (/^[1-9]$/.test(e.key)) {
      var n = parseInt(e.key, 10) - 1;
      if (items[n]) { setActive(n); items[n].click(); }
    }
  });
})();
