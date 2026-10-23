'use client';

import { Html, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from 'react';
import { MathUtils, type Group } from 'three';
import RoundedBox from '../components/RoundedBox';
import type { ContactMode } from './Contact/ContactPanel';

const ContactPanel = lazy(() => import('./Contact/ContactPanel'));
const ink = '#735344';

function Block({ color, ...props }: ComponentProps<typeof RoundedBox> & { color: string }) {
    return <RoundedBox radius={0.06} smoothness={3} bevelSegments={1} castShadow {...props}>
        <meshStandardMaterial color={color} roughness={0.34} metalness={0.06} />
    </RoundedBox>;
}

function Envelope({ position, color = '#c98491', scale = 1 }: { position: [number, number, number]; color?: string; scale?: number }) {
    return <group position={position} scale={scale}>
        <Block args={[1.25, 0.8, 0.055]} color="#fff8e8" radius={0.025} />
        {[-1, 1].map((side) => <mesh key={side} position={[side * 0.25, 0.1, 0.035]} rotation={[0, 0, side * 0.6]}>
            <boxGeometry args={[0.65, 0.022, 0.01]} /><meshStandardMaterial color={color} />
        </mesh>)}
        <mesh position={[0.42, 0.2, 0.035]}><planeGeometry args={[0.18, 0.22]} /><meshStandardMaterial color={color} /></mesh>
    </group>;
}

function useReducedMotion() {
    const [reduced, setReduced] = useState(true);
    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);
    return reduced;
}

function MailSlot({ hovered }: { hovered: boolean }) {
    const lid = useRef<Group>(null);
    const invalidate = useThree((state) => state.invalidate);
    const reduced = useReducedMotion();
    useEffect(() => invalidate(), [hovered, reduced, invalidate]);
    useFrame((_, delta) => {
        if (!lid.current) return;
        const target = hovered ? -0.95 : 0;
        lid.current.rotation.x = reduced ? target : MathUtils.damp(lid.current.rotation.x, target, 10, Math.min(delta, 0.05));
        if (Math.abs(lid.current.rotation.x - target) > 0.001) invalidate();
    });
    return <group>
        <Block position={[0, 1.41, 0.44]} args={[0.88, 0.2, 0.06]} color="#fff2dc" radius={0.03} />
        <Block position={[0, 1.41, 0.48]} args={[0.72, 0.075, 0.02]} color="#65453f" radius={0.015} />
        <group ref={lid} position={[0, 1.49, 0.5]}>
            <Block position={[0, -0.07, 0]} args={[0.76, 0.14, 0.025]} color="#b8454c" radius={0.015} />
        </group>
    </group>;
}

function Book({ hovered }: { hovered: boolean }) {
    const pencil = useRef<Group>(null);
    const amount = useRef(0);
    const phase = useRef(0);
    const invalidate = useThree((state) => state.invalidate);
    const reduced = useReducedMotion();
    useEffect(() => invalidate(), [hovered, reduced, invalidate]);
    useFrame((_, delta) => {
        if (!pencil.current) return;
        const step = Math.min(delta, 0.05);
        amount.current = MathUtils.damp(amount.current, hovered && !reduced ? 1 : 0, 8, step);
        phase.current += step * amount.current;
        const a = amount.current;
        pencil.current.position.set(0.75 - a * 0.38 + Math.sin(phase.current * 12) * 0.045 * a, 0.12 + a * 0.14, 0.05 + Math.sin(phase.current * 5) * 0.05 * a);
        pencil.current.rotation.set(0.15 + Math.sin(phase.current * 9) * 0.12 * a, 0, -0.5 - a * 0.25);
        if ((hovered && !reduced) || a > 0.001) invalidate();
    });
    return <group position={[0, 1.13, 0.08]} rotation={[-0.3, 0, 0]}>
        <Block args={[1.35, 0.06, 0.85]} color="#816792" />
        <Block args={[0.6, 0.04, 0.75]} position={[-0.32, 0.05, 0]} rotation={[0, 0, -0.03]} color="#fffaf0" radius={0.018} />
        <Block args={[0.6, 0.04, 0.75]} position={[0.32, 0.05, 0]} rotation={[0, 0, 0.03]} color="#fffaf0" radius={0.018} />
        {[-1, 1].flatMap((side) => [0, 1, 2, 3].map((line) => <mesh key={`${side}-${line}`} position={[side * 0.32, 0.076, -0.22 + line * 0.13]}>
            <boxGeometry args={[0.4, 0.003, 0.009]} /><meshStandardMaterial color="#d8c3aa" />
        </mesh>))}
        <group ref={pencil} position={[0.75, 0.12, 0.05]} rotation={[0.15, 0, -0.5]}>
            <mesh><cylinderGeometry args={[0.02, 0.02, 0.55, 8]} /><meshStandardMaterial color="#b58158" /></mesh>
            <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.02, 0.05, 8]} /><meshStandardMaterial color="#594537" /></mesh>
        </group>
    </group>;
}

