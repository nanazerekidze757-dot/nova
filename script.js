/**
 * NEXUS Interactive Landing Page Script
 * Features:
 * - Dynamic Header backdrop on scroll
 * - Active section navigation spy
 * - Mobile drawer menu
 * - Animated stats counters on scroll (IntersectionObserver)
 * - Mouse-follower spotlight effect on feature cards
 * - Interactive mockup chart bars
 * - Contact form validation & feedback toast notification
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Active Nav Link on Scroll (Intersection Observer)
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // 4. Animated Stats Counter (About Section)
  const statCards = document.querySelectorAll('.stat-card');
  let animatedStats = false;

  const animateValue = (element, start, end, duration, isDecimal) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const current = start + easeOutQuad * (end - start);
      
      element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = isDecimal ? end.toFixed(1) : end;
      }
    };
    window.requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statCards.forEach(card => {
          const targetStr = card.getAttribute('data-counter-target');
          const counterEl = card.querySelector('.counter');
          if (!counterEl || !targetStr) return;

          const targetNum = parseFloat(targetStr);
          const isDecimal = targetStr.includes('.');
          animateValue(counterEl, 0, targetNum, 2000, isDecimal);
        });
      }
    });
  }, { threshold: 0.35 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    statsObserver.observe(aboutSection);
  }

  // 5. Mouse Spotlight Glow for Feature Cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 6. Interactive Hero Chart Mockup
  const chartBars = document.querySelectorAll('.chart-bar');
  chartBars.forEach(bar => {
    bar.addEventListener('mouseenter', () => {
      chartBars.forEach(b => b.classList.remove('active'));
      bar.classList.add('active');
    });
  });

  // 7. Contact Form Validation & Toast Notification
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotification');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      let isValid = true;

      // Name validation
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Message validation
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (!isValid) return;

      // Simulate API submit request
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      const btnArrow = submitBtn.querySelector('.btn-arrow');

      btnText.textContent = 'იგზავნება...';
      btnSpinner.style.display = 'inline-block';
      if (btnArrow) btnArrow.style.display = 'none';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Reset button
        btnText.textContent = 'გაგზავნა';
        btnSpinner.style.display = 'none';
        if (btnArrow) btnArrow.style.display = 'inline-block';
        submitBtn.disabled = false;

        // Reset form
        contactForm.reset();

        // Show Toast Notification
        showToast();
      }, 900);
    });

    // Remove error on input change
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group')?.classList.remove('has-error');
      });
    });
  }

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
});
