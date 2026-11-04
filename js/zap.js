// ============================================================
// ZAP — hover / focus an element marked [data-zap] and a
// crackling arc jumps from the current screen's character
// (its hand, set by data-anchor="x,y" as fractions of the image)
// to that element. Decorative only: drawn on one canvas with no
// pointer events. Reduced motion gets a calm, static line.
// ============================================================
(function () {
  'use strict';
  var canvas = document.createElement('canvas');
  canvas.className = 'zap-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wide = window.matchMedia('(min-width: 62.01rem)');
  var target = null, char = null, raf = 0, last = 0, dpr = 1;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
  }
  size();
  window.addEventListener('resize', size);

  function visibleChar(el) {
    var screen = el.closest('main > section');
    var c = screen && screen.querySelector('.screen-char');
    if (!c) return null;
    var img = c.querySelector('img');
    var r = img && img.getBoundingClientRect();
    return r && r.width > 0 ? c : null;
  }

  function anchorPoint(c) {
    var r = c.querySelector('img').getBoundingClientRect();
    var a = (c.getAttribute('data-anchor') || '0.5,0.5').split(',').map(parseFloat);
    return { x: r.left + r.width * a[0], y: r.top + r.height * a[1] };
  }

  function landing(el, from) {
    var r = el.getBoundingClientRect();
    var x = Math.max(r.left + 4, Math.min(from.x, r.right - 4));
    var y = Math.max(r.top + 4, Math.min(from.y, r.bottom - 4));
    // when the anchor is beside the element, land on the facing edge's middle
    if (from.x < r.left || from.x > r.right) y = r.top + r.height / 2;
    return { x: x, y: y };
  }

  function bolt(a, b, amp, steps) {
    var pts = [a];
    var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    var nx = -dy / len, ny = dx / len;
    for (var i = 1; i < steps; i++) {
      var t = i / steps, taper = Math.sin(Math.PI * t);
      var o = (Math.random() * 2 - 1) * amp * taper;
      pts.push({ x: a.x + dx * t + nx * o, y: a.y + dy * t + ny * o });
    }
    pts.push(b);
    return pts;
  }

  function stroke(pts, width, color, glow) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.lineWidth = width; ctx.strokeStyle = color;
    ctx.shadowColor = glow; ctx.shadowBlur = glow ? 14 : 0;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.stroke();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (!target || !char) return;
    var a = anchorPoint(char), b = landing(target, a);
    var dist = Math.hypot(b.x - a.x, b.y - a.y);
    var coral = '#FD8E81', cream = '#FBF3EE';

    if (reduce) {
      stroke([a, b], 2.5, coral, 'rgba(253,142,129,0.6)');
    } else {
      var steps = Math.max(6, Math.round(dist / 18));
      var main = bolt(a, b, Math.min(22, dist * 0.08), steps);
      stroke(main, 5, coral, coral);
      stroke(main, 2, cream, null);
      // a couple of short side branches
      for (var k = 0; k < 2; k++) {
        var p = main[1 + Math.floor(Math.random() * (main.length - 2))];
        var q = { x: p.x + (Math.random() * 2 - 1) * 26, y: p.y + (Math.random() * 2 - 1) * 26 };
        stroke(bolt(p, q, 6, 3), 1.5, coral, coral);
      }
      // crackle at the hand
      for (var s = 0; s < 3; s++) {
        var ang = Math.random() * Math.PI * 2, r = 10 + Math.random() * 12;
        stroke(bolt(a, { x: a.x + Math.cos(ang) * r, y: a.y + Math.sin(ang) * r }, 3, 3), 1.5, cream, coral);
      }
    }
    // glowing dot where it lands
    ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = cream; ctx.shadowColor = coral; ctx.shadowBlur = 16; ctx.fill();
  }

  function loop(t) {
    if (!target) return;
    if (reduce) { draw(); raf = requestAnimationFrame(loop); return; }
    if (t - last > 55) { draw(); last = t; }   // flicker ~18 times a second
    raf = requestAnimationFrame(loop);
  }

  function start(el) {
    if (!wide.matches) return;
    var c = visibleChar(el);
    if (!c) return;
    if (char && char !== c) char.classList.remove('is-charged');
    target = el; char = c;
    char.classList.add('is-charged');
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function stop(el) {
    if (el && el !== target) return;
    if (char) char.classList.remove('is-charged');
    target = null; char = null;
    cancelAnimationFrame(raf);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.addEventListener('pointerover', function (e) {
    var el = e.target.closest && e.target.closest('[data-zap]');
    if (el && el !== target) start(el);
  });
  document.addEventListener('pointerout', function (e) {
    var el = e.target.closest && e.target.closest('[data-zap]');
    if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) stop(el);
  });
  document.addEventListener('focusin', function (e) {
    var el = e.target.closest && e.target.closest('[data-zap]');
    if (el) start(el); else stop();
  });
  document.addEventListener('focusout', function (e) {
    var el = e.target.closest && e.target.closest('[data-zap]');
    if (el) stop(el);
  });
  window.addEventListener('hashchange', function () { stop(); });
})();
