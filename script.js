// script.js - Performance Optimized

// ====== PERFORMANCE UTILITIES ======
// Throttle function to limit event handler calls
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// RequestAnimationFrame throttle for smooth animations
function rafThrottle(func) {
  let ticking = false;
  return function (...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// ====== THEME TOGGLE ======
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme preference or default to 'light'
let currentTheme = 'light';

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
  body.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
});

// Theme toggle functionality
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

// ====== OPTIMIZED SCROLL HANDLERS ======
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const revealElements = document.querySelectorAll('.scroll-reveal');

// Single optimized scroll handler
const handleScroll = rafThrottle(() => {
  const scrollY = window.scrollY;
  const innerHeight = window.innerHeight;
  const triggerBottom = innerHeight * 0.85;

  // Scroll spy for navigation
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop - 100 && scrollY < sectionTop + sectionHeight - 100) {
      currentSection = section.getAttribute('id');
    }
  });

  // Update active nav link
  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active-link');
    }
  });

  // Scroll reveal elements
  revealElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add('visible');
    }
  });
});

// Add single scroll listener
window.addEventListener('scroll', handleScroll, { passive: true });

// ====== MOBILE NAVIGATION ======
function toggleMenu() {
  const nav = document.getElementById('nav-menu');
  nav.classList.toggle('hidden');
}
window.toggleMenu = toggleMenu;

// ====== OPTIMIZED SCROLL-BASED MARQUEE ANIMATION ======
(() => {
  let lastScrollY = window.scrollY;
  let offset = 0;
  let speed = 0.3;
  let targetSpeed = 0.3;
  let lastScrollDirection = 1;
  let currentDirection = 1;
  let rotationAngle = 0;
  let scrollTimeout = null;
  let animationId = null;
  let isScrolling = false;

  const SCROLL_SPEED = 1.2;
  const AUTO_SPEED = 0.8;
  const MIN_SPEED = 0.2;
  const EASING = 0.08;
  const ROTATION_SPEED = 1.5;

  let marquee, separators, marqueeWidth;

  function initMarquee() {
    marquee = document.querySelector('.marquee-content');
    separators = document.querySelectorAll('.separator');
    
    if (marquee) {
      // Get the actual content width for seamless looping
      marqueeWidth = marquee.scrollWidth / 2; // Divide by 2 since content is duplicated
    }
  }

  function applyTransform() {
    if (!marquee || !marqueeWidth) return;
    
    // Create seamless infinite loop by using modulo
    let finalOffset = offset % marqueeWidth;
    
    // Ensure the offset is always within one cycle for smooth transitions
    if (finalOffset > 0) {
      finalOffset = finalOffset - marqueeWidth;
    }
    
    marquee.style.transform = `translateX(${finalOffset}px)`;

    if (separators) {
      separators.forEach(sep => {
        sep.style.transform = `rotate(${rotationAngle}deg)`;
      });
    }
  }

  // Optimized scroll handler for marquee
  const handleMarqueeScroll = rafThrottle(() => {
    const scrollY = window.scrollY;
    isScrolling = true;

    if (scrollTimeout) clearTimeout(scrollTimeout);

    // Determine scroll direction
    if (scrollY > lastScrollY) {
      // Scrolling down - marquee moves LEFT (negative direction)
      lastScrollDirection = -1;
      currentDirection = -1;
    } else if (scrollY < lastScrollY) {
      // Scrolling up - marquee moves RIGHT (positive direction)
      lastScrollDirection = 1;
      currentDirection = 1;
    }

    targetSpeed = SCROLL_SPEED;
    lastScrollY = scrollY;

    // Switch to auto-loop mode when scroll stops
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      targetSpeed = AUTO_SPEED;
      currentDirection = lastScrollDirection;
    }, 150);
  });

  function animate() {
    // Smooth speed transition
    speed += (targetSpeed - speed) * EASING;
    if (Math.abs(speed) < MIN_SPEED) {
      speed = MIN_SPEED * Math.sign(targetSpeed || 1);
    }

    // Update offset - infinite movement in both directions
    offset += speed * currentDirection;

    // Update rotation
    rotationAngle += ROTATION_SPEED * currentDirection;
    if (rotationAngle >= 360) rotationAngle -= 360;
    if (rotationAngle < 0) rotationAngle += 360;

    applyTransform();
    animationId = requestAnimationFrame(animate);
  }

  // Initialize on load
  window.addEventListener('load', () => {
    initMarquee();
    if (marquee) {
      applyTransform();
      animate();
    }
  });

  // Add scroll listener for marquee
  window.addEventListener('scroll', handleMarqueeScroll, { passive: true });

  // Pause animation when not visible (performance optimization)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationId) cancelAnimationFrame(animationId);
    } else if (marquee) {
      animate();
    }
  });

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
})();

