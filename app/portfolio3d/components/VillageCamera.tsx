'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import type { OrbitControls } from 'three-stdlib';

export default function VillageCamera({ mobile, greetingRequest = 0 }: { mobile: boolean; greetingRequest?: number }) {
    const { camera, size, invalidate, get } = useThree();
    const shot = useRef({
        active: false, elapsed: 0, reduced: false,
        intro: false, introComplete: false, hasGreeted: false,
        start: new Vector3(), startTarget: new Vector3(),
        close: new Vector3(), closeTarget: new Vector3(),
        end: new Vector3(), endTarget: new Vector3(),
    });
    useLayoutEffect(() => {
        if (!(camera instanceof PerspectiveCamera)) return;
        const current = shot.current;
        const controls = get().controls as OrbitControls | null;
        const aspect = size.width / Math.max(1, size.height);
        const distance = mobile ? Math.max(18, 10 / (Math.tan(Math.PI / 8) * Math.min(aspect, 1))) : 15;
        const player = get().scene.getObjectByName('player');
        current.endTarget.set(0, 0, 0);
        if (player) {
            player.getWorldPosition(current.endTarget);
            current.endTarget.y += 0.55 * player.scale.y;
        }
        const settledDistance = mobile ? Math.min(distance * 0.6, 18) : distance * 0.72;
        current.end.set(0, 0.6, 0.8).multiplyScalar(settledDistance).add(current.endTarget);
        current.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (greetingRequest && player) {
            current.intro = false;
            current.hasGreeted = true;
            player.updateWorldMatrix(true, false);
            current.start.copy(camera.position);
            current.startTarget.copy(controls?.target ?? new Vector3());
            player.localToWorld(current.closeTarget.set(0, 1, 0.08));
            const closeDistance = Math.max(1.6, 0.43 / (Math.tan(MathUtils.degToRad(camera.fov / 2)) * aspect)) * 1.4;
            player.localToWorld(current.close.set(0, 1, 0.08 + closeDistance));
            current.elapsed = 0;
            current.active = true;
            if (controls) controls.enabled = false;
        } else {
            current.intro = !current.hasGreeted;
            current.active = current.intro && !current.introComplete;
            current.elapsed = 0;
            camera.position.set(0, distance * 0.6, distance * 0.8);
            current.start.copy(camera.position);
            current.startTarget.set(0, 0, 0);
            camera.lookAt(0, 0, 0);
            if (current.intro && current.introComplete) {
                camera.position.copy(current.end);
                camera.lookAt(current.endTarget);
            }
            if (controls) {
                controls.target.copy(current.intro && current.introComplete ? current.endTarget : current.startTarget);
                controls.enabled = !current.active;
                if (!current.active) controls.update();
            }
        }
        camera.updateProjectionMatrix();
        invalidate();
        return () => { if (controls) controls.enabled = true; };
    }, [camera, size.width, size.height, mobile, greetingRequest, invalidate, get]);

    useFrame((_, delta) => {
        const current = shot.current;
        if (!current.active) return;
        const controls = get().controls as OrbitControls | null;
        if (get().scene.getObjectByName('player')?.userData.isMoving) {
            camera.position.copy(current.end);
            camera.lookAt(current.endTarget);
            if (controls) { controls.target.copy(current.endTarget); controls.enabled = true; }
            current.active = false;
            current.introComplete = true;
            return;
        }
        if (controls) controls.enabled = false;
        current.elapsed += Math.min(delta, 0.05);
        const introDuration = 3.2;
        const zoomIn = 1.25, hold = 0.9, zoomOut = 5.5;
        const time = current.elapsed;
        const target = controls?.target;
        if (current.reduced) {
            camera.position.copy(current.end);
            target?.copy(current.endTarget);
            camera.lookAt(current.endTarget);
        } else if (current.intro) {
            const amount = MathUtils.smootherstep(time, 0, introDuration);
            camera.position.lerpVectors(current.start, current.end, amount);
            if (target) target.lerpVectors(current.startTarget, current.endTarget, amount);
            else camera.lookAt(current.endTarget);
        } else if (time < zoomIn) {
            const amount = MathUtils.smootherstep(time, 0, zoomIn);
            camera.position.lerpVectors(current.start, current.close, amount);
            if (target) target.lerpVectors(current.startTarget, current.closeTarget, amount);
            else camera.lookAt(current.closeTarget);
        } else {
            const amount = MathUtils.smootherstep(time - zoomIn - hold, 0, zoomOut);
            camera.position.lerpVectors(current.close, current.end, amount);
            if (target) target.lerpVectors(current.closeTarget, current.endTarget, amount);
            else camera.lookAt(current.closeTarget);
        }
        // OrbitControls' overview angle limits must not tilt the frontal portrait.
        if (target) camera.lookAt(target);
        if (current.reduced || time >= (current.intro ? introDuration : zoomIn + hold + zoomOut)) {
            current.active = false;
            if (current.intro) current.introComplete = true;
            if (controls) controls.enabled = true;
        }
    });
    return null;
}
