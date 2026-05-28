'use client';

import '@photo-sphere-viewer/core/index.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';

const GOLD = '#C9A96E';
const BG   = '#0A0806';

interface Props {
  src:       string;
  title?:    string;
  subtitle?: string;
  backHref?: string;
  onBack?:   () => void;
  onError?:  () => void;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="13" y1="8" x2="3" y2="8" />
      <polyline points="6,5 3,8 6,11" />
    </svg>
  );
}

function IconExpand() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <polyline points="10.5,2 16,2 16,7.5" />
      <polyline points="7.5,16 2,16 2,10.5" />
      <line x1="16" y1="2" x2="10" y2="8" />
      <line x1="2" y1="16" x2="8" y2="10" />
    </svg>
  );
}

function IconCompress() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <polyline points="16,6.5 10.5,6.5 10.5,1" />
      <polyline points="2,11.5 7.5,11.5 7.5,17" />
      <line x1="10.5" y1="6.5" x2="16.5" y2="0.5" />
      <line x1="7.5" y1="11.5" x2="1.5" y2="17.5" />
    </svg>
  );
}

function IconGyro({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="6" y="2" width="8" height="16" rx="2.5" />
      <circle cx="10" cy="15" r="1.4" fill={active ? GOLD : 'currentColor'} stroke="none" />
      {active && <circle cx="10" cy="9.5" r="2.8" strokeDasharray="2.5 1.8" strokeWidth="1.1" />}
    </svg>
  );
}

function IconZoomIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="5.5" />
      <line x1="8" y1="5.5" x2="8" y2="10.5" />
      <line x1="5.5" y1="8" x2="10.5" y2="8" />
      <line x1="12" y1="12" x2="16.5" y2="16.5" />
    </svg>
  );
}

function IconZoomOut() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="5.5" />
      <line x1="5.5" y1="8" x2="10.5" y2="8" />
      <line x1="12" y1="12" x2="16.5" y2="16.5" />
    </svg>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ width: 1, height: 22, background: 'rgba(201,169,110,0.2)', margin: '0 2px', flexShrink: 0 }} />
  );
}

