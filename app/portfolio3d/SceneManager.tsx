'use client';

import { useState } from 'react';

import { SceneName } from './types';

import StationScene from './scene/StationScene';
import VillageScene from './scene/VillageScene';
import RoomScene from './scene/RoomScene';

import AboutRoom from './rooms/About/AboutRoom';
import WorkRoomPage from './rooms/WorkRoom/WorkRoomPage';
import RoomHud from './components/RoomHud';

export default function SceneManager() {
	const [scene, setScene] = useState<SceneName>('station');
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

	return (
		<div className="relative h-screen w-screen overflow-hidden bg-[#fff6d8]">
			{scene === 'station' && (
				<StationScene onEnterVillage={() => goScene('village')} />
			)}

			{scene === 'village' && <VillageScene onEnterRoom={goScene} />}

			{scene === 'about' && (
				<RoomScene
					key="about-room"
					onBack={() => goScene('village')}
					startPosition={[0, 1.35, 1.05]}
					lookAt={[0, 1.35, -1.25]}
					exitPosition={[0, 0, 3.15]}
					bounds={{
						minX: -2.05,
						maxX: 2.05,
						minZ: -1.58,
						maxZ: 1.58,
					}}
				>
					<AboutRoom />
				</RoomScene>
			)}

			{scene === 'work' && <WorkRoomPage onBack={() => goScene('village')} />}
            {scene !== 'station' && <RoomHud room={scene} onBack={scene === 'village' ? undefined : () => goScene('village')} />}

			<div
				className={[
					'pointer-events-none fixed inset-0 z-[99999] bg-white transition-opacity duration-300',
					isFading ? 'opacity-90' : 'opacity-0',
				].join(' ')}
			/>
		</div>
	);
}
