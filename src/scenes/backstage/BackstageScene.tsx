import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ASSETS } from '../../config/assets';
import { SCRIPT } from '../../content/script';
import { ComicBubble } from '../../components/ComicBubble/ComicBubble';
import { useDecodedPose } from '../../animation/images';
import { useThoughtAnchor } from '../../animation/useThoughtAnchor';
import './BackstageScene.scss';

gsap.registerPlugin(useGSAP);

type Props = { onContinue: () => void };

const POSES = {
  attentive: { src: ASSETS.snoopyAttentive, alt: SCRIPT.backstage.snoopyAttentiveAlt },
  idea: { src: ASSETS.snoopyIdea, alt: SCRIPT.backstage.snoopyIdeaAlt },
  serious: { src: ASSETS.snoopySerious, alt: SCRIPT.backstage.snoopySeriousAlt },
};

// Reading holds: 7.5s for the confession, 3.2s for the idea, 2s of disbelief,
// then 2.8s for the announcement. The invitation stays until the clapper.
const BEATS = [
  { at: 0, speaker: 'voice', text: SCRIPT.backstage.offscreen1, pose: 'attentive' },
  { at: 7.5, speaker: 'snoopy', text: SCRIPT.backstage.snoopy1, pose: 'idea' },
  { at: 10.7, speaker: 'voice', text: SCRIPT.backstage.offscreen2, pose: 'idea' },
  { at: 13.2, speaker: 'snoopy', text: SCRIPT.backstage.snoopy2, pose: 'serious' },
  { at: 15.7, speaker: 'snoopy', text: SCRIPT.backstage.directorInvitation, pose: 'serious' },
] as const;
const LAST_BEAT = BEATS.length - 1;

