'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

type Bounds = {
	minX: number;
	maxX: number;
	minZ: number;
	maxZ: number;
};

type FirstPersonCameraProps = {
	startPosition: [number, number, number];
	lookAt: [number, number, number];
	height?: number;
	speed?: number;
	bounds: Bounds;
	onDragChange?: (isDragging: boolean) => void;
};

export default function FirstPersonCamera({
	startPosition,
	lookAt,
	height = 1.35,
	speed = 2.2,
	bounds,
	onDragChange,
}: FirstPersonCameraProps) {
	const { camera, gl, invalidate } = useThree();

	const keys = useRef({
		forward: false,
		backward: false,
		left: false,
		right: false,
	});

	const yaw = useRef(0);
	const pitch = useRef(0);
    const initialView = useRef({ yaw: 0, pitch: 0 });
	const isDragging = useRef(false);
	const lastPointer = useRef({ x: 0, y: 0 });
    const vectors = useRef({ direction: new THREE.Vector3(), forward: new THREE.Vector3(), right: new THREE.Vector3() });


    // Keep the entire camera frustum in the furnished half of every room.
    // Wider windows allow less turning because more of the room is already visible.
    const constrainView = useCallback(() => {
        const verticalFov = camera instanceof THREE.PerspectiveCamera
            ? THREE.MathUtils.degToRad(camera.getEffectiveFOV()) : Math.PI / 3;
        const horizontalFov = camera instanceof THREE.PerspectiveCamera
            ? 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect) : verticalFov;
        const yawLimit = Math.max(0.05, Math.min(Math.PI / 3, Math.PI / 2 - horizontalFov / 2 - 0.08));
        const pitchLimit = Math.max(0.05, Math.min(Math.PI / 6, Math.PI / 2 - verticalFov / 2 - 0.12));
        yaw.current = THREE.MathUtils.clamp(yaw.current, initialView.current.yaw - yawLimit, initialView.current.yaw + yawLimit);
        pitch.current = THREE.MathUtils.clamp(pitch.current, initialView.current.pitch - pitchLimit, initialView.current.pitch + pitchLimit);
    }, [camera]);

	useEffect(() => {
		camera.rotation.reorder('YXZ');
		camera.position.set(...startPosition);
		camera.lookAt(...lookAt);
        invalidate();

		yaw.current = camera.rotation.y;
		pitch.current = camera.rotation.x;
        initialView.current = { yaw: yaw.current, pitch: pitch.current };

		const canvas = gl.domElement;

		const handlePointerDown = (e: PointerEvent) => {
			if (e.button !== 0) return;

			isDragging.current = true;
			lastPointer.current = { x: e.clientX, y: e.clientY };
			canvas.setPointerCapture(e.pointerId);
			onDragChange?.(true);
		};

		const handlePointerMove = (e: PointerEvent) => {
			if (!isDragging.current) return;

			const movementX = e.clientX - lastPointer.current.x;
			const movementY = e.clientY - lastPointer.current.y;
			lastPointer.current = { x: e.clientX, y: e.clientY };

			yaw.current -= movementX * 0.0025;
			pitch.current -= movementY * 0.0025;

            constrainView();
            invalidate();
		};

		const stopDragging = (e?: PointerEvent) => {
			if (!isDragging.current) return;

			isDragging.current = false;
			if (e && canvas.hasPointerCapture(e.pointerId)) {
				canvas.releasePointerCapture(e.pointerId);
			}
			onDragChange?.(false);
		};

		const preventTouchMove = (e: TouchEvent) => {
			e.preventDefault();
		};

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			if (e.ctrlKey) return;

			const forward = vectors.current.forward;
			camera.getWorldDirection(forward);
			forward.y = 0;
			forward.normalize();

			const step = e.deltaY < 0 ? 0.16 : -0.16;
			camera.position.addScaledVector(forward, step);

			const nextX = THREE.MathUtils.clamp(
				camera.position.x,
				bounds.minX,
				bounds.maxX
			);
			const nextZ = THREE.MathUtils.clamp(
				camera.position.z,
				bounds.minZ,
				bounds.maxZ
			);
			camera.position.set(nextX, height, nextZ);
            invalidate();
		};

		const handleKeyDown = (e: KeyboardEvent) => {
            invalidate();
			if (e.code === 'KeyW' || e.code === 'ArrowUp') {
				e.preventDefault();
				keys.current.forward = true;
			}
			if (e.code === 'KeyS' || e.code === 'ArrowDown') {
				e.preventDefault();
				keys.current.backward = true;
			}
			if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
				e.preventDefault();
				keys.current.left = true;
			}
			if (e.code === 'KeyD' || e.code === 'ArrowRight') {
				e.preventDefault();
				keys.current.right = true;
			}

		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.code === 'KeyW' || e.code === 'ArrowUp') {
				e.preventDefault();
				keys.current.forward = false;
			}
			if (e.code === 'KeyS' || e.code === 'ArrowDown') {
				e.preventDefault();
				keys.current.backward = false;
			}
			if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
				e.preventDefault();
				keys.current.left = false;
			}
			if (e.code === 'KeyD' || e.code === 'ArrowRight') {
				e.preventDefault();
				keys.current.right = false;
			}
		};

		canvas.addEventListener('pointerdown', handlePointerDown);
		canvas.addEventListener('pointermove', handlePointerMove);
		canvas.addEventListener('pointerup', stopDragging);
		canvas.addEventListener('pointercancel', stopDragging);
		canvas.addEventListener('lostpointercapture', stopDragging);
		canvas.addEventListener('wheel', handleWheel, { passive: false });
		canvas.addEventListener('touchmove', preventTouchMove, { passive: false });
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			canvas.removeEventListener('pointerdown', handlePointerDown);
			canvas.removeEventListener('pointermove', handlePointerMove);
			canvas.removeEventListener('pointerup', stopDragging);
			canvas.removeEventListener('pointercancel', stopDragging);
			canvas.removeEventListener('lostpointercapture', stopDragging);
			canvas.removeEventListener('wheel', handleWheel);
			canvas.removeEventListener('touchmove', preventTouchMove);
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			onDragChange?.(false);
		};
	}, [camera, gl, invalidate, startPosition, lookAt, onDragChange, bounds, height, constrainView]);

	useFrame((_, frameDelta) => {
        const delta = Math.min(frameDelta, 0.05);
        constrainView();
		camera.rotation.reorder('YXZ');
		camera.rotation.set(pitch.current, yaw.current, 0);

		const direction = vectors.current.direction.set(0, 0, 0);

		if (keys.current.forward) direction.z -= 1;
		if (keys.current.backward) direction.z += 1;
		if (keys.current.left) direction.x -= 1;
		if (keys.current.right) direction.x += 1;

		if (direction.lengthSq() > 0) {
			direction.normalize();

			const forward = vectors.current.forward;
			camera.getWorldDirection(forward);
			forward.y = 0;
			forward.normalize();

			const right = vectors.current.right;
			right.crossVectors(forward, camera.up).normalize();

			camera.position.addScaledVector(forward, -direction.z * speed * delta);
			camera.position.addScaledVector(right, direction.x * speed * delta);
            invalidate();
		}

		const nextX = THREE.MathUtils.clamp(
			camera.position.x,
			bounds.minX,
			bounds.maxX
		);
		const nextZ = THREE.MathUtils.clamp(
			camera.position.z,
			bounds.minZ,
			bounds.maxZ
		);

		camera.position.set(nextX, height, nextZ);

	});

	return null;
}
