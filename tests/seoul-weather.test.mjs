import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSeoulWeather, WEATHER_MAX_AGE_MS } from '../lib/seoulWeather.ts';

const now = Date.UTC(2026, 9, 23, 3);
const payload = (code, fields = {}) => ({ current: {
    time: now / 1000, weather_code: code, cloud_cover: 10, precipitation: 0, snowfall: 0, ...fields,
} });

test('Seoul weather distinguishes rain, snow, cloud, fog and clear WMO conditions', () => {
    for (const code of [0, 1]) assert.equal(parseSeoulWeather(payload(code), now).kind, 'clear');
    for (const code of [2, 3]) assert.equal(parseSeoulWeather(payload(code), now).kind, 'cloudy');
    for (const code of [45, 48]) assert.equal(parseSeoulWeather(payload(code), now).kind, 'fog');
    for (const code of [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 97, 99]) {
        assert.equal(parseSeoulWeather(payload(code), now).kind, 'rain', `WMO ${code}`);
    }
    for (const code of [71, 73, 75, 77, 85, 86]) assert.equal(parseSeoulWeather(payload(code), now).kind, 'snow', `WMO ${code}`);
    assert.equal(parseSeoulWeather(payload(1, { cloud_cover: 80 }), now).kind, 'cloudy');
    assert.equal(parseSeoulWeather(payload(2, { precipitation: 1 }), now).kind, 'rain');
    assert.equal(parseSeoulWeather(payload(61, { precipitation: 1, snowfall: 0.1 }), now).kind, 'snow');
    assert(parseSeoulWeather(payload(61, { precipitation: 2 }), now).intensity > parseSeoulWeather(payload(51), now).intensity);
    assert.equal(parseSeoulWeather(payload(65, { precipitation: 100 }), now).intensity, 1);
});

test('invalid, missing and expired weather cannot become a live scene condition', () => {
    for (const data of [null, {}, { current: {} }, payload(999), payload(0, { cloud_cover: null }),
        payload(0, { cloud_cover: 101 }), payload(0, { snowfall: -1 }), payload(0, { precipitation: NaN }),
        payload(0, { time: (now - WEATHER_MAX_AGE_MS - 1) / 1000 }), payload(0, { time: (now + 3600000) / 1000 })]) {
        assert.equal(parseSeoulWeather(data, now), null);
    }
    assert(parseSeoulWeather(payload(0, { time: (now - WEATHER_MAX_AGE_MS) / 1000 }), now));
});
