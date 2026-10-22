'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { getFlowerPetals, getFlowerMaterial } from './flowerGeometry';

type Props = {
	position: [number, number, number];
	color: string;
	scale?: number;
};

export default function CuteFlower({ position, color, scale = 1 }: Props) {
	const petalResources = useMemo(() => ({ geometry: getFlowerPetals(), material: getFlowerMaterial(color) }), [color]);
    const variation = Math.sin(position[0] * 127.1 + position[2] * 311.7) * 43758.5453;
    const stemHeight = 0.22 + (variation - Math.floor(variation)) * 0.34;
	const flowerHeadRef = useRef<THREE.Group>(null);
    const windSeed = (position[0] * 3.3 + position[2] * 5.7) % (Math.PI * 2);

	useFrame((state) => {
		if (!flowerHeadRef.current) return;

		const t = state.clock.elapsedTime;

		flowerHeadRef.current.rotation.x = Math.sin(t * 1.8 + windSeed) * 0.08;
		flowerHeadRef.current.rotation.z = Math.cos(t * 1.4 + windSeed) * 0.05;
	});
	return (
		<group position={position} scale={scale}>
			{/* 줄기 */}
			<mesh position={[0, stemHeight / 2, 0]} castShadow>
				<cylinderGeometry args={[0.025, 0.03, stemHeight, 12]} />
				<meshStandardMaterial color="#16a34a" />
			</mesh>

			{/* 잎 */}
			<mesh
				position={[-0.07, stemHeight * 0.48, 0]}
				rotation={[0, 0, -0.8]}
				scale={[0.11, 0.04, 0.06]}
				castShadow
			>
				<sphereGeometry args={[1, 18, 18]} />
				<meshStandardMaterial color="#22c55e" />
			</mesh>
			<group
				ref={flowerHeadRef}
				position={[0, stemHeight + 0.02, 0]}
				rotation={[-Math.PI / 2, 0, 0]}
			>
				{/* 꽃잎들 */}
				{/* 가운데 꽃술 */}
				{/* 꽃 */}
				{/* 하늘을 향한 데이지 */}
				<group position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
					<mesh geometry={petalResources.geometry} material={petalResources.material} dispose={null} castShadow />

					<mesh position={[0, 0, 0.045]} castShadow>
						<sphereGeometry args={[0.085, 20, 20]} />
						<meshPhysicalMaterial
							color="#facc15"
							roughness={0.2}
							clearcoat={0.8}
						/>
					</mesh>
				</group>
			</group>
		</group>
	);
}
