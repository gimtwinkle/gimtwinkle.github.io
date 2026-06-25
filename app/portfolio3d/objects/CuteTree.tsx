'use client';

type Props = {
	position: [number, number, number];
	scale?: number;
};

export default function CuteTree({ position, scale = 1 }: Props) {
	return (
		<group position={position} scale={scale}>
			{/* 기둥 */}
			<mesh position={[0, 0.45, 0]} castShadow>
				<cylinderGeometry args={[0.16, 0.22, 0.9, 16]} />
				<meshPhysicalMaterial
					color="#8b5a2b"
					roughness={0.45}
					clearcoat={0.15}
				/>
			</mesh>

			{/* 아래 잎 */}
			<mesh position={[0, 1.0, 0]} castShadow>
				{/* 아래 */}
				<coneGeometry args={[0.95, 0.9, 32]} />
				<meshPhysicalMaterial
					color="#15803d"
					roughness={0.28}
					clearcoat={0.45}
				/>
			</mesh>

			{/* 중간 잎 */}
			<mesh position={[0, 1.55, 0]} castShadow>
				{/* 중간 */}
				<coneGeometry args={[0.75, 0.75, 32]} />
				<meshPhysicalMaterial
					color="#16a34a"
					roughness={0.25}
					clearcoat={0.5}
				/>
			</mesh>

			{/* 위 잎 */}
			<mesh position={[0, 2.05, 0]} castShadow>
				{/* 위 */}
				<coneGeometry args={[0.55, 0.55, 32]} />
				<meshPhysicalMaterial
					color="#22c55e"
					roughness={0.22}
					clearcoat={0.55}
				/>
			</mesh>
		</group>
	);
}
