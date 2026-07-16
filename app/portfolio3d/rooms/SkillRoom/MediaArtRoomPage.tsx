'use client';

import {
	ContactShadows,
	Environment,
	OrbitControls,
	Preload,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import * as THREE from 'three';

import MediaArtRoom from './MediaArtRoom';
import { ArtworkType } from './ArtworkContents';

function LoadingScreen() {
	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center bg-[#3b2c4d] text-sm text-white/70">
			미디어 아트룸을 불러오는 중...
		</div>
	);
}

export default function MediaArtRoomPage() {
	const [isCreated, setIsCreated] = useState(false);

	const handleSelectProject = (type: ArtworkType) => {
		console.log('선택한 프로젝트:', type);

		switch (type) {
			case 'frontend':
				console.log('프론트엔드 프로젝트 열기');
				break;

			case 'uiux':
				console.log('UI/UX 프로젝트 열기');
				break;

			case 'creative':
				console.log('크리에이티브 프로젝트 열기');
				break;
		}
	};

	return (
		<div className="relative h-screen w-screen overflow-hidden bg-[#3b2c4d]">
			{!isCreated && <LoadingScreen />}

			<Canvas
				shadows
				dpr={[1, 1.5]}
				camera={{
					position: [0, 5.8, 9.6],
					fov: 44,
					near: 0.1,
					far: 100,
				}}
				gl={{
					antialias: true,
					alpha: false,
					powerPreference: 'high-performance',
				}}
				onCreated={({ gl }) => {
					gl.outputColorSpace = THREE.SRGBColorSpace;
					gl.toneMapping = THREE.ACESFilmicToneMapping;
					gl.toneMappingExposure = 1.03;

					setIsCreated(true);
				}}
			>
				<Suspense fallback={null}>
					<MediaArtRoom
						showPanels
						onSelectProject={handleSelectProject}
						furniturePosition={[0, 0.3, 0.48]}
						furnitureRotation={[0, 0, 0]}
						furnitureScale={1}
					/>

					<ContactShadows
						position={[0, 0.012, 0.6]}
						opacity={0.28}
						scale={7.2}
						blur={2.8}
						far={5.5}
					/>

					<Environment preset="sunset" />

					<Preload all />
				</Suspense>

				<OrbitControls
					makeDefault
					target={[0, 0.75, 0]}
					enablePan={false}
					enableZoom
					enableRotate
					enableDamping
					dampingFactor={0.07}
					minDistance={7.5}
					maxDistance={13}
					minPolarAngle={Math.PI / 5}
					maxPolarAngle={Math.PI / 2.2}
					minAzimuthAngle={-0.38}
					maxAzimuthAngle={0.38}
				/>
			</Canvas>
		</div>
	);
}
