'use client';

export default function CuteThoughtBubble({
	position,
	scale,
}: {
	position: [number, number, number];
	scale: number;
}) {
	return (
		<group position={position} scale={scale}>
			{/* 꼬리 */}
			<mesh position={[-0.2, -0.18, 0]}>
				<sphereGeometry args={[0.05, 40, 40]} />
				<meshPhysicalMaterial color="#ffffff" roughness={0.12} clearcoat={1} />
			</mesh>

			<mesh position={[-0.08, -0.05, 0]}>
				<sphereGeometry args={[0.08, 20, 20]} />
				<meshPhysicalMaterial color="#ffffff" roughness={0.12} clearcoat={1} />
			</mesh>

			{/* 메인 버블 */}
			<mesh position={[0, 0.08, 0]} scale={[1.1, 0.85, 0.5]}>
				<sphereGeometry args={[0.28, 32, 32]} />
				<meshPhysicalMaterial color="#ffffff" roughness={0.08} clearcoat={1} />
			</mesh>

			{/* 볼록한 느낌 */}
			<mesh position={[-0.12, 0.16, 0.02]} scale={[0.55, 0.45, 0.35]}>
				<sphereGeometry args={[0.18, 24, 24]} />
				<meshPhysicalMaterial color="#ffffff" roughness={0.08} clearcoat={1} />
			</mesh>

			<mesh position={[0.12, 0.14, 0.02]} scale={[0.5, 0.4, 0.35]}>
				<sphereGeometry args={[0.17, 24, 24]} />
				<meshPhysicalMaterial color="#ffffff" roughness={0.08} clearcoat={1} />
			</mesh>

			{/* 하이라이트 */}
			<mesh position={[-0.08, 0.16, 0.12]} scale={[0.16, 0.08, 0.03]}>
				<sphereGeometry args={[1, 16, 16]} />
				<meshPhysicalMaterial color="#ffffff" transparent opacity={0.45} />
			</mesh>
		</group>
	);
}
