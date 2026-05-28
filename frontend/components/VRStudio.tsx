'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, useId } from 'react';
import dynamic from 'next/dynamic';

const VRViewer = dynamic(() => import('./VRViewer'), { ssr: false });

const GOLD = '#C9A96E';
const BG   = '#0A0806';
// Free equirectangular demo panorama from Photo Sphere Viewer team
const DEMO_SRC = 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg';

type State =
  | { mode: 'input' }
  | { mode: 'viewing'; src: string; label: string; isBlob: boolean };

// ── Icon: Upload ──────────────────────────────────────────────────────────────
function IconUpload() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V8" />
      <path d="M9 13l5-5 5 5" />
      <path d="M5 22h18" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="9" cy="9" r="7.5" />
      <ellipse cx="9" cy="9" rx="3.5" ry="7.5" />
      <line x1="1.5" y1="9" x2="16.5" y2="9" />
      <path d="M3 5.5 Q9 8 15 5.5" />
      <path d="M3 12.5 Q9 10 15 12.5" />
    </svg>
  );
}

// ── Input page ────────────────────────────────────────────────────────────────

interface InputPageProps {
  onLoad: (src: string, label: string, isBlob: boolean) => void;
}

function InputPage({ onLoad }: InputPageProps) {
  const [url,         setUrl]         = useState('');
  const [dragging,    setDragging]    = useState(false);
  const [error,       setError]       = useState('');
  const fileInputId = useId();
  const fileRef     = useRef<HTMLInputElement>(null);
  const blobRef     = useRef<string | null>(null);

  const revokePrev = () => {
    if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = null; }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) { setError('Please enter a URL.'); return; }
    try { new URL(trimmed); } catch { setError('Enter a valid URL (starting with https://).'); return; }
    setError('');
    onLoad(trimmed, new URL(trimmed).pathname.split('/').pop() ?? '360°', false);
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please use a JPEG, PNG, or WebP image.'); return; }
    if (file.size > 80 * 1024 * 1024)   { setError('Image must be under 80 MB.'); return; }
    setError('');
    revokePrev();
    const blob = URL.createObjectURL(file);
    blobRef.current = blob;
    onLoad(blob, file.name, true);
  }, [onLoad]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{
      minHeight: '100dvh', background: BG, overflowX: 'hidden',
      fontFamily: 'var(--font-jost, system-ui, sans-serif)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 500, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(201,169,110,0.05) 0%, transparent 65%)',
        borderRadius: '50%',
      }} />

      {/* Header */}
      <header style={{
        padding: '18px clamp(20px,5vw,48px)',
        borderBottom: '1px solid rgba(201,169,110,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/logo3.svg" alt="IDF" width={32} height={48} style={{ height: 40, width: 'auto' }} priority />
          <div>
            <p style={{
              fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', fontWeight: 500,
              color: 'rgba(245,239,228,0.9)', letterSpacing: '0.06em', lineHeight: 1, marginBottom: 3,
            }}>Innovation Designer Furniture</p>
            <p style={{ fontSize: '0.55rem', color: 'rgba(201,169,110,0.55)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              360° Studio
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px',
          background: 'rgba(201,169,110,0.07)',
          border: '1px solid rgba(201,169,110,0.18)',
          borderRadius: 20,
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill={GOLD} opacity="0.7"/></svg>
          <span style={{ fontSize: '0.58rem', color: 'rgba(201,169,110,0.7)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            Live
          </span>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px,8vw,80px) clamp(20px,5vw,48px)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1, background: 'rgba(201,169,110,0.35)' }} />
            <span style={{ fontSize: '0.58rem', color: 'rgba(201,169,110,0.6)', letterSpacing: '0.26em', textTransform: 'uppercase' }}>
              Panorama Viewer
            </span>
            <div style={{ width: 24, height: 1, background: 'rgba(201,169,110,0.35)' }} />
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-cormorant, Georgia, serif)',
            fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: 400,
            color: 'rgba(245,239,228,0.95)', letterSpacing: '-0.01em', lineHeight: 1.1,
            textAlign: 'center', marginBottom: 10,
          }}>
            View Any Space in 360°
          </h1>

          <p style={{
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
            color: 'rgba(139,125,110,0.75)', letterSpacing: '0.02em', lineHeight: 1.7,
            textAlign: 'center', marginBottom: 40,
          }}>
            Paste an equirectangular panorama URL or drop an image file.
          </p>

          {/* URL form */}
          <form onSubmit={handleUrlSubmit} style={{ marginBottom: 20 }}>
            <div style={{
              display: 'flex', gap: 8, alignItems: 'stretch',
              background: 'rgba(201,169,110,0.05)',
              border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(201,169,110,0.2)'}`,
              borderRadius: 3, padding: 4,
              transition: 'border-color 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 12, color: 'rgba(201,169,110,0.45)', flexShrink: 0 }}>
                <IconGlobe />
              </div>
              <input
                type="text"
                value={url}
                onChange={e => { setUrl(e.target.value); setError(''); }}
                placeholder="https://your-panorama.jpg"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'rgba(245,239,228,0.88)', fontSize: '0.85rem',
                  letterSpacing: '0.01em', padding: '10px 8px',
                  fontFamily: 'var(--font-jost, system-ui, sans-serif)',
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px', flexShrink: 0,
                  background: 'rgba(201,169,110,0.12)',
                  border: '1px solid rgba(201,169,110,0.3)',
                  borderRadius: 2,
                  color: GOLD, fontSize: '0.7rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  cursor: 'pointer', outline: 'none',
                  fontFamily: 'var(--font-jost, system-ui, sans-serif)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                Load
              </button>
            </div>
            {error && (
              <p style={{ fontSize: '0.72rem', color: 'rgba(239,68,68,0.8)', marginTop: 8, letterSpacing: '0.02em' }}>
                {error}
              </p>
            )}
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.1)' }} />
            <span style={{ fontSize: '0.62rem', color: 'rgba(139,125,110,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              or
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.1)' }} />
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `1.5px dashed ${dragging ? 'rgba(201,169,110,0.7)' : 'rgba(201,169,110,0.2)'}`,
              borderRadius: 3,
              padding: 'clamp(28px,5vw,40px) 24px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 10,
              cursor: 'pointer',
              background: dragging ? 'rgba(201,169,110,0.05)' : 'transparent',
              transition: 'all 0.2s ease',
              marginBottom: 28,
            }}
          >
            <div style={{ color: 'rgba(201,169,110,0.5)', transition: 'color 0.2s' }}>
              <IconUpload />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(245,239,228,0.6)', letterSpacing: '0.04em', textAlign: 'center' }}>
              {dragging ? 'Drop to load panorama' : 'Drag & drop an image'}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(139,125,110,0.45)', letterSpacing: '0.06em' }}>
              JPEG · PNG · WebP · up to 80 MB
            </p>
            <input
              id={fileInputId}
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          {/* Demo button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onLoad(DEMO_SRC, 'Sample Panorama', false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 7,
                color: 'rgba(139,125,110,0.55)',
                fontSize: '0.68rem', letterSpacing: '0.12em',
                fontFamily: 'var(--font-jost, system-ui, sans-serif)',
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(139,125,110,0.55)')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <polygon points="5,3 11,7 5,11" />
              </svg>
              Load sample panorama
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '16px clamp(20px,5vw,48px)',
        borderTop: '1px solid rgba(201,169,110,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <p style={{ fontSize: '0.6rem', color: 'rgba(139,125,110,0.3)', letterSpacing: '0.1em' }}>
          Innovation Designer Furniture · Virtual Studio
        </p>
      </footer>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function VRStudio() {
  const [state,      setState]      = useState<State>({ mode: 'input' });
  const [loadError,  setLoadError]  = useState(false);
  const blobTracker = useRef<string | null>(null);

  const handleLoad = useCallback((src: string, label: string, isBlob: boolean) => {
    if (isBlob) blobTracker.current = src;
    setLoadError(false);
    setState({ mode: 'viewing', src, label, isBlob });
  }, []);

  const handleBack = useCallback(() => {
    if (state.mode === 'viewing' && state.isBlob && blobTracker.current) {
      URL.revokeObjectURL(blobTracker.current);
      blobTracker.current = null;
    }
    setLoadError(false);
    setState({ mode: 'input' });
  }, [state]);

  const handleError = useCallback(() => {
    setLoadError(true);
  }, []);

  if (state.mode === 'viewing') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: BG }}>
        {loadError && (
          <div style={{
            position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
            zIndex: 30, whiteSpace: 'nowrap',
            background: 'rgba(10,8,6,0.9)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 24, padding: '10px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(239,68,68,0.8)" strokeWidth="1.4" strokeLinecap="round">
              <circle cx="7" cy="7" r="6"/>
              <line x1="7" y1="4" x2="7" y2="7.5"/>
              <circle cx="7" cy="10" r="0.6" fill="rgba(239,68,68,0.8)" stroke="none"/>
            </svg>
            <span style={{ fontSize: '0.7rem', color: 'rgba(245,239,228,0.7)', letterSpacing: '0.06em' }}>
              Could not load panorama — check the URL or try another image.
            </span>
            <button
              onClick={handleBack}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: GOLD, fontSize: '0.65rem', letterSpacing: '0.14em',
                textTransform: 'uppercase', marginLeft: 4, padding: 0,
                fontFamily: 'var(--font-jost, system-ui, sans-serif)',
              }}
            >
              Try again
            </button>
          </div>
        )}
        <VRViewer
          src={state.src}
          title={state.label}
          onBack={handleBack}
          onError={handleError}
        />
      </div>
    );
  }

  return <InputPage onLoad={handleLoad} />;
}
