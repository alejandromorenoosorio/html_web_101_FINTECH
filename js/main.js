/**
 * 101 FINTECH - JAVASCRIPT VANILLA
 * Funcionalidades:
 * 1. Carrusel de Banners Hero (Autoplay, Pausa/Play, Flechas, Puntos, Swipe táctil)
 * 2. Header Sticky con detección de Scroll
 * 3. Menús desplegables accesibles (Productos, Ingresar, Idiomas)
 * 4. Navegación móvil (Menú Hamburguesa)
 * 5. Botón Volver Arriba (Scroll to top)
 * 6. Simulador de Crédito Interactivo
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initStickyHeader();
  initDropdowns();
  initMobileMenu();
  initLanguageSelector();
  initScrollTop();
  initCreditSimulator();
  initScrollAnimations();
  initFaqAccordion();
});

/* ==========================================================================
   1. HERO CAROUSEL
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const pausePlayBtn = document.getElementById('pausePlayBtn');
  const carouselContainer = document.querySelector('.carousel-container');

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideDuration = 6000; // 6 segundos por diapositiva
  let autoplayTimer = null;
  let isPlaying = true;

  // Cambiar a diapositiva por índice
  function goToSlide(index) {
    // Normalizar índice
    if (index >= totalSlides) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = totalSlides - 1;
    } else {
      currentIndex = index;
    }

    // Actualizar clases de slides
    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Actualizar puntos indicadores
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }

  // Siguiente / Anterior
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    if (isPlaying) {
      autoplayTimer = setInterval(() => {
        nextSlide();
      }, slideDuration);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Alternar Pausa / Reanudar
  function togglePausePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      pausePlayBtn.classList.remove('is-paused');
      pausePlayBtn.setAttribute('aria-label', 'Pausar reproducción automática');
      startAutoplay();
    } else {
      pausePlayBtn.classList.add('is-paused');
      pausePlayBtn.setAttribute('aria-label', 'Reanudar reproducción automática');
      stopAutoplay();
    }
  }

  // Event Listeners de Botones
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      if (isPlaying) startAutoplay(); // Reiniciar cuenta regresiva al interactuar
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      if (isPlaying) startAutoplay();
    });
  }

  if (pausePlayBtn) {
    pausePlayBtn.addEventListener('click', togglePausePlay);
  }

  // Event Listeners de Puntos
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      if (isPlaying) startAutoplay();
    });
  });

  // Soporte para gestos táctiles (Swipe en móviles)
  let touchStartX = 0;
  let touchEndX = 0;

  if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Deslizó hacia la izquierda -> siguiente
      nextSlide();
      if (isPlaying) startAutoplay();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Deslizó hacia la derecha -> anterior
      prevSlide();
      if (isPlaying) startAutoplay();
    }
  }

  // Teclado accesible
  document.addEventListener('keydown', (e) => {
    // Solo si el hero está en el viewport
    const rect = carouselContainer.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (inViewport && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        if (isPlaying) startAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        if (isPlaying) startAutoplay();
      }
    }
  });

  // Iniciar carrusel
  goToSlide(0);
  startAutoplay();
}

/* ==========================================================================
   2. HEADER STICKY & SCROLL
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Chequeo inicial
}

/* ==========================================================================
   3. MENÚS DESPLEGABLES (DROPDOWNS)
   ========================================================================== */