// ====== PROFILE PICTURE INTERACTIONS ======
document.addEventListener('DOMContentLoaded', () => {
  const profilePicWrapper = document.querySelector('.profile-pic-wrapper');
  const profilePic = document.querySelector('.profile-pic');
  
  if (profilePicWrapper && profilePic) {
    // Optimized click interaction
    profilePicWrapper.addEventListener('click', () => {
      profilePic.style.transform = 'scale(1.2) rotate(360deg)';
      
      setTimeout(() => {
        profilePic.style.transform = '';
      }, 600);
    });

    // Throttled mouse move for parallax effect
    const handleMouseMove = throttle((e) => {
      const rect = profilePicWrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / rect.height) * 10;
      const rotateY = (mouseX / rect.width) * -10;
      
      profilePic.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }, 16); // ~60fps

    profilePicWrapper.addEventListener('mousemove', handleMouseMove);
    
    // Reset on mouse leave
    profilePicWrapper.addEventListener('mouseleave', () => {
      profilePic.style.transform = '';
    });
  }
});

// ====== INTERSECTION OBSERVER FOR BETTER PERFORMANCE ======
if ('IntersectionObserver' in window) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all scroll-reveal elements
  revealElements.forEach(el => observer.observe(el));
}

// ====== OPTIMIZED RIPPLE EFFECTS ======
document.addEventListener('DOMContentLoaded', () => {
  const addRippleEffect = (button) => {
    button.addEventListener('click', function(e) {
      // Remove existing ripples to prevent accumulation
      const existingRipples = this.querySelectorAll('.ripple');
      existingRipples.forEach(ripple => ripple.remove());
      
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;
      ripple.classList.add('ripple');

      this.appendChild(ripple);

      // Clean up after animation
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove();
        }
      }, 600);
    });
  };

  document.querySelectorAll('.btn, .project-link, .social-btn, .contact-form button').forEach(addRippleEffect);
});

// ====== OPTIMIZED CONTACT FORM ======
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const submitBtn = document.getElementById('send-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Optimized validation
      const fields = form.querySelectorAll('input[required], textarea[required]');
      let hasError = false;
      
      for (const field of fields) {
        if (!field.value.trim()) {
          field.classList.add('shake');
          hasError = true;
          // Remove shake class after animation
          setTimeout(() => field.classList.remove('shake'), 400);
        }
      }
      
      if (hasError) return;

      // Start loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      const formData = new FormData(form);
      
      try {
        await fetch('https://formsubmit.co/ajax/amalkphilip2005@gmail.com', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        // Success state
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        form.reset();

        // Show toast
        setTimeout(() => {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 4000);
        }, 250);

        // Reset button after delay
        setTimeout(() => {
          submitBtn.classList.remove('success');
          submitBtn.disabled = false;
        }, 2600);

      } catch (err) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        alert('⚠️ Something went wrong. Try again later.');
      }
    });
  }
});

// ====== INITIAL SETUP ON LOAD ======
window.addEventListener('load', () => {
  // Trigger initial scroll reveal check
  handleScroll();
  
  // Initialize any elements that need setup
  document.body.style.visibility = 'visible';
});

// ====== CLEANUP AND MEMORY MANAGEMENT ======
window.addEventListener('beforeunload', () => {
  // Cancel any running animations
  if (typeof animationId !== 'undefined') {
    cancelAnimationFrame(animationId);
  }
});