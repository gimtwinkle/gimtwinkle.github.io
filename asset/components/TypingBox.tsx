'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

type TypingBoxProps = {
	msgText: string;
};

// 중간에 컴포화
export default function TypingBox({ msgText }: TypingBoxProps) {
	const [displayText, setDisplayText] = useState('');

	useEffect(() => {
		let index = 0;

		const timer = setInterval(() => {
			setDisplayText(msgText.slice(0, index));
			index += 1;

			if (index > msgText.length) {
				clearInterval(timer);
			}
		}, 28);

		return () => clearInterval(timer);
	}, [msgText]);

	return (
		<div
			className={clsx(
				'relative w-full rounded-3xl',
				'border-4 border-black',
				'bg-white/90 backdrop-blur-md',
				'p-5 md:p-7',
				'shadow-[6px_6px_0_#000]'
			)}
		>
			<div className="mb-3 flex items-center gap-2">
				<span className="rounded-full bg-black px-3 py-1 text-xs font-black text-white">
					NPC MESSAGE
				</span>
			</div>

			<p className="whitespace-pre-line text-sm font-bold leading-7 text-slate-800 md:text-base md:leading-8">
				{displayText}
				<span className="animate-pulse">▌</span>
			</p>
		</div>
	);
}
