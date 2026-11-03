"use client";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowUpRight, Menu, Plus } from "lucide-react";
import { archives, hotspots, scenes, type Dossier } from "@/lib/content";
import { useCinematics } from "@/hooks/useCinematics";
import Modal from "./Modal";
import BootSequence from "./BootSequence";
import NowPlaying from "./NowPlaying";
import Terminal from "./Terminal";
import CustomCursor from "./CustomCursor";
const GoddessModel3D = dynamic(() => import("./GoddessModel3D"), {
  ssr: false,
});
export default function Experience() {
  const [boot, setBoot] = useState(false),
    [menu, setMenu] = useState(false),
    [dossier, setDossier] = useState<Dossier | null>(null),
    [low, setLow] = useState(false),
    [performanceLow, setPerformanceLow] = useState(false),
    [terminal, setTerminal] = useState(true),
    [clock, setClock] = useState("--:--:--"),
    [breached, setBreached] = useState(false),
    [model, setModel] = useState(false);
  const finishBoot = useCallback(() => {
    setBoot(false);
    localStorage.setItem("art2fcl-visited", "1");
  }, []);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () =>
      setLow(reduced.matches || localStorage.getItem("art2fcl-fx") === "low");
    const initialFrame = requestAnimationFrame(() => {
      sync();
      setPerformanceLow(localStorage.getItem("art2fcl-performance") === "low");
      setBoot(!localStorage.getItem("art2fcl-visited") && !reduced.matches);
    });
    reduced.addEventListener("change", sync);
    const t = setInterval(
      () => setClock(new Date().toLocaleTimeString("en-GB")),
      1000,
    );
    return () => {
      cancelAnimationFrame(initialFrame);
      clearInterval(t);
      reduced.removeEventListener("change", sync);
    };
  }, []);
  useEffect(() => {
    if (!breached) return;
    const t = setTimeout(() => setBreached(false), 700);
    return () => clearTimeout(t);
  }, [breached]);
  useCinematics(low, performanceLow);
  function go(id: string) {
    setMenu(false);
    setTimeout(
      () =>
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: low ? "instant" : "smooth" }),
      0,
    );
  }
  function action(cmd: string) {
    if (cmd === "entity") setDossier(archives[0]);
    if (cmd === "archive") go("archive");
    if (cmd === "music") {
      document.getElementById("player")?.querySelector("button")?.focus();
    }
    if (cmd === "contact")
      setDossier({
        title: "CONNECTION",
        tag: "HUMAN BEHIND THE SIGNAL",
        text: "ART2FCL is an experimental digital experience by Jani999. Explore the source and other work through the GitHub link below.",
      });
    if (cmd === "exit") setTerminal(false);
    if (cmd === "breach") setBreached(true);
  }
  function restart() {
    window.scrollTo({ top: 0, behavior: "instant" });
    setBoot(!low);
    if (low) localStorage.setItem("art2fcl-visited", "1");
  }
  return (
    <div
      className={`${low ? "low-fx" : ""} ${breached ? "easter-breach" : ""}`}
    >
      <a className="skip-link" href="#awakening">
        Skip to experience
      </a>
      <div className="reading-progress" />
      <header>
        <a href="#awakening" className="brand">
          ART2FCL<span className="red">®</span>
        </a>
        <span className="header-caption">
          INDEPENDENT DIGITAL EXPERIMENT
          <br />
          TOKYO FREQUENCY / GLOBAL SIGNAL
        </span>
        <div className="header-right">
          <span className="status">
            <i /> SYSTEM ONLINE
          </span>
          <button className="menu-button" onClick={() => setMenu(true)}>
            INDEX <Menu size={18} />
          </button>
        </div>
      </header>
      <main>
        <section id="awakening" className="hero">
          <div className="hero-top mono">
            <span>01 — AWAKENING</span>
            <span>美しいエラー / BEAUTIFUL ERROR</span>
          </div>
          <div className="hero-visual">
            <img
              className="hero-statue"
              src="/assets/goddess.png"
              alt="Cybernetic Lady Justice: marble statue with mechanical joints, blindfold, sword and scales"
              fetchPriority="high"
              width="1086"
              height="1448"
            />
            <span className="vertical-glyph" aria-hidden="true">
              正義
            </span>
            <div className="target target-one" aria-hidden="true" />
            <div className="image-caption mono">
              FIG. 001 / SYNTHETIC DIVINITY
              <br />
              MARBLE × MACHINE
              <br />
              <span className="red">[ NEUTRALITY UNVERIFIED ]</span>
            </div>
          </div>
          <div className="hero-title">
            <span className="eyebrow">THE SYSTEM WAS NEVER NEUTRAL.</span>
            <h1>
              JUSTICE<span className="exe">.exe</span>
            </h1>
          </div>
          <div className="hero-bottom">
            <p>
              A monument to order.
              <br />
              An architecture of control.
              <br />
              <strong>A beautiful error.</strong>
            </p>
            <a href="#divinity" className="scroll-cue">
              <span>
                SCROLL TO
                <br />
                BREAK THE SYSTEM
              </span>
              <ArrowDown size={23} />
            </a>
            <span className="hero-coordinate mono">
              35°40′34.8″N
              <br />
              139°42′07.2″E
              <br />
              FICTIONAL SIGNAL ORIGIN
            </span>
          </div>
          <span className="hero-side mono">
            ART2FCL — EXPERIMENTAL DIGITAL EXPERIENCE — VOL. 001
          </span>
        </section>
        <div className="ticker" aria-hidden="true">
          ACCESS DENIED <span>↗</span> REALITY UNLOCKED <span>↗</span> ACCESS
          DENIED <span>↗</span> REALITY UNLOCKED <span>↗</span>
        </div>
        <section id="divinity" className="anatomy section-pad">
          <div className="section-label">
            <span>02 / DIVINITY_CORRUPTED</span>
            <span>ENTITY INSPECTION ↙</span>
          </div>
          <div className="anatomy-grid">
            <div className="anatomy-copy">
              <p className="red mono">THE BODY IS AN INTERFACE.</p>
              <h2>
                NO GODS.
                <br />
                ONLY
                <br />
                <span className="outline">MACHINES.</span>
              </h2>
              <p className="body-copy">
                We gave her a blindfold.
                <br />
                Then taught her who to see.
                <br />
                <br />
                Beneath every perfect surface is a system of imperfect
                decisions. Inspect the anatomy of an impossible ideal.
              </p>
              <span className="mono small">SELECT A MARKER TO DECODE ↗</span>
            </div>
            <div className="anatomy-plate">
              <div className="anatomy-image">
                {model ? (
                  <GoddessModel3D />
                ) : (
                  <img
                    src="/assets/goddess.png"
                    alt="Full anatomy of the cybernetic justice sculpture"
                    width="1086"
                    height="1448"
                    loading="lazy"
                  />
                )}
                {hotspots.map((h, i) => (
                  <button
                    className="hotspot"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    aria-label={`Inspect ${h.title}`}
                    key={h.title}
                    onClick={() => setDossier(h)}
                  >
                    <Plus size={15} />
                    <span>0{i + 1}</span>
                  </button>
                ))}
              </div>
              <span className="plate-label mono">
                J-001 / ANATOMICAL STUDY / 2.5D
              </span>
            </div>
          </div>
          <details className="model-option">
            <summary>OPTIONAL 3D VIEWER</summary>
            <p>
              A future goddess.glb enables a true 3D orbit. The original
              sculpture above is a 2D composition.
            </p>
            <button
              onClick={async () => {
                try {
                  const r = await fetch("/models/goddess.glb", {
                    method: "HEAD",
                  });
                  if (
                    r.ok &&
                    !(r.headers.get("content-type") || "").includes("text/html")
                  )
                    setModel(true);
                  else
                    setDossier({
                      title: "MODEL NOT INSTALLED",
                      tag: "2.5D MODE ACTIVE",
                      text: "No goddess.glb is installed. The original PNG remains the current artwork.",
                    });
                } catch {
                  setDossier({
                    title: "MODEL UNAVAILABLE",
                    tag: "2.5D MODE ACTIVE",
                    text: "The 3D file could not be loaded. The original image remains available.",
                  });
                }
              }}
            >
              CHECK FOR 3D MODEL ↗
            </button>
          </details>
        </section>
        <section id="breach" className="breach">
          <div className="section-label">
            <span>03 / SYSTEM_BREACH</span>
            <span className="red">● SIGNAL COMPROMISED</span>
          </div>
          <div className="packet mono">
            0x0001 / IDEAL_NOT_FOUND
            <br />
            0x0010 / REWRITING_INHERITED_TRUTH
            <br />
            0x0100 / HUMANITY_DETECTED
          </div>
          <div className="breach-title">
            <span className="red mono">FATAL EXCEPTION_</span>
            <h2>
              ERROR<span className="red">_</span>
              <br />
              404
            </h2>
            <p>DIVINITY NOT FOUND</p>
          </div>
          {[20, 48, 72].map((v) => (
            <div className="tear" key={v} style={{ top: `${v}%` }} />
          ))}
          <p className="breach-reveal">
            人間性はバグだ
            <br />
            <strong>HUMANITY IS THE GLITCH.</strong>
          </p>
          <span className="breach-bottom mono">
            KEEP SCROLLING // THE FRACTURE IS AN OPENING
          </span>
        </section>
        <section id="archive" className="archive section-pad">
          <div className="section-label">
            <span>04 / ARCHIVE_DECODE</span>
            <span>4 FILES RECOVERED</span>
          </div>
          <div className="archive-heading">
            <h2>
              NOTHING
              <br />
              STAYS <em>HIDDEN.</em>
            </h2>
            <p className="mono">
              FRAGMENTS OF A BROKEN IDEAL.
              <br />
              OPEN A FILE. READ BETWEEN THE LINES.
            </p>
          </div>
          <div>
            {archives.map((a, i) => (
              <button
                key={a.title}
                className="archive-row"
                onClick={() => setDossier(a)}
              >
                <span className="archive-index">0{i + 1}</span>
                <span className="archive-name">{a.title}</span>
                <span className="archive-tag mono">{a.tag}</span>
                <ArrowUpRight />
              </button>
            ))}
          </div>
          <div className="archive-foot mono">
            <span>CLASSIFICATION: PUBLIC / INTERPRETATION: YOURS</span>
            <span>機密解除済み</span>
          </div>
        </section>
        <section id="terminal" className="terminal-scene section-pad">
          <div className="section-label">
            <span>05 / DIRECT_ACCESS</span>
            <span>LOCAL ONLY / NO TELEMETRY</span>
          </div>
          <div className="terminal-grid">
            <div>
              <p className="red mono">YOU HAVE THE PROMPT.</p>
              <h2>
                QUESTION
                <br />
                THE
                <br />
                <span className="outline">COMMAND.</span>
              </h2>
              <p className="body-copy">
                The interface is listening.
                <br />
                What will you ask of the machine?
              </p>
            </div>
            {terminal ? (
              <Terminal action={action} />
            ) : (
              <button
                className="terminal-reopen"
                onClick={() => setTerminal(true)}
              >
                SESSION CLOSED / REOPEN TERMINAL ↗
              </button>
            )}
          </div>
        </section>
        <section id="transmission" className="transmission">
          <img
            className="final-image"
            src="/assets/goddess.png"
            alt="Justice emerges from the final transmission"
            width="1086"
            height="1448"
            loading="lazy"
          />
          <div className="final-content">
            <span className="mono">06 / FINAL_TRANSMISSION</span>
            <h2>
              THE SYSTEM
              <br />
              WAS NEVER
              <br />
              <span>NEUTRAL.</span>
            </h2>
            <p>Now you know where the cracks are.</p>
            <div className="final-actions">
              <button onClick={restart}>
                RESTART EXPERIENCE <ArrowUpRight size={17} />
              </button>
              <button onClick={() => go("archive")}>EXPLORE ARCHIVE ↗</button>
              <button
                onClick={() => {
                  setTerminal(true);
                  go("terminal");
                }}
              >
                OPEN TERMINAL ↗
              </button>
              <a
                href="https://github.com/Jani999"
                target="_blank"
                rel="noreferrer"
              >
                VIEW GITHUB ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-brand">
          ART2FCL<span className="red">®</span>
        </div>
        <div className="footer-meta mono">
          <span>
            SYSTEM//BREACH
            <br />© 2026 ART2FCL. EXPERIMENTAL DIGITAL ART.
          </span>
          <span>
            LOCAL TIME / {clock}
            <br />
            ALL SYSTEMS QUESTIONABLE.
          </span>
          <a href="https://github.com/Jani999">GITHUB ↗</a>
        </div>
        <div className="settings mono">
          <button
            onClick={() => {
              setLow(!low);
              localStorage.setItem("art2fcl-fx", !low ? "low" : "high");
            }}
          >
            FX INTENSITY: {low ? "LOW" : "HIGH"}
          </button>
          <button
            onClick={() => {
              setPerformanceLow(!performanceLow);
              localStorage.setItem(
                "art2fcl-performance",
                !performanceLow ? "low" : "high",
              );
            }}
          >
            PERFORMANCE: {performanceLow ? "LOW" : "HIGH"}
          </button>
        </div>
      </footer>
      <CustomCursor disabled={low || performanceLow} />
      <NowPlaying low={low || performanceLow} />
      {boot && <BootSequence onDone={finishBoot} />}{" "}
      {menu && (
        <Modal title="SCENE INDEX" onClose={() => setMenu(false)}>
          <nav className="scene-nav">
            {scenes.map((s, i) => (
              <button
                key={s}
                onClick={() =>
                  go(
                    [
                      "awakening",
                      "divinity",
                      "breach",
                      "archive",
                      "terminal",
                      "transmission",
                    ][i],
                  )
                }
              >
                <small>0{i + 1}</small>
                {s}
                <ArrowUpRight />
              </button>
            ))}
          </nav>
          <p className="mono">SYSTEM//BREACH — CHOOSE YOUR POINT OF ENTRY.</p>
        </Modal>
      )}
      {dossier && (
        <Modal title={dossier.title} onClose={() => setDossier(null)}>
          <article className="dossier">
            <p className="red mono">{dossier.tag}</p>
            <h2>{dossier.title}</h2>
            <p>{dossier.text}</p>
            {dossier.title === "CONNECTION" && (
              <a
                href="https://github.com/Jani999"
                target="_blank"
                rel="noreferrer"
              >
                VIEW JANI999 ON GITHUB ↗
              </a>
            )}
            <span className="mono">END OF FILE // FICTIONAL ART ARCHIVE</span>
          </article>
        </Modal>
      )}
    </div>
  );
}
