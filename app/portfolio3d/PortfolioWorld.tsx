'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';

import Character from './objects/Character';
import CuteCloud from './objects/CuteCloud';
import CuteMap from './objects/CuteMap';

import AboutRoom from './rooms/About/AboutRoom';
import WorkRoom from './rooms/WorkRoom';
import SkillRoom from './rooms/Skill/SkillRoom';
import ContactRoom from './rooms/ContactRoom';
import RoomScene from './scene/RoomScene';

import { RoomName } from './types';

type SceneName = 'village' | RoomName;

const roomSceneConfig = {
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

		const timer = setInterval(() => {
			setNow(new Date());
		}, 1000);

		return () => clearInterval(timer);
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

export default function PortfolioWorld() {
	const [scene, setScene] = useState<SceneName>('village');
	const [isFading, setIsFading] = useState(false);

	const goScene = (nextScene: SceneName) => {
		setIsFading(true);

		setTimeout(() => {
			setScene(nextScene);

			setTimeout(() => {
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
		) : scene === 'skills' ? (
			<SkillRoom onBack={goBackVillage} />
		) : scene === 'contact' ? (
			<ContactRoom onBack={goBackVillage} />
		) : null;

	const roomSceneProps =
		scene === 'about' ? aboutRoomSceneConfig : roomSceneConfig;

	return (
		<div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-sky-200 via-pink-100 to-yellow-100">
			{scene === 'village' && (
				<Canvas
					shadows
					camera={{ position: [0, 9, 12], fov: 45 }}
					gl={{ antialias: true }}
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

					<CuteMap isNight={true} onEnterRoom={goScene} />
					<Character />

					<OrbitControls
						enableZoom={false}
						enablePan={false}
						maxPolarAngle={Math.PI / 2.4}
						minPolarAngle={Math.PI / 4}
					/>
				</Canvas>
			)}

			{canvasRoomScene && (
				<RoomScene
					key={`${scene}-room`}
					onBack={goBackVillage}
					{...roomSceneProps}
				>
					{canvasRoomScene}
				</RoomScene>
			)}

			{isFading && (
				<div className="pointer-events-none fixed inset-0 z-[9999] bg-white opacity-90 transition-opacity duration-300" />
			)}

			{scene === 'village' && (
				<div className="pointer-events-none fixed left-6 top-6 z-20 rounded-xl border-2 border-white/30 bg-black/45 px-4 py-3 text-sm font-bold text-white backdrop-blur-md">
					WASD / Arrow keys to move
				</div>
			)}

			<SeoulClockUI />
		</div>
	);
}
