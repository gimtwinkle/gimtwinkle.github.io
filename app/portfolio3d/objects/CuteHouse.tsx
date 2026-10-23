'use client';

import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { toCreasedNormals } from 'three-stdlib';

import RoundedBox from '../components/RoundedBox';
import { RoomName } from '../types';
import CuteKeyboard from './CuteKeyboard';

type Props = {
	isNight?: boolean;
	label: string;
	targetId: RoomName;
	position: [number, number, number];
	rotation?: [number, number, number];
	color: string;
	roofColor: string;
	onEnterRoom?: (room: RoomName) => void;
};

const windowPalettes: Record<RoomName, { wall: string; curtain: string; seat: string; picture: string }> = {
    about: { wall: '#ead8c3', curtain: '#e1c7c6', seat: '#9cbaa5', picture: '#c6d8b4' },
    work: { wall: '#e1dfd3', curtain: '#c7d6df', seat: '#a8b6cc', picture: '#e4c7a0' },
    skills: { wall: '#e8decc', curtain: '#e4d4b2', seat: '#bba0c6', picture: '#c9c0dd' },
    contact: { wall: '#ebd7d0', curtain: '#d6c3dc', seat: '#c6a394', picture: '#dfb9bd' },
};

function HouseWindow({ isNight, variant, room }: { isNight: boolean; variant: number; room: RoomName }) {
    const palette = windowPalettes[room];
    const wall = isNight ? '#ffd597' : palette.wall;
    const mirror = variant === 0 ? 1 : -1;
    const lampHeight = room === 'work' || room === 'contact' ? 0.025 : 0;
    return <group>
        {/* A shallow room behind the glass gives the window visible depth. */}
        <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.46, 0.33, 0.02]} />
            <meshStandardMaterial color={wall} emissive="#ffc16b" emissiveIntensity={isNight ? 0.65 : 0} roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.135, 0.065]}>
            <boxGeometry args={[0.44, 0.05, 0.09]} />
            <meshStandardMaterial color="#b58c68" emissive="#d49b58" emissiveIntensity={isNight ? 0.2 : 0} />
        </mesh>
        <RoundedBox position={[-0.085 * mirror, -0.07, 0.075]} args={[variant ? 0.16 : 0.19, variant ? 0.08 : 0.065, 0.07]} radius={0.018}>
            <meshStandardMaterial color={palette.seat} emissive="#c89768" emissiveIntensity={isNight ? 0.25 : 0} />
        </RoundedBox>
        <mesh position={[0.12 * mirror, -0.06 + lampHeight, 0.065]}>
            <cylinderGeometry args={[0.008, 0.012, 0.1, 8]} />
            <meshStandardMaterial color="#9a7655" />
        </mesh>
        <mesh position={[0.12 * mirror, 0.01 + lampHeight, 0.065]}>
            <coneGeometry args={[0.05, 0.06, 12]} />
            <meshStandardMaterial color="#fff0c9" emissive="#ffcb75" emissiveIntensity={isNight ? 2 : 0} toneMapped={!isNight} />
        </mesh>
        <RoundedBox position={[-0.075 * mirror, 0.075, 0.045]} args={[variant ? 0.065 : 0.09, 0.065, 0.018]} radius={0.008}>
            <meshStandardMaterial color="#fff4d9" />
        </RoundedBox>
        <mesh position={[-0.075 * mirror, 0.075, 0.056]}>
            <planeGeometry args={[variant ? 0.045 : 0.07, 0.045]} />
            <meshStandardMaterial color={palette.picture} emissive={palette.picture} emissiveIntensity={isNight ? 0.18 : 0} />
        </mesh>
        {variant === 0 ? <group position={[-0.085 * mirror, -0.02, 0.08]}>
            <mesh><cylinderGeometry args={[0.016, 0.012, 0.025, 8]} /><meshStandardMaterial color="#d6b795" /></mesh>
            <mesh position={[0, 0.023, 0]} scale={[0.8, 1.2, 0.8]}>
                <sphereGeometry args={[0.022, 10, 8]} /><meshStandardMaterial color="#91aa84" />
            </mesh>
        </group> : <group position={[-0.085 * mirror, -0.015, 0.08]}>
            {[palette.picture, '#fff0d5'].map((bookColor, index) => <mesh key={bookColor} position={[0, index * 0.012, 0]} rotation={[0, 0, index * 0.08]}>
                <boxGeometry args={[0.06 - index * 0.008, 0.012, 0.035]} /><meshStandardMaterial color={bookColor} />
            </mesh>)}
        </group>}
        {[-1, 1].map((side) => <group key={side}>
            <RoundedBox position={[side * 0.256, 0, 0.085]} args={[0.055, 0.42, 0.13]} radius={0.025} creaseAngle={0.8}>
                <meshStandardMaterial color="#fff4d9" roughness={0.55} />
            </RoundedBox>
            <RoundedBox position={[0, side * 0.185, 0.085]} args={[0.56, 0.055, 0.13]} radius={0.025} creaseAngle={0.8}>
                <meshStandardMaterial color="#fff4d9" roughness={0.55} />
            </RoundedBox>
            <mesh position={[side * (variant ? 0.185 : 0.195), 0.015, 0.09]} scale={[variant ? 1.2 : 0.9, 1, 0.4]}>
                <boxGeometry args={[0.045, 0.29, 0.06]} />
                <meshStandardMaterial color={palette.curtain} emissive="#e9b58c" emissiveIntensity={isNight ? 0.2 : 0} />
            </mesh>
        </group>)}
        <mesh position={[0, 0, 0.13]}>
            <planeGeometry args={[0.46, 0.33]} />
            <meshPhysicalMaterial color={isNight ? '#ffe3ab' : '#c6edfa'} transparent opacity={isNight ? 0.13 : 0.2} roughness={0.12} clearcoat={1} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
            <boxGeometry args={[0.014, 0.34, 0.012]} /><meshStandardMaterial color="#fff4d9" />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
            <boxGeometry args={[0.46, 0.014, 0.012]} /><meshStandardMaterial color="#fff4d9" />
        </mesh>
    </group>;
}

