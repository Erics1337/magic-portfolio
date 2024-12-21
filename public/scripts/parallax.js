if (typeof window !== 'undefined') {
  let ticking = false;
  let lastScrollY = 0;
  const heroSection = document.querySelector('.hero-section');
  
  // Set up hardware acceleration
  if (heroSection) {
    heroSection.style.willChange = 'transform';
    heroSection.style.transformStyle = 'preserve-3d';
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function updateParallax() {
    const scrolled = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    if (heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      const heroVisible = heroRect.bottom > 0 && heroRect.top < viewportHeight;
      
      if (heroVisible) {
        // Smooth out the scroll value using linear interpolation
        lastScrollY = lerp(lastScrollY, scrolled, 0.1);
        
        // Use a smaller parallax factor for more subtle movement
        const translateY = lastScrollY * 0.15;
        
        // Use translate3d for hardware acceleration
        heroSection.style.transform = `translate3d(0, ${translateY}px, 0)`;
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

  // Handle both mouse wheel and touch events
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('touchmove', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });

  // Initial update
  updateParallax();
}
