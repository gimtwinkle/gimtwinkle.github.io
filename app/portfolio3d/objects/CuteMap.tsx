'use client';

import CuteHouse from './CuteHouse';
import CuteTree from './CuteTree';
import CuteFlower from './CuteFlower';
import CuteSign from './CuteSign';
import CuteBush from './CuteBush';
import CuteMushroom from './CuteMushroom';
import CuteLamp from './CuteLamp';
import CuteBench from './CuteBench';
import { RoomName } from '../types';
import SkillHouseFrontSet from '../rooms/Skill/BookShelf';

type Props = {
	isNight: boolean;
	onEnterRoom: (room: RoomName) => void;
};

const treePositions = [
	[-8.6, -3.8, 0.85],
	[-8.2, -1.8, 1],
	[-8.7, 0.2, 0.75],
	[-8.1, 2.1, 1.1],
	[-8.5, 4.0, 0.9],
	[-7.8, 5.8, 1.15],
	[-8.2, 7.3, 0.8],

	[8.6, -3.8, 0.85],
	[8.2, -1.8, 1],
	[8.7, 0.2, 0.75],
	[8.1, 2.1, 1.1],
	[8.5, 4.0, 0.9],
	[7.8, 5.8, 1.15],
	[8.2, 7.3, 0.8],

	[-6.8, -7.0, 0.9],
	[-5.7, -8.0, 1.15],
	[-4.5, -7.25, 0.8],
	[-3.3, -8.35, 1.05],
	[-2.1, -7.45, 0.75],
	[-1.0, -8.55, 1.2],
	[0.2, -7.7, 0.9],
	[1.3, -8.6, 1.1],
	[2.5, -7.5, 0.8],
	[3.7, -8.35, 1.05],
	[4.9, -7.3, 0.85],
	[6.0, -8.05, 1.1],
	[7.0, -7.0, 0.9],

	[-5.8, -6.3, 0.75],
	[-4.2, -6.6, 0.95],
	[-2.7, -6.25, 0.8],
	[-1.2, -6.75, 1.05],
	[0.4, -6.35, 0.85],
	[1.9, -6.8, 1],
	[3.4, -6.25, 0.75],
	[4.8, -6.7, 0.95],
	[6.2, -6.2, 0.8],
] as const;

const flowerClusters = [
	[-6.2, -5.9, 0.8],
	[-6.0, -5.6, 0.9],
	[-5.8, -6.1, 1],
	[-5.5, -5.8, 0.75],
	[-5.9, -5.3, 0.85],
	[-5.4, -6.2, 0.95],

	[6.2, -5.9, 0.8],
	[6.0, -5.6, 0.9],
	[5.8, -6.1, 1],
	[5.5, -5.8, 0.75],
	[5.9, -5.3, 0.85],
	[5.4, -6.2, 0.95],

	[-6.2, 5.9, 0.8],
	[-6.0, 5.6, 0.9],
	[-5.8, 6.1, 1],
	[-5.5, 5.8, 0.75],
	[-5.9, 5.3, 0.85],
	[-5.4, 6.2, 0.95],

	[6.2, 5.9, 0.8],
	[6.0, 5.6, 0.9],
	[5.8, 6.1, 1],
	[5.5, 5.8, 0.75],
	[5.9, 5.3, 0.85],
	[5.4, 6.2, 0.95],

	[-0.7, -6.5, 0.8],
	[-0.4, -6.2, 0.95],
	[-0.2, -6.7, 0.75],
	[0.2, -6.35, 1],
	[0.5, -6.6, 0.9],
	[0.8, -6.25, 0.8],

	[-0.7, 6.5, 0.8],
	[-0.4, 6.2, 0.95],
	[-0.2, 6.7, 0.75],
	[0.2, 6.35, 1],
	[0.5, 6.6, 0.9],
	[0.8, 6.25, 0.8],
] as const;

const singleFlowers = [
	[-8.2, -2.8, 0.72],
	[-7.4, 1.6, 0.9],
	[-6.8, 3.8, 0.8],
	[8.1, -2.2, 0.75],
	[7.3, 1.2, 0.88],
	[6.9, 3.6, 0.78],
	[-3.6, -7.5, 0.82],
	[-2.2, -7.8, 0.72],
	[2.1, -7.6, 0.9],
	[3.9, -7.2, 0.75],
	[-3.8, 7.7, 0.82],
	[-1.7, 8.1, 0.72],
	[2.2, 7.8, 0.9],
	[4.3, 7.5, 0.78],
	[-2.9, -2.8, 0.75],
	[3.2, -3.1, 0.85],
	[-3.4, 2.8, 0.72],
	[3.5, 2.9, 0.88],
] as const;

