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

    var sections = ['home', 'about', 'services', 'portfolio', 'contact']
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

    /* ---------- Cycling name loop ---------- */
    var loopList = document.querySelector('[data-name-loop]');
    if (loopList && loopList.children.length > 1) {
      var clone = loopList.children[0].cloneNode(true);
      loopList.appendChild(clone);
      var nameTotal = loopList.children.length; // originals + 1 clone
      var nameUnit = 100 / nameTotal;
      var nameIdx = 0;
      setInterval(function () {
        nameIdx++;
        loopList.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        loopList.style.transform = 'translateY(-' + (nameIdx * nameUnit) + '%)';
        if (nameIdx === nameTotal - 1) {
          // reached the clone of the first word — snap back seamlessly
          setTimeout(function () {
            loopList.style.transition = 'none';
            nameIdx = 0;
            loopList.style.transform = 'translateY(0)';
          }, 650);
        }
      }, 2400);
    }

    /* ---------- Scroll reveal (slide-in) ---------- */
    document.body.classList.add('js-reveal');
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(
      '.section-title, .about-hero, .tl-col, .tools-title, .services-head, .service-card, .pf-tabs, .contact-info, .contact-form, .social'
    ));
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }

    /* ---------- Tool marquees: duplicate each track for a seamless loop ---------- */
    Array.prototype.slice.call(document.querySelectorAll('.marquee-track')).forEach(function (track) {
      var originals = Array.prototype.slice.call(track.children);
      originals.forEach(function (node) {
        var clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    });

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

    /* ---------- Case studies (data-driven cards + modal) ---------- */
    (function () {
      var grid = document.getElementById('cs-grid');
      if (!grid) return;
      var data = window.CASE_STUDIES || [];
      if (!data.length) {
        grid.innerHTML = '<p style="text-align:center;opacity:.7;grid-column:1/-1;">No case studies yet.</p>';
        return;
      }

      function tagsHtml(tags) {
        return (tags || []).map(function (t) { return '<span class="cs-tag">' + t + '</span>'; }).join('');
      }

      function renderCards(targetGrid, list, label) {
        list.forEach(function (proj) {
          var card = document.createElement('button');
          card.className = 'cs-card';
          card.type = 'button';
          card.setAttribute('aria-label', 'Open ' + label + ': ' + (proj.title || ''));
          card.innerHTML =
            '<span class="cs-card-media"><img src="' + proj.cover + '" alt="' + (proj.title || '') + '" loading="lazy"></span>' +
            '<span class="cs-card-body"><span class="cs-card-title">' + (proj.title || '') + '</span>' +
            '<span class="cs-card-tags">' + tagsHtml(proj.tags) + '</span></span>';
          card.addEventListener('click', function () { openModal(proj); });
          targetGrid.appendChild(card);
        });
      }
      renderCards(grid, data, 'case study');
      var brandingGrid = document.getElementById('branding-grid');
      if (brandingGrid && (window.BRANDING_PROJECTS || []).length) {
        window.BRANDING_PROJECTS.forEach(function (p) { p.fit = 'contain'; });
        renderCards(brandingGrid, window.BRANDING_PROJECTS, 'project');
      }
      var gamedevGrid = document.getElementById('gamedev-grid');
      if (gamedevGrid && (window.GAMEDEV_PROJECTS || []).length) {
        renderCards(gamedevGrid, window.GAMEDEV_PROJECTS, 'game');
      }

      var modal = document.getElementById('cs-modal');
      var mTitle = document.getElementById('cs-modal-title');
      var mTags = document.getElementById('cs-modal-tags');
      var mSummary = document.getElementById('cs-modal-summary');
      var mCarousel = document.getElementById('cs-modal-carousel');
      var mRole = document.getElementById('cs-modal-role');
      var mTools = document.getElementById('cs-modal-tools');
      var mLink = document.getElementById('cs-modal-link');
      var lastFocused = null;

      function toolsHtml(tools) {
        var map = window.TOOL_ICONS || {};
        return (tools || []).map(function (key) {
          var t = map[key];
          if (!t) return '';
          var cls = 'tool-ico' + (t.tile ? ' tool-ico--tile' : '');
          return '<span class="cs-tool" title="' + (t.name || key) + '">' +
            '<span class="' + cls + '" aria-hidden="true">' + t.svg + '</span>' +
            '<span class="cs-tool-name">' + (t.name || key) + '</span></span>';
        }).join('');
      }

      function openModal(p) {
        if (!p || !modal) return;
        lastFocused = document.activeElement;
        mTitle.textContent = p.title || '';
        mTags.innerHTML = tagsHtml(p.tags);
        mSummary.textContent = p.summary || '';
        if (mRole) { mRole.textContent = p.role || ''; mRole.style.display = p.role ? '' : 'none'; }
        if (mTools) {
          var th = toolsHtml(p.tools);
          mTools.innerHTML = th;
          mTools.style.display = th ? '' : 'none';
        }
        // Build one 3D carousel, optionally grouped into labelled sections.
        function isVideo(src) { return /\.(mp4|webm|mov|m4v)$/i.test(src); }
        function carouselHtml(imgs, grouped) {
          var slidesHtml = imgs.map(function (src) {
            var media = isVideo(src)
              ? '<video muted loop playsinline autoplay preload="auto" src="' + src + '"></video>'
              : '<img src="' + src + '" alt="' + (p.title || '') + '" loading="lazy">';
            return '<div class="slide">' + media + '</div>';
          }).join('');
          var prevSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
          var nextSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
          return '<div class="carousel' + (grouped ? ' cs-grouped' : '') + '"><div class="carousel-track">' + slidesHtml + '</div>' +
            '<button class="car-btn car-prev" aria-label="Previous">' + prevSvg + '</button>' +
            '<button class="car-btn car-next" aria-label="Next">' + nextSvg + '</button>' +
            '<div class="dots"></div></div>';
        }
        mCarousel.classList.remove('is-grouped', 'is-rows', 'is-single');
        mCarousel.classList.toggle('cs-fit-contain', p.fit === 'contain');
        if (p.singleShot) {
          // A single still image, shown plainly (no carousel chrome).
          mCarousel.classList.add('is-single');
          var one = (p.images && p.images.length ? p.images[0] : p.cover);
          mCarousel.innerHTML = '<div class="cs-single"><img src="' + one + '" alt="' + (p.title || '') + '" loading="lazy"></div>';
        } else if (p.rows && p.rows.length) {
          // Static horizontal rows of images (no carousel), scrolled vertically.
          mCarousel.classList.add('is-rows');
          mCarousel.innerHTML = p.rows.map(function (r) {
            var imgsHtml = (r.images || []).map(function (src) {
              return /\.(mp4|webm|mov|m4v)$/i.test(src)
                ? '<video muted loop playsinline autoplay preload="auto" src="' + src + '"></video>'
                : '<img src="' + src + '" alt="' + (p.title || '') + '" loading="lazy">';
            }).join('');
            return '<div class="cs-rowset' + (r.small ? ' cs-rowset--small' : '') + '">' + (r.label ? '<h4 class="cs-group-label">' + r.label + '</h4>' : '') +
              (r.desc ? '<p class="cs-row-desc">' + r.desc + '</p>' : '') +
              '<div class="cs-rowimgs">' + imgsHtml + '</div></div>';
          }).join('');
        } else if (p.groups && p.groups.length) {
          mCarousel.classList.add('is-grouped');
          mCarousel.innerHTML = p.groups.map(function (g) {
            return '<div class="cs-group"><h4 class="cs-group-label">' + (g.label || '') + '</h4>' +
              carouselHtml(g.images && g.images.length ? g.images : [], true) + '</div>';
          }).join('');
        } else {
          var imgs = (p.images && p.images.length ? p.images : [p.cover]);
          mCarousel.innerHTML = carouselHtml(imgs, false);
        }
        mCarousel.scrollTop = 0;
        Array.prototype.slice.call(mCarousel.querySelectorAll('.carousel')).forEach(initCarousel);
        var linkUrl = p.linkUrl || p.behanceUrl;
        var linkLabel = p.linkLabel || (p.behanceUrl ? 'View on Behance ↗' : '');
        if (linkUrl) { mLink.href = linkUrl; mLink.textContent = linkLabel; mLink.style.display = ''; }
        else { mLink.style.display = 'none'; }
        modal.hidden = false;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        var closeBtn = modal.querySelector('.cs-modal-close');
        if (closeBtn) closeBtn.focus();
      }
      function closeModal() {
        if (!modal) return;
        modal.hidden = true;
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        if (lastFocused && lastFocused.focus) lastFocused.focus();
      }
      if (modal) {
        Array.prototype.slice.call(modal.querySelectorAll('[data-cs-close]')).forEach(function (el) {
          el.addEventListener('click', closeModal);
        });
        document.addEventListener('keydown', function (e) {
          if ((e.key === 'Escape' || e.keyCode === 27) && !modal.hidden) closeModal();
        });
      }
    })();

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
          // Play only the active slide's video (muted); pause the rest.
          var vid = slide.querySelector('video');
          if (vid) {
            vid.muted = true;
            if (pos === 0) { var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
            else { vid.pause(); }
          }
        });
        dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
      }

      // Auto-advance every 3s; pause on hover and after manual interaction.
      var timer = null, paused = false;
      function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
      function startAuto() {
        if (n < 2) return;
        stopAuto();
        timer = setInterval(function () {
          if (paused || !root.offsetParent) return; // skip while hovered or hidden
          index = (index + 1) % n; update();
        }, 3000);
      }
      root.addEventListener('mouseenter', function () { paused = true; });
      root.addEventListener('mouseleave', function () { paused = false; });

      if (prev) prev.addEventListener('click', function () { index = (index - 1 + n) % n; update(); startAuto(); });
      if (next) next.addEventListener('click', function () { index = (index + 1) % n; update(); startAuto(); });
      dots.forEach(function (d, i) { d.addEventListener('click', function () { startAuto(); }); });
      update();
      startAuto();
    }
    Array.prototype.slice.call(document.querySelectorAll('.carousel')).forEach(initCarousel);

    /* ---------- Web Development projects (data-driven) ---------- */
    (function () {
      var grid = document.getElementById('web-grid');
      var data = window.WEB_PROJECTS || [];
      if (!grid || !data.length) return;

      function tagsHtml(tags) {
        return (tags || []).map(function (t) { return '<span class="cs-tag">' + t + '</span>'; }).join('');
      }

      var globeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"/></svg>';

      data.forEach(function (proj, idx) {
        var card = document.createElement('button');
        card.className = 'cs-card web-proj-card';
        card.type = 'button';
        card.setAttribute('aria-label', 'Open web project: ' + (proj.title || ''));
        var coverStyle = proj.coverPos ? ' style="object-position:' + proj.coverPos + '"' : '';
        var coverInner = proj.cover
          ? '<img class="web-cover-shot" src="' + proj.cover + '" alt="' + (proj.title || '') + ' preview"' + coverStyle + ' loading="lazy">'
          : '<span class="web-cover-icon">' + globeSvg + '</span>';
        card.innerHTML =
          '<span class="cs-card-media web-cover' + (proj.cover ? ' web-cover--shot' : '') + '">' +
            '<span class="web-cover-bar"><i></i><i></i><i></i><span class="web-cover-url">' + (proj.displayUrl || '') + '</span></span>' +
            coverInner +
          '</span>' +
          '<span class="cs-card-body"><span class="cs-card-title">' + (proj.title || '') + '</span>' +
          '<span class="cs-card-tags">' + tagsHtml(proj.tags) + '</span></span>';
        card.addEventListener('click', function () { openWeb(idx); });
        grid.appendChild(card);
      });

      var modal = document.getElementById('web-modal');
      if (!modal) return;
      var mTitle = document.getElementById('web-modal-title');
      var mTags = document.getElementById('web-modal-tags');
      var mCredit = document.getElementById('web-modal-credit');
      var mSummary = document.getElementById('web-modal-summary');
      var mTech = document.getElementById('web-modal-tech');
      var mPreview = document.getElementById('web-modal-preview');
      var mLink = document.getElementById('web-modal-link');
      var lastFocused = null;

      var TECH_KEY = {
        'JavaScript': 'javascript', 'Node.js': 'nodejs', 'Express': 'express',
        'React': 'react', 'Vite': 'vite', 'MySQL': 'mysql', 'Socket.IO': 'socketio',
        'HTML': 'html5', 'CSS': 'css3', 'Figma': 'figma'
      };
      function techHtml(tech) {
        var map = window.TOOL_ICONS || {};
        return (tech || []).map(function (t) {
          var ic = map[TECH_KEY[t] || ''];
          var icon = ic ? '<span class="tool-ico' + (ic.tile ? ' tool-ico--tile' : '') + '" aria-hidden="true">' + ic.svg + '</span>' : '';
          return '<span class="web-tech-chip">' + icon + '<span>' + t + '</span></span>';
        }).join('');
      }

      function openWeb(idx) {
        var p = data[idx];
        if (!p) return;
        lastFocused = document.activeElement;
        mTitle.textContent = p.title || '';
        mTags.innerHTML = tagsHtml(p.tags);
        mCredit.textContent = p.credit || ''; mCredit.style.display = p.credit ? '' : 'none';
        mSummary.textContent = p.summary || '';
        mTech.innerHTML = techHtml(p.tech);
        var shots = p.shots && p.shots.length ? p.shots : (p.shot ? [p.shot] : []);
        if (shots.length) {
          var slidesHtml = shots.map(function (s) {
            return '<div class="slide"><img src="' + s + '" alt="' + (p.title || '') + ' screenshot" loading="lazy"></div>';
          }).join('');
          var prevSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
          var nextSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
          mPreview.innerHTML = '<div class="cs-modal-carousel"><div class="carousel"><div class="carousel-track">' + slidesHtml + '</div>' +
            '<button class="car-btn car-prev" aria-label="Previous">' + prevSvg + '</button>' +
            '<button class="car-btn car-next" aria-label="Next">' + nextSvg + '</button>' +
            '<div class="dots"></div></div></div>';
          Array.prototype.slice.call(mPreview.querySelectorAll('.carousel')).forEach(initCarousel);
        } else {
          mPreview.innerHTML = '';
        }
        if (p.url) { mLink.href = p.url; mLink.style.display = ''; } else { mLink.style.display = 'none'; }
        modal.hidden = false;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        var cb = modal.querySelector('.cs-modal-close'); if (cb) cb.focus();
      }
      function closeWeb() {
        modal.hidden = true;
        mPreview.innerHTML = '';
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        if (lastFocused && lastFocused.focus) lastFocused.focus();
      }
      Array.prototype.slice.call(modal.querySelectorAll('[data-web-close]')).forEach(function (el) {
        el.addEventListener('click', closeWeb);
      });
      document.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.keyCode === 27) && !modal.hidden) closeWeb();
      });
    })();

    /* ---------- App Development (data-driven: card -> modal) ---------- */
    (function () {
      var grid = document.getElementById('app-grid');
      var data = window.APP_PROJECTS || [];
      if (!grid || !data.length) return;

      function tagsHtml(tags) {
        return (tags || []).map(function (t) { return '<span class="cs-tag">' + t + '</span>'; }).join('');
      }

      // Tech chips, matched to icons by display name.
      var TECH_KEY = {
        'TypeScript': 'typescript', 'React Native': 'reactnative',
        'React Native Filament': 'filament', 'Blender': 'blender',
        'Git': 'git', 'Figma': 'figma'
      };
      function techHtml(tech) {
        var map = window.TOOL_ICONS || {};
        return (tech || []).map(function (t) {
          var ic = map[TECH_KEY[t] || ''];
          var icon = ic ? '<span class="tool-ico' + (ic.tile ? ' tool-ico--tile' : '') + '" aria-hidden="true">' + ic.svg + '</span>' : '';
          return '<span class="web-tech-chip">' + icon + '<span>' + t + '</span></span>';
        }).join('');
      }

      data.forEach(function (proj, idx) {
        var card = document.createElement('button');
        card.className = 'cs-card app-proj-card';
        card.type = 'button';
        card.setAttribute('aria-label', 'Open app project: ' + (proj.title || ''));
        card.innerHTML =
          '<span class="cs-card-media"><img src="' + proj.cover + '" alt="' + (proj.title || '') + '" loading="lazy"></span>' +
          '<span class="cs-card-body"><span class="cs-card-title">' + (proj.title || '') + '</span>' +
          '<span class="cs-card-tags">' + tagsHtml(proj.tags) + '</span></span>';
        card.addEventListener('click', function () { openApp(idx); });
        grid.appendChild(card);
      });

      var modal = document.getElementById('app-modal');
      if (!modal) return;
      var mTitle = document.getElementById('app-modal-title');
      var mTags = document.getElementById('app-modal-tags');
      var mRole = document.getElementById('app-modal-role');
      var mSummary = document.getElementById('app-modal-summary');
      var mVideo = document.getElementById('app-modal-video');
      var mTech = document.getElementById('app-modal-tech');
      var mCopy = document.getElementById('app-modal-copyright');
      var lastFocused = null;

      function openApp(idx) {
        var p = data[idx];
        if (!p) return;
        lastFocused = document.activeElement;
        mTitle.textContent = p.title || '';
        mTags.innerHTML = tagsHtml(p.tags);
        mRole.textContent = p.role || ''; mRole.style.display = p.role ? '' : 'none';
        mSummary.textContent = p.summary || '';
        mTech.innerHTML = techHtml(p.tech);
        mCopy.textContent = p.copyright || ''; mCopy.style.display = p.copyright ? '' : 'none';
        mVideo.innerHTML = p.youtubeId
          ? '<iframe src="https://www.youtube-nocookie.com/embed/' + p.youtubeId +
            '?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&color=white" ' +
            'title="' + (p.title || '') + ' demo" loading="lazy" ' +
            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
            'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
          : '';
        modal.hidden = false;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        var cb = modal.querySelector('.cs-modal-close'); if (cb) cb.focus();
      }
      function closeApp() {
        modal.hidden = true;
        mVideo.innerHTML = '';
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        if (lastFocused && lastFocused.focus) lastFocused.focus();
      }
      Array.prototype.slice.call(modal.querySelectorAll('[data-app-close]')).forEach(function (el) {
        el.addEventListener('click', closeApp);
      });
      document.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.keyCode === 27) && !modal.hidden) closeApp();
      });
    })();

    /* ---------- Contact form (FormSubmit) ---------- */
    var form = document.getElementById('contact-form');
    var successMessage = document.getElementById('success-message');
    var sendAnotherBtn = document.getElementById('send-another');
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var submitButton = form.querySelector('button[type="submit"]');
        var submitLabel = submitButton ? submitButton.querySelector('.submit-label') : null;
        function setSending(on) {
          if (!submitButton) return;
          submitButton.disabled = on;
          submitButton.classList.toggle('is-sending', on);
          if (submitLabel) submitLabel.textContent = on ? 'Sending...' : 'Submit';
        }
        setSending(true);
        try {
          var payload = Object.fromEntries(new FormData(form).entries());
          payload._captcha = 'false';
          var response = await fetch('https://formsubmit.co/ajax/nashwa.elbanna144@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
          var data = {};
          try { data = await response.json(); } catch (e) { data = {}; }
          if (response.ok && (data.success === true || data.success === 'true')) {
            form.style.display = 'none';
            if (successMessage) successMessage.style.display = 'block';
            createConfetti();
            form.reset();
          } else {
            alert(data && data.message ? ('Could not send: ' + data.message) : 'Oops! Something went wrong. Please try again.');
          }
        } catch (err) {
          alert('Oops! Something went wrong. Please try again.');
        } finally {
          setSending(false);
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
      // Theme-aware particle colours: bright on the dark theme, deeper &
      // more opaque on the light theme so they stay visible on cream.
      function isLight() { return document.body.classList.contains('light-mode'); }
      Particle.prototype.draw = function () {
        ctx.fillStyle = isLight() ? 'rgba(155, 60, 30, 0.55)' : 'rgba(253, 205, 0, 0.8)';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      };
      for (var i = 0; i < count; i++) particles.push(new Particle());
      function connect() {
        var light = isLight();
        for (var a = 0; a < particles.length; a++) {
          for (var b = a + 1; b < particles.length; b++) {
            var dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
              var lineAlpha = (1 - dist / 80) * (light ? 0.30 : 0.15);
              ctx.strokeStyle = (light ? 'rgba(120, 70, 40, ' : 'rgba(234, 125, 109, ') + lineAlpha + ')';
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
