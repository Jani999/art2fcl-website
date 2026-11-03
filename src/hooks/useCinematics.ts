"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { cinema, cinemaClock } from "@/lib/cinema";
export function navigateScene(id: string, instant = false) {
  const trigger = ScrollTrigger.getById(`scene-${id}`);
  const element = document.getElementById(id);
  const top = trigger
    ? Math.max(0, trigger.start + 1)
    : Math.max(
        0,
        (element?.getBoundingClientRect().top || 0) +
          scrollY -
          (document.querySelector("header")?.clientHeight || 64),
      );
  window.scrollTo({
    top,
    behavior:
      instant || matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
  });
}
export function useCinematics(low: boolean, performanceLow: boolean) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.querySelector<HTMLElement>(".cinematic-v2");
    const lenis =
      !reduced && !performanceLow
        ? new Lenis({
            duration: 0.9,
            anchors: false,
            prevent: (node) =>
              node.tagName === "DIALOG" ||
              node.hasAttribute("data-lenis-prevent"),
          })
        : null;
    let targetVelocity = 0,
      disposed = false;
    const ticker = (time: number) => {
      lenis?.raf(time * 1000);
      cinema.velocity += (targetVelocity - cinema.velocity) * 0.12;
      targetVelocity *= 0.88;
      if (Math.abs(cinema.velocity) < 0.001) cinema.velocity = 0;
      cinemaClock.tick(time);
    };
    lenis?.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(ticker);
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.to(".reading-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          refreshPriority: -100,
          scrub: true,
        },
      });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          targetVelocity = gsap.utils.clamp(-1, 1, self.getVelocity() / 2800);
        },
      });
      if (low || reduced) {
        root?.classList.remove("motion-ready");
        return;
      }
      root?.classList.add("motion-ready");
      mm.add(
        {
          desktop: "(min-width: 901px) and (min-height: 700px)",
          mobile: "(max-width: 900px), (max-height: 699px)",
        },
        (context) => {
          const desktop = !!context.conditions?.desktop;
          const sections = gsap.utils.toArray<HTMLElement>(".cinema-section");
          const lengths = [1.8, 1.15, 1.45, 1.35, 0.55, 1.1];
          sections.forEach((section, index) => {
            const stage = section.querySelector<HTMLElement>(".scene-stage")!;
            const pinned =
              desktop || ([0, 2, 5].includes(index) && innerHeight >= 700);
            const motion = { p: 0 };
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                id: `scene-${section.id}`,
                trigger: section,
                start: () =>
                  `top top+=${document.querySelector("header")?.clientHeight || 64}`,
                end: pinned
                  ? () =>
                      `+=${Math.round(innerHeight * lengths[index] * (desktop ? 1 : 0.65))}`
                  : "bottom top+=180",
                pin: pinned ? stage : false,
                pinSpacing: true,
                scrub: 0.55,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });
            tl.to(
              motion,
              {
                p: 1,
                duration: 1,
                onUpdate: () => {
                  cinema.progress[index] = motion.p;
                  stage.style.setProperty("--scene-progress", String(motion.p));
                },
              },
              0,
            );
            const q = (selector: string) => stage.querySelectorAll(selector);
            if (index === 0) {
              tl.fromTo(
                q(".art-fragments"),
                { clipPath: "inset(12% 0 85% 0)" },
                { clipPath: "inset(0% 0 0% 0)", duration: 0.22 },
                0,
              )
                .fromTo(
                  q(".art-fragment"),
                  { xPercent: (i) => (i % 2 ? 22 : -22) },
                  { xPercent: 0, stagger: 0.025, duration: 0.17 },
                  0.2,
                )
                .fromTo(
                  q(".scanner-beam"),
                  { top: "15%" },
                  { top: "86%", duration: 0.4 },
                  0,
                )
                .fromTo(
                  q(".hero-back-type"),
                  { xPercent: 8 },
                  { xPercent: -8, duration: 0.2 },
                  0.4,
                )
                .fromTo(
                  q(".awakening-copy h1"),
                  { xPercent: -7, clipPath: "inset(0 100% 0 0)" },
                  { xPercent: 0, clipPath: "inset(0 0% 0 0)", duration: 0.22 },
                  0.38,
                )
                .fromTo(
                  q(".scan-grid"),
                  { clipPath: "inset(0 100% 0 0)" },
                  { clipPath: "inset(0 0% 0 0)", duration: 0.2 },
                  0.6,
                )
                .to(
                  q(".awakening-art"),
                  {
                    xPercent: desktop ? -5 : -2,
                    yPercent: 2,
                    rotation: desktop ? -2 : 0,
                    duration: 0.2,
                  },
                  0.6,
                )
                .to(q(".scanner-layer"), { opacity: 0.25, duration: 0.2 }, 0.8);
            }
            if (index === 1) {
              tl.to(
                q(".plane-cranial"),
                {
                  x: desktop ? -22 : -9,
                  y: -22,
                  z: 75,
                  rotationZ: -2,
                  duration: 0.35,
                },
                0.12,
              )
                .to(
                  q(".plane-mechanism"),
                  {
                    x: desktop ? 35 : 12,
                    z: 35,
                    rotationY: desktop ? -5 : 0,
                    duration: 0.35,
                  },
                  0.12,
                )
                .to(
                  q(".plane-foundation"),
                  {
                    y: 24,
                    x: desktop ? -15 : -5,
                    z: -20,
                    rotationZ: 1.5,
                    duration: 0.35,
                  },
                  0.12,
                )
                .fromTo(
                  q(".measurement"),
                  { clipPath: "inset(0 0 100% 0)" },
                  { clipPath: "inset(0 0 0% 0)", duration: 0.32 },
                  0.2,
                )
                .fromTo(
                  q(".anatomy-ring"),
                  { top: "18%", rotation: 0 },
                  { top: "65%", rotation: 150, duration: 0.6 },
                  0.15,
                )
                .to(
                  q(".anatomy-heading h2"),
                  { x: desktop ? -22 : 0, duration: 0.4 },
                  0.15,
                )
                .to(
                  q(".anatomy-plane"),
                  {
                    x: 0,
                    y: 0,
                    z: 0,
                    rotationZ: 0,
                    rotationY: 0,
                    duration: 0.25,
                  },
                  0.72,
                );
            }
            if (index === 2) {
              tl.to(
                q(".breach-word"),
                { xPercent: -15, skewX: 8, duration: 0.4 },
                0.1,
              )
                .to(
                  q(".breach-number"),
                  { xPercent: 15, letterSpacing: ".08em", duration: 0.4 },
                  0.1,
                )
                .fromTo(
                  q(".breach-seam"),
                  { scaleX: 0 },
                  { scaleX: 1, duration: 0.3 },
                  0.25,
                )
                .to(
                  q(".breach-type"),
                  { clipPath: "inset(0 0 100% 0)", duration: 0.3 },
                  0.5,
                )
                .fromTo(
                  q(".breach-message"),
                  { clipPath: "inset(100% 0 0 0)", y: 24 },
                  { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.3 },
                  0.65,
                );
            }
            if (index === 3 && desktop) {
              tl.fromTo(
                q(".archive-panel"),
                {
                  z: (i) => -150 - i * 100,
                  rotationY: (i) => (i % 2 ? -24 : 24),
                  y: (i) => (i % 2 ? 40 : -20),
                },
                { z: 0, rotationY: 0, y: 0, stagger: 0.09, duration: 0.4 },
                0.1,
              )
                .fromTo(
                  q(".tunnel-lines"),
                  { rotationZ: -5, scale: 0.75 },
                  { rotationZ: 3, scale: 1.1, duration: 1 },
                  0,
                )
                .to(q(".archive-heading"), { xPercent: -4, duration: 1 }, 0);
            } else if (index === 3) {
              tl.fromTo(
                q(".archive-panel"),
                { rotationX: 8, x: (i) => (i % 2 ? 12 : -12) },
                { rotationX: 0, x: 0, stagger: 0.07, duration: 0.5 },
                0.05,
              );
            }
            if (index === 4) {
              tl.fromTo(
                q(".terminal-box"),
                { clipPath: desktop ? "inset(0 0 75% 0)" : "inset(0 0 0% 0)" },
                { clipPath: "inset(0 0 0% 0)", duration: 0.24 },
                0,
              )
                .fromTo(
                  q(".terminal-scanline"),
                  { top: "10%" },
                  { top: "90%", duration: 1 },
                  0,
                )
                .fromTo(
                  q(".terminal-environment>span"),
                  { rotation: 0 },
                  { rotation: 25, duration: 1 },
                  0,
                );
            }
            if (index === 5) {
              tl.fromTo(
                q(".art-fragment"),
                {
                  xPercent: (i) => (i % 2 ? 20 : -20),
                  yPercent: (i) => (i - 2.5) * 2,
                  rotationZ: (i) => (i % 2 ? 3 : -3),
                },
                {
                  xPercent: 0,
                  yPercent: 0,
                  rotationZ: 0,
                  stagger: 0.065,
                  duration: 0.35,
                },
                0.08,
              ).fromTo(
                q(".type-mask>span"),
                { yPercent: 110, xPercent: (i) => (i % 2 ? 5 : -5) },
                { yPercent: 0, xPercent: 0, stagger: 0.08, duration: 0.25 },
                0.35,
              );
            }
          });
          return () => {
            cinema.progress.fill(0);
          };
        },
      );
    }, root || undefined);
    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      disposed = true;
      window.removeEventListener("load", refresh);
      mm.revert();
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis?.destroy();
      root?.classList.remove("motion-ready");
      cinema.velocity = 0;
    };
  }, [low, performanceLow]);
}
