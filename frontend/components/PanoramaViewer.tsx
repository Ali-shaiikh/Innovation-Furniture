'use client';

import '@photo-sphere-viewer/core/index.css';
import { useEffect, useRef, useState, useCallback } from 'react';

const GOLD = '#C9A96E';
const BG   = '#0A0806';

interface Props {
  src:       string;
  title?:    string;
  subtitle?: string;
  onClose:   () => void;
}

// ── Inline SVG Icons ──────────────────────────────────────────────────────────

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="3" x2="15" y2="15" />
      <line x1="15" y1="3" x2="3" y2="15" />
    </svg>
  );
}

function IconExpand() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <polyline points="10,2 15,2 15,7" />
      <polyline points="7,15 2,15 2,10" />
      <line x1="15" y1="2" x2="9.5" y2="7.5" />
      <line x1="2" y1="15" x2="7.5" y2="9.5" />
    </svg>
  );
}

function IconCompress() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <polyline points="15,5 10,5 10,0" />
      <polyline points="2,12 7,12 7,17" />
      <line x1="10" y1="5" x2="16" y2="0" />
      <line x1="7" y1="12" x2="1" y2="17" />
    </svg>
  );
}

function IconGyro({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="5.5" y="1.5" width="7" height="15" rx="2" />
      <circle cx="9" cy="13.5" r="1.2" fill={active ? GOLD : 'currentColor'} stroke="none" />
      {active && <circle cx="9" cy="8.5" r="2.5" strokeDasharray="2 1.5" strokeWidth="1" />}
    </svg>
  );
}

function IconZoomIn() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="7" cy="7" r="5" />
      <line x1="7" y1="4.5" x2="7" y2="9.5" />
      <line x1="4.5" y1="7" x2="9.5" y2="7" />
      <line x1="11" y1="11" x2="15.5" y2="15.5" />
    </svg>
  );
}

function IconZoomOut() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="7" cy="7" r="5" />
      <line x1="4.5" y1="7" x2="9.5" y2="7" />
      <line x1="11" y1="11" x2="15.5" y2="15.5" />
    </svg>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{
      width: 1, height: 20, flexShrink: 0, margin: '0 2px',
      background: 'rgba(201,169,110,0.2)',
    }} />
  );
}

function CtrlBtn({
  onClick, title, active = false, children,
}: {
  onClick: () => void; title: string; active?: boolean; children: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 40, height: 40, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(201,169,110,0.18)' : hover ? 'rgba(201,169,110,0.1)' : 'transparent',
        border: 'none', borderRadius: 28,
        color: active || hover ? GOLD : 'rgba(245,239,228,0.72)',
        cursor: 'pointer', outline: 'none',
        transition: 'all 0.18s ease',
      }}
    >
      {children}
    </button>
  );
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      title="Close (Esc)"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 38, height: 38, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,8,6,0.5)',
        border: `1px solid ${hover ? 'rgba(201,169,110,0.5)' : 'rgba(201,169,110,0.2)'}`,
        borderRadius: '50%',
        color: hover ? GOLD : 'rgba(245,239,228,0.78)',
        cursor: 'pointer', outline: 'none',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.18s ease',
      }}
    >
      <IconClose />
    </button>
  );
}

// ── Main Viewer ───────────────────────────────────────────────────────────────

