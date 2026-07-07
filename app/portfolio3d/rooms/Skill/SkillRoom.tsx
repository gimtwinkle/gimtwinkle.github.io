'use client';

import CuteRoomShell from './CuteRoomShell';
import BookShelf from './BookShelf';
import MainDesk from './MainDesk';
import CraftTable from './CraftTable';
import WorkshopMachine from './WorkShopMachine';
import RoundedBox from '../../components/RoundedBox';
import {
	BackDoor,
	PegBoard,
	PlanBoard,
	Window,
	WorkshopSign,
} from './WallObjects';
import { C } from './colors';
import { DrawerSet, Plant, Star, TinyBox } from './CuteDecor';

type Props = {
	onBack?: () => void;
};

function SideShelf() {
	return (
		<group position={[1.75, 0.62, -2.62]}>
			<RoundedBox
				args={[1.15, 1.1, 0.38]}
				radius={0.1}
				smoothness={10}
				castShadow
			>
				<meshStandardMaterial color={C.wood} />
			</RoundedBox>

			{Array.from({ length: 6 }).map((_, i) => (
				<TinyBox
					key={i}
					position={[
						-0.36 + (i % 3) * 0.36,
						0.25 - Math.floor(i / 3) * 0.36,
						0.24,
					]}
					color={[C.mint, C.lavender, C.pink, C.sky][i % 4]}
				/>
			))}

			<Plant position={[0.42, 0.58, 0.28]} scale={0.75} />
			<Star position={[0.2, 0.78, 0.3]} scale={0.46} />
		</group>
	);
}

function Chair() {
	return (
		<group position={[0, 0.35, 0.35]}>
			<RoundedBox args={[0.55, 0.18, 0.5]} radius={0.12} castShadow>
				<meshStandardMaterial color={C.pink} />
			</RoundedBox>

			<RoundedBox
				args={[0.55, 0.58, 0.16]}
				radius={0.12}
				position={[0, 0.35, 0.22]}
				castShadow
			>
				<meshStandardMaterial color={C.pink} />
			</RoundedBox>

			<mesh position={[0, -0.22, 0]}>
				<cylinderGeometry args={[0.045, 0.045, 0.45, 16]} />
				<meshStandardMaterial color="#bab3aa" />
			</mesh>

			{[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((r) => (
				<mesh
					key={r}
					rotation={[0, r, 0]}
					position={[Math.cos(r) * 0.2, -0.45, Math.sin(r) * 0.2]}
				>
					<boxGeometry args={[0.32, 0.035, 0.035]} />
					<meshStandardMaterial color="#bab3aa" />
				</mesh>
			))}

			<Star position={[0, 0.38, 0.32]} scale={0.42} />
		</group>
	);
}

function FrontGarden() {
	return (
		<group position={[0.4, 0.08, 2.35]}>
			{[-0.55, -0.3, -0.05, 0.2, 0.45].map((x, i) => (
				<mesh key={i} position={[x, 0.16 + (i % 2) * 0.06, 0]}>
					<sphereGeometry args={[0.22, 20, 20]} />
					<meshStandardMaterial color={C.green} />
				</mesh>
			))}

			{[-0.42, -0.08, 0.3].map((x, i) => (
				<Star key={i} position={[x, 0.36, 0.22]} scale={0.22} />
			))}
		</group>
	);
}

function LowFrontShelf() {
	return (
		<group position={[-1.8, 0.25, 2.25]}>
			<RoundedBox args={[1.45, 0.5, 0.32]} radius={0.08} castShadow>
				<meshStandardMaterial color={C.wood} />
			</RoundedBox>

			{Array.from({ length: 5 }).map((_, i) => (
				<TinyBox
					key={i}
					position={[-0.55 + i * 0.28, 0.02, 0.22]}
					color={[C.pink, C.lavender, C.mint, C.yellow][i % 4]}
				/>
			))}
		</group>
	);
}

function MiniDeskUnderWindow() {
	return (
		<group position={[-1.7, 0.45, -2.45]}>
			<RoundedBox args={[1.15, 0.18, 0.48]} radius={0.08} castShadow>
				<meshStandardMaterial color={C.wood} />
			</RoundedBox>

			<RoundedBox
				args={[1.0, 0.38, 0.38]}
				radius={0.08}
				position={[0, -0.28, 0]}
				castShadow
			>
				<meshStandardMaterial color={C.wood} />
			</RoundedBox>

			<RoundedBox
				args={[0.3, 0.16, 0.05]}
				radius={0.03}
				position={[-0.32, -0.18, 0.25]}
			>
				<meshStandardMaterial color={C.pink} />
			</RoundedBox>

			<RoundedBox
				args={[0.3, 0.16, 0.05]}
				radius={0.03}
				position={[0.05, -0.18, 0.25]}
			>
				<meshStandardMaterial color={C.mint} />
			</RoundedBox>

			<RoundedBox
				args={[0.42, 0.28, 0.04]}
				radius={0.04}
				position={[-0.25, 0.24, 0.05]}
			>
				<meshStandardMaterial color={C.white} />
			</RoundedBox>

			<RoundedBox
				args={[0.32, 0.2, 0.035]}
				radius={0.03}
				position={[-0.25, 0.25, 0.09]}
			>
				<meshStandardMaterial color={C.pink} />
			</RoundedBox>

			<Plant position={[0.38, 0.02, 0.1]} scale={0.62} />
		</group>
	);
}

export default function WorkshopRoom({ onBack }: Props) {
	return (
		<group>
			<ambientLight intensity={0.72} />
			<directionalLight position={[2.8, 5.2, 3.2]} intensity={1.2} castShadow />
			<pointLight
				position={[-2.8, 2.4, -2.2]}
				intensity={0.9}
				color="#fff0b5"
				distance={4}
			/>
			<pointLight
				position={[2.5, 2.1, -1.4]}
				intensity={0.65}
				color="#ffd4ea"
				distance={3.5}
			/>

			<CuteRoomShell />

			<WorkshopSign />
			<Window />
			<PegBoard />
			<PlanBoard />
			<BackDoor onBack={onBack} />

			<BookShelf />
			<MiniDeskUnderWindow />

			<MainDesk />
			<Chair />

			<CraftTable />
			<WorkshopMachine />
			<SideShelf />

			<DrawerSet position={[2.1, 0.42, -2.2]} />

			<LowFrontShelf />
			<FrontGarden />

			{/* main rug */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -0.35]}>
				<circleGeometry args={[1.48, 56]} />
				<meshStandardMaterial color={C.cream} roughness={0.6} />
			</mesh>

			{/* plants */}
			<Plant position={[-3.3, 0.02, 1.45]} />
			<Plant position={[-1.35, 0.02, -2.25]} scale={0.75} />
			<Plant position={[2.1, 0.02, -1.15]} scale={0.8} />

			{/* floor cute boxes */}
			{Array.from({ length: 4 }).map((_, i) => (
				<TinyBox
					key={i}
					position={[-0.9 + i * 0.38, 0.12, 1.95]}
					color={[C.pink, C.lavender, C.mint, C.yellow][i]}
				/>
			))}

			{/* left star stand */}
			<group position={[-3.3, 0.32, 1.95]}>
				<RoundedBox args={[0.42, 0.52, 0.42]} radius={0.08} castShadow>
					<meshStandardMaterial color={C.lavender} />
				</RoundedBox>
				<Star position={[0, 0.45, 0.03]} scale={0.75} />
			</group>
		</group>
	);
}
