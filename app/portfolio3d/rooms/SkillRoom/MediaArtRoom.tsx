'use client';

import { Sparkles, Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { MathUtils } from 'three';
import GalaxyStars from './GalaxyStars';
import FloatingLottie from './FloatingLottie';
import reactLogo from '@/asset/lottie/react-logo.json';
import typescriptLogo from '@/asset/lottie/ts-logo.json';
import figmaLogo from '@/asset/lottie/figma-logo.json';
import nextLogo from '@/asset/lottie/nextjs-logo.json';
import gitLogo from '@/asset/lottie/git-logo.json';
import githubLogo from '@/asset/lottie/github-logo.json';
import lottieLogo from '@/asset/lottie/lottie-logo.json';
import interaction from '@/asset/lottie/interaction.json';
import accessibility from '@/asset/lottie/responsive-web.json';
import { skillInfo } from './skillInfo';

type MediaArtRoomProps = {
    showPanels?: boolean;
};

const skills = [
    { id: 'react', data: reactLogo, size: 112 },
    { id: 'next', data: nextLogo, size: 92 },
    { id: 'typescript', data: typescriptLogo, size: 96 },
    { id: 'figma', data: figmaLogo, size: 112 },
    { id: 'git', data: gitLogo, size: 84 },
    { id: 'github', data: githubLogo, size: 90 },
    { id: 'lottie', data: lottieLogo, size: 108 },
    { id: 'interaction', data: interaction, size: 100 },
    { id: 'accessibility', data: accessibility, size: 112 },
];

const TRAVEL_END = (skills.length - 1) * 9 + 3;
const pathX = (distance: number) => Math.sin(distance * 0.075) * 1.4;

export default function MediaArtRoom({ showPanels = true }: MediaArtRoomProps) {
    const { gl, size } = useThree();
    const motion = useRef({ target: 0, distance: 0, reduced: false, pointerX: 0, pointerY: 0 });
    const spread = Math.min(1, size.width / size.height / 1.2);

    useEffect(() => {
        // Html cards can sit beside the canvas wrapper, so listen on the whole room.
        const surface = gl.domElement.closest<HTMLElement>('[data-skill-room]') ?? gl.domElement.parentElement;
        if (!surface) return;
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updatePreference = () => { motion.current.reduced = preference.matches; };
        updatePreference();
        preference.addEventListener('change', updatePreference);
        const move = (pixels: number) => {
            motion.current.target = MathUtils.clamp(motion.current.target + pixels * 0.025, 0, TRAVEL_END);
        };
        const wheel = (event: WheelEvent) => {
            event.preventDefault();
            move(event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? surface.clientHeight : 1));
        };
        let previousY = 0;
        const touchStart = (event: TouchEvent) => { previousY = event.touches[0].clientY; };
        const touchMove = (event: TouchEvent) => {
            event.preventDefault();
            const nextY = event.touches[0].clientY;
            move((previousY - nextY) * 2);
            previousY = nextY;
        };
        const pointerMove = (event: PointerEvent) => {
            if (event.target instanceof Element && event.target.closest('[data-skill-details]')) return;
            const rect = surface.getBoundingClientRect();
            motion.current.pointerX = MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
            motion.current.pointerY = MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
        };
        const pointerLeave = () => { motion.current.pointerX = 0; motion.current.pointerY = 0; };
        surface.addEventListener('wheel', wheel, { passive: false });
        surface.addEventListener('touchstart', touchStart, { passive: true });
        surface.addEventListener('touchmove', touchMove, { passive: false });
        surface.addEventListener('pointermove', pointerMove);
        surface.addEventListener('pointerleave', pointerLeave);
        return () => {
            preference.removeEventListener('change', updatePreference);
            surface.removeEventListener('wheel', wheel);
            surface.removeEventListener('touchstart', touchStart);
            surface.removeEventListener('touchmove', touchMove);
            surface.removeEventListener('pointermove', pointerMove);
            surface.removeEventListener('pointerleave', pointerLeave);
        };
    }, [gl]);

    // Move the viewer through stationary planets; run before their screen-space emphasis.
    useFrame(({ camera, clock }, delta) => {
        const dt = Math.min(delta, 0.05);
        const current = motion.current;
        current.distance = MathUtils.damp(current.distance, current.target, current.reduced ? 8 : 3, dt);
        const distance = current.distance;
        const drift = current.reduced ? 0 : Math.sin(clock.elapsedTime * 0.35) * 0.06;
        camera.position.x = MathUtils.damp(camera.position.x,
            pathX(distance) * spread + (current.reduced ? 0 : current.pointerX * 0.22 * spread), 3, dt);
        camera.position.y = MathUtils.damp(camera.position.y,
            1.72 + drift - (current.reduced ? 0 : current.pointerY * 0.12), 3, dt);
        camera.position.z = 5.8 - distance;
        camera.lookAt(pathX(distance + 5) * spread, 1.72, camera.position.z - 12);
        camera.updateMatrixWorld();
    }, -1);

    return (
        <group name="skill-space-voyage">
            <color attach="background" args={['#000000']} />
            <group position={[0, -8.6, -28]} scale={6}>
                <GalaxyStars />
            </group>
            <Stars radius={110} depth={80} count={1000} factor={2} saturation={0.3} fade speed={0.2} />
            <Sparkles position={[0, 1.72, -38]} scale={[22, 12, 90]} count={100} size={1.3} speed={0.08} opacity={0.5} color="#b7caff" />
            {showPanels && skills.map((skill, index) => {
                const distance = index * 9;
                const x = pathX(distance) + [0.3, -1.8, 1.4, -0.6, 1.7, -1.2, 0.8, -0.3][index % 8];
                return (
                    <FloatingLottie
                        key={skill.id}
                        emphasizeCenter
                        skill={skillInfo[skill.id]}
                        animationData={skill.data}
                        position={[x * spread, 1.72 + [0, 0.7, -0.55, 0.45, -0.7, 0.4, 0.65, 0][index % 8], -3 - distance]}
                        size={skill.size}
                        distanceFactor={10}
                        floatSpeed={0.2 + index * 0.02}
                        floatAmount={0.1}
                        delay={index * 0.8}
                    />
                );
            })}
        </group>
    );
}