export default function PanoramaViewer({ src, title, subtitle, onClose }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const viewerRef     = useRef<any>(null);
  const gyroRef       = useRef<any>(null);

  const [loading,    setLoading]    = useState(true);
  const [progress,   setProgress]   = useState(0);
  const [fading,     setFading]     = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [gyroOn,     setGyroOn]     = useState(false);
  const [gyroAvail,  setGyroAvail]  = useState(false);
  const [hint,       setHint]       = useState(false);

  // ── Init Photo Sphere Viewer ────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    let viewer: any;

    (async () => {
      try {
        const [{ Viewer }, { GyroscopePlugin }] = await Promise.all([
          import('@photo-sphere-viewer/core'),
          import('@photo-sphere-viewer/gyroscope-plugin'),
        ]);

        viewer = new Viewer({
          container:            containerRef.current!,
          panorama:             src,
          navbar:               false,
          defaultZoomLvl:       50,
          minFov:               30,
          maxFov:               90,
          moveSpeed:            1.2,
          zoomSpeed:            1,
          moveInertia:          true,
          mousewheelCtrlKey:    false,
          touchmoveTwoFingers:  false,
          plugins: [[GyroscopePlugin, { touchmove: true, absolutePosition: false }]],
        });

        viewerRef.current = viewer;
        gyroRef.current   = viewer.getPlugin(GyroscopePlugin);

        if (typeof window !== 'undefined' &&
            ('DeviceOrientationEvent' in window || 'DeviceMotionEvent' in window)) {
          setGyroAvail(true);
        }

        viewer.addEventListener('ready', () => {
          setFading(true);
          setProgress(100);
          setTimeout(() => {
            setLoading(false);
            setHint(true);
            setTimeout(() => setHint(false), 3600);
          }, 560);
        });
      } catch (err) {
        console.error('[PanoramaViewer]', err);
      }
    })();

    return () => { viewer?.destroy(); viewerRef.current = null; };
  }, [src]);

  // ── Simulated loading progress ──────────────────────────────────────────────
  useEffect(() => {
    if (!loading || fading) return;
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(p + Math.random() * 12 + 4, 88);
      setProgress(p);
      if (p >= 88) clearInterval(t);
    }, 160);
    return () => clearInterval(t);
  }, [loading, fading]);

  // ── Fullscreen API sync ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ── Keyboard: ESC closes when not in native fullscreen ─────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // ── Control handlers ────────────────────────────────────────────────────────

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  }, []);

  const toggleGyro = useCallback(async () => {
    const g = gyroRef.current;
    if (!g) return;
    if (gyroOn) { g.stop(); setGyroOn(false); return; }

    // iOS 13+ requires explicit user permission
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === 'function') {
      try {
        if (await DOE.requestPermission() !== 'granted') return;
      } catch { return; }
    }
    try { await g.start(); setGyroOn(true); } catch { /* sensor unavailable */ }
  }, [gyroOn]);

  const zoomBy = useCallback((delta: number) => {
    const v = viewerRef.current;
    if (!v) return;
    try { v.zoom(v.getZoomLevel() + delta); } catch { /* ignore */ }
  }, []);

  // ── SVG ring geometry ───────────────────────────────────────────────────────
  const R    = 52;
  const CIRC = 2 * Math.PI * R;
  const dashOffset = CIRC * (1 - Math.min(progress, 100) / 100);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: BG,
        fontFamily: 'var(--font-jost, system-ui, sans-serif)',
      }}
    >
      {/* ── PSV Canvas container ─────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
      />

      {/* ── Loading overlay ──────────────────────────────────────────────── */}
      {loading && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: BG,
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.56s cubic-bezier(0.25,0.46,0.45,0.94)',
            pointerEvents: fading ? 'none' : 'auto',
          }}
        >
          {/* Ambient glow orb */}
          <div style={{
            position: 'absolute',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(201,169,110,0.055) 0%, transparent 65%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          {/* Progress ring */}
          <div style={{ position: 'relative', width: 136, height: 136, marginBottom: 38 }}>
            <svg width="136" height="136" viewBox="0 0 136 136"
              style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              {/* Outer soft halo */}
              <circle cx="68" cy="68" r={R + 9} fill="none"
                stroke="rgba(201,169,110,0.04)" strokeWidth="14" />
              {/* Track ring */}
              <circle cx="68" cy="68" r={R} fill="none"
                stroke="rgba(201,169,110,0.1)" strokeWidth="1" />
              {/* Live progress arc */}
              <circle cx="68" cy="68" r={R} fill="none"
                stroke={GOLD} strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.22s ease-out' }}
              />
              {/* Inner decorative ring */}
              <circle cx="68" cy="68" r={R - 16} fill="none"
                stroke="rgba(201,169,110,0.07)" strokeWidth="0.5" />
            </svg>

            {/* IDF monogram + percentage */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
              <span style={{
                fontFamily: 'var(--font-cormorant, Georgia, serif)',
                fontSize: '1.05rem', color: GOLD,
                letterSpacing: '0.14em', fontWeight: 600,
              }}>
                IDF
              </span>
              <span style={{
                fontSize: '0.58rem',
                color: 'rgba(201,169,110,0.55)',
                letterSpacing: '0.1em', fontWeight: 500,
              }}>
                {Math.round(Math.min(progress, 100))}%
              </span>
            </div>
          </div>

          {/* Headline */}
          <p style={{
            fontFamily: 'var(--font-cormorant, Georgia, serif)',
            fontSize: '1.5rem', fontWeight: 400,
            color: 'rgba(245,239,228,0.88)',
            letterSpacing: '0.04em', marginBottom: 7,
          }}>
            Initializing 360° Experience
          </p>
          <p style={{
            fontSize: '0.65rem',
            color: 'rgba(139,125,110,0.65)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}>
            Preparing Immersive View
          </p>

          {/* Pulse dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 38 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 4, height: 4, borderRadius: '50%', background: GOLD,
                animation: `psv-pulse 1.5s ease-in-out ${i * 0.22}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Top bar (title + 360 badge + close) ──────────────────────────── */}
      {!loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          padding: '20px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          background: 'linear-gradient(to bottom, rgba(10,8,6,0.72) 0%, transparent 100%)',
          animation: 'psv-fadeIn 0.4s ease forwards',
        }}>
          {/* Left: title */}
          <div style={{ minWidth: 0 }}>
            {title && (
              <p style={{
                fontFamily: 'var(--font-cormorant, Georgia, serif)',
                fontSize: '1.2rem', fontWeight: 500,
                color: 'rgba(245,239,228,0.93)',
                letterSpacing: '0.04em', marginBottom: 2,
              }}>
                {title}
              </p>
            )}
            {subtitle && (
              <p style={{
                fontSize: '0.62rem', color: GOLD,
                letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Centre: 360° badge */}
          <div style={{
            position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(201,169,110,0.09)',
            border: '1px solid rgba(201,169,110,0.22)',
            borderRadius: 24, padding: '5px 14px',
            backdropFilter: 'blur(10px)',
            whiteSpace: 'nowrap',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke={GOLD} strokeWidth="0.8" opacity="0.75" />
              <ellipse cx="6" cy="6" rx="2.8" ry="5" stroke={GOLD} strokeWidth="0.8" opacity="0.75" />
              <line x1="1" y1="6" x2="11" y2="6" stroke={GOLD} strokeWidth="0.8" opacity="0.75" />
            </svg>
            <span style={{ fontSize: '0.6rem', color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              360° View
            </span>
          </div>

          {/* Right: close */}
          <CloseBtn onClick={onClose} />
        </div>
      )}

      {/* ── Drag hint pill ────────────────────────────────────────────────── */}
      {hint && (
        <div style={{
          position: 'absolute', bottom: 88, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'rgba(10,8,6,0.65)',
          border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: 24, padding: '7px 18px',
          backdropFilter: 'blur(12px)',
          animation: 'psv-hintIn 0.5s ease forwards, psv-hintOut 0.5s 3.1s ease forwards',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
            <line x1="9" y1="3" x2="9" y2="7" />
            <polyline points="7,5 9,3 11,5" />
            <line x1="9" y1="15" x2="9" y2="11" />
            <polyline points="7,13 9,15 11,13" />
            <line x1="3" y1="9" x2="7" y2="9" />
            <polyline points="5,7 3,9 5,11" />
            <line x1="15" y1="9" x2="11" y2="9" />
            <polyline points="13,7 15,9 13,11" />
          </svg>
          <span style={{
            fontSize: '0.63rem',
            color: 'rgba(245,239,228,0.72)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            Drag to Explore
          </span>
        </div>
      )}

      {/* ── Bottom controls bar ───────────────────────────────────────────── */}
      {!loading && (
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'rgba(10,8,6,0.78)',
          border: '1px solid rgba(201,169,110,0.16)',
          borderRadius: 40, padding: '6px 10px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
          animation: 'psv-fadeIn 0.4s ease forwards',
        }}>
          <CtrlBtn onClick={() => zoomBy(-18)} title="Zoom out">
            <IconZoomOut />
          </CtrlBtn>
          <Divider />
          <CtrlBtn onClick={() => zoomBy(18)} title="Zoom in">
            <IconZoomIn />
          </CtrlBtn>
          {gyroAvail && (
            <>
              <Divider />
              <CtrlBtn onClick={toggleGyro} title="Toggle gyroscope" active={gyroOn}>
                <IconGyro active={gyroOn} />
              </CtrlBtn>
            </>
          )}
          <Divider />
          <CtrlBtn onClick={toggleFullscreen} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {fullscreen ? <IconCompress /> : <IconExpand />}
          </CtrlBtn>
        </div>
      )}

      {/* ── Keyframes + PSV overrides ─────────────────────────────────────── */}
      <style>{`
        @keyframes psv-pulse {
          0%, 100% { opacity: 0.22; transform: scale(1); }
          50%       { opacity: 0.88; transform: scale(1.38); }
        }
        @keyframes psv-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes psv-hintIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes psv-hintOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        /* PSV internal overrides */
        .psv-container { background: #0A0806 !important; }
        .psv-loader    { display: none !important; }
        .psv-navbar    { display: none !important; }
        .psv-canvas-container {
          position: absolute !important;
          top: 0 !important; left: 0 !important;
          width: 100% !important; height: 100% !important;
        }
      `}</style>
    </div>
  );
}
