'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ScrollRevealSection.module.css';

interface AnimatedItemProps {
  children: React.ReactNode;
  animationType?: 'fadeIn' | 'slideInFromLeft' | 'slideInFromRight' | 'scaleUp' | 'flipInX' | 'zoomInAndRotate';
  className?: string;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, animationType = 'fadeIn', className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the item is visible
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  const animationClass = styles[animationType] || styles.fadeIn;

  return (
    <div
      ref={itemRef}
      className={`${styles.animatedItem} ${isVisible ? styles.visible : ''} ${animationClass} ${className || ''}`}
    >
      {children}
    </div>
  );
};

const ScrollRevealSection: React.FC = () => {
  return (
    <div className={styles.sectionContainer}>
      <h3 className={styles.sectionTitle}>Scroll Down to See Animations in Action!</h3>
      <AnimatedItem animationType="slideInFromLeft" className={styles.demoBox1}>
        <h4>Slide In From Left</h4>
        <p>This box slides in from the left when it enters the viewport. Uses Intersection Observer for performance.</p>
      </AnimatedItem>
      <AnimatedItem animationType="slideInFromRight" className={styles.demoBox2}>
        <h4>Slide In From Right</h4>
        <p>This one slides in from the right. Each item is observed independently.</p>
      </AnimatedItem>
      <AnimatedItem animationType="fadeIn" className={styles.demoBox3}>
        <h4>Fade In</h4>
        <p>A simple fade-in effect. Notice the slight delay for a staggered feel if elements are close.</p>
      </AnimatedItem>
      <AnimatedItem animationType="scaleUp" className={styles.demoBox4}>
        <h4>Scale Up (Bouncier!)</h4>
        <p>This box scales up with a more dynamic, bouncy feel. Check out the updated transition!</p>
      </AnimatedItem>
      <AnimatedItem animationType="flipInX" className={styles.demoBox1} >
        <h4>Flip In X-Axis</h4>
        <p>This element dramatically flips into view along the X-axis. Uses `perspective` for a 3D effect.</p>
      </AnimatedItem>
      <AnimatedItem animationType="zoomInAndRotate" className={styles.demoBox2}>
        <h4>Zoom In & Rotate</h4>
        <p>A more complex entrance: zooms in while rotating. Notice the custom easing function.</p>
      </AnimatedItem>
       <AnimatedItem animationType="slideInFromRight" className={`${styles.demoBox3} ${styles.tallBox}`}>
        <h4>Slide In (Tall & Enhanced)</h4>
        <p>This taller box now uses the enhanced slide-in effect, demonstrating it on larger content blocks.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </AnimatedItem>
    </div>
  );
};

export default ScrollRevealSection;
