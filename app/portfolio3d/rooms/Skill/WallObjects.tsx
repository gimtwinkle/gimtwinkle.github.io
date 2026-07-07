'use client';

import { Text } from '@react-three/drei';
import { C } from './colors';
import { Plant, Star } from './CuteDecor';
import RoundedBox from '../../components/RoundedBox';

export function Window() {
	return (
		<group position={[-2.1, 1.72, -3.02]}>
			<RoundedBox
				args={[1.05, 1.32, 0.1]}
				radius={0.52}
				smoothness={20}
				castShadow
			>
				<meshStandardMaterial color={C.pink} />
			</RoundedBox>

			<RoundedBox
				args={[0.78, 1.05, 0.05]}
				radius={0.38}
				smoothness={20}
				position={[0, 0, 0.06]}
			>
				<meshStandardMaterial
					color={C.sky}
					emissive={C.sky}
					emissiveIntensity={0.22}
				/>
			</RoundedBox>

			<mesh position={[0, 0, 0.1]}>
				<boxGeometry args={[0.05, 0.92, 0.04]} />
				<meshStandardMaterial color={C.cream} />
			</mesh>

			<mesh position={[0, 0.05, 0.1]}>
				<boxGeometry args={[0.72, 0.05, 0.04]} />
				<meshStandardMaterial color={C.cream} />
			</mesh>

			<RoundedBox
				args={[0.92, 0.12, 0.22]}
				radius={0.06}
				position={[0, -0.72, 0.12]}
			>
				<meshStandardMaterial color={C.wood} />
			</RoundedBox>

			<Plant position={[0.42, -0.62, 0.2]} scale={0.65} />
		</group>
	);
}

export function PegBoard() {
	return (
		<group position={[0.3, 1.67, -3.0]}>
			<RoundedBox args={[1.45, 0.85, 0.08]} radius={0.08} castShadow>
				<meshStandardMaterial color={C.woodDeep} />
			</RoundedBox>

			<RoundedBox
				args={[1.32, 0.72, 0.045]}
				radius={0.06}
				position={[0, 0, 0.04]}
			>
				<meshStandardMaterial color={C.wood} />
			</RoundedBox>

			{Array.from({ length: 24 }).map((_, i) => (
				<mesh
					key={i}
					position={[
						-0.55 + (i % 6) * 0.22,
						0.27 - Math.floor(i / 6) * 0.17,
						0.09,
					]}
				>
					<sphereGeometry args={[0.014, 10, 10]} />
					<meshStandardMaterial color={C.cream} />
				</mesh>
			))}

			{[-0.38, -0.08, 0.25, 0.48].map((x, i) => (
				<RoundedBox
					key={i}
					args={[0.2, 0.26, 0.035]}
					radius={0.025}
					position={[x, -0.08 + (i % 2) * 0.12, 0.1]}
				>
					<meshStandardMaterial
						color={[C.pink, C.sky, C.lavender, C.mint][i]}
					/>
				</RoundedBox>
			))}

			<Star position={[-0.56, 0.22, 0.12]} scale={0.28} />
		</group>
	);
}

export function WorkshopSign() {
	return (
		<group position={[0.15, 2.45, -2.93]}>
			<RoundedBox
				args={[2.35, 0.65, 0.12]}
				radius={0.28}
				smoothness={20}
				castShadow
			>
				<meshStandardMaterial color={C.cream} />
			</RoundedBox>

			<Text
				position={[0.1, 0.1, 0.09]}
				fontSize={0.24}
				color={C.lavender}
				anchorX="center"
			>
				Twinkle
			</Text>
			<Text
				position={[0.15, -0.18, 0.09]}
				fontSize={0.22}
				color={C.blue}
				anchorX="center"
			>
				Workshop
			</Text>

			<Star position={[-0.9, 0.08, 0.12]} scale={0.55} />
			<Star position={[0.95, -0.08, 0.12]} scale={0.38} />
		</group>
	);
}

export function PlanBoard() {
	return (
		<group position={[3.55, 1.65, -1.85]} rotation={[0, -Math.PI / 2, 0]}>
			<RoundedBox args={[0.75, 0.95, 0.08]} radius={0.08} castShadow>
				<meshStandardMaterial color={C.woodDeep} />
			</RoundedBox>

			<RoundedBox
				args={[0.62, 0.78, 0.04]}
				radius={0.05}
				position={[0, 0, 0.05]}
			>
				<meshStandardMaterial color="#3f3b35" />
			</RoundedBox>

			<Text
				position={[0, 0.22, 0.09]}
				fontSize={0.09}
				color={C.white}
				anchorX="center"
			>
				Plan
			</Text>
			<Text
				position={[0, 0.04, 0.09]}
				fontSize={0.09}
				color={C.white}
				anchorX="center"
			>
				Design
			</Text>
			<Text
				position={[0, -0.14, 0.09]}
				fontSize={0.09}
				color={C.white}
				anchorX="center"
			>
				Build
			</Text>
			<Text
				position={[0, -0.32, 0.09]}
				fontSize={0.08}
				color={C.white}
				anchorX="center"
			>
				Twinkle!
			</Text>
		</group>
	);
}

export function BackDoor({ onBack }: { onBack?: () => void }) {
	return (
		<group position={[3.25, 0.76, 1.6]} rotation={[0, -Math.PI / 2, 0]}>
			<RoundedBox
				args={[0.9, 1.45, 0.16]}
				radius={0.32}
				smoothness={18}
				castShadow
				onClick={onBack}
			>
				<meshStandardMaterial color={C.pink} />
			</RoundedBox>

			<mesh position={[0.25, 0.02, 0.11]}>
				<sphereGeometry args={[0.055, 20, 20]} />
				<meshStandardMaterial color={C.yellow} />
			</mesh>

			<RoundedBox
				args={[0.38, 0.38, 0.04]}
				radius={0.18}
				position={[0, 0.35, 0.1]}
			>
				<meshStandardMaterial
					color={C.yellow}
					emissive={C.yellow}
					emissiveIntensity={0.3}
				/>
			</RoundedBox>

			<Text
				position={[0, -0.92, 0.12]}
				fontSize={0.1}
				color={C.white}
				anchorX="center"
			>
				EXIT
			</Text>
		</group>
	);
}
