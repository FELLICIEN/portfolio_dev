/* =========================================================
   PORTFOLIO — script.js
   Comportements partagés sur toutes les pages.
========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Année dynamique dans le footer ---------- */
  document.querySelectorAll('.current-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Navbar : fond plein au scroll ---------- */
  var nav = document.querySelector('.site-nav');
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ---------- Lien actif selon la page courante ---------- */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.site-nav .nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Fermer le menu mobile après un clic ---------- */
  var navCollapseEl = document.getElementById('mainNav');
  if (navCollapseEl) {
    var bsCollapse = window.bootstrap ? new bootstrap.Collapse(navCollapseEl, { toggle: false }) : null;
    navCollapseEl.querySelectorAll('.nav-link, .btn-nav-cta').forEach(function (link) {
      link.addEventListener('click', function () {
        if (bsCollapse && navCollapseEl.classList.contains('show')) {
          bsCollapse.hide();
        }
      });
    });
  }

  /* ---------- Reveal au scroll (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Compteurs animés (page d'accueil) ---------- */
  var counters = document.querySelectorAll('.stat-num[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var current = 0;
        var step = Math.max(1, Math.round(target / 40));
        var timer = setInterval(function () {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 30);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Filtres de projets ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        projectCards.forEach(function (card) {
          var show = (filter === 'all' || card.getAttribute('data-category') === filter);
          card.closest('.project-col').style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Validation du formulaire de contact ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      contactForm.querySelectorAll('[data-required]').forEach(function (field) {
        var wrapper = field.closest('.was-validated-field');
        var value = field.value.trim();
        var ok = value.length > 0;

        if (field.type === 'email' && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (!ok) {
          valid = false;
          wrapper.classList.add('is-invalid');
        } else {
          wrapper.classList.remove('is-invalid');
        }
      });

      var successBox = document.getElementById('formSuccess');
      if (valid) {
        // NOTE pour Félicien : ce formulaire est uniquement côté front-end.
        // Pour le rendre fonctionnel, connecte-le à un service comme
        // Formspree, EmailJS, ou à ton propre backend (Firebase Functions par ex.).
        successBox.style.display = 'flex';
        contactForm.reset();
        contactForm.querySelectorAll('.was-validated-field').forEach(function (w) {
          w.classList.remove('is-invalid');
        });
        setTimeout(function () {
          successBox.style.display = 'none';
        }, 6000);
      } else if (successBox) {
        successBox.style.display = 'none';
      }
    });
  }

});
