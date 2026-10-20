/* BETR Insurance – small, dependency-free site script.
   Everything still works (and all content is visible) if this file fails to load. */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  // Mobile menu
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('.main-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header shadow once the page scrolls
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // "Get Quote" dialog
  var dlg = document.getElementById('quote-dialog');
  document.querySelectorAll('[data-open-quote]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (dlg && typeof dlg.showModal === 'function') { e.preventDefault(); dlg.showModal(); }
    });
  });
  if (dlg) {
    dlg.querySelector('.close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  // Rotating hero word. All words sit in the same spot, so the heading never changes size.
  var rot = document.querySelector('.rotator');
  if (rot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var words = rot.querySelectorAll('.rw');
    var i = 0;
    setInterval(function () {
      words[i].classList.remove('on'); words[i].setAttribute('aria-hidden', 'true');
      i = (i + 1) % words.length;
      words[i].classList.add('on'); words[i].removeAttribute('aria-hidden');
    }, 2600);
  }

  // Reveal on scroll (falls back to visible)
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Forms: send without leaving the page (normal POST still works without JS)
  document.querySelectorAll('form.enquiry').forEach(function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      if (!window.fetch || !window.FormData) return;
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var label = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Sending…';
      status.className = 'form-status';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (data) {
            if (r.ok) {
              status.textContent = 'Thank you for your message. We\u2019ll be in touch shortly.';
              status.className = 'form-status ok';
              form.reset();
            } else {
              var msg = data && data.errors && data.errors.length ? data.errors.map(function (e) { return e.message; }).join(' ') : '';
              throw new Error(msg);
            }
          });
        })
        .catch(function (err) {
          status.textContent = (err && err.message ? err.message + ' ' : 'Sorry, something went wrong. ') + 'You can also email quote@betrinsurance.co.uk or call 020 3051 6247.';
          status.className = 'form-status err';
        })
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    });
  });

  // Google map: only load when the visitor asks (no Google cookies until then)
  document.querySelectorAll('.map-frame').forEach(function (frame) {
    var btn = frame.querySelector('.map-load');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = frame.getAttribute('data-map-src');
      f.title = 'Map showing BETR Insurance Brokers, Great Portland Street, London';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      frame.innerHTML = '';
      frame.appendChild(f);
    });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
