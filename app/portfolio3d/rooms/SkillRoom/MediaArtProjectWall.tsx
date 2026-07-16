'use client';

import { RoundedBox } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

import ArtworkContents, { ArtworkType } from './ArtworkContents';

type ProjectionAreaProps = {
	type: ArtworkType;
	position: [number, number, number];
	color: string;
	onSelect?: (type: ArtworkType) => void;
};

function ProjectionArea({
	type,
	position,
	color,
	onSelect,
}: ProjectionAreaProps) {
	const [hovered, setHovered] = useState(false);

	return (
		<group
			position={position}
			scale={hovered ? 1.018 : 1}
			onPointerEnter={(event) => {
				event.stopPropagation();
				setHovered(true);
				document.body.style.cursor = 'pointer';
			}}
			onPointerLeave={() => {
				setHovered(false);
				document.body.style.cursor = 'default';
			}}
			onClick={(event) => {
				event.stopPropagation();
				onSelect?.(type);
			}}
		>
			<RoundedBox
				args={[1.48, 2.25, 0.018]}
				radius={0.18}
				smoothness={12}
				position={[0, 0, -0.02]}
			>
				<meshBasicMaterial
					color={color}
					transparent
					opacity={hovered ? 0.048 : 0.022}
					depthWrite={false}
					blending={THREE.AdditiveBlending}
				/>
			</RoundedBox>

			<group position={[0, 0, 0.025]} scale={0.79}>
				<ArtworkContents
					type={type}
					color={color}
					cycleKey={`${type}-${hovered}`}
				/>
			</group>
		</group>
	);
}

type MediaArtProjectWallProps = {
	showPanels?: boolean;
	onSelectProject?: (type: ArtworkType) => void;
};

export default function MediaArtProjectWall({
	showPanels = true,
	onSelectProject,
}: MediaArtProjectWallProps) {
	return (
		<group position={[0.72, 1.72, -2.76]}>
			{showPanels && (
				<group>
					<ProjectionArea
						type="frontend"
						position={[-1.67, 0, 0]}
						color="#76dcff"
						onSelect={onSelectProject}
					/>

					<ProjectionArea
						type="uiux"
						position={[0, 0, 0]}
						color="#ff9ed7"
						onSelect={onSelectProject}
					/>

					<ProjectionArea
						type="creative"
						position={[1.67, 0, 0]}
						color="#bd9cff"
						onSelect={onSelectProject}
					/>
				</group>
			)}
		</group>
	);
}
