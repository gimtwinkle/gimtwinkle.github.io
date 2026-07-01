'use client';

import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type CeilingFanProps = {
	position?: [number, number, number];
	scale?: [number, number, number];
};

export default function CeilingFan({
	position = [0, 2.7, 0],
	scale = [1, 1, 1],
}: CeilingFanProps) {
	const fanRef = useRef<THREE.Group>(null);

	useFrame(({ clock }) => {
		if (!fanRef.current) return;

		// 천천히 부드럽게 회전
		fanRef.current.rotation.y = clock.getElapsedTime() * 3;
	});

	// 아이스크림 막대기 같은 긴 날개 Shape
	const bladeGeometry = useMemo(() => {
		const shape = new THREE.Shape();

		shape.moveTo(-0.06, 0);
		shape.quadraticCurveTo(-0.025, 0.12, -0.012, 0.4);
		shape.quadraticCurveTo(0.0, 0.78, 0.0, 1.18);
		shape.quadraticCurveTo(0.0, 1.32, 0.025, 1.36);
		shape.quadraticCurveTo(0.06, 1.4, 0.12, 1.4);
		shape.quadraticCurveTo(0.2, 1.4, 0.22, 1.32);
		shape.quadraticCurveTo(0.24, 1.22, 0.22, 1.07);
		shape.quadraticCurveTo(0.18, 0.58, 0.14, 0.13);
		shape.quadraticCurveTo(0.11, 0.02, 0.08, 0);
		shape.quadraticCurveTo(0.046, -0.02, 0.0, -0.02);
		shape.quadraticCurveTo(-0.046, -0.02, -0.06, 0);

		shape.closePath();

		return new THREE.ExtrudeGeometry(shape, {
			depth: 0.03,
			bevelEnabled: true,
			bevelSegments: 5,
			bevelSize: 0.012,
			bevelThickness: 0.012,
		});
	}, []);

	return (
		<group position={position} scale={scale}>
			{/* 천장 캡 */}
			<mesh position={[0, 0.12, 0]}>
				<cylinderGeometry args={[0.18, 0.22, 0.12, 32]} />
				<meshPhysicalMaterial color="#ffd6e8" roughness={0.2} clearcoat={1} />
			</mesh>

			{/* 봉 */}
			<mesh position={[0, -0.12, 0]}>
				<cylinderGeometry args={[0.03, 0.03, 0.28, 20]} />
				<meshStandardMaterial color="#caa27d" />
			</mesh>

			{/* 납작한 모터 */}
			<mesh position={[0, -0.32, 0]}>
				<cylinderGeometry args={[0.28, 0.32, 0.12, 40]} />
				<meshPhysicalMaterial color="#ffe9b8" roughness={0.18} clearcoat={1} />
			</mesh>

			{/* 회전부 */}
			<group ref={fanRef} position={[0, -0.32, 0]}>
				{[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot) => (
					<group key={rot} rotation={[0, rot, 0]}>
						<mesh
							geometry={bladeGeometry}
							position={[0, 0, 0.08]}
							rotation={[Math.PI / 2, 0, 0]}
						>
							<meshPhysicalMaterial
								color="#d9f6ff"
								roughness={0.18}
								clearcoat={1}
							/>
						</mesh>
					</group>
				))}
			</group>

			{/* 아래 장식 */}
			<mesh position={[0, -0.44, 0]}>
				<sphereGeometry args={[0.06, 24, 24]} />
				<meshPhysicalMaterial
					color="#fff176"
					roughness={0.15}
					clearcoat={1}
					emissive="#fff5aa"
					emissiveIntensity={0.5}
				/>
			</mesh>
		</group>
	);
}
