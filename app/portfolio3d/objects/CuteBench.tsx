'use client';

import { RoundedBox } from '@react-three/drei';

export default function CuteBench({
	position,
	rotation = [0, 0, 0],
}: {
	position: [number, number, number];
	rotation?: [number, number, number];
}) {
	return (
		<group position={position} rotation={rotation}>
			{/* ====== 좌판 ====== */}
			{[-0.11, 0, 0.11].map((z, i) => (
				<RoundedBox
					key={i}
					position={[0, 0.46, z]}
					args={[1.15, 0.07, 0.1]}
					radius={0.025}
					smoothness={4}
					castShadow
				>
					<meshPhysicalMaterial
						color="#d18b45"
						roughness={0.45}
						clearcoat={0.15}
					/>
				</RoundedBox>
			))}

			{/* ====== 등받이 ====== */}
			{[0.65, 0.82].map((y, i) => (
				<RoundedBox
					key={i}
					position={[0, y, -0.16]}
					args={[1.15, 0.07, 0.1]}
					radius={0.025}
					smoothness={4}
					castShadow
				>
					<meshPhysicalMaterial
						color="#d18b45"
						roughness={0.45}
						clearcoat={0.15}
					/>
				</RoundedBox>
			))}

			{/* ===== 등받이 ===== */}
			<group position={[0, 0.74, -0.2]} rotation={[-0.25, 0, 0]}>
				{[-0.08, 0, 0.08].map((y, i) => (
					<RoundedBox
						key={i}
						position={[0, y, 0]}
						args={[1.15, 0.07, 0.1]}
						radius={0.025}
						smoothness={4}
						castShadow
					>
						<meshPhysicalMaterial
							color="#d18b45"
							roughness={0.45}
							clearcoat={0.15}
						/>
					</RoundedBox>
				))}
			</group>

			{/* ===== 다리 ===== */}
			{[
				[-0.48, 0.22, -0.11],
				[0.48, 0.22, -0.11],
				[-0.48, 0.22, 0.11],
				[0.48, 0.22, 0.11],
			].map(([x, y, z], i) => (
				<mesh key={i} position={[x, y, z]} castShadow>
					<cylinderGeometry args={[0.035, 0.04, 0.45, 10]} />
					<meshStandardMaterial color="#6d4325" />
				</mesh>
			))}

			{/* ===== 지지대 ===== */}
			<mesh position={[0, 0.16, -0.11]} castShadow>
				<boxGeometry args={[0.92, 0.04, 0.04]} />
				<meshStandardMaterial color="#5b371d" />
			</mesh>

			<mesh position={[0, 0.16, 0.11]} castShadow>
				<boxGeometry args={[0.92, 0.04, 0.04]} />
				<meshStandardMaterial color="#5b371d" />
			</mesh>

			{/* ===== 팔걸이 ===== */}
			{[-0.56, 0.56].map((x, i) => (
				<group key={i}>
					<mesh position={[x, 0.62, 0]} castShadow>
						<boxGeometry args={[0.05, 0.35, 0.05]} />
						<meshStandardMaterial color="#6d4325" />
					</mesh>

					<RoundedBox
						position={[x, 0.77, 0]}
						args={[0.08, 0.05, 0.35]}
						radius={0.02}
						smoothness={4}
						castShadow
					>
						<meshPhysicalMaterial
							color="#d18b45"
							roughness={0.45}
							clearcoat={0.15}
						/>
					</RoundedBox>
				</group>
			))}
		</group>
	);
}
