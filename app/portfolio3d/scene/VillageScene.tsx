'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import CuteMap from '../objects/CuteMap';
import { RoomName } from '../types';

type Props = {
	onEnterRoom: (room: RoomName) => void;
};

const TEST_NIGHT: boolean | null = false;

function getSeoulHour(date: Date) {
	const hourText = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Seoul',
		hour: '2-digit',
		hour12: false,
	}).format(date);

	return Number(hourText);
}

function SkyDome({ isNight }: { isNight: boolean }) {
	const material = useMemo(() => {
		return new THREE.ShaderMaterial({
			side: THREE.BackSide,
			depthWrite: false,
			depthTest: false,
			uniforms: {
				topColor: {
					value: new THREE.Color(isNight ? '#050816' : '#38bdf8'),
				},
				middleColor: {
					value: new THREE.Color(isNight ? '#1e2f5c' : '#7dd3fc'),
				},
				bottomColor: {
					value: new THREE.Color(isNight ? '#3b4a63' : '#dbeafe'),
				},
				horizonColor: {
					value: new THREE.Color(isNight ? '#64748b' : '#ebf7ff'),
				},
			},
			vertexShader: `
				varying vec3 vPosition;

				void main() {
					vPosition = position;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 topColor;
				uniform vec3 middleColor;
				uniform vec3 bottomColor;
				uniform vec3 horizonColor;
				varying vec3 vPosition;

				void main() {
					float h = normalize(vPosition).y;

					float bottomMix = smoothstep(-1.0, -0.15, h);
					float middleMix = smoothstep(-0.25, 0.45, h);
					float topMix = smoothstep(0.3, 1.0, h);

					vec3 low = mix(bottomColor, horizonColor, bottomMix);
					vec3 mid = mix(low, middleColor, middleMix);
					vec3 color = mix(mid, topColor, topMix);

					gl_FragColor = vec4(color, 1.0);
				}
			`,
		});
	}, [isNight]);

	return (
		<mesh renderOrder={-1000}>
			<sphereGeometry args={[120, 64, 32]} />
			<primitive object={material} attach="material" />
		</mesh>
	);
}

function Stars() {
	const stars = useMemo(() => {
		return Array.from({ length: 300 }).map(() => {
			const radius = 70;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.PI * 0.18 + Math.random() * Math.PI * 0.5;

			return {
				x: radius * Math.sin(phi) * Math.cos(theta),
				y: radius * Math.cos(phi) - 8,
				z: radius * Math.sin(phi) * Math.sin(theta),
				size: 0.04 + Math.random() * 0.08,
			};
		});
	}, []);

	return (
		<>
			{stars.map((star, i) => (
				<mesh key={i} position={[star.x, star.y, star.z]}>
					<sphereGeometry args={[star.size, 12, 12]} />
					<meshBasicMaterial color="#ffffff" toneMapped={false} />
				</mesh>
			))}
		</>
	);
}

function BigStar({ position }: { position: [number, number, number] }) {
	return (
		<group position={position}>
			<mesh>
				<sphereGeometry args={[0.12, 18, 18]} />
				<meshBasicMaterial color="#fff8b0" toneMapped={false} />
			</mesh>

			<mesh scale={[0.04, 0.45, 0.04]}>
				<boxGeometry />
				<meshBasicMaterial color="#fff8b0" toneMapped={false} />
			</mesh>

			<mesh rotation={[0, 0, Math.PI / 2]} scale={[0.04, 0.45, 0.04]}>
				<boxGeometry />
				<meshBasicMaterial color="#fff8b0" toneMapped={false} />
			</mesh>
		</group>
	);
}

