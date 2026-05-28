'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const PanoramaViewer = dynamic(() => import('./PanoramaViewer'), { ssr: false });

interface Props {
  src:        string;
  title?:     string;
  subtitle?:  string;
  children?:  React.ReactNode;
  className?: string;
}

export default function PanoramaViewerTrigger({ src, title, subtitle, children, className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className}
        aria-label="Open 360° virtual tour"
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex' }}
      >
        {children ?? <DefaultLabel />}
      </button>

      {open && (
        <PanoramaViewer
          src={src}
          title={title}
          subtitle={subtitle}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function DefaultLabel() {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '11px 24px',
        background: hover ? 'rgba(201,169,110,0.12)' : 'rgba(201,169,110,0.07)',
        border: `1px solid ${hover ? 'rgba(201,169,110,0.48)' : 'rgba(201,169,110,0.28)'}`,
        borderRadius: 2,
        color: '#C9A96E',
        fontSize: '0.71rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-jost, system-ui, sans-serif)',
        transition: 'all 0.25s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Globe / 360 icon */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="7" cy="7" r="6" />
        <ellipse cx="7" cy="7" rx="3.2" ry="6" />
        <line x1="1" y1="7" x2="13" y2="7" />
        <path d="M2.5 3.5 Q7 5.5 11.5 3.5" strokeLinecap="round" />
        <path d="M2.5 10.5 Q7 8.5 11.5 10.5" strokeLinecap="round" />
      </svg>
      360° Virtual Tour
    </span>
  );
}
