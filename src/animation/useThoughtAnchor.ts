import { useLayoutEffect, type RefObject } from 'react';

// Keep the existing horizontal composition and place the body of each balloon
// above the complete pose. Only the thought dots occupy the visual connection gap.
export function useThoughtAnchor(scope: RefObject<HTMLElement | null>, actorSelector: string, dependency: string) {
  useLayoutEffect(() => {
    const root = scope.current;
    const stage = root?.querySelector<HTMLElement>('section');
    const dialogue = root?.querySelector<HTMLElement>('[data-speaker="snoopy"]');
    const actor = root?.querySelector<HTMLElement>(actorSelector);
    if (!stage || !dialogue || !actor) return;
    const place = () => {
      const frame = stage.getBoundingClientRect();
      const character = actor.getBoundingClientRect();
      const box = dialogue.getBoundingClientRect();
      const above = window.innerWidth <= 700 || root?.classList.contains('screening');
      // The stage's 3px border is included in its client coordinates.
      // Reserve enough room for the Scene 02 illustration's brief 3% zoom;
      // after the border correction the visible gap remains within 12–24px.
      const gap = Math.max(21, Math.min(27, frame.width * 0.018 + 6));
      const lift = window.innerWidth <= 700 ? 9 : 12;
      const top = character.top - frame.top - box.height - gap - lift;
      dialogue.style.setProperty('--thought-top', `${Math.max(frame.height * 0.04, Math.min(top, frame.height - box.height - 44))}px`);
      const headX = character.left + character.width * (above ? 0.55 : 0.85);
      const dot = Math.max(-16, Math.min(headX - box.left, box.width - 26));
      dialogue.style.setProperty('--thought-dot-big', `${dot + 6}px`);
      dialogue.style.setProperty('--thought-dot-small', `${dot - 6}px`);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(stage);
    observer.observe(dialogue);
    observer.observe(actor);
    void document.fonts?.ready.then(place).catch(() => {});
    return () => observer.disconnect();
  }, [scope, actorSelector, dependency]);
}
