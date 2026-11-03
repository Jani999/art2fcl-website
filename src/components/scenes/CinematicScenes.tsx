"use client";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import { archives, hotspots, type Dossier } from "@/lib/content";
import { goddessAsset } from "@/lib/cinema";
import FragmentTransition from "../effects/FragmentTransition";
import ScannerReveal from "../effects/ScannerReveal";
import Terminal from "../Terminal";
const ScrollDistortion = dynamic(() => import("../effects/ScrollDistortion"), {
  ssr: false,
});
const GoddessModel3D = dynamic(() => import("../GoddessModel3D"), {
  ssr: false,
});
type Props = {
  low: boolean;
  performanceLow: boolean;
  terminal: boolean;
  setTerminal: (value: boolean) => void;
  open: (d: Dossier) => void;
  go: (id: string) => void;
  restart: () => void;
  action: (cmd: string) => void;
};
const Label = ({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note: string;
}) => (
  <div className="scene-label mono">
    <span>
      {index} / {title}
    </span>
    <span>{note}</span>
  </div>
);
export default function CinematicScenes({
  low,
  performanceLow,
  terminal,
  setTerminal,
  open,
  go,
  restart,
  action,
}: Props) {
  const [model, setModel] = useState(false);
  const pieces = [
    { name: "cranial", clip: "inset(0 0 70% 0)", indexes: [0] },
    { name: "mechanism", clip: "inset(30% 0 39% 0)", indexes: [1, 2, 4] },
    { name: "foundation", clip: "inset(61% 0 0 0)", indexes: [3] },
  ];
  return (
    <main className="cinema-main">
      <section id="awakening" className="cinema-section hero" data-scene="0">
        <div className="scene-stage awakening-stage">
          <Label
            index="01"
            title="SYSTEM_AWAKENING"
            note="RECOVERING ENTITY / J-001"
          />
          <div className="hero-back-type" aria-hidden="true">
            JUSTICE
          </div>
          <FragmentTransition
            className="awakening-art"
            label="Complete Cybernetic Lady Justice: blindfold, raised scales and lowered sword"
            priority
          />
          <ScannerReveal />
          <div className="awakening-copy">
            <span className="red mono">美しいエラー / BEAUTIFUL ERROR</span>
            <h1>
              JUSTICE<span>.exe</span>
            </h1>
            <p>THE SYSTEM WAS NEVER NEUTRAL.</p>
          </div>
          <div className="scene-marginal mono">
            <span>
              AN UNKNOWN BODY.
              <br />A FAMILIAR SYSTEM.
            </span>
            <span className="vertical-jp">正義は誰のものか</span>
          </div>
          <div className="scene-bottom mono">
            <span>
              MARBLE × MACHINE
              <br />
              RESTORATION IN PROGRESS
            </span>
            <a
              href="#divinity"
              onClick={(e) => {
                e.preventDefault();
                go("divinity");
              }}
            >
              SCROLL TO DECRYPT <ArrowDown size={16} />
            </a>
            <span>
              01 — 06
              <br />
              SYSTEM//BREACH
            </span>
          </div>
        </div>
      </section>
      <section id="divinity" className="cinema-section anatomy" data-scene="1">
        <div className="scene-stage anatomy-stage">
          <Label
            index="02"
            title="ANATOMICAL_FRACTURE"
            note="INSPECT / THE BODY IS AN INTERFACE"
          />
          <div className="anatomy-heading">
            <p className="mono red">NEUTRALITY / UNVERIFIED</p>
            <h2>
              NO GODS.
              <br />
              <span>ONLY MACHINES.</span>
            </h2>
            <p>
              We gave her a blindfold.
              <br />
              Then taught her who to see.
            </p>
          </div>
          <div className="anatomy-object">
            {model ? (
              <GoddessModel3D />
            ) : (
              <>
                <img
                  className="anatomy-base"
                  src={goddessAsset}
                  alt="Complete anatomy of the machine goddess"
                  width="1152"
                  height="1664"
                />
                {pieces.map((piece) => (
                  <div
                    className={`anatomy-plane plane-${piece.name}`}
                    key={piece.name}
                  >
                    <img
                      style={{ clipPath: piece.clip }}
                      src={goddessAsset}
                      alt=""
                      width="1152"
                      height="1664"
                    />
                    {piece.indexes.map((i) => {
                      const h = hotspots[i];
                      return (
                        <button
                          className="hotspot"
                          style={{ left: `${h.x}%`, top: `${h.y}%` }}
                          aria-label={`Inspect ${h.title}`}
                          key={h.title}
                          onClick={() => open(h)}
                        >
                          <Plus size={14} />
                          <span>0{i + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </>
            )}
            <div className="measurement measure-left" aria-hidden="true">
              <span>01 / MEMORY</span>
              <i />
              <span>02 / MECHANISM</span>
              <i />
              <span>03 / CONSEQUENCE</span>
            </div>
            <div className="anatomy-ring" aria-hidden="true" />
            <span className="object-caption mono">
              J-001 / THREE IMAGE PLANES / NOT GEOMETRY
            </span>
          </div>
          <div className="anatomy-aside mono">
            <span>[ SELECT A MARKER ]</span>
            <p>
              The fracture is the archive.
              <br />
              Every judgment leaves a trace.
            </p>
            <button onClick={() => open(archives[0])}>
              OPEN ENTITY FILE ↗
            </button>
            <details className="model-option">
              <summary>OPTIONAL 3D VIEWER</summary>
              <p>
                2.5D image composition. A valid goddess.glb enables real orbit.
              </p>
              <button
                onClick={async () => {
                  try {
                    const r = await fetch("/models/goddess.glb", {
                      method: "HEAD",
                    });
                    if (
                      r.ok &&
                      !(r.headers.get("content-type") || "").includes(
                        "text/html",
                      )
                    )
                      setModel(true);
                    else
                      open({
                        title: "MODEL NOT INSTALLED",
                        tag: "2.5D MODE ACTIVE",
                        text: "No goddess.glb is installed. The cleaned original artwork remains available.",
                      });
                  } catch {
                    open({
                      title: "MODEL UNAVAILABLE",
                      tag: "2.5D MODE ACTIVE",
                      text: "The model could not be loaded.",
                    });
                  }
                }}
              >
                CHECK FOR 3D MODEL ↗
              </button>
            </details>
          </div>
        </div>
      </section>
      <section id="breach" className="cinema-section breach" data-scene="2">
        <div className="scene-stage breach-stage">
          <Label
            index="03"
            title="REALITY_BREACH"
            note="● INTEGRITY / COMPROMISED"
          />
          <ScrollDistortion enabled={!low && !performanceLow} />
          <div className="breach-type">
            <span className="mono red">FATAL EXCEPTION_</span>
            <h2>
              <span className="breach-word">ERROR</span>
              <span className="breach-number">404</span>
            </h2>
            <p className="mono">DIVINITY NOT FOUND</p>
          </div>
          <div className="breach-evidence mono">
            <span>0x0001 / IDEAL_NOT_FOUND</span>
            <span>0x0010 / INHERITED_TRUTH</span>
            <span>0x0100 / HUMANITY_DETECTED</span>
          </div>
          <div className="breach-message">
            <p>人間性はバグだ</p>
            <strong>
              HUMANITY
              <br />
              IS THE GLITCH.
            </strong>
          </div>
          <div className="breach-seam" aria-hidden="true" />
          <div className="scene-bottom mono">
            <span>THE ERROR IS NOT THE END.</span>
            <span>IT IS AN OPENING. ↓</span>
          </div>
        </div>
      </section>
      <section id="archive" className="cinema-section archive" data-scene="3">
        <div className="scene-stage archive-stage">
          <Label
            index="04"
            title="ARCHIVE_TUNNEL"
            note="FOUR FRAGMENTS / ONE UNRESOLVED TRUTH"
          />
          <div className="archive-heading">
            <h2>
              NOTHING STAYS
              <br />
              <em>HIDDEN.</em>
            </h2>
            <span className="mono">SELECT A FILE TO DECODE ↗</span>
          </div>
          <div className="tunnel-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span className="tunnel-jp" aria-hidden="true">
            記録 / 記憶 / 断片
          </span>
          <div className="archive-tunnel">
            {archives.map((a, i) => (
              <button
                key={a.title}
                className={`archive-panel archive-row panel-${i}`}
                onClick={() => open(a)}
              >
                <span className="panel-header mono">
                  FILE / 00{i + 1}
                  <ArrowUpRight size={16} />
                </span>
                <span className="panel-image" aria-hidden="true">
                  <img
                    src={goddessAsset}
                    alt=""
                    width="1152"
                    height="1664"
                    style={{ objectPosition: `${20 + i * 20}% ${i * 25}%` }}
                  />
                </span>
                <span className="archive-name">{a.title}</span>
                <span className="archive-tag mono">{a.tag}</span>
                <span className="panel-footer mono">
                  [ OPEN DOSSIER ]<span>0{i + 1} / 04</span>
                </span>
              </button>
            ))}
          </div>
          <div className="scene-bottom mono">
            <span>CLASSIFICATION: PUBLIC</span>
            <span>INTERPRETATION: YOURS</span>
          </div>
        </div>
      </section>
      <section
        id="terminal"
        className="cinema-section terminal-scene"
        data-scene="4"
      >
        <div className="scene-stage terminal-stage">
          <Label
            index="05"
            title="TERMINAL_OVERRIDE"
            note="LOCAL ONLY / NO TELEMETRY"
          />
          <div className="terminal-environment" aria-hidden="true">
            <span>根</span>
            <div className="terminal-scanline" />
          </div>
          <div className="terminal-grid">
            <div className="terminal-heading">
              <span className="mono red">YOU HAVE THE PROMPT.</span>
              <h2>
                QUESTION
                <br />
                THE
                <br />
                <span className="outline">COMMAND.</span>
              </h2>
              <p>
                The interface is listening.
                <br />
                What will you ask of the machine?
              </p>
              <div className="diagnostic-grid mono">
                <span>
                  MEMORY <b>LOCAL</b>
                </span>
                <span>
                  NEUTRALITY <b className="red">UNKNOWN</b>
                </span>
                <span>
                  HUMANITY <b>DETECTED</b>
                </span>
              </div>
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
        </div>
      </section>
      <section
        id="transmission"
        className="cinema-section transmission"
        data-scene="5"
      >
        <div className="scene-stage reconstruction-stage">
          <Label
            index="06"
            title="RECONSTRUCTION"
            note="INTEGRITY ≠ INNOCENCE"
          />
          <FragmentTransition
            className="reconstruction-art"
            label="The complete sculpture reconstructed from six image fragments"
          />
          <div className="reconstruction-copy">
            <h2>
              <span className="type-mask">
                <span>THE SYSTEM</span>
              </span>
              <span className="type-mask">
                <span>WAS NEVER</span>
              </span>
              <span className="type-mask">
                <span className="red">NEUTRAL.</span>
              </span>
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
          <div className="scene-bottom mono">
            <span>END OF TRANSMISSION</span>
            <span>THE QUESTION REMAINS.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
