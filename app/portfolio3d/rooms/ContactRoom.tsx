'use client';

import { Text } from '@react-three/drei';

import RoundedBox from '../components/RoundedBox';

type RoomProps = {
	onBack: () => void;
};

function Candy({ color }: { color: string }) {
	return (
		<meshPhysicalMaterial
			color={color}
			roughness={0.24}
			clearcoat={0.75}
			clearcoatRoughness={0.25}
		/>
	);
}

function Letter({
	label,
	position,
	color,
}: {
	label: string;
	position: [number, number, number];
	color: string;
}) {
	return (
		<group position={position}>
			<RoundedBox
				args={[1.35, 0.85, 0.08]}
				radius={0.08}
				smoothness={8}
				castShadow
			>
				<Candy color="#fffdf8" />
			</RoundedBox>

			<mesh position={[0, 0.08, 0.06]} rotation={[0, 0, 0.58]}>
				<boxGeometry args={[0.85, 0.035, 0.02]} />
				<Candy color={color} />
			</mesh>

			<mesh position={[0, 0.08, 0.061]} rotation={[0, 0, -0.58]}>
				<boxGeometry args={[0.85, 0.035, 0.02]} />
				<Candy color={color} />
			</mesh>

			<Text
				position={[0, -0.2, 0.08]}
				fontSize={0.13}
				color="#334155"
				anchorX="center"
				fontWeight={900}
			>
				{label}
			</Text>
		</group>
	);
}

export default function ContactRoom({ onBack }: RoomProps) {
	return (
		<group>
			<ambientLight intensity={0.7} />
			<directionalLight position={[3, 5, 4]} intensity={0.8} castShadow />

			<mesh position={[0, -0.05, 0]} receiveShadow>
				<boxGeometry args={[8, 0.1, 6]} />
				<Candy color="#bdefff" />
			</mesh>

			<mesh position={[0, 2, -3]} receiveShadow>
				<boxGeometry args={[8, 4, 0.12]} />
				<Candy color="#f5d0fe" />
			</mesh>

			<Text
				position={[0, 3.45, -2.85]}
				fontSize={0.38}
				color="#a855f7"
				anchorX="center"
				fontWeight={900}
			>
				POST OFFICE
			</Text>

			{/* 우체통 */}
			<RoundedBox
				position={[0, 1, -1.6]}
				args={[1.45, 1.4, 0.8]}
				radius={0.28}
				smoothness={12}
				castShadow
			>
				<Candy color="#ff5ca8" />
			</RoundedBox>

			<RoundedBox
				position={[0, 1.45, -1.15]}
				args={[1, 0.18, 0.12]}
				radius={0.06}
				smoothness={8}
			>
				<Candy color="#ffffff" />
			</RoundedBox>

			<Text
				position={[0, 1.02, -1.12]}
				fontSize={0.2}
				color="#ffffff"
				anchorX="center"
				fontWeight={900}
			>
				MAIL
			</Text>

			<Letter label="GitHub" position={[-2.1, 1.35, -2.45]} color="#4da3ff" />
			<Letter label="Email" position={[0, 2.25, -2.45]} color="#ff5ca8" />
			<Letter label="Resume" position={[2.1, 1.35, -2.45]} color="#ffb703" />

			<RoundedBox
				position={[0, 0.75, 2.65]}
				args={[1.2, 1.5, 0.16]}
				radius={0.24}
				smoothness={10}
				castShadow
				onClick={onBack}
			>
				<Candy color="#4da3ff" />
			</RoundedBox>

			<Text
				position={[0, 0.85, 2.76]}
				fontSize={0.18}
				color="#ffffff"
				anchorX="center"
				fontWeight={900}
			>
				EXIT
			</Text>
		</group>
	);
}
