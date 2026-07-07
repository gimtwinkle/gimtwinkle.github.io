'use client';

import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { C } from './colors';
import { Star } from './CuteDecor';
import RoundedBox from '../../components/RoundedBox';

function Pipe() {
	return (
		<group position={[0.7, -0.05, 0.05]}>
			<mesh rotation={[0, 0, Math.PI / 2]} position={[0.55, 0.35, 0]}>
				<cylinderGeometry args={[0.13, 0.13, 0.9, 24]} />
				<meshStandardMaterial color={C.lavender} />
			</mesh>

			<mesh position={[0.95, -0.05, 0]}>
				<cylinderGeometry args={[0.16, 0.16, 0.75, 24]} />
				<meshStandardMaterial color={C.mint} />
			</mesh>

			<mesh rotation={[0, 0, Math.PI / 2]} position={[1.35, -0.42, 0]}>
				<cylinderGeometry args={[0.13, 0.13, 0.9, 24]} />
				<meshStandardMaterial color={C.lavender} />
			</mesh>
		</group>
	);
}

export default function WorkshopMachine() {
	const belt = useRef<THREE.Group>(null);
	const glow = useRef<THREE.PointLight>(null);

	useFrame(({ clock }) => {
		const t = clock.elapsedTime;
		if (belt.current) belt.current.position.x = Math.sin(t * 2.2) * 0.035;
		if (glow.current) glow.current.intensity = 0.7 + Math.sin(t * 3) * 0.25;
	});

	return (
		<group position={[2.55, 0.88, -1.75]}>
			<RoundedBox
				args={[1.05, 1.78, 0.78]}
				radius={0.2}
				smoothness={16}
				castShadow
			>
				<meshPhysicalMaterial
					color={C.pink}
					roughness={0.28}
					clearcoat={0.75}
					clearcoatRoughness={0.25}
				/>
			</RoundedBox>

			<mesh position={[0, 0.96, 0]}>
				<cylinderGeometry args={[0.36, 0.36, 0.12, 32]} />
				<meshStandardMaterial color={C.pinkDeep} />
			</mesh>

			<mesh position={[0, 1.08, 0]}>
				<sphereGeometry args={[0.16, 24, 24]} />
				<meshStandardMaterial
					color={C.yellow}
					emissive={C.yellow}
					emissiveIntensity={0.7}
				/>
			</mesh>

			<pointLight
				ref={glow}
				position={[0, 1.15, 0]}
				distance={2.2}
				color="#fff176"
				intensity={0.8}
			/>

			<Text
				position={[0, 0.45, 0.43]}
				fontSize={0.18}
				color={C.white}
				anchorX="center"
				anchorY="middle"
			>
				Ideas
			</Text>
			<Text
				position={[0, 0.22, 0.43]}
				fontSize={0.16}
				color={C.white}
				anchorX="center"
				anchorY="middle"
			>
				IN
			</Text>

			<RoundedBox
				args={[0.45, 0.09, 0.06]}
				radius={0.03}
				position={[0, 0.02, 0.43]}
			>
				<meshStandardMaterial color="#dc6698" />
			</RoundedBox>

			<RoundedBox
				args={[0.58, 0.56, 0.1]}
				radius={0.09}
				position={[0, -0.52, 0.43]}
			>
				<meshStandardMaterial color={C.dark} />
			</RoundedBox>

			<group ref={belt} position={[0, -0.96, 0.32]}>
				<RoundedBox args={[0.78, 0.18, 0.52]} radius={0.07} castShadow>
					<meshStandardMaterial color={C.mintDeep} />
				</RoundedBox>

				<RoundedBox
					args={[0.6, 0.08, 0.4]}
					radius={0.04}
					position={[0, 0.08, 0]}
				>
					<meshStandardMaterial color="#5c5144" />
				</RoundedBox>

				<Text
					position={[0, 0.14, 0.3]}
					fontSize={0.1}
					color={C.white}
					anchorX="center"
				>
					Output
				</Text>
			</group>

			<Pipe />

			<Star position={[-0.38, 0.78, 0.45]} scale={0.48} />
			<Star position={[0.35, -0.9, 0.55]} scale={0.42} />
		</group>
	);
}
