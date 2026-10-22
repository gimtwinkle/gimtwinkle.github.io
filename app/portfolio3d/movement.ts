type Axes = { x: number; z: number };
const keys = new Set<string>();
const joystick: Axes = { x: 0, z: 0 };
const listeners = new Set<() => void>();
const movementCodes = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD']);
const notify = () => listeners.forEach((listener) => listener());

export function setJoystick(x: number, z: number) {
    joystick.x = x;
    joystick.z = z;
    notify();
}

export function resetMovement() {
    keys.clear();
    setJoystick(0, 0);
}

export function readMovement<T extends Axes>(output: T, pressedKeys = keys): T {
    output.x = joystick.x + Number(pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight')) - Number(pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft'));
    output.z = joystick.z + Number(pressedKeys.has('KeyS') || pressedKeys.has('ArrowDown')) - Number(pressedKeys.has('KeyW') || pressedKeys.has('ArrowUp'));
    const length = Math.hypot(output.x, output.z);
    if (length > 1) { output.x /= length; output.z /= length; }
    return output;
}

export function subscribeMovement(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

export function attachMovementKeyboard(pressedKeys = keys) {
    const keyCode = (event: KeyboardEvent) => {
        if (movementCodes.has(event.code)) return event.code;
        const key = event.key?.toLowerCase();
        return ({ arrowup: 'ArrowUp', arrowdown: 'ArrowDown', arrowleft: 'ArrowLeft', arrowright: 'ArrowRight', w: 'KeyW', a: 'KeyA', s: 'KeyS', d: 'KeyD' } as Record<string, string>)[key];
    };
    const resetKeys = () => { pressedKeys.clear(); setJoystick(0, 0); };
    const down = (event: KeyboardEvent) => {
        const code = keyCode(event);
        if (!code || event.altKey || event.ctrlKey || event.metaKey) return;
        if (document.querySelector('dialog[open]') || (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]'))) return;
        event.preventDefault();
        pressedKeys.add(code);
        notify();
    };
    const up = (event: KeyboardEvent) => {
        if (pressedKeys.delete(keyCode(event))) { event.preventDefault(); notify(); }
    };
    const visibility = () => { if (document.hidden) resetKeys(); };
    // Capture also receives arrows when a tutorial button still has keyboard focus.
    window.addEventListener('keydown', down, { capture: true });
    window.addEventListener('keyup', up, { capture: true });
    window.addEventListener('blur', resetKeys);
    document.addEventListener('visibilitychange', visibility);
    return () => {
        window.removeEventListener('keydown', down, { capture: true });
        window.removeEventListener('keyup', up, { capture: true });
        window.removeEventListener('blur', resetKeys);
        document.removeEventListener('visibilitychange', visibility);
        resetKeys();
    };
}
