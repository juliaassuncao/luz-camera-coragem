import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Genre } from '../../app/scenes';
import { ASSETS } from '../../config/assets';
import { SCRIPT } from '../../content/script';
import { ComicBubble } from '../../components/ComicBubble/ComicBubble';
import { useDecodedPose } from '../../animation/images';
import { useThoughtAnchor } from '../../animation/useThoughtAnchor';
import './ScreeningScene.scss';

gsap.registerPlugin(useGSAP);

type Phase = 'premiere' | 'conversation' | 'pause' | 'reply' | 'idea' | 'ending';
type Look = 'screen' | 'woodstock' | 'visitor';
type Props = { genre: Genre; onContinue: () => void };
type Dialogue = { speaker: 'voice' | 'snoopy'; text: string; emphasis?: boolean };

const CONVERSATION: Dialogue[] = [
  { speaker: 'voice', text: SCRIPT.screening.offscreen1 },
  { speaker: 'snoopy', text: SCRIPT.screening.snoopy1 },
  { speaker: 'voice', text: SCRIPT.screening.offscreen2 },
];
const CONVERSATION_TIMES = [4.2, 8.2, 11.8];
const PAUSE_TIME = 2.2;
const REPLY_TIME = 4.4;
const IDEA_TIME = 4;
const ENDING_TIME = 4.2;
const REPLAY_END = 5.6;
const SNOOPY = {
  premiere: { src: ASSETS.snoopyPremiere, alt: SCRIPT.screening.snoopyAlt },
  confused: { src: ASSETS.snoopyPremiereConfused, alt: SCRIPT.screening.snoopyConfusedAlt },
  confident: { src: ASSETS.snoopyPremiereConfident, alt: SCRIPT.screening.snoopyConfidentAlt },
  idea: { src: ASSETS.snoopyPremiereIdea, alt: SCRIPT.screening.snoopyIdeaAlt },
};

