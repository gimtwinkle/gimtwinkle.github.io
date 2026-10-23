'use client';

import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import useMobile from '../useMobile';
import { attachMovementKeyboard, readMovement } from '../movement';

function WalkingDust({ player }: { player: { current: THREE.Group | null } }) {
    const particles = useRef<(THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null)[]>([]);
    const dust = useRef({ ages: Array<number>(6).fill(1), elapsed: 0, next: 0, reduced: false });
    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => { dust.current.reduced = preference.matches; };
        update();
        preference.addEventListener('change', update);
        return () => preference.removeEventListener('change', update);
    }, []);
    useFrame((_, frameDelta) => {
        const character = player.current;
        if (!character) return;
        const state = dust.current;
        const delta = Math.min(frameDelta, 0.05);
        state.elapsed += delta;
        if (character.userData.isMoving && !state.reduced && state.elapsed >= 0.24) {
            const index = state.next;
            const puff = particles.current[index];
            if (puff) {
                const side = index % 2 ? 1 : -1;
                const angle = character.rotation.y;
                puff.position.copy(character.position);
                puff.position.x += Math.cos(angle) * side * 0.09 - Math.sin(angle) * 0.12;
                puff.position.z -= Math.sin(angle) * side * 0.09 + Math.cos(angle) * 0.12;
                puff.position.y -= character.scale.y * 0.22;
                state.ages[index] = 0;
            }
            state.next = (index + 1) % 6;
            state.elapsed = 0;
        }
        particles.current.forEach((puff, index) => {
            if (!puff) return;
            state.ages[index] += delta;
            const life = state.ages[index] / 0.55;
            puff.visible = life < 1 && !state.reduced;
            if (!puff.visible) return;
            puff.position.y += delta * 0.08;
            puff.scale.setScalar(0.55 + life * 0.9);
            puff.material.opacity = Math.sin(life * Math.PI) * 0.4;
        });
    });
    return <group name="walking-dust">
        {Array.from({ length: 6 }, (_, index) => <mesh
            key={index} ref={(mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null) => { particles.current[index] = mesh; }}
            visible={false} raycast={() => {}}
        >
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshBasicMaterial color="#c5a078" transparent opacity={0} depthWrite={false} />
        </mesh>)}
    </group>;
}

function DressMaterial({ repeatX = 8, repeatY = 5, doubleSided = false }: { repeatX?: number; repeatY?: number; doubleSided?: boolean }) {
    const texture = useMemo(() => {
        const size = 64;
        const pixels = new Uint8Array(size * size * 4);
        const colors = [[255, 245, 229], [230, 170, 177], [182, 104, 121]];
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const stripeX = x >= size / 2 ? 1 : 0;
                const stripeY = y >= size / 2 ? 1 : 0;
                const color = colors[stripeX + stripeY];
                const offset = (y * size + x) * 4;
                pixels.set([...color, 255], offset);
            }
        }
        const map = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
        map.colorSpace = THREE.SRGBColorSpace;
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(repeatX, repeatY);
        map.magFilter = THREE.LinearFilter;
        map.minFilter = THREE.LinearMipmapLinearFilter;
        map.generateMipmaps = true;
        map.needsUpdate = true;
        return map;
    }, [repeatX, repeatY]);
    useEffect(() => () => texture.dispose(), [texture]);
    return <meshStandardMaterial map={texture} roughness={0.92} side={doubleSided ? THREE.DoubleSide : THREE.FrontSide} />;
}

function InnerTShirt() {
    const geometry = useMemo(() => {
        const profile = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.17, 0.3, 0),
            new THREE.Vector3(0.19, 0.42, 0),
            new THREE.Vector3(0.205, 0.55, 0),
            new THREE.Vector3(0.225, 0.615, 0),
            new THREE.Vector3(0.19, 0.65, 0),
            new THREE.Vector3(0.075, 0.69, 0),
        ]);
        return new THREE.LatheGeometry(profile.getPoints(40).map((p) => new THREE.Vector2(p.x, p.y)), 64);
    }, []);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return <mesh name="inner-tshirt" geometry={geometry} scale={[1, 1, 0.75]} castShadow>
        <meshStandardMaterial color="#fffdf8" roughness={0.95} side={THREE.DoubleSide} />
    </mesh>;
}

