import React from "react"
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

	return (
		<section className="overflow-visible relative w-full h-screen hero-section">
			{/* Background Image */}
			<div
				className="absolute inset-0 w-full h-full"
				style={{
					backgroundImage: `url('/images/RR-v-june-2020-24.png')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					filter: "brightness(0.6)",
					mixBlendMode: "multiply",
					zIndex: -1,
				}}
			/>

			{/* Gradient Overlay */}
			<div
				className="absolute inset-0 will-change-transform"
				style={{
					background: "radial-gradient(50% 50% at 50% 50%, rgba(30, 27, 60, 0.8) 0%, rgba(30, 27, 60, 0.5) 40%, transparent 100%)",
					opacity: "0.7",
				}}
			/>

			{/* Content Container */}
			<div 
				className="flex absolute inset-0 z-10 flex-col gap-16 justify-center items-center px-4 mx-auto max-w-7xl"
				style={{
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
