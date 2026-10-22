import WorkRoomPage from '../rooms/WorkRoom/WorkRoomPage';

export default function WorkRoomScene({ onBack }: { onBack: () => void }) {
    return <WorkRoomPage onBack={onBack} />;
}
