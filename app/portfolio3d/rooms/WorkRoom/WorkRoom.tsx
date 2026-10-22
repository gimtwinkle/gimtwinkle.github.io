'use client';

import { projects } from '@/asset/data/projects';
import { projectStats } from './workProjectStats';
import { Text, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ComponentProps } from 'react';
import * as THREE from 'three';

import BaseRoundedBox from '../../components/RoundedBox';

// Keep the many factory decorations inexpensive without changing other rooms.
function RoundedBox({ smoothness = 4, bevelSegments = 4, ...props }: ComponentProps<typeof BaseRoundedBox>) {
    return <BaseRoundedBox {...props} smoothness={Math.min(smoothness, 3)} bevelSegments={Math.min(bevelSegments, 1)} />;
}
const C = {
	bg: '#74bff2',
	wall: '#edf9ff',
	wallDark: '#f7edff',
	floor: '#fff6d8',
	floorLine: '#d8ca8d',
	pink: '#e67fb5',
	pinkDark: '#a97eea',
	yellow: '#f0bd5b',
	blue: '#74bff2',
	mint: '#edf9ff',
	cream: '#fff6d8',
	belt: '#a97eea',
	beltDark: '#6b4328',
	box: '#fff6d8',
	green: '#6ecc52',
	red: '#e67fb5',
	lavender: '#a97eea',
	white: '#fffdf8',
};