const bushPositions = [
	[-3.3, -5.7],
	[-6.2, -3.4],
	[3.3, -5.7],
	[6.2, -3.4],
	[3.3, 5.7],
	[6.2, 3.4],
	[-8.2, -6.2],
	[8.2, -6.2],
	[-8.2, 6.2],
	[8.2, 6.2],
] as const;

const mushroomPositions = [
	[-7.2, -4.4],
	[-6.4, 4.1],
	[7.2, -4.4],
	[6.4, 4.1],
	[-3.6, 7.3],
	[3.6, 7.3],
	[-3.6, -7.3],
	[3.6, -7.3],
] as const;

function SquareStage({ isNight }: { isNight: boolean }) {
	return (
		<group>
			<mesh receiveShadow position={[0, -0.35, 0]} castShadow>
				<boxGeometry args={[21, 0.5, 21]} />
				<meshStandardMaterial color={isNight ? '#2d1b12' : '#6b4328'} />
			</mesh>

			<mesh receiveShadow position={[0, -0.08, 0]}>
				<boxGeometry args={[20.4, 0.08, 20.4]} />
				<meshPhysicalMaterial
					color={isNight ? '#1a4627' : '#53bf39'}
					roughness={isNight ? 0.38 : 0.18}
					clearcoat={isNight ? 0.08 : 0.55}
				/>
			</mesh>

			<mesh receiveShadow position={[0, -0.02, 0]}>
				<boxGeometry args={[18.8, 0.06, 18.8]} />
				<meshPhysicalMaterial
					color={isNight ? '#2a4b35' : '#6ecc52'}
					roughness={isNight ? 0.36 : 0.16}
					clearcoat={isNight ? 0.08 : 0.55}
				/>
			</mesh>

			<mesh receiveShadow position={[0, 0.03, 0]}>
				<boxGeometry args={[8.5, 0.05, 8.5]} />
				<meshPhysicalMaterial
					color={isNight ? '#655033' : '#d8b166'}
					roughness={isNight ? 0.34 : 0.18}
					clearcoat={isNight ? 0.08 : 0.5}
				/>
			</mesh>

			{[
				[0, -4.35, 8.8, 0.28],
				[0, 4.35, 8.8, 0.28],
				[-4.35, 0, 0.28, 8.8],
				[4.35, 0, 0.28, 8.8],
			].map(([x, z, w, h], i) => (
				<mesh key={i} receiveShadow position={[x, 0.065, z]}>
					<boxGeometry args={[w, 0.04, h]} />
					<meshPhysicalMaterial
						color={isNight ? '#7d623a' : '#d8ca8d'}
						roughness={isNight ? 0.34 : 0.16}
						clearcoat={isNight ? 0.08 : 0.55}
					/>
				</mesh>
			))}

			{[
				[0, -4.8, 1.45, 3.8],
				[0, 4.8, 1.45, 3.8],
				[-4.8, 0, 3.8, 1.45],
				[4.8, 0, 3.8, 1.45],
			].map(([x, z, w, h], i) => (
				<mesh key={`path-${i}`} receiveShadow position={[x, 0.08, z]}>
					<boxGeometry args={[w, 0.045, h]} />
					<meshPhysicalMaterial
						color={isNight ? '#735633' : '#d6bd86'}
						roughness={isNight ? 0.34 : 0.16}
						clearcoat={isNight ? 0.08 : 0.5}
					/>
				</mesh>
			))}

			{[
				[0.08, 2.0, 0.36, 0.24, 0.15],
				[-0.12, 2.65, 0.3, 0.22, -0.2],
				[0.1, 3.3, 0.34, 0.25, 0.35],
				[-0.1, -2.0, 0.34, 0.24, -0.1],
				[0.13, -2.65, 0.3, 0.22, 0.25],
				[-0.08, -3.3, 0.36, 0.25, -0.3],
				[2.0, 0.1, 0.35, 0.23, 0.45],
				[2.65, -0.12, 0.3, 0.22, -0.15],
				[3.3, 0.09, 0.36, 0.24, 0.25],
				[-2.0, -0.08, 0.35, 0.23, -0.4],
				[-2.65, 0.12, 0.3, 0.22, 0.15],
				[-3.3, -0.1, 0.36, 0.24, -0.25],
			].map(([x, z, sx, sz, r], i) => (
				<mesh
					key={`stone-${i}`}
					position={[x, 0.13, z]}
					rotation={[0, r, 0]}
					scale={[sx, 1, sz]}
					receiveShadow
					castShadow
				>
					<cylinderGeometry args={[1, 1, 0.045, 18]} />
					<meshPhysicalMaterial
						color={
							isNight
								? i % 3 === 0
									? '#8a7658'
									: i % 3 === 1
										? '#78664d'
										: '#9c8765'
								: i % 3 === 0
									? '#ead9bd'
									: i % 3 === 1
										? '#d7c4a4'
										: '#f0dfc3'
						}
						roughness={0.48}
						clearcoat={isNight ? 0.04 : 0.18}
					/>
				</mesh>
			))}
		</group>
	);
}

