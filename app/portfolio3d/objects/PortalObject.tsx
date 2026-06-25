'use client';

import { Html, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

type PortalObjectProps = {
	label: string;
	targetId: string;
	modelUrl: string;
	position: [number, number, number];
};

export default function PortalObject({
	label,
	targetId,
	modelUrl,
	position,
}: PortalObjectProps) {
	const ref = useRef<THREE.Group>(null);
	const { scene } = useGLTF(modelUrl);
	const { scene: threeScene } = useThree();

	useFrame(() => {
		if (!ref.current) return;

		ref.current.rotation.y += 0.01;

		const player = threeScene.getObjectByName('player');

		if (!player) return;

		const portalPosition = new THREE.Vector3(...position);
		const distance = player.position.distanceTo(portalPosition);

		if (distance < 1.4) {
			document.getElementById(targetId)?.scrollIntoView({
				behavior: 'smooth',
			});
		}
	});

	return (
		<group ref={ref} position={position}>
			<primitive object={scene.clone()} scale={1.2} />

			<Html center position={[0, 1.5, 0]}>
				<div className="rounded-xl border-2 border-black bg-white px-3 py-1 text-sm font-black shadow-[3px_3px_0_#000]">
					{label}
				</div>
			</Html>
		</group>
	);
}
