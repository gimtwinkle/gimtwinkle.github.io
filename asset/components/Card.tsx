import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';

type CardProps = {
	src: string | StaticImageData;
	title: string;
	desc: string;
	href: string;
	projectType: string;
	techStack: string[];
	className?: string;
	company?: string;
	companyLogo?: string | StaticImageData;
};

export default function Card({
	src,
	title,
	desc,
	href,
	projectType,
	techStack,
	className,
	company,
	companyLogo,
}: CardProps) {
	const badgeStyle =
		projectType === 'SIDE' ? 'bg-emerald-500' : 'bg-indigo-500';

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={clsx(
				'group inline-flex w-full max-w-full flex-col overflow-hidden rounded-3xl',
				'border border-white/30 bg-white/70',
				'shadow-xl transition-all duration-300',
				'hover:-translate-y-2 hover:shadow-2xl',
				'md:max-w-[360px]',
				className
			)}
		>
			{/* 썸네일 */}
			<div className="relative aspect-[3/2] overflow-hidden">
				<Image
					src={src}
					alt={title}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-105"
				/>

				<div
					className={clsx(
						'absolute inset-0 z-[1]',
						'bg-white/15 backdrop-blur-md',
						'transition-opacity duration-500',
						'group-hover:opacity-0'
					)}
				>
					<div
						className={clsx(
							'absolute inset-x-0 top-0 h-1/2',
							'bg-gradient-to-b from-white/30 to-transparent'
						)}
					/>

					<div
						className={clsx(
							'absolute inset-x-0 bottom-0 h-1/2',
							'bg-gradient-to-t from-black/20 to-transparent'
						)}
					/>
				</div>

				{projectType === 'WORK' && companyLogo && (
					<div
						className={clsx(
							'absolute inset-0 z-10',
							'flex items-center justify-center',
							'transition-all duration-500',
							'group-hover:opacity-0 group-hover:scale-95'
						)}
					>
						<Image
							src={companyLogo}
							alt={company ? `${company} 로고` : `${title} 로고`}
							width={180}
							height={80}
							className={clsx(
								'h-auto max-h-[80px] object-contain',
								'drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
							)}
						/>
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-3 p-6">
				<p
					className={clsx(
						'w-fit rounded-full px-3 py-1 text-xs font-bold text-white shadow-md',
						badgeStyle
					)}
				>
					{projectType}
				</p>

				<h2 className="text-2xl font-black text-slate-900">{title}</h2>

				{company && (
					<div className="-mt-2 text-sm font-semibold text-slate-500">
						{company}
					</div>
				)}

				<p className="text-sm leading-6 text-slate-600">{desc}</p>

				<div className="mt-4 flex flex-wrap gap-2">
					{techStack.map((tech) => (
						<span
							key={tech}
							className={clsx(
								'rounded-xl border border-slate-200 bg-slate-50',
								'px-2.5 py-1 text-[11px] font-bold text-slate-700'
							)}
						>
							#{tech}
						</span>
					))}
				</div>
			</div>
		</a>
	);
}
