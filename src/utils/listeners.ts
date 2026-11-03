// Diurnal listener curve based on real Indian time of day (IST = UTC + 5:30)
const DIURNAL_POINTS: [number, number][] = [
  [0, 0.8],
  [3, 0.35],
  [5, 0.08],
  [8, 0.32],
  [12, 0.52],
  [15, 0.55],
  [18, 0.76],
  [21, 0.97],
  [23, 0.9],
];

function getDiurnalFactor(hour: number): number {
  let prev = DIURNAL_POINTS[DIURNAL_POINTS.length - 1];
  let next = DIURNAL_POINTS[0];
  let interval = 24 - prev[0] + next[0];
  let delta = (hour - prev[0] + 24) % 24;

  for (let s = 0; s < DIURNAL_POINTS.length - 1; s++) {
    if (hour >= DIURNAL_POINTS[s][0] && hour < DIURNAL_POINTS[s + 1][0]) {
      prev = DIURNAL_POINTS[s];
      next = DIURNAL_POINTS[s + 1];
      interval = next[0] - prev[0];
      delta = hour - prev[0];
      break;
    }
  }

  const smooth = (1 - Math.cos((interval === 0 ? 0 : delta / interval) * Math.PI)) / 2;
  return prev[1] + (next[1] - prev[1]) * smooth;
}

export function calculateLiveListeners(timestamp: number = Date.now()): number {
  // IST offset: UTC + 5:30 = 19,800,000 ms
  const istHour = (((timestamp + 19800000) / 3600000) % 24 + 24) % 24;
  const factor = getDiurnalFactor(istHour);

  // Micro-fluctuations
  const t = timestamp / 1000;
  const wave = (0.35 * Math.sin(t / 37) + 0.5 * Math.sin(t / 97) + Math.sin(t / 311) + 0.7 * Math.sin(t / 523)) / 2.55;
  const jitter = 28 * wave;

  const count = Math.round(100 + 400 * factor + jitter);
  return Math.min(500, Math.max(100, count));
}
