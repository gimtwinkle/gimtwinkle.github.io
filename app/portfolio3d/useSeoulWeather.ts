'use client';

import { useEffect, useState } from 'react';
import { parseSeoulWeather, SEOUL_WEATHER_URL, WEATHER_MAX_AGE_MS, WEATHER_REFRESH_MS, type SeoulWeather } from '@/lib/seoulWeather';

const cacheKey = 'twinkle-seoul-weather-v1';

export default function useSeoulWeather() {
    const [weather, setWeather] = useState<SeoulWeather | null>(null);
    useEffect(() => {
        let disposed = false;
        let lastFetch = 0;
        let request: AbortController | null = null;
        try {
            const cached = JSON.parse(localStorage.getItem(cacheKey) ?? 'null');
            const parsed = parseSeoulWeather(cached?.payload);
            if (parsed) {
                queueMicrotask(() => { if (!disposed) setWeather(parsed); });
                if (typeof cached.fetchedAt === 'number' && cached.fetchedAt <= Date.now()) lastFetch = cached.fetchedAt;
            }
        } catch { /* Storage may be disabled; weather still works without caching. */ }

        const refresh = async () => {
            if (disposed) return;
            setWeather(previous => previous && Date.now() - previous.observedAt <= WEATHER_MAX_AGE_MS ? previous : null);
            if (disposed || document.hidden || request || Date.now() - lastFetch < WEATHER_REFRESH_MS) return;
            const controller = new AbortController();
            request = controller;
            const timeout = window.setTimeout(() => controller.abort(), 8000);
            try {
                const response = await fetch(SEOUL_WEATHER_URL, { signal: controller.signal, cache: 'no-store' });
                if (!response.ok) throw new Error('Weather unavailable');
                const payload: unknown = await response.json();
                const parsed = parseSeoulWeather(payload);
                if (!parsed) throw new Error('Invalid weather response');
                if (disposed) return;
                lastFetch = Date.now();
                setWeather(parsed);
                try { localStorage.setItem(cacheKey, JSON.stringify({ payload, fetchedAt: lastFetch })); } catch { /* Optional cache. */ }
            } catch {
                if (!disposed) setWeather(previous => previous && Date.now() - previous.observedAt <= WEATHER_MAX_AGE_MS ? previous : null);
            } finally {
                window.clearTimeout(timeout);
                request = null;
            }
        };
        queueMicrotask(() => { void refresh(); });
        const interval = window.setInterval(() => { void refresh(); }, WEATHER_REFRESH_MS);
        const onVisible = () => { if (!document.hidden) void refresh(); };
        window.addEventListener('focus', onVisible);
        window.addEventListener('online', onVisible);
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            disposed = true;
            request?.abort();
            window.clearInterval(interval);
            window.removeEventListener('focus', onVisible);
            window.removeEventListener('online', onVisible);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, []);
    return weather;
}
