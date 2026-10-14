import type { SceneId } from '../../app/scenes';
import { SCENE_LABELS } from '../../app/scenes';
import { SCRIPT } from '../../content/script';
import './ScenePlaceholder.scss';

type Props = {
  scene: Exclude<SceneId, 'opening'>;
  onBack: () => void;
};

// Placeholder proposital: o Codex implementará estas cenas UMA DE CADA VEZ.
export function ScenePlaceholder({ scene, onBack }: Props) {
  return (
    <section className="scene-placeholder" aria-labelledby="scene-title">
      <span className="scene-placeholder__eyebrow">{SCENE_LABELS[scene]}</span>
      <h1 id="scene-title">Cena em preparação 🎬</h1>
      <p>O pequeno estúdio ainda está preparando esta parte do filme.</p>
      {scene === 'letter' && <p className="scene-placeholder__note">A mensagem já está guardada em <code>src/content/script.ts</code>.</p>}
      <button type="button" className="pill-button pill-button--secondary" onClick={onBack}>
        Voltar ao convite
      </button>
      {import.meta.env.DEV && <small>Rascunho local · {SCRIPT.title}</small>}
    </section>
  );
}