function BalloonMaterial({ color }: { color: string }) {
	return (
		<meshPhysicalMaterial
			color={color}
			roughness={0.52}
			metalness={0}
			clearcoat={0.3}
			clearcoatRoughness={0.5}
			sheen={1}
			sheenRoughness={0.5}
		/>
	);
}

function Roof({ color }: { color: string }) {
	const geometry = useMemo(() => {
		const shape = new THREE.Shape();

		shape.moveTo(-1.46, 0.02);
        shape.quadraticCurveTo(-1.58, 0.07, -1.4, 0.18);
        shape.bezierCurveTo(-0.95, 0.4, -0.35, 0.76, -0.12, 0.79);
        shape.quadraticCurveTo(0, 0.83, 0.12, 0.79);
        shape.bezierCurveTo(0.35, 0.76, 0.95, 0.4, 1.4, 0.18);
        shape.quadraticCurveTo(1.58, 0.07, 1.46, 0.02);
		shape.quadraticCurveTo(0, -0.08, -1.46, 0.02);
		shape.closePath();

		const geo = new THREE.ExtrudeGeometry(shape, {
			depth: 2.5,
			bevelEnabled: true,
			bevelSegments: 8,
			steps: 1,
			bevelSize: 0.14,
			bevelThickness: 0.14,
            curveSegments: 16,
		});

		geo.center();
        toCreasedNormals(geo, Math.PI / 3);

		return geo;
	}, []);

	return (
		<group position={[0, 1.85, 0]}>
			<mesh geometry={geometry} rotation={[0, Math.PI / 2, 0]} castShadow>
				<BalloonMaterial color={color} />
			</mesh>
		</group>
	);
}

