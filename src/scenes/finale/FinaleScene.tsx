import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ASSETS } from '../../config/assets';
import { SCRIPT } from '../../content/script';
import { ComicBubble } from '../../components/ComicBubble/ComicBubble';
import { useDecodedPose } from '../../animation/images';
import { useThoughtAnchor } from '../../animation/useThoughtAnchor';
import './FinaleScene.scss';

gsap.registerPlugin(useGSAP);

type Phase = 'sign' | 'complaint' | 'reaction' | 'delivery' | 'receiving' | 'offering' | 'ready' | 'opening';
type Props = { onContinue: () => void };
const TIMES = { sign: 9, complaint: 4.2, reaction: 2.2, delivery: 3.6, receiving: 1.4, offering: 3.2, opening: 0.3 };
const POSES = {
  sign: { src: ASSETS.snoopySignBlank, alt: SCRIPT.finale.snoopySignAlt },
  serious: { src: ASSETS.snoopyBackstageDoesNotMatter, alt: SCRIPT.finale.snoopyDoesNotMatterAlt },
  receiving: { src: ASSETS.snoopyEnvelopeReceiving, alt: SCRIPT.finale.snoopyReceivingAlt },
  offering: { src: ASSETS.snoopyEnvelopeOffering, alt: SCRIPT.finale.snoopyOfferingAlt },
  ready: { src: ASSETS.snoopyIdea, alt: SCRIPT.backstage.snoopyIdeaAlt },
};
const BIRD = {
  walking: { src: ASSETS.woodstockEnvelopeWalking, alt: SCRIPT.finale.woodstockDeliveryAlt },
  presenting: { src: ASSETS.woodstockEnvelopePresenting, alt: SCRIPT.finale.woodstockDeliveryAlt },
};

