'use client';

import { RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import * as THREE from 'three';

type MediaArtArchWallProps = {
	position?: [number, number, number];
	rotation?: [number, number, number];

	totalWidth?: number;
	height?: number;

	screenWidth?: number;
	rightWallWidth?: number;

	depth?: number;
	recessDepth?: number;

	screenRadius?: number;
	outerRadius?: number;

	screenColor?: string;
	rightWallColor?: string;

	showProjectionSurface?: boolean;
	showDivider?: boolean;

	children?: ReactNode;
};

type RoundedPathOptions = {
	width: number;
	height: number;
	radius: number;
	centerX?: number;
	centerY?: number;
	reverse?: boolean;
};

/**
 * XY 평면 위에 둥근 사각형 Path를 만듭니다.
 *
 * reverse가 false면 일반적인 외곽선 방향,
 * reverse가 true면 구멍에 사용하기 위한 반대 방향입니다.
 */
function createRoundedRectanglePath({
	width,
	height,
	radius,
	centerX = 0,
	centerY = 0,
	reverse = false,
}: RoundedPathOptions) {
	const halfWidth = width / 2;
	const halfHeight = height / 2;

	const safeRadius = Math.max(
		0.001,
		Math.min(radius, halfWidth - 0.001, halfHeight - 0.001)
	);

	const left = centerX - halfWidth;
	const right = centerX + halfWidth;
	const bottom = centerY - halfHeight;
	const top = centerY + halfHeight;

	const path = reverse ? new THREE.Path() : new THREE.Shape();

	if (!reverse) {
		path.moveTo(left + safeRadius, bottom);

		path.lineTo(right - safeRadius, bottom);
		path.quadraticCurveTo(right, bottom, right, bottom + safeRadius);

		path.lineTo(right, top - safeRadius);
		path.quadraticCurveTo(right, top, right - safeRadius, top);

		path.lineTo(left + safeRadius, top);
		path.quadraticCurveTo(left, top, left, top - safeRadius);

		path.lineTo(left, bottom + safeRadius);
		path.quadraticCurveTo(left, bottom, left + safeRadius, bottom);
	} else {
		/*
		 * hole은 외곽선과 반대 방향으로 생성합니다.
		 */
		path.moveTo(left + safeRadius, bottom);

		path.quadraticCurveTo(left, bottom, left, bottom + safeRadius);

		path.lineTo(left, top - safeRadius);
		path.quadraticCurveTo(left, top, left + safeRadius, top);

		path.lineTo(right - safeRadius, top);
		path.quadraticCurveTo(right, top, right, top - safeRadius);

		path.lineTo(right, bottom + safeRadius);
		path.quadraticCurveTo(right, bottom, right - safeRadius, bottom);

		path.lineTo(left + safeRadius, bottom);
	}

	path.closePath();

	return path;
}

export default function MediaArtArchWall({
	position = [0, 1.82, -2.9],
	rotation = [0, 0, 0],

	totalWidth = 9,
	height = 3.35,

	screenWidth = 6.05,
	rightWallWidth = 2.55,

	depth = 0.2,

	/*
	 * 화면이 벽 앞면에서 얼마나 뒤로 들어갈지 결정합니다.
	 * 값을 키울수록 음각이 깊어집니다.
	 */
	recessDepth = 0.16,

	screenRadius = 0.42,
	outerRadius = 0.28,

	screenColor = '#9d82a5',
	rightWallColor = '#b997ba',

	showProjectionSurface = true,
	showDivider = false,

	children,
}: MediaArtArchWallProps) {
	const leftMargin = 0.18;
	const rightMargin = 0.22;
	const screenWallGap = 0.12;

	const topMargin = 0.2;
	const bottomMargin = 0.24;

	const requiredWidth =
		leftMargin + screenWidth + screenWallGap + rightWallWidth + rightMargin;

	const resolvedTotalWidth = Math.max(totalWidth, requiredWidth);

	const leftEdge = -resolvedTotalWidth / 2;

	const screenCenterX = leftEdge + leftMargin + screenWidth / 2;

	const rightWallStartX = leftEdge + leftMargin + screenWidth + screenWallGap;

	const rightWallCenterX = rightWallStartX + rightWallWidth / 2;

	const screenHeight = height - topMargin - bottomMargin;

	const screenCenterY = (bottomMargin - topMargin) / 2;

	/*
	 * ExtrudeGeometry는 기본적으로 XY 평면에서 +Z 방향으로 생성됩니다.
	 *
	 * geometry를 z = -depth / 2에 배치하면:
	 * 뒤쪽 = -depth / 2
	 * 앞쪽 = +depth / 2
	 */
	const frontZ = depth / 2;
	const backZ = -depth / 2;

	/*
	 * 실제 프로젝션 패널은 벽 앞면보다 뒤에 배치합니다.
	 */
	const resolvedRecessDepth = THREE.MathUtils.clamp(
		recessDepth,
		0.04,
		depth + 0.35
	);

	const screenSurfaceZ = frontZ - resolvedRecessDepth;

	const wallGeometry = useMemo(() => {
		const wallShape = createRoundedRectanglePath({
			width: resolvedTotalWidth,
			height,
			radius: outerRadius,
		}) as THREE.Shape;

		const screenHole = createRoundedRectanglePath({
			width: screenWidth,
			height: screenHeight,
			radius: screenRadius,
			centerX: screenCenterX,
			centerY: screenCenterY,
			reverse: true,
		}) as THREE.Path;

		wallShape.holes.push(screenHole);

		const geometry = new THREE.ExtrudeGeometry(wallShape, {
			depth,
			steps: 1,

			/*
			 * 벽 바깥 전체가 과하게 둥글어지지 않도록
			 * bevel은 끕니다.
			 *
			 * 화면 구멍 안쪽의 깊이는 Extrude 자체로 생깁니다.
			 */
			bevelEnabled: false,

			curveSegments: 20,
		});

		geometry.translate(0, 0, -depth / 2);
		geometry.computeVertexNormals();

		return geometry;
	}, [
		depth,
		height,
		outerRadius,
		resolvedTotalWidth,
		screenCenterX,
		screenCenterY,
		screenHeight,
		screenRadius,
		screenWidth,
	]);

	return (
		<group position={position} rotation={rotation}>
			{/*
			 * 실제로 구멍이 뚫린 벽
			 *
			 * 앞면에 화면을 올리는 게 아니라
			 * geometry 자체에 hole이 들어가 있습니다.
			 */}
			<mesh geometry={wallGeometry} castShadow receiveShadow>
				<meshStandardMaterial
					color={rightWallColor}
					roughness={0.9}
					metalness={0}
					side={THREE.DoubleSide}
				/>
			</mesh>

			{/*
			 * 아치 구멍 뒤에 위치하는 프로젝션 화면
			 *
			 * 벽 앞면보다 recessDepth만큼 뒤에 있어
			 * 정면에서 음각 깊이가 보입니다.
			 */}
			<RoundedBox
				args={[screenWidth - 0.025, screenHeight - 0.025, 0.035]}
				radius={Math.max(screenRadius - 0.025, 0.04)}
				smoothness={18}
				position={[screenCenterX, screenCenterY, screenSurfaceZ]}
				receiveShadow
			>
				<meshStandardMaterial
					color={screenColor}
					roughness={0.5}
					metalness={0.01}
					emissive="#28152f"
					emissiveIntensity={0.09}
				/>
			</RoundedBox>

			{/*
			 * 음각 안쪽의 부드러운 그림자
			 *
			 * 구멍보다 약간 작은 검은 면을 화면보다 살짝 앞으로 배치해
			 * 내부 가장자리에 그림자가 맺히도록 합니다.
			 */}
			<RoundedBox
				args={[screenWidth - 0.04, screenHeight - 0.04, 0.008]}
				radius={Math.max(screenRadius - 0.035, 0.04)}
				smoothness={18}
				position={[screenCenterX, screenCenterY, screenSurfaceZ + 0.022]}
			>
				<meshBasicMaterial
					color="#2b1830"
					transparent
					opacity={0.11}
					depthWrite={false}
				/>
			</RoundedBox>

			{/*
			 * 화면과 오른쪽 벽 경계 표시
			 *
			 * 기본적으로 필요 없지만 showDivider=true일 때만 표시됩니다.
			 */}
			{showDivider && (
				<RoundedBox
					args={[0.018, screenHeight - 0.26, 0.012]}
					radius={0.008}
					smoothness={4}
					position={[
						rightWallStartX - screenWallGap / 2,
						screenCenterY,
						frontZ + 0.008,
					]}
				>
					<meshBasicMaterial color="#755a79" transparent opacity={0.24} />
				</RoundedBox>
			)}

			{/*
			 * 음각 상단 그림자를 강조하는 조명
			 *
			 * 화면 바깥이 아니라 아치 내부를 비추도록
			 * z 위치를 화면 쪽으로 넣었습니다.
			 */}
			<pointLight
				position={[screenCenterX, height / 2 - 0.32, screenSurfaceZ + 0.24]}
				color="#dfc0ff"
				intensity={0.24}
				distance={3.2}
				decay={2}
			/>

			{/* 오른쪽 벽의 따뜻한 가구 조명 */}
			<pointLight
				position={[rightWallCenterX, 0.25, frontZ + 0.65]}
				color="#ffc38c"
				intensity={0.34}
				distance={3.4}
				decay={2}
			/>

			{/*
			 * 프로젝션 콘텐츠
			 *
			 * 벽 앞쪽이 아닌 실제로 파인 화면 표면 근처에 배치합니다.
			 */}
			{children && (
				<group
					position={[screenCenterX, screenCenterY, screenSurfaceZ + 0.055]}
				>
					{children}
				</group>
			)}
		</group>
	);
}