function initDropdowns() {
  const dropdownWrappers = document.querySelectorAll('.has-dropdown');

  dropdownWrappers.forEach((wrapper) => {
    const trigger = wrapper.querySelector('.dropdown-trigger');
    const menu = wrapper.querySelector('.dropdown-menu');

    if (!trigger || !menu) return;

    // Abrir/Cerrar por click (especialmente útil en pantallas táctiles y teclado)
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = wrapper.classList.contains('dropdown-open');

      // Cerrar otros dropdowns abiertos
      dropdownWrappers.forEach((other) => {
        if (other !== wrapper) {
          other.classList.remove('dropdown-open');
          const otherTrigger = other.querySelector('.dropdown-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        wrapper.classList.remove('dropdown-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        wrapper.classList.add('dropdown-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    dropdownWrappers.forEach((wrapper) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('dropdown-open');
        const trigger = wrapper.querySelector('.dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownWrappers.forEach((wrapper) => {
        wrapper.classList.remove('dropdown-open');
        const trigger = wrapper.querySelector('.dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ==========================================================================
   4. MENÚ MÓVIL (HAMBURGUESA)
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      navMenu.classList.add('open');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
    }
  });

  // Cerrar menú móvil al hacer clic en un enlace regular
  const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-trigger)');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   5. SELECTOR DE IDIOMA
   ========================================================================== */
function initLanguageSelector() {
  const langSelector = document.getElementById('langSelector');
  if (!langSelector) return;

  const currentFlag = langSelector.querySelector('.current-flag');
  const currentLangCode = langSelector.querySelector('.current-lang-code');
  const langOptions = langSelector.querySelectorAll('.lang-option');

  langOptions.forEach((option) => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const code = option.getAttribute('data-lang');
      const flagSrc = option.querySelector('img').getAttribute('src');

      if (currentFlag) currentFlag.setAttribute('src', flagSrc);
      if (currentLangCode) currentLangCode.textContent = code.toUpperCase();

      langOptions.forEach((opt) => opt.classList.remove('active'));
      option.classList.add('active');

      langSelector.classList.remove('dropdown-open');
    });
  });
}

/* ==========================================================================
   6. BOTÓN VOLVER ARRIBA (SCROLL TO TOP)
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   7. SIMULADOR DE CRÉDITO INTERACTIVO
   ========================================================================== */
function initCreditSimulator() {
  const amountSlider = document.getElementById('simAmount');
  const termSlider = document.getElementById('simTerm');
  const amountDisplay = document.getElementById('amountDisplay');
  const termDisplay = document.getElementById('termDisplay');
  const monthlyPaymentDisplay = document.getElementById('monthlyPayment');
  const totalPaymentDisplay = document.getElementById('totalPayment');
  const interestDisplay = document.getElementById('interestPayment');

  if (!amountSlider || !termSlider) return;

  // Formato Moneda COP
  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val);
  };

  function updateSimulation() {
    const principal = parseFloat(amountSlider.value);
    const months = parseInt(termSlider.value, 10);
    const annualRate = 0.235; // Tasa efectiva anual ~23.5%
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

    // Cálculo cuota fija amortizada: C = P * (r / (1 - (1+r)^-n))
    const monthlyPayment = principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    if (amountDisplay) amountDisplay.textContent = formatCOP(principal);
    if (termDisplay) termDisplay.textContent = `${months} meses`;
    if (monthlyPaymentDisplay) monthlyPaymentDisplay.textContent = formatCOP(monthlyPayment);
    if (totalPaymentDisplay) totalPaymentDisplay.textContent = formatCOP(totalPayment);
    if (interestDisplay) interestDisplay.textContent = formatCOP(totalInterest);
  }

  amountSlider.addEventListener('input', updateSimulation);
  termSlider.addEventListener('input', updateSimulation);
  updateSimulation();
}

/* ==========================================================================
   8. ANIMACIONES AL SCROLL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.pasarela-floating-wrapper');
  if (!animatedElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }
}

/* ==========================================================================
   9. ACORDEÓN DE PREGUNTAS FRECUENTES (INTERACCIÓN EXCLUSIVA)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar cualquier otra pregunta abierta (acordeón exclusivo)
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Alternar estado de la pregunta seleccionada
      if (isExpanded) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Ajustar altura dinámica si cambia el tamaño de pantalla mientras está abierta una respuesta
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.faq-item.active');
    if (activeItem) {
      const activeAnswer = activeItem.querySelector('.faq-answer');
      if (activeAnswer) {
        activeAnswer.style.maxHeight = activeAnswer.scrollHeight + 'px';
      }
    }
  });
}
