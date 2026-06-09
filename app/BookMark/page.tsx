const archiveLinks = [
	{
		icon: '🌬️',
		title: 'Tailwind CHEAT SHEET',
		desc: 'Tailwind 클래스 빠르게 확인할 수 있는 참고 자료',
		href: 'https://nerdcave.com/tailwind-cheat-sheet',
	},
	{
		icon: '📦',
		title: 'CodeSandbox Templates',
		desc: '빠르게 테스트할 수 있는 개발 템플릿',
		href: 'https://codesandbox.io/templates',
	},
	{
		icon: '🎨',
		title: 'FONT AWESOME',
		desc: '프로젝트에 활용하기 좋은 아이콘 라이브러리',
		href: 'https://fontawesome.com/',
	},
	{
		icon: '🌈',
		title: 'Gradient Generator',
		desc: '간단하게 배경 그라디언트를 만들 수 있는 도구',
		href: 'https://animated-gradient-background-generator.netlify.app/',
	},
	{
		icon: '⚔️',
		title: '모던 JavaScript 튜토리얼',
		desc: 'JavaScript 개념을 정리할 때 참고하는 문서',
		href: 'https://ko.javascript.info/',
	},
	{
		icon: '✨',
		title: 'Animate.css',
		desc: '간단한 CSS 애니메이션을 적용할 수 있는 라이브러리',
		href: 'https://animate.style/',
	},
];

export default function BookMark() {
	return (
		<section className="mx-auto py-16">
			<div className="rounded-[2rem] border-4 border-black bg-white/90 p-6 shadow-[8px_8px_0_#000] md:p-8">
				<header className="mb-8">
					<p className="text-xs font-black tracking-[0.3em] text-slate-500">
						BOOKMARKS
					</p>

					<h1 className="mt-3 text-4xl font-black text-slate-900 md:text-5xl">
						Useful Links
					</h1>

					<p className="mt-3 text-sm font-bold text-slate-500">
						개발하면서 자주 참고하는 사이트 모음
					</p>
				</header>

				<ul className="divide-y divide-slate-200">
					{archiveLinks.map((item) => (
						<li key={item.title}>
							<a
								href={item.href}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-indigo-600"
							>
								<div>
									<p className="font-semibold">
										{item.icon} {item.title}
									</p>

									<p className="mt-1 text-sm text-slate-500">{item.desc}</p>
								</div>

								<span className="text-lg">↗</span>
							</a>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
