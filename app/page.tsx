'use client';

import { useEffect, useRef, useState } from 'react';
import PortfolioWorld from '@/app/portfolio3d/PortfolioWorld';

const sectionIds = ['hero', 'about', 'work', 'skills', 'contact'];

export default function Home() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isFading, setIsFading] = useState(false);
	const lockedRef = useRef(false);

	useEffect(() => {
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

			if (e.deltaY > 0) {
				moveSection(1);
			} else {
				moveSection(-1);
			}
		};

		window.addEventListener('wheel', onWheel, { passive: false });

		return () => {
			window.removeEventListener('wheel', onWheel);
		};
	}, []);

	return (
		<main className="overflow-hidden">
			<div
				className={`pointer-events-none fixed inset-0 z-[9999] bg-white transition-opacity duration-500 ${
					isFading ? 'opacity-100' : 'opacity-0'
				}`}
			/>

			<section id="hero" className="h-screen">
				<PortfolioWorld />
			</section>

			<section id="work"></section>
			<section id="about" className="h-screen bg-pink-100 p-10">
				<h2 className="text-4xl font-black">About Me</h2>
				<p>UI Publisher에서 Front-End Developer로 성장 중입니다.</p>
			</section>

			<section id="skills" className="h-screen bg-green-100 p-10">
				<h2 className="text-4xl font-black">Skills</h2>
				<p>React, Next.js, TypeScript, Accessibility.</p>
			</section>

			<section id="contact" className="h-screen bg-blue-100 p-10">
				<h2 className="text-4xl font-black">Contact</h2>
				<p>GitHub / Email / Resume</p>
			</section>
		</main>
	);
}
