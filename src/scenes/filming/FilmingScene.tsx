import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Genre } from '../../app/scenes';
import { ASSETS } from '../../config/assets';
import { SCRIPT } from '../../content/script';
import { ComicBubble } from '../../components/ComicBubble/ComicBubble';
import { useDecodedPose } from '../../animation/images';
import { useThoughtAnchor } from '../../animation/useThoughtAnchor';
import './FilmingScene.scss';

gsap.registerPlugin(useGSAP);

type FilmGenre = Exclude<Genre, null>;
type Phase = 'introduction' | 'genre-selection' | 'confirming' | 'filming' | 'review' | 'ending';
type Props = { onSelectGenre: (genre: FilmGenre) => void; onContinue: () => void };
type Dialogue = { speaker: 'voice' | 'snoopy'; text: string; emphasis?: boolean };

const INTRO: Dialogue[] = [
  { speaker: 'snoopy', text: SCRIPT.filming.introduction1 },
  { speaker: 'voice', text: SCRIPT.filming.introductionVoice },
  { speaker: 'snoopy', text: SCRIPT.filming.introduction2 },
];
const INTRO_TIMES = [4.2, 8.7, 12.7];
const FILM_TIMES = [5.2, 8.4];
const ENDING_TIMES = [4.6, 7.4];
const EXPLOSION_END = 2.4;
const SNOOPY = {
  idea: { src: ASSETS.snoopyIdea, alt: SCRIPT.backstage.snoopyIdeaAlt },
  serious: { src: ASSETS.snoopySerious, alt: SCRIPT.backstage.snoopySeriousAlt },
  drama: { src: ASSETS.snoopyDrama, alt: SCRIPT.filming.snoopyDramaAlt },
  action: { src: ASSETS.snoopyAction, alt: SCRIPT.filming.snoopyActionAlt },
};
const WOODSTOCK = {
  normal: { src: ASSETS.woodstockAssistant, alt: SCRIPT.backstage.woodstockAlt },
  drama: { src: ASSETS.woodstockUmbrella, alt: SCRIPT.filming.woodstockUmbrellaAlt },
  action: { src: ASSETS.woodstockRuffled, alt: SCRIPT.filming.woodstockRuffledAlt },
};