function PostcardIcon() {
    const card = useRef<THREE.Group>(null);
    const motion = useRef({ reduced: false, elapsed: 0 });
    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => { motion.current.reduced = preference.matches; };
        update();
        preference.addEventListener('change', update);
        return () => preference.removeEventListener('change', update);
    }, []);
    useFrame((_, frameDelta) => {
        if (!card.current) return;
        const state = motion.current;
        if (state.reduced) { card.current.rotation.set(0, 0, 0); return; }
        state.elapsed += Math.min(frameDelta, 0.05);
        const t = state.elapsed;
        const breeze = 0.45 + 0.55 * Math.sin(t * 0.42) ** 2;
        card.current.rotation.set(
            Math.sin(t * 1.1) * 0.026 * breeze,
            Math.sin(t * 0.85 + 0.4) * 0.065 * breeze,
            Math.sin(t * 1.35) * 0.05 * breeze,
        );
    });
    const paper = useMemo(() => {
        const geometry = new THREE.BoxGeometry(1.05, 0.7, 0.003, 48, 24, 1);
        const positions = geometry.attributes.position;
        for (let index = 0; index < positions.count; index++) {
            const x = positions.getX(index);
            const y = positions.getY(index);
            const curl = Math.max(0, (x - 0.2) / 0.325) * Math.max(0, (y + 0.05) / 0.4);
            positions.setXYZ(index, x - curl ** 2 * 0.025, y, positions.getZ(index) + curl ** 2 * 0.11);
        }
        geometry.computeVertexNormals();
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 684;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Unable to draw postcard');
        context.fillStyle = '#fff9ec';
        context.fillRect(0, 0, 1024, 684);
        context.fillStyle = '#c5ddeb';
        context.fillRect(54, 104, 420, 460);
        context.fillStyle = '#f4c96b';
        context.beginPath(); context.arc(180, 215, 55, 0, Math.PI * 2); context.fill();
        context.fillStyle = '#a2b9a2';
        context.beginPath(); context.arc(240, 510, 155, Math.PI, 0); context.fill();
        context.fillStyle = '#7f9f8e';
        context.beginPath(); context.arc(365, 510, 100, Math.PI, 0); context.fill();
        context.fillStyle = '#e7d0a5'; context.fillRect(65, 510, 398, 44);
        context.fillStyle = '#d3bcaa'; context.fillRect(525, 115, 5, 450);
        context.save(); context.translate(845, 155); context.rotate(0.06);
        context.fillStyle = '#b6a2d4'; context.fillRect(-80, -88, 160, 176);
        context.fillStyle = '#fff3d5'; context.beginPath(); context.arc(0, 0, 45, 0, Math.PI * 2); context.fill();
        context.restore();
        context.fillStyle = '#b39e8d';
        [0, 1, 2].forEach(line => context.fillRect(590, 365 + line * 74, line === 2 ? 225 : 300, 6));
        context.strokeStyle = '#9e958c'; context.lineWidth = 4;
        context.beginPath(); context.arc(735, 185, 66, 0, Math.PI * 2); context.stroke();
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        return { geometry, texture };
    }, []);
    useEffect(() => () => { paper.geometry.dispose(); paper.texture.dispose(); }, [paper]);
    return <group position={[0, 2.65, 0.9]} rotation={[0, -0.12, -0.05]}>
        <group ref={card} name="contact-postcard">
            <mesh geometry={paper.geometry} castShadow receiveShadow>
                {[0, 1, 2, 3, 5].map(side => <meshStandardMaterial key={side} attach={`material-${side}`} color="#fff9ec" roughness={0.95} />)}
                <meshStandardMaterial attach="material-4" map={paper.texture} roughness={0.95} />
            </mesh>
        </group>
    </group>;
}