export default function WorkFactoryScene({ onSelect }: { onSelect: (index: number) => void }) {
	return (
		<group position={[0, -0.2, 0]}>
			<ambientLight intensity={0.62} />
			<directionalLight position={[4, 7, 5]} intensity={1.15} castShadow />

			<pointLight
				position={[-3.1, 2.45, -1.1]}
				intensity={2.2}
				color="#e67fb5"
			/>
			<pointLight
				position={[3.1, 2.45, -1.1]}
				intensity={2.2}
				color="#e67fb5"
			/>

			<FactoryRoom />
			<BackWallDecor />

			<InMachine />
			<OutMachine />
			<CandyProjectMachine onSelect={onSelect} />

			<ConveyorBelt />

			<MovingBoxes onSelectProject={(project) => onSelect(projects.indexOf(project))} />

		</group>
	);
}
function FactoryRoom() {
	return (
		<group>
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[9, 6]} />
				<meshStandardMaterial color={C.floor} roughness={0.45} />
			</mesh>

			{Array.from({ length: 10 }).map((_, i) => (
				<mesh
					key={`floor-x-${i}`}
					position={[-4.5 + i, 0.004, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
				>
					<planeGeometry args={[0.025, 6]} />
					<meshStandardMaterial color={C.floorLine} />
				</mesh>
			))}

			{Array.from({ length: 7 }).map((_, i) => (
				<mesh
					key={`floor-z-${i}`}
					position={[0, 0.005, -3 + i]}
					rotation={[-Math.PI / 2, 0, Math.PI / 2]}
				>
					<planeGeometry args={[0.025, 9]} />
					<meshStandardMaterial color={C.floorLine} />
				</mesh>
			))}

			{/* back wall */}
			<mesh position={[0, 1.8, -3]} receiveShadow>
				<boxGeometry args={[9, 3.6, 0.18]} />
				<meshStandardMaterial color={C.wall} roughness={0.38} />
			</mesh>

			{/* left wall */}
			<mesh
				position={[-4.5, 1.8, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[6, 3.6, 0.18]} />
				<meshStandardMaterial color={C.wallDark} roughness={0.38} />
			</mesh>

			{/* right soft wall */}
			<mesh
				position={[4.5, 1.8, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[6, 3.6, 0.12]} />
				<meshStandardMaterial color="#f9eef8" roughness={0.4} />
			</mesh>

			{/* ceiling */}
			<mesh position={[0, 3.7, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[9, 6]} />
				<meshStandardMaterial color="#fff6d8" roughness={0.42} />
			</mesh>

			<RoundedBox
				position={[0, 3.63, -2.9]}
				args={[9.2, 0.22, 0.28]}
				radius={0.12}
				smoothness={8}
			>
				<meshStandardMaterial color={C.pink} roughness={0.12} />
			</RoundedBox>

			<RoundedBox
				position={[-4.42, 3.63, 0]}
				rotation={[0, Math.PI / 2, 0]}
				args={[6.2, 0.22, 0.28]}
				radius={0.12}
				smoothness={8}
			>
				<meshStandardMaterial color={C.pink} roughness={0.12} />
			</RoundedBox>

			<RoundedBox
				position={[4.42, 3.63, 0]}
				rotation={[0, Math.PI / 2, 0]}
				args={[6.2, 0.22, 0.28]}
				radius={0.12}
				smoothness={8}
			>
				<meshStandardMaterial color={C.pink} roughness={0.12} />
			</RoundedBox>
		</group>
	);
}

function fitDashboardText(maxWidth: number) {
    return (mesh: THREE.Mesh) => {
        mesh.geometry.computeBoundingBox();
        const box = mesh.geometry.boundingBox;
        const width = box ? box.max.x - box.min.x : 0;
        mesh.scale.setScalar(width > 0 ? Math.min(1, maxWidth / width) : 1);
    };
}

function DashboardLabel({ children, position, size = 0.085, width = 0.88 }: {
    children: React.ReactNode;
    position: [number, number, number];
    size?: number;
    width?: number;
}) {
    return (
        <Text position={position} fontSize={size} color="#3d2b24" anchorX="center" anchorY="middle"
            fontWeight={700} material-toneMapped={false} onSync={fitDashboardText(width)}>
            {children}
        </Text>
    );
}

function BackWallDecor() {
	return (
		<group>
			{/* main pink frame */}
			<RoundedBox
				position={[0, 2.05, -2.84]}
				args={[4.7, 2.2, 0.18]}
				radius={0.22}
				smoothness={14}
				castShadow
			>
				<meshStandardMaterial color={C.pink} roughness={0.12} />
			</RoundedBox>

			{/* gold trim */}
			<RoundedBox
				position={[0, 2.05, -2.71]}
				args={[4.42, 2, 0.08]}
				radius={0.16}
				smoothness={12}
			>
				<meshStandardMaterial
					color={C.yellow}
					roughness={0.18}
					metalness={0.35}
				/>
			</RoundedBox>

			{/* cream village dashboard */}
			<RoundedBox
				position={[0, 2.05, -2.64]}
				args={[4.22, 1.8, 0.08]}
				radius={0.12}
				smoothness={10}
			>
				<meshStandardMaterial color={C.cream} />
			</RoundedBox>

			{/* title */}
			<Text
                onSync={fitDashboardText(3.65)} material-toneMapped={false}
				position={[0, 2.78, -2.53]}
				fontSize={0.21}
				color="#3d2b24"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
                WORK FACTORY
            </Text>

			<Text
                onSync={fitDashboardText(3.4)} material-toneMapped={false}
				position={[0, 2.54, -2.53]}
				fontSize={0.085}
				color="#3d2b24"
				anchorX="center"
				anchorY="middle"
				fontWeight={800}
			>
				SELECTED WORKS / MADE BY TWINKLE
			</Text>

            <StatusPanel position={[-1.45, 2.05, -2.55]} title="TOTAL PROJECTS">
                <DashboardLabel position={[0, 0.03, 0.12]} size={0.3}>
                    {String(projectStats.total).padStart(2, '0')}
                </DashboardLabel>
                <DashboardLabel position={[0, -0.2, 0.12]} size={0.075}>전체 프로젝트</DashboardLabel>
                <DashboardLabel position={[0, -0.33, 0.12]} size={0.055}>지금까지 만들어 온 결과물</DashboardLabel>
            </StatusPanel>
            <StatusPanel position={[0, 2.05, -2.55]} title="PERSONAL PROJECTS">
                <DashboardLabel position={[0, 0.03, 0.12]} size={0.3}>
                    {String(projectStats.personal).padStart(2, '0')}
                </DashboardLabel>
                <DashboardLabel position={[0, -0.2, 0.12]} size={0.075}>개인 프로젝트</DashboardLabel>
                <DashboardLabel position={[0, -0.33, 0.12]} size={0.055}>아이디어에서 직접 구현까지</DashboardLabel>
            </StatusPanel>
            <StatusPanel position={[1.45, 2.05, -2.55]} title="WORK PROJECTS">
                <DashboardLabel position={[0, 0.03, 0.12]} size={0.3}>
                    {String(projectStats.work).padStart(2, '0')}
                </DashboardLabel>
                <DashboardLabel position={[0, -0.2, 0.12]} size={0.075}>업무 프로젝트</DashboardLabel>
                <DashboardLabel position={[0, -0.33, 0.12]} size={0.055}>실무에서 쌓아 온 경험</DashboardLabel>
            </StatusPanel>

            <RoundedBox position={[0, 1.29, -2.55]} args={[3.85, 0.28, 0.06]} radius={0.08} smoothness={8}>
                <meshStandardMaterial color="#f9eef8" />
            </RoundedBox>
            {projectStats.technologies.map((tech, index) => (
                <DashboardLabel key={tech.name} position={[(index - 1) * 1.22, 1.29, -2.49]} size={0.075} width={1.05}>
                    {`${tech.name} · ${tech.count}개 프로젝트`}
                </DashboardLabel>
            ))}

			{/* right cloud light */}
			<RoundedBox
				position={[3.75, 1.75, -2.82]}
				args={[1.05, 1.05, 0.14]}
				radius={0.16}
				smoothness={12}
			>
				<meshStandardMaterial color={C.yellow} roughness={0.12} />
			</RoundedBox>

			<RoundedBox
				position={[3.75, 1.75, -2.68]}
				args={[0.78, 0.78, 0.08]}
				radius={0.12}
				smoothness={10}
			>
				<meshStandardMaterial color="#edf9ff" />
			</RoundedBox>

			<DashboardLabel position={[3.75, 1.75, -2.62]} size={0.11} width={0.6}>WORK</DashboardLabel>
		</group>
	);
}
function StatusPanel({
	position,
	title,
	children,
}: {
	position: [number, number, number];
	title: string;
	children: React.ReactNode;
}) {
	return (
		<group position={position}>
			<RoundedBox args={[1.15, 0.95, 0.06]} radius={0.08} smoothness={8}>
				<meshStandardMaterial color={C.blue} />
			</RoundedBox>

			<RoundedBox
				position={[0, 0, 0.035]}
				args={[1.05, 0.85, 0.035]}
				radius={0.06}
				smoothness={8}
			>
				<meshStandardMaterial color="#edf9ff" />
			</RoundedBox>

			<Text
                onSync={fitDashboardText(0.88)} material-toneMapped={false}
				position={[0, 0.32, 0.11]}
				fontSize={0.085}
				color="#3d2b24"
				anchorX="center"
				anchorY="middle"
				fontWeight={900}
			>
				{title}
			</Text>

			{children}
		</group>
	);
}
const signGlyphs: Record<string, string[]> = {
    I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
    N: ['10001', '11001', '11001', '10101', '10011', '10011', '10001'],
    O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
    T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
};

function LedLabel({ label, color, x }: { label: string; color: string; x: number }) {
    const dots = useMemo(() => {
        const positions: number[] = [];
        const columns = label.length * 6 - 1;
        [...label].forEach((letter, letterIndex) => {
            signGlyphs[letter].forEach((row, y) => {
                [...row].forEach((pixel, column) => {
                    if (pixel === '1') positions.push((letterIndex * 6 + column - (columns - 1) / 2) * 0.021, (3 - y) * 0.021, 0);
                });
            });
        });
        return new Float32Array(positions);
    }, [label]);
    return (
        <points position={[x, 1.38, 0.64]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[dots, 3]} />
            </bufferGeometry>
            <pointsMaterial color={color} size={0.014} toneMapped={false} />
        </points>
    );
}

function InMachine() {
	return (
		<group position={[-2.8, 0, -0.92]} rotation={[0, 0, 0]} scale={1.18}>
			<MachineBody label="IN" labelColor="#7dffac" />
		</group>
	);
}

function OutMachine() {
	return (
		<group position={[2.78, 0, -0.92]} rotation={[0, 0, 0]} scale={1.18}>
			<MachineBody label="OUT" labelColor="#ffc875" />
		</group>
	);
}
function MachineBody({
	label,
	labelColor,
}: {
	label: string;
	labelColor: string;
}) {
	return (
		<group>
			{/* 몸통: 볼륨 줄이고 플랫하게 */}
			<RoundedBox
				position={[label === 'OUT' ? 0.12 : -0.05, 0.88, 0]}
				args={[1.6, 1.58, 0.72]}
				radius={0.09}
				smoothness={8}
				castShadow
			>
				<meshStandardMaterial
					color={C.lavender}
					roughness={0.22}
				/>
			</RoundedBox>

			{/* 앞면 큰 패널 */}
			<RoundedBox
				position={[0, 0.5, 0.39]}
				args={[1, 1.8, 0.1]}
				radius={0.11}
				smoothness={8}
			>
				<meshStandardMaterial color="#fff6d8" />
			</RoundedBox>

			{/* 입구 프레임 */}
			{/* <RoundedBox
				position={[0, 0.65, 0.45]}
				args={[0.9, 1.4, 0.1]}
				radius={0.1}
				smoothness={8}
			>
				<meshStandardMaterial
					color={C.yellow}
					roughness={0.16}
				/>
			</RoundedBox> */}

			{/* 검정 구멍 */}
			<RoundedBox
				position={[label === 'OUT' ? -0.09 : 0.09, 0.6, 0.51]}
				args={[0.8, 1.5, 0.1]}
				radius={0.06}
				smoothness={6}
			>
				<meshStandardMaterial color="#6b4328" roughness={0.65} />
			</RoundedBox>

			{/* 라벨 판 */}
			<RoundedBox
				position={[label === 'OUT' ? -0.15 : 0.15, 1.38, 0.6]}
				args={[0.52, 0.24, 0.06]}
				radius={0.05}
				smoothness={6}
			>
				<meshStandardMaterial
					color="#172820"
					roughness={0.2}
				/>
			</RoundedBox>

			<LedLabel label={label} color={labelColor} x={label === 'OUT' ? -0.15 : 0.15} />

			{/* 사이드 버튼 패널 */}
			<RoundedBox
				position={[0.55, 0.72, 0.23]}
				args={[0.12, 0.56, 0.06]}
				radius={0.04}
				smoothness={5}
			>
				<meshStandardMaterial color={C.blue} roughness={0.18} />
			</RoundedBox>

			{[0.9, 0.72, 0.54].map((y, i) => (
				<mesh key={i} position={[0.55, y, 0.29]}>
					<sphereGeometry args={[0.045, 16, 16]} />
					<meshStandardMaterial
						color={[C.yellow, C.green, C.red][i]}
						roughness={0.12}
					/>
				</mesh>
			))}

			<RealSirenLight position={[0, 1.75, 0.08]} />
		</group>
	);
}
function RealSirenLight({ position }: { position: [number, number, number] }) {
	const spinRef = useRef<THREE.Group>(null);
	const pulseRef = useRef<THREE.PointLight>(null);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();

		if (spinRef.current) {
			spinRef.current.rotation.y = t * 5;
		}

		if (pulseRef.current) {
			pulseRef.current.intensity = 1.8 + Math.sin(t * 8) * 0.8;
		}
	});

	return (
		<group position={position}>
			{/* blue base */}
			<mesh position={[0, -0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[0.24, 0.015, 12, 40]} />
				<meshStandardMaterial color="#e67fb5" roughness={0.08} />
			</mesh>

			{/* black inner base */}
			<mesh position={[0, -0.03, 0]}>
				<cylinderGeometry args={[0.2, 0.22, 0.12, 40]} />
				<meshStandardMaterial color="#6b4328" roughness={0.45} />
			</mesh>

			<mesh position={[0, 0.13, 0]}>
				<cylinderGeometry args={[0.13, 0.16, 0.28, 48, 1, true]} />
				<meshStandardMaterial
					color="#e67fb5"
					transparent
					opacity={0.68}
					roughness={0.03}
					emissive="#e67fb5"
					emissiveIntensity={0.45}
				/>
			</mesh>

			{/* rotating bulb */}
			<group ref={spinRef} position={[0, 0.1, 0]}>
				<mesh position={[0.11, 0, 0]}>
					<sphereGeometry args={[0.075, 24, 24]} />
					<meshBasicMaterial color="#fff6d8" />
				</mesh>

				<mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
					<coneGeometry args={[0.08, 0.45, 24, 1, true]} />
					<meshBasicMaterial
						color="#e67fb5"
						transparent
						opacity={0.42}
						side={THREE.DoubleSide}
					/>
				</mesh>

				<mesh position={[-0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
					<coneGeometry args={[0.08, 0.45, 24, 1, true]} />
					<meshBasicMaterial
						color="#e67fb5"
						transparent
						opacity={0.28}
						side={THREE.DoubleSide}
					/>
				</mesh>
			</group>

			<pointLight
				ref={pulseRef}
				position={[0, 0.25, 0]}
				color="#e67fb5"
				intensity={2}
				distance={2.4}
			/>
		</group>
	);
}
function CandyProjectMachine({ onSelect }: { onSelect: (index: number) => void }) {
    const candyRef = useRef<THREE.Group>(null);
    const knobRef = useRef<THREE.Mesh>(null);
    const iconRef = useRef<THREE.Group>(null);
    const promptRef = useRef<THREE.Group>(null);
    const draw = useRef({ elapsed: 0, active: false, picked: -1, last: -1, reduced: false });
    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => { draw.current.reduced = preference.matches; };
        update();
        preference.addEventListener('change', update);
        return () => { preference.removeEventListener('change', update); document.body.style.cursor = ''; };
    }, []);

    const startDraw = () => {
        if (draw.current.active || !projects.length) return;
        const last = draw.current.last;
        const picked = projects.length > 1 && last >= 0
            ? (last + 1 + Math.floor(Math.random() * (projects.length - 1))) % projects.length
            : Math.floor(Math.random() * projects.length);
        draw.current.picked = picked;
        draw.current.active = true;
        draw.current.elapsed = 0;
        document.body.style.cursor = 'progress';
    };

	const candies = useMemo(
		() =>
			Array.from({ length: 46 }, (_, i) => {
				const angle = (i / 46) * Math.PI * 2;
				const sample = (seed: number) => { const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };
                const r = 0.12 + sample(i + 1) * 0.43;
				return {
					position: [
						Math.cos(angle) * r,
						1.32 + sample(i + 12) * 0.38,
						Math.sin(angle) * r,
					] as [number, number, number],
					scale: 0.07 + sample(i + 30) * 0.045,
					color: [
						C.pink,
						C.yellow,
						C.blue,
						C.lavender,
						'#e67fb5',
						'#ffffff',
						'#74bff2',
					][i % 7],
				};
			}),
		[]
	);

    useFrame(({ clock }, delta) => {
        const state = draw.current;
        const phase = clock.elapsedTime % 2.8;
        const showIcon = !state.active && !state.reduced && phase < 1.28;
        const showPrompt = state.active || state.reduced || (phase >= 1.4 && phase < 2.68);
        if (iconRef.current) iconRef.current.visible = showIcon;
        if (promptRef.current) promptRef.current.visible = showPrompt;
        const dt = Math.min(delta, 0.05);
        if (state.active) state.elapsed += dt;
        const duration = state.reduced ? 0.35 : 1.8;
        const progress = Math.min(1, state.elapsed / duration);
        const energy = state.active && !state.reduced ? Math.sin(progress * Math.PI) : 0;
        // A short, gently eased invitation followed by a long pause.
        const idlePhase = clock.elapsedTime % 5.5;
        const idleProgress = idlePhase / 1.1;
        const idleEnergy = !state.active && !state.reduced && idlePhase < 1.1
            ? Math.sin(idleProgress * Math.PI) ** 2
            : 0;
        if (candyRef.current) {
            candyRef.current.rotation.y += dt * energy * 11;
            candyRef.current.rotation.z = Math.sin(progress * Math.PI * 8) * energy * 0.1;
            candyRef.current.children.forEach((candy, index) => {
                const idleBounce = Math.abs(Math.sin(idleProgress * Math.PI * 3 + index * 1.8)) * idleEnergy * 0.075;
                candy.position.y = candies[index].position[1] - 1.55
                    + Math.sin(progress * 24 + index * 1.8) * energy * 0.065
                    + idleBounce;
            });
        }
        if (knobRef.current) knobRef.current.rotation.z += dt * energy * 9;
        if (state.active && progress >= 1) {
            state.active = false;
            state.last = state.picked;
            document.body.style.cursor = '';
            onSelect(state.picked);
        }
    });

	return (
		<group position={[0, 0, -1.65]}
            onClick={(event) => { event.stopPropagation(); startDraw(); }}
            onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = draw.current.active ? 'progress' : 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = ''; }}
        >
			{/* lower metal base */}
			<RoundedBox
				position={[0, 0.14, 0]}
				args={[1.65, 0.22, 1.02]}
				radius={0.12}
				smoothness={12}
				castShadow
			>
				<meshStandardMaterial
					color="#b9b9b9"
					roughness={0.22}
					metalness={0.45}
				/>
			</RoundedBox>

			{/* main body */}
			<RoundedBox
				position={[0, 0.72, 0]}
				args={[1.48, 1.18, 0.9]}
				radius={0.24}
				smoothness={18}
				castShadow
			>
				<meshStandardMaterial
					color="#ff9fbd"
					roughness={0.12}
				/>
			</RoundedBox>

			{/* side grooves */}
			{[-0.57, 0.57].map((x) => (
				<mesh key={x} position={[x, 0.72, 0.48]}>
					<boxGeometry args={[0.045, 0.88, 0.035]} />
					<meshStandardMaterial
						color="#f586aa"
						roughness={0.25}
					/>
				</mesh>
			))}

			{/* dome bottom ring */}
			<mesh position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[0.7, 0.055, 18, 64]} />
				<meshStandardMaterial
					color="#d7b46a"
					roughness={0.16}
					metalness={0.45}
				/>
			</mesh>

			{/* glass dome */}
			<mesh position={[0, 1.55, 0]}>
				<sphereGeometry args={[0.68, 24, 16]} />
				<meshStandardMaterial
					color="#ffd8ee"
					roughness={0.02}
					transparent
					opacity={0.42}
					depthWrite={false}
				/>
			</mesh>

			{/* candies inside */}
            <group ref={candyRef} position={[0, 1.55, 0]}>
			{candies.map((candy, i) => (
				<mesh key={i} position={[candy.position[0], candy.position[1] - 1.55, candy.position[2]]} scale={candy.scale}>
					<sphereGeometry args={[1, 12, 8]} />
					<meshStandardMaterial
						color={candy.color}
						roughness={0.18}
					/>
				</mesh>
			))}
            </group>

			{/* top cap */}
			<RoundedBox
				args={[1.0, 0.14, 0.78]}
				radius={0.1}
				position={[0, 1, 0]}
				smoothness={18}
				castShadow
			>
				<meshStandardMaterial
					color="#8fd3ff"
					roughness={0.1}
				/>
			</RoundedBox>

			{/* top metal trim */}
			<mesh position={[0, 1.94, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[0.68, 0.035, 16, 64]} />
				<meshStandardMaterial
					color="#c7a05a"
					roughness={0.18}
					metalness={0.55}
				/>
			</mesh>

			{/* make plate */}
			<RoundedBox
				position={[0, 2.16, 0.5]}
				args={[0.62, 0.18, 0.06]}
				radius={0.045}
				smoothness={8}
			>
				<meshStandardMaterial
					color="#d6b36b"
					roughness={0.16}
					metalness={0.45}
				/>
			</RoundedBox>

            {/* Offset layers suggest raised lettering without extruded geometry. */}
            <group position={[0, 2.165, 0.54]}>
                <Text position={[0.006, -0.006, 0]} fontSize={0.105} color="#24170f" anchorX="center" anchorY="middle" fontWeight={900} material-toneMapped={false}>
                    랜덤뽑기
                </Text>
                <Text position={[-0.003, 0.004, 0.003]} fontSize={0.105} color="#d8bd85" anchorX="center" anchorY="middle" fontWeight={900} material-toneMapped={false}>
                    랜덤뽑기
                </Text>
                <Text position={[0, 0, 0.007]} fontSize={0.105} color="#3b261b" anchorX="center" anchorY="middle" fontWeight={900} material-toneMapped={false}>
                    랜덤뽑기
                </Text>
            </group>

			{/* face screen frame */}
			<RoundedBox
				position={[0, 0.9, 0.51]}
				args={[1.0, 0.48, 0.1]}
				radius={0.13}
				smoothness={12}
			>
				<meshStandardMaterial
					color="#d7b46a"
					roughness={0.16}
					metalness={0.45}
				/>
			</RoundedBox>

			<RoundedBox
				position={[0, 0.9, 0.57]}
				args={[0.82, 0.32, 0.08]}
				radius={0.09}
				smoothness={10}
			>
				<meshStandardMaterial color="#14241d" />
			</RoundedBox>

			<group ref={iconRef}>
                <Text position={[0, 0.9, 0.63]} fontSize={0.2} color="#75ff75" anchorX="center" anchorY="middle" material-toneMapped={false}>
                    ☺
                </Text>
            </group>
            <group ref={promptRef} visible={false}>
                <Text position={[0, 0.9, 0.63]} fontSize={0.095} color="#75ff75" anchorX="center" anchorY="middle" material-toneMapped={false}>
                    CLICK TO PICK!
                </Text>
            </group>

			{/* control panel */}
			<RoundedBox
				position={[0, 0.48, 0.53]}
				args={[1.05, 0.22, 0.09]}
				radius={0.075}
				smoothness={10}
			>
				<meshStandardMaterial
					color="#d8b678"
					roughness={0.16}
					metalness={0.35}
				/>
			</RoundedBox>

			{/* knob */}
			<mesh ref={knobRef} position={[-0.33, 0.49, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[0.12, 0.12, 0.08, 32]} />
				<meshStandardMaterial
					color="#b38343"
					roughness={0.16}
					metalness={0.6}
				/>
			</mesh>

			{/* buttons */}
			{[
				[-0.02, C.pink],
				[0.18, C.yellow],
				[0.38, C.blue],
			].map(([x, color]) => (
				<mesh key={String(x)} position={[x as number, 0.49, 0.62]}>
					<sphereGeometry args={[0.055, 24, 24]} />
					<meshStandardMaterial
						color={color as string}
						roughness={0.12}
					/>
				</mesh>
			))}

			{/* output pipe */}
			<mesh position={[0, 0.26, 0.67]} rotation={[Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[0.2, 0.26, 0.36, 40]} />
				<meshStandardMaterial
					color="#c9913d"
					roughness={0.15}
					metalness={0.55}
				/>
			</mesh>

			<mesh position={[0, 0.26, 0.88]} rotation={[Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[0.24, 0.24, 0.08, 40]} />
				<meshStandardMaterial
					color="#e0b05a"
					roughness={0.12}
					metalness={0.55}
				/>
			</mesh>

			{/* candy tray */}
			<RoundedBox
				position={[0, 0.08, 0.72]}
				args={[0.72, 0.16, 0.46]}
				radius={0.12}
				smoothness={12}
				castShadow
			>
				<meshStandardMaterial color="#ff9fbd" roughness={0.12} />
			</RoundedBox>

			{/* small feet */}
			{[
				[-0.58, -0.02, 0.34],
				[0.58, -0.02, 0.34],
				[-0.58, -0.02, -0.34],
				[0.58, -0.02, -0.34],
			].map((p, i) => (
				<mesh key={i} position={p as [number, number, number]}>
					<cylinderGeometry args={[0.09, 0.09, 0.06, 24]} />
					<meshStandardMaterial color="#3a2a25" />
				</mesh>
			))}
		</group>
	);
}

function ConveyorBelt() {
	const wheelRefs = useRef<THREE.Group[]>([]);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();

		wheelRefs.current.forEach((wheel, i) => {
			if (!wheel) return;

			wheel.rotation.z = -t * 3 + i * 0.2;
		});
	});

	return (
		<group position={[0, 0.26, 0.28]}>
			{/* 벨트 */}
			<BeltPiece position={[-2.8, 0, -0.86]} args={[0.78, 0.18, 1.25]} />
			<BeltPiece position={[0, 0, -0.38]} args={[5.6, 0.18, 0.86]} />
			<BeltPiece position={[2.8, 0, -0.86]} args={[0.78, 0.18, 1.25]} />

			{/* 가운데 벨트 줄무늬 */}
			{Array.from({ length: 17 }).map((_, i) => (
				<mesh key={i} position={[-2.72 + i * 0.34, 0.23, -0.38]}>
					<boxGeometry args={[0.24, 0.035, 0.7]} />
					<meshStandardMaterial
						color={i % 2 === 0 ? '#a97eea' : C.belt}
						roughness={0.55}
					/>
				</mesh>
			))}

			{/* IN 벨트 줄무늬 */}
			{Array.from({ length: 4 }).map((_, i) => (
				<mesh key={i} position={[-2.8, 0.23, -1.18 + i * 0.28]}>
					<boxGeometry args={[0.66, 0.035, 0.18]} />
					<meshStandardMaterial
						color={i % 2 === 0 ? '#a97eea' : C.belt}
						roughness={0.55}
					/>
				</mesh>
			))}

			{/* OUT 벨트 줄무늬 */}
			{Array.from({ length: 4 }).map((_, i) => (
				<mesh key={i} position={[2.8, 0.23, -0.35 - i * 0.28]}>
					<boxGeometry args={[0.66, 0.035, 0.18]} />
					<meshStandardMaterial
						color={i % 2 === 0 ? '#a97eea' : C.belt}
						roughness={0.55}
					/>
				</mesh>
			))}

			{/* 받침 기둥 */}
			{[-2.1, -1.05, 0, 1.05, 2.1].map((x) => (
				<group key={x} position={[x, -0.34, -0.38]}>
					<mesh position={[0, 0, 0.3]}>
						<boxGeometry args={[0.12, 0.34, 0.12]} />
						<meshStandardMaterial
							color={C.pink}
							roughness={0.12}
						/>
					</mesh>

					<mesh position={[0, 0, -0.3]}>
						<boxGeometry args={[0.12, 0.34, 0.12]} />
						<meshStandardMaterial
							color={C.pink}
							roughness={0.12}
						/>
					</mesh>
				</group>
			))}

			{/* 회전 롤러 */}
			{[-2.8, 2.8].map((x, index) => (
				<group
					key={index}
					ref={(el) => {
						if (el) wheelRefs.current[index] = el;
					}}
					position={[x, 0.13, -0.86]}
				>
					<mesh rotation={[0, Math.PI / 2, 0]}>
						<cylinderGeometry args={[0.11, 0.11, 0.82, 32]} />
						<meshStandardMaterial
							color="#8b8b8b"
							metalness={0.4}
							roughness={0.35}
						/>
					</mesh>

					{[-0.24, 0, 0.24].map((z, i) => (
						<mesh key={i} position={[0, 0, z]} rotation={[0, Math.PI / 2, 0]}>
							<torusGeometry args={[0.11, 0.012, 12, 24]} />
							<meshStandardMaterial color="#a97eea" />
						</mesh>
					))}
				</group>
			))}
		</group>
	);
}
function BeltPiece({
	position,
	args,
}: {
	position: [number, number, number];
	args: [number, number, number];
}) {
	return (
		<group position={position}>
			<RoundedBox
				position={[0, 0.02, 0]}
				args={args}
				radius={0.13}
				smoothness={10}
			>
				<meshStandardMaterial
					color={C.pinkDark}
					roughness={0.13}
				/>
			</RoundedBox>

			<RoundedBox
				position={[0, 0.13, 0]}
				args={[args[0] * 0.9, 0.16, args[2] * 0.82]}
				radius={0.1}
				smoothness={10}
			>
				<meshStandardMaterial color={C.beltDark} roughness={0.6} />
			</RoundedBox>
		</group>
	);
}
const parcelStyles = [
    { width: 0.94, height: 0.54, depth: 0.6, color: C.cream, tape: C.pink },
    { width: 0.72, height: 0.88, depth: 0.54, color: '#edf9ff', tape: C.blue },
    { width: 0.9, height: 0.66, depth: 0.64, color: '#f9eef8', tape: C.lavender },
    { width: 0.95, height: 0.46, depth: 0.62, color: '#f7edff', tape: C.pink },
    { width: 0.76, height: 0.76, depth: 0.56, color: C.cream, tape: C.yellow },
    { width: 0.86, height: 0.59, depth: 0.68, color: '#edf9ff', tape: C.lavender },
    { width: 0.73, height: 0.94, depth: 0.54, color: '#f9eef8', tape: C.blue },
    { width: 0.93, height: 0.52, depth: 0.6, color: C.cream, tape: C.pink },
    { width: 0.8, height: 0.72, depth: 0.62, color: '#f7edff', tape: C.yellow },
];

function MovingBoxes({
	onSelectProject,
}: {
	onSelectProject: (project: (typeof projects)[number]) => void;
}) {
	return (
		<>
			{projects.map((project, i) => (
				<MovingBox
					key={project.title}
					offset={(i / projects.length + Math.sin(i * 2.4) * 0.006 + 1) % 1}
                    variant={i}
					project={project}
					onClick={() => onSelectProject(project)}
				/>
			))}
		</>
	);
}

function MovingBox({
    variant,
	offset,
	project,
	onClick,
}: {
	offset: number;
    variant: number;
	project: (typeof projects)[number];
	onClick: () => void;
}) {
	const ref = useRef<THREE.Group>(null);
	const companyLogo = (project as { companyLogo?: { src: string } }).companyLogo;
	const hasCompanyLogo = !!companyLogo;
    const parcel = parcelStyles[variant % parcelStyles.length];
    const labelScale = Math.min(parcel.width / 0.95, parcel.height / 0.62, 1);
    const phase = variant * 1.7;

	useFrame(({ clock }) => {
		if (!ref.current) return;

		const t = clock.getElapsedTime();
		const loopDuration = 35;

		// 핵심 수정: offset은 이미 0~1 비율이므로 여기서 나누면 안 됨
		const progress = (t / loopDuration + offset) % 1;

		const p = getBoxPathPoint(progress);

		ref.current.position.x = p.x;
		ref.current.position.z = p.z;
		ref.current.rotation.y = p.rotationY + Math.sin(t * 0.8 + phase) * 0.035;
        ref.current.rotation.z = Math.sin(t * 1.6 + phase) * 0.018;

		let s = 0.78;

		if (progress < 0.06) {
			s = 0.78 * (progress / 0.06);
		}

		if (progress > 0.94) {
			s = 0.78 * ((1 - progress) / 0.06);
		}

		ref.current.scale.setScalar(Math.max(0.02, s));
        ref.current.position.y = 0.53 + parcel.height * Math.max(0.02, s) / 2 + Math.sin(t * 1.6 + phase) * 0.005;
	});

	return (
		<group
			ref={ref}
			position={[-3.25, 0.76, -1.35]}
			scale={0.78}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => { document.body.style.cursor = ''; }}
			onClick={(e) => {
				e.stopPropagation();
                document.body.style.cursor = '';
				onClick();
			}}
		>
            <RoundedBox args={[parcel.width, parcel.height, parcel.depth]} radius={0.06} smoothness={3} bevelSegments={1} castShadow>
                <meshStandardMaterial color={parcel.color} roughness={0.55} />
            </RoundedBox>
            <group position={[0, -0.015, parcel.depth / 2 + 0.018]} scale={labelScale} rotation={[0, 0, Math.sin(phase) * 0.065]}>
                <mesh position={[0, 0, -0.006]}>
                    <boxGeometry args={[0.78, 0.38, 0.01]} />
                    <meshStandardMaterial color={C.white} roughness={0.8} />
                </mesh>
                {hasCompanyLogo ? (
                    <CompanyLogoPrint src={companyLogo.src} />
                ) : (
                    <Text position={[0, 0, 0.005]} fontSize={0.085} color="#6b4328" anchorX="center" anchorY="middle" fontWeight={900} textAlign="center" material-toneMapped={false}>
                        {'PERSONAL\nPROJECT'}
                    </Text>
                )}
            </group>
		</group>
	);
}

function CompanyLogoPrint({ src }: { src: string }) {
	const logoTexture = useTexture(src);

	const logoSize = useMemo(() => {
		const image = logoTexture.image as HTMLImageElement | undefined;

		if (!image?.width || !image?.height) {
			return { width: 0.62, height: 0.27 };
		}

		const ratio = image.width / image.height;
		const maxWidth = 0.62;
		const maxHeight = 0.27;

		let width = maxWidth;
		let height = width / ratio;

		if (height > maxHeight) {
			height = maxHeight;
			width = height * ratio;
		}

		return { width, height };
	}, [logoTexture]);

	return (
		<mesh position={[0, 0, 0.005]}>
			<planeGeometry args={[logoSize.width, logoSize.height]} />
			<meshBasicMaterial
				map={logoTexture}
				transparent
				opacity={0.75}
				alphaTest={0.01}
				depthWrite={false}
				toneMapped={false}
			/>
		</mesh>
	);
}

function smoothStep(t: number) {
	return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

function getBoxPathPoint(progress: number) {
	// 구간 비율
	// IN 회전/진입: 짧게 빠르게
	// 직선: 길게 천천히
	// OUT 회전/퇴장: 짧게 빠르게
	const inEnd = 0.14;
	const straightEnd = 0.86;

	if (progress < inEnd) {
		const p = smoothStep(progress / inEnd);

		return {
			x: -2.8,
			z: -1.07 + p * 0.95,

			// IN: 왼쪽 옆면 → 정면, 빠르게 회전
			rotationY: lerp(Math.PI / 2, 0, p),
		};
	}

	if (progress < straightEnd) {
		const p = (progress - inEnd) / (straightEnd - inEnd);

		return {
			// 직선 구간을 길게 써서 로고가 오래 보임
			x: -2.8 + p * 5.6,
			z: -0.12,

			// 정면 유지
			rotationY: 0,
		};
	}

	const p = smoothStep((progress - straightEnd) / (1 - straightEnd));

	return {
		x: 2.8,
		z: -0.12 - p * 0.95,

		// OUT: 정면 → 오른쪽 옆면, 빠르게 회전
		rotationY: lerp(0, -Math.PI / 2, p),
	};
}
