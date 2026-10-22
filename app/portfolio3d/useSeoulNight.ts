'use client';

import { useEffect, useState } from 'react';
import { isSeoulNight } from '@/lib/seoulDaylight';

export default function useSeoulNight() {
    const [night, setNight] = useState(() => isSeoulNight(new Date()));
    useEffect(() => {
        const update = () => setNight(isSeoulNight(new Date()));
        const timer = window.setInterval(update, 1000);
        window.addEventListener('focus', update);
        return () => { window.clearInterval(timer); window.removeEventListener('focus', update); };
    }, []);
    return night;
}
