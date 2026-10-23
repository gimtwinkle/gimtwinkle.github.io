'use client';

import RoundedBox from '../components/RoundedBox';
import { Center, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { MathUtils, type Group } from 'three';

type Props = {
	position: [number, number, number];
	scale?: number;
	rotation?: [number, number, number];
};

const keyRows = [
	{
		z: -0.22,
		keys: ['ESC', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O'],
		offset: 0,
	},
	{
		z: -0.06,
		keys: ['TAB', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'],
		offset: 0.06,
	},
	{
		z: 0.1,
		keys: ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
		offset: 0.12,
	},
	{
		z: 0.26,
		keys: ['CTRL', 'ALT', 'SPACE', 'FN'],
		offset: 0.18,
	},
];

function KeyCap({ position, width = 0.13, color = '#e0f2fe', label, register }: {
    position: [number, number, number]; width?: number; color?: string; label: string;
    register: (group: Group | null) => void;
}) {
    return <group position={position}>
        <mesh position={[0, -0.012, 0]} castShadow>
            <boxGeometry args={[width, 0.045, 0.115]} />
            <meshStandardMaterial color="#9e9e9e" />
        </mesh>
        <group ref={register} position={[0, 0.02, 0]} name={`key-${label}`}>
            <RoundedBox args={[width * 0.78, 0.055, 0.082]} radius={0.014} creaseAngle={0.8} castShadow>
                <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.6} />
            </RoundedBox>
            <group position={[0, 0.03, -0.006]} rotation={[-Math.PI / 2, 0, 0]}>
                <Center>
                    <Text3D font="/fonts/helvetiker_bold.typeface.json" size={label.length > 2 ? 0.016 : 0.03} height={0.001} curveSegments={3}>
                        {label}
                        <meshStandardMaterial color="#586171" roughness={0.85} />
                    </Text3D>
                </Center>
            </group>
            {['F', 'J'].includes(label) && <mesh position={[0, 0.03, 0.023]}>
                <boxGeometry args={[0.022, 0.003, 0.003]} /><meshStandardMaterial color="#8b95a4" />
            </mesh>}
        </group>
    </group>;
}

export default function CuteKeyboard({
	position,
	scale = 1,
	rotation = [0, 0, 0],
}: Props) {
    const keyRefs = useRef<Record<string, Group | null>>({});
    const typing = useRef({ elapsed: 0, reduced: true });
    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => { typing.current.reduced = preference.matches; };
        update();
        preference.addEventListener('change', update);
        return () => preference.removeEventListener('change', update);
    }, []);
    useFrame((_, frameDelta) => {
        const state = typing.current;
        state.elapsed += Math.min(frameDelta, 0.05);
        const time = state.elapsed % 4.6;
        const sequence = ['J', 'S', 'K', 'D', 'L', 'A', 'SPACE', 'W', 'E', 'R', 'SPACE', 'H'];
        const step = Math.floor(time / 0.24);
        const local = time - step * 0.24;
        const active = !state.reduced && step < sequence.length ? sequence[step] : null;
        const amount = local < 0.045 ? MathUtils.smootherstep(local, 0, 0.045)
            : local < 0.095 ? 1 : 1 - MathUtils.smootherstep(local, 0.095, 0.215);
        Object.entries(keyRefs.current).forEach(([label, key]) => {
            if (!key) return;
            const pressed = label === active ? amount : 0;
            key.position.y = 0.02 - pressed * 0.034;
            key.rotation.x = pressed * 0.055;
        });
    });

	return (
		<group position={position} scale={scale} rotation={rotation}>
			{/* 키보드 하판 */}
			<mesh position={[0, 0, 0]} castShadow>
				<RoundedBox
					args={[1.92, 0.15, 0.94]}
					radius={0.08}
					smoothness={10}
					castShadow
				>
					<meshPhysicalMaterial
						color="#fbfdff"
						roughness={0.28}
						clearcoat={1}
						clearcoatRoughness={0.05}
					/>
				</RoundedBox>
				<meshPhysicalMaterial
					color="#f8fafc"
					roughness={0.24}
					clearcoat={0.65}
				/>
			</mesh>

			{/* 아래 진한 테두리 */}
			<mesh position={[0, -0.055, 0.02]} castShadow>
				<RoundedBox
					position={[0, -0.05, 0]}
					args={[1.9, 0.06, 0.94]}
					radius={0.05}
					smoothness={8}
				>
					<meshStandardMaterial color="#9e9e9e" />
				</RoundedBox>
				<meshStandardMaterial color="#b6b6b6" />
			</mesh>

			{/* 키캡들 */}
			{keyRows.map((row, rowIndex) => {
				let cursor = -0.75 + row.offset;

				return row.keys.map((key, i) => {
					const isSpace = key === 'SPACE';
					const isWide = key === 'SHIFT' || key === 'TAB';
					const width = isSpace ? 0.42 : isWide ? 0.22 : 0.13;

					const pointColor =
						key === 'ESC'
							? '#fb7185'
							: key === 'SPACE'
								? '#c7d2fe'
								: ['W', 'A', 'S', 'D'].includes(key)
									? '#fde68a'
									: rowIndex % 2 === 0
										? '#e0f2fe'
										: '#f8fafc';

					const x = cursor + width / 2;
					cursor += width + 0.02;

					return (
						<KeyCap
							key={`${rowIndex}-${key}-${i}`}
							position={[x, 0.1, row.z]}
							width={width}
							color={pointColor}
                            label={key}
                            register={(node) => { keyRefs.current[key] = node; }}
						/>
					);
				});
			})}

			{/* 오른쪽 포인트 키 */}
			<mesh position={[0.73, 0.105, 0.24]} castShadow>
				<boxGeometry args={[0.16, 0.055, 0.12]} />
				<meshPhysicalMaterial
					color="#86efac"
					roughness={0.18}
					clearcoat={0.85}
				/>
			</mesh>

			{/* 작은 케이블 */}
			<mesh position={[0, 0.03, -0.51]} castShadow>
				<boxGeometry args={[0.08, 0.035, 0.22]} />
				<meshStandardMaterial color="#9e9e9e" />
			</mesh>
		</group>
	);
}
