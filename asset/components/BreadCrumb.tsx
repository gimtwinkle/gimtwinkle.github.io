'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const labelMap: Record<string, string> = {
	AboutMe: 'About Me',
	BookMark: 'BookMark',
};

const iconMap: Record<string, string> = {
	AboutMe: '⭐',
	BookMark: '🗝️',
};

export default function Breadcrumb() {
	const pathname = usePathname();

	const paths = (pathname ?? '').split('/').filter(Boolean);

	return (
		<nav className="mb-8 text-sm font-black text-slate-800">
			<ol className="flex flex-wrap items-center gap-2">
				<li className="text-slate-700">📍 Current Map</li>

				<li className="flex items-center gap-2">
					<span>›</span>
					<Link href="/" className="hover:text-emerald-500">
						🏠 Home
					</Link>
				</li>

				{paths.map((path, index) => {
					const href = '/' + paths.slice(0, index + 1).join('/');
					const isLast = index === paths.length - 1;

					const label = labelMap[path] ?? path;
					const icon = iconMap[path] ?? '📄';

					return (
						<li key={href} className="flex items-center gap-2">
							<span>›</span>

							{isLast ? (
								<span className="text-emerald-500">
									{icon} {label}
								</span>
							) : (
								<Link href={href} className="hover:text-emerald-500">
									{icon} {label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
