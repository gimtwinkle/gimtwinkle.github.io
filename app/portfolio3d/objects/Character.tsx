'use client';

import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import useMobile from '../useMobile';
import { attachMovementKeyboard, readMovement } from '../movement';

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

function Hair() {
    const chestnut = '#674438';
    return <group>
        <mesh position={[0, -0.01, -0.08]} scale={[1.1, 1.06, 0.94]} castShadow>
            <sphereGeometry args={[0.42, 32, 32]} />
            <meshStandardMaterial color={chestnut} roughness={0.78} />
        </mesh>
        {[-1, 1].map((side) => <group key={side}>
            <mesh position={[side * 0.32, -0.13, 0.03]} scale={[0.105, 0.26, 0.19]} rotation={[0, 0, side * -0.07]} castShadow>
                <sphereGeometry args={[1, 24, 24]} />
                <meshStandardMaterial color={chestnut} roughness={0.78} />
            </mesh>
            <mesh position={[side * 0.29, -0.30, 0.02]} scale={[0.14, 0.1, 0.17]} castShadow>
                <sphereGeometry args={[1, 20, 20]} />
                <meshStandardMaterial color={chestnut} roughness={0.78} />
            </mesh>
        </group>)}
        <mesh position={[0, 0.16, 0.13]} scale={[0.4, 0.26, 0.24]} castShadow>
            <sphereGeometry args={[1, 28, 28]} />
            <meshStandardMaterial color={chestnut} roughness={0.78} />
        </mesh>
        <mesh position={[-0.105, 0.19, 0.29]} scale={[0.24, 0.09, 0.11]} rotation={[0, 0, -0.35]} castShadow>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color={chestnut} roughness={0.78} />
        </mesh>
        <mesh position={[0.18, 0.21, 0.25]} scale={[0.145, 0.085, 0.1]} rotation={[0, 0, 0.5]} castShadow>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color={chestnut} roughness={0.78} />
        </mesh>
        {[0.09, 0.13].map((y) => <mesh key={y} position={[0.335, y, 0.21]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.075, 0.012, 0.025]} />
            <meshStandardMaterial color="#e4bf81" roughness={0.55} metalness={0.2} />
        </mesh>)}
    </group>;
}

