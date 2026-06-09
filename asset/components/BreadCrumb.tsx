import Link from 'next/link';

type BreadcrumbItem = {
	label: string;
	href?: string;
	icon?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
	return (
		<nav className="mb-8 text-sm font-black text-slate-800">
			<ol className="flex flex-wrap items-center gap-2">
				<li className="text-slate-700">📍 Current Map</li>

				{items.map((item) => (
					<li key={item.label} className="flex items-center gap-2">
						<span>›</span>

						{item.href ? (
							<Link href={item.href} className="hover:text-emerald-500">
								{item.icon} {item.label}
							</Link>
						) : (
							<span className="text-emerald-500">
								{item.icon} {item.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
