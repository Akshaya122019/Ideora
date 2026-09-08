/* Ideora — main.js (jQuery) */

/* ---------- Preloader (index.html only; safe no-op elsewhere) ---------- */
(function () {
  var minTime = 900; // keep it visible long enough to read as intentional, not a flicker
  var start = Date.now();
  function clearLoadingState() {
    var elapsed = Date.now() - start;
    var wait = Math.max(minTime - elapsed, 0);
    setTimeout(function () {
      document.body.classList.remove('is-loading');
      var el = document.getElementById('preloader');
      if (el) {
        el.classList.add('is-hidden');
        setTimeout(function () { el.remove(); }, 700);
      }
    }, wait);
  }
  if (document.readyState === 'complete') clearLoadingState();
  else window.addEventListener('load', clearLoadingState);
})();

$(function () {

  /* ---------- WOW.js init (fadeIn-family entrance animations) ---------- */
  if (typeof WOW !== 'undefined') {
    new WOW({ offset: 60, mobile: true, live: false }).init();
  }

  /* ---------- Footer year ---------- */
  $('#year').text(new Date().getFullYear());

  /* ---------- rAF-throttled scroll (single listener, shared by nav + back-to-top) ---------- */
  var ticking = false;
  function onScrollFrame() {
    var y = window.scrollY || window.pageYOffset;
    $('.navbar-luxe').toggleClass('is-scrolled', y > 40);
    $('.fab-top').toggleClass('show', y > 500);
    ticking = false;
  }
  function requestScrollTick() {
    if (!ticking) {
      requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }
  onScrollFrame();
  window.addEventListener('scroll', requestScrollTick, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  $('.navbar-toggler-luxe').on('click', function () {
    $('.nav-links-luxe, .nav-backdrop').toggleClass('open');
    var expanded = $('.nav-links-luxe').hasClass('open');
    $(this).attr('aria-expanded', expanded);
  });
  $('.nav-backdrop').on('click', function () {
    $('.nav-links-luxe, .nav-backdrop').removeClass('open');
    $('.navbar-toggler-luxe').attr('aria-expanded', false);
  });
  $('.nav-links-luxe a').on('click', function () {
    $('.nav-links-luxe, .nav-backdrop').removeClass('open');
  });

  /* ---------- Scroll reveal (IntersectionObserver, one entry per element) ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated counters ----------
     Each counter block (hero stats, stats band, bento tile, etc.) gets its
     own observer entry so every instance on the page animates independently
     the first time IT scrolls into view — not gated by a single global flag
     (that was the bug: only the FIRST matching block on the page was ever
     observed before, so any second counter row silently never animated). */
  function animateCounter(el) {
    var $el = $(el);
    var target = parseFloat($el.data('count'));
    var suffix = $el.data('suffix') || '';
    var duration = 1500;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      $el.text(value + suffix);
      if (progress < 1) requestAnimationFrame(step);
      else $el.text(target + suffix);
    }
    requestAnimationFrame(step);
  }
  var counterEls = document.querySelectorAll('.js-counter');
  if ('IntersectionObserver' in window && counterEls.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counterEls.forEach(function (el) { counterIO.observe(el); });
  } else {
    counterEls.forEach(function (el) { $(el).text($(el).data('count') + ($(el).data('suffix') || '')); });
  }

  /* ---------- Testimonials: responsive multi-card carousel ----------
     Visible-card count matches the CSS breakpoints (1 / 2 / 3), recalculated
     on resize; slides one card at a time, auto-plays, loops, and exposes
     prev/next + dot controls. */
  var $testiTrack = $('.testi-track');
  var $testiSlides = $('.testi-slide');
  var $testiDotsWrap = $('.testi-dots');
  if ($testiTrack.length && $testiSlides.length) {
    var testiTotal = $testiSlides.length;
    var testiVisible = 1;
    var testiIndex = 0;
    var testiTimer = null;

    function testiVisibleCount() {
      var w = window.innerWidth;
      if (w >= 1200) return 3;
      if (w >= 768) return 2;
      return 1;
    }

    function testiMaxIndex() { return Math.max(testiTotal - testiVisible, 0); }

    function renderTestiDots() {
      var pages = testiMaxIndex() + 1;
      $testiDotsWrap.empty();
      for (var i = 0; i < pages; i++) {
        $('<span></span>').toggleClass('active', i === testiIndex).appendTo($testiDotsWrap);
      }
    }

    function goToTesti(i) {
      var max = testiMaxIndex();
      if (i > max) i = 0;
      if (i < 0) i = max;
      testiIndex = i;
      $testiTrack.css('transform', 'translateX(-' + (testiIndex * (100 / testiVisible)) + '%)');
      $testiDotsWrap.children().removeClass('active').eq(testiIndex).addClass('active');
    }

    function restartTestiTimer() {
      if (testiTimer) clearInterval(testiTimer);
      testiTimer = setInterval(function () { goToTesti(testiIndex + 1); }, 5000);
    }

    function recalcTesti() {
      var next = testiVisibleCount();
      if (next !== testiVisible) {
        testiVisible = next;
        if (testiIndex > testiMaxIndex()) testiIndex = testiMaxIndex();
        renderTestiDots();
        goToTesti(testiIndex);
      }
    }

    testiVisible = testiVisibleCount();
    renderTestiDots();
    goToTesti(0);
    restartTestiTimer();

    $('.testi-next').on('click', function () { goToTesti(testiIndex + 1); restartTestiTimer(); });
    $('.testi-prev').on('click', function () { goToTesti(testiIndex - 1); restartTestiTimer(); });
    $testiDotsWrap.on('click', 'span', function () { goToTesti($(this).index()); restartTestiTimer(); });

    var testiResizeTimer = null;
    $(window).on('resize', function () {
      clearTimeout(testiResizeTimer);
      testiResizeTimer = setTimeout(recalcTesti, 150);
    });
  }

  /* ---------- FAQ accordion (fixed generous max-height — no scrollHeight
     recompute, so it never goes stale on resize/refont; only one open) ---------- */
  $('.faq-q').on('click', function () {
    var $item = $(this).closest('.faq-item');
    var wasOpen = $item.hasClass('open');
    $item.siblings('.faq-item').removeClass('open');
    $item.toggleClass('open', !wasOpen);
  });

  /* ---------- Gallery lightbox ---------- */
  var galleryImgs = $('.gallery-item img').map(function () { return $(this).attr('src'); }).get();
  $('.gallery-item').on('click', function () {
    var idx = $(this).index();
    openLightbox(idx);
  });
  var $lightbox = $('#lightbox');
  var lbIndex = 0;
  function openLightbox(idx) {
    lbIndex = idx;
    $('#lightboxImg').attr('src', galleryImgs[lbIndex]);
    $lightbox.addClass('open');
    $('body').css('overflow', 'hidden');
  }
  function closeLightbox() {
    $lightbox.removeClass('open');
    $('body').css('overflow', '');
  }
  $('#lightboxClose, .lightbox-backdrop').on('click', closeLightbox);
  $('#lightboxNext').on('click', function () { lbIndex = (lbIndex + 1) % galleryImgs.length; $('#lightboxImg').attr('src', galleryImgs[lbIndex]); });
  $('#lightboxPrev').on('click', function () { lbIndex = (lbIndex - 1 + galleryImgs.length) % galleryImgs.length; $('#lightboxImg').attr('src', galleryImgs[lbIndex]); });
  $(document).on('keydown', function (e) {
    if (!$lightbox.hasClass('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') $('#lightboxNext').click();
    if (e.key === 'ArrowLeft') $('#lightboxPrev').click();
  });

  /* ---------- Contact form validation ---------- */
 /* ---------- Contact form validation + WhatsApp send ---------- */
$('#contactForm').on('submit', function (e) {
  e.preventDefault();
  var valid = true;
  var $form = $(this);

  $form.find('.form-control').each(function () {
    var $f = $(this);
    var val = $f.val().trim();
    var ok = true;
    if ($f.attr('required') && !val) ok = false;
    if ($f.attr('type') === 'tel' && val) {
      ok = /^[0-9+\-\s()]{7,}$/.test(val);
    }
    $f.toggleClass('is-invalid', !ok).toggleClass('is-valid', ok && val);
    if (!ok) valid = false;
  });

  if (!valid) return;

  var name = $form.find('[name="name"]').val().trim();
  var phone = $form.find('[name="phone"]').val().trim();
  var country = $form.find('[name="country"]').val().trim();
  var qualification = $form.find('[name="qualification"]').val().trim();
  var message = $form.find('[name="message"]').val().trim();

  var text = "New enquiry from website:%0A%0A" +
    "*Name:* " + name + "%0A" +
    "*Phone:* " + phone + "%0A" +
    "*Preferred Country:* " + country + "%0A" +
    "*Qualification:* " + qualification + "%0A" +
    "*Message:* " + message;

  var companyNumber = "919944688648"; // replace with real number: country code + number, digits only

  var $btn = $form.find('button[type="submit"]');
  $btn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> Sending...');

  setTimeout(function () {
    window.open("https://wa.me/" + companyNumber + "?text=" + text, "_blank");
    $form.fadeOut(250, function () {
      $('.form-success').fadeIn(350);
    });
    $btn.prop('disabled', false).html('Send Message <i class="fa-solid fa-paper-plane"></i>');
  }, 600);
});

  /* ---------- Floating "back to top" ---------- */
  $('.fab-top').on('click', function () { $('html, body').animate({ scrollTop: 0 }, 600); });

  /* ---------- Active nav link on current page ---------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  $('.nav-links-luxe a').each(function () {
    var href = $(this).attr('href');
    if (href === path) $(this).addClass('active');
  });

  /* ---------- Services interactive list (bug-proof crossfade) ----------
     Single source of truth: .service-row.is-active (never :hover) drives
     both the row highlight AND which image is shown, so keyboard focus and
     mouse hover can never disagree and show two rows "active" at once.
     A monotonically increasing request id discards any stale/late image
     preload so fast hovering never leaves the wrong image on screen. */
  var $visualLayers = $('.services-visual-img');
  var activeLayer = 'a';
  var imgRequestId = 0;
  if ($visualLayers.length) {
    var activateServiceRow = function ($row) {
      var img = $row.data('image');
      if (!img) return;

      $('.service-row').not($row).removeClass('is-active');
      $row.addClass('is-active');

      var $current = $visualLayers.filter('[data-layer="' + activeLayer + '"]');
      if ($current.attr('src') === img) return; // already showing this image

      var myRequestId = ++imgRequestId;
      var nextLayerName = activeLayer === 'a' ? 'b' : 'a';
      var $next = $visualLayers.filter('[data-layer="' + nextLayerName + '"]');

      var preload = new Image();
      preload.onload = function () {
        if (myRequestId !== imgRequestId) return; // superseded by a later hover — discard
        $next.attr('src', img).addClass('is-active');
        $visualLayers.not($next).removeClass('is-active');
        activeLayer = nextLayerName;
      };
      preload.src = img;
    };

    $('.service-row').on('mouseenter focus', function () { activateServiceRow($(this)); });

    // Touch/tap support: tapping the row body previews it; tapping the
    // arrow still navigates through to the full services page as normal.
    $('.service-row').on('click', function (e) {
      if ($(e.target).closest('.service-row-arrow').length) return;
      e.preventDefault();
      activateServiceRow($(this));
    });
  }

  /* ---------- Accordion strip (About — What We Do): single-open-at-a-time ---------- */
  var $accPanels = $('.acc-panel');
  function openAccPanel($panel) {
    $accPanels.removeClass('is-open').attr('aria-selected', 'false');
    $panel.addClass('is-open').attr('aria-selected', 'true');
  }
  $accPanels.on('click', function () { openAccPanel($(this)); })
    .on('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAccPanel($(this)); }
    });

});
