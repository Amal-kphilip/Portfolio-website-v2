// script.js

// 🌙 Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check for saved theme preference or default to 'light'
let currentTheme = 'light';
try {
  currentTheme = localStorage.getItem('theme') || 'light';
} catch (e) {
  currentTheme = 'light';
}
body.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }
}

// Initialize icon
updateThemeIcon(currentTheme);

// Theme toggle functionality
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      // Handle localStorage not available
    }
    updateThemeIcon(newTheme);
  });
}

// 🔍 Scroll Spy
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active-link');
    }
  });
}, { passive: true });

// ✨ Scroll Reveal
const revealElements = document.querySelectorAll('.scroll-reveal');
const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  revealElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
};
window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);

// 📱 Mobile Nav Toggle
function toggleMenu() {
  const nav = document.getElementById('nav-menu');
  nav.classList.toggle('hidden');
}
window.toggleMenu = toggleMenu;

// ✨ Button Hover Effects (Ripple)
document.addEventListener('DOMContentLoaded', () => {
  const addRippleEffect = (button) => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  };

  document.querySelectorAll('.btn, .project-link, .social-btn, .contact-form button').forEach(addRippleEffect);
});

// 📬 Contact Form Handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const submitBtn = document.getElementById('send-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation + shake on empty
      const fields = form.querySelectorAll('input[required], textarea[required]');
      let hasError = false;
      fields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('shake');
          hasError = true;
          setTimeout(() => field.classList.remove('shake'), 400);
        }
      });
      if (hasError) return;

      // Start loading animation
      submitBtn.classList.add('loading');

      const formData = new FormData(form);
      try {
        await fetch('https://formsubmit.co/ajax/amalkphilip2005@gmail.com', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        // Success morph
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');

        form.reset();

        // Toast
        setTimeout(() => {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 4000);
        }, 250);

        // Reset button visual after a moment
        setTimeout(() => {
          submitBtn.classList.remove('success');
        }, 2600);

      } catch (err) {
        submitBtn.classList.remove('loading');
        alert('⚠️ Something went wrong. Try again later.');
      }
    });
  }
});

// 🌀 Enhanced Marquee Animation with Profile Picture Interaction
(() => {
  let lastScrollY = window.scrollY;
  let offset = 0;
  let speed = 0.3;
  let targetSpeed = 0.3;
  let lastScrollDirection = 1;
  let currentDirection = 1;
  let rotationAngle = 0;
  let scrollTimeout = null;

  const SCROLL_SPEED = 1;
  const AUTO_SPEED = 0.5;
  const MIN_SPEED = 0.2;
  const EASING = 0.08;
  const ROTATION_SPEED = 1.5;
  const MAX_OFFSET = 150;

  let marquee, separators;

  function measure() {
    marquee = document.querySelector('.marquee-content');
    separators = document.querySelectorAll('.separator');
  }

  function constrainOffset(val) {
    return Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, val));
  }

  function applyTransform() {
    if (!marquee) return;
    const constrainedOffset = constrainOffset(offset);
    marquee.style.transform = `translateX(${constrainedOffset}px)`;

    if (separators) {
      separators.forEach(sep => {
        sep.style.transform = `rotate(${rotationAngle}deg)`;
      });
    }
  }

  function onScroll() {
    const y = window.scrollY;

    if (scrollTimeout) clearTimeout(scrollTimeout);

    if (y > lastScrollY) {
      lastScrollDirection = 1;
      currentDirection = 1;
    } else if (y < lastScrollY) {
      lastScrollDirection = -1;
      currentDirection = -1;
    }

    targetSpeed = SCROLL_SPEED;
    lastScrollY = y;

    scrollTimeout = setTimeout(() => {
      targetSpeed = AUTO_SPEED;
      currentDirection = lastScrollDirection;
    }, 150);
  }

  function animate() {
    speed += (targetSpeed - speed) * EASING;
    if (Math.abs(speed) < MIN_SPEED) {
      speed = MIN_SPEED * Math.sign(targetSpeed || 1);
    }
    offset += speed * currentDirection;

    const constrainedOffset = constrainOffset(offset);
    if (offset !== constrainedOffset) {
      currentDirection *= -1;
      offset = constrainedOffset;
    }

    rotationAngle += ROTATION_SPEED;
    if (rotationAngle >= 360) rotationAngle -= 360;

    applyTransform();
    requestAnimationFrame(animate);
  }

  window.addEventListener('load', () => {
    measure();
    applyTransform();
    animate();
  });
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// 🖼️ Enhanced Profile Picture Interactions
document.addEventListener('DOMContentLoaded', () => {
  const profilePicWrapper = document.querySelector('.profile-pic-wrapper');
  const profilePic = document.querySelector('.profile-pic');
  
  if (profilePicWrapper && profilePic) {
    // Add click interaction for fun effect
    profilePicWrapper.addEventListener('click', () => {
      profilePicWrapper.style.animation = 'none';
      profilePic.style.transform = 'scale(1.2) rotate(360deg)';
      
      setTimeout(() => {
        profilePic.style.transform = '';
        profilePicWrapper.style.animation = 'float 6s ease-in-out infinite';
      }, 600);
    });

    // Add mouse move parallax effect
    profilePicWrapper.addEventListener('mousemove', (e) => {
      const rect = profilePicWrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / rect.height) * 10;
      const rotateY = (mouseX / rect.width) * -10;
      
      profilePic.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    // Reset on mouse leave
    profilePicWrapper.addEventListener('mouseleave', () => {
      profilePic.style.transform = '';
    });
  }
});

// 🎯 Enhanced Scroll Performance
let ticking = false;

function updateScrollEffects() {
  revealOnScroll();
  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

// Replace the existing scroll listener for reveal
window.removeEventListener('scroll', revealOnScroll);
window.addEventListener('scroll', requestScrollUpdate, { passive: true });

// 🌟 Add some extra interactive elements
document.addEventListener('DOMContentLoaded', () => {
  // Add subtle parallax to hero section
  const heroSection = document.querySelector('.home-section');
  
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      
      if (scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${rate}px)`;
      }
    }, { passive: true });
  }

  // Add intersection observer for better performance
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
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });
  }
});