export function ScreeningScene({ genre, onContinue }: Props) {
  const scopeRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceRef = useRef<HTMLButtonElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const clockRef = useRef<gsap.core.Timeline | null>(null);
  const visualsRef = useRef<gsap.core.Timeline | null>(null);
  const continuedRef = useRef(false);
  const focusNextRef = useRef(false);
  const [phase, setPhase] = useState<Phase>('premiere');
  const [line, setLine] = useState(0);
  const [look, setLook] = useState<Look>('screen');
  const [replayVisible, setReplayVisible] = useState(false);
  const [bulbVisible, setBulbVisible] = useState(false);
  const [endingReady, setEndingReady] = useState(false);

  const requestedPose = phase === 'idea' || phase === 'ending' ? 'idea'
    : phase === 'reply' ? 'confident'
      : phase === 'pause' || (phase === 'conversation' && line === 2) ? 'confused'
      : 'premiere';
  const pose = useDecodedPose(requestedPose, SNOOPY);
  const canAdvance = phase === 'conversation' || phase === 'reply' || (phase === 'ending' && !endingReady);
  const dialogue: Dialogue | null = phase === 'conversation' ? CONVERSATION[line]
    : phase === 'pause' ? CONVERSATION[2]
      : phase === 'reply' ? { speaker: 'snoopy', text: SCRIPT.screening.snoopy2, emphasis: true }
        : phase === 'idea' ? { speaker: 'snoopy', text: SCRIPT.screening.lastLine }
        : phase === 'ending' ? { speaker: 'snoopy', text: SCRIPT.screening.lastLine } : null;
  useThoughtAnchor(scopeRef, '.screening__actor.is-active', `${pose}:${dialogue?.text ?? ''}`);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (focusNextRef.current && (endingReady || canAdvance)) {
      (endingReady ? continueRef : advanceRef).current?.focus({ preventScroll: true });
      focusNextRef.current = false;
    }
  }, [phase, endingReady, canAdvance]);

  // Reading and comic pauses keep their timing even with motion disabled.
  useGSAP(() => {
    const clock = gsap.timeline();
    clockRef.current = clock;
    const transition = (next: Phase) => {
      if (document.activeElement === advanceRef.current) focusNextRef.current = true;
      setPhase(next);
    };
    if (phase === 'premiere') {
      clock.call(() => setReplayVisible(true), [], 0.6)
        .call(() => setReplayVisible(false), [], REPLAY_END)
        .call(() => transition('conversation'), [], REPLAY_END + 0.2);
    }
    if (phase === 'conversation') {
      clock.call(() => setLine(1), [], CONVERSATION_TIMES[0])
        .call(() => setLine(2), [], CONVERSATION_TIMES[1])
        .call(() => transition('pause'), [], CONVERSATION_TIMES[2]);
    }
    if (phase === 'pause') {
      clock.call(() => setLook('woodstock'), [], 0.75)
        .call(() => setLook('visitor'), [], 1.5)
        .call(() => transition('reply'), [], PAUSE_TIME);
    }
    if (phase === 'reply') clock.call(() => { setLook('screen'); transition('idea'); }, [], REPLY_TIME);
    if (phase === 'idea') {
      clock.call(() => setBulbVisible(true), [], 1.5)
        .call(() => setBulbVisible(false), [], 3.5)
        .call(() => transition('ending'), [], IDEA_TIME);
    }
    if (phase === 'ending') clock.call(() => {
      if (document.activeElement === advanceRef.current) focusNextRef.current = true;
      setEndingReady(true);
    }, [], ENDING_TIME);
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
      if (phase === 'premiere') {
        visuals.from('.screening__dusk', { opacity: 0, duration: 0.6 }, 0)
          .from('.screening__snoopy, .screening__woodstock', { opacity: 0, y: 5, duration: 0.45, stagger: 0.08 }, 0.1)
          .from('.screening__projector-light', { autoAlpha: 0, duration: 0.5 }, 0.2);
        if (genre) {
          visuals.fromTo('.screening__film', { autoAlpha: 0 }, { autoAlpha: 0.82, duration: 0.45 }, 0.6)
            .from('.screening__film-actor', { opacity: 0, y: 3, duration: 0.35 }, 0.7)
            .to('.screening__film', { autoAlpha: 0, duration: 0.5 }, REPLAY_END - 0.5);
          if (genre === 'drama') {
            visuals.fromTo('.screening__film-effect', { y: -2 }, { y: 2, duration: 2, repeat: 1, yoyo: true, ease: 'sine.inOut' }, 0.7);
          } else {
            visuals.fromTo('.screening__film-effect', { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, 0.75)
              .to('.screening__film-effect', { autoAlpha: 0, duration: 0.6 }, 4.5);
          }
        }
        visuals.to('.screening__snoopy', { rotation: -0.7, duration: 0.45 }, 1.4)
          .to('.screening__snoopy', { rotation: 0, duration: 0.45 }, 1.85)
          .to('.screening__woodstock', { rotation: -2, y: -1, duration: 0.25 }, 1.45)
          .to('.screening__woodstock', { rotation: 0, y: 0, duration: 0.3 }, 1.7);
      }
      if (phase === 'pause') {
        visuals.to('.screening__snoopy', { rotation: -0.8, duration: 0.4 }, 0)
          .to('.screening__snoopy', { rotation: 1, duration: 0.4 }, 0.75)
          .to('.screening__snoopy', { rotation: 0, duration: 0.3 }, 1.5)
          .to('.screening__woodstock', { rotation: -1.5, duration: 0.25 }, 0.9)
          .to('.screening__woodstock', { rotation: 0, duration: 0.25 }, 1.15);
      }
      if (phase === 'idea') {
        visuals.fromTo('.screening__bulb', { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, 1.5)
          .to('.screening__bulb', { autoAlpha: 0, duration: 0.45 }, 3.05);
      }
      if (phase === 'ending') visuals.to('.screening__projector-light', { autoAlpha: 0, duration: 0.7 }, ENDING_TIME - 0.7);
      // Motion preference changes resume at the narrative clock, never replay it.
      visuals.seek(clockRef.current?.time() ?? 0, true);
      return () => { visualsRef.current = null; };
    });
    media.add('(prefers-reduced-motion: reduce)', () => { visualsRef.current = null; });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [phase, genre], revertOnUpdate: true });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.screening__actor.is-active', { opacity: 0.74 }, { opacity: 1, duration: 0.16, ease: 'power1.out' });
    });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [pose], revertOnUpdate: true });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (dialogue) gsap.from('.screening__dialogue', { opacity: 0, duration: 0.22 });
    });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [dialogue?.text], revertOnUpdate: true });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (endingReady) gsap.from('.screening__continue', { opacity: 0, y: 3, duration: 0.25 });
    });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [endingReady], revertOnUpdate: true });

  function skipReplay() {
    if (phase !== 'premiere') return;
    focusNextRef.current = document.activeElement === advanceRef.current;
    clockRef.current?.seek(REPLAY_END + 0.2, false);
    visualsRef.current?.seek(REPLAY_END + 0.2, true);
  }

  function advanceLine() {
    const next = phase === 'conversation' ? CONVERSATION_TIMES[line]
      : phase === 'reply' ? REPLY_TIME
        : phase === 'ending' && !endingReady ? ENDING_TIME : undefined;
    if (next === undefined) return;
    clockRef.current?.seek(next, false);
    visualsRef.current?.seek(next, true);
  }

  function continueToFinale() {
    if (!endingReady || continuedRef.current) return;
    continuedRef.current = true;
    onContinue();
  }

  return (
    <main className="screening" ref={scopeRef} data-phase={phase} data-genre={genre ?? 'none'} data-look={look}>
      <header className="screening__heading">
        <span>{SCRIPT.screening.eyebrow}</span>
        <h1 ref={headingRef} tabIndex={-1}>{SCRIPT.screening.title}</h1>
      </header>
      <section className="screening__stage" aria-label={SCRIPT.screening.stageLabel}>
        <img className="screening__backdrop" src={ASSETS.backgroundClean} alt="" aria-hidden="true" />
        <div className="screening__dusk" aria-hidden="true" />
        <img className="screening__lights" src={ASSETS.stringLights} alt="" aria-hidden="true" />
        <div className="screening__screen">
          <img className="screening__sheet" src={ASSETS.projectionSheet} alt={SCRIPT.screening.sheetAlt} />
          {genre && <div className={`screening__film screening__film--${genre} ${replayVisible ? 'is-playing' : 'is-spent'}`} role="img" aria-label={genre === 'drama' ? SCRIPT.screening.replayDramaLabel : SCRIPT.screening.replayActionLabel}>
            <img className="screening__film-effect" src={genre === 'drama' ? ASSETS.stormRain : ASSETS.explosion} alt="" aria-hidden="true" />
            <img className="screening__film-actor" src={genre === 'drama' ? ASSETS.snoopyDrama : ASSETS.snoopyAction} alt="" aria-hidden="true" />
          </div>}
        </div>
        <div className="screening__projector" role="img" aria-label={SCRIPT.screening.projectorAlt}>
          {/* Complementary clips isolate the beam already drawn in this single WebP. */}
          <img className="screening__projector-body" src={ASSETS.projector} alt="" aria-hidden="true" />
          <img className={`screening__projector-light ${endingReady ? 'is-off' : ''}`} src={ASSETS.projector} alt="" aria-hidden="true" />
        </div>
        <div className="screening__snoopy" role="img" aria-label={SNOOPY[pose].alt}>
          {Object.entries(SNOOPY).map(([id, asset]) => <img key={id}
            className={`screening__actor screening__actor--${id} ${pose === id ? 'is-active' : ''}`}
            src={asset.src} alt="" aria-hidden="true" />)}
          <img className={`screening__bulb ${!bulbVisible ? 'is-spent' : ''}`} src={ASSETS.ideaLightbulb} alt="" aria-hidden="true" />
        </div>
        <img className="screening__woodstock" src={ASSETS.woodstockPopcorn} alt={SCRIPT.screening.woodstockAlt} />
        {dialogue && <div className="screening__dialogue" data-speaker={dialogue.speaker} aria-live="polite" aria-atomic="true">
          {dialogue.speaker === 'voice' ? <div className="screening__voice">
            <span>{SCRIPT.backstage.voiceLabel}</span><p>{dialogue.text}</p>
          </div> : <>
            <span className="screening__speaker">{SCRIPT.backstage.snoopyLabel}</span>
            <ComicBubble variant="thought" className={dialogue.emphasis ? 'screening__punchline' : ''}>{dialogue.text}</ComicBubble>
          </>}
        </div>}
      </section>
      <div className="screening__footer">
        {phase === 'premiere' && <button ref={advanceRef} type="button" className="screening__advance screening__skip-replay" onClick={skipReplay}>{SCRIPT.screening.skipReplay}</button>}
        {canAdvance && <button ref={advanceRef} type="button" className="screening__advance" onClick={advanceLine}>{SCRIPT.backstage.nextLine}</button>}
        {endingReady && <button ref={continueRef} type="button" className="pill-button screening__continue" onClick={continueToFinale}>{SCRIPT.screening.cta}</button>}
      </div>
    </main>
  );
}
