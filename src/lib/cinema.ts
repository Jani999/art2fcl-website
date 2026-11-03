// Mutable animation data: never triggers React renders on scroll.
export const cinema = {
  progress: [0, 0, 0, 0, 0, 0],
  velocity: 0,
  corruption: 0,
  scan: 0,
};
const subscribers = new Set<(time: number) => void>();
export const cinemaClock = {
  subscribe(fn: (time: number) => void) {
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  },
  tick(time: number) {
    subscribers.forEach((fn) => fn(time));
  },
};
export const goddessAsset = "/assets/goddess-clean.webp";
