import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ASSETS } from '../../config/assets';
import { SCRIPT } from '../../content/script';
import { SecretSoundtrack } from './SecretSoundtrack';
import './LetterScene.scss';

gsap.registerPlugin(useGSAP);

type Props = { onRestart: () => void };
type Phase = 'opening' | 'reading';

export function LetterScene({ onRestart }: Props) {
  const scopeRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const braceletRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reading' : 'opening');
  const opening = phase === 'opening';

  const closeModal = () => {
    if (!modalOpen || closingRef.current) return;
    modalRef.current?.querySelector('audio')?.pause();
    closingRef.current = true;
    const finish = () => {
      setModalOpen(false);
      closingRef.current = false;
      requestAnimationFrame(() => braceletRef.current?.focus({ preventScroll: true }));
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    gsap.timeline({ onComplete: finish })
      .to(modalRef.current, { opacity: 0, y: 5, scale: 0.985, duration: 0.16, ease: 'power1.in' }, 0)
      .to('.letter__secret-overlay', { opacity: 0, duration: 0.18 }, 0);
  };

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  useEffect(() => {
    if (phase === 'reading' && document.activeElement === document.body) {
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  useEffect(() => {
    if (!modalOpen) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = [...modalRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      gsap.killTweensOf([modalRef.current, '.letter__secret-overlay']);
    };
  }, [modalOpen]);

  useGSAP(() => {
    if (!modalOpen) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline()
        .fromTo('.letter__secret-overlay', { opacity: 0 }, { opacity: 1, duration: 0.38, ease: 'power1.out' }, 0)
        .fromTo(modalRef.current, { opacity: 0, y: 10, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }, 0.03);
    });
    return () => media.revert();
  }, { dependencies: [modalOpen] });

  useGSAP(() => {
    if (!opening) return;
    const reveal = () => setPhase('reading');
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: reduce)', reveal);
    media.add('(prefers-reduced-motion: no-preference)', (_motionContext, motionSafe) => {
      if (!motionSafe) { reveal(); return; }
      const expandSheet = motionSafe(() => {
        const paper = scopeRef.current?.querySelector<HTMLElement>('.letter__paper');
        const pocket = scopeRef.current?.querySelector<HTMLElement>('.letter__pocket');
        const sheet = scopeRef.current?.querySelector<HTMLElement>('.letter__sheet');
        if (!paper || !pocket || !sheet) { reveal(); return; }
        const start = paper.getBoundingClientRect();
        const origin = pocket.getBoundingClientRect();
        const target = sheet.getBoundingClientRect();
        // Match the live letter, including longer copy and mobile wrapping.
        gsap.set(pocket, { overflow: 'visible', zIndex: 6 });
        gsap.set(paper, { top: start.top - origin.top, left: start.left - origin.left,
          width: start.width, height: start.height, bottom: 'auto', yPercent: 0 });
        gsap.to(paper, { top: target.top - origin.top, left: target.left - origin.left,
          width: target.width, height: target.height, duration: 0.65, ease: 'power2.inOut' });
      });
      gsap.timeline({ defaults: { ease: 'power1.out' }, onComplete: reveal })
        .set('.letter__paper', { autoAlpha: 1, yPercent: 70 }, 0)
        .to('.letter__seal', { autoAlpha: 0, duration: 0.16 }, 0.18)
        .to('.letter__flap', { rotationX: -180, duration: 0.48, ease: 'power2.inOut' }, 0.18)
        .set('.letter__flap', { zIndex: 1 }, 0.43)
        .to('.letter__paper', { yPercent: -86, duration: 0.65, ease: 'power2.inOut' }, 0.55)
        .call(() => expandSheet(), [], 1.24)
        .to('.letter__body, .letter__front, .letter__flap', { autoAlpha: 0, duration: 0.3 }, 1.26)
        .to('.letter__paper', { autoAlpha: 0, duration: 0.24 }, 1.9)
        .fromTo('.letter__reading', { autoAlpha: 0, y: 0 }, { autoAlpha: 1, y: 0, duration: 0.24 }, 1.9);
    });
    // An interrupted introduction must never keep the personal message hidden.
    const finishWhenHidden = () => { if (document.hidden) reveal(); };
    document.addEventListener('visibilitychange', finishWhenHidden);
    window.addEventListener('resize', reveal);
    finishWhenHidden();
    return () => {
      document.removeEventListener('visibilitychange', finishWhenHidden);
      window.removeEventListener('resize', reveal);
      media.revert();
    };
  }, { scope: scopeRef, dependencies: [opening], revertOnUpdate: true });

  return (
    <main className="letter" ref={scopeRef} data-phase={phase}>
      <div className="letter__scenery" aria-hidden="true">
        <img src={ASSETS.backgroundClean} alt="" />
        <div className="letter__dusk" />
      </div>
      {opening && <div className="letter__opening" aria-hidden="true">
        <div className="letter__body" />
        <div className="letter__flap" />
        <img className="letter__seal" src={ASSETS.heartDoodle} alt="" />
        <div className="letter__pocket"><div className="letter__paper" /></div>
        <div className="letter__front" />
      </div>}
      <div className="letter__reading" aria-hidden={opening} inert={opening}>
        <article className="letter__sheet" aria-labelledby="letter-greeting">
          <header>
            <p className="letter__eyebrow">{SCRIPT.letter.title}</p>
            <h1 id="letter-greeting" ref={headingRef} tabIndex={-1}>{SCRIPT.letter.greeting}</h1>
          </header>
          <div className="letter__message">
            {SCRIPT.letter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="letter__signature">
            <div>
              <p>{SCRIPT.letter.signoff}</p>
              <p><strong>{SCRIPT.letter.signature}</strong></p>
            </div>
            <img src={ASSETS.letterCameo} width="738" height="927" alt="" aria-hidden="true" />
          </div>
          <p className="letter__postscript">{SCRIPT.letter.postscript}</p>
          <footer className="letter__credits">
            <p className="letter__end-title">{SCRIPT.letter.endTitle}</p>
          </footer>
        </article>
        <div className="letter__keepsake">
          <button ref={braceletRef} type="button" className="letter__bracelet" aria-label={SCRIPT.easterEgg.triggerLabel}
            disabled={opening} onClick={() => setModalOpen(true)}>
            <img src={ASSETS.friendshipBraceletSwift} alt={SCRIPT.letter.braceletAlt} width="1254" height="1249" />
          </button>
        </div>
        <div className="letter__replay">
          <button type="button" className="pill-button" onClick={onRestart}>{SCRIPT.letter.replay}</button>
        </div>
      </div>
      {modalOpen && createPortal(
        <div className="letter__secret-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <div ref={modalRef} className="letter__secret" role="dialog" aria-modal="true" aria-labelledby="secret-title" aria-describedby="secret-description">
            <button ref={closeRef} type="button" className="letter__secret-close" aria-label={SCRIPT.easterEgg.closeLabel} onClick={closeModal}>×</button>
            <p className="letter__secret-label">{SCRIPT.easterEgg.label}</p>
            <h2 id="secret-title">{SCRIPT.easterEgg.title}</h2>
            <div id="secret-description" className="letter__secret-copy">
              <p>{SCRIPT.easterEgg.introduction}</p>
              <p>{SCRIPT.easterEgg.message}</p>
              <p className="letter__secret-emphasis">{SCRIPT.easterEgg.emphasis}</p>
            </div>
            <p className="letter__secret-footer">{SCRIPT.easterEgg.footer}</p>
            <SecretSoundtrack />
          </div>
        </div>, document.body)}
    </main>
  );
}
