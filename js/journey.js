/* Journey line: a wavy path through every stop, drawn as you scroll.
   Content is a plain ordered list, so it reads fine without this. */
(function () {
  'use strict';
  var box = document.getElementById('journey');
  if (!box) return;
  var track = box.querySelector('.jr-track');
  var svg = box.querySelector('.jr-line');
  var base = box.querySelector('.jr-line-base');
  var draw = box.querySelector('.jr-line-draw');
  var stops = Array.prototype.slice.call(box.querySelectorAll('.jr-stop'));
  var dots = stops.map(function (s) { return s.querySelector('.jr-dot'); });
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var len = 0, pts = [];

  if (!reduce && 'IntersectionObserver' in window) box.classList.add('jr-anim');

  function build() {
    var t = track.getBoundingClientRect();
    pts = dots.map(function (d) {
      var r = d.getBoundingClientRect();
      return { x: r.left + r.width / 2 - t.left, y: r.top + r.height / 2 - t.top };
    });
    if (!pts.length) return;
    // smooth S-curves between stops, bulging sideways so the line waves
    var d = 'M ' + pts[0].x + ' ' + (pts[0].y - 40) + ' L ' + pts[0].x + ' ' + pts[0].y;
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2;
      d += ' C ' + a.x + ' ' + my + ', ' + b.x + ' ' + my + ', ' + b.x + ' ' + b.y;
    }
    var last = pts[pts.length - 1];
    d += ' L ' + last.x + ' ' + (last.y + 60);
    base.setAttribute('d', d); draw.setAttribute('d', d);
    svg.setAttribute('viewBox', '0 0 ' + t.width + ' ' + t.height);
    len = draw.getTotalLength();
    draw.style.strokeDasharray = len;
    update();
  }

  function update() {
    if (!len) return;
    var t = track.getBoundingClientRect();
    var line = window.innerHeight * 0.62;           // the pen sits a bit below centre
    var reachedY = reduce ? Infinity : line - t.top;
    var p = reduce ? 1 : Math.max(0, Math.min(1, reachedY / t.height));
    draw.style.strokeDashoffset = String(len * (1 - p));
    stops.forEach(function (s, i) { s.classList.toggle('is-reached', pts[i] && pts[i].y <= reachedY); });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 120); });
  // keyboard users: tabbing into a card makes sure its stop is lit
  box.addEventListener('focusin', function (e) { var s = e.target.closest('.jr-stop'); if (s) s.classList.add('is-reached'); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  window.addEventListener('load', build);
  build();
})();
