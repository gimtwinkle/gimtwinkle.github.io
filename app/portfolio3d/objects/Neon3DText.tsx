'use client';

import { Center, Text3D } from '@react-three/drei';

type Neon3DTextProps = {
	text?: string;
	position?: [number, number, number];
	rotation?: [number, number, number];
	scale?: number;
	color?: string;
};

export default function Neon3DText({
	text = 'ABOUT',
	position = [0, 2.05, -1.7],
	rotation = [0, 0, 0],
	scale = 1,
	color = '#ff5ca8',
}: Neon3DTextProps) {
	return (
		<group position={position} rotation={rotation} scale={scale}>
			{/* 뒤쪽 은은한 빛 */}
			<pointLight
				position={[0, 0, 0.45]}
				intensity={1.4}
				distance={3}
				color={color}
			/>

			<Center>
				<Text3D
					font="/fonts/helvetiker_bold.typeface.json"
					size={0.34}
					height={0.08}
					curveSegments={16}
					bevelEnabled
					bevelSize={0.018}
					bevelThickness={0.009}
					bevelSegments={5}
				>
					{text}
					<meshPhysicalMaterial
						color="#fff2fb"
						emissive={color}
						emissiveIntensity={2.4}
						roughness={0.15}
						metalness={0.15}
						clearcoat={1}
					/>
				</Text3D>
			</Center>

			{/* 뒤 받침대 */}
			<mesh position={[0, -0.08, -0.08]}>
				<boxGeometry args={[text.length * 0.26 + 0.35, 0.04, 0.06]} />
				<meshStandardMaterial color="#2b174f" roughness={0.35} />
			</mesh>

			{/* 벽에 고정된 느낌의 얇은 브라켓 */}
			<mesh position={[-text.length * 0.13, -0.22, -0.08]}>
				<boxGeometry args={[0.035, 0.34, 0.045]} />
				<meshStandardMaterial color="#3b2a4f" roughness={0.45} />
			</mesh>

			<mesh position={[text.length * 0.13, -0.22, -0.08]}>
				<boxGeometry args={[0.035, 0.34, 0.045]} />
				<meshStandardMaterial color="#3b2a4f" roughness={0.45} />
			</mesh>
		</group>
	);
}
