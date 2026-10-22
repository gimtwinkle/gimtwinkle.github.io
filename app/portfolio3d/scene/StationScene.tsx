// portfolio3d/scene/StationScene.tsx
'use client';

import { Text } from '@react-three/drei';

type Props = {
	onEnterVillage: () => void;
};

export default function StationScene({ onEnterVillage }: Props) {
	return (
		<group>
			<ambientLight intensity={0.7} />
			<directionalLight position={[3, 5, 4]} intensity={1} />

			<Text
				position={[0, 2.4, 0]}
				fontSize={0.45}
				color="#ff5ca8"
				anchorX="center"
			>
				Welcome to Twinkle Village
			</Text>

			<mesh position={[0, 0.4, 0]} onClick={onEnterVillage}>
				<boxGeometry args={[2.4, 0.8, 0.4]} />
				<meshPhysicalMaterial color="#bdefff" clearcoat={0.8} />
			</mesh>

			<Text
				position={[0, 0.4, 0.25]}
				fontSize={0.22}
				color="#ffffff"
				anchorX="center"
			>
				START
			</Text>
		</group>
	);
}
