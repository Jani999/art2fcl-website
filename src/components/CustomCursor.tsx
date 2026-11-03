"use client";
import { useEffect, useRef } from "react";
export default function CustomCursor({ disabled }: { disabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (disabled || !matchMedia("(pointer:fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      el.style.opacity = "1";
    };
    const hide = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
    };
  }, [disabled]);
  return disabled ? null : (
    <div ref={ref} className="crosshair" aria-hidden="true" />
  );
}