function PostOfficeBoard() {
    const pivots = useRef<(Group | null)[]>([]);
    const gust = useRef(4);
    const invalidate = useThree((state) => state.invalidate);
    const reduced = useReducedMotion();
    useEffect(() => {
        if (reduced) {
            pivots.current.forEach((pivot) => { if (pivot) pivot.rotation.set(0, 0, 0); });
            invalidate();
            return;
        }
        let timer: ReturnType<typeof setTimeout>;
        const schedule = () => {
            timer = setTimeout(() => {
                if (!document.hidden) { gust.current = 0; invalidate(); }
                schedule();
            }, 5500 + Math.random() * 6500);
        };
        schedule();
        return () => clearTimeout(timer);
    }, [reduced, invalidate]);
    useFrame((_, delta) => {
        if (reduced || gust.current >= 4) return;
        gust.current = Math.min(4, gust.current + Math.min(delta, 0.05));
        pivots.current.forEach((pivot, index) => {
            if (!pivot) return;
            const t = MathUtils.clamp((gust.current - (index % 5) * 0.13) / 3.35, 0, 1);
            const breeze = Math.sin(t * Math.PI) ** 2;
            pivot.rotation.x = -breeze * (0.055 + 0.035 * Math.sin(t * Math.PI * 5 + index));
            pivot.rotation.z = breeze * Math.sin(t * Math.PI * 4 + index * 1.7) * 0.018;
        });
        if (gust.current < 4) invalidate();
    });
    const papers = ['#fff0b5', '#f5d9d4', '#fff9e9', '#dce5cb', '#e7dff0'];
    const notes = [
        [-2.65, 2.37, 0.5, 0.59, 0.28], [-1.85, 2.44, 0.72, 0.42, -0.23],
        [-0.62, 2.37, 0.53, 0.58, 0.19], [0.19, 2.5, 0.65, 0.39, -0.09],
        [1.38, 2.36, 0.48, 0.61, 0.3], [2.46, 2.45, 0.63, 0.4, -0.19],
        [-2.37, 2.06, 0.7, 0.43, -0.22], [-1.38, 2.14, 0.45, 0.6, 0.27],
        [-0.3, 2.02, 0.71, 0.48, -0.31], [0.72, 2.24, 0.47, 0.54, 0.21],
        [1.83, 2.04, 0.64, 0.39, -0.26], [2.58, 1.9, 0.43, 0.58, 0.22],
        [-2.63, 1.7, 0.54, 0.39, 0.17], [-1.66, 1.84, 0.69, 0.48, -0.28],
        [-0.87, 1.68, 0.47, 0.4, 0.26], [0.15, 1.72, 0.6, 0.46, -0.18],
        [1.29, 1.75, 0.55, 0.48, 0.31], [2.03, 1.67, 0.57, 0.37, -0.12],
    ];
    return <group>
        <Block position={[0, 2.25, -2.85]} args={[6.5, 1.96, 0.16]} color="#795c4c" radius={0.12} />
        <Block position={[0, 2.25, -2.73]} args={[6.26, 1.72, 0.08]} color="#cba77c" radius={0.06} />
        <Text position={[0, 2.94, -2.66]} fontSize={0.25} color="#543c30" anchorX="center" anchorY="middle" fontWeight={900}>TWINKLE POST OFFICE</Text>
        {notes.map(([x, y, width, height, angle], index) => <group key={index} position={[x, y, -2.64 + Math.floor(index / 6) * 0.06]} rotation={[0, 0, angle]}>
            <group ref={(node) => { pivots.current[index] = node; }} position={[0.02, height / 2 - 0.045, 0]}>
            <group position={[-0.02, -height / 2 + 0.045, 0]}>
            <mesh position={[0.014, -0.018, -0.006]}>
                <planeGeometry args={[width, height]} /><meshBasicMaterial color="#9c7a55" />
            </mesh>
            <mesh>
                <planeGeometry args={[width, height]} /><meshStandardMaterial color={papers[index % papers.length]} roughness={0.95} />
            </mesh>
            <lineSegments position={[0, 0, 0.008]}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[new Float32Array([
                        -width * 0.29, height * 0.12, 0, width * 0.18, height * 0.1, 0,
                        -width * 0.28, -height * 0.02, 0, width * (0.2 + (index % 3) * 0.04), -height * 0.04, 0,
                        -width * 0.27, -height * 0.17, 0, width * 0.06, -height * 0.15, 0,
                    ]), 3]} />
                </bufferGeometry>
                <lineBasicMaterial color="#ae9c84" />
            </lineSegments>
            </group>
            </group>
            <mesh position={[0.02, height / 2 - 0.045, 0.018]}>
                <sphereGeometry args={[0.022, 8, 6]} /><meshStandardMaterial color={index % 2 ? '#9a7455' : '#bd5d5b'} roughness={0.45} />
            </mesh>
        </group>)}
    </group>;
}

