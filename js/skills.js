/* Skills & tools: turns the skill cards into one tabbed panel.
   Left: the skills. Right: the selected skill's description, its tools
   (cloned from the toolkit map) and where to see it in the portfolio.
   Without JS the original cards stay visible. */
(function () {
  'use strict';
  var grid = document.querySelector('#services .services-grid');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.service-card'));
  if (!cards.length) return;
  var toolkit = document.getElementById('toolkit');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h13"/><path d="M12 5l7 7-7 7"/></svg>';

  var skills = cards.map(function (c, i) {
    var icon = c.querySelector('.service-icon');
    return {
      id: 'skx-' + i,
      title: (c.querySelector('h3') || {}).textContent || '',
      desc: (c.querySelector('p') || {}).textContent || '',
      icon: icon ? icon.innerHTML : '',
      tools: (c.getAttribute('data-tools') || '').split(/\s+/).filter(Boolean),
      seen: (c.getAttribute('data-seen') || '').split(';').filter(Boolean).map(function (pair) {
        var p = pair.split('|'); return { label: p[0], href: p[1] };
      })
    };
  });

  function toolChip(key) {
    var src = toolkit && toolkit.querySelector('.tchip[data-tool="' + key + '"]');
    if (!src) return null;
    var li = document.createElement('li');
    li.className = 'tchip';
    li.innerHTML = src.innerHTML;
    return li;
  }

  // ---- build ----
  var wrap = document.createElement('div');
  wrap.className = 'skx';
  var list = document.createElement('div');
  list.className = 'skx-tabs';
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', 'Skills');
  list.setAttribute('aria-orientation', 'vertical');
  var panel = document.createElement('div');
  panel.className = 'skx-panel';
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('tabindex', '0');

  var tabs = skills.map(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'skx-tab';
    b.id = s.id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'skx-panel');
    b.innerHTML = '<span class="skx-tab-ico" aria-hidden="true">' + s.icon + '</span><span class="skx-tab-label">' + s.title + '</span>';
    b.addEventListener('click', function () { select(i, false); });
    list.appendChild(b);
    return b;
  });
  panel.id = 'skx-panel';
  wrap.appendChild(list);
  wrap.appendChild(panel);
  grid.parentNode.insertBefore(wrap, grid);
  grid.hidden = true;

  function render(s) {
    var tools = document.createElement('ul');
    tools.className = 'skx-tools';
    s.tools.forEach(function (k) { var c = toolChip(k); if (c) tools.appendChild(c); });
    var seen = s.seen.map(function (x) {
      return '<a class="skx-seen-link" href="' + x.href.replace(/^#pf-.*/, '#portfolio') + '" data-pf="' +
        (x.href.charAt(0) === '#' ? x.href.slice(1) : '') + '">' + x.label + ARROW + '</a>';
    }).join('');
    panel.innerHTML =
      '<div class="skx-body">' +
        '<h3 class="skx-title">' + s.title + '</h3>' +
        '<p class="skx-desc">' + s.desc + '</p>' +
        '<p class="skx-label">Tools</p>' +
      '</div>';
    panel.querySelector('.skx-body').appendChild(tools);
    if (seen) panel.querySelector('.skx-body').insertAdjacentHTML('beforeend', '<p class="skx-label">See it in</p><div class="skx-seen">' + seen + '</div>');
    if (!reduce) { panel.classList.remove('is-in'); void panel.offsetWidth; panel.classList.add('is-in'); }
  }

  var current = -1;
  function select(i, focus) {
    if (i === current) return;
    current = i;
    tabs.forEach(function (t, j) {
      var on = j === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      t.classList.toggle('is-active', on);
    });
    panel.setAttribute('aria-labelledby', skills[i].id);
    render(skills[i]);
    if (focus) tabs[i].focus();
    // keep the active tab visible in the phone's sideways strip
    var t = tabs[i];
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: t.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  }

  // arrow keys, Home and End move between tabs
  list.addEventListener('keydown', function (e) {
    var k = e.key, n = tabs.length, i = current;
    if (k === 'ArrowDown' || k === 'ArrowRight') i = (current + 1) % n;
    else if (k === 'ArrowUp' || k === 'ArrowLeft') i = (current - 1 + n) % n;
    else if (k === 'Home') i = 0;
    else if (k === 'End') i = n - 1;
    else return;
    e.preventDefault();
    select(i, true);
  });

  // "See it in" links to a portfolio tab: open that tab, then scroll to it
  panel.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.skx-seen-link[data-pf]');
    if (!a || !a.getAttribute('data-pf')) return;
    var btn = document.querySelector('.pf-tab[data-panel="' + a.getAttribute('data-pf') + '"]');
    if (btn) { e.preventDefault(); btn.click(); document.getElementById('portfolio').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  });

  select(0, false);
})();
