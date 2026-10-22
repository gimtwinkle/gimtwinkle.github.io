'use client';

import GlbModel from '../../objects/GlbModel';
import { aboutRoomObjects } from './aboutRoomObjects';

export default function AboutObjects({ onHover }: { onHover?: (name: string | null) => void }) {
	return (
		<group>
			{aboutRoomObjects.map((item) => (
				<group key={item.name}
                    onPointerOver={(event) => { event.stopPropagation(); onHover?.(item.name); }}
                    onPointerOut={() => onHover?.(null)}>
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