function PottedTree() {
    return <group position={[-3.4, 0, -1.2]}>
        <mesh position={[0, 0.27, 0]} castShadow><cylinderGeometry args={[0.32, 0.24, 0.54, 16]} /><meshStandardMaterial color="#bd9585" roughness={0.65} /></mesh>
        <mesh position={[0, 0.54, 0]} castShadow><cylinderGeometry args={[0.35, 0.35, 0.1, 16]} /><meshStandardMaterial color="#cca593" roughness={0.6} /></mesh>
        <mesh position={[0, 0.595, 0]}><cylinderGeometry args={[0.29, 0.29, 0.015, 16]} /><meshStandardMaterial color="#654b36" roughness={0.9} /></mesh>
        <mesh position={[0, 1.02, 0]} castShadow><cylinderGeometry args={[0.055, 0.09, 0.95, 10]} /><meshStandardMaterial color="#947052" roughness={0.8} /></mesh>
        {[-1, 1].map((side) => <mesh key={side} position={[side * 0.13, 1.42, 0]} rotation={[0, 0, -side * 0.5]} castShadow>
            <cylinderGeometry args={[0.028, 0.045, 0.55, 8]} /><meshStandardMaterial color="#947052" roughness={0.8} />
        </mesh>)}
        {([
            [0, 1.94, 0, 0.53, '#8fa77b'], [-0.36, 1.8, 0.04, 0.38, '#a4b88d'],
            [0.34, 1.9, 0.02, 0.4, '#7f9c6d'], [0.03, 2.3, -0.02, 0.37, '#a3b98a'],
            [0.05, 1.84, 0.28, 0.34, '#91aa78'],
        ] as const).map(([x, y, z, radius, color], index) => <mesh key={index} position={[x, y, z]} castShadow>
            <sphereGeometry args={[radius, 16, 12]} /><meshStandardMaterial color={color} roughness={0.65} />
        </mesh>)}
    </group>;
}

