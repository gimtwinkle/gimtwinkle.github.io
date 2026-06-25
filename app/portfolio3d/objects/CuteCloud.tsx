'use client';

type Props = {
	position: [number, number, number];
	scale?: number;
};

export default function CuteCloud({ position, scale = 1 }: Props) {
	return (
		<group position={position} scale={scale}>
			{[
				[-0.55, 0, 0],
				[0, 0.15, 0],
				[0.55, 0, 0],
				[-0.15, -0.05, 0],
				[0.25, -0.05, 0],
			].map(([x, y, z], i) => (
				<mesh key={i} position={[x, y, z]}>
					<sphereGeometry args={[0.45, 32, 32]} />
					<meshPhysicalMaterial
						color="#ffffff"
						roughness={0.08}
						clearcoat={1}
					/>
				</mesh>
			))}
		</group>
	);
}
