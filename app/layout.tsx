import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import '@/app/globals.css';
import '@/asset/styles/style.css';
import TitleTop from '@/asset/components/TitleTop';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Twinkle',
	description: 'UI/UX Frontend Developer Portfolio',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="ko"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-0E5NZRHB8M"
					strategy="afterInteractive"
				/>

				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-0E5NZRHB8M');
					`}
				</Script>

				<div className="title">
					<TitleTop />
					{children}
				</div>
			</body>
		</html>
	);
}
