'use client';

import { projects } from '@/asset/data/projects';
import { Html, Text, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import RoundedBox from '../components/RoundedBox';
const C = {
	bg: '#2f7edc',
	wall: '#86d7d8',
	wallDark: '#57b8bd',
	floor: '#8fd46b',
	floorLine: '#6dbd54',
	pink: '#ff6fae',
	pinkDark: '#e94f92',
	yellow: '#ffd34d',
	blue: '#42aee8',
	mint: '#35d6c3',
	cream: '#fff1c2',
	belt: '#4b4548',
	beltDark: '#2f2d31',
	box: '#f2bf79',
	green: '#47c96f',
	red: '#ff5b5b',
	lavender: '#c7b8ff',
	white: '#fffaf0',
};

const projectLabels = ['WON', 'NHN', 'SHOPBY', 'ETLAND', 'UI'];

export default function WorkFactoryScene() {
	const [selectedProject, setSelectedProject] = useState<
		(typeof projects)[number] | null
	>(null);

	return (
		<group position={[0, -0.2, 0]}>
			<ambientLight intensity={0.62} />
			<directionalLight position={[4, 7, 5]} intensity={1.15} castShadow />

			<pointLight
				position={[-3.1, 2.45, -1.1]}
				intensity={2.2}
				color="#ff4a4a"
			/>
			<pointLight
				position={[3.1, 2.45, -1.1]}
				intensity={2.2}
				color="#ff4a4a"
			/>

			<FactoryRoom />
			<BackWallDecor />

			<InMachine />
			<OutMachine />
			<CandyProjectMachine />

			<ConveyorBelt />

			<MovingBoxes onSelectProject={setSelectedProject} />

			{selectedProject && (
				<ProjectDetailOverlay
					project={selectedProject}
					onClose={() => setSelectedProject(null)}
				/>
			)}
		</group>
	);
}
function FactoryRoom() {
	return (
		<group>
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[9, 6]} />
				<meshStandardMaterial color={C.floor} roughness={0.45} />
			</mesh>

			{Array.from({ length: 10 }).map((_, i) => (
				<mesh
					key={`floor-x-${i}`}
					position={[-4.5 + i, 0.004, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
				>
					<planeGeometry args={[0.025, 6]} />
					<meshStandardMaterial color={C.floorLine} />
				</mesh>
			))}

			{Array.from({ length: 7 }).map((_, i) => (
				<mesh
					key={`floor-z-${i}`}
					position={[0, 0.005, -3 + i]}
					rotation={[-Math.PI / 2, 0, Math.PI / 2]}
				>
					<planeGeometry args={[0.025, 9]} />
					<meshStandardMaterial color={C.floorLine} />
				</mesh>
			))}

			{/* back wall */}
			<mesh position={[0, 1.8, -3]} receiveShadow>
				<boxGeometry args={[9, 3.6, 0.18]} />
				<meshStandardMaterial color={C.wall} roughness={0.38} />
			</mesh>

			{/* left wall */}
			<mesh
				position={[-4.5, 1.8, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[6, 3.6, 0.18]} />
				<meshStandardMaterial color={C.wallDark} roughness={0.38} />
			</mesh>

			{/* right soft wall */}
			<mesh
				position={[4.5, 1.8, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[6, 3.6, 0.12]} />
				<meshStandardMaterial color="#9ae8e7" roughness={0.4} />
			</mesh>

			{/* ceiling */}
			<mesh position={[0, 3.7, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[9, 6]} />
				<meshStandardMaterial color="#fff0b8" roughness={0.42} />
			</mesh>

			<RoundedBox
				position={[0, 3.63, -2.9]}
				args={[9.2, 0.22, 0.28]}
				radius={0.12}
				smoothness={8}
			>
				<meshPhysicalMaterial color={C.pink} roughness={0.12} clearcoat={1} />
			</RoundedBox>

			<RoundedBox
				position={[-4.42, 3.63, 0]}
				rotation={[0, Math.PI / 2, 0]}
				args={[6.2, 0.22, 0.28]}
				radius={0.12}
				smoothness={8}
			>
				<meshPhysicalMaterial color={C.pink} roughness={0.12} clearcoat={1} />
			</RoundedBox>

			<RoundedBox
				position={[4.42, 3.63, 0]}
				rotation={[0, Math.PI / 2, 0]}
				args={[6.2, 0.22, 0.28]}
				radius={0.12}
				smoothness={8}
			>
				<meshPhysicalMaterial color={C.pink} roughness={0.12} clearcoat={1} />
			</RoundedBox>
		</group>
	);
}

function BackWallDecor() {
	return (
		<group>
			{/* main pink frame */}
			<RoundedBox
				position={[0, 2.05, -2.84]}
				args={[4.7, 2.2, 0.18]}
				radius={0.22}
				smoothness={14}
				castShadow
			>
				<meshPhysicalMaterial color={C.pink} roughness={0.12} clearcoat={1} />
			</RoundedBox>

			{/* gold trim */}
			<RoundedBox
				position={[0, 2.05, -2.71]}
				args={[4.42, 2, 0.08]}
				radius={0.16}
				smoothness={12}
			>
				<meshPhysicalMaterial
					color="#d6a84f"
					roughness={0.18}
					metalness={0.35}
					clearcoat={1}
				/>
			</RoundedBox>

			{/* black LED board */}
			<RoundedBox
				position={[0, 2.05, -2.64]}
				args={[4.22, 1.8, 0.08]}
				radius={0.12}
				smoothness={10}
			>
				<meshStandardMaterial color="#151515" />
			</RoundedBox>

			{/* title */}
			<Text
				position={[0, 2.65, -2.57]}
				fontSize={0.25}
				color="#ff7eb6"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				★ WORK FACTORY ★
			</Text>

			<Text
				position={[0, 2.43, -2.57]}
				fontSize={0.105}
				color="#ffd36e"
				anchorX="center"
				anchorY="middle"
				fontWeight={800}
			>
				TWINKLE PROJECT MAKER
			</Text>

			{/* left panel */}
			<StatusPanel position={[-1.45, 2.05, -2.55]} title="PRODUCTION">
				<Text
					position={[0, 0.16, 0.04]}
					fontSize={0.28}
					color="#7cff73"
					anchorX="center"
				>
					1287
				</Text>
				<Text
					position={[0.48, 0.1, 0.04]}
					fontSize={0.09}
					color="#7cff73"
					anchorX="center"
				>
					PCS
				</Text>
				<Text
					position={[-0.28, -0.18, 0.04]}
					fontSize={0.095}
					color="#ffd36e"
					anchorX="center"
				>
					TARGET
				</Text>
				<Text
					position={[0.35, -0.18, 0.04]}
					fontSize={0.095}
					color="#ffd36e"
					anchorX="center"
				>
					2000
				</Text>

				{/* progress bar */}
				<RoundedBox
					position={[0, -0.38, 0.04]}
					args={[0.85, 0.08, 0.03]}
					radius={0.025}
				>
					<meshStandardMaterial color="#1c4c5d" />
				</RoundedBox>
				<RoundedBox
					position={[-0.13, -0.38, 0.07]}
					args={[0.56, 0.055, 0.03]}
					radius={0.02}
				>
					<meshStandardMaterial color="#54d7ff" />
				</RoundedBox>
			</StatusPanel>

			{/* center panel */}
			<StatusPanel position={[0, 2.05, -2.55]} title="STATUS">
				<Text
					position={[0, 0.02, 0.04]}
					fontSize={0.36}
					color="#75ff75"
					anchorX="center"
					anchorY="middle"
				>
					☺
				</Text>
				<Text
					position={[0, -0.34, 0.04]}
					fontSize={0.095}
					color="#75ff75"
					anchorX="center"
				>
					ALL SYSTEMS
				</Text>
				<Text
					position={[0, -0.47, 0.04]}
					fontSize={0.095}
					color="#75ff75"
					anchorX="center"
				>
					OPERATIONAL
				</Text>
			</StatusPanel>

			{/* right panel graph */}
			<StatusPanel position={[1.45, 2.05, -2.55]} title="SCHEDULE">
				{[
					[-0.36, 0.34, '#ff6fae'],
					[-0.12, 0.5, '#ffd45c'],
					[0.12, 0.28, '#76e8ff'],
					[0.36, 0.56, '#b693ff'],
				].map(([x, h, color], i) => (
					<RoundedBox
						key={i}
						position={[x as number, -0.22 + (h as number) / 2, 0.05]}
						args={[0.13, h as number, 0.035]}
						radius={0.02}
						smoothness={5}
					>
						<meshStandardMaterial color={color as string} />
					</RoundedBox>
				))}

				<Text
					position={[-0.36, -0.52, 0.04]}
					fontSize={0.06}
					color="#ffffff"
					anchorX="center"
				>
					MON
				</Text>
				<Text
					position={[-0.12, -0.52, 0.04]}
					fontSize={0.06}
					color="#ffffff"
					anchorX="center"
				>
					TUE
				</Text>
				<Text
					position={[0.12, -0.52, 0.04]}
					fontSize={0.06}
					color="#ffffff"
					anchorX="center"
				>
					WED
				</Text>
				<Text
					position={[0.36, -0.52, 0.04]}
					fontSize={0.06}
					color="#ffffff"
					anchorX="center"
				>
					THU
				</Text>
			</StatusPanel>

			{/* bottom ticker */}
			<RoundedBox
				position={[0, 1.29, -2.55]}
				args={[3.85, 0.28, 0.06]}
				radius={0.08}
				smoothness={8}
			>
				<meshStandardMaterial color="#202020" />
			</RoundedBox>

			<Text
				position={[-1.25, 1.29, -2.5]}
				fontSize={0.09}
				color="#ff7eb6"
				anchorX="center"
			>
				TODAY BEST ★ 15:30
			</Text>
			<Text
				position={[0.1, 1.29, -2.5]}
				fontSize={0.09}
				color="#ffd36e"
				anchorX="center"
			>
				EFFICIENCY 92.7%
			</Text>
			<Text
				position={[1.42, 1.29, -2.5]}
				fontSize={0.09}
				color="#54d7ff"
				anchorX="center"
			>
				NEXT 14:30
			</Text>

			{/* right cloud light */}
			<RoundedBox
				position={[3.75, 1.75, -2.82]}
				args={[1.05, 1.05, 0.14]}
				radius={0.16}
				smoothness={12}
			>
				<meshPhysicalMaterial color={C.yellow} roughness={0.12} clearcoat={1} />
			</RoundedBox>

			<RoundedBox
				position={[3.75, 1.75, -2.68]}
				args={[0.78, 0.78, 0.08]}
				radius={0.12}
				smoothness={10}
			>
				<meshStandardMaterial color="#8fe9ff" />
			</RoundedBox>

			<Text
				position={[3.75, 1.75, -2.62]}
				fontSize={0.3}
				color="#ffffff"
				anchorX="center"
				anchorY="middle"
			>
				☁
			</Text>
		</group>
	);
}
function StatusPanel({
	position,
	title,
	children,
}: {
	position: [number, number, number];
	title: string;
	children: React.ReactNode;
}) {
	return (
		<group position={position}>
			<RoundedBox args={[1.15, 0.95, 0.06]} radius={0.08} smoothness={8}>
				<meshStandardMaterial color="#242424" />
			</RoundedBox>

			<RoundedBox
				position={[0, 0, 0.035]}
				args={[1.05, 0.85, 0.035]}
				radius={0.06}
				smoothness={8}
			>
				<meshStandardMaterial color="#111111" />
			</RoundedBox>

			<Text
				position={[0, 0.34, 0.07]}
				fontSize={0.105}
				color="#ff7eb6"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				{title}
			</Text>

			{children}
		</group>
	);
}
function InMachine() {
	return (
		<group position={[-2.8, 0, -0.92]} rotation={[0, 0, 0]} scale={1.18}>
			<MachineBody label="IN" labelColor={C.pinkDark} />
		</group>
	);
}

function OutMachine() {
	return (
		<group position={[2.78, 0, -0.92]} rotation={[0, 0, 0]} scale={1.18}>
			<MachineBody label="OUT" labelColor={C.pinkDark} />
		</group>
	);
}
function MachineBody({
	label,
	labelColor,
}: {
	label: string;
	labelColor: string;
}) {
	return (
		<group>
			{/* 몸통: 볼륨 줄이고 플랫하게 */}
			<RoundedBox
				position={[label === 'OUT' ? 0.12 : -0.05, 0.88, 0]}
				args={[1.6, 1.58, 0.72]}
				radius={0.09}
				smoothness={8}
				castShadow
			>
				<meshPhysicalMaterial
					color={C.lavender}
					roughness={0.22}
					clearcoat={0.55}
				/>
			</RoundedBox>

			{/* 앞면 큰 패널 */}
			<RoundedBox
				position={[0, 0.5, 0.39]}
				args={[1, 1.8, 0.1]}
				radius={0.11}
				smoothness={8}
			>
				<meshPhysicalMaterial color="#f7e4b8" clearcoat={0.65} />
			</RoundedBox>

			{/* 입구 프레임 */}
			{/* <RoundedBox
				position={[0, 0.65, 0.45]}
				args={[0.9, 1.4, 0.1]}
				radius={0.1}
				smoothness={8}
			>
				<meshPhysicalMaterial
					color={C.yellow}
					roughness={0.16}
					clearcoat={0.75}
				/>
			</RoundedBox> */}

			{/* 검정 구멍 */}
			<RoundedBox
				position={[label === 'OUT' ? -0.09 : 0.09, 0.6, 0.51]}
				args={[0.8, 1.5, 0.1]}
				radius={0.06}
				smoothness={6}
			>
				<meshStandardMaterial color="#111116" roughness={0.65} />
			</RoundedBox>

			{/* 라벨 판 */}
			<RoundedBox
				position={[label === 'OUT' ? -0.15 : 0.15, 1.38, 0.6]}
				args={[0.48, 0.2, 0.06]}
				radius={0.05}
				smoothness={6}
			>
				<meshPhysicalMaterial
					color={C.cream}
					roughness={0.2}
					clearcoat={0.65}
				/>
			</RoundedBox>

			<Text
				position={[label === 'OUT' ? -0.25 : 0.25, 1.38, 0.7]}
				fontSize={0.11}
				color={labelColor}
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				{label}
			</Text>

			{/* 사이드 버튼 패널 */}
			<RoundedBox
				position={[0.55, 0.72, 0.23]}
				args={[0.12, 0.56, 0.06]}
				radius={0.04}
				smoothness={5}
			>
				<meshPhysicalMaterial color={C.blue} roughness={0.18} clearcoat={0.7} />
			</RoundedBox>

			{[0.9, 0.72, 0.54].map((y, i) => (
				<mesh key={i} position={[0.55, y, 0.29]}>
					<sphereGeometry args={[0.045, 16, 16]} />
					<meshPhysicalMaterial
						color={[C.yellow, C.green, C.red][i]}
						roughness={0.12}
						clearcoat={0.9}
					/>
				</mesh>
			))}

			<RealSirenLight position={[0, 1.75, 0.08]} />
		</group>
	);
}
function RealSirenLight({ position }: { position: [number, number, number] }) {
	const spinRef = useRef<THREE.Group>(null);
	const pulseRef = useRef<THREE.PointLight>(null);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();

		if (spinRef.current) {
			spinRef.current.rotation.y = t * 5;
		}

		if (pulseRef.current) {
			pulseRef.current.intensity = 1.8 + Math.sin(t * 8) * 0.8;
		}
	});

	return (
		<group position={position}>
			{/* blue base */}
			<mesh position={[0, -0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[0.24, 0.015, 12, 40]} />
				<meshPhysicalMaterial color="#ff8aa0" roughness={0.08} clearcoat={1} />
			</mesh>

			{/* black inner base */}
			<mesh position={[0, -0.03, 0]}>
				<cylinderGeometry args={[0.2, 0.22, 0.12, 40]} />
				<meshStandardMaterial color="#303038" roughness={0.45} />
			</mesh>

			<mesh position={[0, 0.13, 0]}>
				<cylinderGeometry args={[0.13, 0.16, 0.28, 48, 1, true]} />
				<meshPhysicalMaterial
					color="#ff3b4f"
					transparent
					opacity={0.68}
					roughness={0.03}
					clearcoat={1}
					transmission={0.85}
					thickness={0.35}
					ior={1.45}
					emissive="#ff1f3d"
					emissiveIntensity={0.45}
				/>
			</mesh>

			{/* rotating bulb */}
			<group ref={spinRef} position={[0, 0.1, 0]}>
				<mesh position={[0.11, 0, 0]}>
					<sphereGeometry args={[0.075, 24, 24]} />
					<meshBasicMaterial color="#fff2a8" />
				</mesh>

				<mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
					<coneGeometry args={[0.08, 0.45, 24, 1, true]} />
					<meshBasicMaterial
						color="#ff6b6b"
						transparent
						opacity={0.42}
						side={THREE.DoubleSide}
					/>
				</mesh>

				<mesh position={[-0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
					<coneGeometry args={[0.08, 0.45, 24, 1, true]} />
					<meshBasicMaterial
						color="#ff6b6b"
						transparent
						opacity={0.28}
						side={THREE.DoubleSide}
					/>
				</mesh>
			</group>

			<pointLight
				ref={pulseRef}
				position={[0, 0.25, 0]}
				color="#ff3b3b"
				intensity={2}
				distance={2.4}
			/>
		</group>
	);
}
function CandyProjectMachine() {
	const starRef = useRef<THREE.Group>(null);

	const candies = useMemo(
		() =>
			Array.from({ length: 46 }, (_, i) => {
				const angle = (i / 46) * Math.PI * 2;
				const r = 0.12 + Math.random() * 0.43;
				return {
					position: [
						Math.cos(angle) * r,
						1.32 + Math.random() * 0.38,
						Math.sin(angle) * r,
					] as [number, number, number],
					scale: 0.07 + Math.random() * 0.045,
					color: [
						C.pink,
						C.yellow,
						C.blue,
						C.lavender,
						'#ff8fab',
						'#ffffff',
						'#9be7ff',
					][i % 7],
				};
			}),
		[]
	);

	useFrame(({ clock }) => {
		if (!starRef.current) return;
		const t = clock.getElapsedTime();

		starRef.current.rotation.y = t * 1.4;
	});

	return (
		<group position={[0, 0, -1.65]}>
			{/* lower metal base */}
			<RoundedBox
				position={[0, 0.14, 0]}
				args={[1.65, 0.22, 1.02]}
				radius={0.12}
				smoothness={12}
				castShadow
			>
				<meshPhysicalMaterial
					color="#b9b9b9"
					roughness={0.22}
					metalness={0.45}
				/>
			</RoundedBox>

			{/* main body */}
			<RoundedBox
				position={[0, 0.72, 0]}
				args={[1.48, 1.18, 0.9]}
				radius={0.24}
				smoothness={18}
				castShadow
			>
				<meshPhysicalMaterial
					color="#ff9fbd"
					roughness={0.12}
					clearcoat={1}
					clearcoatRoughness={0.08}
				/>
			</RoundedBox>

			{/* side grooves */}
			{[-0.57, 0.57].map((x) => (
				<mesh key={x} position={[x, 0.72, 0.48]}>
					<boxGeometry args={[0.045, 0.88, 0.035]} />
					<meshPhysicalMaterial
						color="#f586aa"
						roughness={0.25}
						clearcoat={0.7}
					/>
				</mesh>
			))}

			{/* dome bottom ring */}
			<mesh position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[0.7, 0.055, 18, 64]} />
				<meshPhysicalMaterial
					color="#d7b46a"
					roughness={0.16}
					metalness={0.45}
					clearcoat={1}
				/>
			</mesh>

			{/* glass dome */}
			<mesh position={[0, 1.55, 0]}>
				<sphereGeometry args={[0.68, 48, 48]} />
				<meshPhysicalMaterial
					color="#ffd8ee"
					roughness={0.02}
					clearcoat={1}
					transmission={0.45}
					transparent
					opacity={0.42}
				/>
			</mesh>

			{/* candies inside */}
			{candies.map((candy, i) => (
				<mesh key={i} position={candy.position} scale={candy.scale}>
					<sphereGeometry args={[1, 24, 24]} />
					<meshPhysicalMaterial
						color={candy.color}
						roughness={0.18}
						clearcoat={1}
						clearcoatRoughness={0.08}
					/>
				</mesh>
			))}

			{/* top cap */}
			<RoundedBox
				args={[1.0, 0.14, 0.78]}
				radius={0.1}
				position={[0, 1, 0]}
				smoothness={18}
				castShadow
			>
				<meshPhysicalMaterial
					color="#8fd3ff"
					roughness={0.1}
					clearcoat={1}
					clearcoatRoughness={0.06}
				/>
			</RoundedBox>

			{/* top metal trim */}
			<mesh position={[0, 1.94, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[0.68, 0.035, 16, 64]} />
				<meshPhysicalMaterial
					color="#c7a05a"
					roughness={0.18}
					metalness={0.55}
					clearcoat={1}
				/>
			</mesh>

			{/* make plate */}
			<RoundedBox
				position={[0, 2.16, 0.5]}
				args={[0.62, 0.18, 0.06]}
				radius={0.045}
				smoothness={8}
			>
				<meshPhysicalMaterial
					color="#d6b36b"
					roughness={0.16}
					metalness={0.45}
					clearcoat={1}
				/>
			</RoundedBox>

			<Text
				position={[0, 2.165, 0.54]}
				fontSize={0.105}
				color="#5d3c20"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				조퇴뽑기
			</Text>

			{/* face screen frame */}
			<RoundedBox
				position={[0, 0.9, 0.51]}
				args={[1.0, 0.48, 0.1]}
				radius={0.13}
				smoothness={12}
			>
				<meshPhysicalMaterial
					color="#d7b46a"
					roughness={0.16}
					metalness={0.45}
					clearcoat={1}
				/>
			</RoundedBox>

			<RoundedBox
				position={[0, 0.9, 0.57]}
				args={[0.82, 0.32, 0.08]}
				radius={0.09}
				smoothness={10}
			>
				<meshStandardMaterial color="#14241d" />
			</RoundedBox>

			<Text
				position={[0, 0.9, 0.63]}
				fontSize={0.2}
				color="#75ff75"
				anchorX="center"
				anchorY="middle"
			>
				☺
			</Text>

			{/* control panel */}
			<RoundedBox
				position={[0, 0.48, 0.53]}
				args={[1.05, 0.22, 0.09]}
				radius={0.075}
				smoothness={10}
			>
				<meshPhysicalMaterial
					color="#d8b678"
					roughness={0.16}
					metalness={0.35}
					clearcoat={1}
				/>
			</RoundedBox>

			{/* knob */}
			<mesh position={[-0.33, 0.49, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[0.12, 0.12, 0.08, 32]} />
				<meshPhysicalMaterial
					color="#b38343"
					roughness={0.16}
					metalness={0.6}
					clearcoat={1}
				/>
			</mesh>

			{/* buttons */}
			{[
				[-0.02, C.pink],
				[0.18, C.yellow],
				[0.38, C.blue],
			].map(([x, color]) => (
				<mesh key={String(x)} position={[x as number, 0.49, 0.62]}>
					<sphereGeometry args={[0.055, 24, 24]} />
					<meshPhysicalMaterial
						color={color as string}
						roughness={0.12}
						clearcoat={1}
					/>
				</mesh>
			))}

			{/* output pipe */}
			<mesh position={[0, 0.26, 0.67]} rotation={[Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[0.2, 0.26, 0.36, 40]} />
				<meshPhysicalMaterial
					color="#c9913d"
					roughness={0.15}
					metalness={0.55}
					clearcoat={1}
				/>
			</mesh>

			<mesh position={[0, 0.26, 0.88]} rotation={[Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[0.24, 0.24, 0.08, 40]} />
				<meshPhysicalMaterial
					color="#e0b05a"
					roughness={0.12}
					metalness={0.55}
					clearcoat={1}
				/>
			</mesh>

			{/* candy tray */}
			<RoundedBox
				position={[0, 0.08, 0.72]}
				args={[0.72, 0.16, 0.46]}
				radius={0.12}
				smoothness={12}
				castShadow
			>
				<meshPhysicalMaterial color="#ff9fbd" roughness={0.12} clearcoat={1} />
			</RoundedBox>

			{/* small feet */}
			{[
				[-0.58, -0.02, 0.34],
				[0.58, -0.02, 0.34],
				[-0.58, -0.02, -0.34],
				[0.58, -0.02, -0.34],
			].map((p, i) => (
				<mesh key={i} position={p as [number, number, number]}>
					<cylinderGeometry args={[0.09, 0.09, 0.06, 24]} />
					<meshStandardMaterial color="#3a2a25" />
				</mesh>
			))}
		</group>
	);
}

function ConveyorBelt() {
	const wheelRefs = useRef<THREE.Group[]>([]);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();

		wheelRefs.current.forEach((wheel, i) => {
			if (!wheel) return;

			wheel.rotation.z = -t * 3 + i * 0.2;
		});
	});

	return (
		<group position={[0, 0.26, 0.28]}>
			{/* 벨트 */}
			<BeltPiece position={[-2.8, 0, -0.86]} args={[0.78, 0.18, 1.25]} />
			<BeltPiece position={[0, 0, -0.38]} args={[5.6, 0.18, 0.86]} />
			<BeltPiece position={[2.8, 0, -0.86]} args={[0.78, 0.18, 1.25]} />

			{/* 가운데 벨트 줄무늬 */}
			{Array.from({ length: 17 }).map((_, i) => (
				<mesh key={i} position={[-2.72 + i * 0.34, 0.23, -0.38]}>
					<boxGeometry args={[0.24, 0.035, 0.7]} />
					<meshStandardMaterial
						color={i % 2 === 0 ? '#5b5559' : C.belt}
						roughness={0.55}
					/>
				</mesh>
			))}

			{/* IN 벨트 줄무늬 */}
			{Array.from({ length: 4 }).map((_, i) => (
				<mesh key={i} position={[-2.8, 0.23, -1.18 + i * 0.28]}>
					<boxGeometry args={[0.66, 0.035, 0.18]} />
					<meshStandardMaterial
						color={i % 2 === 0 ? '#5b5559' : C.belt}
						roughness={0.55}
					/>
				</mesh>
			))}

			{/* OUT 벨트 줄무늬 */}
			{Array.from({ length: 4 }).map((_, i) => (
				<mesh key={i} position={[2.8, 0.23, -0.35 - i * 0.28]}>
					<boxGeometry args={[0.66, 0.035, 0.18]} />
					<meshStandardMaterial
						color={i % 2 === 0 ? '#5b5559' : C.belt}
						roughness={0.55}
					/>
				</mesh>
			))}

			{/* 받침 기둥 */}
			{[-2.1, -1.05, 0, 1.05, 2.1].map((x) => (
				<group key={x} position={[x, -0.34, -0.38]}>
					<mesh position={[0, 0, 0.3]}>
						<boxGeometry args={[0.12, 0.34, 0.12]} />
						<meshPhysicalMaterial
							color={C.pink}
							roughness={0.12}
							clearcoat={1}
						/>
					</mesh>

					<mesh position={[0, 0, -0.3]}>
						<boxGeometry args={[0.12, 0.34, 0.12]} />
						<meshPhysicalMaterial
							color={C.pink}
							roughness={0.12}
							clearcoat={1}
						/>
					</mesh>
				</group>
			))}

			{/* 회전 롤러 */}
			{[-2.8, 2.8].map((x, index) => (
				<group
					key={index}
					ref={(el) => {
						if (el) wheelRefs.current[index] = el;
					}}
					position={[x, 0.13, -0.86]}
				>
					<mesh rotation={[0, Math.PI / 2, 0]}>
						<cylinderGeometry args={[0.11, 0.11, 0.82, 32]} />
						<meshStandardMaterial
							color="#8b8b8b"
							metalness={0.4}
							roughness={0.35}
						/>
					</mesh>

					{[-0.24, 0, 0.24].map((z, i) => (
						<mesh key={i} position={[0, 0, z]} rotation={[0, Math.PI / 2, 0]}>
							<torusGeometry args={[0.11, 0.012, 12, 24]} />
							<meshStandardMaterial color="#5b5559" />
						</mesh>
					))}
				</group>
			))}
		</group>
	);
}
function BeltPiece({
	position,
	args,
}: {
	position: [number, number, number];
	args: [number, number, number];
}) {
	return (
		<group position={position}>
			<RoundedBox
				position={[0, 0.02, 0]}
				args={args}
				radius={0.13}
				smoothness={10}
			>
				<meshPhysicalMaterial
					color={C.pinkDark}
					roughness={0.13}
					clearcoat={1}
				/>
			</RoundedBox>

			<RoundedBox
				position={[0, 0.13, 0]}
				args={[args[0] * 0.9, 0.16, args[2] * 0.82]}
				radius={0.1}
				smoothness={10}
			>
				<meshStandardMaterial color={C.beltDark} roughness={0.6} />
			</RoundedBox>
		</group>
	);
}
function MovingBoxes({
	onSelectProject,
}: {
	onSelectProject: (project: (typeof projects)[number]) => void;
}) {
	return (
		<>
			{projects.map((project, i) => (
				<MovingBox
					key={project.title}
					offset={i / projects.length}
					project={project}
					onClick={() => onSelectProject(project)}
				/>
			))}
		</>
	);
}

function MovingBox({
	offset,
	project,
	onClick,
}: {
	offset: number;
	project: (typeof projects)[number];
	onClick: () => void;
}) {
	const ref = useRef<THREE.Group>(null);
	const companyLogo = (project as { companyLogo?: { src: string } }).companyLogo;
	const hasCompanyLogo = !!companyLogo;

	useFrame(({ clock }) => {
		if (!ref.current) return;

		const t = clock.getElapsedTime();
		const loopDuration = 35;

		// 핵심 수정: offset은 이미 0~1 비율이므로 여기서 나누면 안 됨
		const progress = (t / loopDuration + offset) % 1;

		const p = getBoxPathPoint(progress);

		ref.current.position.x = p.x;
		ref.current.position.z = p.z;
		ref.current.position.y = 0.76 + Math.sin(t * 1.5 + offset) * 0.0015;
		ref.current.rotation.y = p.rotationY;

		let s = 0.78;

		if (progress < 0.06) {
			s = 0.78 * (progress / 0.06);
		}

		if (progress > 0.94) {
			s = 0.78 * ((1 - progress) / 0.06);
		}

		ref.current.scale.setScalar(Math.max(0.02, s));
	});

	return (
		<group
			ref={ref}
			position={[-3.25, 0.76, -1.35]}
			scale={0.78}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			<RoundedBox
				args={[1.05, 0.62, 0.58]}
				radius={0.07}
				smoothness={8}
				castShadow
			>
				<meshStandardMaterial color={C.box} roughness={0.55} />
			</RoundedBox>

			{hasCompanyLogo ? (
				<CompanyLogoPrint src={companyLogo.src} />
			) : (
				<Text
					position={[0, 0.04, 0.34]}
					fontSize={0.1}
					color="#753d12"
					anchorX="center"
					anchorY="middle"
					fontWeight={900}
					textAlign="center"
				>
					{'PERSONAL\nPROJECT'}
				</Text>
			)}
		</group>
	);
}

function CompanyLogoPrint({ src }: { src: string }) {
	const logoTexture = useTexture(src);

	const logoSize = useMemo(() => {
		const image = logoTexture.image as HTMLImageElement | undefined;

		if (!image?.width || !image?.height) {
			return { width: 0.62, height: 0.27 };
		}

		const ratio = image.width / image.height;
		const maxWidth = 0.62;
		const maxHeight = 0.27;

		let width = maxWidth;
		let height = width / ratio;

		if (height > maxHeight) {
			height = maxHeight;
			width = height * ratio;
		}

		return { width, height };
	}, [logoTexture]);

	return (
		<mesh position={[0, -0.0019, 0.335]}>
			<planeGeometry args={[logoSize.width, logoSize.height]} />
			<meshBasicMaterial
				map={logoTexture}
				transparent
				opacity={0.75}
				alphaTest={0.01}
				depthWrite={false}
				toneMapped={false}
			/>
		</mesh>
	);
}

function smoothStep(t: number) {
	return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

function getBoxPathPoint(progress: number) {
	// 구간 비율
	// IN 회전/진입: 짧게 빠르게
	// 직선: 길게 천천히
	// OUT 회전/퇴장: 짧게 빠르게
	const inEnd = 0.14;
	const straightEnd = 0.86;

	if (progress < inEnd) {
		const p = smoothStep(progress / inEnd);

		return {
			x: -2.8,
			z: -1.07 + p * 0.95,

			// IN: 왼쪽 옆면 → 정면, 빠르게 회전
			rotationY: lerp(Math.PI / 2, 0, p),
		};
	}

	if (progress < straightEnd) {
		const p = (progress - inEnd) / (straightEnd - inEnd);

		return {
			// 직선 구간을 길게 써서 로고가 오래 보임
			x: -2.8 + p * 5.6,
			z: -0.12,

			// 정면 유지
			rotationY: 0,
		};
	}

	const p = smoothStep((progress - straightEnd) / (1 - straightEnd));

	return {
		x: 2.8,
		z: -0.12 - p * 0.95,

		// OUT: 정면 → 오른쪽 옆면, 빠르게 회전
		rotationY: lerp(0, -Math.PI / 2, p),
	};
}

function ProjectDetailOverlay({
	project,
	onClose,
}: {
	project: (typeof projects)[number];
	onClose: () => void;
}) {
	const [typed, setTyped] = useState('');

	const fullText = `${project.desc}`;

	useEffect(() => {
		setTyped('');

		let i = 0;
		const timer = window.setInterval(() => {
			i += 1;
			setTyped(fullText.slice(0, i));

			if (i >= fullText.length) {
				window.clearInterval(timer);
			}
		}, 16);

		return () => window.clearInterval(timer);
	}, [fullText]);

	return (
		<Html
			position={[0, 1.65, 0.95]}
			transform={false}
			center
			zIndexRange={[100, 0]}
		>
			<AnimatePresence>
				<motion.div
					key={project.title}
					className="pointer-events-auto flex h-[90vh] w-[94vw] gap-6"
					initial={{
						opacity: 0,
						scale: 0.18,
						x: -260,
						y: 160,
					}}
					animate={{
						opacity: 1,
						scale: 1,
						x: 0,
						y: 0,
					}}
					exit={{
						opacity: 0,
						scale: 0.25,
						x: -260,
						y: 160,
					}}
					transition={{
						type: 'spring',
						stiffness: 150,
						damping: 18,
					}}
				>
					{/* ================= LEFT PANEL ================= */}

					<motion.div
						className="relative h-full w-[340px] shrink-0 rounded-[30px] border-4 border-[#2b1b14] bg-[#fff4c9] p-5 shadow-[8px_8px_0_#2b1b14]"
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{
							delay: 0.05,
							type: 'spring',
							stiffness: 220,
							damping: 16,
						}}
					>
						<div className="absolute -top-5 left-8 rounded-full border-4 border-[#2b1b14] bg-[#ff6fae] px-5 py-1 text-sm font-black text-white shadow-[4px_4px_0_#2b1b14]">
							PROJECT FILE
						</div>

						<div className="flex h-full flex-col pt-5">
							<h2 className="text-[28px] font-black leading-tight text-[#ff5f9f]">
								{project.title}
							</h2>

							<div className="mt-2 mb-5 h-1 w-20 rounded-full bg-[#ffbf47]" />

							<div className="mb-4 rounded-2xl border-2 border-[#2b1b14] bg-white/70 p-4">
								<div className="text-[11px] font-black tracking-[0.18em] text-[#42aee8]">
									COMPANY
								</div>

								<div className="mt-1 font-bold text-[#7a4318]">
									{project.company}
								</div>
							</div>

							<div className="mb-4 rounded-2xl border-2 border-[#2b1b14] bg-white/70 p-4">
								<div className="text-[11px] font-black tracking-[0.18em] text-[#42aee8]">
									DATE
								</div>

								<div className="mt-1 font-bold text-[#7a4318]">
									{project.date}
								</div>
							</div>

							<div className="mb-4 flex-1 rounded-2xl border-2 border-[#2b1b14] bg-white/70 p-4">
								<div className="mb-2 text-[11px] font-black tracking-[0.18em] text-[#42aee8]">
									DESCRIPTION
								</div>

								<div className="text-[13px] leading-6 text-[#47352d]">
									{typed}
									<span className="animate-pulse">▌</span>
								</div>
							</div>

							<div className="mb-5">
								<div className="mb-2 text-[11px] font-black tracking-[0.18em] text-[#42aee8]">
									TECH STACK
								</div>

								<div className="flex flex-wrap gap-2">
									{project.techStack.map((tech) => (
										<div
											key={tech}
											className="rounded-full border-2 border-[#2b1b14] bg-[#ffe58d] px-3 py-1 text-xs font-black text-[#7a4318] shadow-[2px_2px_0_#2b1b14]"
										>
											{tech}
										</div>
									))}
								</div>
							</div>

							<button
								onClick={onClose}
								className="mt-auto w-full rounded-2xl border-2 border-[#2b1b14] bg-[#ff6fae] py-3 font-black text-white shadow-[4px_4px_0_#2b1b14]"
							>
								CLOSE
							</button>
						</div>
					</motion.div>

					{/* ================= RIGHT IFRAME ================= */}

					<motion.div
						className="h-full flex-1 overflow-hidden rounded-[30px] border-4 border-[#2b1b14] bg-white shadow-[8px_8px_0_#2b1b14]"
						initial={{
							opacity: 0,
							x: 80,
							scale: 0.96,
						}}
						animate={{
							opacity: 1,
							x: 0,
							scale: 1,
						}}
						transition={{
							delay: 0.25,
							type: 'spring',
							stiffness: 130,
							damping: 20,
						}}
					>
						<iframe
							src={project.href}
							title={project.title}
							className="h-full w-full bg-white"
						/>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</Html>
	);
}