function Bird({
	delay = 0,
	y = 5,
	z = -10,
	scale = 1,
}: {
	delay?: number;
	y?: number;
	z?: number;
	scale?: number;
}) {
	const ref = useRef<THREE.Group>(null);
	const leftWing = useRef<THREE.Mesh>(null);
	const rightWing = useRef<THREE.Mesh>(null);

	useFrame(({ clock }) => {
		if (!ref.current) return;

		const cycle = 14;
		const t = (clock.elapsedTime + delay) % cycle;
		const progress = t / cycle;

		ref.current.visible = progress > 0.08 && progress < 0.92;

		const x = THREE.MathUtils.lerp(-16, 16, progress);
		const flap = Math.sin(clock.elapsedTime * 10 + delay) * 0.45;

		ref.current.position.set(
			x,
			y + Math.sin(clock.elapsedTime * 2 + delay) * 0.5,
			z
		);

		ref.current.rotation.z = Math.sin(clock.elapsedTime * 3 + delay) * 0.08;

		if (leftWing.current) leftWing.current.rotation.z = Math.PI / 5 + flap;
		if (rightWing.current) rightWing.current.rotation.z = -Math.PI / 5 - flap;
	});

	return (
		<group ref={ref} scale={scale}>
			<mesh scale={[1.25, 0.75, 0.75]}>
				<sphereGeometry args={[0.22, 24, 24]} />
				<meshBasicMaterial color="#8b5a2b" toneMapped={false} />
			</mesh>

			<mesh position={[0.03, -0.04, 0.08]} scale={[0.85, 0.45, 0.22]}>
				<sphereGeometry args={[0.18, 20, 20]} />
				<meshBasicMaterial color="#f5deb3" toneMapped={false} />
			</mesh>

			<mesh position={[0.34, 0.08, 0]} scale={[0.9, 0.9, 0.9]}>
				<sphereGeometry args={[0.16, 20, 20]} />
				<meshBasicMaterial color="#8b5a2b" toneMapped={false} />
			</mesh>

			<mesh position={[0.5, 0.08, 0]} rotation={[0, 0, -Math.PI / 2]}>
				<coneGeometry args={[0.05, 0.14, 12]} />
				<meshBasicMaterial color="#f2c94c" toneMapped={false} />
			</mesh>

			<mesh position={[0.4, 0.14, 0.12]}>
				<sphereGeometry args={[0.018, 8, 8]} />
				<meshBasicMaterial color="#111827" toneMapped={false} />
			</mesh>

			<mesh
				ref={leftWing}
				position={[-0.15, 0.04, 0.02]}
				rotation={[0, 0, Math.PI / 5]}
				scale={[1, 0.35, 0.22]}
			>
				<sphereGeometry args={[0.28, 20, 20]} />
				<meshBasicMaterial color="#d9b88f" toneMapped={false} />
			</mesh>

			<mesh
				ref={rightWing}
				position={[0.05, 0.04, -0.08]}
				rotation={[0, 0, -Math.PI / 5]}
				scale={[1, 0.35, 0.22]}
			>
				<sphereGeometry args={[0.28, 20, 20]} />
				<meshBasicMaterial color="#d9b88f" toneMapped={false} />
			</mesh>

			<mesh position={[-0.35, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
				<coneGeometry args={[0.1, 0.24, 3]} />
				<meshBasicMaterial color="#6f451f" toneMapped={false} />
			</mesh>
		</group>
	);
}

export default function VillageScene({ onEnterRoom }: Props) {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 60_000);
		return () => clearInterval(timer);
	}, []);

	const hour = getSeoulHour(now);
	const isNight = TEST_NIGHT !== null ? TEST_NIGHT : hour < 6 || hour >= 19;

	return (
		<group>
			<SkyDome isNight={isNight} />

			{isNight && (
				<>
					<Stars />
					<BigStar position={[-18, 20, -45]} />
					<BigStar position={[10, 26, -48]} />
					<BigStar position={[24, 18, -44]} />

					<mesh position={[22, 23, -50]}>
						<sphereGeometry args={[2.2, 48, 48]} />
						<meshBasicMaterial color="#fff7d6" toneMapped={false} />
					</mesh>
				</>
			)}

			{!isNight && (
				<>
					<Bird delay={0} y={5} z={-10} scale={1} />
					<Bird delay={5} y={5} z={-12} scale={0.8} />
					<Bird delay={9} y={4} z={-9} scale={1.1} />
				</>
			)}

			<ambientLight intensity={isNight ? 0.12 : 0.62} />

			<directionalLight
				position={[4, 8, 5]}
				intensity={isNight ? 0.16 : 0.92}
				color={isNight ? '#93c5fd' : '#fff4d6'}
				castShadow
			/>

			{isNight && (
				<>
					<pointLight
						position={[-3.3, 2.2, -2.9]}
						intensity={2.8}
						distance={9}
						decay={2}
						color="#ffd76a"
					/>
					<pointLight
						position={[3.3, 2.2, -2.9]}
						intensity={2.8}
						distance={9}
						decay={2}
						color="#ffd76a"
					/>
					<pointLight
						position={[-3.3, 2.2, 2.9]}
						intensity={2.8}
						distance={9}
						decay={2}
						color="#ffd76a"
					/>
					<pointLight
						position={[3.3, 2.2, 2.9]}
						intensity={2.8}
						distance={9}
						decay={2}
						color="#ffd76a"
					/>
				</>
			)}

			<CuteMap isNight={isNight} onEnterRoom={onEnterRoom} />
		</group>
	);
}
