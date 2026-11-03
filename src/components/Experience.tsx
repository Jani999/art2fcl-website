"use client";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { archives, scenes, type Dossier } from "@/lib/content";
import { useCinematics, navigateScene } from "@/hooks/useCinematics";
import Modal from "./Modal";
import BootSequence from "./BootSequence";
import NowPlaying from "./NowPlaying";
import CinematicScenes from "./scenes/CinematicScenes";
import { cinema } from "@/lib/cinema";
import CustomCursor from "./CustomCursor";
export default function Experience() {
  const [boot, setBoot] = useState(false),
    [menu, setMenu] = useState(false),
    [dossier, setDossier] = useState<Dossier | null>(null),
    [low, setLow] = useState(false),
    [performanceLow, setPerformanceLow] = useState(false),
    [terminal, setTerminal] = useState(true),
    [clock, setClock] = useState("--:--:--"),
    [breached, setBreached] = useState(false),
    [scan, setScan] = useState(false);
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
  useEffect(() => {
    if (!scan) return;
    const timer = setTimeout(() => setScan(false), 2200);
    return () => clearTimeout(timer);
  }, [scan]);
  useCinematics(low, performanceLow);
  function go(id: string) {
    setMenu(false);
    setTimeout(() => navigateScene(id, low), 0);
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
    if (cmd === "corrupt") {
      cinema.corruption = 0.65;
      setBreached(true);
    }
    if (cmd === "restore") {
      cinema.corruption = 0;
      setBreached(false);
      setScan(false);
    }
    if (cmd === "scan") {
      setScan(true);
    }
  }
  function restart() {
    navigateScene("awakening", true);
    setBoot(!low);
    if (low) localStorage.setItem("art2fcl-visited", "1");
  }
  return (
    <div
      className={`cinematic-v2 ${low ? "low-fx" : ""} ${performanceLow ? "performance-low" : ""} ${breached ? "easter-breach" : ""} ${scan ? "system-scan" : ""}`}
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
      <CinematicScenes
        low={low}
        performanceLow={performanceLow}
        terminal={terminal}
        setTerminal={setTerminal}
        open={setDossier}
        go={go}
        restart={restart}
        action={action}
      />
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