function Skirt() {
	const geometry = useMemo(() => {
		const points = [
			new THREE.Vector2(0.25, 0.23),
			new THREE.Vector2(0.26, 0.08),
			new THREE.Vector2(0.28, -0.1),
			new THREE.Vector2(0.34, -0.22),
		];

		return new THREE.LatheGeometry(points, 64);
	}, []);

	return (
		<group scale={[1, 1, 0.77]}>
			<mesh geometry={geometry} castShadow>
                <DressMaterial repeatX={10} repeatY={3} doubleSided />
			</mesh>

			<mesh position={[0, -0.22, 0]} scale={[1, 0.1, 1]} castShadow>
				<torusGeometry args={[0.34, 0.012, 12, 40]} />
				<meshStandardMaterial color="#fff5e5" roughness={0.9} />
			</mesh>
		</group>
	);
}

function Bustier() {
    const straps = useMemo(() => [-0.145, 0.145].map((x) => new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, 0.55, 0.17),
        new THREE.Vector3(x, 0.64, 0.145),
        new THREE.Vector3(x, 0.675, 0),
        new THREE.Vector3(x, 0.64, -0.145),
        new THREE.Vector3(x, 0.55, -0.17),
    ])), []);
    return <group name="check-bustier">
        <mesh position={[0, 0.49, 0]} scale={[1, 1, 0.77]} castShadow>
            <cylinderGeometry args={[0.255, 0.25, 0.2, 64, 1, true]} />
            <DressMaterial repeatX={8} repeatY={2} doubleSided />
        </mesh>
        {straps.map((curve, index) => <mesh key={index} castShadow>
            <tubeGeometry args={[curve, 32, 0.016, 12, false]} />
            <DressMaterial repeatX={2} repeatY={3} />
        </mesh>)}
        <mesh position={[0, 0.4, 0]} scale={[1, 1, 0.77]}>
            <cylinderGeometry args={[0.254, 0.254, 0.018, 32, 1, true]} />
            <meshStandardMaterial color="#b66879" roughness={0.92} side={THREE.DoubleSide} />
        </mesh>
    </group>;
}

function Hair() {
    const chestnut = '#674438';
    return <group>
        <mesh position={[0, -0.01, -0.08]} scale={[1.1, 1.06, 0.94]} castShadow>
            <sphereGeometry args={[0.42, 32, 32]} />
            <meshStandardMaterial color={chestnut} roughness={0.78} />
        </mesh>
        <mesh position={[0, -0.35, -0.19]} scale={[0.36, 0.55, 0.22]} castShadow>
            <sphereGeometry args={[1, 28, 28]} />
            <meshStandardMaterial color={chestnut} roughness={0.78} />
        </mesh>
        {[-1, 1].map((side) => <group key={side}>
            <mesh position={[side * 0.27, -0.36, -0.12]} scale={[0.16, 0.47, 0.2]} rotation={[0, 0, side * -0.09]} castShadow>
                <sphereGeometry args={[1, 24, 24]} />
                <meshStandardMaterial color={chestnut} roughness={0.78} />
            </mesh>
            <mesh position={[side * 0.34, -0.26, 0.015]} scale={[0.105, 0.37, 0.16]} rotation={[0, 0, side * -0.13]} castShadow>
                <sphereGeometry args={[1, 24, 24]} />
                <meshStandardMaterial color={chestnut} roughness={0.78} />
            </mesh>
            <mesh position={[side * 0.315, -0.13, 0.16]} scale={[0.075, 0.27, 0.115]} rotation={[0, 0, side * -0.18]} castShadow>
                <sphereGeometry args={[1, 20, 20]} />
                <meshStandardMaterial color={chestnut} roughness={0.78} />
            </mesh>
        </group>)}
        <mesh position={[0, 0.16, 0.13]} scale={[0.4, 0.26, 0.24]} castShadow>
            <sphereGeometry args={[1, 28, 28]} />
            <meshStandardMaterial color={chestnut} roughness={0.78} />
        </mesh>
        {[-2, -1, 0, 1, 2].map((strand) => <mesh
            key={strand}
            position={[strand * 0.105, 0.15 + Math.abs(strand) * 0.012, 0.365 - Math.abs(strand) * 0.019]}
            scale={[0.075, 0.135, 0.075]}
            rotation={[0, 0, strand * 0.09]}
            castShadow
        >
            <sphereGeometry args={[1, 20, 20]} />
            <meshStandardMaterial color={chestnut} roughness={0.78} />
        </mesh>)}
        {[0.09, 0.13].map((y) => <mesh key={y} position={[0.335, y, 0.21]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.075, 0.012, 0.025]} />
            <meshStandardMaterial color="#e4bf81" roughness={0.55} metalness={0.2} />
        </mesh>)}
    </group>;
}

