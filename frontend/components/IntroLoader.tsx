"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Phase = "in" | "hold" | "exit" | "gone";

export default function IntroLoader() {
  const [phase, setPhase] = useState<Phase>("in");

  useEffect(() => {
    // Lock page scroll while intro is showing
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setPhase("hold"), 1200);  // logo fully in
    const t2 = setTimeout(() => setPhase("exit"), 2100);  // curtain starts lifting
    const t3 = setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = "";
    }, 3000); // curtain gone, unlock scroll

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 9999,
        background: "#110E0B",
        willChange: "transform",
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition:
          phase === "exit"
            ? "transform 1s cubic-bezier(0.76, 0, 0.24, 1)"
            : "none",
      }}
    >
      {/* Subtle atmospheric glow behind logo */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
          animation: "introGlow 2s ease forwards",
          opacity: 0,
        }}
      />

      {/* "I" Logo */}
      <div
        style={{
          opacity: 0,
          animation:
            "introLogoIn 1s 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Image
          src="/logo3.svg"
          alt="Innovation Designer Furniture"
          width={68}
          height={102}
          priority
          style={{
            filter: "drop-shadow(0 0 28px rgba(201,169,110,0.45))",
          }}
        />
      </div>

      {/* Gold rule — grows outward */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #C9A96E, transparent)",
          marginTop: "1.4rem",
          width: 0,
          opacity: 0,
          animation: "introLineGrow 0.7s 0.9s ease forwards",
        }}
      />

      {/* Brand name */}
      <p
        style={{
          opacity: 0,
          animation: "introFadeIn 0.7s 1.1s ease forwards",
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: "0.58rem",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: "rgba(201,169,110,0.55)",
          marginTop: "1rem",
        }}
      >
        Innovation Designer Furniture
      </p>
    </div>
  );
}
