import { useEffect, useState } from 'react';
import { ASSETS } from '../config/assets';
import { preloadImages } from '../animation/images';
import { OpeningScene } from '../scenes/opening/OpeningScene';
import { BackstageScene } from '../scenes/backstage/BackstageScene';
import { FilmingScene } from '../scenes/filming/FilmingScene';
import { ScreeningScene } from '../scenes/screening/ScreeningScene';
import { FinaleScene } from '../scenes/finale/FinaleScene';
import { LetterScene } from '../scenes/letter/LetterScene';
import { SCENES, SCENE_LABELS, type SceneId, type Genre } from './scenes';
import './App.scss';

export function App() {
  const [scene, setScene] = useState<SceneId>('opening');
  // A pré-estreia reprisa a escolha; somente restart limpa o gênero.
  const [genre, setGenre] = useState<Genre>(null);
  const showDebug = import.meta.env.DEV && new URLSearchParams(window.location.search).has('debug');
  useEffect(() => { void preloadImages(Object.values(ASSETS)); }, []);

  function restart() {
    setGenre(null);
    setScene('opening');
  }

  return (
    <>
      {scene === 'opening'
        ? <OpeningScene onAccept={() => setScene('backstage')} />
        : scene === 'backstage'
          ? <BackstageScene onContinue={() => setScene('filming')} />
          : scene === 'filming'
            ? <FilmingScene onSelectGenre={setGenre} onContinue={() => setScene('screening')} />
            : scene === 'screening'
              ? <ScreeningScene genre={genre} onContinue={() => setScene('finale')} />
              : scene === 'finale'
                ? <FinaleScene onContinue={() => setScene('letter')} />
                : <LetterScene onRestart={restart} />}

      {showDebug && (
        <aside className="dev-tools" aria-label="Navegação de desenvolvimento">
          <span>Prévia das cenas</span>
          <select aria-label="Escolher cena" value={scene} onChange={(event) => setScene(event.target.value as SceneId)}>
            {SCENES.map((id) => <option key={id} value={id}>{SCENE_LABELS[id]}</option>)}
          </select>
          <select aria-label="Prévia do gênero" value={genre ?? ''} onChange={(event) => setGenre((event.target.value || null) as Genre)}>
            <option value="">Gênero não escolhido</option>
            <option value="drama">Drama</option>
            <option value="action">Ação</option>
          </select>
        </aside>
      )}
    </>
  );
}
