// ============================================================
// NASHWA HAMIDO — ONE-PAGE PORTFOLIO SCRIPT
// ============================================================
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Burger nav ---------- */
    var topnav = document.getElementById('topnav');
    var toggle = document.querySelector('.nav-toggle');
    if (toggle && topnav) {
      toggle.addEventListener('click', function () {
        var open = topnav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    /* ---------- Smooth-scroll + close menu + active link ---------- */
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        if (topnav) topnav.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });

    var sections = ['home', 'about', 'portfolio', 'contact']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    function onScroll() {
      var pos = window.scrollY + (window.innerHeight * 0.35);
      var current = sections[0] ? sections[0].id : null;
      sections.forEach(function (s) { if (s.offsetTop <= pos) current = s.id; });
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Theme toggle ---------- */
    var themeCheckbox = document.getElementById('theme-checkbox');
    if (themeCheckbox) {
      if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeCheckbox.checked = true;
      }
      themeCheckbox.addEventListener('change', function () {
        document.body.classList.toggle('light-mode');
        try {
          localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        } catch (e) {}
      });
    }

    /* ---------- Portfolio tabs ---------- */
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.pf-tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.pf-panel'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-panel');
        tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
        panels.forEach(function (p) { p.classList.toggle('active', p.id === target); });
      });
    });

    /* ---------- Carousels (independent, multi-instance) ---------- */
    function initCarousel(root) {
      var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
      var dotsWrap = root.querySelector('.dots');
      var prev = root.querySelector('.car-prev');
      var next = root.querySelector('.car-next');
      var n = slides.length;
      if (!n) return;
      var index = 0;

      // build dots
      var dots = [];
      if (dotsWrap) {
        slides.forEach(function (_, i) {
          var d = document.createElement('span');
          d.className = 'dot' + (i === 0 ? ' active' : '');
          d.addEventListener('click', function () { index = i; update(); });
          dotsWrap.appendChild(d);
          dots.push(d);
        });
      }

      function update() {
        slides.forEach(function (slide, i) {
          slide.classList.remove('active', 'prev', 'next', 'hide-left', 'hide-right');
          var pos = i - index;
          if (pos < -Math.floor(n / 2)) pos += n;
          else if (pos > Math.ceil(n / 2)) pos -= n;
          if (pos === 0) slide.classList.add('active');
          else if (pos === -1) slide.classList.add('prev');
          else if (pos === 1) slide.classList.add('next');
          else if (pos < -1) slide.classList.add('hide-left');
          else slide.classList.add('hide-right');
        });
        dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
      }

      if (prev) prev.addEventListener('click', function () { index = (index - 1 + n) % n; update(); });
      if (next) next.addEventListener('click', function () { index = (index + 1) % n; update(); });
      update();
    }
    Array.prototype.slice.call(document.querySelectorAll('.carousel')).forEach(initCarousel);

    /* ---------- Contact form (FormSubmit) ---------- */
    var form = document.getElementById('contact-form');
    var successMessage = document.getElementById('success-message');
    var sendAnotherBtn = document.getElementById('send-another');
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var submitButton = form.querySelector('button[type="submit"]');
        var originalText = submitButton ? submitButton.textContent : '';
        if (submitButton) { submitButton.textContent = 'Sending...'; submitButton.disabled = true; }
        try {
          var payload = Object.fromEntries(new FormData(form).entries());
          var response = await fetch('https://formsubmit.co/ajax/nashwa.elbanna144@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
          var data = await response.json();
          if (data.success === true || data.success === 'true') {
            form.style.display = 'none';
            if (successMessage) successMessage.style.display = 'block';
            createConfetti();
            form.reset();
          } else {
            alert('Oops! Something went wrong. Please try again.');
          }
        } catch (err) {
          alert('Oops! Something went wrong. Please try again.');
        } finally {
          if (submitButton) { submitButton.textContent = originalText; submitButton.disabled = false; }
        }
      });
    }
    if (sendAnotherBtn) {
      sendAnotherBtn.addEventListener('click', function () {
        if (successMessage) successMessage.style.display = 'none';
        if (form) form.style.display = 'flex';
      });
    }
    function createConfetti() {
      var colors = ['#ea7d6d', '#fdcd00'];
      for (var i = 0; i < 120; i++) {
        var c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + '%';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDelay = Math.random() * 0.5 + 's';
        c.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(c);
        (function (el) { setTimeout(function () { el.remove(); }, 5000); })(c);
      }
    }

    /* ---------- Particle background ---------- */
    var canvas = document.getElementById('particle-canvas');
    if (canvas && canvas.getContext) {
      var ctx = canvas.getContext('2d');
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize();
      window.addEventListener('resize', resize);
      var particles = [];
      var count = 130;
      var mouse = { x: null, y: null, radius: 90 };
      window.addEventListener('mousemove', function (e) { mouse.x = e.x; mouse.y = e.y; });
      function Particle() { this.reset(); this.y = Math.random() * canvas.height; }
      Particle.prototype.reset = function () {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 1.5 + 0.5;
      };
      Particle.prototype.update = function () {
        if (mouse.x != null) {
          var dx = mouse.x - this.x, dy = mouse.y - this.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            var force = (mouse.radius - dist) / mouse.radius, angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 0.2; this.vy -= Math.sin(angle) * force * 0.2;
          }
        }
        this.x += this.vx; this.y += this.vy; this.vx *= 0.98; this.vy *= 0.98;
        if (this.x < 0 || this.x > canvas.width) { this.vx *= -1; this.x = Math.max(0, Math.min(canvas.width, this.x)); }
        if (this.y < 0 || this.y > canvas.height) { this.vy *= -1; this.y = Math.max(0, Math.min(canvas.height, this.y)); }
      };
      Particle.prototype.draw = function () {
        ctx.fillStyle = 'rgba(253, 205, 0, 0.8)';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      };
      for (var i = 0; i < count; i++) particles.push(new Particle());
      function connect() {
        for (var a = 0; a < particles.length; a++) {
          for (var b = a + 1; b < particles.length; b++) {
            var dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
              ctx.strokeStyle = 'rgba(234, 125, 109, ' + ((1 - dist / 80) * 0.15) + ')';
              ctx.lineWidth = 0.5;
              ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
            }
          }
        }
      }
      (function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function (p) { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(animate);
      })();
    }

  });
})();
