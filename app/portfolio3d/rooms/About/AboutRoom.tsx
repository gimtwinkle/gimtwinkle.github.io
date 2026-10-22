'use client';

import { Bvh, Html, Text } from '@react-three/drei';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import useMobile from '../../useMobile';
import RoundedBox from '../../components/RoundedBox';
import AboutObjects from './AboutObjects';
import Neon3DText from '../../objects/Neon3DText';
import CeilingFan from '../../objects/CeilingFan';

type AboutRoomProps = {
	onBack?: () => void;
};

type FurnitureSpeechBubbleProps = {
    active: boolean;
	label: string;
	position: [number, number, number];
};

// This component runs inside Html's DOM renderer, so its portal can target the body.
function MobileFurnitureSpeech({ label }: { label: string }) {
    return createPortal(
        <aside role="status" className="pointer-events-none fixed bottom-[calc(156px+env(safe-area-inset-bottom))] left-4 right-4 z-[10000] rounded-2xl border-[3px] border-[#735344] bg-[#fffaf0] px-5 py-4 text-center text-sm font-bold leading-relaxed text-[#543a2b] shadow-[4px_4px_0_#735344]">
            {label}
        </aside>, document.body,
    );
}

function FurnitureSpeechBubble({
    active,
	label,
	position,
}: FurnitureSpeechBubbleProps) {
	const mobile = useMobile();
	if (!active) return null;
	if (mobile) return <Html><MobileFurnitureSpeech label={label} /></Html>;

	return (
		<Html
			center
			position={position}
            zIndexRange={[100, 100]}
            style={{ pointerEvents: 'none' }}
		>
			<div role="tooltip" className="pointer-events-none w-max max-w-[min(260px,calc(100vw-32px))] whitespace-normal break-keep rounded-[1rem] border-[3px] border-black bg-white/95 px-4 py-3 text-center text-[13px] font-bold leading-relaxed text-[#2f1d3a] shadow-[4px_4px_0_#000]">
				{label}
			</div>
		</Html>
	);
}

export default function AboutRoom({ onBack }: AboutRoomProps) {
    const mobile = useMobile();
    const [hoveredObject, setHoveredObject] = useState<string | null>(null);
    const selectObject = (name: string) => setHoveredObject((current) => current === name ? null : name);
	return (
		<group>
			{/* 바닥 */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[4.6, 3.6]} />
				<meshStandardMaterial color="#fff1c7" roughness={0.55} />
			</mesh>

			{/* 뒤 벽 */}
			<mesh position={[0, 1.25, -1.8]} receiveShadow>
				<boxGeometry args={[4.6, 2.5, 0.14]} />
				<meshStandardMaterial color="#ffd6e8" roughness={0.5} />
			</mesh>

			{/* 왼쪽 벽 */}
			<mesh
				position={[-2.3, 1.25, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[3.6, 2.5, 0.14]} />
				<meshStandardMaterial color="#dbeafe" roughness={0.5} />
			</mesh>

			{/* 오른쪽 벽 */}
			<mesh
				position={[2.3, 1.25, 0]}
				rotation={[0, Math.PI / 2, 0]}
				receiveShadow
			>
				<boxGeometry args={[3.6, 2.5, 0.14]} />
				<meshStandardMaterial color="#e9d5ff" roughness={0.5} />
			</mesh>

			{/* 천장 */}
			<mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<planeGeometry args={[4.6, 3.6]} />
				<meshStandardMaterial color="#fff7ed" roughness={0.6} />
			</mesh>

			{/* 나가는 문 */}
			<RoundedBox
				position={[0, 0.72, 1.74]}
				args={[0.82, 1.42, 0.16]}
				radius={0.16}
				smoothness={10}
				onClick={onBack}
			>
				<meshStandardMaterial color="#ffcf5a" roughness={0.35} />
			</RoundedBox>
			<Neon3DText
				text={`About\ntwinkle`}
				position={[-2, 2.05, -0.5]}
				rotation={[0, Math.PI / 2, 0]}
				scale={0.5}
			/>
			<Text
				position={[0, 1.66, 1.62]}
				rotation={[0, Math.PI, 0]}
				fontSize={0.14}
				color="#6b3f1d"
				anchorX="center"
				anchorY="middle"
			>
				EXIT
			</Text>
            <group
                onPointerOver={(event) => { if (!mobile) { event.stopPropagation(); setHoveredObject('ceilingfan'); } }}
                onPointerOut={() => { if (!mobile) setHoveredObject(null); }}
                onClick={(event) => { if (mobile && event.delta <= 5) { event.stopPropagation(); selectObject('ceilingfan'); } }}>
			    <CeilingFan position={[0, 2.3, 0]} scale={[0.5, 0.5, 0.5]} />
            </group>

			{/* 조명 */}
			<ambientLight intensity={1} />
			<directionalLight position={[2, 4, 3]} intensity={1.25} castShadow />
			<pointLight position={[0, 2.15, 0]} intensity={1.3} color="#fff6d6" />

			<FurnitureSpeechBubble active={hoveredObject === 'bed'} position={[-1.5, 0.72, -1]} label="체크무늬 광적으로 좋아함." />
			<FurnitureSpeechBubble active={hoveredObject === 'bedside'} position={[-0.55, 0.72, -1.7]} label="잠들기 전, 나만의 작은 루틴으로 하루를 마무리해요." />
			<FurnitureSpeechBubble active={hoveredObject === 'desk'} position={[1.15, 0.72, -1]} label="새로운 거 만들어보기를 좋아해요! 지금 이런 거!" />
			<FurnitureSpeechBubble active={hoveredObject === 'beanbag'}
				position={[0.9, 0.72, 0.35]}
				label="휴식과 집중은 비례한다!"
			/>
			<FurnitureSpeechBubble active={hoveredObject === 'window'} position={[-1, 1.45, -1.5]} label="창밖을 보면, 다음 여행에서 만날 풍경이 궁금해져요." />
			<FurnitureSpeechBubble active={hoveredObject === 'board'} position={[1.15, 1.65, -1.23]} label="기록은 기억보다 힘이 세다!" />
			<FurnitureSpeechBubble active={hoveredObject === 'travel'} position={[-1.7, 1, 0.52]} label="프리다이빙과 여행을 좋아합니다!" />
			<FurnitureSpeechBubble active={hoveredObject === 'rowtable'} position={[0, 0.65, 0]} label="성공보다는 실패를 기록하는 편." />
			<FurnitureSpeechBubble active={hoveredObject === 'bookcase'} position={[2, 1.25, 0]} label="편독이 심한 편(소설책 안좋아함)" />
            <FurnitureSpeechBubble active={hoveredObject === 'robot'} position={[2, 1.8, 0]} label="마음이 따뜻한 휴머니스트 로봇 (ISTJ)" />
            <FurnitureSpeechBubble active={hoveredObject === 'ceilingfan'} position={[0, 2.15, 0]} label="실링팬만 보면 힐링됨(라임 아니고 진짜임..)" />

			{/* GLB 가구 */}
            <Bvh firstHitOnly strategy={0} indirect>
			    <AboutObjects onHover={setHoveredObject} onSelect={selectObject} />
            </Bvh>
		</group>
	);
}
