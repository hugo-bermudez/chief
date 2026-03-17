"use client";

import { useMemo } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+×÷=≈≠∑∆π∫$€£¥%#@&";

export function MatrixBackground() {
  const cells = useMemo(() => {
    const items = [];
    for (let i = 0; i < 80; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      items.push({
        char,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 12}s`,
        duration: `${8 + Math.random() * 8}s`,
      });
    }
    return items;
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {cells.map((cell, i) => (
        <span
          key={i}
          className="matrix-char"
          style={{
            left: cell.left,
            top: cell.top,
            animationDelay: cell.delay,
            animationDuration: cell.duration,
          }}
        >
          {cell.char}
        </span>
      ))}
    </div>
  );
}
