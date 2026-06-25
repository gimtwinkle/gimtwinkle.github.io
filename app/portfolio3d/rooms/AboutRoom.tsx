'use client';

import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const theme = {
	cream: '#fffdf8',
	pink: '#ff9ecb',
	hotPink: '#ff5ca8',
	sky: '#c7f3ff',
	yellow: '#fff176',
	blue: '#60a5fa',
	green: '#9be77d',
	lavender: '#ddd6fe',
	peach: '#ffd1b8',
	mint: '#a7f3d0',
};

function Candy({ color }: { color: string }) {
	return (
		<meshPhysicalMaterial
			color={color}
			roughness={0.26}
			clearcoat={0.75}
			clearcoatRoughness={0.24}
			sheen={1}
			sheenRoughness={0.5}
			side={THREE.DoubleSide}
		/>
	);
}

function Wall({
	position,
	rotation = [0, 0, 0],
	color,
	width,
}: {
	position: [number, number, number];
	rotation?: [number, number, number];
	color: string;
	width: number;
}) {
	return (
		<group position={position} rotation={rotation}>
			<mesh receiveShadow>
				<planeGeometry args={[width, 4.2]} />
				<Candy color={color} />
			</mesh>

			<RoundedBox
				position={[0, -1.95, 0.035]}
				args={[width, 0.16, 0.07]}
				radius={0.05}
				smoothness={8}
			>
				<Candy color="#ffffff" />
			</RoundedBox>

			<RoundedBox
				position={[0, 1.98, 0.03]}
				args={[width, 0.07, 0.05]}
				radius={0.03}
				smoothness={6}
			>
				<Candy color="#ffffff" />
			</RoundedBox>
		</group>
	);
}

function ProfileBoard() {
	return (
		<group position={[0, 2.2, -3.05]}>
			<RoundedBox
				args={[3.8, 2.2, 0.12]}
				radius={0.2}
				smoothness={12}
				castShadow
			>
				<Candy color={theme.cream} />
			</RoundedBox>

			<RoundedBox
				position={[-1.25, 0.25, 0.08]}
				args={[0.95, 0.95, 0.08]}
				radius={0.48}
				smoothness={16}
				castShadow
			>
				<Candy color={theme.pink} />
			</RoundedBox>

			<Text
				position={[-1.25, 0.25, 0.14]}
				fontSize={0.32}
				color="#ffffff"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				ME
			</Text>

			<Text
				position={[0.55, 0.62, 0.12]}
				fontSize={0.22}
				color="#334155"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				UI Publisher
			</Text>

			<Text
				position={[0.55, 0.3, 0.12]}
				fontSize={0.13}
				color="#64748b"
				anchorX="center"
				anchorY="middle"
			>
				React · Next.js · UI/UX
			</Text>

			<Text
				position={[0.55, -0.08, 0.12]}
				fontSize={0.105}
				color="#475569"
				anchorX="center"
				anchorY="middle"
				maxWidth={1.8}
				lineHeight={1.35}
			>
				13년차 UI 개발자. 금융권 앱 운영과 웹 접근성, 반응형 UI 작업을 중심으로
				일해요.
			</Text>

			<RoundedBox
				position={[0.55, -0.72, 0.1]}
				args={[1.4, 0.28, 0.06]}
				radius={0.14}
				smoothness={10}
				castShadow
			>
				<Candy color={theme.hotPink} />
			</RoundedBox>

			<Text
				position={[0.55, -0.72, 0.16]}
				fontSize={0.1}
				color="#ffffff"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				INTJ · Fast Worker
			</Text>
		</group>
	);
}

function SkillBubble({
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
				args={[1.05, 0.36, 0.08]}
				radius={0.18}
				smoothness={10}
				castShadow
			>
				<Candy color={color} />
			</RoundedBox>

			<Text
				position={[0, 0, 0.07]}
				fontSize={0.105}
				color="#ffffff"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				{label}
			</Text>
		</group>
	);
}

