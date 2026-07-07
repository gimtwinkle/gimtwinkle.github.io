'use client';

import { RoundedBox } from '@react-three/drei';
import { C } from './colors';

export default function CuteRoomShell() {
	return (
		<group>
			<RoundedBox
				args={[7.6, 0.2, 5.4]}
				radius={0.25}
				smoothness={14}
				position={[0, -0.1, 0]}
				receiveShadow
			>
				<meshStandardMaterial color={C.floor} roughness={0.6} />
			</RoundedBox>

			<RoundedBox
				args={[7.6, 3.1, 0.24]}
				radius={0.22}
				smoothness={14}
				position={[0, 1.45, -3.05]}
				receiveShadow
			>
				<meshStandardMaterial color={C.wall} roughness={0.55} />
			</RoundedBox>

			<RoundedBox
				radius={0.22}
				smoothness={14}
				position={[-3.82, 1.45, -0.35]}
				receiveShadow
			>
				<meshStandardMaterial color={C.wall} roughness={0.55} />
			</RoundedBox>

			<RoundedBox
				args={[0.24, 1.25, 5.4]}
				radius={0.22}
				smoothness={14}
				position={[3.82, 0.55, -0.35]}
			>
				<meshStandardMaterial color={C.pink} roughness={0.5} />
			</RoundedBox>

			<RoundedBox
				args={[7.85, 0.2, 0.2]}
				radius={0.1}
				position={[0, 3.05, -2.95]}
			>
				<meshStandardMaterial color={C.pink} />
			</RoundedBox>

			<RoundedBox
				args={[0.2, 0.2, 5.6]}
				radius={0.1}
				position={[-3.85, 3.05, -0.35]}
			>
				<meshStandardMaterial color={C.pink} />
			</RoundedBox>

			{/* front low wall */}
			<RoundedBox
				args={[4.4, 0.7, 0.22]}
				radius={0.14}
				position={[-1.3, 0.28, 2.45]}
			>
				<meshStandardMaterial color={C.cream} />
			</RoundedBox>
		</group>
	);
}