export default function Character({ onGreet, message }: { onGreet?: () => void; message?: string }) {
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
        const speed = ref.current.userData.enteringRoom ? (ref.current.userData.entrySpeed ?? 2.7) : 2.7;
        if (ref.current.userData.enteringRoom) {
            const target = ref.current.userData.entryTarget as THREE.Vector3 | undefined;
            move.set(0, 0, 0);
            if (target) {
                move.subVectors(target, ref.current.position).setY(0);
                const distance = move.length();
                if (distance > 0.015) move.normalize().multiplyScalar(Math.min(1, distance / (speed * Math.max(delta, 0.001))));
                else move.set(0, 0, 0);
            }
        }

        greeting.current.remaining = Math.max(0, greeting.current.remaining - delta);
		const isMoving = move.lengthSq() > 0.001;
        ref.current.userData.isMoving = isMoving;
        if (isMoving) greeting.current.remaining = 0;
		const time = state.clock.elapsedTime;

		if (isMoving) {
			ref.current.position.add(move.multiplyScalar(speed * delta));
			ref.current.rotation.y = Math.atan2(move.x, move.z);

			const walk = Math.sin(time * 9.3);
			const opposite = Math.sin(time * 9.3 + Math.PI);
			const bounce = Math.abs(Math.sin(time * 9.3)) * 0.035;

			if (bodyRef.current) {
				bodyRef.current.position.y = bounce;
				bodyRef.current.rotation.z = Math.sin(time * 9.3) * 0.025;
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
		<><group ref={ref} name="player" position={[0, 0.18, 0]} scale={mobile ? 1 : 0.72}
            onPointerOver={(event) => { if (!mobile) { event.stopPropagation(); setHovered(true); } }}
            onPointerOut={() => { if (!mobile) setHovered(false); }}
            onClick={(event) => {
                if (ref.current?.userData.enteringRoom) return;
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
            {(hovered || message) && <Html center position={[0, 1.9, 0]} zIndexRange={[40, 40]} style={{ pointerEvents: 'none' }}>
                <div role="status" className="pointer-events-none relative whitespace-nowrap rounded-2xl border-2 border-[#735344] bg-[#fffaf0] px-4 py-2 text-sm font-bold text-[#735344] shadow-[3px_3px_0_#735344]">
                    {message ?? '안녕! 👋'}
                    <span aria-hidden="true" className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#735344] bg-[#fffaf0]" />
                </div>
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
                <InnerTShirt />
                <Bustier />

				{/* 어깨 */}

				{/* 목 라운드 */}
				<mesh position={[0, 0.69, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]} castShadow>
					<torusGeometry args={[0.075, 0.009, 12, 48]} />
					<meshStandardMaterial color="#fffdf8" roughness={0.95} />
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

                    {[-0.115, 0.115].map((x) => <mesh
                        key={x}
                        position={[x, -0.02, 0.422]}
                        scale={[0.042, 0.005, 0.007]}
                        rotation={[0, 0, x < 0 ? 0.08 : -0.08]}
                    >
                        <sphereGeometry args={[1, 16, 12]} />
                        <meshStandardMaterial color="#674438" roughness={0.85} />
                    </mesh>)}

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
                    <mesh castShadow><sphereGeometry args={[0.065, 16, 16]} /><meshStandardMaterial color="#fffdf8" roughness={0.95} /></mesh>
					<mesh
						position={[-0.025, -0.065, 0]}
						rotation={[0, 0, -Math.PI / 12]}
						castShadow
					>
						<capsuleGeometry args={[0.055, 0.12, 6, 12]} />
						<meshStandardMaterial color="#fffdf8" roughness={0.95} />
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
                    <mesh castShadow><sphereGeometry args={[0.065, 16, 16]} /><meshStandardMaterial color="#fffdf8" roughness={0.95} /></mesh>
					<mesh
						position={[0.025, -0.065, 0]}
						rotation={[0, 0, Math.PI / 12]}
						castShadow
					>
						<capsuleGeometry args={[0.055, 0.12, 6, 12]} />
						<meshStandardMaterial color="#fffdf8" roughness={0.95} />
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
        <WalkingDust player={ref} /></>
	);
}
