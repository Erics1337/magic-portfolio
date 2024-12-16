import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from 'classnames';

import { Footer, Header, RouteGuard } from "@/components";
import { baseURL, effects, style } from '@/app/resources'

import { Inter } from 'next/font/google'
import { Source_Code_Pro } from 'next/font/google';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { routing } from "@/i18n/routing";
import { renderContent } from "@/app/resources";
import { Background, Flex } from "@/once-ui/components";
import Script from 'next/script';

export async function generateMetadata(
	{ params: { locale }}: { params: { locale: string }}
) {

	const t = await getTranslations();
	const { person, home } = renderContent(t);

	return {
		metadataBase: new URL(`https://${baseURL}/${locale}`),
		title: home.title,
		description: home.description,
		openGraph: {
			title: `${person.firstName}'s Portfolio`,
			description: 'Portfolio website showcasing my work.',
			url: baseURL,
			siteName: `${person.firstName}'s Portfolio`,
			locale: 'en_US',
			type: 'website',
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
	}
};

const primary = Inter({
	variable: '--font-primary',
	subsets: ['latin'],
	display: 'swap',
})

type FontConfig = {
    variable: string;
};

/*
	Replace with code for secondary and tertiary fonts
	from https://once-ui.com/customize
*/
const secondary: FontConfig | undefined = undefined;
const tertiary: FontConfig | undefined = undefined;
/*
*/

const code = Source_Code_Pro({
	variable: '--font-code',
	subsets: ['latin'],
	display: 'swap',
});

interface RootLayoutProps {
	children: React.ReactNode;
	params: {locale: string};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({locale}));
  }

export default async function RootLayout({
	children,
	params: {locale}
} : RootLayoutProps) {
	unstable_setRequestLocale(locale);
	const messages = await getMessages();

	return (
		<html lang={locale} className={classNames(primary.variable, secondary ? secondary.variable : '', tertiary ? tertiary.variable : '', code.variable)}>
			<body className="text-white bg-black">
				<NextIntlClientProvider messages={messages}>
					<Flex
						as="main"
						background="page"
						data-neutral={style.neutral} 
						data-brand={style.brand} 
						data-accent={style.accent}
						data-solid={style.solid} 
						data-solid-style={style.solidStyle}
						data-theme={style.theme}
						data-border={style.border}
						data-surface={style.surface}
						data-transition={style.transition}
						style={{
							minHeight: '100vh',
							position: 'relative',
							zIndex: 1
						}}
						fillWidth 
						margin="0" 
						padding="0"
						direction="column">
						{/* Full-page background */}
						<div
							className="fixed inset-0 will-change-transform"
							style={{
								backgroundImage: `url('/images/RR-v-june-2020-24.png')`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								backgroundAttachment: "fixed",
								width: "100vw",
								height: "120vh",
								left: "50%",
								top: "50%",
								transform: "translate(-50%, calc(-50% + calc(var(--scroll-offset, 0) * 0.3)))",
								filter: "brightness(0.6)",
								mixBlendMode: "multiply",
								zIndex: -1
							}}
						/>
						<Background
							mask={effects.mask as any}
							gradient={effects.gradient as any}
							dots={effects.dots as any}
							lines={effects.lines as any}
						/>
						<Header/>
						<Flex
							zIndex={1}
							fillWidth 
							paddingY="l" 
							paddingX="l"
							justifyContent="center" 
							flex={1}>
							<Flex
								justifyContent="center"
								fillWidth 
								minHeight="0">
								<RouteGuard>
									{children}
								</RouteGuard>
							</Flex>
						</Flex>
						<Footer/>
					</Flex>
				</NextIntlClientProvider>
				<Script src="/scripts/parallax.js" strategy="afterInteractive" />
			</body>
		</html>
	);
}