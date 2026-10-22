'use client';

import { Canvas } from '@react-three/fiber';
import MediaArtRoom from './MediaArtRoom';

export default function MediaArtRoomPage() {
    return (
        <div data-skill-room className="fixed inset-0 h-dvh w-full overflow-hidden bg-black">
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 1.72, 5.8], fov: 52, near: 0.1, far: 100 }}
                gl={{ antialias: false, alpha: false }}
            >
                <MediaArtRoom />
            </Canvas>
        </div>
    );
}
