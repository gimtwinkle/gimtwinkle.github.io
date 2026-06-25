'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

type Props = {
	position: [number, number, number];
	scale?: number;
	rotation?: [number, number, number];
	color?: string;
};

const BUSH_BASE_COLOR = '#22c55e';

function Leaf({
	position,
	rotation,
	scale = 1,
	color = '#bef264',
}: {
	position: [number, number, number];
	rotation: [number, number, number];
	scale?: number;
	color?: string;
}) {
	const geometry = useMemo(() => {
		const shape = new THREE.Shape();

		shape.moveTo(0, 0.22);
		shape.bezierCurveTo(0.22, 0.12, 0.28, -0.1, 0, -0.28);
		shape.bezierCurveTo(-0.28, -0.1, -0.22, 0.12, 0, 0.22);

		return new THREE.ExtrudeGeometry(shape, {
			depth: 0.035,
			bevelEnabled: true,
			bevelSize: 0.01,
			bevelThickness: 0.01,
			bevelSegments: 3,
		});
	}, []);

	return (
		<group position={position} rotation={rotation} scale={scale}>
			<mesh geometry={geometry} castShadow>
				<meshPhysicalMaterial
					color={color}
					roughness={0.36}
					clearcoat={0.35}
					side={THREE.DoubleSide}
				/>
			</mesh>

			{/* 가운데 잎맥 */}
			<mesh position={[0, -0.03, 0.052]} castShadow>
				<boxGeometry args={[0.018, 0.36, 0.012]} />
				<meshStandardMaterial color="#84cc16" />
			</mesh>

			{/* 왼쪽 잎맥들 */}
			{[-0.06, -0.14].map((y, i) => (
				<mesh
					key={`left-vein-${i}`}
					position={[-0.045, y, 0.058]}
					rotation={[0, 0, 0.6]}
					castShadow
				>
					<boxGeometry args={[0.012, 0.13, 0.01]} />
					<meshStandardMaterial color="#bef264" />
				</mesh>
			))}

			{/* 오른쪽 잎맥들 */}
			{[-0.06, -0.14].map((y, i) => (
				<mesh
					key={`right-vein-${i}`}
					position={[0.045, y, 0.058]}
					rotation={[0, 0, -0.6]}
					castShadow
				>
					<boxGeometry args={[0.012, 0.13, 0.01]} />
					<meshStandardMaterial color="#bef264" />
				</mesh>
			))}
		</group>
	);
}

function Volume({
	position,
	scale,
}: {
	position: [number, number, number];
	scale: [number, number, number];
}) {
	return (
		<mesh position={position} scale={scale} castShadow>
			<sphereGeometry args={[0.55, 32, 32]} />
			<meshPhysicalMaterial
				color={BUSH_BASE_COLOR}
				roughness={0.42}
				clearcoat={0.22}
			/>
		</mesh>
	);
}

export default function CuteBush({
	position,
	scale = 1,
	rotation = [0, 0, 0],
}: Props) {
	const randomLeaves = useMemo(() => {
		const colors = ['#86efac', '#bbf7d0', '#d9f99d', '#4ade80'];

		return Array.from({ length: 10 }).map((_, i) => {
			const side = i % 2 === 0 ? -1 : 1;

			return {
				position: [
					(Math.random() - 0.5) * 1.35,
					0.34 + Math.random() * 0.65,
					-0.12 + Math.random() * 0.75,
				] as [number, number, number],

				rotation: [
					-0.75 - Math.random() * 0.85,
					(Math.random() - 0.5) * 0.9,
					side * (0.25 + Math.random() * 1.8),
				] as [number, number, number],

				scale: 0.38 + Math.random() * 0.28,

				color: colors[Math.floor(Math.random() * colors.length)],
			};
		});
	}, []);

	return (
		<group position={position} scale={scale} rotation={rotation}>
			{/* 둥근 한 컬러 베이스 */}
			<Volume position={[0, 0.32, 0]} scale={[1.28, 0.62, 0.78]} />
			<Volume position={[-0.46, 0.34, 0.02]} scale={[0.8, 0.58, 0.7]} />
			<Volume position={[0.46, 0.34, 0.02]} scale={[0.8, 0.58, 0.7]} />
			<Volume position={[0, 0.58, -0.04]} scale={[0.82, 0.62, 0.72]} />
			<Volume position={[-0.25, 0.5, 0.18]} scale={[0.65, 0.48, 0.5]} />
			<Volume position={[0.25, 0.5, 0.18]} scale={[0.65, 0.48, 0.5]} />

			{/* 랜덤 방향 잎 */}
			{randomLeaves.map((leaf, i) => (
				<Leaf
					key={`random-leaf-${i}`}
					position={leaf.position}
					rotation={leaf.rotation}
					scale={leaf.scale * 0.8}
					color={leaf.color}
				/>
			))}
		</group>
	);
}
