import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import React, { act } from 'react';
import * as THREE from 'three';
import { createRoot, extend } from '@react-three/fiber';

test('PC arrows move the actual Character and animate its legs without a parent keyboard listener', async () => {
    const directory = path.resolve('.next', `character-input-test-${process.pid}`);
    fs.mkdirSync(directory, { recursive: true });
    const compile = (source, name) => {
        const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } });
        fs.writeFileSync(path.join(directory, name), output.outputText);
    };
    compile(fs.readFileSync('app/portfolio3d/movement.ts', 'utf8'), 'movement.mjs');
    // Only DOM-only overlays and responsive detection are stubbed; the Character,
    // Three.js objects, React effects and R3F frame callbacks run unchanged.
    const source = fs.readFileSync('app/portfolio3d/objects/Character.tsx', 'utf8')
        .replace("import { Html } from '@react-three/drei';", 'const Html = () => null;')
        .replace("import useMobile from '../useMobile';", 'const useMobile = () => false;')
        .replace("from '../movement'", "from './movement.mjs'");
    compile(source, 'Character.mjs');
    const { default: Character } = await import(pathToFileURL(path.join(directory, 'Character.mjs')).href);

    const previous = { window: globalThis.window, document: globalThis.document, Element: globalThis.Element, IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT };
    globalThis.window = Object.assign(new EventTarget(), { devicePixelRatio: 1, matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
    globalThis.document = Object.assign(new EventTarget(), { hidden: false, querySelector: () => null });
    globalThis.Element = class {};
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    const canvas = Object.assign(new EventTarget(), { width: 800, height: 600, style: {}, getBoundingClientRect: () => ({ width: 800, height: 600, top: 0, left: 0 }) });
    const renderer = {
        domElement: canvas, render() {}, setSize() {}, setPixelRatio() {}, setClearAlpha() {},
        getPixelRatio: () => 1, shadowMap: { enabled: false, type: 0 },
        xr: Object.assign(new EventTarget(), { enabled: false, isPresenting: false, setAnimationLoop() {} }),
        renderLists: { dispose() {} }, forceContextLoss() {}, dispose() {},
    };
    extend(THREE);
    const root = createRoot(canvas);
    let store;
    try {
        await act(async () => {
            await root.configure({ gl: renderer, size: { width: 800, height: 600, top: 0, left: 0 }, dpr: 1, frameloop: 'never' });
            store = root.render(React.createElement(Character));
        });
        const player = store.getState().scene.getObjectByName('player');
        assert(player, 'Character must be mounted in the real Three.js scene');
        let leg;
        player.traverse(child => {
            if (child.type === 'Group' && Math.abs(child.position.x + 0.075) < 1e-6 && child.position.y === 0.02) leg = child;
        });
        assert(leg);
        let time = 0;
        const frames = count => { for (let n = 0; n < count; n++) store.getState().advance(time += 1 / 60); };
        const key = (type, code, value = code) => {
            const event = new Event(type, { cancelable: true });
            Object.defineProperties(event, { code: { value: code }, key: { value } });
            window.dispatchEvent(event);
        };
        key('keydown', 'ArrowRight'); frames(30);
        assert(player.position.x > 1, 'ArrowRight must change the actual player position');
        assert(player.userData.isMoving);
        assert(Math.abs(leg.rotation.x) > 0.02, 'walking must swing the actual leg group');
        key('keyup', 'ArrowRight'); frames(30);
        assert(!player.userData.isMoving);
        assert(Math.abs(leg.rotation.x) < 0.02, 'the leg must settle after key release');

        await act(async () => { player.__r3f.handlers.onClick({ delta: 0, stopPropagation() {} }); });
        const beforeGreetingMove = player.position.z;
        key('keydown', 'ArrowUp'); frames(30);
        assert(player.position.z < beforeGreetingMove - 1, 'a greeting must not lock movement');
        key('keyup', 'ArrowUp');
        const beforeFallback = player.position.x;
        key('keydown', '', 'ArrowLeft'); frames(30);
        assert(player.position.x < beforeFallback - 1, 'key-only arrow events must also move the character');
        key('keyup', '', 'ArrowLeft'); frames(5);
        assert(!player.userData.isMoving);
        console.log('Verified actual player displacement, leg swing, stopping and movement during greeting');
    } finally {
        await act(async () => { root.unmount(); });
        await new Promise(resolve => setTimeout(resolve, 550));
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
        }
    }
});
