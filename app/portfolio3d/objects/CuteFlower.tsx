'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Props = {
	position: [number, number, number];
	color: string;
	scale?: number;
};

function Petal({
	position,
	rotation,
	color,
	scale = 1,
}: {
	position: [number, number, number];
	rotation: [number, number, number];
	color: string;
	scale?: number;
}) {
	const shape = useMemo(() => {
		const s = new THREE.Shape();

		s.moveTo(0, 0.22);
		s.bezierCurveTo(0.14, 0.18, 0.18, -0.02, 0, -0.22);
		s.bezierCurveTo(-0.18, -0.02, -0.14, 0.18, 0, 0.22);

		return s;
	}, []);

	const geometry = useMemo(() => {
		const geo = new THREE.ExtrudeGeometry(shape, {
			depth: 0.035,
			bevelEnabled: true,
			bevelSize: 0.01,
			bevelThickness: 0.01,
			bevelSegments: 3,
		});

		const pos = geo.attributes.position;

		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const y = pos.getY(i);
			const z = pos.getZ(i);

			const wave = Math.sin(y * 18) * 0.012;
			const curl = Math.abs(x) * 0.025;

			pos.setZ(i, z + wave + curl);
		}

		pos.needsUpdate = true;
		geo.computeVertexNormals();

		return geo;
	}, [shape]);

	return (
		<mesh
			position={position}
			rotation={rotation}
			scale={scale}
			geometry={geometry}
			castShadow
		>
			<meshPhysicalMaterial
				color={color}
				roughness={0.28}
				clearcoat={0.75}
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
}

export default function CuteFlower({ position, color, scale = 1 }: Props) {
	const stemHeight = useMemo(() => 0.22 + Math.random() * 0.34, []);
	const flowerHeadRef = useRef<THREE.Group>(null);
	const windSeed = useMemo(() => Math.random() * Math.PI * 2, []);

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
					{Array.from({ length: 6 }).map((_, i) => {
						const angle = (Math.PI * 2 * i) / 6;

						return (
							<Petal
								key={i}
								position={[Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0]}
								rotation={[0, 0, angle - Math.PI / 2]}
								scale={0.72}
								color={color}
							/>
						);
					})}

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
