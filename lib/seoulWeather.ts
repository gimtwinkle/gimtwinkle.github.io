export type WeatherKind = 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog';
export type SeoulWeather = {
    kind: WeatherKind;
    cloudCover: number;
    intensity: number;
    observedAt: number;
};

export const WEATHER_REFRESH_MS = 10 * 60 * 1000;
export const WEATHER_MAX_AGE_MS = 60 * 60 * 1000;
export const SEOUL_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=weather_code,cloud_cover,precipitation,snowfall&timeformat=unixtime&timezone=Asia%2FSeoul&forecast_days=1';
export const weatherLabels: Record<WeatherKind, string> = {
    clear: '맑음', cloudy: '흐림', rain: '비', snow: '눈', fog: '안개',
};

const snowCodes = new Set([71, 73, 75, 77, 85, 86]);
const rainCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 97, 99]);

// WMO codes: https://open-meteo.com/en/docs
export function parseSeoulWeather(payload: unknown, now = Date.now()): SeoulWeather | null {
    if (!payload || typeof payload !== 'object' || !('current' in payload)) return null;
    const current = payload.current;
    if (!current || typeof current !== 'object') return null;
    const data = current as Record<string, unknown>;
    const { weather_code: code, cloud_cover: cover, time, precipitation, snowfall } = data;
    if (typeof code !== 'number' || !Number.isInteger(code)
        || typeof cover !== 'number' || !Number.isFinite(cover) || cover < 0 || cover > 100
        || typeof time !== 'number' || !Number.isFinite(time)
        || typeof precipitation !== 'number' || !Number.isFinite(precipitation) || precipitation < 0
        || typeof snowfall !== 'number' || !Number.isFinite(snowfall) || snowfall < 0) return null;
    const observedAt = time * 1000;
    if (now - observedAt > WEATHER_MAX_AGE_MS || observedAt - now > 15 * 60 * 1000) return null;
    if (![0, 1, 2, 3, 45, 48].includes(code) && !snowCodes.has(code) && !rainCodes.has(code)) return null;
    const kind: WeatherKind = snowCodes.has(code) || snowfall > 0 ? 'snow'
        : rainCodes.has(code) || precipitation > 0 ? 'rain'
        : code === 45 || code === 48 ? 'fog'
        : code >= 2 || cover >= 50 ? 'cloudy' : 'clear';
    return {
        kind,
        cloudCover: kind === 'clear' ? cover / 100 : Math.max(0.65, cover / 100),
        intensity: Math.min(1, Math.max(0.25, kind === 'snow' ? snowfall / 0.5 : precipitation / 3)),
        observedAt,
    };
}
