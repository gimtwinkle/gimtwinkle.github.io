'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { lazy, Suspense, useState } from 'react';

import { RoomName } from './types';
import RoomHud from './components/RoomHud';
import SceneLoading, { sceneLoadingMessages } from './components/SceneLoading';
import CanvasLoading from './components/CanvasLoading';
import useSeoulNight from './useSeoulNight';
import useSeoulWeather from './useSeoulWeather';
import VillageWeather from './objects/VillageWeather';
import { weatherLabels } from '@/lib/seoulWeather';
import useMobile from './useMobile';
import VillageCamera from './components/VillageCamera';
import HouseEntry from './components/HouseEntry';
import MobileControls from './components/MobileControls';
import mobileControlStyles from './components/MobileControls.module.css';
import { resetMovement } from './movement';

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
    const mobile = useMobile();
    const [greetingRequest, setGreetingRequest] = useState(0);
    const [entryRoom, setEntryRoom] = useState<RoomName | null>(null);
    const isNight = useSeoulNight();
    const weather = useSeoulWeather();
    const overcast = !!weather && weather.kind !== 'clear';
    const skyColor = isNight ? (overcast ? '#1e293c' : '#101a35') : (overcast ? '#bcc9d5' : '#bdefff');
    const cloudColor = isNight ? '#7e8aab' : (overcast ? '#c3cad4' : '#fffdf9');
	const [scene, setScene] = useState<SceneName>('village');
	const [isFading, setIsFading] = useState(false);
    const [destination, setDestination] = useState<SceneName>('village');

    const enterHouse = (room: RoomName) => {
        if (entryRoom || isFading) return;
        resetMovement();
        setEntryRoom(room);
    };

	const goScene = (nextScene: SceneName) => {
		if (nextScene === scene || isFading) {
			return;
		}

        setDestination(nextScene);
        resetMovement();
		setIsFading(true);

		window.setTimeout(() => {
			setScene(nextScene);
            setEntryRoom(null);
            setGreetingRequest(0);

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
                    tabIndex={0}
                    aria-label="마을 탐색: 방향키 또는 WASD로 캐릭터 이동"
                    onPointerDown={(event) => event.currentTarget.focus({ preventScroll: true })}
					dpr={mobile ? 1 : [1, 1.5]}
					shadows={!mobile}
					camera={{
						position: [0, 9, 12],
						fov: 45,
						near: 0.1,
						far: 100,
					}}
					gl={{
						antialias: !mobile,
						alpha: false,
					}}
				>
					<Suspense fallback={<CanvasLoading scene="village" />}>
                        <VillageCamera mobile={mobile} greetingRequest={greetingRequest} entering={!!entryRoom} />
                        {entryRoom && <HouseEntry room={entryRoom} onComplete={() => goScene(entryRoom)} />}
						<color attach="background" args={[skyColor]} />
                        <fog attach="fog" args={[skyColor, weather?.kind === 'fog' ? 8 : 28, weather?.kind === 'fog' ? 32 : overcast ? 65 : 120]} />
                        <VillageWeather weather={weather} mobile={mobile} />

						<ambientLight intensity={isNight ? 0.4 : overcast ? 0.8 : 0.9} />

						<directionalLight
							position={[5, 10, 6]}
							intensity={isNight ? (overcast ? 0.35 : 0.65) : (overcast ? 1 : 2.4)}
                            color={isNight ? '#abc8ff' : '#ffffff'}
							castShadow
							shadow-mapSize={[2048, 2048]}
						/>

						<pointLight position={[-5, 4, 4]} intensity={1.2} color="#ff8bd1" />

						<pointLight position={[5, 4, -5]} intensity={1.2} color="#8be9ff" />

						<CuteCloud position={[-5, 6, -4]} color={cloudColor} />

						<CuteCloud position={[4, 7, -5]} scale={0.8} color={cloudColor} />

						<CuteCloud position={[0, 6.5, 4]} scale={0.7} color={cloudColor} />
                        {overcast && <>
                            <CuteCloud position={[-2, 7.5, -6]} scale={1.7} color={cloudColor} />
                            <CuteCloud position={[5, 8, 0]} scale={1.6} color={cloudColor} />
                            <CuteCloud position={[-6, 7, 2]} scale={1.5} color={cloudColor} />
                        </>}

						<CuteMap isNight={isNight} onEnterRoom={enterHouse} />

						<Character message={entryRoom === 'about' ? 'about me!' : undefined} onGreet={() => setGreetingRequest((request) => request + 1)} />

						<OrbitControls
                            makeDefault
                            enabled={!entryRoom}
                            enableRotate={!mobile}
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
						dpr={mobile ? 1 : [1, 1.5]}
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
                        {mobile ? '위로 밀어 다음 카드 · 아래로 밀어 이전 카드' : 'SCROLL / SWIPE TO EXPLORE'}
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
            {scene === 'village' && <a href="https://open-meteo.com/" target="_blank" rel="noreferrer"
                title={weather ? `서울 날씨 기준 시각: ${new Date(weather.observedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}` : '서울 날씨 데이터 제공'}
                className={`absolute ${mobile ? 'left-3 top-[calc(68px+env(safe-area-inset-top))]' : 'bottom-3 left-3'} z-30 rounded-lg bg-[#fffaf0]/85 px-2 py-1 text-[10px] text-[#735344] shadow-sm`}>
                서울 {weather ? weatherLabels[weather.kind] : '날씨'} · Open-Meteo
            </a>}
            <MobileControls key={scene} walking={scene !== 'skills'} />
            {scene === 'village' && greetingRequest > 0 && <button type="button" onClick={() => setGreetingRequest(0)} className={`fixed ${mobile ? 'left-3 top-[calc(68px+env(safe-area-inset-top))]' : 'right-6 bottom-6'} z-[10000] min-h-11 rounded-xl border border-white/60 bg-[#fffaf0]/95 px-4 text-xs font-bold text-[#543a2b] shadow-md`}>마을 전체 보기</button>}
            {mobile && scene === 'village' && (
                <nav aria-label="방 바로가기" className={`${mobileControlStyles.navigation} fixed bottom-[max(12px,env(safe-area-inset-bottom))] right-3 z-[10000] ml-auto flex max-w-md gap-1 rounded-2xl border border-white/60 bg-[#fffaf0]/95 p-2 text-[#543a2b] shadow-lg backdrop-blur-md`}>
                    {(['about', 'work', 'skills', 'contact'] as RoomName[]).map((room) => (
                        <button key={room} type="button" disabled={isFading || !!entryRoom} onClick={() => enterHouse(room)} className="min-h-11 min-w-0 flex-1 rounded-xl px-1 text-xs font-bold capitalize hover:bg-[#ffe6a3] focus-visible:outline-2 focus-visible:outline-[#735344] disabled:opacity-50">{room === 'skills' ? 'Skills' : room}</button>
                    ))}
                </nav>
            )}
		</div>
	);
}
