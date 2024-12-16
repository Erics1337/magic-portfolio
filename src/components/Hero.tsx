'use client'

import React, { useEffect } from "react"
import IntroductionBanner from "./IntroductionBanner"
import ScrollIndicator from "./ScrollIndicator"
import {
	Heading,
	Flex,
	Text,
	Button,
	Avatar,
	RevealFx,
	Arrow,
} from "@/once-ui/components"

const Hero: React.FC = () => {
	useEffect(() => {
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

		// Add scroll listener with throttling
		window.addEventListener('scroll', requestTick, { passive: true });
		window.addEventListener('resize', requestTick, { passive: true });

		// Initial update
		updateParallax();

		// Cleanup
		return () => {
			window.removeEventListener('scroll', requestTick);
			window.removeEventListener('resize', requestTick);
		};
	}, []); // Empty dependency array means this effect runs once on mount

	return (
		<section className="overflow-visible relative w-full h-screen hero-section">
			{/* Background Image */}
			<div
				className="fixed top-0 left-0 w-full will-change-transform"
				style={{
					backgroundImage: `url('/images/RR-v-june-2020-24.png')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundAttachment: "fixed",
					height: "100vh",
					transform: `translateY(calc(var(--scroll-offset, 0) * -0.4))`,
					filter: "brightness(0.6)",
					mixBlendMode: "multiply",
					zIndex: -1,
				}}
			/>

			{/* Gradient Overlay */}
			<div
				className="absolute inset-0 will-change-transform"
				style={{
					background: `
						radial-gradient(circle at center, 
							rgba(30, 27, 60, calc(0.5 + var(--hero-progress, 0) * 0.5)) 0%, 
							rgba(30, 27, 60, calc(0.2 + var(--hero-progress, 0) * 0.3)) 40%, 
							transparent 70%)
					`,
					opacity: "calc(1 - var(--hero-progress, 0) * 0.3)",
				}}
			/>

			{/* Content Container */}
			<div 
				className="flex absolute inset-0 z-10 flex-col gap-16 justify-center items-center px-4 mx-auto max-w-7xl will-change-transform"
				style={{
					transform: "translateY(calc(var(--hero-progress, 0) * -30%))",
					opacity: "calc(1 - var(--hero-progress, 0) * 0.8)",
				}}
			>
				<RevealFx translateY="4">
					<div className="flex flex-col gap-16 items-center">
						<IntroductionBanner />
						<ScrollIndicator />
					</div>
				</RevealFx>
			</div>
		</section>
	)
}

export default Hero
