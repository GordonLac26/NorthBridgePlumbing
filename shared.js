  // ── NAVBAR SCROLL ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── HAMBURGER MENU ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  function closeMobile() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }

  // ── SCROLL REVEAL ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => revealObserver.observe(r));

  // ── WATER CANVAS ANIMATION ──
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animFrame;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
      this.color = Math.random() > 0.5 ? '#21A0B5' : '#C97B37';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.7;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 120; i++) particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  animate();

  // ── FORM SUBMIT ──
  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const success = document.getElementById('formSuccess');
    form.style.display = 'none';
    success.style.display = 'block';
  }

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    
    // Use Fetch API to send the form data
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
            Accept: 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show custom success message
            document.getElementById('formSuccess').style.display = 'block';
            form.reset(); // Optional: Reset the form after submission
        } else {
            // Handle errors
            alert('There was a problem with your submission.');
        }
    })
    .catch(error => {
        console.error('Error!', error.message);
    });
});  

  // ── SMOOTH ANCHOR SCROLL OFFSET ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ══════════════════════════════════════════════
   GALLERY — Filter + Lightbox
══════════════════════════════════════════════ */
(function () {
  const filters    = document.querySelectorAll('.gallery-filter');
  const items      = document.querySelectorAll('.gallery-item');
  const lightbox   = document.getElementById('galleryLightbox');
  const backdrop   = document.getElementById('lightboxBackdrop');
  const closeBtn   = document.getElementById('lightboxClose');
  const prevBtn    = document.getElementById('lightboxPrev');
  const nextBtn    = document.getElementById('lightboxNext');
  const lbImg      = document.getElementById('lightboxImg');
  const lbPH       = document.getElementById('lightboxPlaceholder');
  const lbTag      = document.getElementById('lightboxTag');
  const lbTitle    = document.getElementById('lightboxTitle');
  const lbDesc     = document.getElementById('lightboxDesc');

  if (!lightbox) return;

  let visibleItems = Array.from(items);
  let currentIndex = 0;

  /* ── FILTER ── */
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      visibleItems = [];

      items.forEach(function (item) {
        var cat = item.getAttribute('data-category');
        var show = filter === 'all' || cat === filter;
        if (show) {
          item.style.display = '';
          item.classList.remove('hidden');
          visibleItems.push(item);
        } else {
          item.classList.add('hidden');
          setTimeout(function () {
            if (item.classList.contains('hidden')) item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ── OPEN LIGHTBOX ── */
  items.forEach(function (item, idx) {
    item.addEventListener('click', function () {
      currentIndex = visibleItems.indexOf(item);
      if (currentIndex === -1) currentIndex = 0;
      populateLightbox(item);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function populateLightbox(item) {
    var img   = item.querySelector('img');
    var title = item.getAttribute('data-title')  || '';
    var desc  = item.getAttribute('data-desc')   || '';
    var cat   = item.getAttribute('data-category') || '';

    lbTag.textContent   = cat.charAt(0).toUpperCase() + cat.slice(1);
    lbTitle.textContent = title;
    lbDesc.textContent  = desc;

    if (img && img.complete && img.naturalWidth > 0) {
      lbImg.src = img.src;
      lbImg.alt = img.alt || title;
      lbImg.style.display = 'block';
      lbPH.style.display  = 'none';
    } else {
      lbImg.style.display = 'none';
      lbPH.style.display  = 'flex';
    }
  }

  /* ── CLOSE ── */
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  /* ── PREV / NEXT ── */
  prevBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    populateLightbox(visibleItems[currentIndex]);
  });

  nextBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % visibleItems.length;
    populateLightbox(visibleItems[currentIndex]);
  });

  /* ── KEYBOARD ── */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevBtn.click();
    if (e.key === 'ArrowRight')  nextBtn.click();
  });
})();


