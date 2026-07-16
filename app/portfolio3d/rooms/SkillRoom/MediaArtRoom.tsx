'use client';

import { Float, RoundedBox, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import MediaArtFurniture from './MediaArtFurniture';
import MediaArtProjectWall from './MediaArtProjectWall';
import type { ArtworkType } from './ArtworkContents';
import MediaArtArchWall from './MediaArtarchWall';

type MediaArtRoomProps = {
	showPanels?: boolean;
	onSelectProject?: (type: ArtworkType) => void;

	furniturePosition?: [number, number, number];
	furnitureRotation?: [number, number, number];
	furnitureScale?: number;
};

/*
 * 아치 벽의 totalWidth가 9이므로
 * 방 전체 폭도 9.2 정도로 맞춥니다.
 */
const ROOM_WIDTH = 9.2;
const ROOM_DEPTH = 6.15;
const ROOM_HEIGHT = 3.8;

function RoomShell() {
	const sideWallX = ROOM_WIDTH / 2 - 0.09;

	return (
		<group>
			{/* 바닥 */}
			<RoundedBox
				args={[ROOM_WIDTH, 0.18, ROOM_DEPTH]}
				radius={0.24}
				smoothness={10}
				position={[0, -0.1, 0]}
				receiveShadow
			>
				<meshPhysicalMaterial
					color="#b59ab8"
					roughness={0.42}
					metalness={0.02}
					clearcoat={0.32}
					clearcoatRoughness={0.45}
				/>
			</RoundedBox>

			{/* 뒷벽 */}
			<mesh position={[0, 1.8, -3.04]} receiveShadow>
				<boxGeometry args={[ROOM_WIDTH, ROOM_HEIGHT, 0.18]} />

				<meshStandardMaterial color="#a78cac" roughness={0.84} />
			</mesh>

			{/* 왼쪽 벽 */}
			<mesh
				position={[-sideWallX, 1.8, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[ROOM_DEPTH, ROOM_HEIGHT, 0.18]} />

				<meshStandardMaterial color="#b197b5" roughness={0.86} />
			</mesh>

			{/* 오른쪽 벽 */}
			<mesh
				position={[sideWallX, 1.8, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[ROOM_DEPTH, ROOM_HEIGHT, 0.18]} />

				<meshStandardMaterial color="#a489aa" roughness={0.86} />
			</mesh>

			{/* 천장 */}
			<mesh position={[0, 3.68, 0]} receiveShadow>
				<boxGeometry args={[ROOM_WIDTH + 0.05, 0.18, ROOM_DEPTH + 0.05]} />

				<meshStandardMaterial color="#a88dad" roughness={0.82} />
			</mesh>

			{/* 뒷벽 상단 몰딩 */}
			<RoundedBox
				args={[8.55, 0.34, 0.4]}
				radius={0.16}
				smoothness={10}
				position={[0, 3.42, -2.74]}
			>
				<meshStandardMaterial color="#c6acc9" roughness={0.66} />
			</RoundedBox>

			{/* 왼쪽 세로 몰딩 */}
			<RoundedBox
				args={[0.4, 3.18, 0.38]}
				radius={0.16}
				smoothness={10}
				position={[-sideWallX + 0.28, 1.72, -0.2]}
			>
				<meshStandardMaterial color="#c3a8c6" roughness={0.7} />
			</RoundedBox>

			{/* 뒷벽 하단 몰딩 */}
			<mesh position={[0, 0.07, -2.9]}>
				<boxGeometry args={[ROOM_WIDTH - 0.35, 0.13, 0.11]} />

				<meshStandardMaterial color="#c3a9c5" />
			</mesh>

			{/* 바닥 쪽 보라색 간접광 */}
			<pointLight
				position={[0, 0.14, -2.64]}
				color="#a46cff"
				intensity={0.65}
				distance={5.8}
				decay={2}
			/>
		</group>
	);
}

function CeilingProjector() {
	return (
		<group position={[-1.05, 3.48, 0.32]}>
			{/* 프로젝터 본체 */}
			<mesh castShadow>
				<boxGeometry args={[0.74, 0.2, 0.48]} />

				<meshStandardMaterial color="#d8d0da" roughness={0.5} />
			</mesh>

			{/* 연결봉 */}
			<mesh position={[0, 0.22, 0]}>
				<cylinderGeometry args={[0.045, 0.045, 0.34, 18]} />

				<meshStandardMaterial color="#a99eab" />
			</mesh>

			{/* 천장 고정부 */}
			<mesh position={[0, 0.39, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[0.12, 0.12, 0.055, 24]} />

				<meshStandardMaterial color="#a398a5" />
			</mesh>

			{/* 렌즈 */}
			<mesh position={[0, -0.01, -0.255]} rotation={[Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[0.1, 0.1, 0.085, 32]} />

				<meshStandardMaterial
					color="#25202e"
					emissive="#755dff"
					emissiveIntensity={0.35}
				/>
			</mesh>

			<pointLight
				position={[0, -0.06, -0.52]}
				color="#aa91ff"
				intensity={0.55}
				distance={3.4}
				decay={2}
			/>
		</group>
	);
}

function ProjectorBeam() {
	const beamRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (!beamRef.current) return;

		const material = beamRef.current.material as THREE.MeshBasicMaterial;

		material.opacity = 0.018 + Math.sin(state.clock.elapsedTime * 0.8) * 0.003;
	});

	return (
		<mesh
			ref={beamRef}
			position={[-0.25, 2.35, -1.25]}
			rotation={[Math.PI / 2, 0, 0]}
			scale={[1.75, 1, 1]}
		>
			<coneGeometry args={[1.7, 3.2, 4, 1, true]} />

			<meshBasicMaterial
				color="#c4b5ff"
				transparent
				opacity={0.018}
				depthWrite={false}
				side={THREE.DoubleSide}
				blending={THREE.AdditiveBlending}
			/>
		</mesh>
	);
}

function CeilingLights() {
	const lights = useMemo(
		() =>
			[
				[-2.8, 3.55, -0.5],
				[-1.45, 3.55, -1.78],
				[0, 3.55, -1.78],
				[1.5, 3.55, -1.78],
				[3.15, 3.55, -0.55],
			] as [number, number, number][],
		[]
	);

	return (
		<group>
			{lights.map((position, index) => (
				<group key={`${position.join('-')}-${index}`} position={position}>
					<mesh rotation={[Math.PI / 2, 0, 0]}>
						<cylinderGeometry args={[0.072, 0.072, 0.028, 24]} />

						<meshBasicMaterial color="#fff0d8" toneMapped={false} />
					</mesh>

					<pointLight
						position={[0, -0.15, 0]}
						color={index % 2 === 0 ? '#ffd0df' : '#d7c3ff'}
						intensity={0.42}
						distance={2.5}
						decay={2}
					/>
				</group>
			))}
		</group>
	);
}

function HangingCloudLight() {
	return (
		<group position={[3.45, 2.83, -0.4]}>
			{/* 전선 */}
			<mesh position={[0, 0.62, 0]}>
				<cylinderGeometry args={[0.018, 0.018, 1.05, 12]} />

				<meshStandardMaterial color="#4d3d50" />
			</mesh>

			{/* 천장 고정부 */}
			<mesh position={[0, 1.15, 0]}>
				<sphereGeometry args={[0.07, 20, 20]} />

				<meshStandardMaterial color="#49384d" />
			</mesh>

			{/* 구름 조명 */}
			{[
				[-0.24, 0, 0],
				[0, 0.09, 0],
				[0.24, 0, 0],
				[0, -0.08, 0.03],
			].map((position, index) => (
				<mesh
					key={`${position.join('-')}-${index}`}
					position={position as [number, number, number]}
				>
					<sphereGeometry args={[index === 1 ? 0.28 : 0.24, 28, 28]} />

					<meshStandardMaterial
						color="#ffe5af"
						emissive="#ffcf88"
						emissiveIntensity={1.25}
						roughness={0.5}
					/>
				</mesh>
			))}

			<pointLight
				position={[0, -0.05, 0.15]}
				color="#ffca91"
				intensity={1.8}
				distance={4.8}
				decay={2}
			/>
		</group>
	);
}

function DreamyParticles() {
	return (
		<>
			<Sparkles
				count={32}
				scale={[7.8, 3.05, 4.9]}
				position={[0, 1.75, -0.05]}
				size={0.85}
				speed={0.1}
				noise={0.42}
				color="#f8dcff"
				opacity={0.23}
			/>

			<Float speed={0.5} floatIntensity={0.12} rotationIntensity={0.06}>
				<pointLight
					position={[-1.7, 1.25, 0.55]}
					color="#ff98d2"
					intensity={0.4}
					distance={3}
					decay={2}
				/>
			</Float>
		</>
	);
}

export default function MediaArtRoom({
	showPanels = true,
	onSelectProject,

	furniturePosition = [0.55, 0.3, 0.48],
	furnitureRotation = [0, 0, 0],
	furnitureScale = 1,
}: MediaArtRoomProps) {
	return (
		<group>
			<color attach="background" args={['#3b2c4d']} />

			<ambientLight intensity={0.68} color="#efdfff" />

			<hemisphereLight args={['#ddc9ff', '#665067', 0.95]} />

			<directionalLight
				position={[-3.6, 5.6, 4.6]}
				intensity={1.35}
				color="#ffe5dd"
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-camera-near={0.1}
				shadow-camera-far={20}
				shadow-camera-left={-6}
				shadow-camera-right={6}
				shadow-camera-top={6}
				shadow-camera-bottom={-6}
				shadow-bias={-0.00015}
			/>

			<pointLight
				position={[3.1, 2.55, 1.1]}
				color="#ffc58f"
				intensity={0.75}
				distance={5}
				decay={2}
			/>

			<group scale={[0.74, 0.74, 0.74]}>
				<RoomShell />

				{/*
				 * 화면 폭을 줄이고 오른쪽 벽 폭을 늘렸습니다.
				 *
				 * 화면 실제 범위:
				 * screenWidth = 6.05
				 *
				 * 오른쪽 벽 실제 범위:
				 * rightWallWidth = 2.55
				 */}
				<MediaArtArchWall
					position={[0, 1.82, -2.9]}
					totalWidth={9}
					height={3.35}
					screenWidth={6.05}
					rightWallWidth={2.55}
					depth={0.22}
					recessDepth={0.18}
					screenRadius={0.42}
					outerRadius={0.28}
					frameColor="#b997ba"
					screenColor="#9d82a5"
					rightWallColor="#b997ba"
					showDivider={false}
					showProjectionSurface
				>
					<group scale={0.84}>
						<MediaArtProjectWall
							showPanels={showPanels}
							onSelectProject={onSelectProject}
						/>
					</group>
				</MediaArtArchWall>

				<CeilingProjector />
				<ProjectorBeam />
				<CeilingLights />
				<HangingCloudLight />
				<DreamyParticles />
			</group>
		</group>
	);
}
