// ============================================
// RESPONSIVE NAVIGATION (BURGER MENU)
// Shared across all pages. Progressive enhancement:
// the links exist in the DOM; this only toggles the mobile panel.
// ============================================
(function () {
  function init() {
    var navbar = document.getElementById('navbar');
    var toggle = document.querySelector('.nav-toggle');
    if (!navbar || !toggle) return;

    function close() {
      navbar.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var isOpen = navbar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after choosing a destination
    var links = navbar.querySelectorAll('.navbutton');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', close);
    }

    // Close on Escape for keyboard users
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
