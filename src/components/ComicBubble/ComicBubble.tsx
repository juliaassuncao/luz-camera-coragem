import type { ReactNode } from 'react';
import './ComicBubble.scss';

type ComicBubbleProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  variant?: 'speech' | 'thought';
};

export function ComicBubble({ children, className = '', label, variant = 'speech' }: ComicBubbleProps) {
  return (
    <div className={`comic-bubble ${variant === 'thought' ? 'comic-bubble--thought' : ''} ${className}`}>
      {label ? <span className="comic-bubble__label">{label}</span> : null}
      <p>{children}</p>
    </div>
  );
}
