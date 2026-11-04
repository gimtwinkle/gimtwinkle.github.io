import test from 'node:test';
import { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const directory = path.resolve('.next', `village-collision-test-${process.pid}`);
fs.mkdirSync(directory, { recursive: true });
const compile = (source, name) => {
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
    fs.writeFileSync(path.join(directory, name), output.outputText);
};
compile(fs.readFileSync('app/portfolio3d/villageLayout.ts', 'utf8'), 'villageLayout.mjs');
compile(fs.readFileSync('app/portfolio3d/villageCollision.ts', 'utf8')
    .replace("from './villageLayout'", "from './villageLayout.mjs'"), 'villageCollision.mjs');
const { resolveVillageMovement } = await import(pathToFileURL(path.join(directory, 'villageCollision.mjs')).href);
after(() => fs.rmSync(directory, { recursive: true, force: true }));

test('movement stops at a house boundary instead of passing through it', () => {
    const house = { x: -4, z: 3, rotation: 0.5, halfWidth: 1.52, characterRadius: 0.3 };
    const cosine = Math.cos(house.rotation);
    const sine = Math.sin(house.rotation);
    const startLocalX = -house.halfWidth - house.characterRadius - 0.05;
    const startX = house.x + cosine * startLocalX;
    const startZ = house.z - sine * startLocalX;
    const result = resolveVillageMovement(startX, startZ, cosine, -sine);
    const localX = cosine * (result.x - house.x) - sine * (result.z - house.z);

    assert(localX < 0, 'the character must remain outside the house');
    assert(Math.abs(localX + house.halfWidth + house.characterRadius) < 1e-8);
});

test('movement slides along an obstacle while preserving the unblocked direction', () => {
    const house = { x: -4, z: 3, rotation: 0.5, halfWidth: 1.52, halfDepth: 1.4, characterRadius: 0.3 };
    const cosine = Math.cos(house.rotation);
    const sine = Math.sin(house.rotation);
    const startLocalX = -house.halfWidth - house.characterRadius - 0.05;
    const startX = house.x + cosine * startLocalX;
    const startZ = house.z - sine * startLocalX;
    const result = resolveVillageMovement(startX, startZ, cosine + sine, -sine + cosine);
    const localX = cosine * (result.x - house.x) - sine * (result.z - house.z);
    const localZ = sine * (result.x - house.x) + cosine * (result.z - house.z);

    assert(Math.abs(localX) <= house.halfWidth + house.characterRadius + 1e-8);
    assert(Math.abs(localZ) <= house.halfDepth + house.characterRadius + 1e-8);
    assert(localX > startLocalX, 'the character must keep moving along the house outline');
});

test('movement remains unchanged when no obstacle is in the way', () => {
    assert.deepEqual(resolveVillageMovement(0, 0, 0.5, -0.25), { x: 0.5, z: -0.25 });
});

test('trees and bushes block the character at their visible locations', () => {
    const tree = resolveVillageMovement(0.2, -8, 0, 1.5);
    const bush = resolveVillageMovement(2.3, 5.7, 2, 0);

    assert(tree.z < -7, `movement must stop at the tree trunk: ${JSON.stringify(tree)}`);
    assert(bush.x < 3.3, `movement must stop at the bush: ${JSON.stringify(bush)}`);
});