export default function CuteMap({ isNight, onEnterRoom }: Props) {
	const mushroomScales = ['small', 'medium', 'large'] as const;

	const flowerColor = (i: number) =>
		i % 5 === 0
			? '#ff4fa3'
			: i % 5 === 1
				? '#a855f7'
				: i % 5 === 2
					? '#38bdf8'
					: i % 5 === 3
						? '#fb7185'
						: '#facc15';

	return (
		<group>
			<SquareStage isNight={isNight} />

			<CuteHouse
				label="About"
				targetId="about"
				position={[-5.8, 0, -5.35]}
				rotation={[0, 0.5, 0]}
				color="#ffd1b8"
				roofColor="#ff5ca8"
				onEnterRoom={onEnterRoom}
			/>

			<CuteHouse
				label="Work"
				targetId="work"
				position={[5.8, 0, -5.35]}
				rotation={[0, -0.5, 0]}
				color="#bdefff"
				roofColor="#4da3ff"
				onEnterRoom={onEnterRoom}
			/>

			<CuteHouse
				label="Skills"
				targetId="skills"
				position={[-4, 0, 3]}
				rotation={[0, 0.5, 0]}
				color="#fff176"
				roofColor="#ffb703"
				onEnterRoom={onEnterRoom}
			/>

			<CuteLamp position={[-1.3, 0, 2.5]} />
			<CuteHouse
				label="Contact"
				targetId="contact"
				position={[5, 0, 3]}
				rotation={[0, -0.5, 0]}
				color="#f5d0fe"
				roofColor="#a855f7"
				onEnterRoom={onEnterRoom}
			/>

			<CuteSign
				text={
					isNight ? `Good Night!\nTwinkle Village` : `Welcome!\nTwinkle Village`
				}
				position={[0, 0, -4]}
			/>

			<CuteLamp position={[-3.3, 0, -2.9]} />
			<CuteLamp position={[3.3, 0, -2.9]} />
			<CuteLamp position={[-3.3, 0, 2.9]} />
			<CuteLamp position={[3.3, 0, 2.9]} />

			<CuteBench position={[-2.4, 0, -3.7]} rotation={[0, 0.35, 0]} />
			<CuteBench position={[2.4, 0, 3.7]} rotation={[0, -2.8, 0]} />

			{treePositions.map(([x, z, scale], i) => (
				<CuteTree key={i} position={[x, 0, z]} scale={scale} />
			))}

			{bushPositions.map(([x, z], i) => (
				<CuteBush
					key={i}
					position={[x, 0, z]}
					scale={i % 3 === 0 ? 1.15 : 0.9}
				/>
			))}

			{mushroomPositions.map(([x, z], i) => (
				<CuteMushroom
					key={i}
					position={[x, 0, z]}
					type={i % 2 === 0 ? 'red' : 'choco'}
					scale={mushroomScales[i % 3]}
				/>
			))}

			{flowerClusters.map(([x, z, scale], i) => (
				<CuteFlower
					key={i}
					position={[x, 0, z]}
					scale={scale}
					color={flowerColor(i)}
				/>
			))}

			{singleFlowers.map(([x, z, scale], i) => (
				<CuteFlower
					key={`single-${i}`}
					position={[x, 0, z]}
					scale={scale}
					color={flowerColor(i + 2)}
				/>
			))}
		</group>
	);
}
