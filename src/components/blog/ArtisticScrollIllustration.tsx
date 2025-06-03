'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './ArtisticScrollIllustration.module.css';

const interpolate = (value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number): number => {
  // Clamp value to input range
  const clampedValue = Math.max(inputMin, Math.min(value, inputMax));
  return outputMin + (outputMax - outputMin) * (clampedValue - inputMin) / (inputMax - inputMin);
};

interface AnimatedLayerProps extends LayerConfig {
  scrollProgress: number;
  containerWidth: number;
  containerHeight: number;
  revealStart: number;
  revealMid: number;
  revealFull: number;
  holdEnd: number;
}

interface LayerConfig {
  id: string;
  type: 'bgLayer' | 'productIconPlaceholder' | 'star' | 'galaxyCluster' | 'starburst';
  variant?: number; // For stars: size/twinkle. For galaxy: appearance
  // For stars, we'll use useMemo to generate random positions based on id/variant
  initialX?: number; // Percentage based, e.g., Math.random() * 100
  initialY?: number; // Percentage based
}

const AnimatedLayer: React.FC<AnimatedLayerProps> = React.memo(({
  scrollProgress,
  id,
  type,
  variant = 1,
  containerWidth = 0,
  containerHeight = 0,
  revealStart, // Now passed as props
  revealMid,   // Now passed as props
  revealFull,  // Now passed as props
  holdEnd      // Now passed as props
}) => {
  let style: React.CSSProperties = {};
  let content: React.ReactNode = null;

  const layerConfig = layersConfig.find(lc => lc.id === id);
  const initialX = layerConfig?.initialX ?? 50;
  const initialY = layerConfig?.initialY ?? 50;

  switch (type) {
    case 'bgLayer':
      // variant 1: Deep space, variant 2: Softer overlay/nebula hint
      const bgOpacity = variant === 1 ? interpolate(scrollProgress, 0, holdEnd, 0.7, 1) : interpolate(scrollProgress, 0, holdEnd, 0.2, 0.5);
      const bgScale = variant === 1 ? 1 : interpolate(scrollProgress, 0, holdEnd, 1, 1.2);
      const bgTranslateY = variant === 1 ? interpolate(scrollProgress, 0, holdEnd, 20, -20) : interpolate(scrollProgress, 0, holdEnd, 40, -10);
      style = {
        opacity: bgOpacity,
        transform: `translateY(${bgTranslateY}px) scale(${bgScale})`,
        zIndex: 0,
      };
      break;

    case 'productIconPlaceholder': 
      const iconMinScale = 0.1; // Start even smaller, shrink more at the end
      const iconBaseScale = 1.1; // Grow slightly larger at peak
      const initialRotation = 0;
      const peakRevealRotation = 15; // Rotate to 15deg during reveal
      const holdRotation = 0; // Hold at 0deg (straight)
      const endRotation = -15; // Rotate to -15deg during fade

      const iconRevealStart = 0.05;
      const iconFullyRevealed = 0.30;
      const iconHoldVisibleEnd = 0.65; // Icon stays at peak until this point
      const iconFadeEnd = 0.95;       // Icon fully faded out

      let iconOpacity = 0;
      let currentIconScale = iconMinScale;
      let currentIconRotation = initialRotation;
      let pulseOpacity = 0;

      if (scrollProgress <= iconRevealStart) {
        iconOpacity = 0;
        currentIconScale = iconMinScale;
        currentIconRotation = initialRotation;
        pulseOpacity = 0;
      } else if (scrollProgress <= iconFullyRevealed) {
        // Appearing and growing
        iconOpacity = interpolate(scrollProgress, iconRevealStart, iconFullyRevealed, 0, 1);
        currentIconScale = interpolate(scrollProgress, iconRevealStart, iconFullyRevealed, iconMinScale, iconBaseScale);
        currentIconRotation = interpolate(scrollProgress, iconRevealStart, iconFullyRevealed, initialRotation, peakRevealRotation);
        pulseOpacity = iconOpacity;
      } else if (scrollProgress <= iconHoldVisibleEnd) {
        // Holding visible: scale is base, rotation is holdRotation (straight)
        iconOpacity = 1;
        currentIconScale = iconBaseScale;
        // Interpolate rotation from peakRevealRotation to holdRotation during the first part of hold period
        const holdRotationStartTime = iconFullyRevealed;
        const holdRotationEndTime = iconFullyRevealed + (iconHoldVisibleEnd - iconFullyRevealed) * 0.25; // Rotate to straight in first 25% of hold time
        if (scrollProgress <= holdRotationEndTime) {
          currentIconRotation = interpolate(scrollProgress, holdRotationStartTime, holdRotationEndTime, peakRevealRotation, holdRotation);
        } else {
          currentIconRotation = holdRotation; // Hold straight
        }
        pulseOpacity = 1;
      } else if (scrollProgress <= iconFadeEnd) {
        // Fading and shrinking (receding)
        iconOpacity = interpolate(scrollProgress, iconHoldVisibleEnd, iconFadeEnd, 1, 0);
        currentIconScale = interpolate(scrollProgress, iconHoldVisibleEnd, iconFadeEnd, iconBaseScale, iconMinScale);
        currentIconRotation = interpolate(scrollProgress, iconHoldVisibleEnd, iconFadeEnd, holdRotation, endRotation);
        pulseOpacity = iconOpacity;
      } else {
        // Fully disappeared
        iconOpacity = 0;
        currentIconScale = iconMinScale;
        currentIconRotation = initialRotation;
        pulseOpacity = 0;
      }

      style = {
        opacity: iconOpacity,
        transform: `scale(${currentIconScale}) rotate(${currentIconRotation}deg)`,
        transformOrigin: 'center center',
      };
      content = (
        <div className={styles.productIconCore} style={{ opacity: iconOpacity }}>
          <Image src="/images/blog/logo-square.png" alt="Celestial Logo" width={85} height={85} style={{ objectFit: 'contain' }} />
          <div className={styles.productIconPulseGlow} style={{ opacity: pulseOpacity }} />
        </div>
      );
      break;

    case 'star':
      let starOpacity, starScale;
      const starSize = (variant || 1) * 1.5; // variant affects base size, ensure variant is defined
      const appearStartOffset = (initialX % 0.2); // Stagger appearance based on x pos
      const starRevealStart = Math.max(0, revealStart - 0.1 + appearStartOffset);
      const starRevealMid = revealMid + (initialY % 0.1) - 0.05; // Stagger peak time

      if (scrollProgress <= starRevealMid) {
        starOpacity = interpolate(scrollProgress, starRevealStart, starRevealMid, 0, 0.4 + (variant || 1) * 0.15); // Max opacity based on variant
        starScale = interpolate(scrollProgress, starRevealStart, starRevealMid, 0, 1);
      } else {
        starOpacity = interpolate(scrollProgress, starRevealMid, holdEnd, 0.4 + (variant || 1) * 0.15, 0);
        starScale = interpolate(scrollProgress, starRevealMid, holdEnd, 1, 0);
      }
      // Twinkle effect: a slow sine wave on opacity, or use CSS animation later
      const twinkle = Math.sin(scrollProgress * Math.PI * 2 * ((variant || 1) * 0.5) + (initialX / 10)) * 0.1 + 0.9; // Slow twinkle
      
      style = {
        position: 'absolute',
        left: `${initialX}%`,
        top: `${initialY}%`,
        width: `${starSize}px`,
        height: `${starSize}px`,
        opacity: starOpacity * twinkle,
        transform: `scale(${starScale})`,
        zIndex: 1, // Below product icon, above galaxies
      };
      break;

    case 'galaxyCluster':
      let galaxyOpacity, galaxyScale, galaxyRotation;
      const galaxyAppearStart = revealStart + (variant === 1 ? 0 : 0.05); // Stagger appearance
      
      if (scrollProgress <= revealMid) {
        galaxyOpacity = interpolate(scrollProgress, galaxyAppearStart, revealMid, 0, variant === 1 ? 0.25 : 0.2);
        galaxyScale = interpolate(scrollProgress, galaxyAppearStart, revealMid, 0.5, 1);
        galaxyRotation = interpolate(scrollProgress, galaxyAppearStart, revealMid, variant === 1 ? -10 : 10, 0);
      } else {
        galaxyOpacity = interpolate(scrollProgress, revealMid, holdEnd, variant === 1 ? 0.25 : 0.2, 0);
        galaxyScale = interpolate(scrollProgress, revealMid, holdEnd, 1, 0.5);
        galaxyRotation = interpolate(scrollProgress, revealMid, holdEnd, 0, variant === 1 ? 10 : -10);
      }
      style = {
        position: 'absolute',
        left: `${initialX}%`,
        top: `${initialY}%`,
        opacity: galaxyOpacity,
        transform: `scale(${galaxyScale}) rotate(${galaxyRotation}deg)`,
        zIndex: 0, // Furthest back with bgLayer
      };
      break;

    case 'starburst':
      let sbOpacity, sbScale, sbRotation, sbTranslateX, sbTranslateY;
      // More impressive: increase base travel distance and scale
      const baseSbTravelDistance = containerWidth / 3; // Increased travel
      const baseSbScale = 1.0; // Base peak scale

      // Organic: Add variation based on variant
      // Increase randomness range for scale, distance, and rotation
      const variantScaleFactor = 0.8 + (((variant || 1) * 13) % 15) / 10; // e.g., 0.8 to 2.2 (more variation)
      const variantDistanceFactor = 0.5 + (((variant || 1) * 17) % 14) / 10; // e.g., 0.5 to 1.8 (wider variation for distance)
      const variantRotationOffset = (((variant || 1) * 23) % 19 - 9) * 10; // e.g., -90 to 90 degrees (much more variation)

      const finalSbTravelDistance = baseSbTravelDistance * variantDistanceFactor;
      const finalSbPeakScale = baseSbScale * variantScaleFactor;

      const sbStartDelay = revealStart + 0.10; // Start a bit earlier
      const sbPeakTime = revealMid + 0.10; // Peak a bit later for longer travel
      const sbEndEarly = holdEnd - 0.10; // Fade out a bit later

      // Organic angle: base angle + small random offset per variant
      const starburstTotalCount = 45;
      const baseAngle = ((variant || 1) - 1) * ( (2 * Math.PI) / starburstTotalCount ); // Evenly distribute based on count (e.g. 12 starbursts -> PI/6 or 30deg increments)
      // Simple hash-like function of variant for a consistent random-ish offset
      const randomAngleFactor = (((variant || 1) * 37) % 13) / 13; // Value between 0 and almost 1
      const angleRandomOffset = (randomAngleFactor - 0.5) * (Math.PI / 3); // Wider offset (e.g., +/- 60 degrees)
      const angleOffset = baseAngle + angleRandomOffset;
      
      if (scrollProgress <= sbPeakTime && scrollProgress >= sbStartDelay) {
        const progressInBurst = Math.max(0, Math.min(1, (scrollProgress - sbStartDelay) / (sbPeakTime - sbStartDelay)));
        sbOpacity = interpolate(progressInBurst, 0, 1, 0, 0.9); // Slightly brighter
        sbScale = interpolate(progressInBurst, 0, 1, 0.1 * variantScaleFactor, finalSbPeakScale);
        sbRotation = interpolate(progressInBurst, 0, 1, -60 + variantRotationOffset, 60 + variantRotationOffset);
        const currentDist = interpolate(progressInBurst, 0, 1, 0, finalSbTravelDistance);
        sbTranslateX = Math.cos(angleOffset) * currentDist;
        sbTranslateY = Math.sin(angleOffset) * currentDist;
      } else if (scrollProgress > sbPeakTime && scrollProgress <= sbEndEarly) {
        const progressOutBurst = Math.max(0, Math.min(1, (scrollProgress - sbPeakTime) / (sbEndEarly - sbPeakTime)));
        sbOpacity = interpolate(progressOutBurst, 0, 1, 0.9, 0);
        sbScale = interpolate(progressOutBurst, 0, 1, finalSbPeakScale, finalSbPeakScale * 1.5); // Scale up more as they fade
        sbRotation = interpolate(progressOutBurst, 0, 1, 60 + variantRotationOffset, 150 + variantRotationOffset);
        const currentDist = interpolate(progressOutBurst, 0, 1, finalSbTravelDistance, finalSbTravelDistance * 1.8); // Travel further out
        sbTranslateX = Math.cos(angleOffset) * currentDist;
        sbTranslateY = Math.sin(angleOffset) * currentDist;
      } else {
        sbOpacity = 0;
        sbScale = 0;
        sbRotation = 0;
        sbTranslateX = 0;
        sbTranslateY = 0;
      }

      style = {
        position: 'absolute',
        left: `${initialX}%`,
        top: `${initialY}%`,
        opacity: sbOpacity,
        transform: `translate(-50%, -50%) translate(${sbTranslateX}px, ${sbTranslateY}px) scale(${sbScale}) rotate(${sbRotation}deg)`,
        zIndex: 4, 
      };
      break;
  }
  return (
    <div className={`${styles.illustrationLayer} ${styles[type]} ${styles[`${type}${variant}`] || ''}`} style={style}>
      {content}
    </div>
  );
});
AnimatedLayer.displayName = 'AnimatedLayer';

