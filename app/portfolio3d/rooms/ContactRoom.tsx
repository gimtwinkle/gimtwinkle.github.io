'use client';

import { Html, Text } from '@react-three/drei';
import { lazy, Suspense, useEffect, useState, type ComponentProps } from 'react';
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

function Book() {
    return <group position={[0, 1.13, 0.08]} rotation={[-0.3, 0, 0]}>
        <Block args={[1.35, 0.06, 0.85]} color="#816792" />
        <Block args={[0.6, 0.04, 0.75]} position={[-0.32, 0.05, 0]} rotation={[0, 0, -0.03]} color="#fffaf0" radius={0.018} />
        <Block args={[0.6, 0.04, 0.75]} position={[0.32, 0.05, 0]} rotation={[0, 0, 0.03]} color="#fffaf0" radius={0.018} />
        {[-1, 1].flatMap((side) => [0, 1, 2, 3].map((line) => <mesh key={`${side}-${line}`} position={[side * 0.32, 0.076, -0.22 + line * 0.13]}>
            <boxGeometry args={[0.4, 0.003, 0.009]} /><meshStandardMaterial color="#d8c3aa" />
        </mesh>))}
        <mesh position={[0.75, 0.12, 0.05]} rotation={[0.15, 0, -0.5]}><cylinderGeometry args={[0.02, 0.02, 0.55, 8]} /><meshStandardMaterial color="#b58158" /></mesh>
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
        <Block position={[0, 2.58, -2.85]} args={[5.8, 1.02, 0.16]} color="#795c4c" radius={0.15} />
        <Block position={[0, 2.58, -2.73]} args={[5.55, 0.8, 0.08]} color="#fff2dc" radius={0.1} />
        <Text position={[0, 2.7, -2.65]} fontSize={0.27} color={ink} anchorX="center" anchorY="middle" fontWeight={900}>TWINKLE POST OFFICE</Text>
        <Text position={[0, 2.4, -2.65]} fontSize={0.095} color="#ad8071" anchorX="center" anchorY="middle" letterSpacing={0.12}>LETTERS, LITTLE HELLOS &amp; GOOD CONNECTIONS</Text>
        <Block position={[0, 3.32, -1.2]} args={[3.6, 0.12, 0.4]} color="#fff8db" />
        <mesh position={[0, 3.252, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.36, 0.32]} />
            <meshStandardMaterial color="#fff4ca" emissive="#ffdf94" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
        <pointLight position={[0, 3.05, -1.2]} color="#ffe1a8" intensity={4} distance={6} decay={2} />
        {[-1, 1].map((side) => <mesh key={side} position={[side * 1.4, 3.42, -1.2]}><cylinderGeometry args={[0.015, 0.015, 0.25, 8]} /><meshStandardMaterial color={ink} /></mesh>)}

        <group position={[-1.35, 0, -1.1]} {...interactive} onClick={(event) => { event.stopPropagation(); open('mail'); }}>
            <Block position={[0, 0.12, 0]} args={[1.35, 0.24, 1]} color="#ac6977" radius={0.08} />
            <Block position={[0, 0.46, 0]} args={[0.3, 0.65, 0.3]} color="#b57680" />
            <Block position={[0, 1.27, 0]} args={[1.24, 1.3, 0.85]} color="#cc8291" radius={0.22} />
            <Block position={[0, 1.74, 0]} args={[1.26, 0.34, 0.88]} color="#e5a2ac" radius={0.14} />
            <Block position={[0, 1.41, 0.44]} args={[0.88, 0.2, 0.06]} color="#fff2dc" radius={0.03} />
            <Block position={[0, 1.41, 0.48]} args={[0.72, 0.075, 0.02]} color="#65453f" radius={0.015} />
            <Envelope position={[0, 1.02, 0.46]} scale={0.37} color="#b57680" />
            <Text position={[0, 0.8, 0.46]} fontSize={0.075} color="#fff8e8" fontWeight={900} anchorX="center" anchorY="middle"
                onSync={(mesh) => {
                    mesh.geometry.computeBoundingBox();
                    const bounds = mesh.geometry.boundingBox;
                    if (bounds) mesh.scale.setScalar(Math.min(1, 0.86 / Math.max(0.001, bounds.max.x - bounds.min.x)));
                }}>SEND A LETTER</Text>
        </group>

        <group position={[1.45, 0, -1.2]} {...interactive} onClick={(event) => { event.stopPropagation(); open('guestbook'); }}>
            <Block position={[0, 0.52, 0]} args={[2.4, 1.04, 1.05]} color="#bfa58d" radius={0.08} />
            <Block position={[0, 1.06, 0]} args={[2.65, 0.12, 1.25]} color="#fff4de" />
            <Block position={[0, 0.61, 0.54]} args={[2.08, 0.64, 0.045]} color="#ede0ca" />
            <Text position={[0, 0.7, 0.58]} fontSize={0.17} color={ink} fontWeight={900} anchorX="center">GUEST BOOK</Text>
            <Text position={[0, 0.46, 0.58]} fontSize={0.08} color="#a17f6b" anchorX="center">LEAVE A LITTLE FOOTPRINT</Text>
            <Book />
        </group>

        <group position={[-3.55, 1.76, -2.7]}><Envelope position={[0, 0, 0]} color="#b6bd9f" scale={0.7} /></group>
        <group position={[3.55, 1.76, -2.7]}><Envelope position={[0, 0, 0]} color="#c8b6d5" scale={0.7} /></group>
        <PottedTree />
        <Block position={[0, 0.65, 2.85]} args={[1, 1.3, 0.12]} color="#b59d87" onClick={onBack} />

        <Html fullscreen zIndexRange={[1000, 1000]} style={{ pointerEvents: 'none' }}>
            <button type="button" className="sr-only focus:not-sr-only focus:fixed focus:bottom-6 focus:left-6 focus:rounded-lg focus:bg-[#fffaf0] focus:p-3 focus:text-[#735344] focus:pointer-events-auto" onClick={() => open('mail')}>편지 쓰기</button>
            <button type="button" className="sr-only focus:not-sr-only focus:fixed focus:bottom-6 focus:right-6 focus:rounded-lg focus:bg-[#fffaf0] focus:p-3 focus:text-[#735344] focus:pointer-events-auto" onClick={() => open('guestbook')}>방명록 남기기</button>
            {mode && <Suspense fallback={<div role="status" className="pointer-events-none fixed inset-0 grid place-items-center bg-[#fffaf0]/90 text-[#735344]">편지지를 꺼내오는 중...</div>}><ContactPanel mode={mode} onClose={() => setMode(null)} /></Suspense>}
        </Html>
    </group>;
}
