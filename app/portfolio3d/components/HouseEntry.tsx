'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { MathUtils, Vector3 } from 'three';
import type { OrbitControls } from 'three-stdlib';
import type { RoomName } from '../types';

export default function HouseEntry({ room, onComplete }: { room: RoomName; onComplete: () => void }) {
    const { camera, scene, get } = useThree();
    const shot = useRef({
        elapsed: 0, phase: 0, done: false, reduced: false, announcement: 0, waiting: false,
        start: new Vector3(), startTarget: new Vector3(),
        approach: new Vector3(), door: new Vector3(),
        direction: new Vector3(), follow: new Vector3(), target: new Vector3(),
    });

    useLayoutEffect(() => {
        const player = scene.getObjectByName('player');
        const house = scene.getObjectByName(`house-${room}`);
        if (!player || !house) return;
        const s = shot.current;
        house.updateWorldMatrix(true, false);
        house.localToWorld(s.approach.set(0, 0, 2.7));
        house.localToWorld(s.door.set(0, 0, 1.1));
        s.approach.y = s.door.y = player.position.y;
        s.direction.subVectors(s.approach, player.position).setY(0).normalize();
        if (s.direction.lengthSq() < 0.01) s.direction.subVectors(s.door, s.approach).normalize();
        player.rotation.y = Math.atan2(s.direction.x, s.direction.z);
        player.userData.enteringRoom = true;
        s.waiting = room === 'about';
        if (!s.waiting) player.userData.entryTarget = s.approach;
        else delete player.userData.entryTarget;
        player.userData.entrySpeed = 3.8;
        s.start.copy(camera.position);
        s.startTarget.copy((get().controls as OrbitControls | null)?.target ?? player.position);
        s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return () => {
            delete player.userData.enteringRoom;
            delete player.userData.entryTarget;
            delete player.userData.entrySpeed;
        };
    }, [room, camera, scene, get]);

    useFrame((_, delta) => {
        const s = shot.current;
        if (s.done) return;
        const player = scene.getObjectByName('player');
        if (s.waiting && player) {
            s.announcement += Math.min(delta, 0.05);
            if (s.announcement < 0.9) return;
            s.waiting = false;
            player.userData.entryTarget = s.approach;
        }
        if (!player || s.reduced) { s.done = true; onComplete(); return; }
        const controls = get().controls as OrbitControls | null;
        if (controls) controls.enabled = false;
        // Keep the village view while the character quickly approaches the doorstep.
        if (s.phase === 0) {
            if (player.position.distanceTo(s.approach) >= 0.08) return;
            s.phase = 1;
            s.elapsed = 0;
            delete player.userData.entryTarget;
            s.direction.subVectors(s.door, player.position).setY(0).normalize();
            player.rotation.y = Math.atan2(s.direction.x, s.direction.z);
            s.start.copy(camera.position);
            s.startTarget.copy(controls?.target ?? s.startTarget);
        }
        s.elapsed += Math.min(delta, 0.05);
        if (s.phase === 1 && s.elapsed >= 0.65) {
            s.phase = 2;
            player.userData.entrySpeed = 2.7;
            player.userData.entryTarget = s.door;
        }
        if (s.phase === 2 && player.position.distanceTo(s.door) < 0.08) {
            s.done = true;
            onComplete();
            return;
        }
        // Follow just above and to the side of the shoulder, with the back visible.
        s.direction.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
        const height = player.scale.y;
        s.follow.copy(player.position).addScaledVector(s.direction, -1.65);
        s.follow.x += s.direction.z * 0.32;
        s.follow.z -= s.direction.x * 0.32;
        s.follow.y += 1.45 * height;
        s.target.copy(player.position).addScaledVector(s.direction, 2.8);
        s.target.y += 1.05 * height;
        const amount = MathUtils.smootherstep(s.elapsed, 0, 0.65);
        camera.position.lerpVectors(s.start, s.follow, amount);
        if (controls) controls.target.lerpVectors(s.startTarget, s.target, amount);
        camera.lookAt(s.target.lerpVectors(s.startTarget, s.target, amount));
    });
    return null;
}
