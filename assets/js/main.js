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

  // Rotating hero word
  var rot = document.querySelector('.rotator');
  if (rot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var words = (rot.getAttribute('data-words') || '').split(',');
    var i = 0;
    setInterval(function () {
      i = (i + 1) % words.length;
      rot.classList.remove('swap'); void rot.offsetWidth;
      rot.textContent = words[i];
      rot.classList.add('swap');
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
        .then(function (r) { return r.json(); })
        .then(function (res) {
          status.textContent = res.message;
          status.className = 'form-status ' + (res.ok ? 'ok' : 'err');
          if (res.ok) form.reset();
        })
        .catch(function () {
          status.textContent = 'Sorry, something went wrong. Please email quote@betrinsurance.co.uk or call 020 3051 6247.';
          status.className = 'form-status err';
        })
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    });
  });

  // Show result after a no-JS submit (?sent=1 / ?sent=0)
  var m = location.search.match(/sent=(\d)/);
  if (m) {
    var s = document.querySelector('form.enquiry .form-status');
    if (s) {
      s.textContent = m[1] === '1' ? 'Thank you for your message. We’ll be in touch shortly.' : 'Sorry, your message could not be sent. Please email quote@betrinsurance.co.uk.';
      s.className = 'form-status ' + (m[1] === '1' ? 'ok' : 'err');
    }
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
