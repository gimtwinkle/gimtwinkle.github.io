'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export function SkyBackground({ isNight }: { isNight: boolean }) {
	const texture = useMemo(() => {
		const canvas = document.createElement('canvas');
		canvas.width = 1;
		canvas.height = 256;

		const ctx = canvas.getContext('2d')!;
		const gradient = ctx.createLinearGradient(0, 0, 0, 256);

		if (isNight) {
			gradient.addColorStop(0, '#020617'); // 거의 검정
			gradient.addColorStop(0.45, '#0f172a'); // 남색
			gradient.addColorStop(1, '#1e3a8a'); // 어두운 파랑
		} else {
			gradient.addColorStop(0, '#7dd3fc');
			gradient.addColorStop(1, '#e0f2fe');
		}

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 1, 256);

		const texture = new THREE.CanvasTexture(canvas);
		texture.needsUpdate = true;

		return texture;
	}, [isNight]);

	return (
		<mesh position={[0, 5, -12]}>
			<planeGeometry args={[40, 24]} />
			<meshBasicMaterial map={texture} depthWrite={false} />
		</mesh>
	);
}
