"use client"

import React from "react"
import { HiChevronRight } from "react-icons/hi"
import { IconButton } from "@/once-ui/components"
import { renderContent } from "@/app/resources"
import { useTranslations } from "next-intl"
import Image from "next/image"

const IntroductionBanner: React.FC = () => {
	const t = useTranslations()
	const { social } = renderContent(t)

	return (
		<div className="flex flex-col gap-8 justify-center items-center p-8 text-white md:flex-row">
			{/* Profile Picture */}
			<div className="overflow-hidden relative w-48 rounded-full border-4 border-blue-500 shadow-lg aspect-square">
				<Image
					src="/images/profilePic.jpg"
					alt="Eric Swanson"
					fill
					className="object-cover"
					priority
				/>
			</div>
			{/* Text Content */}
			<div className="text-center md:text-left">
				<h1 className="mb-4 text-4xl font-bold md:text-5xl">
					Hello, I'm{" "}
					<span className="inline-block text-blue-500 transition-all duration-150 ease-in-out transform hover:scale-110 hover:-translate-y-1">
						Eric Swanson!
					</span>
				</h1>

				{/* Social Links */}
				<div className="flex gap-4 justify-center items-center md:justify-start">
					<p className="text-lg">LET'S CONNECT</p>
					<HiChevronRight className="text-3xl text-gray-400" />

					{/* Social Icons */}
					{social.map((item) => (
						<div 
							key={item.name} 
							className="transition-all duration-150 ease-in-out transform hover:scale-110 hover:-translate-y-1"
						>
							<IconButton
								href={item.link}
								icon={item.icon}
								tooltip={item.name}
								size="l"
								variant="ghost"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default IntroductionBanner
