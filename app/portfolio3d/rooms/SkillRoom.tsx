'use client';

import { RoundedBox, Text } from '@react-three/drei';

type RoomProps = {
	onBack: () => void;
};

const skills = [
	['React', '#61dafb'],
	['Next.js', '#111827'],
	['TypeScript', '#3178c6'],
	['Storybook', '#ff4785'],
	['Accessibility', '#f59e0b'],
	['Figma', '#a855f7'],
] as const;

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

function SkillBook({
	label,
	color,
	position,
}: {
	label: string;
	color: string;
	position: [number, number, number];
}) {
	return (
		<group position={position}>
			<RoundedBox args={[0.7, 1, 0.18]} radius={0.08} smoothness={8} castShadow>
				<Candy color={color} />
			</RoundedBox>

			<Text
				position={[0, 0, 0.12]}
				fontSize={0.11}
				color="#ffffff"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
				rotation={[0, 0, Math.PI / 2]}
			>
				{label}
			</Text>
		</group>
	);
}

export default function SkillRoom({ onBack }: RoomProps) {
	return (
		<group>
			<ambientLight intensity={0.65} />
			<directionalLight position={[3, 5, 4]} intensity={0.8} castShadow />

			<mesh position={[0, -0.05, 0]} receiveShadow>
				<boxGeometry args={[8, 0.1, 6]} />
				<Candy color="#fff176" />
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
				SKILLS LIBRARY
			</Text>

			{/* 책장 */}
			<RoundedBox
				position={[0, 1.65, -2.75]}
				args={[5.6, 2.2, 0.28]}
				radius={0.18}
				smoothness={10}
				castShadow
			>
				<Candy color="#ffb703" />
			</RoundedBox>

			<RoundedBox
				position={[0, 1.65, -2.56]}
				args={[5.25, 1.85, 0.08]}
				radius={0.12}
				smoothness={8}
			>
				<Candy color="#fffdf8" />
			</RoundedBox>

			{skills.map(([label, color], i) => (
				<SkillBook
					key={label}
					label={label}
					color={color}
					position={[-2.1 + i * 0.85, 1.52, -2.45]}
				/>
			))}

			{/* 물약 */}
			{[
				[-1.2, 0.45, -1.2, '#38bdf8'],
				[0, 0.45, -1.1, '#fb7185'],
				[1.2, 0.45, -1.2, '#4ade80'],
			].map(([x, y, z, color], i) => (
				<group key={i} position={[x as number, y as number, z as number]}>
					<mesh position={[0, 0.18, 0]}>
						<sphereGeometry args={[0.22, 24, 24]} />
						<Candy color={color as string} />
					</mesh>
					<mesh position={[0, 0.45, 0]}>
						<cylinderGeometry args={[0.08, 0.1, 0.22, 16]} />
						<Candy color="#ffffff" />
					</mesh>
				</group>
			))}

			<RoundedBox
				position={[0, 0.75, 2.65]}
				args={[1.2, 1.5, 0.16]}
				radius={0.24}
				smoothness={10}
				castShadow
				onClick={onBack}
			>
				<Candy color="#a855f7" />
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
