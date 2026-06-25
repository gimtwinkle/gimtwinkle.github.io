import WorkRoom from '../rooms/WorkRoom';
import RoomScene from './RoomScene';

type WorkRoomSceneProps = {
	onBack: () => void;
};

export default function WorkRoomScene({ onBack }: WorkRoomSceneProps) {
	return (
		<RoomScene
			onBack={onBack}
			startPosition={[0, 1.35, 2.15]}
			exitPosition={[0, 0, 3.25]}
			bounds={{
				minX: -4.2,
				maxX: 4.2,
				minZ: -2.8,
				maxZ: 2.85,
			}}
		>
			<WorkRoom />
		</RoomScene>
	);
}