function Plant({
	position,
	scale = 1,
}: {
	position: [number, number, number];
	scale?: number;
}) {
	return (
		<group position={position} scale={scale}>
			<RoundedBox
				position={[0, 0.12, 0]}
				args={[0.42, 0.3, 0.42]}
				radius={0.14}
				smoothness={10}
				castShadow
			>
				<Candy color={theme.peach} />
			</RoundedBox>

			{[
				[-0.14, 0.38, 0, -0.5],
				[0.14, 0.42, 0, 0.5],
				[0, 0.52, -0.03, 0],
				[-0.22, 0.34, 0.02, -0.8],
				[0.22, 0.36, 0.02, 0.8],
			].map(([x, y, z, r], i) => (
				<mesh
					key={i}
					position={[x, y, z]}
					rotation={[0, 0, r]}
					scale={[0.38, 0.75, 0.12]}
					castShadow
				>
					<sphereGeometry args={[0.18, 18, 18]} />
					<Candy color={i % 2 === 0 ? '#53bf39' : '#7bdc65'} />
				</mesh>
			))}
		</group>
	);
}

function ExitDoor() {
	return (
		<group position={[0, 0, 3.18]} rotation={[0, Math.PI, 0]}>
			<RoundedBox
				position={[0, 0.9, 0]}
				args={[1.35, 1.75, 0.14]}
				radius={0.24}
				smoothness={12}
				castShadow
			>
				<Candy color={theme.blue} />
			</RoundedBox>

			<Text
				position={[0, 1.05, -0.09]}
				fontSize={0.2}
				color="#ffffff"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				EXIT
			</Text>
		</group>
	);
}

export default function AboutRoom() {
	return (
		<group position={[0, -0.2, 0]}>
			<ambientLight intensity={0.9} />
			<directionalLight
				position={[2, 5, 3]}
				intensity={0.7}
				color="#fff7ed"
				castShadow
			/>

			{/* floor */}
			<mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[9.4, 6.5]} />
				<Candy color={theme.green} />
			</mesh>

			{/* walls */}
			<Wall position={[0, 2.1, -3.2]} color={theme.sky} width={9.4} />
			<Wall
				position={[-4.7, 2.1, 0]}
				rotation={[0, Math.PI / 2, 0]}
				color="#ffd1e8"
				width={6.4}
			/>
			<Wall
				position={[4.7, 2.1, 0]}
				rotation={[0, -Math.PI / 2, 0]}
				color={theme.yellow}
				width={6.4}
			/>
			<Wall
				position={[0, 2.1, 3.2]}
				rotation={[0, Math.PI, 0]}
				color={theme.lavender}
				width={9.4}
			/>

			{/* title */}
			<group position={[0, 3.95, -3.1]}>
				<RoundedBox
					args={[2.2, 0.58, 0.18]}
					radius={0.26}
					smoothness={12}
					castShadow
				>
					<Candy color={theme.hotPink} />
				</RoundedBox>

				<Text
					position={[0, 0, 0.12]}
					fontSize={0.28}
					color="#ffffff"
					anchorX="center"
					anchorY="middle"
					fontWeight={900}
				>
					ABOUT
				</Text>
			</group>

			<ProfileBoard />

			<SkillBubble
				label="웹 접근성"
				position={[-3.1, 2.7, -3.05]}
				color={theme.blue}
			/>
			<SkillBubble
				label="금융 앱 운영"
				position={[3.1, 2.7, -3.05]}
				color={theme.hotPink}
			/>
			<SkillBubble
				label="React"
				position={[-3.1, 1.7, -3.05]}
				color={theme.mint}
			/>
			<SkillBubble
				label="Next.js"
				position={[3.1, 1.7, -3.05]}
				color={theme.yellow}
			/>

			<Plant position={[-3.8, 0.02, -2.3]} scale={1.1} />
			<Plant position={[3.8, 0.02, -2.3]} scale={1.1} />

			<mesh
				position={[0, 0.018, 0.6]}
				rotation={[-Math.PI / 2, 0, 0]}
				receiveShadow
			>
				<circleGeometry args={[1.85, 64]} />
				<Candy color={theme.peach} />
			</mesh>

			<mesh position={[0, 0.028, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
				<ringGeometry args={[1.28, 1.44, 64]} />
				<meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
			</mesh>

			<ExitDoor />
		</group>
	);
}
