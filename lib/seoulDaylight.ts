// Solar position at Seoul City Hall (37.5665 N, 126.9780 E).
// NOAA/Meeus equations: https://gml.noaa.gov/grad/solcalc/calcdetails.html
// -0.833 degrees includes solar radius and atmospheric refraction at the horizon.
export function isSeoulNight(date: Date): boolean {
    const radians = Math.PI / 180;
    const t = (date.getTime() / 86400000 + 2440587.5 - 2451545) / 36525;
    const longitude = ((280.46646 + t * (36000.76983 + t * 0.0003032)) % 360) * radians;
    const anomaly = (357.52911 + t * (35999.05029 - 0.0001537 * t)) * radians;
    const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    const center = Math.sin(anomaly) * (1.914602 - t * (0.004817 + 0.000014 * t))
        + Math.sin(2 * anomaly) * (0.019993 - 0.000101 * t) + Math.sin(3 * anomaly) * 0.000289;
    const omega = (125.04 - 1934.136 * t) * radians;
    const apparentLongitude = longitude + (center - 0.00569 - 0.00478 * Math.sin(omega)) * radians;
    const obliquity = (23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60
        + 0.00256 * Math.cos(omega)) * radians;
    const declination = Math.asin(Math.sin(obliquity) * Math.sin(apparentLongitude));
    const y = Math.tan(obliquity / 2) ** 2;
    const equationOfTime = 4 / radians * (y * Math.sin(2 * longitude)
        - 2 * eccentricity * Math.sin(anomaly)
        + 4 * eccentricity * y * Math.sin(anomaly) * Math.cos(2 * longitude)
        - 0.5 * y * y * Math.sin(4 * longitude)
        - 1.25 * eccentricity * eccentricity * Math.sin(2 * anomaly));
    const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
    const solarMinutes = ((utcMinutes + equationOfTime + 4 * 126.978) % 1440 + 1440) % 1440;
    const hourAngle = (solarMinutes / 4 - 180) * radians;
    const latitude = 37.5665 * radians;
    const sineAltitude = Math.sin(latitude) * Math.sin(declination)
        + Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle);
    return sineAltitude < Math.sin(-0.833 * radians);
}
