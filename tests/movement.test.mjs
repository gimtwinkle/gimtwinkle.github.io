import test from 'node:test';
import assert from 'node:assert/strict';
import { attachMovementKeyboard, readMovement, resetMovement, setJoystick, subscribeMovement } from '../app/portfolio3d/movement.ts';

test('keyboard and joystick movement survives UI focus, releases safely and limits diagonal speed', () => {
    const previous = { window: globalThis.window, document: globalThis.document, Element: globalThis.Element };
    const captures = [];
    class BrowserWindow extends EventTarget {
        addEventListener(type, listener, options) {
            if (type === 'keydown') captures.push(options);
            super.addEventListener(type, listener, options);
        }
    }
    class FocusedElement { constructor(typing = false) { this.typing = typing; } closest() { return this.typing ? this : null; } }
    let dialogOpen = false;
    globalThis.window = new BrowserWindow();
    globalThis.document = Object.assign(new EventTarget(), { hidden: false, querySelector: () => dialogOpen ? {} : null });
    globalThis.Element = FocusedElement;
    const input = (type, code, target = new FocusedElement()) => {
        const event = new Event(type, { cancelable: true });
        Object.defineProperties(event, { code: { value: code }, target: { value: target } });
        window.dispatchEvent(event);
        return event;
    };
    const axes = () => readMovement({ x: 0, z: 0 });
    const cleanup = attachMovementKeyboard();
    let notifications = 0;
    const unsubscribe = subscribeMovement(() => notifications++);
    try {
        assert.equal(captures[0]?.capture, true, 'focused tutorial buttons must not swallow movement keys');
        assert.equal(input('keydown', 'ArrowUp').defaultPrevented, true);
        assert.deepEqual(axes(), { x: 0, z: -1 });
        input('keydown', 'ArrowRight');
        assert(Math.abs(Math.hypot(...Object.values(axes())) - 1) < 1e-9, 'diagonal speed must match straight-line speed');
        input('keyup', 'ArrowUp');
        assert.deepEqual(axes(), { x: 1, z: 0 });
        input('keyup', 'ArrowRight');
        input('keydown', 'KeyA');
        assert.deepEqual(axes(), { x: -1, z: 0 });
        input('keyup', 'KeyA');

        setJoystick(0.3, -0.4);
        assert.deepEqual(axes(), { x: 0.3, z: -0.4 }, 'partial stick deflection must preserve slow walking');
        setJoystick(2, 2);
        assert(Math.hypot(...Object.values(axes())) <= 1 + 1e-9);
        setJoystick(0, 0);
        assert.deepEqual(axes(), { x: 0, z: 0 }, 'releasing or cancelling a pointer must stop movement');

        input('keydown', 'ArrowUp', new FocusedElement(true));
        assert.deepEqual(axes(), { x: 0, z: 0 }, 'typing must not move the character');
        dialogOpen = true;
        input('keydown', 'ArrowUp');
        assert.deepEqual(axes(), { x: 0, z: 0 }, 'a letter or project dialog must keep keyboard focus');
        dialogOpen = false;
        input('keydown', 'ArrowUp');
        setJoystick(1, 0);
        window.dispatchEvent(new Event('blur'));
        assert.deepEqual(axes(), { x: 0, z: 0 });
        input('keydown', 'KeyW');
        document.hidden = true;
        document.dispatchEvent(new Event('visibilitychange'));
        assert.deepEqual(axes(), { x: 0, z: 0 }, 'tab changes must not leave a stuck key');
        assert(notifications > 0, 'input must wake rooms that render only on demand');
        cleanup();
        input('keydown', 'ArrowUp');
        assert.deepEqual(axes(), { x: 0, z: 0 });
    } finally {
        cleanup(); unsubscribe(); resetMovement();
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
        }
    }
});