function CtrlBtn({ onClick, title, active = false, children }: {
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
        // 48px minimum for WCAG touch targets
        width: 48, height: 48, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(201,169,110,0.18)' : hover ? 'rgba(201,169,110,0.1)' : 'transparent',
        border: 'none', borderRadius: 32,
        color: active || hover ? GOLD : 'rgba(245,239,228,0.72)',
        cursor: 'pointer', outline: 'none',
        transition: 'all 0.18s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function VRViewer({ src, title, subtitle, backHref = '/vr', onBack, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef    = useRef<any>(null);
  const gyroRef      = useRef<any>(null);

  const [loading,    setLoading]    = useState(true);
  const [progress,   setProgress]   = useState(0);
  const [fading,     setFading]     = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [gyroOn,     setGyroOn]     = useState(false);
  const [gyroAvail,  setGyroAvail]  = useState(false);
  const [hint,       setHint]       = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);

  // ── Detect touch device ─────────────────────────────────────────────────────
  useEffect(() => {
    const touch = window.matchMedia('(pointer: coarse)').matches;
    setIsMobile(touch);
    if (touch) setGyroAvail(true);
  }, []);

  // ── Init PSV ────────────────────────────────────────────────────────────────
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
          container:           containerRef.current!,
          panorama:            src,
          navbar:              false,
          defaultZoomLvl:      50,
          minFov:              30,
          maxFov:              90,
          moveSpeed:           1.2,
          zoomSpeed:           1,
          moveInertia:         true,
          mousewheelCtrlKey:   false,
          touchmoveTwoFingers: false,
          plugins: [[GyroscopePlugin, { touchmove: true, absolutePosition: false }]],
        });

        viewerRef.current = viewer;
        gyroRef.current   = viewer.getPlugin(GyroscopePlugin);

        viewer.addEventListener('ready', () => {
          setFading(true);
          setProgress(100);
          setTimeout(() => {
            setLoading(false);
            setHint(true);
            setTimeout(() => setHint(false), 3600);
          }, 560);
        });

        viewer.addEventListener('error', () => {
          onError?.();
        });
      } catch (err) {
        console.error('[VRViewer]', err);
        onError?.();
      }
    })();

    return () => { viewer?.destroy(); viewerRef.current = null; };
  }, [src]);

  // ── Simulated loading progress ───────────────────────────────────────────────
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

  // ── Fullscreen sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

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
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === 'function') {
      try { if (await DOE.requestPermission() !== 'granted') return; }
      catch { return; }
    }
    try { await g.start(); setGyroOn(true); } catch { /* unavailable */ }
  }, [gyroOn]);

  const zoomBy = useCallback((delta: number) => {
    const v = viewerRef.current;
    if (!v) return;
    try { v.zoom(v.getZoomLevel() + delta); } catch { /* ignore */ }
  }, []);

  // ── SVG ring ─────────────────────────────────────────────────────────────────
  const R      = 52;
  const CIRC   = 2 * Math.PI * R;
  const offset = CIRC * (1 - Math.min(progress, 100) / 100);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        background: BG,
        overflow: 'hidden',
        fontFamily: 'var(--font-jost, system-ui, sans-serif)',
        // Prevent rubber-band scroll on iOS
        overscrollBehavior: 'none',
        touchAction: 'none',
      }}
    >
      {/* ── PSV Canvas ──────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute', inset: 0,
          touchAction: 'none',
        }}
      />

      {/* ── Loading overlay ─────────────────────────────────────────────────── */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: BG,
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.56s cubic-bezier(0.25,0.46,0.45,0.94)',
          pointerEvents: fading ? 'none' : 'auto',
        }}>
          {/* IDF logo in loader */}
          <div style={{ marginBottom: 40 }}>
            <Image
              src="/logo3.svg"
              alt="Innovation Designer Furniture"
              width={48}
              height={72}
              priority
              style={{ height: 56, width: 'auto', opacity: 0.85 }}
            />
          </div>

          {/* Ambient glow */}
          <div style={{
            position: 'absolute',
            width: 480, height: 480,
            background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 65%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          {/* Progress ring */}
          <div style={{ position: 'relative', width: 136, height: 136, marginBottom: 36 }}>
            <svg width="136" height="136" viewBox="0 0 136 136"
              style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              <circle cx="68" cy="68" r={R + 9} fill="none" stroke="rgba(201,169,110,0.04)" strokeWidth="14" />
              <circle cx="68" cy="68" r={R} fill="none" stroke="rgba(201,169,110,0.1)" strokeWidth="1" />
              <circle cx="68" cy="68" r={R} fill="none"
                stroke={GOLD} strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.22s ease-out' }}
              />
              <circle cx="68" cy="68" r={R - 16} fill="none" stroke="rgba(201,169,110,0.07)" strokeWidth="0.5" />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
              <span style={{
                fontFamily: 'var(--font-cormorant, Georgia, serif)',
                fontSize: '1.05rem', color: GOLD,
                letterSpacing: '0.14em', fontWeight: 600,
              }}>IDF</span>
              <span style={{
                fontSize: '0.58rem',
                color: 'rgba(201,169,110,0.55)',
                letterSpacing: '0.1em',
              }}>{Math.round(Math.min(progress, 100))}%</span>
            </div>
          </div>

          <p style={{
            fontFamily: 'var(--font-cormorant, Georgia, serif)',
            fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
            fontWeight: 400,
            color: 'rgba(245,239,228,0.88)',
            letterSpacing: '0.04em', marginBottom: 7, textAlign: 'center',
            padding: '0 24px',
          }}>
            Initializing 360° Experience
          </p>
          <p style={{
            fontSize: '0.65rem',
            color: 'rgba(139,125,110,0.65)',
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>
            Preparing Immersive View
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 36 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 4, height: 4, borderRadius: '50%', background: GOLD,
                animation: `vr-pulse 1.5s ease-in-out ${i * 0.22}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      {!loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          padding: 'env(safe-area-inset-top, 0px) 0 0',
          background: 'linear-gradient(to bottom, rgba(10,8,6,0.75) 0%, transparent 100%)',
          animation: 'vr-fadeIn 0.4s ease forwards',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
          }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Image
                src="/logo3.svg"
                alt="Innovation Designer Furniture"
                width={36}
                height={54}
                style={{ height: 42, width: 'auto', opacity: 0.9 }}
              />
            </Link>

            {/* Title + 360° badge */}
            <div style={{ textAlign: 'center', flex: 1, padding: '0 12px', minWidth: 0 }}>
              {title && (
                <p style={{
                  fontFamily: 'var(--font-cormorant, Georgia, serif)',
                  fontSize: 'clamp(0.9rem, 3vw, 1.15rem)',
                  fontWeight: 500,
                  color: 'rgba(245,239,228,0.92)',
                  letterSpacing: '0.03em',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  marginBottom: 2,
                }}>{title}</p>
              )}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(201,169,110,0.1)',
                border: '1px solid rgba(201,169,110,0.22)',
                borderRadius: 24, padding: '3px 10px',
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke={GOLD} strokeWidth="0.8" opacity="0.8" />
                  <ellipse cx="5" cy="5" rx="2.2" ry="4" stroke={GOLD} strokeWidth="0.8" opacity="0.8" />
                  <line x1="1" y1="5" x2="9" y2="5" stroke={GOLD} strokeWidth="0.8" opacity="0.8" />
                </svg>
                <span style={{ fontSize: '0.55rem', color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  360° View
                </span>
              </div>
            </div>

            {/* Back button / link */}
            {onBack ? (
              <button
                onClick={onBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  padding: '8px 14px',
                  background: 'rgba(10,8,6,0.5)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  borderRadius: 24,
                  color: 'rgba(245,239,228,0.8)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer', outline: 'none',
                  backdropFilter: 'blur(8px)',
                  WebkitTapHighlightColor: 'transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                <IconArrowLeft />
                <span>New</span>
              </button>
            ) : (
              <Link
                href={backHref}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  padding: '8px 14px',
                  background: 'rgba(10,8,6,0.5)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  borderRadius: 24,
                  color: 'rgba(245,239,228,0.8)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                  WebkitTapHighlightColor: 'transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                <IconArrowLeft />
                <span style={{ display: isMobile ? 'none' : 'inline' }}>Showroom</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ── Drag hint ───────────────────────────────────────────────────────── */}
      {hint && (
        <div style={{
          position: 'absolute',
          bottom: `calc(88px + env(safe-area-inset-bottom, 0px))`,
          left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'rgba(10,8,6,0.65)',
          border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: 24, padding: '8px 20px',
          backdropFilter: 'blur(12px)',
          animation: 'vr-hintIn 0.5s ease forwards, vr-hintOut 0.5s 3.1s ease forwards',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
            stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
            <line x1="10" y1="3" x2="10" y2="7.5" />
            <polyline points="7.5,5.5 10,3 12.5,5.5" />
            <line x1="10" y1="17" x2="10" y2="12.5" />
            <polyline points="7.5,14.5 10,17 12.5,14.5" />
            <line x1="3" y1="10" x2="7.5" y2="10" />
            <polyline points="5.5,7.5 3,10 5.5,12.5" />
            <line x1="17" y1="10" x2="12.5" y2="10" />
            <polyline points="14.5,7.5 17,10 14.5,12.5" />
          </svg>
          <span style={{
            fontSize: '0.68rem',
            color: 'rgba(245,239,228,0.75)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>
            {isMobile ? 'Tilt or drag to explore' : 'Drag to explore'}
          </span>
        </div>
      )}

      {/* ── Bottom controls ──────────────────────────────────────────────────── */}
      {!loading && (
        <div style={{
          position: 'absolute',
          bottom: `calc(24px + env(safe-area-inset-bottom, 0px))`,
          left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'rgba(10,8,6,0.78)',
          border: '1px solid rgba(201,169,110,0.16)',
          borderRadius: 48, padding: '6px 12px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          animation: 'vr-fadeIn 0.4s ease forwards',
        }}>
          <CtrlBtn onClick={() => zoomBy(-18)} title="Zoom out"><IconZoomOut /></CtrlBtn>
          <Divider />
          <CtrlBtn onClick={() => zoomBy(18)} title="Zoom in"><IconZoomIn /></CtrlBtn>
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

      {/* Keyframes + PSV overrides */}
      <style>{`
        @keyframes vr-pulse {
          0%, 100% { opacity: 0.22; transform: scale(1); }
          50%       { opacity: 0.88; transform: scale(1.38); }
        }
        @keyframes vr-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes vr-hintIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes vr-hintOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
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
