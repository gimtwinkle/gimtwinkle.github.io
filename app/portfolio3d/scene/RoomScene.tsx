'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import CanvasLoading from '../components/CanvasLoading';
import useMobile from '../useMobile';

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
};

export default function RoomScene({
    loadingScene = 'about',
    lightweight = false,
    overlay,
	children,
	startPosition,
	lookAt = [0, 1.35, -3],
}: RoomSceneProps) {
    const mobile = useMobile();
    const [contextLost, setContextLost] = useState(false);
    const initialDistance = Math.hypot(
        startPosition[0] - lookAt[0],
        startPosition[1] - lookAt[1],
        startPosition[2] - lookAt[2]
    );
    if (contextLost) throw new Error('그래픽 연결(WebGL)이 끊겼어요. 다시 시도해 주세요.');

	return (
		<div
			className="fixed inset-0 z-[9999] h-dvh w-full overflow-hidden bg-[#fff7ed]"
			style={{ overscrollBehavior: 'none' }}
		>
			<Canvas
                style={{ touchAction: 'none' }}
                frameloop={loadingScene === 'contact' ? 'demand' : 'always'}
				key={startPosition.join('-')}
				className="h-full w-full"
				shadows={!lightweight && !mobile}
                dpr={lightweight ? 1 : mobile ? [1, 1.25] : [1, 1.5]}
				camera={{
					position: startPosition,
					fov: 85,
					near: 0.1,
					far: 100,
				}}
				gl={{
					antialias: true,
				}}
			>
				<color attach="background" args={['#fff7ed']} />
                {lightweight && <ContextMonitor onLost={() => setContextLost(true)} />}

				<Suspense fallback={<CanvasLoading scene={loadingScene} />}>{children}</Suspense>

				<OrbitControls
					makeDefault
					target={lookAt}
					enablePan={false}
					minDistance={initialDistance * 0.55}
					maxDistance={initialDistance * 1.6}
					minAzimuthAngle={-Math.PI / 7}
					maxAzimuthAngle={Math.PI / 7}
					minPolarAngle={Math.PI / 2 - Math.PI / 12}
					maxPolarAngle={Math.PI / 2 + Math.PI / 12}
					enableDamping
					dampingFactor={0.08}
				/>
			</Canvas>
            {overlay}

		</div>
	);
}
