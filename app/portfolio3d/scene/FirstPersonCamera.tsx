'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
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
	exitPosition: [number, number, number];
	exitDistance?: number;
	onExitNearChange?: (isNear: boolean) => void;
	onDragChange?: (isDragging: boolean) => void;
	onExit?: () => void;
};

export default function FirstPersonCamera({
	startPosition,
	lookAt,
	height = 1.35,
	speed = 2.2,
	bounds,
	exitPosition,
	exitDistance = 1.15,
	onExitNearChange,
	onDragChange,
	onExit,
}: FirstPersonCameraProps) {
	const { camera, gl } = useThree();

	const keys = useRef({
		forward: false,
		backward: false,
		left: false,
		right: false,
	});

	const yaw = useRef(0);
	const pitch = useRef(0);
	const isDragging = useRef(false);
	const lastPointer = useRef({ x: 0, y: 0 });
	const isExitNear = useRef(false);

	useEffect(() => {
		camera.position.set(...startPosition);
		camera.lookAt(...lookAt);
		camera.rotation.order = 'YXZ';

		yaw.current = camera.rotation.y;
		pitch.current = camera.rotation.x;

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

			pitch.current = THREE.MathUtils.clamp(
				pitch.current,
				-Math.PI / 2.8,
				Math.PI / 2.8
			);
		};

		const stopDragging = (e?: PointerEvent) => {
			if (!isDragging.current) return;

			isDragging.current = false;
			if (e && canvas.hasPointerCapture(e.pointerId)) {
				canvas.releasePointerCapture(e.pointerId);
			}
			onDragChange?.(false);
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'KeyW' || e.code === 'ArrowUp')
				keys.current.forward = true;
			if (e.code === 'KeyS' || e.code === 'ArrowDown')
				keys.current.backward = true;
			if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = true;
			if (e.code === 'KeyD' || e.code === 'ArrowRight')
				keys.current.right = true;

			if (e.code === 'KeyE' && isExitNear.current) {
				onExit?.();
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.code === 'KeyW' || e.code === 'ArrowUp')
				keys.current.forward = false;
			if (e.code === 'KeyS' || e.code === 'ArrowDown')
				keys.current.backward = false;
			if (e.code === 'KeyA' || e.code === 'ArrowLeft')
				keys.current.left = false;
			if (e.code === 'KeyD' || e.code === 'ArrowRight')
				keys.current.right = false;
		};

		canvas.addEventListener('pointerdown', handlePointerDown);
		canvas.addEventListener('pointermove', handlePointerMove);
		canvas.addEventListener('pointerup', stopDragging);
		canvas.addEventListener('pointercancel', stopDragging);
		canvas.addEventListener('lostpointercapture', stopDragging);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			canvas.removeEventListener('pointerdown', handlePointerDown);
			canvas.removeEventListener('pointermove', handlePointerMove);
			canvas.removeEventListener('pointerup', stopDragging);
			canvas.removeEventListener('pointercancel', stopDragging);
			canvas.removeEventListener('lostpointercapture', stopDragging);
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			onDragChange?.(false);
		};
	}, [camera, gl, startPosition, lookAt, onExit, onDragChange]);

	useFrame((_, delta) => {
		camera.rotation.order = 'YXZ';
		camera.rotation.set(pitch.current, yaw.current, 0);

		const direction = new THREE.Vector3();

		if (keys.current.forward) direction.z -= 1;
		if (keys.current.backward) direction.z += 1;
		if (keys.current.left) direction.x -= 1;
		if (keys.current.right) direction.x += 1;

		if (direction.lengthSq() > 0) {
			direction.normalize();

			const forward = new THREE.Vector3();
			camera.getWorldDirection(forward);
			forward.y = 0;
			forward.normalize();

			const right = new THREE.Vector3();
			right.crossVectors(forward, camera.up).normalize();

			camera.position.addScaledVector(forward, -direction.z * speed * delta);
			camera.position.addScaledVector(right, direction.x * speed * delta);
		}

		camera.position.x = THREE.MathUtils.clamp(
			camera.position.x,
			bounds.minX,
			bounds.maxX
		);

		camera.position.z = THREE.MathUtils.clamp(
			camera.position.z,
			bounds.minZ,
			bounds.maxZ
		);

		camera.position.y = height;

		const distance = Math.hypot(
			camera.position.x - exitPosition[0],
			camera.position.z - exitPosition[2]
		);
		const near = distance < exitDistance;

		if (near !== isExitNear.current) {
			isExitNear.current = near;
			onExitNearChange?.(near);
		}
	});

	return null;
}
