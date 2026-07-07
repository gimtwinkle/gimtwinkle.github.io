'use client';

import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { toCreasedNormals } from 'three-stdlib';
import type { ThreeElements } from '@react-three/fiber';

const eps = 0.00001;

type RoundedBoxProps = Omit<ThreeElements['mesh'], 'args'> & {
	args?: [number?, number?, number?];
	radius?: number;
	steps?: number;
	smoothness?: number;
	bevelSegments?: number;
	creaseAngle?: number;
};

function createShape(width: number, height: number, radiusValue: number) {
	const shape = new THREE.Shape();
	const radius = Math.max(radiusValue - eps, eps);
	const widthRadius = Math.max(width - radius * 2, eps);
	const heightRadius = Math.max(height - radius * 2, eps);

	shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
	shape.absarc(eps, heightRadius, eps, Math.PI, Math.PI / 2, true);
	shape.absarc(widthRadius, heightRadius, eps, Math.PI / 2, 0, true);
	shape.absarc(widthRadius, eps, eps, 0, -Math.PI / 2, true);

	return shape;
}

const RoundedBox = forwardRef<THREE.Mesh, RoundedBoxProps>(
	function RoundedBox(
		{
			args: [width = 1, height = 1, depth = 1] = [],
			radius = 0.05,
			steps = 1,
			smoothness = 4,
			bevelSegments = 4,
			creaseAngle = 0.4,
			children,
			...props
		},
		ref
	) {
		const geometry = useMemo(() => {
			const safeRadius = Math.min(radius, width / 2, height / 2, depth / 2);
			const shape = createShape(width, height, safeRadius);
			const nextGeometry = new THREE.ExtrudeGeometry(shape, {
				depth: Math.max(depth - safeRadius * 2, eps),
				bevelEnabled: true,
				bevelSegments: bevelSegments * 2,
				steps,
				bevelSize: Math.max(safeRadius - eps, eps),
				bevelThickness: safeRadius,
				curveSegments: smoothness,
			});

			nextGeometry.center();
			toCreasedNormals(nextGeometry, creaseAngle);

			return nextGeometry;
		}, [bevelSegments, creaseAngle, depth, height, radius, smoothness, steps, width]);

		return (
			<mesh ref={ref} {...props}>
				<primitive object={geometry} attach="geometry" />
				{children}
			</mesh>
		);
	}
);

export default RoundedBox;
