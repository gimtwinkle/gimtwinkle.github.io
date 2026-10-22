'use client';

import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';

type Placement = readonly [number, number, number];
type Instance = { matrix: THREE.Matrix4; color?: string };

function matrix(position: number[], scale: number | number[] = 1, rotation = [0, 0, 0]) {
    return new THREE.Matrix4().compose(
        new THREE.Vector3(...position),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation as [number, number, number])),
        typeof scale === 'number' ? new THREE.Vector3(scale, scale, scale) : new THREE.Vector3(...scale),
    );
}

function PlantInstances({ items, children }: { items: Instance[]; children: ReactNode }) {
    const ref = useRef<THREE.InstancedMesh>(null);
    useLayoutEffect(() => {
        const mesh = ref.current;
        if (!mesh) return;
        const color = new THREE.Color();
        items.forEach((item, index) => {
            mesh.setMatrixAt(index, item.matrix);
            if (item.color) mesh.setColorAt(index, color.set(item.color));
        });
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        mesh.computeBoundingSphere();
    }, [items]);
    return <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow raycast={() => null}>{children}</instancedMesh>;
}

export function VillageTrees({ placements }: { placements: readonly Placement[] }) {
    const parts = useMemo(() => [0.45, 1, 1.55, 2.05].map((height) => placements.map(([x, z, scale]) => ({
        matrix: matrix([x, height * scale, z], scale),
    }))), [placements]);
    return <group>
        <PlantInstances items={parts[0]}><cylinderGeometry args={[0.16, 0.22, 0.9, 16]} /><meshPhysicalMaterial color="#8b5a2b" roughness={0.45} clearcoat={0.15} /></PlantInstances>
        <PlantInstances items={parts[1]}><coneGeometry args={[0.95, 0.9, 32]} /><meshPhysicalMaterial color="#15803d" roughness={0.28} clearcoat={0.45} /></PlantInstances>
        <PlantInstances items={parts[2]}><coneGeometry args={[0.75, 0.75, 32]} /><meshPhysicalMaterial color="#16a34a" roughness={0.25} clearcoat={0.5} /></PlantInstances>
        <PlantInstances items={parts[3]}><coneGeometry args={[0.55, 0.55, 32]} /><meshPhysicalMaterial color="#22c55e" roughness={0.22} clearcoat={0.55} /></PlantInstances>
    </group>;
}

export function VillageBushes({ placements }: { placements: readonly (readonly [number, number])[] }) {
    const instances = useMemo(() => {
        const volumes: Instance[] = [], leaves: Instance[] = [], centers: Instance[] = [], veins: Instance[] = [];
        const colors = ['#86efac', '#bbf7d0', '#d9f99d', '#4ade80'];
        const sample = (seed: number) => { const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
        placements.forEach(([x, z], bush) => {
            const root = matrix([x, 0, z], bush % 3 === 0 ? 1.15 : 0.9);
            const volumeParts = [
                [[0, 0.32, 0], [1.28, 0.62, 0.78]], [[-0.46, 0.34, 0.02], [0.8, 0.58, 0.7]],
                [[0.46, 0.34, 0.02], [0.8, 0.58, 0.7]], [[0, 0.58, -0.04], [0.82, 0.62, 0.72]],
                [[-0.25, 0.5, 0.18], [0.65, 0.48, 0.5]], [[0.25, 0.5, 0.18], [0.65, 0.48, 0.5]],
            ];
            volumeParts.forEach(([position, scale]) => volumes.push({ matrix: root.clone().multiply(matrix(position, scale)) }));
            for (let leaf = 0; leaf < 10; leaf++) {
                const seed = bush * 100 + leaf * 8;
                const local = matrix([(sample(seed) - 0.5) * 1.35, 0.34 + sample(seed + 1) * 0.65, -0.12 + sample(seed + 2) * 0.75],
                    (0.38 + sample(seed + 6) * 0.28) * 0.8,
                    [-0.75 - sample(seed + 3) * 0.85, (sample(seed + 4) - 0.5) * 0.9, (leaf % 2 === 0 ? -1 : 1) * (0.25 + sample(seed + 5) * 1.8)]);
                const world = root.clone().multiply(local);
                leaves.push({ matrix: world, color: colors[Math.floor(sample(seed + 7) * colors.length)] });
                centers.push({ matrix: world.clone().multiply(matrix([0, -0.03, 0.052], [0.018, 0.36, 0.012])) });
                for (const side of [-1, 1]) for (const y of [-0.06, -0.14]) {
                    veins.push({ matrix: world.clone().multiply(matrix([side * 0.045, y, 0.058], [0.012, 0.13, 0.01], [0, 0, -side * 0.6])) });
                }
            }
        });
        return { volumes, leaves, centers, veins };
    }, [placements]);
    const leafShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.22);
        shape.bezierCurveTo(0.22, 0.12, 0.28, -0.1, 0, -0.28);
        shape.bezierCurveTo(-0.28, -0.1, -0.22, 0.12, 0, 0.22);
        return shape;
    }, []);
    return <group>
        <PlantInstances items={instances.volumes}><sphereGeometry args={[0.55, 32, 32]} /><meshPhysicalMaterial color="#22c55e" roughness={0.42} clearcoat={0.22} /></PlantInstances>
        <PlantInstances items={instances.leaves}><extrudeGeometry args={[leafShape, { depth: 0.035, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 3 }]} /><meshPhysicalMaterial color="white" roughness={0.36} clearcoat={0.35} side={THREE.DoubleSide} /></PlantInstances>
        <PlantInstances items={instances.centers}><boxGeometry /><meshStandardMaterial color="#84cc16" /></PlantInstances>
        <PlantInstances items={instances.veins}><boxGeometry /><meshStandardMaterial color="#bef264" /></PlantInstances>
    </group>;
}
