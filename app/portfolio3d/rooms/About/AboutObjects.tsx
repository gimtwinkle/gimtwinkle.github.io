'use client';

import GlbModel from '../../objects/GlbModel';
import { aboutRoomObjects } from './aboutRoomObjects';

export default function AboutObjects() {
	return (
		<group>
			{aboutRoomObjects.map((item) => (
				<GlbModel
					key={item.name}
					url={item.url}
					position={item.position}
					rotation={item.rotation}
					scale={item.scale}
				/>
			))}
		</group>
	);
}
