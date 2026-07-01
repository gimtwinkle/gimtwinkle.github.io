'use client';

import { useGLTF } from '@react-three/drei';
import { Clone } from '@react-three/drei';

type GlbModelProps = {
	url: string;
	position?: [number, number, number];
	rotation?: [number, number, number];
	scale?: number | [number, number, number];
};

export default function GlbModel({
	url,
	position = [0, 0, 0],
	rotation = [0, 0, 0],
	scale = 1,
}: GlbModelProps) {
	const { scene } = useGLTF(url);

	return (
		<Clone
			object={scene}
			position={position}
			rotation={rotation}
			scale={scale}
		/>
	);
}
