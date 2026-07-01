'use client';

import { Html, RoundedBox, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import AboutObjects from './AboutObjects';
import Neon3DText from '../../objects/Neon3DText';
import CeilingFan from '../../objects/CeilingFan';

type AboutRoomProps = {
	onBack?: () => void;
};

type FurnitureSpeechBubbleProps = {
	label: string;
	position: [number, number, number];
	threshold?: number;
};

function FurnitureSpeechBubble({
	label,
	position,
	threshold = 1.9,
}: FurnitureSpeechBubbleProps) {
	const { camera } = useThree();
	const [isVisible, setIsVisible] = useState(false);

	useFrame(() => {
		const distance = camera.position.distanceTo(new THREE.Vector3(...position));
		setIsVisible(distance < threshold);
	});

	if (!isVisible) return null;

	return (
		<Html
			center
			distanceFactor={8}
			position={[position[0], position[1] + 0.42, position[2]]}
			occlude
		>
			<div className="pointer-events-none whitespace-nowrap rounded-[1rem] border-[3px] border-black bg-white/95 px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-[#2f1d3a] shadow-[4px_4px_0_#000]">
				{label}
			</div>
		</Html>
	);
}

export default function AboutRoom({ onBack }: AboutRoomProps) {
	return (
		<group>
			{/* 바닥 */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[4.6, 3.6]} />
				<meshStandardMaterial color="#fff1c7" roughness={0.55} />
			</mesh>

			{/* 뒤 벽 */}
			<mesh position={[0, 1.25, -1.8]} receiveShadow>
				<boxGeometry args={[4.6, 2.5, 0.14]} />
				<meshStandardMaterial color="#ffd6e8" roughness={0.5} />
			</mesh>

			{/* 왼쪽 벽 */}
			<mesh
				position={[-2.3, 1.25, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[3.6, 2.5, 0.14]} />
				<meshStandardMaterial color="#dbeafe" roughness={0.5} />
			</mesh>

			{/* 오른쪽 벽 */}
			<mesh
				position={[2.3, 1.25, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[3.6, 2.5, 0.14]} />
				<meshStandardMaterial color="#e9d5ff" roughness={0.5} />
			</mesh>

			{/* 천장 */}
			<mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<planeGeometry args={[4.6, 3.6]} />
				<meshStandardMaterial color="#fff7ed" roughness={0.6} />
			</mesh>

			{/* 나가는 문 */}
			<RoundedBox
				position={[0, 0.72, 1.74]}
				args={[0.82, 1.42, 0.16]}
				radius={0.16}
				smoothness={10}
				onClick={onBack}
			>
				<meshStandardMaterial color="#ffcf5a" roughness={0.35} />
			</RoundedBox>
			<Neon3DText
				text={`About\ntwinkle`}
				position={[-2, 2.05, -0.5]}
				rotation={[0, Math.PI / 2, 0]}
				scale={0.5}
			/>
			<Text
				position={[0, 1.66, 1.62]}
				rotation={[0, Math.PI, 0]}
				fontSize={0.14}
				color="#6b3f1d"
				anchorX="center"
				anchorY="middle"
			>
				EXIT
			</Text>
			<CeilingFan position={[0, 2.3, 0]} scale={[0.5, 0.5, 0.5]} />

			{/* 조명 */}
			<ambientLight intensity={1} />
			<directionalLight position={[2, 4, 3]} intensity={1.25} castShadow />
			<pointLight position={[0, 2.15, 0]} intensity={1.3} color="#fff6d6" />

			<FurnitureSpeechBubble position={[-1.45, 0.72, -1.08]} label="내 침대" />
			<FurnitureSpeechBubble position={[-0.55, 0.72, -1.1]} label="협업 책상" />
			<FurnitureSpeechBubble position={[1.15, 0.72, -1.08]} label="작업 책상" />
			<FurnitureSpeechBubble
				position={[1.05, 0.72, 0.24]}
				label="편안한 빈백"
			/>
			<FurnitureSpeechBubble position={[0, 1.78, -1.58]} label="창밖 풍경" />
			<FurnitureSpeechBubble position={[-2.14, 1.68, -0.1]} label="소개 보드" />
			<FurnitureSpeechBubble position={[1.92, 0.72, -0.2]} label="책장" />

			{/* GLB 가구 */}
			<AboutObjects />
		</group>
	);
}
