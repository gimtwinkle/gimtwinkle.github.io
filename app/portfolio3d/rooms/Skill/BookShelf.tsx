'use client';

import { C } from './colors';
import { Plant, Star } from './CuteDecor';
import RoundedBox from '../../components/RoundedBox';

const bookColors = [C.pink, C.lavender, C.mint, C.sky, C.yellow, C.orange];

export default function BookShelf() {
	return (
		<group position={[-3.05, 0.95, -2.55]}>
			<RoundedBox
				args={[1.35, 2.05, 0.42]}
				radius={0.13}
				smoothness={12}
				castShadow
			>
				<meshStandardMaterial color={C.wood} roughness={0.5} />
			</RoundedBox>

			{[0.52, -0.1, -0.72].map((y, row) => (
				<group key={row} position={[0, y, 0.24]}>
					<RoundedBox args={[1.18, 0.07, 0.1]} radius={0.02}>
						<meshStandardMaterial color={C.woodDeep} />
					</RoundedBox>

					{Array.from({ length: 7 }).map((_, i) => (
						<RoundedBox
							key={i}
							args={[0.12, 0.42 + ((i + row) % 2) * 0.1, 0.15]}
							radius={0.025}
							position={[-0.48 + i * 0.16, 0.25, 0.08]}
							castShadow
						>
							<meshStandardMaterial
								color={bookColors[(i + row) % bookColors.length]}
							/>
						</RoundedBox>
					))}
				</group>
			))}

			{/* ladder */}
			<group position={[0.15, -0.45, 0.38]} rotation={[0, 0, -0.25]}>
				{[-0.18, 0.18].map((x) => (
					<mesh key={x} position={[x, 0, 0]}>
						<boxGeometry args={[0.06, 1.45, 0.06]} />
						<meshStandardMaterial color={C.woodDeep} />
					</mesh>
				))}

				{[-0.45, -0.15, 0.15, 0.45].map((y) => (
					<mesh key={y} position={[0, y, 0]}>
						<boxGeometry args={[0.46, 0.05, 0.06]} />
						<meshStandardMaterial color={C.woodDeep} />
					</mesh>
				))}
			</group>

			<Star position={[-0.48, 1.2, 0.32]} scale={0.9} />
			<Plant position={[0.42, 1.05, 0.28]} scale={0.75} />
		</group>
	);
}
