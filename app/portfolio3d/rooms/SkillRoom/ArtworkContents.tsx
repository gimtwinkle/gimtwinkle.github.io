'use client';

import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import FloatingLottie from './FloatingLottie';

import reactLogoJson from '@/asset/lottie/react-logo.json';
import typescriptLogoJson from '@/asset/lottie/ts-logo.json';
import figmaLogoJson from '@/asset/lottie/figma-logo.json';
import nextjsLogoJson from '@/asset/lottie/nextjs-logo.json';
import gitLogoJson from '@/asset/lottie/git-logo.json';
import githubLogoJson from '@/asset/lottie/github-logo.json';
import lottieLogoJson from '@/asset/lottie/lottie-logo.json';
import interaction from '@/asset/lottie/interaction.json';

export type ArtworkType = 'frontend' | 'uiux' | 'creative';

type ArtworkContentsProps = {
	type: ArtworkType;
	color: string;
	cycleKey?: string;
};

const CYCLE_DURATION = 7.2;

function smoothStep(edge0: number, edge1: number, value: number) {
	const x = THREE.MathUtils.clamp(
		(value - edge0) / Math.max(edge1 - edge0, 0.0001),
		0,
		1
	);

	return x * x * (3 - 2 * x);
}

function getCycleOpacity(time: number) {
	const localTime = time % CYCLE_DURATION;

	const fadeIn = smoothStep(0, 1.15, localTime);
	const fadeOut = 1 - smoothStep(5.15, 6.65, localTime);

	return Math.min(fadeIn, fadeOut);
}

function ProjectionGlow({ type, color }: { type: ArtworkType; color: string }) {
	const groupRef = useRef<THREE.Group>(null);

	const glows = useMemo(() => {
		switch (type) {
			case 'frontend':
				return [
					{
						position: [-0.55, 0.38, -0.025] as [number, number, number],
						scale: [0.68, 0.68, 1] as [number, number, number],
						color: '#68d8ff',
						opacity: 0.075,
					},
					{
						position: [0.54, 0.35, -0.03] as [number, number, number],
						scale: [0.52, 0.52, 1] as [number, number, number],
						color: '#ffffff',
						opacity: 0.045,
					},
					{
						position: [0.54, -0.42, -0.025] as [number, number, number],
						scale: [0.57, 0.57, 1] as [number, number, number],
						color: '#4b9ee8',
						opacity: 0.065,
					},
					{
						position: [-0.55, -0.42, -0.03] as [number, number, number],
						scale: [0.48, 0.48, 1] as [number, number, number],
						color: '#ff775e',
						opacity: 0.05,
					},
				];

			case 'uiux':
				return [
					{
						position: [0, 0.05, -0.03] as [number, number, number],
						scale: [1.05, 1.3, 1] as [number, number, number],
						color: '#ff8dcc',
						opacity: 0.065,
					},
					{
						position: [-0.28, -0.2, -0.04] as [number, number, number],
						scale: [0.72, 0.92, 1] as [number, number, number],
						color: '#867cff',
						opacity: 0.045,
					},
					{
						position: [0.32, 0.16, -0.05] as [number, number, number],
						scale: [0.7, 0.85, 1] as [number, number, number],
						color: '#6df4dc',
						opacity: 0.04,
					},
				];

			case 'creative':
				return [
					{
						position: [-0.43, 0.3, -0.03] as [number, number, number],
						scale: [0.82, 0.82, 1] as [number, number, number],
						color: '#62ffe2',
						opacity: 0.07,
					},
					{
						position: [0.46, -0.28, -0.04] as [number, number, number],
						scale: [0.75, 0.75, 1] as [number, number, number],
						color: '#8bbaff',
						opacity: 0.06,
					},
					{
						position: [0.05, 0.02, -0.06] as [number, number, number],
						scale: [1.35, 0.85, 1] as [number, number, number],
						color: '#c78cff',
						opacity: 0.038,
					},
				];
		}
	}, [type]);

	useFrame((state) => {
		if (!groupRef.current) return;

		const time = state.clock.elapsedTime;
		const opacity = getCycleOpacity(time);

		groupRef.current.children.forEach((child, index) => {
			const mesh = child as THREE.Mesh;
			const material = mesh.material as THREE.MeshBasicMaterial;
			const glow = glows[index];

			material.opacity =
				opacity *
				glow.opacity *
				(0.82 + Math.sin(time * 0.55 + index * 0.9) * 0.18);

			mesh.scale.x = glow.scale[0] * (1 + Math.sin(time * 0.32 + index) * 0.06);

			mesh.scale.y = glow.scale[1] * (1 + Math.cos(time * 0.28 + index) * 0.05);
		});
	});

	return (
		<group ref={groupRef}>
			{glows.map((glow, index) => (
				<mesh key={index} position={glow.position} scale={glow.scale}>
					<circleGeometry args={[1, 64]} />

					<meshBasicMaterial
						color={glow.color || color}
						transparent
						opacity={0}
						depthWrite={false}
						blending={THREE.AdditiveBlending}
						side={THREE.DoubleSide}
					/>
				</mesh>
			))}
		</group>
	);
}