export function FinaleScene({ onContinue }: Props) {
  const scopeRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const envelopeRef = useRef<HTMLButtonElement>(null);
  const clockRef = useRef<gsap.core.Timeline | null>(null);
  const visualsRef = useRef<gsap.core.Timeline | null>(null);
  const openingLockedRef = useRef(false);
  const focusEnvelopeRef = useRef(false);
  const [phase, setPhase] = useState<Phase>('sign');
  const [signVisible, setSignVisible] = useState(false);
  const [ignored, setIgnored] = useState(false);
  const [presenting, setPresenting] = useState(false);

  const ready = phase === 'ready' || phase === 'opening';
  const intimate = phase === 'offering' || ready;
  const pose = useDecodedPose(phase === 'sign' || phase === 'complaint' || (phase === 'reaction' && !ignored) ? 'sign'
    : ready ? 'ready' : phase === 'receiving' ? 'receiving' : intimate ? 'offering' : 'serious', POSES);
  const birdPose = useDecodedPose(presenting ? 'presenting' : 'walking', BIRD);
  const delivering = phase === 'delivery';
  const foregroundVisible = ready && pose === 'ready';
  useThoughtAnchor(scopeRef, '.finale__pose.is-active', `${pose}:${intimate}`);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (phase === 'ready' && foregroundVisible && focusEnvelopeRef.current) {
      envelopeRef.current?.focus({ preventScroll: true });
      focusEnvelopeRef.current = false;
    }
  }, [phase, foregroundVisible]);

  // The narrative clock also runs without motion. It never opens the letter by itself.
  useGSAP(() => {
    const clock = gsap.timeline();
    clockRef.current = clock;
    const transition = (next: Phase) => {
      if (document.activeElement === skipRef.current) focusEnvelopeRef.current = true;
      setPhase(next);
    };
    if (phase === 'sign') clock.call(() => setSignVisible(true), [], 0.6).call(() => transition('complaint'), [], TIMES.sign);
    if (phase === 'complaint') clock.call(() => transition('reaction'), [], TIMES.complaint);
    if (phase === 'reaction') clock.call(() => setIgnored(true), [], 0.55).call(() => transition('delivery'), [], TIMES.reaction);
    if (phase === 'delivery') clock.call(() => setPresenting(true), [], 2.4).call(() => transition('receiving'), [], TIMES.delivery);
    if (phase === 'receiving') clock.call(() => transition('offering'), [], TIMES.receiving);
    if (phase === 'offering') clock.call(() => transition('ready'), [], TIMES.offering);
    if (phase === 'opening') clock.call(onContinue, [], TIMES.opening);
    if (document.hidden) clock.pause();
    const syncVisibility = () => { document.hidden ? clock.pause() : clock.resume(); };
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      document.removeEventListener('visibilitychange', syncVisibility);
      clockRef.current = null;
    };
  }, { scope: scopeRef, dependencies: [phase], revertOnUpdate: true });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const visuals = gsap.timeline({ defaults: { ease: 'power2.out' } });
      visualsRef.current = visuals;
      if (phase === 'sign') {
        visuals.from('.finale__snoopy', { x: -8, y: 3, duration: 0.45 }, 0)
          .to('.finale__snoopy', { y: -3, duration: 0.25 }, 0.3)
          .to('.finale__snoopy', { y: 0, duration: 0.25 }, 0.55)
          .fromTo('.finale__sign-copy', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.6);
      }
      if (phase === 'complaint') visuals.from('.finale__voice', { opacity: 0, duration: 0.22 });
      if (phase === 'reaction') visuals.to('.finale__snoopy', { rotation: -0.8, duration: 0.4 }, 0.6).to('.finale__snoopy', { rotation: 0, duration: 0.3 }, 1.2);
      if (phase === 'delivery') {
        // The same illustration slides in; no simulated walking cycle.
        const stageWidth = scopeRef.current?.querySelector('.finale__stage')?.clientWidth ?? 600;
        visuals.from('.finale__woodstock', { x: stageWidth * 0.38, duration: 2.1, ease: 'power1.inOut' }, 0.1)
          .to('.finale__woodstock', { y: -2, duration: 0.35, repeat: 3, yoyo: true, ease: 'sine.inOut' }, 0.25)
          .to('.finale__woodstock', { autoAlpha: 0, duration: 0.25 }, TIMES.delivery - 0.25);
      }
      if (phase === 'offering') {
        visuals.from('.finale__thought', { opacity: 0, duration: 0.3 }, 0.15)
          .fromTo('.finale__gentle-light', { opacity: 0 }, { opacity: 1, duration: 0.9 }, 0);
      }
      if (phase === 'opening') visuals.to('.finale__envelope-button', { scale: 1.04, y: -3, duration: 0.22 });
      visuals.seek(clockRef.current?.time() ?? 0, true);
      return () => { visualsRef.current = null; };
    });
    media.add('(prefers-reduced-motion: reduce)', () => { visualsRef.current = null; });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [phase], revertOnUpdate: true });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (foregroundVisible) gsap.from('.finale__envelope-button, .finale__open', { opacity: 0, y: 3, duration: 0.3, stagger: 0.04 });
    });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [foregroundVisible], revertOnUpdate: true });

  function skipSequence() {
    if (ready) return;
    focusEnvelopeRef.current = document.activeElement === skipRef.current;
    clockRef.current?.pause();
    visualsRef.current?.pause();
    setPhase('ready');
  }

  function openLetter() {
    if (phase !== 'ready' || openingLockedRef.current) return;
    openingLockedRef.current = true;
    setPhase('opening');
  }

  return (
    <main className="finale" ref={scopeRef} data-phase={phase} data-pose={pose}>
      <header className="finale__heading">
        <span>{SCRIPT.finale.eyebrow}</span>
        <h1 ref={headingRef} tabIndex={-1}>{SCRIPT.finale.title}</h1>
      </header>
      <section className="finale__stage" aria-label={SCRIPT.finale.stageLabel}>
        <img className="finale__backdrop" src={ASSETS.backgroundClean} alt="" aria-hidden="true" />
        <div className="finale__dusk" aria-hidden="true" />
        <div className={`finale__gentle-light ${intimate ? 'is-active' : ''}`} aria-hidden="true" />
        <img className="finale__lights" src={ASSETS.stringLights} alt="" aria-hidden="true" />
        <div className="finale__snoopy">
          {Object.entries(POSES).map(([id, asset]) => <div key={id} className={`finale__pose finale__pose--${id} ${pose === id ? 'is-active' : ''}`}>
            <img src={asset.src} alt={pose === id ? asset.alt : ''} aria-hidden={pose !== id} />
            {id === 'sign' && <p className={`finale__sign-copy ${signVisible && pose === 'sign' ? 'is-visible' : ''}`} aria-hidden={!signVisible || pose !== 'sign'} aria-live="polite">{SCRIPT.finale.sign}</p>}
          </div>)}
        </div>
        <div className={`finale__woodstock ${!delivering ? 'is-spent' : ''}`} aria-hidden={!delivering}>
          {Object.entries(BIRD).map(([id, asset]) => <img key={id} className={birdPose === id ? 'is-active' : ''} src={asset.src} alt={delivering && birdPose === id ? asset.alt : ''} aria-hidden={!delivering || birdPose !== id} />)}
        </div>
        {phase === 'sign' && <aside className="finale__report" aria-labelledby="finale-report-title">
          <h2 id="finale-report-title">{SCRIPT.finale.reportTitle}</h2><p>{SCRIPT.finale.report}</p>
        </aside>}
        {phase === 'complaint' && <div className="finale__dialogue finale__voice" data-speaker="voice" aria-live="polite" aria-atomic="true">
          <span>{SCRIPT.backstage.voiceLabel}</span><p>{SCRIPT.finale.offscreen}</p>
        </div>}
        {intimate && <div className="finale__dialogue finale__thought" data-speaker="snoopy" aria-live="polite" aria-atomic="true">
          <span className="finale__speaker">{SCRIPT.backstage.snoopyLabel}</span>
          <ComicBubble variant="thought">{SCRIPT.finale.snoopy}</ComicBubble>
        </div>}
        {foregroundVisible && <button ref={envelopeRef} type="button" className="finale__envelope-button" aria-label={SCRIPT.finale.cta} disabled={phase === 'opening'} onClick={openLetter}>
          <img src={ASSETS.envelopeClosedClean} alt="" aria-hidden="true" />
        </button>}
      </section>
      <div className="finale__footer">
        {!ready && <button ref={skipRef} type="button" className="finale__skip" onClick={skipSequence}>{SCRIPT.finale.skip}</button>}
        {foregroundVisible && <button type="button" className="pill-button finale__open" disabled={phase === 'opening'} onClick={openLetter}>{SCRIPT.finale.cta}</button>}
      </div>
    </main>
  );
}
