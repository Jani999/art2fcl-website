"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
export function useCinematics(low: boolean, performanceLow: boolean) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const lenis =
      !reduced.matches && !performanceLow
        ? new Lenis({ duration: 1.05, anchors: true })
        : null;
    const tick = (time: number) => lenis?.raf(time * 1000);
    lenis?.on("scroll", ScrollTrigger.update);
    if (lenis) gsap.ticker.add(tick);
    const ctx = gsap.context(() => {
      gsap.to(".reading-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      if (low || reduced.matches) return;
      gsap.to(".hero-statue", {
        yPercent: 12,
        scale: 1.12,
        rotation: -2,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(".hero-title", {
        xPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.fromTo(
        ".anatomy-image",
        { rotationY: -7, scale: 1 },
        {
          rotationY: 7,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".anatomy",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".breach",
          start: "top top",
          end: "+=110%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
      tl.to(".breach-title", { scale: 1.16, xPercent: -3, duration: 1 })
        .to(".tear", { scaleX: 1, stagger: 0.1, duration: 0.3 }, 0)
        .to(".breach-title", {
          skewX: 8,
          letterSpacing: ".025em",
          duration: 0.3,
        })
        .to(".breach-title", { skewX: 0, opacity: 0.25, duration: 0.6 })
        .to(".breach-reveal", { opacity: 1, y: 0, duration: 0.6 }, 1.2);
      gsap.utils
        .toArray<HTMLElement>(".archive-row")
        .forEach((el) =>
          gsap.from(el, {
            x: 50,
            opacity: 0.2,
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 65%",
              scrub: 1,
            },
          }),
        );
      gsap.to(".final-image", {
        yPercent: 14,
        scale: 1.12,
        scrollTrigger: {
          trigger: ".transmission",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts.ready.then(refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [low, performanceLow]);
}
