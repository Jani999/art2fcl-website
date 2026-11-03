"use client";
import { useEffect, useRef, useState } from "react";
const commands = [
  "help",
  "about",
  "entity",
  "archive",
  "status",
  "music",
  "contact",
  "clear",
  "exit",
  "breach",
  "corrupt",
  "restore",
  "scan",
];
export default function Terminal({
  action,
}: {
  action: (command: string) => void;
}) {
  const [output, setOutput] = useState([
      "ART2FCL OS [fictional interface v.02]",
      "Connection local. No commands leave this browser.",
      "Type “help” to see available commands.",
    ]),
    [input, setInput] = useState(""),
    [history, setHistory] = useState<string[]>([]),
    [index, setIndex] = useState(0);
  const field = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [output]);
  const matches = input
    ? commands.filter((command) => command.startsWith(input.toLowerCase()))
    : [];
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
      help: commands.join(" · "),
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
      corrupt:
        "[ FICTIONAL OVERRIDE ] Signal integrity reduced. Distortion armed. Use restore to reset.",
      restore:
        "[ RESTORED ] Visual corruption cleared. Original signal recovered.",
      scan: "[ SCANNING ] Image planes: 03 / shell: marble / conscience: unresolved. Fictional diagnostic sweep active.",
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
        <span>NO SERVER CONNECTION / v.02</span>
      </div>
      <div
        className="terminal-output"
        ref={log}
        role="log"
        aria-live="polite"
        data-lenis-prevent
      >
        {output.map((v, i) => (
          <p className={v.startsWith("root@") ? "command-line" : ""} key={i}>
            {v}
          </p>
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
            if (
              e.key === "Tab" &&
              !e.shiftKey &&
              matches.length === 1 &&
              matches[0] !== input
            ) {
              e.preventDefault();
              setInput(matches[0]);
            }
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
      <div className="terminal-autocomplete" aria-live="polite">
        {matches.length
          ? `SUGGEST / ${matches.join(" · ")}${matches.length === 1 ? " / TAB TO COMPLETE" : ""}`
          : "TYPE help / ↑↓ HISTORY / TAB AUTOCOMPLETE"}
      </div>
      <div className="command-hints">
        {["help", "entity", "scan", "corrupt", "restore", "clear"].map((v) => (
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
