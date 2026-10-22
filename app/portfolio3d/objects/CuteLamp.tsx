'use client';

export default function CuteLamp({
	position,
}: {
	position: [number, number, number];
}) {
	return (
		<group position={position}>
			{/* 기둥 */}
			<mesh position={[0, 0.65, 0]} castShadow>
				<cylinderGeometry args={[0.05, 0.06, 1.3, 18]} />
				<meshStandardMaterial color="#1f2937" />
			</mesh>

			{/* 받침 */}
			<mesh position={[0, -0.02, 0]} castShadow>
				<cylinderGeometry args={[0.13, 0.15, 0.06, 20]} />
				<meshStandardMaterial color="#111827" />
			</mesh>

			{/* 램프 몸체 */}
			<mesh position={[0, 1.35, 0]} castShadow>
				<boxGeometry args={[0.3, 0.38, 0.3]} />
				<meshPhysicalMaterial
					color="#fff7c7"
					emissive="#ffd166"
					emissiveIntensity={1.8}
					roughness={0.04}
					clearcoat={1}
				/>
			</mesh>

			{/* 지붕 */}
			<mesh position={[0, 1.63, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
				<coneGeometry args={[0.34, 0.16, 4]} />
				<meshStandardMaterial color="#111827" />
			</mesh>

			{/* 지붕 꼭지 */}
			<mesh position={[0, 1.74, 0]} castShadow>
				<sphereGeometry args={[0.035, 16, 16]} />
				<meshStandardMaterial color="#111827" />
			</mesh>

			{/* 아래 장식 */}
			<mesh position={[0, 1.08, 0]} castShadow>
				<cylinderGeometry args={[0.12, 0.12, 0.05, 20]} />
				<meshStandardMaterial color="#111827" />
			</mesh>

			{/* 따뜻한 빛 */}
			<pointLight
				position={[0, 1.35, 0]}
				intensity={2.4}
				distance={6}
				decay={1.5}
				color="#ffd166"
			/>
		</group>
	);
}
