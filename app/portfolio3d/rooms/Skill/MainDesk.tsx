'use client';

import { Text } from '@react-three/drei';
import { C } from './colors';
import { CuteLamp, Star } from './CuteDecor';
import RoundedBox from '../../components/RoundedBox';

function Keyboard() {
	return (
		<group position={[-0.1, 0.2, 0.28]}>
			<RoundedBox args={[0.58, 0.05, 0.28]} radius={0.03}>
				<meshStandardMaterial color={C.white} />
			</RoundedBox>

			{Array.from({ length: 18 }).map((_, i) => (
				<RoundedBox
					key={i}
					args={[0.045, 0.018, 0.035]}
					radius={0.006}
					position={[
						-0.23 + (i % 6) * 0.09,
						0.035,
						-0.08 + Math.floor(i / 6) * 0.07,
					]}
				>
					<meshStandardMaterial color="#f1eee8" />
				</RoundedBox>
			))}
		</group>
	);
}

export default function MainDesk() {
	return (
		<group position={[0, 0.58, -0.55]}>
			<RoundedBox
				args={[2.35, 0.2, 1.08]}
				radius={0.13}
				smoothness={12}
				castShadow
			>
				<meshStandardMaterial color={C.wood} roughness={0.45} />
			</RoundedBox>

			<RoundedBox
				args={[0.45, 0.78, 0.78]}
				radius={0.08}
				position={[-0.82, -0.47, 0]}
				castShadow
			>
				<meshStandardMaterial color={C.mint} />
			</RoundedBox>

			<RoundedBox
				args={[0.45, 0.78, 0.78]}
				radius={0.08}
				position={[0.82, -0.47, 0]}
				castShadow
			>
				<meshStandardMaterial color={C.yellow} />
			</RoundedBox>

			{[-0.2, -0.45].map((y, i) => (
				<RoundedBox
					key={i}
					args={[0.32, 0.16, 0.05]}
					radius={0.03}
					position={[0.82, y, 0.42]}
				>
					<meshStandardMaterial color={[C.pink, C.lavender][i]} />
				</RoundedBox>
			))}

			{/* monitor */}
			<RoundedBox
				args={[0.82, 0.54, 0.08]}
				radius={0.08}
				smoothness={10}
				position={[0, 0.52, -0.25]}
				castShadow
			>
				<meshStandardMaterial color={C.white} />
			</RoundedBox>

			<RoundedBox
				args={[0.66, 0.37, 0.04]}
				radius={0.05}
				position={[0, 0.52, -0.19]}
			>
				<meshStandardMaterial
					color={C.sky}
					emissive={C.sky}
					emissiveIntensity={0.2}
				/>
			</RoundedBox>

			<Text
				position={[0, 0.53, -0.155]}
				fontSize={0.13}
				color={C.lavender}
				anchorX="center"
				anchorY="middle"
			>
				Create!
			</Text>

			<mesh position={[0, 0.22, -0.23]}>
				<cylinderGeometry args={[0.04, 0.04, 0.22, 16]} />
				<meshStandardMaterial color="#e9e1d0" />
			</mesh>

			<RoundedBox
				args={[0.32, 0.04, 0.2]}
				radius={0.03}
				position={[0, 0.09, -0.23]}
			>
				<meshStandardMaterial color="#e9e1d0" />
			</RoundedBox>

			<Keyboard />

			<RoundedBox
				args={[0.18, 0.04, 0.28]}
				radius={0.04}
				position={[0.55, 0.2, 0.24]}
			>
				<meshStandardMaterial color={C.white} />
			</RoundedBox>

			<CuteLamp position={[-0.75, 0.14, -0.05]} />
			<CuteLamp position={[0.82, 0.14, -0.06]} />
			<Star position={[0.95, 0.34, -0.35]} scale={0.5} />
		</group>
	);
}
