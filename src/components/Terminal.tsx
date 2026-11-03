"use client";
import { useRef, useState } from "react";
export default function Terminal({
  action,
}: {
  action: (command: string) => void;
}) {
  const [output, setOutput] = useState([
      "ART2FCL OS [fictional interface v.01]",
      "Connection local. No commands leave this browser.",
      "Type “help” to see available commands.",
    ]),
    [input, setInput] = useState(""),
    [history, setHistory] = useState<string[]>([]),
    [index, setIndex] = useState(0);
  const field = useRef<HTMLInputElement>(null);
  function run(command: string) {
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;
    setHistory((v) => [...v, cmd]);
    setIndex(history.length + 1);
    setInput("");
    if (cmd === "clear") {
      setOutput([]);
      return;
    }
    const responses: Record<string, string> = {
      help: "help · about · entity · archive · status · music · contact · clear · exit · breach",
      about:
        "ART2FCL // SYSTEM BREACH. An experimental digital artwork about the machinery beneath justice.",
      status:
        "FICTIONAL DIAGNOSTICS: shell intact / neutrality unverified / humanity detected.",
      entity: "Opening entity dossier…",
      archive: "Accessing archive…",
      music: "Audio controls focused. Press play to enable sound.",
      contact: "Opening creator connection…",
      exit: "Session suspended.",
      breach: "ACCESS DENIED // REALITY UNLOCKED",
    };
    setOutput((v) =>
      [
        ...v,
        `root@art2fcl:~$ ${cmd}`,
        responses[cmd] || `Command not found: ${cmd}. Try help.`,
      ].slice(-60),
    );
    if (responses[cmd]) action(cmd);
  }
  return (
    <div className="terminal-box">
      <div className="terminal-title">
        <span>
          <i /> LOCAL SESSION
        </span>
        <span>NO SERVER CONNECTION</span>
      </div>
      <div
        className="terminal-output"
        role="log"
        aria-live="polite"
        data-lenis-prevent
      >
        {output.map((v, i) => (
          <p key={i}>{v}</p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
      >
        <label htmlFor="command">root@art2fcl:~$</label>
        <input
          ref={field}
          id="command"
          autoComplete="off"
          spellCheck={false}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Terminal command"
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const n = Math.max(0, index - 1);
              setIndex(n);
              setInput(history[n] || "");
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              const n = Math.min(history.length, index + 1);
              setIndex(n);
              setInput(history[n] || "");
            }
          }}
        />
        <button type="submit" aria-label="Run command">
          ↵
        </button>
      </form>
      <div className="command-hints">
        {["help", "entity", "status", "breach", "clear"].map((v) => (
          <button
            key={v}
            onClick={() => {
              setInput(v);
              field.current?.focus();
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
