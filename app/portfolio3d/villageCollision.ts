import { bushPositions, treePositions } from './villageLayout';

type CircleObstacle = {
    type: 'circle';
    x: number;
    z: number;
    radius: number;
};

type BoxObstacle = {
    type: 'box';
    x: number;
    z: number;
    halfWidth: number;
    halfDepth: number;
    rotation: number;
};

type Obstacle = CircleObstacle | BoxObstacle;

const obstacles: Obstacle[] = [
    { type: 'box', x: -5.8, z: -5.35, halfWidth: 1.52, halfDepth: 1.4, rotation: 0.5 },
    { type: 'box', x: 5.8, z: -5.35, halfWidth: 1.52, halfDepth: 1.4, rotation: -0.5 },
    { type: 'box', x: -4, z: 3, halfWidth: 1.52, halfDepth: 1.4, rotation: 0.5 },
    { type: 'box', x: 5, z: 3, halfWidth: 1.52, halfDepth: 1.4, rotation: -0.5 },
    { type: 'box', x: -2.4, z: -3.7, halfWidth: 0.66, halfDepth: 0.32, rotation: 0.35 },
    { type: 'box', x: 2.4, z: 3.7, halfWidth: 0.66, halfDepth: 0.32, rotation: -2.8 },
    { type: 'circle', x: -1.3, z: 2.5, radius: 0.22 },
    { type: 'circle', x: -3.3, z: -2.9, radius: 0.22 },
    { type: 'circle', x: 3.3, z: -2.9, radius: 0.22 },
    { type: 'circle', x: -3.3, z: 2.9, radius: 0.22 },
    { type: 'circle', x: 3.3, z: 2.9, radius: 0.22 },
    { type: 'circle', x: 0, z: -4, radius: 0.85 },
    { type: 'circle', x: -3.3, z: -5.7, radius: 0.7 },
    { type: 'circle', x: -6.2, z: -3.4, radius: 0.7 },
    { type: 'circle', x: 3.3, z: -5.7, radius: 0.7 },
    { type: 'circle', x: 6.2, z: -3.4, radius: 0.7 },
    { type: 'circle', x: 3.3, z: 5.7, radius: 0.7 },
    { type: 'circle', x: 6.2, z: 3.4, radius: 0.7 },
    ...treePositions.map(([x, z, scale]) => ({ type: 'circle' as const, x, z, radius: 0.23 * scale })),
    ...bushPositions.map(([x, z]) => ({ type: 'circle' as const, x, z, radius: 0.7 })),
];

export function resolveVillageMovement(x: number, z: number, deltaX: number, deltaZ: number, characterRadius = 0.3) {
    let nextX = x;
    let nextZ = z;
    const steps = Math.max(1, Math.ceil(Math.hypot(deltaX, deltaZ) / Math.max(characterRadius * 0.5, 0.05)));
    const stepX = deltaX / steps;
    const stepZ = deltaZ / steps;

    for (let step = 0; step < steps; step++) {
        nextX += stepX;
        nextZ += stepZ;
        for (let iteration = 0; iteration < 3; iteration++) {
            let changed = false;
            for (const obstacle of obstacles) {
                if (obstacle.type === 'circle') {
                    const offsetX = nextX - obstacle.x;
                    const offsetZ = nextZ - obstacle.z;
                    const minimumDistance = obstacle.radius + characterRadius;
                    const distanceSquared = offsetX * offsetX + offsetZ * offsetZ;
                    if (distanceSquared >= minimumDistance * minimumDistance) continue;

                    let distance = Math.sqrt(distanceSquared);
                    let normalX = offsetX;
                    let normalZ = offsetZ;
                    if (distance < 1e-8) {
                        normalX = x - obstacle.x;
                        normalZ = z - obstacle.z;
                        distance = Math.hypot(normalX, normalZ);
                        if (distance < 1e-8) {
                            normalX = -deltaX;
                            normalZ = -deltaZ;
                            distance = Math.hypot(normalX, normalZ) || 1;
                        }
                    }
                    nextX = obstacle.x + normalX / distance * minimumDistance;
                    nextZ = obstacle.z + normalZ / distance * minimumDistance;
                    changed = true;
                    continue;
                }

                const cosine = Math.cos(obstacle.rotation);
                const sine = Math.sin(obstacle.rotation);
                const offsetX = nextX - obstacle.x;
                const offsetZ = nextZ - obstacle.z;
                let localX = cosine * offsetX - sine * offsetZ;
                let localZ = sine * offsetX + cosine * offsetZ;
                const halfWidth = obstacle.halfWidth + characterRadius;
                const halfDepth = obstacle.halfDepth + characterRadius;
                if (Math.abs(localX) >= halfWidth || Math.abs(localZ) >= halfDepth) continue;

                const penetrationX = halfWidth - Math.abs(localX);
                const penetrationZ = halfDepth - Math.abs(localZ);
                if (penetrationX < penetrationZ) {
                    localX = Math.sign(localX || -deltaX) * halfWidth;
                } else {
                    localZ = Math.sign(localZ || -deltaZ) * halfDepth;
                }
                nextX = obstacle.x + cosine * localX + sine * localZ;
                nextZ = obstacle.z - sine * localX + cosine * localZ;
                changed = true;
            }
            if (!changed) break;
        }
    }

    return { x: nextX, z: nextZ };
}
