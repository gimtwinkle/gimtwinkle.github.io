'use client';

import { RoundedBox, Text } from '@react-three/drei';

type Props = {
	text: string;
	position: [number, number, number];
};

export default function CuteSign({ text, position }: Props) {
	return (
		<group position={position}>
			<mesh position={[-0.95, 0.45, 0]} castShadow>
				<cylinderGeometry args={[0.08, 0.08, 0.9, 24]} />
				<meshPhysicalMaterial color="#d97706" roughness={0.08} clearcoat={1} />
			</mesh>

			<mesh position={[0.95, 0.45, 0]} castShadow>
				<cylinderGeometry args={[0.08, 0.08, 0.9, 24]} />
				<meshPhysicalMaterial color="#d97706" roughness={0.08} clearcoat={1} />
			</mesh>

			<RoundedBox
				position={[0, 0.95, 0]}
				args={[2.6, 0.85, 0.18]}
				radius={0.24}
				smoothness={10}
				castShadow
			>
				<meshPhysicalMaterial color="#fb7185" roughness={0.04} clearcoat={1} />
			</RoundedBox>

			<Text
				position={[0, 0.97, 0.13]}
				fontSize={0.22}
				color="#ffffff"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				{text}
			</Text>
		</group>
	);
}
