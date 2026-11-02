// ============================================================
// SCREEN ROUTER
// Landing (#home) is the arcade menu; every other section is a
// full "screen" shown one at a time, reached via the nav bar,
// the arcade menu, or a hash link. Accessible: focus moves to
// the screen, changes are announced, back/forward work, and it
// honors prefers-reduced-motion.
// ============================================================
(function () {
  'use strict';
  var main = document.querySelector('main');
  if (!main) return;
  var screens = Array.prototype.slice.call(main.children).filter(function (el) { return el.tagName === 'SECTION' && el.id; });
  if (!screens.length) return;

  var byId = {};
  screens.forEach(function (s) { byId[s.id] = s; if (!s.hasAttribute('tabindex')) s.setAttribute('tabindex', '-1'); });

  var names = { home: 'Home', portfolio: 'Work', services: 'Skills', about: 'About', contact: 'Contact', modu: 'MODU', atlasphere: 'Atlasphere' };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var baseTitle = 'Nashwa Hamido | Marketing Artist & Product Design Engineer';

  var live = document.createElement('div');
  live.setAttribute('aria-live', 'polite');
  live.className = 'sr-only';
  document.body.appendChild(live);

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));

  function idFromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    return byId[h] ? h : 'home';
  }

  function show(id, moveFocus) {
    var active = byId[id] || byId.home;
    screens.forEach(function (s) { s.hidden = (s !== active); });

    document.body.classList.toggle('is-home', id === 'home');
    document.body.classList.toggle('is-inner', id !== 'home');

    // Reveal this screen's content immediately (it was hidden from the observer).
    Array.prototype.slice.call(active.querySelectorAll('.reveal')).forEach(function (el) { el.classList.add('in-view'); });

    navLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) { a.setAttribute('aria-current', 'page'); } else { a.removeAttribute('aria-current'); }
    });

    if (!reduce) { active.classList.remove('screen-in'); void active.offsetWidth; active.classList.add('screen-in'); }

    window.scrollTo(0, 0);
    if (moveFocus) { try { active.focus({ preventScroll: true }); } catch (e) {} }

    var nm = names[id] || id;
    document.title = id === 'home' ? baseTitle : nm + ' · Nashwa Hamido';
    live.textContent = nm + ', screen';
  }

  window.addEventListener('hashchange', function () { show(idFromHash(), true); });
  // Close the mobile menu after navigating.
  navLinks.forEach(function (a) {
    a.addEventListener('click', function () {
      var topnav = document.getElementById('topnav');
      if (topnav) topnav.classList.remove('open');
    });
  });

  show(idFromHash(), false);
})();
