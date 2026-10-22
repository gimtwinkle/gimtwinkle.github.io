'use client';

type Props = {
	position: [number, number, number];
	scale?: 'small' | 'medium' | 'large';
	type?: 'red' | 'choco';
};

const mushroomScale = {
	small: 0.75,
	medium: 1,
	large: 1.25,
};

export default function CuteMushroom({
	position,
	scale = 'medium',
	type = 'red',
}: Props) {
	const isRed = type === 'red';
	const capColor = isRed ? '#ef4444' : '#7c4a2d';

	return (
		<group position={position} scale={mushroomScale[scale]}>
			{/* 줄기 */}
			<mesh position={[0, 0.18, 0]} castShadow>
				<cylinderGeometry args={[0.08, 0.12, 0.35, 18]} />
				<meshPhysicalMaterial
					color="#fff7ed"
					roughness={0.18}
					clearcoat={0.55}
				/>
			</mesh>

			{/* 갓 */}
			<mesh position={[0, 0.43, 0]} scale={[1.1, 0.5, 1.1]} castShadow>
				<sphereGeometry args={[0.3, 32, 32]} />
				<meshPhysicalMaterial
					color={capColor}
					roughness={0.18}
					clearcoat={0.75}
				/>
			</mesh>

			{/* 갓 아래 */}
			<mesh position={[0, 0.35, 0]} scale={[1.05, 0.12, 1.05]} castShadow>
				<sphereGeometry args={[0.24, 24, 24]} />
				<meshPhysicalMaterial
					color="#fff1dd"
					roughness={0.3}
					clearcoat={0.35}
				/>
			</mesh>

			{/* 빨간 버섯 흰 점 */}
			{isRed && (
				<>
					<mesh position={[0.1, 0.53, 0.14]} castShadow>
						<sphereGeometry args={[0.04, 12, 12]} />
						<meshPhysicalMaterial
							color="#ffffff"
							roughness={0.2}
							clearcoat={0.7}
						/>
					</mesh>

					<mesh position={[-0.1, 0.5, -0.04]} castShadow>
						<sphereGeometry args={[0.035, 12, 12]} />
						<meshPhysicalMaterial
							color="#ffffff"
							roughness={0.2}
							clearcoat={0.7}
						/>
					</mesh>

					<mesh position={[0.02, 0.56, -0.12]} castShadow>
						<sphereGeometry args={[0.032, 12, 12]} />
						<meshPhysicalMaterial
							color="#ffffff"
							roughness={0.2}
							clearcoat={0.7}
						/>
					</mesh>
				</>
			)}
		</group>
	);
}
