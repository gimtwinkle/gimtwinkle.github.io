'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, ShaderMaterial } from 'three';

// A single point cloud draws the spiral arms and their soft, twinkling halo.
export default function GalaxyStars() {
    const material = useRef<ShaderMaterial>(null);
    const { positions, sizes, phases, colors } = useMemo(() => {
        const count = 3200;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const phases = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        const noise = (n: number) => {
            const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
            return value - Math.floor(value);
        };
        for (let i = 0; i < count; i++) {
            const radius = Math.pow(noise(i + 1), 0.65) * 15;
            const angle = radius * 0.48 + (i % 3) * Math.PI * 2 / 3;
            const spread = 0.3 + radius * 0.15;
            positions[i * 3] = Math.cos(angle) * radius + (noise(i + 12) - 0.5) * spread;
            positions[i * 3 + 1] = Math.sin(angle) * radius * 0.42 + (noise(i + 42) - 0.5) * spread;
            positions[i * 3 + 2] = (noise(i + 72) - 0.5) * 3;
            sizes[i] = i % 13 === 0 ? 5 + noise(i + 99) * 5 : 1.5 + noise(i + 99) * 3;
            phases[i] = noise(i + 123) * Math.PI * 2;
            const warm = radius < 3;
            colors.set(warm ? [1, 0.83, 0.68] : i % 2 ? [0.48, 0.63, 1] : [0.78, 0.53, 1], i * 3);
        }
        return { positions, sizes, phases, colors };
    }, []);

    useFrame(({ clock }) => {
        if (material.current) material.current.uniforms.time.value = clock.elapsedTime;
    });

    return (
        <points position={[0, 1.72, -12]} rotation={[0, 0, -0.35]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-starSize" args={[sizes, 1]} />
                <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <shaderMaterial
                ref={material}
                uniforms={{ time: { value: 0 } }}
                vertexColors transparent depthWrite={false} blending={AdditiveBlending}
                vertexShader={`
                    uniform float time;
                    attribute float starSize;
                    attribute float phase;
                    varying vec3 tint;
                    varying float brightness;
                    void main() {
                        tint = color;
                        brightness = 0.45 + 0.55 * pow(0.5 + 0.5 * sin(time * 1.1 + phase), 2.0);
                        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_Position = projectionMatrix * viewPosition;
                        gl_PointSize = starSize * min(2.0, 22.0 / -viewPosition.z);
                    }
                `}
                fragmentShader={`
                    varying vec3 tint;
                    varying float brightness;
                    void main() {
                        float radius = length(gl_PointCoord - 0.5) * 2.0;
                        if (radius > 1.0) discard;
                        float glow = pow(1.0 - radius, 2.5);
                        gl_FragColor = vec4(tint, glow * brightness);
                    }
                `}
            />
        </points>
    );
}
