import * as THREE from 'three';
import { mergeBufferGeometries } from 'three-stdlib';

let petals: THREE.BufferGeometry | undefined;
const materials = new Map<string, THREE.MeshPhysicalMaterial>();

export function getFlowerPetals() {
    if (petals) return petals;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.22);
    shape.bezierCurveTo(0.14, 0.18, 0.18, -0.02, 0, -0.22);
    shape.bezierCurveTo(-0.18, -0.02, -0.14, 0.18, 0, 0.22);
    const base = new THREE.ExtrudeGeometry(shape, {
        depth: 0.035, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 3,
    });
    const vertices = base.attributes.position;
    for (let index = 0; index < vertices.count; index++) {
        const x = vertices.getX(index), y = vertices.getY(index), z = vertices.getZ(index);
        vertices.setZ(index, z + Math.sin(y * 18) * 0.012 + Math.abs(x) * 0.025);
    }
    base.computeVertexNormals();
    const ring = Array.from({ length: 6 }, (_, index) => {
        const angle = Math.PI * 2 * index / 6;
        return base.clone().scale(0.72, 0.72, 0.72).rotateZ(angle - Math.PI / 2)
            .translate(Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0);
    });
    const merged = mergeBufferGeometries(ring);
    base.dispose();
    ring.forEach((geometry) => geometry.dispose());
    if (!merged) throw new Error('Could not merge flower petals');
    petals = merged;
    return petals;
}

export function getFlowerMaterial(color: string) {
    let material = materials.get(color);
    if (!material) {
        material = new THREE.MeshPhysicalMaterial({ color, roughness: 0.28, clearcoat: 0.75, side: THREE.DoubleSide });
        materials.set(color, material);
    }
    return material;
}
