'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

type ModelConfig = {
	name: string;
	url: string;
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number | [number, number, number];
};

type FurnitureModelProps = ModelConfig;

/**
 * 방 기준
 *
 * x: -4 ~ 4
 * z: -3 ~ 3
 *
 * 카메라는 +z 방향에 있고,
 * 정면 프로젝션 벽은 -z 방향에 있음.
 */
const mediaArtFurnitureModels: ModelConfig[] = [
	/**
	 * 중앙 가구 그룹
	 *
	 * 빈백을 중심으로 두고,
	 * 테이블과 수납장을 주변에 모아 배치한다.
	 */
	{
		name: 'beanbag',
		url: '/models/about/beanbag.glb',
		position: [0, 0, 0.42],
		rotation: [0, Math.PI, 0],
		scale: 0.5,
	},
	{
		name: 'rowtable',
		url: '/models/about/rowtable.glb',
		position: [-0.92, 0, 1.02],
		rotation: [-0.04, 0.42, 0],
		scale: 0.58,
	},
	{
		name: 'rowbookcase',
		url: '/models/about/rowbookcase.glb',
		position: [1.25, 0, 0.75],
		rotation: [0, -Math.PI / 2.7, 0],
		scale: 0.46,
	},
	{
		name: 'bedside',
		url: '/models/about/bedside.glb',
		position: [1.28, 0, -0.35],
		rotation: [0, -0.32, 0],
		scale: 0.54,
	},
	{
		name: 'bookcase',
		url: '/models/about/bookcase.glb',
		position: [-1.38, 0, -0.4],
		rotation: [0, Math.PI / 2.8, 0],
		scale: 0.62,
	},

	/**
	 * 왼쪽 벽
	 */
	{
		name: 'window',
		url: '/models/about/window.glb',
		position: [-3.83, 1.72, -1.18],
		rotation: [0, Math.PI / 2, 0],
		scale: 0.92,
	},
	{
		name: 'bookshleve',
		url: '/models/about/bookshleve.glb',
		position: [-3.72, 1.28, 0.52],
		rotation: [0, Math.PI / 2, 0],
		scale: 0.44,
	},

	/**
	 * 오른쪽 벽
	 */
	{
		name: 'board',
		url: '/models/about/board.glb',
		position: [3.78, 1.68, -0.2],
		rotation: [0, -Math.PI / 2, 0],
		scale: 0.7,
	},
];

function FurnitureModel({
	url,
	position,
	rotation,
	scale,
}: FurnitureModelProps) {
	const { scene } = useGLTF(url);

	const clonedScene = useMemo(() => scene.clone(true), [scene]);

	useEffect(() => {
		clonedScene.traverse((object) => {
			if (!(object instanceof THREE.Mesh)) return;

			object.castShadow = true;
			object.receiveShadow = true;

			const materials = Array.isArray(object.material)
				? object.material
				: [object.material];

			materials.forEach((material) => {
				if (!material) return;

				material.side = THREE.FrontSide;
				material.needsUpdate = true;

				if (
					material instanceof THREE.MeshStandardMaterial ||
					material instanceof THREE.MeshPhysicalMaterial
				) {
					material.envMapIntensity = 0.55;
				}
			});
		});
	}, [clonedScene]);

	return (
		<primitive
			object={clonedScene}
			position={position}
			rotation={rotation}
			scale={scale}
		/>
	);
}

export default function MediaArtFurniture() {
	return (
		<group>
			{mediaArtFurnitureModels.map((model) => (
				<FurnitureModel key={model.name} {...model} />
			))}
		</group>
	);
}

mediaArtFurnitureModels.forEach((model) => {
	useGLTF.preload(model.url);
});