export default function Character({ onGreet }: { onGreet?: () => void }) {
    const pressedKeys = useRef(new Set<string>());
    useEffect(() => attachMovementKeyboard(pressedKeys.current), []);
    const mobile = useMobile();
	const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [hovered, setHovered] = useState(false);
    const greeting = useRef({ weight: 0, elapsed: 0, reduced: false, remaining: 0 });
	const ref = useRef<THREE.Group>(null);
    const movement = useRef(new THREE.Vector3());
	const bodyRef = useRef<THREE.Group>(null);

	const headRef = useRef<THREE.Group>(null);
	const leftArmRef = useRef<THREE.Group>(null);
	const rightArmRef = useRef<THREE.Group>(null);
	const leftLegRef = useRef<THREE.Group>(null);
	const rightLegRef = useRef<THREE.Group>(null);
	const leftFootRef = useRef<THREE.Group>(null);
	const rightFootRef = useRef<THREE.Group>(null);

	useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updatePreference = () => { greeting.current.reduced = preference.matches; };
        updatePreference();
        preference.addEventListener('change', updatePreference);

		return () => {
            if (greetingTimer.current) clearTimeout(greetingTimer.current);
            preference.removeEventListener('change', updatePreference);
		};
	}, []);

	useFrame((state, frameDelta) => {
        const delta = Math.min(frameDelta, 0.05);
		if (!ref.current) return;

		const move = readMovement(movement.current.set(0, 0, 0), pressedKeys.current);
		const speed = 3.2;

        greeting.current.remaining = Math.max(0, greeting.current.remaining - delta);
		const isMoving = move.lengthSq() > 0.001;
        ref.current.userData.isMoving = isMoving;
        if (isMoving) greeting.current.remaining = 0;
		const time = state.clock.elapsedTime;

		if (isMoving) {
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

        const wave = greeting.current;
        const waving = !isMoving && (hovered || wave.remaining > 0);
        wave.weight = wave.reduced ? Number(waving) : THREE.MathUtils.damp(wave.weight, Number(waving), 8, delta);
        wave.elapsed = waving ? wave.elapsed + delta : 0;
        if (rightArmRef.current) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.25, wave.weight);
            rightArmRef.current.rotation.z = wave.weight * (2.2 + (wave.reduced ? 0 : Math.sin(wave.elapsed * 9) * 0.28));
        }
        if (headRef.current) {
            const walkTilt = isMoving ? Math.sin(time * 8) * 0.025 * 0.85 : 0;
            headRef.current.rotation.z = THREE.MathUtils.lerp(walkTilt, -0.1, wave.weight);
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
		<group ref={ref} name="player" position={[0, 0.18, 0]} scale={mobile ? 1 : 0.72}
            onPointerOver={(event) => { if (!mobile) { event.stopPropagation(); setHovered(true); } }}
            onPointerOut={() => { if (!mobile) setHovered(false); }}
            onClick={(event) => {
                if (event.delta > 5) return;
                event.stopPropagation();
                setHovered(true);
                greeting.current.remaining = 8;
                onGreet?.();
                if (greetingTimer.current) clearTimeout(greetingTimer.current);
                greetingTimer.current = setTimeout(() => setHovered(false), 8000);
            }}>
            {mobile && <mesh position={[0, 0.7, 0]}>
                <sphereGeometry args={[0.8, 12, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>}
            {hovered && <Html center position={[0, 1.9, 0]} zIndexRange={[40, 40]} style={{ pointerEvents: 'none' }}>
                <div className="pointer-events-none whitespace-nowrap rounded-2xl border-2 border-[#735344] bg-[#fffaf0] px-4 py-2 text-sm font-bold text-[#735344] shadow-[3px_3px_0_#735344]">안녕! 👋</div>
            </Html>}
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
                    <Hair />

					{/* 얼굴 */}
					<mesh
						position={[0, -0.04, 0.14]}
						scale={[0.94, 0.95, 0.82]}
						castShadow
					>
						<sphereGeometry args={[0.36, 36, 36]} />
						<meshStandardMaterial
							color="#ffd8c2"
							roughness={0.78}
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

					{/* 눈 - 동물의 숲처럼 점눈 */}
					<mesh position={[-0.115, -0.085, 0.423]} scale={[0.92, 1.12, 0.45]}>
						<sphereGeometry args={[0.026, 20, 20]} />
						<meshStandardMaterial color="#382723" roughness={0.45} />
					</mesh>

					<mesh position={[0.115, -0.085, 0.423]} scale={[0.92, 1.12, 0.45]}>
						<sphereGeometry args={[0.026, 20, 20]} />
						<meshStandardMaterial color="#382723" roughness={0.45} />
					</mesh>

                    {[-0.115, 0.115].map((x) => <mesh key={x} position={[x - 0.006, -0.077, 0.435]}>
                        <sphereGeometry args={[0.006, 10, 10]} />
                        <meshBasicMaterial color="#fffaf0" />
                    </mesh>)}

					{/* 코 */}
					<mesh position={[0, -0.14, 0.432]} scale={[0.85, 0.75, 0.55]}>
						<sphereGeometry args={[0.016, 12, 12]} />
						<meshStandardMaterial color="#f2b9a5" />
					</mesh>

					{/* 볼 */}
					<mesh position={[-0.18, -0.16, 0.384]} scale={[1.15, 0.6, 0.35]}>
						<sphereGeometry args={[0.04, 12, 12]} />
						<meshBasicMaterial color="#ff9fb8" transparent opacity={0.55} />
					</mesh>

					<mesh position={[0.18, -0.16, 0.384]} scale={[1.15, 0.6, 0.35]}>
						<sphereGeometry args={[0.04, 12, 12]} />
						<meshBasicMaterial color="#ff9fb8" transparent opacity={0.55} />
					</mesh>

                    <mesh position={[0, -0.185, 0.418]} rotation={[0, 0, Math.PI]}>
                        <torusGeometry args={[0.039, 0.0055, 8, 24, Math.PI]} />
                        <meshStandardMaterial color="#ad6267" roughness={0.8} />
                    </mesh>
				</group>

				{/* 왼팔 */}
				<group ref={leftArmRef} position={[-0.24, 0.61, 0]}>
                    <mesh castShadow><sphereGeometry args={[0.065, 16, 16]} /><meshStandardMaterial color="#ff6fa9" /></mesh>
					<mesh
						position={[-0.025, -0.065, 0]}
						rotation={[0, 0, -Math.PI / 12]}
						castShadow
					>
						<capsuleGeometry args={[0.055, 0.12, 6, 12]} />
						<meshStandardMaterial color="#ff6fa9" />
					</mesh>

					<mesh
						position={[-0.055, -0.18, 0]}
						rotation={[0, 0, -Math.PI / 12]}
						castShadow
					>
						<capsuleGeometry args={[0.04, 0.16, 6, 8]} />
						<meshStandardMaterial color="#ffd8c2" />
					</mesh>

					<mesh position={[-0.075, -0.30, 0]} scale={[1.05, 0.9, 1]} castShadow>
						<sphereGeometry args={[0.052, 16, 16]} />
						<meshStandardMaterial color="#ffd8c2" />
					</mesh>
				</group>

				{/* 오른팔 */}
				<group ref={rightArmRef} position={[0.24, 0.61, 0]}>
                    <mesh castShadow><sphereGeometry args={[0.065, 16, 16]} /><meshStandardMaterial color="#ff6fa9" /></mesh>
					<mesh
						position={[0.025, -0.065, 0]}
						rotation={[0, 0, Math.PI / 12]}
						castShadow
					>
						<capsuleGeometry args={[0.055, 0.12, 6, 12]} />
						<meshStandardMaterial color="#ff6fa9" />
					</mesh>

					<mesh
						position={[0.055, -0.18, 0]}
						rotation={[0, 0, Math.PI / 12]}
						castShadow
					>
						<capsuleGeometry args={[0.04, 0.16, 6, 8]} />
						<meshStandardMaterial color="#ffd8c2" />
					</mesh>

					<mesh position={[0.075, -0.30, 0]} scale={[1.05, 0.9, 1]} castShadow>
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
