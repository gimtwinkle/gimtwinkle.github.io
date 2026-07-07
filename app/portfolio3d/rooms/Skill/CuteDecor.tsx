'use client';

import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { C } from './colors';
import RoundedBox from '../../components/RoundedBox';

export function Star({
	position,
	scale = 1,
}: {
	position: [number, number, number];
	scale?: number;
}) {
	const ref = useRef<THREE.Group>(null);

	useFrame(({ clock }) => {
		if (!ref.current) return;
		ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.8) * 0.08;
		ref.current.position.y =
			position[1] + Math.sin(clock.elapsedTime * 2) * 0.015;
	});

	return (
		<group ref={ref} position={position} scale={scale}>
			<Text fontSize={0.34} color={C.yellow} anchorX="center" anchorY="middle">
				★
			</Text>
		</group>
	);
}

export function Plant({
	position,
	scale = 1,
}: {
	position: [number, number, number];
	scale?: number;
}) {
	return (
		<group position={position} scale={scale}>
			<RoundedBox
				args={[0.25, 0.2, 0.25]}
				radius={0.05}
				smoothness={8}
				position={[0, 0.1, 0]}
				castShadow
			>
				<meshStandardMaterial color={C.yellow} />
			</RoundedBox>

			{[
				[-0.09, 0.25, 0],
				[0.08, 0.29, 0.02],
				[0, 0.34, -0.04],
				[-0.02, 0.25, 0.08],
			].map((p, i) => (
				<mesh key={i} position={p as [number, number, number]} castShadow>
					<sphereGeometry args={[0.11, 18, 18]} />
					<meshStandardMaterial color={C.green} />
				</mesh>
			))}
		</group>
	);
}

export function CuteLamp({ position }: { position: [number, number, number] }) {
	const light = useRef<THREE.PointLight>(null);

	useFrame(({ clock }) => {
		if (!light.current) return;
		light.current.intensity = 0.8 + Math.sin(clock.elapsedTime * 2.5) * 0.08;
	});

	return (
		<group position={position}>
			<mesh position={[0, 0.38, 0]}>
				<cylinderGeometry args={[0.035, 0.035, 0.72, 16]} />
				<meshStandardMaterial color={C.woodDeep} />
			</mesh>

			<RoundedBox
				args={[0.34, 0.16, 0.28]}
				radius={0.08}
				position={[0, 0.78, 0]}
				castShadow
			>
				<meshStandardMaterial color={C.pink} />
			</RoundedBox>

			<mesh position={[0, 0.62, 0]}>
				<sphereGeometry args={[0.12, 24, 24]} />
				<meshStandardMaterial
					color="#fff6bf"
					emissive="#fff1a8"
					emissiveIntensity={1.8}
				/>
			</mesh>

			<pointLight
				ref={light}
				position={[0, 0.65, 0]}
				intensity={0.8}
				distance={2.5}
				color="#fff1bc"
			/>
		</group>
	);
}

export function TinyBox({
	position,
	color = C.lavender,
}: {
	position: [number, number, number];
	color?: string;
}) {
	return (
		<RoundedBox
			args={[0.28, 0.22, 0.28]}
			radius={0.05}
			smoothness={8}
			position={position}
			castShadow
		>
			<meshStandardMaterial color={color} roughness={0.45} />
		</RoundedBox>
	);
}

export function DrawerSet({
	position,
}: {
	position: [number, number, number];
}) {
	return (
		<group position={position}>
			<RoundedBox args={[0.7, 0.8, 0.38]} radius={0.08} castShadow>
				<meshStandardMaterial color={C.wood} />
			</RoundedBox>

			{[0.22, -0.05, -0.32].map((y, i) => (
				<RoundedBox
					key={i}
					args={[0.56, 0.2, 0.05]}
					radius={0.04}
					position={[0, y, 0.22]}
				>
					<meshStandardMaterial color={[C.pink, C.mint, C.lavender][i]} />
				</RoundedBox>
			))}

			{[0.22, -0.05, -0.32].map((y, i) => (
				<mesh key={`knob-${i}`} position={[0, y, 0.27]}>
					<sphereGeometry args={[0.035, 16, 16]} />
					<meshStandardMaterial color={C.yellow} />
				</mesh>
			))}
		</group>
	);
}