function ProjectionWash({ type, color }: { type: ArtworkType; color: string }) {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (!meshRef.current) return;

		const time = state.clock.elapsedTime;
		const opacity = getCycleOpacity(time);
		const material = meshRef.current.material as THREE.MeshBasicMaterial;

		material.opacity = opacity * (0.018 + Math.sin(time * 0.42) * 0.004);

		meshRef.current.scale.x = 1 + Math.sin(time * 0.18) * 0.025;

		meshRef.current.scale.y = 1 + Math.cos(time * 0.16) * 0.018;
	});

	const washColor = {
		frontend: '#517dff',
		uiux: '#c66dff',
		creative: '#637bff',
	}[type];

	return (
		<mesh ref={meshRef} position={[0, 0, -0.075]} scale={[1.35, 1.08, 1]}>
			<planeGeometry args={[1.9, 1.75]} />

			<meshBasicMaterial
				color={washColor || color}
				transparent
				opacity={0}
				depthWrite={false}
				blending={THREE.AdditiveBlending}
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
}

function ProjectionScanLines() {
	const groupRef = useRef<THREE.Group>(null);

	const lines = useMemo(
		() =>
			Array.from({ length: 18 }, (_, index) => ({
				y: -0.85 + index * 0.1,
				opacity: index % 3 === 0 ? 0.026 : 0.012,
			})),
		[]
	);

	useFrame((state) => {
		if (!groupRef.current) return;

		const time = state.clock.elapsedTime;
		const opacity = getCycleOpacity(time);

		groupRef.current.position.y = (time * 0.035) % 0.1;

		groupRef.current.children.forEach((child, index) => {
			const mesh = child as THREE.Mesh;
			const material = mesh.material as THREE.MeshBasicMaterial;

			material.opacity =
				opacity *
				lines[index].opacity *
				(0.8 + Math.sin(time * 0.8 + index) * 0.2);
		});
	});

	return (
		<group ref={groupRef} position={[0, 0, 0.025]}>
			{lines.map((line, index) => (
				<mesh key={index} position={[0, line.y, 0]} scale={[1.45, 1, 1]}>
					<planeGeometry args={[1.75, 0.006]} />

					<meshBasicMaterial
						color="#f7ecff"
						transparent
						opacity={0}
						depthWrite={false}
						blending={THREE.AdditiveBlending}
					/>
				</mesh>
			))}
		</group>
	);
}

function ProjectionDust({ type, color }: { type: ArtworkType; color: string }) {
	const ref = useRef<THREE.Points>(null);

	const settings = {
		frontend: {
			count: 24,
			scale: [2.4, 1.85, 0.16] as [number, number, number],
			size: 0.5,
			speed: 0.08,
			noise: 0.32,
		},
		uiux: {
			count: 18,
			scale: [2.1, 1.9, 0.14] as [number, number, number],
			size: 0.62,
			speed: 0.055,
			noise: 0.18,
		},
		creative: {
			count: 34,
			scale: [2.45, 1.9, 0.18] as [number, number, number],
			size: 0.46,
			speed: 0.12,
			noise: 0.48,
		},
	}[type];

	useFrame((state) => {
		if (!ref.current) return;

		const time = state.clock.elapsedTime;
		const opacity = getCycleOpacity(time);
		const material = ref.current.material as THREE.PointsMaterial;

		material.opacity = opacity * (0.12 + Math.sin(time * 0.65) * 0.025);

		ref.current.position.y = Math.sin(time * 0.18) * 0.025;
	});

	return (
		<Sparkles
			ref={ref}
			count={settings.count}
			scale={settings.scale}
			size={settings.size}
			speed={settings.speed}
			noise={settings.noise}
			color={color}
			opacity={0}
		/>
	);
}

