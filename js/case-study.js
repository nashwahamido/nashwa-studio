/* Case-study pages: progress trail, MODU helper picker, Atlasphere sync demo.
   Everything here is progressive enhancement: without JS the page reads
   top to bottom as normal. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     1. Progress trail: one stop per section heading. Stops light up
        as you scroll past and jump to their section when clicked.
     --------------------------------------------------------------- */
  (function () {
    var page = document.querySelector('.cs-page');
    if (!page) return;
    var heads = Array.prototype.slice.call(page.querySelectorAll('.cs-page-section > h2'));
    if (heads.length < 3) return;

    var nav = document.createElement('nav');
    nav.className = 'cs-trail';
    nav.setAttribute('aria-label', 'On this page');
    var ol = document.createElement('ol');
    var links = heads.map(function (h, i) {
      if (!h.id) h.id = 'sec-' + (h.textContent || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sec-' + i;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.innerHTML = '<span class="cs-trail-dot" aria-hidden="true"></span><span class="cs-trail-label">' + h.textContent + '</span>';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        h.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
        if (history.replaceState) history.replaceState(null, '', '#' + h.id);
      });
      li.appendChild(a); ol.appendChild(li);
      return a;
    });
    var fill = document.createElement('span');
    fill.className = 'cs-trail-fill';
    fill.setAttribute('aria-hidden', 'true');
    nav.appendChild(fill);
    nav.appendChild(ol);
    document.body.appendChild(nav);

    function update() {
      var line = window.innerHeight * 0.35;
      var current = -1;
      heads.forEach(function (h, i) { if (h.getBoundingClientRect().top <= line) current = i; });
      links.forEach(function (a, i) {
        a.classList.toggle('is-passed', i <= current);
        if (i === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      var pct = current < 0 ? 0 : (current / (links.length - 1)) * 100;
      fill.style.height = pct + '%';
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------------------------------------------------------------
     2. MODU: pick a helper and the same step rewrites itself.
     --------------------------------------------------------------- */
  (function () {
    var box = document.querySelector('[data-helper-demo]');
    if (!box) return;
    var COPY = {
      felix: {
        name: 'Felix', mode: 'Control', best: 'For people who like to stay in charge.',
        say: 'Next is a leg for the seat plate. Take it whenever you\u2019re ready; nothing moves until you do.',
        how: ['Nothing moves until you ask', 'Every tool stays in your hands']
      },
      lumi: {
        name: 'Lumi', mode: 'Visual', best: 'For people who understand by seeing.',
        say: 'Watch first: the leg slides into the plate and turns twice. Now it\u2019s your turn.',
        how: ['Shows before it tells', 'The picture comes first, then words']
      },
      sparky: {
        name: 'Sparky', mode: 'Momentum', best: 'For people who lose steam on long tasks.',
        say: 'Quick one! Pop the leg in. That\u2019s one of four done, nice!',
        how: ['Short steps', 'A small win after each one']
      },
      pebble: {
        name: 'Pebble', mode: 'Clear Path', best: 'For people who want to know exactly what\u2019s next.',
        say: 'Take one Leg. Fit it into the round hole on the Seat plate, then turn it clockwise.',
        how: ['One step at a time', 'Every part named precisely']
      }
    };
    var out = box.querySelector('.helper-out');
    var img = box.querySelector('.helper-out-img');
    var who = box.querySelector('.helper-out-who');
    var best = box.querySelector('.helper-out-best');
    var best = box.querySelector('.helper-out-best');
    var say = box.querySelector('.helper-out-say');
    var how = box.querySelector('.helper-out-how');
    function show(key) {
      var c = COPY[key]; if (!c) return;
      out.classList.remove('is-swap'); void out.offsetWidth; out.classList.add('is-swap');
      img.src = 'assets/app/modu/helper_' + key + '.webp?v=2';
      img.alt = '';
      who.innerHTML = c.name + ' <span>' + c.mode + '</span>';
      best.textContent = c.best;
      say.textContent = c.say;
      how.innerHTML = c.how.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    }
    Array.prototype.forEach.call(box.querySelectorAll('input[name="helper"]'), function (r) {
      r.addEventListener('change', function () { if (r.checked) show(r.value); });
    });
    var checked = box.querySelector('input[name="helper"]:checked');
    show(checked ? checked.value : 'felix');
  })();

  /* ---------------------------------------------------------------
     3. Atlasphere: plan a day, watch a friend's view sync.
        Pick a place, then a time slot (or drag it there).
     --------------------------------------------------------------- */
  (function () {
    var box = document.querySelector('[data-sync-demo]');
    if (!box) return;
    var places = Array.prototype.slice.call(box.querySelectorAll('.sync-place'));
    var mySlots = Array.prototype.slice.call(box.querySelectorAll('.sync-you .sync-slot'));
    var theirSlots = Array.prototype.slice.call(box.querySelectorAll('.sync-friend .sync-slot'));
    var status = box.querySelector('.sync-status');
    var reset = box.querySelector('.sync-reset');
    var selected = null;
    var plan = {};

    function select(btn) {
      selected = (selected === btn) ? null : btn;
      places.forEach(function (p) { p.setAttribute('aria-pressed', p === selected ? 'true' : 'false'); });
      box.classList.toggle('is-picking', !!selected);
      if (selected) status.textContent = selected.textContent.trim() + ' picked. Now choose a time slot.';
    }
    function render(slots, flash) {
      slots.forEach(function (s) {
        var key = s.getAttribute('data-slot');
        var val = s.querySelector('.sync-slot-val');
        var name = plan[key] || '';
        val.textContent = name || 'Free';
        s.classList.toggle('is-filled', !!name);
        if (flash && name && flash === key) {
          s.classList.remove('is-flash'); void s.offsetWidth; s.classList.add('is-flash');
        }
      });
    }
    function place(slotKey, placeName) {
      Object.keys(plan).forEach(function (k) { if (plan[k] === placeName) delete plan[k]; });
      plan[slotKey] = placeName;
      render(mySlots, slotKey);
      status.textContent = placeName + ' added to ' + slotKey + '. Syncing…';
      box.classList.add('is-syncing');
      setTimeout(function () {
        render(theirSlots, slotKey);
        box.classList.remove('is-syncing');
        status.textContent = placeName + ' added to ' + slotKey + '. Your friend sees it too.';
      }, reduceMotion ? 0 : 450);
      select(null);
    }

    places.forEach(function (p) {
      p.addEventListener('click', function () { select(p); });
      p.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', p.getAttribute('data-place'));
        e.dataTransfer.effectAllowed = 'move';
        box.classList.add('is-picking');
      });
      p.addEventListener('dragend', function () { box.classList.remove('is-picking'); });
    });
    mySlots.forEach(function (s) {
      var key = s.getAttribute('data-slot');
      s.addEventListener('click', function () {
        if (selected) place(key, selected.getAttribute('data-place'));
        else status.textContent = 'Pick a place first, then a time slot.';
      });
      s.addEventListener('dragover', function (e) { e.preventDefault(); s.classList.add('is-over'); });
      s.addEventListener('dragleave', function () { s.classList.remove('is-over'); });
      s.addEventListener('drop', function (e) {
        e.preventDefault(); s.classList.remove('is-over');
        var name = e.dataTransfer.getData('text/plain');
        if (name) place(key, name);
      });
    });
    if (reset) reset.addEventListener('click', function () {
      plan = {}; select(null); render(mySlots); render(theirSlots);
      status.textContent = 'Plan cleared on both screens.';
    });
    render(mySlots); render(theirSlots);
  })();
  /* Embedded site facade: the poster stays up as a loading screen while the
     site loads hidden behind it, then fades away once the book is ready */
  Array.prototype.forEach.call(document.querySelectorAll('.embed-facade[data-src]'), function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-loading')) return;
      var frame = btn.parentNode;
      var label = btn.querySelector('.embed-play');
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
      if (label) label.lastChild.textContent = 'Opening the book\u2026';
      var f = document.createElement('iframe');
      // aria-label rather than title: same name for screen readers, no hover tooltip
      f.setAttribute('aria-label', 'Retellings: the interactive book');
      f.setAttribute('allow', 'fullscreen');
      f.className = 'is-hidden';
      var W = 900, H = 870;   // the most compact width that still shows the two-page spread
      function fit() {
        var w = frame.clientWidth;
        if (w >= 420) {
          var s = w / W;
          frame.classList.add('is-scaled');
          frame.style.height = Math.round(H * s) + 'px';
          f.style.width = W + 'px'; f.style.height = H + 'px'; f.style.transform = 'scale(' + s + ')';
        } else {
          frame.classList.remove('is-scaled');
          frame.style.height = ''; f.style.width = ''; f.style.height = ''; f.style.transform = '';
        }
      }
      var shown = false;
      function reveal() {
        if (shown) return; shown = true;
        f.classList.remove('is-hidden');
        btn.classList.add('is-gone');
        setTimeout(function () { if (btn.parentNode) btn.parentNode.removeChild(btn); f.focus(); }, reduceMotion ? 0 : 350);
      }
      // the page's own scripts build the book just after 'load', so give them a beat
      f.addEventListener('load', function () { setTimeout(reveal, 450); });
      setTimeout(reveal, 9000);   // never leave people waiting on a slow network
      f.src = btn.getAttribute('data-src');
      frame.insertBefore(f, btn);
      fit(); window.addEventListener('resize', fit);
    });
  });

  /* Wide demos: fade the side trail while they are on screen so they never overlap */
  var wide = document.querySelectorAll('.book-try');
  if (wide.length && 'IntersectionObserver' in window) {
    var onScreen = new Set();
    var wio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) onScreen.add(en.target); else onScreen.delete(en.target); });
      document.body.classList.toggle('trail-hidden', onScreen.size > 0);
    });
    Array.prototype.forEach.call(wide, function (el) { wio.observe(el); });
  }
})();