const createStarburstConfig = (count: number = 45): LayerConfig[] => {
  const starbursts: LayerConfig[] = [];
  for (let i = 0; i < count; i++) {
    // Subtle random offset from center (50%) between -2.5% and +2.5%
    const xOffset = (Math.random() - 0.5) * 5; // Range: -2.5 to 2.5
    const yOffset = (Math.random() - 0.5) * 5; // Range: -2.5 to 2.5
    starbursts.push({
      id: `sb${i + 1}`,
      type: 'starburst',
      variant: i + 1, // Unique variant for each
      initialX: 50 + xOffset,
      initialY: 50 + yOffset,
    });
  }
  return starbursts;
};

const createStarConfig = (count: number = 65): LayerConfig[] => {
  const stars: LayerConfig[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: `star${i}`,
      type: 'star',
      variant: Math.random() * 3 + 1, // Affects size and twinkle speed/intensity
      initialX: Math.random() * 100,
      initialY: Math.random() * 80, // Keep stars mostly in upper 80% to avoid caption
    });
  }
  return stars;
};

const layersConfig: LayerConfig[] = [
  { id: 'bg1', type: 'bgLayer', variant: 1 }, // Deep space background
  { id: 'bg2', type: 'bgLayer', variant: 2 }, // Softer nebula overlay

  // Stars - generated dynamically
  ...createStarConfig(), // Add 75 stars with random positions and variants

  { id: 'gc1', type: 'galaxyCluster', variant: 1, initialX: 20, initialY: 30 },
  { id: 'gc2', type: 'galaxyCluster', variant: 2, initialX: 70, initialY: 50 },
  
  { id: 'productIcon', type: 'productIconPlaceholder', variant: 1 }, // Central celestial body

  // Starbursts - generated dynamically
  ...createStarburstConfig(), // Add 15 starbursts with subtle random origins and more varied behaviors
];

