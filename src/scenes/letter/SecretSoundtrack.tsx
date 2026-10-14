import { useEffect, useRef, useState } from 'react';
import { ASSETS } from '../../config/assets';
import { SCRIPT } from '../../content/script';
import './SecretSoundtrack.scss';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

export function SecretSoundtrack() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => () => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); }
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || error) return;
    if (!audio.paused) { audio.pause(); return; }
    if (duration && audio.currentTime >= duration) audio.currentTime = 0;
    try { await audio.play(); }
    catch { setIsPlaying(false); setIsLoading(false); setError(true); }
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = value;
    setCurrentTime(value);
  }

  function changeVolume(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value;
    setVolume(value);
    if (value > 0 && isMuted) { audio.muted = false; setIsMuted(false); }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }

  return <section className="soundtrack" aria-labelledby="soundtrack-title">
    <audio ref={audioRef} src={ASSETS.secretSoundtrack} preload="metadata"
      onLoadStart={() => { setIsLoading(true); setError(false); }}
      onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
      onCanPlay={() => setIsLoading(false)}
      onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      onPlay={() => { setIsPlaying(true); setIsLoading(false); }}
      onPause={() => setIsPlaying(false)}
      onEnded={() => setIsPlaying(false)}
      onError={() => { setError(true); setIsLoading(false); setIsPlaying(false); }} />
    <p className="soundtrack__label">{SCRIPT.easterEgg.soundtrackLabel}</p>
    <div className="soundtrack__layout">
      <div className={`soundtrack__vinyl ${isPlaying ? 'is-playing' : ''}`} aria-hidden="true"><span /></div>
      <div className="soundtrack__details">
        <h3 id="soundtrack-title">{SCRIPT.easterEgg.soundtrackName}</h3>
        <p className="soundtrack__artist">{SCRIPT.easterEgg.soundtrackArtist}</p>
        <p className="soundtrack__caption">{SCRIPT.easterEgg.soundtrackCaption}</p>
      </div>
    </div>
    <div className="soundtrack__transport">
      <button type="button" className="soundtrack__play" onClick={togglePlayback} disabled={error || isLoading}
        aria-label={isPlaying ? SCRIPT.easterEgg.pauseLabel : SCRIPT.easterEgg.playLabel} aria-pressed={isPlaying}>
        <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
      </button>
      <span className="soundtrack__time">{formatTime(currentTime)}</span>
      <input className="soundtrack__progress" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)}
        disabled={error || !duration} aria-label={SCRIPT.easterEgg.progressLabel} onChange={(event) => seek(Number(event.currentTarget.value))} />
      <span className="soundtrack__time">{formatTime(duration)}</span>
    </div>
    <div className="soundtrack__volume">
      <button type="button" onClick={toggleMute} disabled={error} aria-label={isMuted ? SCRIPT.easterEgg.unmuteLabel : SCRIPT.easterEgg.muteLabel} aria-pressed={isMuted}>
        <span aria-hidden="true">{isMuted || volume === 0 ? '♩' : '♫'}</span>
      </button>
      <input type="range" min="0" max="1" step="0.05" value={volume} disabled={error}
        aria-label={SCRIPT.easterEgg.volumeLabel} onChange={(event) => changeVolume(Number(event.currentTarget.value))} />
    </div>
    <p className={`soundtrack__status ${error ? 'is-error' : ''}`} role="status">
      {error ? SCRIPT.easterEgg.errorMessage : isLoading ? SCRIPT.easterEgg.loadingLabel : ''}
    </p>
  </section>;
}