export function FilmingScene({ onSelectGenre, onContinue }: Props) {
  const scopeRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const reviewRef = useRef<HTMLElement>(null);
  const advanceRef = useRef<HTMLButtonElement>(null);
  const firstPosterRef = useRef<HTMLButtonElement>(null);
  const postersRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const clockRef = useRef<gsap.core.Timeline | null>(null);
  const visualsRef = useRef<gsap.core.Timeline | null>(null);
  const selectionLockedRef = useRef(false);
  const continuedRef = useRef(false);
  const focusNextRef = useRef(false);
  const [phase, setPhase] = useState<Phase>('introduction');
  const [line, setLine] = useState(0);
  const [selected, setSelected] = useState<FilmGenre | null>(null);
  const [explosionVisible, setExplosionVisible] = useState(false);

  const filming = phase === 'filming';
  const postersVisible = phase === 'genre-selection' || phase === 'confirming';
  const endingReady = phase === 'ending' && line === 2;
  const chosen = SCRIPT.filming.genres.find(option => option.id === selected);
  const actionReaction = filming && selected === 'action' && line === 1;
  const snoopy = useDecodedPose(actionReaction ? 'serious' : filming && selected ? selected : phase === 'review' ? 'idea'
    : phase === 'ending' || (phase === 'introduction' && line === 2) || postersVisible ? 'serious' : 'idea', SNOOPY);
  const woodstock = useDecodedPose(filming && selected ? selected : 'normal', WOODSTOCK);
  let dialogue: Dialogue | null = null;
  if (phase === 'introduction') dialogue = INTRO[line];
  if (filming && chosen) dialogue = line === 0
    ? { speaker: 'voice', text: selected === 'drama' ? SCRIPT.filming.dramaVoice : SCRIPT.filming.actionVoice }
    : { speaker: 'snoopy', text: chosen.punchline, emphasis: true };
  if (phase === 'ending') dialogue = line === 0
    ? { speaker: 'voice', text: SCRIPT.filming.endingVoice }
    : { speaker: 'snoopy', text: SCRIPT.filming.reaction, emphasis: true };
  useThoughtAnchor(scopeRef, '.filming__actor.is-active', `${snoopy}:${dialogue?.text ?? ''}`);

  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    if (phase === 'genre-selection' && postersRef.current && window.innerWidth <= 700) {
      postersRef.current.scrollIntoView({ block: 'start' });
    }
    if (focusNextRef.current) {
      if (phase === 'genre-selection') firstPosterRef.current?.focus({ preventScroll: true });
      if (endingReady) continueRef.current?.focus({ preventScroll: true });
      else if (phase === 'ending') advanceRef.current?.focus({ preventScroll: true });
      focusNextRef.current = false;
    }
  }, [phase, endingReady]);
  useEffect(() => {
    if (phase === 'filming' || phase === 'ending') {
      if (stageRef.current && stageRef.current.getBoundingClientRect().top < 0) {
        stageRef.current.scrollIntoView({ block: 'start' });
      }
      if (phase === 'filming') stageRef.current?.focus({ preventScroll: true });
    }
    if (phase === 'review' && reviewRef.current) {
      reviewRef.current.focus({ preventScroll: true });
      if (reviewRef.current.getBoundingClientRect().bottom > window.innerHeight) {
        reviewRef.current.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [phase]);

  // Reading holds are independent of visual animation and motion preferences.
  useGSAP(() => {
    const clock = gsap.timeline();
    clockRef.current = clock;
    const transition = (next: Phase) => {
      focusNextRef.current = document.activeElement === advanceRef.current;
      setLine(0);
      if (next === 'filming') setExplosionVisible(true);
      setPhase(next);
    };
    if (phase === 'introduction') {
      clock.call(() => setLine(1), [], INTRO_TIMES[0])
        .call(() => setLine(2), [], INTRO_TIMES[1])
        .call(() => transition('genre-selection'), [], INTRO_TIMES[2]);
    }
    if (phase === 'confirming') clock.call(() => transition('filming'), [], 0.28);
    if (phase === 'filming') {
      if (selected === 'action') clock.call(() => setExplosionVisible(false), [], EXPLOSION_END);
      clock.call(() => setLine(1), [], FILM_TIMES[0])
        .call(() => transition('review'), [], FILM_TIMES[1]);
    }
    if (phase === 'review') clock.call(() => transition('ending'), [], 6.4);
    if (phase === 'ending') {
      clock.call(() => setLine(1), [], ENDING_TIMES[0])
        .call(() => {
          focusNextRef.current = document.activeElement === advanceRef.current;
          setLine(2);
        }, [], ENDING_TIMES[1]);
    }
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
      if (phase === 'introduction') visuals.from('.filming__heading', { opacity: 0, y: 8, duration: 0.35 });
      if (phase === 'genre-selection') visuals.from('.filming__poster', { opacity: 0, y: 6, duration: 0.3, stagger: 0.08 });
      if (phase === 'confirming') {
        visuals.to('.filming__poster[aria-pressed="true"]', { scale: 1.025, duration: 0.12 })
          .to('.filming__poster[aria-pressed="true"]', { scale: 1, duration: 0.12 });
      }
      if (phase === 'filming') {
        visuals.fromTo('.filming__tint', { opacity: 0 }, { opacity: 1, duration: 0.55 }, 0);
        if (selected === 'drama') {
          visuals.fromTo('.filming__storm', { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.15)
            .to('.filming__storm', { y: 4, duration: 2, repeat: 2, yoyo: true, ease: 'sine.inOut' }, 0.75)
            .to('.filming__storm', { autoAlpha: 0, duration: 0.7 }, 7.3);
        } else {
          visuals.fromTo('.filming__explosion', { autoAlpha: 0, scale: 0.72 }, { autoAlpha: 1, scale: 1, duration: 0.24 }, 0.3)
            .to('.filming__explosion', { autoAlpha: 0, scale: 1.04, duration: 0.8 }, EXPLOSION_END - 0.8)
            .from('.filming__bird.is-active', { rotation: -4, duration: 0.25 }, 0.4);
        }
        visuals.to('.filming__tint', { opacity: 0, duration: 1 }, 7.3);
      }
      if (phase === 'review') visuals.from('.filming__review', { opacity: 0, y: 5, duration: 0.35 });
      // Re-entering a motion mode resumes effects at the reading clock's position.
      visuals.seek(clockRef.current?.time() ?? 0, true);
      return () => { visualsRef.current = null; };
    });
    media.add('(prefers-reduced-motion: reduce)', () => {
      visualsRef.current = null;
      // Static atmosphere with no motion or flash; later phases restore normal colors.
      if (phase === 'filming' && selected === 'action') gsap.set('.filming__explosion', { autoAlpha: 0.6, scale: 1 });
    });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [phase], revertOnUpdate: true });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (dialogue) gsap.from('.filming__dialogue', { opacity: 0, duration: 0.22 });
    });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [dialogue?.text], revertOnUpdate: true });

  useGSAP(() => {
    if (!endingReady) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => { gsap.from('.filming__closing', { opacity: 0, y: 3, duration: 0.25 }); });
    return () => media.revert();
  }, { scope: scopeRef, dependencies: [endingReady], revertOnUpdate: true });

  function advanceLine() {
    const next = phase === 'introduction' ? INTRO_TIMES[line]
      : phase === 'filming' ? FILM_TIMES[line]
      : phase === 'ending' && !endingReady ? ENDING_TIMES[line] : undefined;
    if (next === undefined) return;
    clockRef.current?.seek(next, false);
    visualsRef.current?.seek(next, true);
  }

  function chooseGenre(genre: FilmGenre) {
    if (phase !== 'genre-selection' || selectionLockedRef.current) return;
    selectionLockedRef.current = true;
    setSelected(genre);
    onSelectGenre(genre);
    setPhase('confirming');
  }

  function skipReview() {
    if (phase !== 'review') return;
    clockRef.current?.seek(6.4, false);
  }

  function continueToScreening() {
    if (!endingReady || continuedRef.current) return;
    continuedRef.current = true;
    onContinue();
  }

  return (
    <main className="filming" ref={scopeRef} data-phase={phase} data-genre={selected ?? undefined}>
      <header className="filming__heading">
        <span>{SCRIPT.filming.eyebrow}</span>
        <h1 ref={headingRef} tabIndex={-1}>{SCRIPT.filming.title}</h1>
      </header>
      <div className="filming__set">
        <section className="filming__stage" ref={stageRef} tabIndex={-1} aria-label={SCRIPT.filming.stageLabel}>
          <img className="filming__backdrop" src={ASSETS.backgroundClean} alt="" aria-hidden="true" />
          <div className={`filming__tint ${filming ? `filming__tint--${selected}` : ''}`} aria-hidden="true" />
          <img className={`filming__storm ${filming && selected === 'drama' ? 'is-active' : ''}`} src={ASSETS.stormRain} alt="" aria-hidden="true" />
          <img className={`filming__explosion ${filming && selected === 'action' ? 'is-active' : ''} ${!explosionVisible ? 'is-spent' : ''}`} src={ASSETS.explosion} alt="" aria-hidden="true" />
          <div className={`filming__snoopy ${filming && selected === 'drama' ? 'filming__snoopy--drama' : ''} ${actionReaction ? 'filming__snoopy--action-reaction' : ''}`} role="img" aria-label={SNOOPY[snoopy].alt}>
            {Object.entries(SNOOPY).map(([id, asset]) => <img key={id} className={`filming__actor ${snoopy === id ? 'is-active' : ''}`} src={asset.src} alt="" aria-hidden="true" />)}
          </div>
          <div className={`filming__woodstock filming__woodstock--${woodstock} ${postersVisible ? 'filming__woodstock--choosing' : ''}`} role="img" aria-label={WOODSTOCK[woodstock].alt}>
            {Object.entries(WOODSTOCK).map(([id, asset]) => <img key={id} className={`filming__bird ${woodstock === id ? 'is-active' : ''}`} src={asset.src} alt="" aria-hidden="true" />)}
          </div>
          {dialogue && <div className="filming__dialogue" data-speaker={dialogue.speaker} aria-live="polite" aria-atomic="true">
            {dialogue.speaker === 'voice' ? <div className="filming__voice">
              <span>{SCRIPT.backstage.voiceLabel}</span><p>{dialogue.text}</p>
            </div> : <>
              <span className="filming__speaker">{SCRIPT.backstage.snoopyLabel}</span>
              <ComicBubble variant="thought" className={dialogue.emphasis ? 'filming__punchline' : ''}>{dialogue.text}</ComicBubble>
            </>}
          </div>}
        </section>
        {postersVisible && <div className="filming__posters" ref={postersRef} role="group" aria-label={SCRIPT.filming.introduction1}>
          {SCRIPT.filming.genres.map((option, index) => <button key={option.id} ref={index === 0 ? firstPosterRef : undefined} type="button" className={`filming__poster filming__poster--${option.id}`} aria-pressed={selected === option.id} disabled={phase === 'confirming'} onClick={() => chooseGenre(option.id)}>
            <span className="filming__poster-art" aria-hidden="true">
              <img className="filming__poster-effect" src={option.id === 'drama' ? ASSETS.stormRain : ASSETS.explosion} alt="" />
              <img className="filming__poster-character" src={option.id === 'drama' ? ASSETS.snoopyDrama : ASSETS.snoopyAction} alt="" />
            </span>
            <strong>{option.title}</strong><span className="filming__poster-description">{option.description}</span>
          </button>)}
        </div>}
      </div>
      <div className="filming__footer">
        {phase === 'review' && <aside className="filming__review" ref={reviewRef} tabIndex={-1} aria-live="polite">
          <span className="filming__review-title">{SCRIPT.filming.reviewTitle}</span>
          <span className="filming__stars" aria-label={SCRIPT.filming.reviewRatingLabel}>{SCRIPT.filming.reviewStars}</span>
          <blockquote>{SCRIPT.filming.reviewComment}</blockquote>
          <cite>{SCRIPT.filming.reviewSignature}</cite>
          <button ref={advanceRef} type="button" className="filming__advance filming__skip-review" onClick={skipReview}>{SCRIPT.filming.skipReview}</button>
        </aside>}
        {dialogue && !endingReady && <button ref={advanceRef} type="button" className="filming__advance" onClick={advanceLine}>{SCRIPT.backstage.nextLine}</button>}
        {endingReady && <div className="filming__closing">
          <p>{SCRIPT.filming.nextSession}</p>
          <button ref={continueRef} type="button" className="pill-button" onClick={continueToScreening}>{SCRIPT.filming.cta}</button>
        </div>}
      </div>
    </main>
  );
}