const ArtisticScrollIllustration: React.FC = () => {
  // Product Launch Sequence Milestones
  const revealStart = 0.2;
  const revealMid = 0.5;
  const revealFull = 0.7;
  const holdEnd = 1.0;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const animationFrameId = useRef<number | null>(null);

  const handleScrollAndResize = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let progress = 0;
      // Calculate progress: 0 when element top is at viewport bottom, 1 when element bottom is at viewport top.
      if (rect.height + viewportHeight > 0) { // Avoid division by zero and ensure meaningful calculation
        progress = (viewportHeight - rect.top) / (rect.height + viewportHeight);
      }
      
      setScrollProgress(Math.max(0, Math.min(1, progress))); // Clamp between 0 and 1
      setContainerWidth(rect.width);
      setContainerHeight(rect.height);
    });
  }, []); // setScrollProgress, setContainerWidth, setContainerHeight are stable

  useEffect(() => {
    handleScrollAndResize(); // Initial call to set dimensions and progress

    window.addEventListener('scroll', handleScrollAndResize, { passive: true });
    window.addEventListener('resize', handleScrollAndResize);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('scroll', handleScrollAndResize);
      window.removeEventListener('resize', handleScrollAndResize);
    };
  }, [handleScrollAndResize]);

  return (
    <div ref={containerRef} className={styles.illustrationContainer}>
      {layersConfig.map(layer => (
        <AnimatedLayer
          key={layer.id}
          {...layer}
          scrollProgress={scrollProgress}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          revealStart={revealStart}
          revealMid={revealMid}
          revealFull={revealFull}
          holdEnd={holdEnd}
        />
      ))}
      <p className={styles.illustrationCaption} style={{ opacity: (scrollProgress <= revealMid ? interpolate(scrollProgress, revealStart, revealMid, 0, 1) : interpolate(scrollProgress, revealMid, holdEnd, 1, 0)) }}>
        Example product icon animation using CSS and the Web Animations API.
      </p>
    </div>
  );
};

export default ArtisticScrollIllustration;
