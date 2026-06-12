document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.getElementById('navbar');
  const checkScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check on load

  // ==========================================
  // MOBILE NAVIGATION BAR MENU TOGGLE
  // ==========================================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const body = document.body;

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent scrolling when mobile menu is active
      if (navMenu.classList.contains('active')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== navToggle) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // MOUSE COORDINATE TRACKING FOR CARD GLOWS
  // ==========================================
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

  // ==========================================
  // INTERSECTION OBSERVER FOR SCROLL REVEALS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

  // ==========================================
  // STATISTICS COUNTER ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (elem) => {
    const target = parseFloat(elem.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      
      let currentValue = easeProgress * target;
      
      if (isDecimal) {
        elem.innerText = currentValue.toFixed(2);
      } else {
        elem.innerText = Math.floor(currentValue).toLocaleString();
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        // Guarantee precision at the end of animation
        if (isDecimal) {
          elem.innerText = target.toFixed(2);
        } else {
          elem.innerText = target.toLocaleString();
        }
        
        // Add optional indicator formatting
        if (elem.getAttribute('data-target') === '99.99') elem.innerText += '%';
        if (elem.getAttribute('data-target') === '75') elem.innerText += '%';
        if (elem.getAttribute('data-target') === '10') elem.innerText += 'M+';
        if (elem.getAttribute('data-target') === '15') elem.innerText += 'm';
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(num => {
    statsObserver.observe(num);
  });

  // ==========================================
  // DYNAMIC HERO DASHBOARD SIMULATION
  // ==========================================
  const statCpu = document.getElementById('stat-cpu');
  const statSavings = document.getElementById('stat-savings');
  const pipelineCurrent = document.getElementById('pipeline-current');
  const chartBars = document.querySelectorAll('#chart-bars .bar');

  // Fluctuating CPU and Savings Metrics
  if (statCpu && statSavings) {
    setInterval(() => {
      // CPU fluctuations between 35% and 55%
      const baseCpu = 42.8;
      const fluxCpu = (baseCpu + (Math.random() * 10 - 5)).toFixed(1);
      statCpu.textContent = `${fluxCpu}%`;

      // Monthly savings slowly increments up
      let currentSavingsText = statSavings.textContent.replace('$', '').replace(',', '');
      let currentSavings = parseFloat(currentSavingsText);
      currentSavings += (Math.random() * 1.5);
      statSavings.textContent = `$${currentSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, 3000);
  }

  // Active chart bars updates
  if (chartBars.length > 0) {
    setInterval(() => {
      // Pick 3 random bars to dynamically fluctuate
      for (let i = 0; i < 3; i++) {
        const randIndex = Math.floor(Math.random() * chartBars.length);
        const newHeight = Math.floor(Math.random() * 60 + 30); // 30% to 90%
        chartBars[randIndex].style.height = `${newHeight}%`;
      }
    }, 1500);
  }

  // Pipeline Flow steps simulation loop
  const pipelineSteps = [
    '⚡ AI Code Optimization',
    '⚙ Build Target [Prod]',
    '⚡ Canary Routing (10%)',
    '✓ Deployment Completed',
    '⚙ Warm-up Core Caches',
    '⚡ Latency Profiling',
    '✓ Fetching Commit'
  ];
  let stepIndex = 0;

  if (pipelineCurrent) {
    setInterval(() => {
      stepIndex = (stepIndex + 1) % pipelineSteps.length;
      pipelineCurrent.textContent = pipelineSteps[stepIndex];
      
      // Change styling colors briefly to show state update
      if (pipelineCurrent.textContent.startsWith('✓')) {
        pipelineCurrent.style.color = 'var(--secondary)';
        pipelineCurrent.style.borderColor = 'rgba(6, 182, 212, 0.4)';
      } else if (pipelineCurrent.textContent.startsWith('⚙')) {
        pipelineCurrent.style.color = 'var(--text-secondary)';
        pipelineCurrent.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      } else {
        pipelineCurrent.style.color = 'var(--accent)';
        pipelineCurrent.style.borderColor = 'rgba(217, 70, 239, 0.4)';
      }
    }, 4000);
  }

  // ==========================================
  // CONTACT FORM VALIDATION & HANDLING
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      // Simple validation checks
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Mock submitting phase
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing request...';
      formStatus.style.display = 'none';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        showStatus('Thank you! Your demo request has been received. Our team will contact you shortly.', 'success');
        contactForm.reset();
      }, 1500);
    });
  }

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = 'form-status'; // Reset classes
    formStatus.classList.add(type);
    formStatus.style.display = 'block';
  }
});
