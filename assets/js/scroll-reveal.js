document.addEventListener('DOMContentLoaded', function () {
  // ── Scroll-reveal ──────────────────────────────────────────────────────────
  var items = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && items.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ── Reading progress bar ───────────────────────────────────────────────────
  var bar = document.getElementById('reading-progress');
  if (bar) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }, { passive: true });
  }
});
