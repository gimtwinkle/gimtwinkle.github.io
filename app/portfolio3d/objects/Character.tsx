'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const keys: Record<string, boolean> = {};

function Skirt() {
	const geometry = useMemo(() => {
		const points = [
			new THREE.Vector2(0.13, 0.16),
			new THREE.Vector2(0.2, 0.05),
			new THREE.Vector2(0.28, -0.1),
			new THREE.Vector2(0.34, -0.22),
		];

		return new THREE.LatheGeometry(points, 40);
	}, []);

	return (
		<group scale={[1, 1, 0.58]}>
			<mesh geometry={geometry} castShadow>
				<meshPhysicalMaterial
					color="#749df5"
					roughness={0.38}
					clearcoat={0.28}
					side={THREE.DoubleSide}
				/>
			</mesh>

			<mesh position={[0, -0.22, 0]} scale={[1, 0.1, 1]} castShadow>
				<torusGeometry args={[0.34, 0.012, 12, 40]} />
				<meshStandardMaterial color="#749df5" />
			</mesh>
		</group>
	);
}

export default function Character() {
	const ref = useRef<THREE.Group>(null);
	const bodyRef = useRef<THREE.Group>(null);

	const headRef = useRef<THREE.Group>(null);
	const leftArmRef = useRef<THREE.Group>(null);
	const rightArmRef = useRef<THREE.Group>(null);
	const leftLegRef = useRef<THREE.Group>(null);
	const rightLegRef = useRef<THREE.Group>(null);
	const leftFootRef = useRef<THREE.Group>(null);
	const rightFootRef = useRef<THREE.Group>(null);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			keys[e.key.toLowerCase()] = true;
		};

		const up = (e: KeyboardEvent) => {
			keys[e.key.toLowerCase()] = false;
		};

		window.addEventListener('keydown', down);
		window.addEventListener('keyup', up);

		return () => {
			window.removeEventListener('keydown', down);
			window.removeEventListener('keyup', up);
		};
	}, []);

	useFrame((state, delta) => {
		if (!ref.current) return;

		const move = new THREE.Vector3();
		const speed = 3.2;

		if (keys['w'] || keys['arrowup']) move.z -= 1;
		if (keys['s'] || keys['arrowdown']) move.z += 1;
		if (keys['a'] || keys['arrowleft']) move.x -= 1;
		if (keys['d'] || keys['arrowright']) move.x += 1;

		const isMoving = move.length() > 0;
		const time = state.clock.elapsedTime;

		if (isMoving) {
			move.normalize();

			ref.current.position.add(move.multiplyScalar(speed * delta));
			ref.current.rotation.y = Math.atan2(move.x, move.z);

			const walk = Math.sin(time * 11);
			const opposite = Math.sin(time * 11 + Math.PI);
			const bounce = Math.abs(Math.sin(time * 11)) * 0.035;

			if (bodyRef.current) {
				bodyRef.current.position.y = bounce;
				bodyRef.current.rotation.z = Math.sin(time * 11) * 0.025;
			}
			if (headRef.current) {
				headRef.current.rotation.z = Math.sin(time * 8) * 0.025;
			}

			if (headRef.current) {
				headRef.current.rotation.z = THREE.MathUtils.lerp(
					headRef.current.rotation.z,
					0,
					0.15
				);
			}
			if (leftArmRef.current) leftArmRef.current.rotation.x = opposite * 0.55;
			if (rightArmRef.current) rightArmRef.current.rotation.x = walk * 0.55;

			if (leftLegRef.current) leftLegRef.current.rotation.x = walk * 0.38;
			if (rightLegRef.current) rightLegRef.current.rotation.x = opposite * 0.38;

			if (leftFootRef.current)
				leftFootRef.current.rotation.x = Math.max(0, walk) * 0.45;
			if (rightFootRef.current)
				rightFootRef.current.rotation.x = Math.max(0, opposite) * 0.45;
		} else {
			if (bodyRef.current) {
				bodyRef.current.position.y = THREE.MathUtils.lerp(
					bodyRef.current.position.y,
					0,
					0.15
				);
				bodyRef.current.rotation.z = THREE.MathUtils.lerp(
					bodyRef.current.rotation.z,
					0,
					0.15
				);
			}

			[
				leftArmRef,
				rightArmRef,
				leftLegRef,
				rightLegRef,
				leftFootRef,
				rightFootRef,
			].forEach((part) => {
				if (!part.current) return;
				part.current.rotation.x = THREE.MathUtils.lerp(
					part.current.rotation.x,
					0,
					0.15
				);
			});
		}

		ref.current.position.x = THREE.MathUtils.clamp(
			ref.current.position.x,
			-8,
			8
		);
		ref.current.position.z = THREE.MathUtils.clamp(
			ref.current.position.z,
			-8,
			8
		);
	});

	return (
		<group ref={ref} name="player" position={[0, 0.18, 0]} scale={0.72}>
			<group ref={bodyRef}>
				{/* 목 */}
				<mesh position={[0, 0.72, 0]} castShadow>
					<cylinderGeometry args={[0.065, 0.075, 0.13, 20]} />
					<meshPhysicalMaterial
						color="#ffd8c2"
						roughness={0.35}
						clearcoat={0.35}
					/>
				</mesh>

				{/* 몸통 - 동물의 숲처럼 짧고 통통 */}
				<mesh position={[0, 0.47, 0]} scale={[1.15, 1, 0.75]} castShadow>
					<capsuleGeometry args={[0.22, 0.22, 8, 24]} />
					<meshPhysicalMaterial
						color="#dfdfdf"
						roughness={0.3}
						clearcoat={0.55}
					/>
				</mesh>

				{/* 어깨 */}
				<mesh position={[0, 0.63, 0]} scale={[1.35, 0.24, 0.72]} castShadow>
					<sphereGeometry args={[0.2, 24, 24]} />
					<meshPhysicalMaterial
						color="#fa9ec3"
						roughness={0.3}
						clearcoat={0.45}
					/>
				</mesh>

				{/* 목 라운드 */}
				<mesh position={[0, 0.65, 0]} scale={[1, 0.2, 0.72]} castShadow>
					<torusGeometry args={[0.105, 0.014, 12, 32]} />
					<meshStandardMaterial color="#ff4f9a" />
				</mesh>

				{/* 머리 - 크게 */}
				<group ref={headRef} position={[0, 1.05, 0]}>
					{/* 뒷머리 */}
					<mesh position={[0, -0.02, -0.08]} scale={[1.12, 1.08, 1]} castShadow>
						<sphereGeometry args={[0.42, 36, 36]} />
						<meshStandardMaterial color="#4b2e2b" />
					</mesh>

					{/* 얼굴 */}
					<mesh
						position={[0, -0.04, 0.14]}
						scale={[0.92, 0.98, 0.82]}
						castShadow
					>
						<sphereGeometry args={[0.36, 36, 36]} />
						<meshPhysicalMaterial
							color="#ffd8c2"
							roughness={0.28}
							clearcoat={0.45}
						/>
					</mesh>

					{/* 귀 */}
					<mesh
						position={[-0.33, -0.05, 0.1]}
						scale={[0.45, 0.68, 0.35]}
						castShadow
					>
						<sphereGeometry args={[0.08, 16, 16]} />
						<meshPhysicalMaterial color="#ffd8c2" roughness={0.35} />
					</mesh>

					<mesh
						position={[0.33, -0.05, 0.1]}
						scale={[0.45, 0.68, 0.35]}
						castShadow
					>
						<sphereGeometry args={[0.08, 16, 16]} />
						<meshPhysicalMaterial color="#ffd8c2" roughness={0.35} />
					</mesh>

					{/* 옆머리 */}
					<mesh
						position={[-0.29, -0.16, 0]}
						scale={[0.33, 1.25, 0.62]}
						castShadow
					>
						<sphereGeometry args={[0.22, 24, 24]} />
						<meshStandardMaterial color="#4b2e2b" />
					</mesh>

					<mesh
						position={[0.29, -0.16, 0]}
						scale={[0.33, 1.25, 0.62]}
						castShadow
					>
						<sphereGeometry args={[0.22, 24, 24]} />
						<meshStandardMaterial color="#4b2e2b" />
					</mesh>

					{/* 뒷머리 아래 */}
					<mesh
						position={[0, -0.31, -0.1]}
						scale={[0.92, 0.68, 0.76]}
						castShadow
					>
						<sphereGeometry args={[0.28, 24, 24]} />
						<meshStandardMaterial color="#4b2e2b" />
					</mesh>

					{/* 앞머리 */}
					<mesh position={[0, 0.1, 0.22]} scale={[1.05, 0.68, 0.5]} castShadow>
						<sphereGeometry args={[0.33, 32, 32]} />
						<meshStandardMaterial color="#4b2e2b" />
					</mesh>

					{/* 앞머리 갈래 */}
					<mesh
						position={[-0.14, -0.03, 0.41]}
						rotation={[0, 0, 0.3]}
						scale={[0.48, 0.16, 0.08]}
						castShadow
					>
						<sphereGeometry args={[0.18, 18, 18]} />
						<meshStandardMaterial color="#4b2e2b" />
					</mesh>

					<mesh
						position={[0.12, -0.02, 0.42]}
						rotation={[0, 0, -0.25]}
						scale={[0.45, 0.15, 0.08]}
						castShadow
					>
						<sphereGeometry args={[0.18, 18, 18]} />
						<meshStandardMaterial color="#4b2e2b" />
					</mesh>

					{/* 눈 - 동물의 숲처럼 점눈 */}
					<mesh position={[-0.12, -0.09, 0.44]}>
						<sphereGeometry args={[0.028, 16, 16]} />
						<meshStandardMaterial color="#222" />
					</mesh>

					<mesh position={[0.12, -0.09, 0.44]}>
						<sphereGeometry args={[0.028, 16, 16]} />
						<meshStandardMaterial color="#222" />
					</mesh>

					{/* 코 */}
					<mesh position={[0, -0.14, 0.46]} scale={[0.8, 0.9, 0.65]}>
						<sphereGeometry args={[0.019, 12, 12]} />
						<meshStandardMaterial color="#f2b9a5" />
					</mesh>

					{/* 볼 */}
					<mesh position={[-0.18, -0.17, 0.42]} scale={[1, 0.55, 0.35]}>
						<sphereGeometry args={[0.04, 12, 12]} />
						<meshBasicMaterial color="#ff9fb8" transparent opacity={0.55} />
					</mesh>

					<mesh position={[0.18, -0.17, 0.42]} scale={[1, 0.55, 0.35]}>
						<sphereGeometry args={[0.04, 12, 12]} />
						<meshBasicMaterial color="#ff9fb8" transparent opacity={0.55} />
					</mesh>
				</group>

				{/* 왼팔 */}
				<group ref={leftArmRef} position={[-0.31, 0.56, 0]}>
					<mesh
						position={[-0.04, -0.08, 0]}
						rotation={[0, 0, -Math.PI / 5]}
						castShadow
					>
						<capsuleGeometry args={[0.052, 0.11, 6, 8]} />
						<meshStandardMaterial color="#ff6fa9" />
					</mesh>

					<mesh
						position={[-0.1, -0.2, 0]}
						rotation={[0, 0, -Math.PI / 9]}
						castShadow
					>
						<capsuleGeometry args={[0.04, 0.16, 6, 8]} />
						<meshStandardMaterial color="#ffd8c2" />
					</mesh>

					<mesh position={[-0.13, -0.31, 0]} scale={[1.05, 0.9, 1]} castShadow>
						<sphereGeometry args={[0.052, 16, 16]} />
						<meshStandardMaterial color="#ffd8c2" />
					</mesh>
				</group>

				{/* 오른팔 */}
				<group ref={rightArmRef} position={[0.31, 0.56, 0]}>
					<mesh
						position={[0.04, -0.08, 0]}
						rotation={[0, 0, Math.PI / 5]}
						castShadow
					>
						<capsuleGeometry args={[0.052, 0.11, 6, 8]} />
						<meshStandardMaterial color="#ff6fa9" />
					</mesh>

					<mesh
						position={[0.1, -0.2, 0]}
						rotation={[0, 0, Math.PI / 9]}
						castShadow
					>
						<capsuleGeometry args={[0.04, 0.16, 6, 8]} />
						<meshStandardMaterial color="#ffd8c2" />
					</mesh>

					<mesh position={[0.13, -0.31, 0]} scale={[1.05, 0.9, 1]} castShadow>
						<sphereGeometry args={[0.052, 16, 16]} />
						<meshStandardMaterial color="#ffd8c2" />
					</mesh>
				</group>

				{/* 치마 */}
				<group position={[0, 0.17, 0]}>
					<Skirt />
				</group>

				{/* 왼다리 */}
				<group ref={leftLegRef} position={[-0.075, 0.02, 0]}>
					<mesh position={[0, -0.13, 0]} castShadow>
						<capsuleGeometry args={[0.04, 0.14, 6, 8]} />
						<meshStandardMaterial color="#ffd8c2" />
					</mesh>

					<group ref={leftFootRef} position={[0, -0.25, 0.055]}>
						<mesh scale={[1.25, 0.55, 1.75]} castShadow>
							<sphereGeometry args={[0.055, 18, 18]} />
							<meshPhysicalMaterial
								color="#ffffff"
								roughness={0.25}
								clearcoat={0.45}
							/>
						</mesh>

						<mesh
							position={[0, -0.025, 0]}
							scale={[1.15, 0.16, 1.6]}
							castShadow
						>
							<boxGeometry args={[0.1, 0.03, 0.13]} />
							<meshStandardMaterial color="#d1d5db" />
						</mesh>
					</group>
				</group>

				{/* 오른다리 */}
				<group ref={rightLegRef} position={[0.075, 0.02, 0]}>
					<mesh position={[0, -0.13, 0]} castShadow>
						<capsuleGeometry args={[0.04, 0.14, 6, 8]} />
						<meshStandardMaterial color="#ffd8c2" />
					</mesh>

					<group ref={rightFootRef} position={[0, -0.25, 0.055]}>
						<mesh scale={[1.25, 0.55, 1.75]} castShadow>
							<sphereGeometry args={[0.055, 18, 18]} />
							<meshPhysicalMaterial
								color="#ffffff"
								roughness={0.25}
								clearcoat={0.45}
							/>
						</mesh>

						<mesh
							position={[0, -0.025, 0]}
							scale={[1.15, 0.16, 1.6]}
							castShadow
						>
							<boxGeometry args={[0.1, 0.03, 0.13]} />
							<meshStandardMaterial color="#d1d5db" />
						</mesh>
					</group>
				</group>
			</group>
		</group>
	);
}
