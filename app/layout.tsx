import type { Metadata } from 'next';
import Script from 'next/script';
import '@/app/globals.css';
import '@/asset/styles/style.css';

export const metadata: Metadata = {
	title: 'UX/UI developer',
	description: '',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className="h-full antialiased"
		>
			<body className="min-h-full flex flex-col">
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-0E5NZRHB8M"
					strategy="afterInteractive"
				/>
				<Script id="gtag-init" strategy="afterInteractive">
					{`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-0E5NZRHB8M');`}
				</Script>
				<div>{children}</div>
			</body>
		</html>
	);
}
