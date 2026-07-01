'use client';

import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import FirstPersonCamera from './FirstPersonCamera';

type Bounds = {
	minX: number;
	maxX: number;
	minZ: number;
	maxZ: number;
};

type RoomSceneProps = {
	children: React.ReactNode;
	onBack: () => void;
	startPosition: [number, number, number];
	lookAt?: [number, number, number];
	exitPosition: [number, number, number];
	bounds: Bounds;
};

export default function RoomScene({
	children,
	onBack,
	startPosition,
	lookAt = [0, 1.35, -3],
	exitPosition,
	bounds,
}: RoomSceneProps) {
	const [isExitNear, setIsExitNear] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	return (
		<div
			className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-[#fff7ed]"
			style={{ overscrollBehavior: 'none' }}
		>
			<Canvas
				key={startPosition.join('-')}
				className="h-full w-full"
				shadows
				camera={{
					position: startPosition,
					fov: 85,
					near: 0.1,
					far: 100,
				}}
				gl={{
					antialias: true,
				}}
			>
				<color attach="background" args={['#fff7ed']} />

				{children}

				<FirstPersonCamera
					startPosition={startPosition}
					lookAt={lookAt}
					bounds={bounds}
					exitPosition={exitPosition}
					onExitNearChange={setIsExitNear}
					onDragChange={setIsDragging}
					onExit={onBack}
				/>
			</Canvas>

			{!isDragging && (
				<div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-full border-4 border-black bg-white/90 px-5 py-2 text-sm font-black shadow-[5px_5px_0_#000]">
					WASD / 방향키로 이동 · 드래그로 둘러보기
				</div>
			)}

			{isExitNear && (
				<div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 rounded-[2rem] border-4 border-black bg-[#ff9ecb] px-6 py-3 text-lg font-black text-white shadow-[6px_6px_0_#000]">
					E 키를 눌러 나가기
				</div>
			)}
		</div>
	);
}
