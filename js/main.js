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
  const carouselContainer = document.querySelector('.carousel-container');
  if (!carouselContainer) return;

  const slides = carouselContainer.querySelectorAll('.carousel-slide');
  if (!slides.length) return;

  const dotsContainer = carouselContainer.querySelector('.carousel-dots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const pausePlayBtn = document.getElementById('pausePlayBtn');

  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideDuration = 6000; // 6 segundos por diapositiva
  let autoplayTimer = null;
  let isPlaying = true;

  // Sincronizar dinámicamente los puntos indicadores (dots) con el total de diapositivas
  if (dotsContainer) {
    const existingDots = dotsContainer.querySelectorAll('.dot');
    if (existingDots.length !== totalSlides) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', i.toString());
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
        dotsContainer.appendChild(dot);
      }
    }
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

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

  const trigger = langSelector.querySelector('.dropdown-trigger');
  const currentFlag = langSelector.querySelector('.current-flag');
  const currentLangCode = langSelector.querySelector('.current-lang-code');
  const langOptions = langSelector.querySelectorAll('.lang-option');

  // Mapeo de información y banderas de idioma
  const languageData = {
    es: {
      code: 'ES',
      name: 'Español',
      flag: 'assets/img/svg/icon_bandera_col.svg',
      alt: 'Colombia'
    },
    en: {
      code: 'EN',
      name: 'English',
      flag: 'assets/img/svg/icon_bandera_usa.svg',
      alt: 'USA'
    }
  };

  langOptions.forEach((option) => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const langCode = (option.getAttribute('data-lang') || 'es').toLowerCase();
      const data = languageData[langCode];

      if (data) {
        if (currentFlag) {
          currentFlag.setAttribute('src', data.flag);
          currentFlag.setAttribute('alt', data.alt);
        }
        if (currentLangCode) {
          currentLangCode.textContent = data.code;
        }
      } else {
        const flagImg = option.querySelector('img');
        if (currentFlag && flagImg) {
          currentFlag.setAttribute('src', flagImg.getAttribute('src'));
          currentFlag.setAttribute('alt', flagImg.getAttribute('alt'));
        }
        if (currentLangCode) {
          currentLangCode.textContent = langCode.toUpperCase();
        }
      }

      // Actualizar opción activa
      langOptions.forEach((opt) => {
        const isCurrent = opt === option;
        opt.classList.toggle('active', isCurrent);
        opt.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      // Cerrar menú desplegable y actualizar aria-expanded
      langSelector.classList.remove('dropdown-open');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }

      // Dejar lista la estructura para alternar el idioma del sitio
      setSiteLanguage(langCode);
    });
  });
}

/**
 * Función base para alternar el idioma del sitio
 */
function setSiteLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  window.currentLanguage = lang;
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
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
  const transactionTypeSelect = document.getElementById('simTransactionType');
  const amountSlider = document.getElementById('simAmount');
  const termSlider = document.getElementById('simTerm');
  const amountDisplay = document.getElementById('amountDisplay');
  const termDisplay = document.getElementById('termDisplay');
  const btnCalcular = document.getElementById('btnCalcularCredito');
  const btnToggleAmort = document.getElementById('btnToggleAmortization');
  const amortTableBody = document.getElementById('amortTableBody');
  const amortBadgeText = document.getElementById('amortBadgeText');
  const detailedResultsContainer = document.getElementById('simulador-resultados-detalle');

  // Elementos de las 7 Tarjetas de Resumen
  const cardMonthlyPayment = document.getElementById('cardMonthlyPayment');
  const cardTotalPayment = document.getElementById('cardTotalPayment');
  const cardTotalInterest = document.getElementById('cardTotalInterest');
  const cardTotalInsurance = document.getElementById('cardTotalInsurance');
  const cardAtmCommission = document.getElementById('cardAtmCommission');
  const cardAnnualRate = document.getElementById('cardAnnualRate');
  const cardHandlingFee = document.getElementById('cardHandlingFee');
  const cardMonthlyRateText = document.getElementById('cardMonthlyRateText');

  if (!amountSlider || !termSlider) return;

  let isAmortizationExpanded = false;

  // Formato Moneda COP sin decimales
  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  // Cálculo y actualización de la barra de progreso rellena en color turquesa
  const updateSliderProgress = (slider) => {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #00E5B0 0%, #00E5B0 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  };

  function updateSimulation() {
    const transactionType = transactionTypeSelect && transactionTypeSelect.value ? transactionTypeSelect.value : 'Compra Nacional';
    const principal = parseFloat(amountSlider.value);
    const months = parseInt(termSlider.value, 10);

    // Actualiza barra de progreso turquesa
    updateSliderProgress(amountSlider);
    updateSliderProgress(termSlider);

    // Actualiza badges de los sliders
    if (amountDisplay) amountDisplay.textContent = formatCOP(principal);
    if (termDisplay) termDisplay.textContent = `${months} ${months === 1 ? 'mes' : 'meses'}`;

    // Parámetros financieros exactos (según referencia image_69d72a.png)
    // Tasa Efectiva Anual (E.A.): 19.99%
    const annualRate = 0.1999;
    // Tasa mensual equivalente mes vencido: TEM = (1 + EA)^(1/12) - 1
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

    // Cuota fija de amortización (capital + interés)
    let cuotaAmort = 0;
    if (months === 1) {
      cuotaAmort = principal * (1 + monthlyRate);
    } else {
      cuotaAmort = principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));
    }

    // Seguro de vida deudor mensual: $780 por cada millón de pesos (monto * 0.00078)
    const monthlyInsurance = principal * 0.00078;
    const totalInsurance = monthlyInsurance * months;

    // Cuota mensual total (Cuota fija amortización + Seguro mensual)
    const monthlyPaymentTotal = cuotaAmort + monthlyInsurance;

    // Cuota de manejo y comisión cajero
    const handlingFee = 0;
    const atmCommission = 0;

    // Generar tabla de amortización y calcular intereses acumulados exactos
    let currentBalance = principal;
    let totalInterestAccum = 0;
    const rowsData = [];

    for (let k = 1; k <= months; k++) {
      const interestMonth = currentBalance * monthlyRate;
      let capitalAmortMonth = cuotaAmort - interestMonth;

      // En la última cuota o si el residuo es mínimo, ajustar para dejar saldo 0 exacto
      if (k === months || currentBalance - capitalAmortMonth < 1) {
        capitalAmortMonth = currentBalance;
      }

      currentBalance = Math.max(0, currentBalance - capitalAmortMonth);
      totalInterestAccum += interestMonth;

      rowsData.push({
        quotaNum: k,
        quotaValue: monthlyPaymentTotal,
        interest: interestMonth,
        capitalAmort: capitalAmortMonth,
        handlingFee: handlingFee,
        insurance: monthlyInsurance,
        balance: currentBalance
      });
    }

    // Total a pagar acumulado
    const totalToPay = principal + totalInterestAccum + totalInsurance;

    // Actualizar las 7 tarjetas de resumen financiero
    if (cardMonthlyPayment) cardMonthlyPayment.textContent = formatCOP(monthlyPaymentTotal);
    if (cardTotalPayment) cardTotalPayment.textContent = formatCOP(totalToPay);
    if (cardTotalInterest) cardTotalInterest.textContent = formatCOP(totalInterestAccum);
    if (cardTotalInsurance) cardTotalInsurance.textContent = formatCOP(totalInsurance);
    if (cardAtmCommission) cardAtmCommission.textContent = formatCOP(atmCommission);
    if (cardAnnualRate) cardAnnualRate.textContent = `${(annualRate * 100).toFixed(2)}% EA`;
    if (cardHandlingFee) cardHandlingFee.textContent = formatCOP(handlingFee);
    if (cardMonthlyRateText) cardMonthlyRateText.textContent = `TEM ${(monthlyRate * 100).toFixed(2)}% M.V.`;

    // Actualizar badge de cuotas proyectadas
    if (amortBadgeText) {
      amortBadgeText.textContent = `${months} ${months === 1 ? 'Cuota proyectada' : 'Cuotas proyectadas'}`;
    }

    // Renderizar filas de la tabla de amortización
    renderAmortizationTable(rowsData);
  }

  function renderAmortizationTable(rows) {
    if (!amortTableBody) return;

    let html = '';
    const totalRows = rows.length;

    rows.forEach((r, idx) => {
      const isHidden = !isAmortizationExpanded && idx >= 10;
      const rowClass = isHidden ? 'sim-amort-row sim-row-hidden' : 'sim-amort-row';

      html += `
        <tr class="${rowClass}">
          <td style="text-align:center; font-weight:700; color:#14387F;">${r.quotaNum}</td>
          <td style="font-weight:700; color:#14387F;">${formatCOP(r.quotaValue)}</td>
          <td>${formatCOP(r.interest)}</td>
          <td style="font-weight:600; color:#222222;">${formatCOP(r.capitalAmort)}</td>
          <td>${formatCOP(r.handlingFee)}</td>
          <td>${formatCOP(r.insurance)}</td>
          <td style="font-weight:700; color:#14387F;">${formatCOP(r.balance)}</td>
        </tr>
      `;
    });

    amortTableBody.innerHTML = html;

    // Control de visibilidad y texto del botón Mostrar Más / Menos
    if (btnToggleAmort) {
      if (totalRows <= 10) {
        btnToggleAmort.style.display = 'none';
      } else {
        btnToggleAmort.style.display = 'inline-flex';
        const spanText = btnToggleAmort.querySelector('span:first-child');
        const arrow = btnToggleAmort.querySelector('.toggle-arrow');
        if (isAmortizationExpanded) {
          if (spanText) spanText.textContent = 'Mostrar menos cuotas';
          if (arrow) arrow.textContent = '↑';
          btnToggleAmort.setAttribute('aria-expanded', 'true');
        } else {
          if (spanText) spanText.textContent = `Mostrar todas las cuotas (${totalRows})`;
          if (arrow) arrow.textContent = '↓';
          btnToggleAmort.setAttribute('aria-expanded', 'false');
        }
      }
    }
  }

  // Toggle de filas en la tabla de amortización
  if (btnToggleAmort) {
    btnToggleAmort.addEventListener('click', () => {
      isAmortizationExpanded = !isAmortizationExpanded;
      const rows = amortTableBody.querySelectorAll('.sim-amort-row');
      rows.forEach((row, idx) => {
        if (idx >= 10) {
          if (isAmortizationExpanded) {
            row.classList.remove('sim-row-hidden');
          } else {
            row.classList.add('sim-row-hidden');
          }
        }
      });

      const totalRows = rows.length;
      const spanText = btnToggleAmort.querySelector('span:first-child');
      const arrow = btnToggleAmort.querySelector('.toggle-arrow');
      if (isAmortizationExpanded) {
        if (spanText) spanText.textContent = 'Mostrar menos cuotas';
        if (arrow) arrow.textContent = '↑';
        btnToggleAmort.setAttribute('aria-expanded', 'true');
      } else {
        if (spanText) spanText.textContent = `Mostrar todas las cuotas (${totalRows})`;
        if (arrow) arrow.textContent = '↓';
        btnToggleAmort.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Botón Calcular Crédito: Realiza cálculo, despliega el contenedor con animación y realiza scroll suave
  if (btnCalcular) {
    btnCalcular.addEventListener('click', () => {
      updateSimulation();

      if (detailedResultsContainer) {
        const wasHidden = !detailedResultsContainer.classList.contains('is-visible');
        detailedResultsContainer.classList.add('is-visible');

        // Desplazamiento suave para visualizar cómodamente las tarjetas y tabla
        setTimeout(() => {
          detailedResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, wasHidden ? 50 : 0);
      }
    });
  }

  amountSlider.addEventListener('input', updateSimulation);
  termSlider.addEventListener('input', updateSimulation);

  // Conexión y control visual para el selector de tipo de transacción
  if (transactionTypeSelect) {
    transactionTypeSelect.addEventListener('change', () => {
      if (transactionTypeSelect.value) {
        transactionTypeSelect.classList.add('has-value');
      } else {
        transactionTypeSelect.classList.remove('has-value');
      }
      updateSimulation();
    });

    const selectWrapper = transactionTypeSelect.closest('.sim-select-wrapper');
    if (selectWrapper) {
      transactionTypeSelect.addEventListener('focus', () => selectWrapper.classList.add('is-focused'));
      transactionTypeSelect.addEventListener('blur', () => selectWrapper.classList.remove('is-focused', 'is-open'));
      transactionTypeSelect.addEventListener('click', () => selectWrapper.classList.toggle('is-open'));
    }
  }

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
