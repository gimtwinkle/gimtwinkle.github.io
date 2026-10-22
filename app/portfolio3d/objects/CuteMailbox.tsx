'use client';

import { Html } from '@react-three/drei';

import RoundedBox from '../components/RoundedBox';

type Props = {
	label: string;
	targetId: string;
	position: [number, number, number];
};

export default function CuteMailbox({ label, targetId, position }: Props) {
	const go = () => {
		document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<group position={position} onClick={go}>
			<RoundedBox
				position={[0, 0.9, 0]}
				args={[1.9, 1.45, 1.55]}
				radius={0.45}
				smoothness={10}
				castShadow
			>
				<meshPhysicalMaterial
					color="#d946ef"
					roughness={0.04}
					clearcoat={1}
					clearcoatRoughness={0}
				/>
			</RoundedBox>

			<mesh position={[0, 1.55, 0]} scale={[1.05, 0.55, 0.9]} castShadow>
				<sphereGeometry args={[1, 48, 48]} />
				<meshPhysicalMaterial color="#a855f7" roughness={0.04} clearcoat={1} />
			</mesh>

			<RoundedBox
				position={[0, 0.45, 0.83]}
				args={[0.58, 0.75, 0.12]}
				radius={0.22}
				smoothness={10}
				castShadow
			>
				<meshPhysicalMaterial color="#7e22ce" roughness={0.08} clearcoat={1} />
			</RoundedBox>

			<RoundedBox
				position={[0, 1.68, 0.82]}
				args={[0.9, 0.45, 0.12]}
				radius={0.12}
				smoothness={8}
				castShadow
			>
				<meshPhysicalMaterial color="#f5d0fe" roughness={0.05} clearcoat={1} />
			</RoundedBox>

			<Html center position={[0, 1.7, 0.92]}>
				<div className="text-xs font-black text-white drop-shadow-[2px_2px_0_#000]">
					CONTACT
				</div>
			</Html>

			<mesh position={[0, 2.25, 0]} rotation={[0, 0, 0.1]} castShadow>
				<boxGeometry args={[0.8, 0.48, 0.08]} />
				<meshPhysicalMaterial color="#fff7ed" roughness={0.05} clearcoat={1} />
			</mesh>

			<Html center position={[0, 2.75, 0]}>
				<div className="rounded-2xl border-4 border-black bg-white px-4 py-2 text-sm font-black shadow-[4px_4px_0_#000]">
					{label}
				</div>
			</Html>
		</group>
	);
}
