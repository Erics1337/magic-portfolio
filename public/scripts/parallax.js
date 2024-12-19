'use strict';

(function() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  let ticking = false;
  const heroSection = document.querySelector('.hero-section');

  function updateParallax() {
    const scrolled = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // Update the scroll offset CSS variable
    document.documentElement.style.setProperty('--scroll-offset', `${scrolled}px`);
    
    // Calculate parallax effects based on viewport position
    if (heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      const heroVisible = heroRect.bottom > 0 && heroRect.top < viewportHeight;
      
      if (heroVisible) {
        const progress = (viewportHeight - heroRect.top) / (viewportHeight + heroRect.height);
        document.documentElement.style.setProperty('--hero-progress', progress);
      }
    }
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Initialize parallax
  function init() {
    // Add scroll listener with throttling
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    
    // Initial update
    requestTick();
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
