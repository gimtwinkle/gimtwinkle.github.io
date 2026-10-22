'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import FirstPersonCamera from './FirstPersonCamera';
import CanvasLoading from '../components/CanvasLoading';

type Bounds = {
	minX: number;
	maxX: number;
	minZ: number;
	maxZ: number;
};

function ContextMonitor({ onLost }: { onLost: () => void }) {
    const gl = useThree((state) => state.gl);
    useEffect(() => {
        const canvas = gl.domElement;
        const handleLost = (event: Event) => { event.preventDefault(); onLost(); };
        canvas.addEventListener('webglcontextlost', handleLost);
        return () => canvas.removeEventListener('webglcontextlost', handleLost);
    }, [gl, onLost]);
    return null;
}

type RoomSceneProps = {
    loadingScene?: string;
    lightweight?: boolean;
    overlay?: React.ReactNode;
	children: React.ReactNode;
	onBack: () => void;
	startPosition: [number, number, number];
	lookAt?: [number, number, number];
	exitPosition: [number, number, number];
	bounds: Bounds;
};

export default function RoomScene({
    loadingScene = 'about',
    lightweight = false,
    overlay,
	children,
	startPosition,
	lookAt = [0, 1.35, -3],
	bounds,
}: RoomSceneProps) {
    const [contextLost, setContextLost] = useState(false);
    if (contextLost) throw new Error('그래픽 연결(WebGL)이 끊겼어요. 다시 시도해 주세요.');

	return (
		<div
			className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-[#fff7ed]"
			style={{ overscrollBehavior: 'none' }}
		>
			<Canvas
                frameloop={loadingScene === 'contact' ? 'demand' : 'always'}
				key={startPosition.join('-')}
				className="h-full w-full"
				shadows={!lightweight}
                dpr={lightweight ? 1 : [1, 1.5]}
				camera={{
					position: startPosition,
					fov: 85,
					near: 0.1,
					far: 100,
				}}
				gl={{
					antialias: !lightweight,
				}}
			>
				<color attach="background" args={['#fff7ed']} />
                {lightweight && <ContextMonitor onLost={() => setContextLost(true)} />}

				<Suspense fallback={<CanvasLoading scene={loadingScene} />}>{children}</Suspense>

				<FirstPersonCamera
					startPosition={startPosition}
					lookAt={lookAt}
					bounds={bounds}
				/>
			</Canvas>
            {overlay}

		</div>
	);
}
