'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Lottie from 'lottie-react';
import { useRef } from 'react';
import * as THREE from 'three';

export type FloatingLottieProps = {
	animationData: object;
	position: [number, number, number];
	size?: number;
	floatSpeed?: number;
	floatAmount?: number;
	delay?: number;
	distanceFactor?: number;
	glowColor?: string;
	cycleDuration?: number;
	hologramOpacity?: number;
};

function smoothStep(edge0: number, edge1: number, value: number) {
	const x = THREE.MathUtils.clamp(
		(value - edge0) / Math.max(edge1 - edge0, 0.0001),
		0,
		1
	);

	return x * x * (3 - 2 * x);
}

export default function FloatingLottie({
	animationData,
	position,
	size = 90,
	floatSpeed = 1,
	floatAmount = 0.07,
	delay = 0,
	distanceFactor = 4,
	glowColor = 'rgba(120,225,255,0.45)',
	cycleDuration = 7.2,
	hologramOpacity = 0.72,
}: FloatingLottieProps) {
	const groupRef = useRef<THREE.Group>(null);
	const elementRef = useRef<HTMLDivElement>(null);
	const ghostRef = useRef<HTMLDivElement>(null);
	const scanRef = useRef<HTMLDivElement>(null);

	const initialY = position[1];

	useFrame((state) => {
		if (!groupRef.current) return;

		const time = state.clock.elapsedTime;

		// 아이콘별로 서로 다른 속도와 높이로 부유
		groupRef.current.position.y =
			initialY + Math.sin((time + delay) * floatSpeed) * floatAmount;

		groupRef.current.rotation.set(0, 0, 0);

		// 아이콘마다 등장 시점을 다르게 하기 위해 delay 포함
		const localTime =
			(((time + delay) % cycleDuration) + cycleDuration) % cycleDuration;

		const fadeIn = smoothStep(0, 1.3, localTime);
		const fadeOut = 1 - smoothStep(4.8, 6.2, localTime);
		const opacity = Math.min(fadeIn, fadeOut);

		const translateY = (1 - opacity) * 13;
		const scale = 0.95 + opacity * 0.05;
		const blur = (1 - opacity) * 2.4 + 0.35;

		const flicker = 0.94 + Math.sin(time * 13 + delay * 2.5) * 0.025;

		const finalOpacity = opacity * hologramOpacity * flicker;

		if (elementRef.current) {
			elementRef.current.style.opacity = String(finalOpacity);

			elementRef.current.style.transform = `
				translateY(${translateY}px)
				scale(${scale})
			`;

			elementRef.current.style.filter =
				`brightness(1.35) saturate(1.15) ` +
				`blur(${blur}px) ` +
				`drop-shadow(0 0 5px ${glowColor}) ` +
				`drop-shadow(0 0 14px ${glowColor})`;
		}

		if (ghostRef.current) {
			ghostRef.current.style.opacity = String(opacity * 0.18);

			ghostRef.current.style.transform = `
				translate(
					${Math.sin(time * 1.8 + delay) * 2}px,
					${Math.cos(time * 1.4 + delay) * 1.5}px
				)
				scale(${1.01 + opacity * 0.015})
			`;

			ghostRef.current.style.filter =
				`blur(3px) brightness(1.5) ` + `drop-shadow(0 0 18px ${glowColor})`;
		}

		if (scanRef.current) {
			const scanY = ((time * 34 + delay * 18) % 130) - 15;

			scanRef.current.style.transform = `translateY(${scanY}px)`;
			scanRef.current.style.opacity = String(opacity * 0.28);
		}
	});

	return (
		<group ref={groupRef} position={position}>
			<Html
				transform
				center
				distanceFactor={distanceFactor}
				style={{
					pointerEvents: 'none',
					userSelect: 'none',
				}}
			>
				<div
					style={{
						position: 'relative',
						width: `${size}px`,
						height: `${size}px`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						overflow: 'hidden',
						borderRadius: '18px',
						mixBlendMode: 'screen',
					}}
				>
					{/* 흐릿한 잔상 */}
					<div
						ref={ghostRef}
						style={{
							position: 'absolute',
							inset: 0,
							opacity: 0,
							pointerEvents: 'none',
							mixBlendMode: 'screen',
							willChange: 'opacity, transform, filter',
						}}
					>
						<Lottie
							animationData={animationData}
							loop
							autoplay
							rendererSettings={{
								preserveAspectRatio: 'xMidYMid meet',
							}}
							style={{
								width: '100%',
								height: '100%',
							}}
						/>
					</div>

					{/* 메인 홀로그램 아이콘 */}
					<div
						ref={elementRef}
						style={{
							position: 'absolute',
							inset: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							opacity: 0,
							transform: 'translateY(13px) scale(0.95)',
							filter:
								`brightness(1.35) blur(2px) ` +
								`drop-shadow(0 0 6px ${glowColor})`,
							mixBlendMode: 'screen',
							willChange: 'opacity, transform, filter',
						}}
					>
						<Lottie
							animationData={animationData}
							loop
							autoplay
							rendererSettings={{
								preserveAspectRatio: 'xMidYMid meet',
							}}
							style={{
								width: '100%',
								height: '100%',
							}}
						/>
					</div>

					{/* 미세한 수평 스캔라인 */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							pointerEvents: 'none',
							opacity: 0.2,
							background:
								'repeating-linear-gradient(' +
								'to bottom,' +
								'rgba(180,245,255,0.13) 0px,' +
								'rgba(180,245,255,0.13) 1px,' +
								'transparent 1px,' +
								'transparent 4px' +
								')',
							mixBlendMode: 'screen',
						}}
					/>

					{/* 위에서 아래로 흐르는 스캔 빛 */}
					<div
						ref={scanRef}
						style={{
							position: 'absolute',
							left: '-8%',
							right: '-8%',
							top: 0,
							height: '24px',
							opacity: 0,
							pointerEvents: 'none',
							background:
								'linear-gradient(' +
								'to bottom,' +
								'transparent,' +
								'rgba(210,252,255,0.38),' +
								'transparent' +
								')',
							filter: 'blur(3px)',
							mixBlendMode: 'screen',
							willChange: 'opacity, transform',
						}}
					/>

					{/* 외곽의 약한 유리막 */}
					<div
						style={{
							position: 'absolute',
							inset: '7%',
							borderRadius: '16px',
							border: `1px solid ${glowColor}`,
							opacity: 0.1,
							boxShadow:
								`inset 0 0 12px ${glowColor}, ` + `0 0 16px ${glowColor}`,
							pointerEvents: 'none',
							mixBlendMode: 'screen',
						}}
					/>
				</div>
			</Html>
		</group>
	);
}
