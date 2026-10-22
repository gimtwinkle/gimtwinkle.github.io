'use client';

import { Html } from '@react-three/drei';
import SceneLoading from './SceneLoading';

export default function CanvasLoading({ scene }: { scene: string }) {
    return <Html fullscreen zIndexRange={[10002, 10002]}><SceneLoading scene={scene} /></Html>;
}
