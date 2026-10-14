import { useEffect, useState } from 'react';

const decoded = new Set<string>();
const pending = new Map<string, Promise<boolean>>();

export function decodeImage(src: string): Promise<boolean> {
  if (decoded.has(src)) return Promise.resolve(true);
  const cached = pending.get(src);
  if (cached) return cached;
  const image = new Image();
  image.src = src;
  const result = image.decode().then(() => {
    decoded.add(src);
    return true;
  }).catch(() => {
    pending.delete(src);
    return false;
  });
  pending.set(src, result);
  return result;
}

export function preloadImages(sources: readonly string[]) {
  return Promise.all(sources.map(decodeImage));
}

export function useDecodedImages(sources: readonly string[]) {
  const key = sources.join('|');
  const [readyKey, setReadyKey] = useState(() => sources.every(src => decoded.has(src)) ? key : '');
  useEffect(() => {
    let active = true;
    // A failed decorative asset must not prevent navigation or the letter's text.
    void preloadImages(key.split('|')).then(() => { if (active) setReadyKey(key); });
    return () => { active = false; };
  }, [key]);
  return readyKey === key;
}

export function useDecodedPose<K extends string>(requested: K, poses: Record<K, { src: string }>): K {
  const [visible, setVisible] = useState(requested);
  const src = poses[requested].src;
  useEffect(() => {
    let active = true;
    void decodeImage(src).then(ready => { if (active && ready) setVisible(requested); });
    return () => { active = false; };
  }, [requested, src]);
  // Cached poses can change in the same render; otherwise retain the previous image.
  return decoded.has(src) ? requested : visible;
}