function BookIcon() {
    const bookRefs = useRef<(THREE.Group | null)[]>([]);
    const motion = useRef({ elapsed: 0, reduced: true });
    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => { motion.current.reduced = preference.matches; };
        update();
        preference.addEventListener('change', update);
        return () => preference.removeEventListener('change', update);
    }, []);
    useFrame((_, frameDelta) => {
        const state = motion.current;
        state.elapsed += Math.min(frameDelta, 0.05);
        let carriedLift = 0;
        bookRefs.current.forEach((book, index) => {
            if (!book) return;
            const phase = state.elapsed % 5.2 - 1 - index * 0.1;
            const pulse = !state.reduced && phase > 0 && phase < 0.75 ? Math.sin(phase / 0.75 * Math.PI) ** 2 : 0;
            // Each book carries the ones above it; the small extra hop travels upward.
            carriedLift += pulse * (index === 0 ? 0.029 : 0.017);
            book.position.y = 0.2 + index * 0.2 + carriedLift;
            book.rotation.z = pulse * 0.017;
        });
    });
	const books = [
		{ y: 0.2, color: '#8b5cf6', rot: 0.08, w: 1.08, d: 0.62 },
		{ y: 0.4, color: '#38bdf8', rot: -0.12, w: 0.96, d: 0.56 },
		{ y: 0.6, color: '#fb7185', rot: 0.16, w: 0.84, d: 0.52 },
	];

	return (
		<group position={[0, 2.25, 0.35]} rotation={[0, 0.15, -0.05]}>
			{books.map((book, i) => (
				<group key={i} ref={(node) => { bookRefs.current[i] = node; }} position={[0, book.y, 0]} rotation={[0, book.rot, 0]}>
					<RoundedBox
						position={[0, -0.075, 0]}
						args={[book.w, 0.02, book.d]}
						radius={0.025}
						smoothness={8}
						castShadow
					>
						<meshPhysicalMaterial
							color={book.color}
							roughness={0.18}
							clearcoat={0.72}
						/>
					</RoundedBox>

					<RoundedBox
						position={[0.04, 0, 0]}
						args={[book.w - 0.08, 0.14, book.d - 0.05]}
						radius={0.02}
						smoothness={6}
						castShadow
					>
						<meshPhysicalMaterial
							color="#ffffff"
							roughness={0.58}
							clearcoat={0.04}
						/>
					</RoundedBox>

					<RoundedBox
						position={[0, 0.075, 0]}
						args={[book.w, 0.02, book.d]}
						radius={0.025}
						smoothness={8}
						castShadow
					>
						<meshPhysicalMaterial
							color={book.color}
							roughness={0.16}
							clearcoat={0.75}
						/>
					</RoundedBox>
				</group>
			))}
		</group>
	);
}