export default function ContactRoom({ onBack }: { onBack: () => void }) {
    const [mode, setMode] = useState<ContactMode | null>(null);
    const [mailHovered, setMailHovered] = useState(false);
    const [bookHovered, setBookHovered] = useState(false);
    useEffect(() => () => { document.body.style.cursor = ''; }, []);
    const interactive = {
        onPointerOver: (event: { stopPropagation: () => void }) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; },
        onPointerOut: () => { document.body.style.cursor = ''; },
    };
    const open = (next: ContactMode) => { document.body.style.cursor = ''; setMode(next); };

    return <group>
        <ambientLight intensity={0.95} />
        <directionalLight position={[-3, 6, 5]} intensity={1.6} color="#fff1d9" castShadow shadow-mapSize={[1024, 1024]} />
        <hemisphereLight args={['#fff3e3', '#c89886', 0.7]} />
        <mesh position={[0, -0.08, 0]} receiveShadow><boxGeometry args={[9, 0.16, 6]} /><meshStandardMaterial color="#e9d9be" roughness={0.7} /></mesh>
        <mesh position={[0, 1.75, -3.05]} receiveShadow><boxGeometry args={[9, 3.5, 0.18]} /><meshStandardMaterial color="#faedda" /></mesh>
        <mesh position={[0, 3.6, 0]} receiveShadow><boxGeometry args={[9.16, 0.2, 6.16]} /><meshStandardMaterial color="#fff4e3" roughness={0.7} /></mesh>
        <Block position={[0, 3.43, -2.91]} args={[9, 0.14, 0.16]} color="#d8bca5" castShadow={false} />
        {[-1, 1].map((side) => <group key={side}>
            <mesh position={[side * 4.5, 1.75, 0]}><boxGeometry args={[0.16, 3.5, 6]} /><meshBasicMaterial color="#e5cec6" /></mesh>
            <Block position={[side * 4.4, 0.6, 0]} args={[0.12, 1.2, 6]} color="#d7b6a7" />
            <Block position={[side * 4.32, 1.22, 0]} args={[0.13, 0.08, 6]} color="#a6816a" radius={0.02} />
        </group>)}
        <Block position={[0, 0.58, -2.9]} args={[9, 1.16, 0.13]} color="#d7b6a7" />
        <Block position={[0, 1.2, -2.8]} args={[9, 0.08, 0.16]} color="#a6816a" radius={0.02} />
        <PostOfficeBoard />
        <Block position={[0, 3.32, -1.2]} args={[3.6, 0.12, 0.4]} color="#fff8db" />
        <mesh position={[0, 3.252, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.36, 0.32]} />
            <meshStandardMaterial color="#fff4ca" emissive="#ffdf94" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
        <pointLight position={[0, 3.05, -1.2]} color="#ffe1a8" intensity={4} distance={6} decay={2} />
        {[-1, 1].map((side) => <mesh key={side} position={[side * 1.4, 3.42, -1.2]}><cylinderGeometry args={[0.015, 0.015, 0.25, 8]} /><meshStandardMaterial color={ink} /></mesh>)}

        <group position={[-1.35, 0, -1.1]} {...interactive}
            onPointerOver={(event) => { interactive.onPointerOver(event); setMailHovered(true); }}
            onPointerOut={() => { interactive.onPointerOut(); setMailHovered(false); }}
            onClick={(event) => { event.stopPropagation(); open('mail'); }}>
            <Block position={[0, 0.12, 0]} args={[1.35, 0.24, 1]} color="#943f45" radius={0.08} />
            <Block position={[0, 0.46, 0]} args={[0.3, 0.65, 0.3]} color="#ab484d" />
            <Block position={[0, 1.27, 0]} args={[1.24, 1.3, 0.85]} color="#c85359" radius={0.22} />
            <Block position={[0, 1.74, 0]} args={[1.26, 0.34, 0.88]} color="#dc7072" radius={0.14} />
            <MailSlot hovered={mailHovered && !mode} />
            <Envelope position={[0, 1.02, 0.46]} scale={0.37} color="#ab484d" />
        </group>

        <group position={[1.45, 0, -1.2]} {...interactive}
            onPointerOver={(event) => { interactive.onPointerOver(event); setBookHovered(true); }}
            onPointerOut={() => { interactive.onPointerOut(); setBookHovered(false); }}
            onClick={(event) => { event.stopPropagation(); open('guestbook'); }}>
            <Block position={[0, 0.52, 0]} args={[2.4, 1.04, 1.05]} color="#a57650" radius={0.08} />
            <Block position={[0, 1.06, 0]} args={[2.65, 0.12, 1.25]} color="#fff4de" />
            <Block position={[0, 0.61, 0.54]} args={[2.08, 0.64, 0.045]} color="#c49a70" />
            <Text position={[0, 0.7, 0.58]} fontSize={0.17} color={ink} fontWeight={900} anchorX="center">GUEST BOOK</Text>
            <Text position={[0, 0.46, 0.58]} fontSize={0.08} color={ink} anchorX="center">LEAVE A LITTLE FOOTPRINT</Text>
            <Book hovered={bookHovered && !mode} />
        </group>

        <PottedTree />
        <Block position={[0, 0.65, 2.85]} args={[1, 1.3, 0.12]} color="#b59d87" onClick={onBack} />

        <Html fullscreen zIndexRange={[1000, 1000]} style={{ pointerEvents: 'none' }}>
            <button type="button" className="sr-only focus:not-sr-only focus:fixed focus:bottom-6 focus:left-6 focus:rounded-lg focus:bg-[#fffaf0] focus:p-3 focus:text-[#735344] focus:pointer-events-auto" onClick={() => open('mail')}>편지 쓰기</button>
            <button type="button" className="sr-only focus:not-sr-only focus:fixed focus:bottom-6 focus:right-6 focus:rounded-lg focus:bg-[#fffaf0] focus:p-3 focus:text-[#735344] focus:pointer-events-auto" onClick={() => open('guestbook')}>방명록 남기기</button>
            {mode && <Suspense fallback={<div role="status" className="pointer-events-none fixed inset-0 grid place-items-center bg-[#fffaf0]/90 text-[#735344]">편지지를 꺼내오는 중...</div>}><ContactPanel mode={mode} onClose={() => setMode(null)} /></Suspense>}
        </Html>
    </group>;
}
