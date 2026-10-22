'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SphereGeometry, type BufferGeometry, type Group } from 'three';
import { mergeBufferGeometries } from 'three-stdlib';

let cloudGeometry: BufferGeometry | undefined;

function getCloudGeometry() {
	if (cloudGeometry) return cloudGeometry;
	const parts = [
		[-0.55, 0, 0], [0, 0.15, 0], [0.55, 0, 0],
		[-0.15, -0.05, 0], [0.25, -0.05, 0],
	].map(([x, y, z]) => new SphereGeometry(0.45, 32, 32).translate(x, y, z));
	const merged = mergeBufferGeometries(parts);
	parts.forEach((part) => part.dispose());
	if (!merged) throw new Error('Could not merge cloud geometry');
	cloudGeometry = merged;
	return cloudGeometry;
}

type Props = {
	position: [number, number, number];
	scale?: number;
};

export default function CuteCloud({ position, scale = 1 }: Props) {
	const cloudRef = useRef<Group>(null);
	const reducedMotion = useRef(false);
	const phase = position[0] * 0.7 + position[2] * 0.4;

	useEffect(() => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => { reducedMotion.current = preference.matches; };
		update();
		preference.addEventListener('change', update);
		return () => preference.removeEventListener('change', update);
	}, []);

	useFrame(({ clock }) => {
		if (!cloudRef.current) return;
		cloudRef.current.position.y = position[1] + (reducedMotion.current
			? 0
			: Math.sin(clock.elapsedTime * 0.45 + phase) * 0.045);
	});

	return (
		<group ref={cloudRef} position={position} scale={scale}>
			<mesh>
				<primitive object={getCloudGeometry()} attach="geometry" dispose={null} />
				<meshStandardMaterial color="#fffdf9" roughness={1} metalness={0} />
			</mesh>
		</group>
	);
}
