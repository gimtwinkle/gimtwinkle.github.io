'use client';

import { useEffect, useRef, useState } from 'react';
import PortfolioWorld from '@/app/portfolio3d/PortfolioWorld';

const sectionIds = ['hero'];

export default function Home() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isFading, setIsFading] = useState(false);
	const lockedRef = useRef(false);

	useEffect(() => {
		if (sectionIds.length <= 1) return;

		const moveSection = (direction: 1 | -1) => {
			if (lockedRef.current) return;

			setActiveIndex((prev) => {
				const next = Math.min(
					Math.max(prev + direction, 0),
					sectionIds.length - 1
				);

				if (next === prev) return prev;

				lockedRef.current = true;
				setIsFading(true);

				setTimeout(() => {
					document.getElementById(sectionIds[next])?.scrollIntoView({
						behavior: 'smooth',
					});

					setTimeout(() => {
						setIsFading(false);
						lockedRef.current = false;
					}, 500);
				}, 250);

				return next;
			});
		};

		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			moveSection(e.deltaY > 0 ? 1 : -1);
		};

		window.addEventListener('wheel', onWheel, { passive: false });

		return () => {
			window.removeEventListener('wheel', onWheel);
		};
	}, []);

	return (
		<main className="scrollbar-hidden h-screen overflow-x-hidden">
			<div
				className={`pointer-events-none fixed inset-0 z-[9999] bg-white transition-opacity duration-500 ${
					isFading ? 'opacity-100' : 'opacity-0'
				}`}
			/>

			<section id="hero" className="h-screen w-screen">
				<PortfolioWorld />
			</section>
		</main>
	);
}