function FrontendProjection({ color }: { color: string }) {
	return (
		<>
			<FloatingLottie
				animationData={reactLogoJson}
				position={[-0.58, 0.38, 0.08]}
				size={108}
				floatSpeed={0.3}
				floatAmount={0.014}
				delay={0}
				distanceFactor={4.1}
				glowColor="rgba(91,218,255,0.6)"
				cycleDuration={CYCLE_DURATION}
				hologramOpacity={0.84}
			/>

			<FloatingLottie
				animationData={nextjsLogoJson}
				position={[0.54, 0.38, 0.075]}
				size={72}
				floatSpeed={0.24}
				floatAmount={0.01}
				delay={0.65}
				distanceFactor={4.15}
				glowColor="rgba(255,255,255,0.38)"
				cycleDuration={CYCLE_DURATION}
				hologramOpacity={0.78}
			/>

			<FloatingLottie
				animationData={typescriptLogoJson}
				position={[0.56, -0.42, 0.08]}
				size={78}
				floatSpeed={0.28}
				floatAmount={0.012}
				delay={1.25}
				distanceFactor={4.12}
				glowColor="rgba(67,146,230,0.55)"
				cycleDuration={CYCLE_DURATION}
				hologramOpacity={0.82}
			/>

			<FloatingLottie
				animationData={gitLogoJson}
				position={[-0.58, -0.4, 0.075]}
				size={66}
				floatSpeed={0.26}
				floatAmount={0.01}
				delay={1.8}
				distanceFactor={4.18}
				glowColor="rgba(255,96,72,0.46)"
				cycleDuration={CYCLE_DURATION}
				hologramOpacity={0.77}
			/>

			<FloatingLottie
				animationData={githubLogoJson}
				position={[0, -0.7, 0.07]}
				size={58}
				floatSpeed={0.22}
				floatAmount={0.009}
				delay={2.35}
				distanceFactor={4.2}
				glowColor="rgba(255,255,255,0.34)"
				cycleDuration={CYCLE_DURATION}
				hologramOpacity={0.74}
			/>

			<pointLight
				position={[0, 0, 0.55]}
				color={color}
				intensity={0.38}
				distance={2.8}
				decay={2}
			/>
		</>
	);
}

function UiuxProjection({ color }: { color: string }) {
	return (
		<>
			<FloatingLottie
				animationData={figmaLogoJson}
				position={[0, 0.06, 0.08]}
				size={126}
				floatSpeed={0.25}
				floatAmount={0.012}
				delay={0}
				distanceFactor={4.08}
				glowColor="rgba(255,134,211,0.56)"
				cycleDuration={CYCLE_DURATION}
				hologramOpacity={0.86}
			/>

			<pointLight
				position={[0, 0.05, 0.52]}
				color="#ff8bd5"
				intensity={0.55}
				distance={2.8}
				decay={2}
			/>

			<pointLight
				position={[-0.32, -0.28, 0.45]}
				color="#8177ff"
				intensity={0.25}
				distance={2}
				decay={2}
			/>

			<pointLight
				position={[0.28, 0.2, 0.42]}
				color={color}
				intensity={0.22}
				distance={2}
				decay={2}
			/>
		</>
	);
}

function CreativeProjection() {
	return (
		<>
			<FloatingLottie
				animationData={lottieLogoJson}
				position={[-0.46, 0.32, 0.08]}
				size={108}
				floatSpeed={0.27}
				floatAmount={0.013}
				delay={0}
				distanceFactor={4.1}
				glowColor="rgba(74,255,221,0.57)"
				cycleDuration={CYCLE_DURATION}
				hologramOpacity={0.85}
			/>

			<FloatingLottie
				animationData={interaction}
				position={[0.48, -0.3, 0.08]}
				size={86}
				floatSpeed={0.31}
				floatAmount={0.014}
				delay={1.1}
				distanceFactor={4.15}
				glowColor="rgba(119,181,255,0.57)"
				cycleDuration={CYCLE_DURATION}
				hologramOpacity={0.8}
			/>

			<pointLight
				position={[-0.38, 0.3, 0.5]}
				color="#51ffe0"
				intensity={0.42}
				distance={2.4}
				decay={2}
			/>

			<pointLight
				position={[0.42, -0.25, 0.5]}
				color="#7db6ff"
				intensity={0.4}
				distance={2.4}
				decay={2}
			/>
		</>
	);
}

export default function ArtworkContents({
	type,
	color,
	cycleKey,
}: ArtworkContentsProps) {
	return (
		<group key={cycleKey ?? type}>
			<ProjectionWash type={type} color={color} />

			<ProjectionGlow type={type} color={color} />

			<ProjectionScanLines />

			<ProjectionDust type={type} color={color} />

			<group position={[0, 0, 0.04]}>
				{type === 'frontend' && <FrontendProjection color={color} />}

				{type === 'uiux' && <UiuxProjection color={color} />}

				{type === 'creative' && <CreativeProjection />}
			</group>
		</group>
	);
}
