"use client";
import { useEffect, useState } from "react";
export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setLine((v) => v + 1), 450);
    const done = setTimeout(onDone, 2200);
    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [onDone]);
  const lines = [
    "root@art2fcl:~$ initialize justice.exe",
    "[ OK ] marble shell mounted",
    "[ WARN ] neutrality cannot be verified",
    "[ OK ] reality unlocked",
  ];
  return (
    <div className="boot" role="status">
      <span className="brand">
        ART2FCL<span className="red">®</span>
      </span>
      <div>
        {lines.slice(0, line + 1).map((v) => (
          <p key={v}>{v}</p>
        ))}
        <b className="red">SYSTEM//BREACH_</b>
      </div>
      <button onClick={onDone}>SKIP INTRO ↗</button>
    </div>
  );
}
