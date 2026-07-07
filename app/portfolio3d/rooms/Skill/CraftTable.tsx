'use client';

import { Text } from '@react-three/drei';
import { C } from './colors';
import { Star } from './CuteDecor';
import RoundedBox from '../../components/RoundedBox';

export default function CraftTable() {
	return (
		<group position={[-1.8, 0.35, 1.25]}>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
				<circleGeometry args={[0.88, 48]} />
				<meshStandardMaterial color={C.lavender} />
			</mesh>

			<RoundedBox
				args={[1.35, 0.2, 0.72]}
				radius={0.16}
				smoothness={12}
				castShadow
			>
				<meshStandardMaterial color={C.yellow} />
			</RoundedBox>

			{[-0.5, 0.5].map((x) =>
				[-0.25, 0.25].map((z) => (
					<mesh key={`${x}-${z}`} position={[x, -0.35, z]}>
						<cylinderGeometry args={[0.045, 0.045, 0.65, 16]} />
						<meshStandardMaterial color={C.woodDeep} />
					</mesh>
				))
			)}

			<RoundedBox
				args={[0.78, 0.04, 0.44]}
				radius={0.04}
				position={[0, 0.13, 0]}
			>
				<meshStandardMaterial color="#70bd80" />
			</RoundedBox>

			<Text
				position={[0, 0.16, 0.01]}
				rotation={[-Math.PI / 2, 0, 0]}
				fontSize={0.08}
				color={C.white}
				anchorX="center"
			>
				WORK BOARD
			</Text>

			{[-0.42, -0.2, 0.22, 0.45].map((x, i) => (
				<RoundedBox
					key={i}
					args={[0.12, 0.035, 0.12]}
					radius={0.02}
					position={[x, 0.18, 0.2 - (i % 2) * 0.35]}
				>
					<meshStandardMaterial
						color={[C.pink, C.sky, C.lavender, C.cream][i]}
					/>
				</RoundedBox>
			))}

			<Star position={[-0.48, 0.25, 0.12]} scale={0.42} />
		</group>
	);
}
