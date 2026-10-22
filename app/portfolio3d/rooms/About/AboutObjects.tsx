'use client';

import GlbModel from '../../objects/GlbModel';
import { aboutRoomObjects } from './aboutRoomObjects';
import useMobile from '../../useMobile';

export default function AboutObjects({ onHover, onSelect }: { onHover?: (name: string | null) => void; onSelect?: (name: string) => void }) {
    const mobile = useMobile();
	return (
		<group>
			{aboutRoomObjects.map((item) => (
				<group key={item.name}
                    onPointerOver={(event) => { if (!mobile) { event.stopPropagation(); onHover?.(item.name); } }}
                    onPointerOut={() => { if (!mobile) onHover?.(null); }}
                    onClick={(event) => { if (mobile && event.delta <= 5) { event.stopPropagation(); onSelect?.(item.name); } }}>
                <GlbModel
					url={item.url}
					position={item.position}
					rotation={item.rotation}
					scale={item.scale}
				/>
                </group>
			))}
		</group>
	);
}
