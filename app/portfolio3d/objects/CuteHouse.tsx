'use client';

import { RoundedBox, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { RoomName } from '../types';
import CuteKeyboard from './CuteKeyboard';

type Props = {
	label: string;
	targetId: RoomName;
	position: [number, number, number];
	rotation?: [number, number, number];
	color: string;
	roofColor: string;
	onEnterRoom?: (room: RoomName) => void;
};

function BalloonMaterial({ color }: { color: string }) {
	return (
		<meshPhysicalMaterial
			color={color}
			roughness={0.34}
			metalness={0}
			clearcoat={0.65}
			clearcoatRoughness={0.32}
			sheen={1}
			sheenRoughness={0.5}
		/>
	);
}

function Roof({ color }: { color: string }) {
	const geometry = useMemo(() => {
		const shape = new THREE.Shape();

		shape.moveTo(-1.5, 0);
		shape.lineTo(0, 0.7);
		shape.lineTo(1.5, 0);
		shape.closePath();

		const geo = new THREE.ExtrudeGeometry(shape, {
			depth: 2.5,
			bevelEnabled: true,
			bevelSegments: 8,
			steps: 1,
			bevelSize: 0.1,
			bevelThickness: 0.1,
		});

		geo.center();

		return geo;
	}, []);

	return (
		<group position={[0, 1.85, 0]}>
			<mesh geometry={geometry} rotation={[0, Math.PI / 2, 0]} castShadow>
				<BalloonMaterial color={color} />
			</mesh>
		</group>
	);
}

function EnvelopeIcon() {
	return (
		<group position={[0, 2.65, 0.9]} rotation={[0, -0.12, -0.05]}>
			<RoundedBox
				args={[1.05, 0.7, 0.08]}
				radius={0.08}
				smoothness={8}
				castShadow
			>
				<meshPhysicalMaterial
					color="#fffdf8"
					roughness={0.25}
					clearcoat={0.5}
				/>
			</RoundedBox>

			{[
				[-0.23, 0.12, 0.055, -0.5],
				[0.23, 0.12, 0.055, 0.5],
				[-0.23, -0.12, 0.056, 0.5],
				[0.23, -0.12, 0.056, -0.5],
			].map(([x, y, z, r], i) => (
				<mesh key={i} position={[x, y, z]} rotation={[0, 0, r]}>
					<boxGeometry args={[0.5, 0.025, 0.018]} />
					<meshPhysicalMaterial color={i < 2 ? '#cfcfcf' : '#d8d8d8'} />
				</mesh>
			))}
		</group>
	);
}

function BookIcon() {
	const books = [
		{ y: 0.2, color: '#8b5cf6', rot: 0.08, w: 1.08, d: 0.62 },
		{ y: 0.4, color: '#38bdf8', rot: -0.12, w: 0.96, d: 0.56 },
		{ y: 0.6, color: '#fb7185', rot: 0.16, w: 0.84, d: 0.52 },
	];

	return (
		<group position={[0, 2.25, 0.35]} rotation={[0, 0.15, -0.05]}>
			{books.map((book, i) => (
				<group key={i} position={[0, book.y, 0]} rotation={[0, book.rot, 0]}>
					<RoundedBox
						position={[0, -0.075, 0]}
						args={[book.w, 0.02, book.d]}
						radius={0.025}
						smoothness={8}
						castShadow
					>
						<meshPhysicalMaterial
							color={book.color}
							roughness={0.18}
							clearcoat={0.72}
						/>
					</RoundedBox>

					<RoundedBox
						position={[0.04, 0, 0]}
						args={[book.w - 0.08, 0.14, book.d - 0.05]}
						radius={0.02}
						smoothness={6}
						castShadow
					>
						<meshPhysicalMaterial
							color="#ffffff"
							roughness={0.58}
							clearcoat={0.04}
						/>
					</RoundedBox>

					<RoundedBox
						position={[0, 0.075, 0]}
						args={[book.w, 0.02, book.d]}
						radius={0.025}
						smoothness={8}
						castShadow
					>
						<meshPhysicalMaterial
							color={book.color}
							roughness={0.16}
							clearcoat={0.75}
						/>
					</RoundedBox>
				</group>
			))}
		</group>
	);
}

export default function CuteHouse({
	label,
	targetId,
	position,
	rotation = [0, 0, 0],
	color,
	roofColor,
	onEnterRoom,
}: Props) {
	const { scene } = useThree();

	const doorRef = useRef<THREE.Group>(null);
	const enterRequestedRef = useRef(false);

	const [near, setNear] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [clickedOpen, setClickedOpen] = useState(false);

	const isContact = label.toLowerCase() === 'contact';
	const isSkills = label.toLowerCase() === 'skills';
	const isWork = label.toLowerCase() === 'work';

	const isDoorOpen = near || hovered || clickedOpen;

	useFrame(() => {
		const player = scene.getObjectByName('player');
		if (!player) return;

		const distance = player.position.distanceTo(new THREE.Vector3(...position));
		const isNearNow = distance < 2.2;

		setNear(isNearNow);

		if (!doorRef.current) return;

		const shouldOpen = isNearNow || hovered || clickedOpen;
		const target = shouldOpen ? -Math.PI / 1.7 : 0;

		doorRef.current.rotation.y = THREE.MathUtils.lerp(
			doorRef.current.rotation.y,
			target,
			0.16
		);

		if (
			(isNearNow || clickedOpen) &&
			!enterRequestedRef.current &&
			Math.abs(doorRef.current.rotation.y - target) < 0.08
		) {
			enterRequestedRef.current = true;

			setTimeout(() => {
				onEnterRoom?.(targetId);
			}, 250);
		}

		if (!isNearNow && !clickedOpen) {
			enterRequestedRef.current = false;
		}
	});

	return (
		<group
			position={position}
			rotation={rotation}
			onClick={(e) => {
				e.stopPropagation();
				setClickedOpen(true);
			}}
			onPointerOver={(e) => {
				e.stopPropagation();
				setHovered(true);
				document.body.style.cursor = 'pointer';
			}}
			onPointerOut={(e) => {
				e.stopPropagation();
				setHovered(false);
				document.body.style.cursor = 'default';
			}}
			scale={1.18}
		>
			<RoundedBox
				position={[0, 0.82, 0]}
				args={[2.62, 1.72, 2.12]}
				radius={0.28}
				smoothness={10}
				castShadow
			>
				<BalloonMaterial color={color} />
			</RoundedBox>

			<Roof color={roofColor} />

			<RoundedBox
				position={[0, 0.48, 1.1]}
				args={[0.95, 1.16, 0.14]}
				radius={0.24}
				smoothness={10}
				castShadow
			>
				<meshPhysicalMaterial
					color="#fff4c7"
					roughness={0.18}
					clearcoat={0.85}
				/>
			</RoundedBox>

			<group ref={doorRef} position={[-0.35, 0.45, 1.22]}>
				<RoundedBox
					position={[0.35, 0, 0]}
					args={[0.7, 0.94, 0.1]}
					radius={0.2}
					smoothness={10}
					castShadow
				>
					<meshPhysicalMaterial
						color={roofColor}
						roughness={0.22}
						clearcoat={0.75}
					/>
				</RoundedBox>

				<mesh position={[0.55, -0.03, 0.11]} castShadow>
					<sphereGeometry args={[0.06, 20, 20]} />
					<meshPhysicalMaterial
						color="#facc15"
						roughness={0.08}
						clearcoat={1}
					/>
				</mesh>
			</group>

			{[
				[-0.78, 0.95, 1.12],
				[0.78, 0.95, 1.12],
			].map(([x, y, z], i) => (
				<group key={i} position={[x, y, z]}>
					<RoundedBox
						position={[0, 0, 0.02]}
						args={[0.56, 0.42, 0.03]}
						radius={0.08}
						smoothness={8}
						castShadow
					>
						<meshPhysicalMaterial
							color="#fff4c7"
							roughness={0.18}
							clearcoat={0.7}
						/>
					</RoundedBox>

					<RoundedBox
						position={[0, 0, 0.045]}
						args={[0.45, 0.32, 0.014]}
						radius={0.05}
						smoothness={8}
						castShadow
					>
						<meshPhysicalMaterial
							color="#b8f3ff"
							roughness={0.03}
							clearcoat={1}
						/>
					</RoundedBox>

					<mesh position={[0, 0, 0.06]} castShadow>
						<boxGeometry args={[0.012, 0.32, 0.01]} />
						<meshPhysicalMaterial
							color="#ffffff"
							roughness={0.15}
							clearcoat={0.4}
						/>
					</mesh>

					<mesh
						position={[0, 0, 0.061]}
						rotation={[0, 0, Math.PI / 2]}
						castShadow
					>
						<boxGeometry args={[0.012, 0.42, 0.01]} />
						<meshPhysicalMaterial
							color="#ffffff"
							roughness={0.15}
							clearcoat={0.4}
						/>
					</mesh>
				</group>
			))}

			{[0, 1, 2].map((i) => (
				<mesh
					key={i}
					position={[0, 0.08, 1.58 + i * 0.34]}
					rotation={[-Math.PI / 2, 0, 0]}
					scale={[1 - i * 0.16, 0.55 - i * 0.06, 1]}
					receiveShadow
				>
					<circleGeometry args={[0.5, 48]} />
					<meshPhysicalMaterial
						color="#ffd1b8"
						roughness={0.08}
						clearcoat={1}
					/>
				</mesh>
			))}

			<RoundedBox
				position={[0, 2, 1.24]}
				args={[1.05, 0.34, 0.1]}
				radius={0.12}
				smoothness={10}
				castShadow
			>
				<meshPhysicalMaterial
					color={roofColor}
					roughness={0.16}
					clearcoat={0.75}
				/>
			</RoundedBox>

			<Text
				position={[0, 2, 1.31]}
				fontSize={0.16}
				color="#ffffff"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				{isDoorOpen ? `${label.toUpperCase()}!` : label.toUpperCase()}
			</Text>

			{isWork && (
				<group position={[0, 2.65, 1.2]} rotation={[2, 0, 0.2]}>
					<CuteKeyboard
						position={[0, 0, 0]}
						rotation={[-0.2, 0, 0]}
						scale={0.78}
					/>
				</group>
			)}

			{isSkills && <BookIcon />}
			{isContact && <EnvelopeIcon />}
		</group>
	);
}
