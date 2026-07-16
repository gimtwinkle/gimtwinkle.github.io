'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';

import Character from './objects/Character';
import CuteCloud from './objects/CuteCloud';
import CuteMap from './objects/CuteMap';

import AboutRoom from './rooms/About/AboutRoom';
import ContactRoom from './rooms/ContactRoom';
import SkillMediaArtRoom from './rooms/SkillRoom/MediaArtRoom';
import WorkRoom from './rooms/WorkRoom';

import RoomScene from './scene/RoomScene';

import { RoomName } from './types';

type SceneName = 'village' | RoomName;

const defaultRoomSceneConfig = {
	startPosition: [0, 1.35, 2.35] as [number, number, number],
	lookAt: [0, 1.35, -3] as [number, number, number],
	exitPosition: [0, 0, 3.15] as [number, number, number],
	bounds: {
		minX: -4.1,
		maxX: 4.1,
		minZ: -2.75,
		maxZ: 2.85,
	},
};

const aboutRoomSceneConfig = {
	startPosition: [0, 1.35, 1.05] as [number, number, number],
	lookAt: [0, 1.35, -1.25] as [number, number, number],
	exitPosition: [0, 0, 3.15] as [number, number, number],
	bounds: {
		minX: -2.05,
		maxX: 2.05,
		minZ: -1.58,
		maxZ: 1.58,
	},
};

function SeoulClockUI() {
	const [now, setNow] = useState<Date | null>(null);

	useEffect(() => {
		setNow(new Date());

		const timer = window.setInterval(() => {
			setNow(new Date());
		}, 1000);

		return () => {
			window.clearInterval(timer);
		};
	}, []);

	const { timeText, isNight } = useMemo(() => {
		if (!now) {
			return {
				timeText: '--:--',
				isNight: false,
			};
		}

		const hourText = new Intl.DateTimeFormat('en-US', {
			timeZone: 'Asia/Seoul',
			hour: 'numeric',
			hour12: false,
		}).format(now);

		const hour = Number(hourText);
		const night = hour < 6 || hour >= 19;

		const time = new Intl.DateTimeFormat('en-US', {
			timeZone: 'Asia/Seoul',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		}).format(now);

		return {
			timeText: time,
			isNight: night,
		};
	}, [now]);

	return (
		<div className="pointer-events-none fixed left-6 top-20 z-20 rounded-xl border-2 border-white/30 bg-black/45 px-4 py-3 text-sm font-bold text-white backdrop-blur-md">
			<span className="mr-2">{isNight ? 'Night' : 'Day'}</span>
			{timeText}
		</div>
	);
}

function VillageBackButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="absolute left-6 top-6 z-30 rounded-full border border-white/30 bg-black/40 px-5 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/60"
		>
			← VILLAGE
		</button>
	);
}

export default function PortfolioWorld() {
	const [scene, setScene] = useState<SceneName>('village');
	const [isFading, setIsFading] = useState(false);

	const goScene = (nextScene: SceneName) => {
		if (nextScene === scene || isFading) {
			return;
		}

		setIsFading(true);

		window.setTimeout(() => {
			setScene(nextScene);

			window.setTimeout(() => {
				setIsFading(false);
			}, 250);
		}, 350);
	};

	const goBackVillage = () => {
		goScene('village');
	};

	const canvasRoomScene =
		scene === 'about' ? (
			<AboutRoom onBack={goBackVillage} />
		) : scene === 'work' ? (
			<WorkRoom />
		) : scene === 'contact' ? (
			<ContactRoom onBack={goBackVillage} />
		) : null;

	const roomSceneProps =
		scene === 'about' ? aboutRoomSceneConfig : defaultRoomSceneConfig;

	return (
		<div className="relative h-full min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-200 via-pink-100 to-yellow-100">
			{/* ================================
			    마을
			================================ */}
			{scene === 'village' && (
				<Canvas
					shadows
					camera={{
						position: [0, 9, 12],
						fov: 45,
						near: 0.1,
						far: 100,
					}}
					gl={{
						antialias: true,
						alpha: false,
					}}
				>
					<color attach="background" args={['#bdefff']} />

					<ambientLight intensity={0.9} />

					<directionalLight
						position={[5, 10, 6]}
						intensity={2.4}
						castShadow
						shadow-mapSize={[2048, 2048]}
					/>

					<pointLight position={[-5, 4, 4]} intensity={1.2} color="#ff8bd1" />

					<pointLight position={[5, 4, -5]} intensity={1.2} color="#8be9ff" />

					<CuteCloud position={[-5, 6, -4]} />

					<CuteCloud position={[4, 7, -5]} scale={0.8} />

					<CuteCloud position={[0, 6.5, 4]} scale={0.7} />

					<CuteMap isNight={false} onEnterRoom={goScene} />

					<Character />

					<OrbitControls
						enableZoom={false}
						enablePan={false}
						maxPolarAngle={Math.PI / 2.4}
						minPolarAngle={Math.PI / 4}
					/>
				</Canvas>
			)}

			{/* ================================
			    About / Work / Contact
			================================ */}
			{canvasRoomScene && (
				<RoomScene
					key={`${scene}-room`}
					onBack={goBackVillage}
					{...roomSceneProps}
				>
					{canvasRoomScene}
				</RoomScene>
			)}

			{/* ================================
			    Skill 미디어아트룸
			================================ */}
			{scene === 'skills' && (
				<div className="absolute inset-0 z-10 bg-[#080e1d]">
					<div className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/20 bg-black/35 px-5 py-2 text-xs font-bold tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
						SCROLL OR USE ARROW KEYS
					</div>
					<Canvas
						shadows
						camera={{
							position: [0, 1.72, 5.8],
							fov: 52,
							near: 0.1,
							far: 100,
						}}
						gl={{
							antialias: true,
							alpha: false,
						}}
						onCreated={({ gl }) => {
							gl.setClearColor('#080e1d');
						}}
					>
						<color attach="background" args={['#080e1d']} />

						<SkillMediaArtRoom />
					</Canvas>

					<VillageBackButton onClick={goBackVillage} />
				</div>
			)}

			{/* ================================
			    화면 전환 페이드
			================================ */}
			<div
				className={[
					'pointer-events-none fixed inset-0 z-[9999] bg-white',
					'transition-opacity duration-300',
					isFading ? 'opacity-90' : 'opacity-0',
				].join(' ')}
			/>

			{/* ================================
			    마을 조작 안내
			================================ */}
			{scene === 'village' && (
				<div className="pointer-events-none fixed left-6 top-6 z-20 rounded-xl border-2 border-white/30 bg-black/45 px-4 py-3 text-sm font-bold text-white backdrop-blur-md">
					WASD / Arrow keys to move
				</div>
			)}

			{/* ================================
			    스킬룸 안내
			================================ */}
			{scene === 'skills' && (
				<div className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/20 bg-black/35 px-5 py-2 text-xs font-bold tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
					MOVE CLOSER TO EACH ARTWORK
				</div>
			)}

			<SeoulClockUI />
		</div>
	);
}