export default function CuteHouse({
	label,
	targetId,
	position,
	rotation = [0, 0, 0],
	color,
	roofColor,
	onEnterRoom,
	isNight = false,
}: Props) {
	const { scene } = useThree();
	const doorFrameGeometry = useMemo(() => {
		const shape = new THREE.Shape();
		shape.moveTo(-0.42, -0.53);
		shape.lineTo(0.42, -0.53);
		shape.lineTo(0.42, 0.1);
		shape.quadraticCurveTo(0.42, 0.53, 0, 0.53);
		shape.quadraticCurveTo(-0.42, 0.53, -0.42, 0.1);
		shape.closePath();
		return new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: false, curveSegments: 16 });
	}, []);
	const doorGeometry = useMemo(() => {
		const shape = new THREE.Shape();
		shape.moveTo(0, -0.47);
		shape.lineTo(0.7, -0.47);
		shape.lineTo(0.7, 0.12);
		shape.quadraticCurveTo(0.7, 0.47, 0.35, 0.47);
		shape.quadraticCurveTo(0, 0.47, 0, 0.12);
		shape.closePath();
		return new THREE.ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: false, curveSegments: 16 });
	}, []);
	useEffect(() => () => {
		doorFrameGeometry.dispose();
		doorGeometry.dispose();
	}, [doorFrameGeometry, doorGeometry]);

	const doorRef = useRef<THREE.Group>(null);
	const enterRequestedRef = useRef(false);
    const playerRef = useRef<THREE.Object3D | undefined>(undefined);
    const nearRef = useRef(false);
    const [near, setNear] = useState(false);

	const [hovered, setHovered] = useState(false);
	const [clickedOpen, setClickedOpen] = useState(false);

	const isContact = label.toLowerCase() === 'contact';
	const isSkills = label.toLowerCase() === 'skills';
	const isWork = label.toLowerCase() === 'work';


	useFrame(() => {
        const player = playerRef.current?.parent ? playerRef.current : scene.getObjectByName('player');
        playerRef.current = player;
		if (!player) return;

		const distance = Math.hypot(player.position.x - position[0], player.position.y - position[1], player.position.z - position[2]);
		const isNearNow = distance < 2.2;
        if (nearRef.current !== isNearNow) {
            nearRef.current = isNearNow;
            setNear(isNearNow);
        }


		if (!doorRef.current) return;

		const shouldOpen = isNearNow || hovered || clickedOpen;
		const target = shouldOpen ? -Math.PI / 1.7 : 0;

		doorRef.current.rotation.y = THREE.MathUtils.lerp(
			doorRef.current.rotation.y,
			target,
			0.16
		);

		if (
			isNearNow && !player.userData.enteringRoom &&
			!enterRequestedRef.current &&
			Math.abs(doorRef.current.rotation.y - target) < 0.08
		) {
			enterRequestedRef.current = true;

			onEnterRoom?.(targetId);
		}

		if (!isNearNow && !clickedOpen) {
			enterRequestedRef.current = false;
		}
	});

	return (
		<group
			position={position}
			name={`house-${targetId}`}
			rotation={rotation}
			onClick={(e) => {
				e.stopPropagation();
				setClickedOpen(true);
				onEnterRoom?.(targetId);
			}}
			onPointerOver={(e) => {
				e.stopPropagation();
				setHovered(true);
				document.body.style.cursor = 'pointer';
			}}
			onPointerOut={(e) => {
				e.stopPropagation();
				setHovered(false);
				document.body.style.cursor = 'default';
			}}
			scale={1.18}
		>
			<RoundedBox
				position={[0, 0.82, 0]}
				args={[2.62, 1.72, 2.12]}
				radius={0.36}
                creaseAngle={0.8}
				smoothness={10}
				castShadow
			>
				<BalloonMaterial color={color} />
			</RoundedBox>

			<Roof color={roofColor} />
            {isNight && <pointLight position={[0, 0.95, 1.65]} color="#ffce88" intensity={0.65} distance={3} decay={2} />}

			<mesh geometry={doorFrameGeometry} position={[0, 0, 1.07]} castShadow>
				<meshPhysicalMaterial color="#fff4d9" roughness={0.65} clearcoat={0.12} />
			</mesh>

			<group ref={doorRef} position={[-0.35, 0.52, 1.105]}>
				<mesh geometry={doorGeometry} castShadow>
					<meshPhysicalMaterial
						color={roofColor}
						roughness={0.55}
						clearcoat={0.18}
					/>
				</mesh>

				<mesh position={[0.55, -0.03, 0.04]} castShadow>
					<sphereGeometry args={[0.035, 20, 20]} />
					<meshPhysicalMaterial
						color="#facc15"
						roughness={0.08}
						clearcoat={1}
					/>
				</mesh>
			</group>

			{[
				[-0.78, 0.95, 1.12],
				[0.78, 0.95, 1.12],
			].map(([x, y, z], i) => (
				<group key={i} position={[x, y, z]}>
                    <HouseWindow isNight={isNight} variant={i} room={targetId} />
                </group>
			))}

			{[0, 1, 2].map((i) => (
				<mesh
					key={i}
					position={[0, 0.08, 1.58 + i * 0.34]}
					rotation={[-Math.PI / 2, 0, 0]}
					scale={[1 - i * 0.16, 0.55 - i * 0.06, 1]}
					receiveShadow
				>
					<circleGeometry args={[0.5, 48]} />
					<meshPhysicalMaterial
						color="#ffd1b8"
						roughness={0.08}
						clearcoat={1}
					/>
				</mesh>
			))}

			<RoundedBox
				position={[0, 2, 1.24]}
				args={[1.05, 0.34, 0.1]}
				radius={0.12}
				smoothness={10}
				castShadow
			>
				<meshPhysicalMaterial
					color={roofColor}
					roughness={0.16}
					clearcoat={0.75}
				/>
			</RoundedBox>

			<Text
				position={[0, 2, 1.31]}
				fontSize={0.16}
				color="#ffffff"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				{(near || hovered || clickedOpen) ? `${label.toUpperCase()}!` : label.toUpperCase()}
			</Text>

			{isWork && (
				<group position={[0, 2.65, 1.2]} rotation={[2, 0, 0.2]}>
					<CuteKeyboard
						position={[0, 0, 0]}
						rotation={[-0.2, 0, 0]}
						scale={0.78}
					/>
				</group>
			)}

			{isSkills && <BookIcon />}
			{isContact && <PostcardIcon />}
		</group>
	);
}
