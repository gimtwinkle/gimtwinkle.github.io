'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { DynamicDrawUsage, InstancedMesh, Object3D } from 'three';
import type { SeoulWeather } from '@/lib/seoulWeather';

export default function VillageWeather({ weather, mobile }: { weather: SeoulWeather | null; mobile: boolean }) {
    const mesh = useRef<InstancedMesh>(null);
    const reduced = useRef(true);
    const elapsedTime = useRef(0);
    const snow = weather?.kind === 'snow';
    const enabled = snow || weather?.kind === 'rain';
    const count = Math.round((snow ? 180 : 420) * (mobile ? 0.5 : 1) * (0.55 + (weather?.intensity ?? 0) * 0.45));
    const particles = useMemo(() => {
        const seeds = new Float32Array(count * 3);
        for (let i = 0; i < seeds.length; i++) {
            const value = Math.sin(i * 127.1 + 311.7) * 43758.5453;
            seeds[i] = value - Math.floor(value);
        }
        return { seeds, dummy: new Object3D() };
    }, [count]);
    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => { reduced.current = preference.matches; };
        update();
        preference.addEventListener('change', update);
        return () => preference.removeEventListener('change', update);
    }, []);
    useFrame((_, frameDelta) => {
        if (!mesh.current) return;
        mesh.current.visible = enabled && !reduced.current;
        if (!mesh.current.visible) return;
        elapsedTime.current += Math.min(frameDelta, 0.05);
        const elapsed = elapsedTime.current;
        const { seeds, dummy } = particles;
        for (let i = 0; i < count; i++) {
            const x = seeds[i * 3], y = seeds[i * 3 + 1], z = seeds[i * 3 + 2];
            const fall = elapsed * (snow ? 0.65 + x * 0.5 : 6 + x * 3);
            dummy.position.set(
                x * 21 - 10.5 + (snow ? Math.sin(elapsed * 0.7 + i) * 0.3 : 0),
                0.2 + ((y * 11 - fall) % 11 + 11) % 11,
                z * 21 - 10.5,
            );
            dummy.rotation.set(0, 0, snow ? 0 : -0.12);
            dummy.scale.setScalar(snow ? 0.7 + z * 0.6 : 1);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        }
        mesh.current.instanceMatrix.needsUpdate = true;
    });
    if (!enabled) return null;
    return <instancedMesh key={`${snow}-${count}`} ref={mesh} args={[undefined, undefined, count]} visible={false} frustumCulled={false}
        raycast={() => {}} onUpdate={object => object.instanceMatrix.setUsage(DynamicDrawUsage)}>
        {snow ? <sphereGeometry args={[0.035, 6, 5]} /> : <cylinderGeometry args={[0.008, 0.008, 0.24, 4]} />}
        <meshBasicMaterial color={snow ? '#fffdf7' : '#bddeef'} transparent opacity={snow ? 0.85 : 0.48} depthWrite={false} />
    </instancedMesh>;
}
