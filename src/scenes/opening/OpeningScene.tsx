import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ASSETS } from '../../config/assets';
import { SCRIPT } from '../../content/script';
import { ComicBubble } from '../../components/ComicBubble/ComicBubble';
import { useDecodedImages } from '../../animation/images';
import { useThoughtAnchor } from '../../animation/useThoughtAnchor';
import './OpeningScene.scss';

gsap.registerPlugin(useGSAP);

type Props = { onAccept: () => void };

export function OpeningScene({ onAccept }: Props) {
  const scopeRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<gsap.core.Timeline | null>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const focusAcceptRef = useRef(false);
  const settledRef = useRef(false);
  const [ready, setReady] = useState(false);
  const imagesReady = useDecodedImages([ASSETS.backgroundClean, ASSETS.snoopyStanding, ASSETS.snoopySeated, ASSETS.woodstockAssistant]);
  useThoughtAnchor(scopeRef, '.opening__pose--seated', 'invitation');

  useEffect(() => {
    if (ready && focusAcceptRef.current) {
      acceptRef.current?.focus();
      focusAcceptRef.current = false;
    }
  }, [ready]);

  useGSAP(() => {
    if (!imagesReady) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (settledRef.current) return;
      // Reveal early so the short entrance reads clearly, then hold the pose.
      const sequence = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          settledRef.current = true;
          focusAcceptRef.current = document.activeElement === skipRef.current;
          setReady(true);
        },
      });
      sequenceRef.current = sequence;
      sequence
        .set('[data-pose="seated"]', { autoAlpha: 0 }, 0)
        .from('[data-reveal="title"]', { y: 10, autoAlpha: 0, duration: 0.7 }, 0)
        .set('[data-pose="standing"]', { xPercent: -38, rotation: -2, autoAlpha: 0 }, 0)
        .to('[data-pose="standing"]', { autoAlpha: 1, duration: 0.18 }, 0.6)
        .to('[data-pose="standing"]', { xPercent: 0, rotation: 0, duration: 1.05, ease: 'power1.out' }, 0.6)
        // The fades meet without displaying two silhouettes at the same time.
        .to('[data-pose="standing"]', { autoAlpha: 0, duration: 0.16 }, 2.15)
        .fromTo('[data-pose="seated"]', { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.32 }, 2.31)
        .from('[data-reveal="woodstock"]', { x: 20, autoAlpha: 0, duration: 0.45 }, 2.68)
        .to('[data-pose="seated"]', { rotation: -1.5, duration: 0.22, ease: 'steps(2)' }, 3.15)
        .to('[data-pose="seated"]', { rotation: 0, duration: 0.22, ease: 'steps(2)' }, 3.42)
        .from('[data-reveal="bubble"]', { scale: 0.96, autoAlpha: 0, duration: 0.4 }, 3.75)
        .from('[data-reveal="button"]', { y: 7, autoAlpha: 0, duration: 0.4 }, 4.65);
      return () => { sequenceRef.current = null; };
    });
    media.add('(prefers-reduced-motion: reduce)', () => {
      settledRef.current = true;
      // Explicitly settle both poses when the preference changes mid-sequence.
      gsap.set('[data-pose="standing"]', { autoAlpha: 0 });
      gsap.set('[data-pose="seated"]', { autoAlpha: 1, y: 0, rotation: 0 });
      gsap.set('[data-reveal]', { autoAlpha: 1, x: 0, y: 0, scale: 1 });
      focusAcceptRef.current = document.activeElement === skipRef.current;
      setReady(true);
    });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [imagesReady], revertOnUpdate: true });

  function skipIntro() {
    if (sequenceRef.current) sequenceRef.current.progress(1);
    else {
      settledRef.current = true;
      focusAcceptRef.current = document.activeElement === skipRef.current;
      setReady(true);
    }
  }

  return (
    <main className="opening" ref={scopeRef} data-loading={!imagesReady}>
      <header className="opening__heading" data-reveal="title">
        <span className="opening__eyebrow">{SCRIPT.eyebrow}</span>
        <h1>{SCRIPT.title}</h1>
      </header>

      <section className="opening__stage" aria-label={SCRIPT.opening.stageLabel}>
        <img className="opening__backdrop" src={ASSETS.backgroundClean} alt="" aria-hidden="true" />
        <div className="opening__snoopy" role="img" aria-label={SCRIPT.opening.snoopyAlt}>
          <img className="opening__pose opening__pose--standing" data-pose="standing" src={ASSETS.snoopyStanding} alt="" aria-hidden="true" />
          <img className="opening__pose opening__pose--seated" data-pose="seated" src={ASSETS.snoopySeated} alt="" aria-hidden="true" />
        </div>
        <img className="opening__woodstock" data-reveal="woodstock" src={ASSETS.woodstockAssistant} alt={SCRIPT.opening.woodstockAlt} />
        <div className="opening__dialogue" data-reveal="bubble" data-speaker="snoopy">
          <ComicBubble variant="thought">
            <span>{SCRIPT.opening.invitation1}</span>
            <span className="opening__dialogue-line">{SCRIPT.opening.invitation2}</span>
          </ComicBubble>
        </div>
      </section>

      <div className="opening__footer">
        <div data-reveal="button">
          <button ref={acceptRef} type="button" className="pill-button opening__accept" disabled={!ready} onClick={onAccept}>
            {SCRIPT.opening.cta}
          </button>
        </div>
        <button ref={skipRef} type="button" className="opening__skip" onClick={skipIntro} disabled={ready} aria-hidden={ready}>
          {SCRIPT.opening.skip}
        </button>
      </div>
    </main>
  );
}
