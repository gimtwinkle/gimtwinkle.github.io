'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { lazy, Suspense, useState } from 'react';

import { RoomName } from './types';
import RoomHud from './components/RoomHud';
import SceneLoading, { sceneLoadingMessages } from './components/SceneLoading';
import CanvasLoading from './components/CanvasLoading';
import useSeoulNight from './useSeoulNight';

const Character = lazy(() => import('./objects/Character'));
const CuteCloud = lazy(() => import('./objects/CuteCloud'));
const CuteMap = lazy(() => import('./objects/CuteMap'));
const AboutRoom = lazy(() => import('./rooms/About/AboutRoom'));
const ContactRoom = lazy(() => import('./rooms/ContactRoom'));
const WorkRoomPage = lazy(() => import('./rooms/WorkRoom/WorkRoomPage'));
const RoomScene = lazy(() => import('./scene/RoomScene'));
const SkillMediaArtRoom = lazy(() => import('./rooms/SkillRoom/MediaArtRoom'));

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

export default function PortfolioWorld() {
    const isNight = useSeoulNight();
	const [scene, setScene] = useState<SceneName>('village');
	const [isFading, setIsFading] = useState(false);
    const [destination, setDestination] = useState<SceneName>('village');

	const goScene = (nextScene: SceneName) => {
		if (nextScene === scene || isFading) {
			return;
		}

        setDestination(nextScene);
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

		) : scene === 'contact' ? (
			<ContactRoom onBack={goBackVillage} />
		) : null;

	const roomSceneProps =
		scene === 'about' ? aboutRoomSceneConfig : defaultRoomSceneConfig;

	return (
		<div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-sky-200 via-pink-100 to-yellow-100">
			{/* ================================
			    마을
			================================ */}
			{scene === 'village' && (
				<Canvas
					dpr={[1, 1.5]}
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
					<Suspense fallback={<CanvasLoading scene="village" />}>
						<color attach="background" args={[isNight ? '#101a35' : '#bdefff']} />

						<ambientLight intensity={isNight ? 0.4 : 0.9} />

						<directionalLight
							position={[5, 10, 6]}
							intensity={isNight ? 0.65 : 2.4}
                            color={isNight ? '#abc8ff' : '#ffffff'}
							castShadow
							shadow-mapSize={[2048, 2048]}
						/>

						<pointLight position={[-5, 4, 4]} intensity={1.2} color="#ff8bd1" />

						<pointLight position={[5, 4, -5]} intensity={1.2} color="#8be9ff" />

						<CuteCloud position={[-5, 6, -4]} />

						<CuteCloud position={[4, 7, -5]} scale={0.8} />

						<CuteCloud position={[0, 6.5, 4]} scale={0.7} />

						<CuteMap isNight={isNight} onEnterRoom={goScene} />

						<Character />

						<OrbitControls
							enableZoom={false}
							enablePan={false}
							maxPolarAngle={Math.PI / 2.4}
							minPolarAngle={Math.PI / 4}
						/>
					</Suspense>
				</Canvas>
			)}

			{scene === 'work' && (
                <Suspense fallback={<SceneLoading scene="work" />}>
                    <WorkRoomPage onBack={goBackVillage} />
                </Suspense>
            )}

			{/* ================================
			    About / Contact
			================================ */}
			{canvasRoomScene && (
				<Suspense fallback={<SceneLoading scene={scene} />}>
					<RoomScene
						key={`${scene}-room`}
						onBack={goBackVillage}
                        loadingScene={scene}
						{...roomSceneProps}
					>
						{canvasRoomScene}
					</RoomScene>
				</Suspense>
			)}

			{/* ================================
			    Skill 미디어아트룸
			================================ */}
			{scene === 'skills' && (
				<div data-skill-room className="absolute inset-0 z-10 bg-black">
					<Canvas
						dpr={[1, 1.5]}
						camera={{
							position: [0, 1.72, 5.8],
							fov: 52,
							near: 0.1,
							far: 100,
						}}
						gl={{
							antialias: false,
							alpha: false,
						}}
						onCreated={({ gl }) => {
							gl.setClearColor('#000000');
						}}
					>
						<color attach="background" args={['#000000']} />

						<Suspense fallback={<CanvasLoading scene="skills" />}>
							<SkillMediaArtRoom />
						</Suspense>
					</Canvas>


                    <div className="pointer-events-none absolute bottom-7 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.25em] text-white/50">
                        SCROLL / SWIPE TO EXPLORE
                    </div>
				</div>
			)}

			{/* ================================
			    화면 전환 페이드
			================================ */}
			<div
				className={[
					'pointer-events-none fixed inset-0 z-[10002] flex items-center justify-center bg-white text-sm text-[#543a2b]',
					'transition-opacity duration-300',
					isFading ? 'opacity-90' : 'opacity-0',
				].join(' ')}
			>{isFading && <span role="status">{sceneLoadingMessages[destination] ?? '방으로 들어가는 중..'}</span>}</div>

			<RoomHud room={scene} onBack={scene === 'village' ? undefined : goBackVillage} />
		</div>
	);
}