export function BackstageScene({ onContinue }: Props) {
  const scopeRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceRef = useRef<HTMLButtonElement>(null);
  const clapButtonRef = useRef<HTMLButtonElement>(null);
  const clockRef = useRef<gsap.core.Timeline | null>(null);
  const clapStartedRef = useRef(false);
  const continuedRef = useRef(false);
  const focusClapRef = useRef(false);
  const onContinueRef = useRef(onContinue);
  const [beat, setBeat] = useState(0);
  const [clapped, setClapped] = useState(false);
  const current = BEATS[beat];
  const pose = useDecodedPose(current.pose, POSES);
  useThoughtAnchor(scopeRef, '.backstage__pose.is-active', `${pose}:${current.text}`);
  const ready = beat === LAST_BEAT;
  const surprised = beat === 3 || clapped;

  useEffect(() => { onContinueRef.current = onContinue; }, [onContinue]);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    if (ready && focusClapRef.current) {
      clapButtonRef.current?.focus({ preventScroll: true });
      focusClapRef.current = false;
    }
  }, [ready]);

  // The reading clock is independent of motion preferences: no dialogue is skipped.
  useGSAP(() => {
    const clock = gsap.timeline();
    clockRef.current = clock;
    BEATS.slice(1).forEach((entry, offset) => {
      const index = offset + 1;
      clock.call(() => {
        if (index === LAST_BEAT) focusClapRef.current = document.activeElement === advanceRef.current;
        setBeat(index);
      }, [], entry.at);
    });
    if (document.hidden) clock.pause();
    const syncVisibility = () => { document.hidden ? clock.pause() : clock.resume(); };
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      document.removeEventListener('visibilitychange', syncVisibility);
      clockRef.current = null;
    };
  }, { scope: scopeRef });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.backstage__dialogue', { opacity: 0, duration: 0.22 });
      if (beat === 0) {
        gsap.from('.backstage__heading', { opacity: 0, y: 8, duration: 0.35 });
        gsap.to('.backstage__snoopy', { rotation: -2, duration: 0.3, delay: 0.4, repeat: 1, repeatDelay: 0.5, yoyo: true });
      }
      if (beat === 3) {
        const impact = gsap.timeline();
        impact
          .fromTo('.backstage__announcement', { scale: 0.9, rotation: -2.5 }, {
            scale: 1, rotation: 0, duration: 0.42, ease: 'back.out(1.35)', transformOrigin: '70% 100%',
          }, 0)
          .to('.backstage__backdrop, .backstage__snoopy, .backstage__clapper', {
            scale: 1.03, duration: 0.42, ease: 'power2.out', transformOrigin: '50% 78%',
          }, 0)
          .fromTo('.backstage__lighting', { opacity: 0 }, { opacity: 0.88, duration: 0.38 }, 0.05)
          .fromTo('.backstage__woodstock.is-active', { rotation: 0, y: 0 }, {
            rotation: -7, y: -4, duration: 0.16, ease: 'power2.out',
          }, 0.48)
          .to('.backstage__woodstock.is-active', { rotation: 0, y: 0, duration: 0.28, ease: 'back.out(2)' }, 0.64)
          .to('.backstage__backdrop, .backstage__snoopy, .backstage__clapper', {
            scale: 1, duration: 0.55, ease: 'power2.inOut',
          }, 1.45)
          .to('.backstage__lighting', { opacity: 0.48, duration: 0.5, ease: 'power1.inOut' }, 1.45);
      }
      if (ready && !clapped) gsap.from('.backstage__clap-step', { opacity: 0, duration: 0.25 });
      if (clapped) {
        gsap.timeline()
          .to('.backstage__woodstock.is-active', { rotation: -5, duration: 0.12, ease: 'power1.in' })
          .to('.backstage__woodstock.is-active', { rotation: 0, duration: 0.2, ease: 'power2.out' });
        gsap.timeline()
          .fromTo('.backstage__clac', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.12 })
          .to('.backstage__clac', { opacity: 0, duration: 0.15 }, 0.65);
      }
    });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [beat, clapped], revertOnUpdate: true });

  // A separate clock keeps navigation single-shot even if motion preferences change.
  useGSAP(() => {
    if (!clapped) return;
    gsap.timeline().call(() => {
      if (continuedRef.current) return;
      continuedRef.current = true;
      onContinueRef.current();
    }, [], 0.85);
  }, { scope: scopeRef, dependencies: [clapped], revertOnUpdate: true });

  function advanceLine() {
    if (ready || clapStartedRef.current) return;
    clockRef.current?.seek(BEATS[beat + 1].at, false);
  }

  function clap() {
    if (!ready || clapStartedRef.current) return;
    clapStartedRef.current = true;
    setClapped(true);
  }

  return (
    <main className="backstage" ref={scopeRef} data-beat={beat}>
      <header className="backstage__heading">
        <span className="backstage__eyebrow">{SCRIPT.backstage.eyebrow}</span>
        <h1 ref={headingRef} tabIndex={-1}>{SCRIPT.backstage.title}</h1>
      </header>

      <section className="backstage__stage" aria-label={SCRIPT.backstage.stageLabel}>
        <img className="backstage__backdrop" src={ASSETS.backgroundClean} alt="" aria-hidden="true" />
        <div className="backstage__snoopy" role="img" aria-label={POSES[pose].alt}>
          {Object.entries(POSES).map(([id, asset]) => (
            <img key={id} className={`backstage__pose backstage__pose--${id} ${id === pose ? 'is-active' : ''}`} src={asset.src} alt="" aria-hidden="true" />
          ))}
        </div>
        <button type="button" className="backstage__clapper" disabled={!ready || clapped} onClick={clap} aria-label={clapped ? SCRIPT.backstage.clapped : SCRIPT.backstage.clap} aria-description={surprised ? SCRIPT.backstage.woodstockSurprisedAlt : SCRIPT.backstage.woodstockAlt}>
          <img className={`backstage__woodstock ${!surprised ? 'is-active' : ''}`} src={ASSETS.woodstockAssistant} alt="" aria-hidden="true" />
          <img className={`backstage__woodstock ${surprised ? 'is-active' : ''}`} src={ASSETS.woodstockSurprised} alt="" aria-hidden="true" />
        </button>
        <div className={`backstage__lighting ${beat === 3 ? 'is-lit' : ''}`} aria-hidden="true" />
        {clapped && <span className="backstage__clac" aria-hidden="true">{SCRIPT.backstage.clac}</span>}
        <div className="backstage__dialogue" data-speaker={current.speaker} aria-live="polite" aria-atomic="true">
          {current.speaker === 'voice' ? <div className="backstage__voice">
            <span className="backstage__voice-label">{SCRIPT.backstage.voiceLabel}</span>
            <p>{current.text}</p>
          </div> : <>
            <span className="backstage__speaker">{SCRIPT.backstage.snoopyLabel}</span>
            <ComicBubble variant="thought" className={beat === 3 ? 'backstage__announcement' : ''}>{current.text}</ComicBubble>
          </>}
        </div>
      </section>

      <div className="backstage__interaction">
        {ready ? <div className="backstage__clap-step">
          <button ref={clapButtonRef} type="button" className="pill-button pill-button--secondary" disabled={clapped} onClick={clap}>{SCRIPT.backstage.clap}</button>
        </div> : <button ref={advanceRef} type="button" className="backstage__advance" onClick={advanceLine}>{SCRIPT.backstage.nextLine}</button>}
      </div>
    </main>
  );
}
