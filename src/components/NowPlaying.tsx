"use client";
import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
const time = (n: number) =>
  `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
export default function NowPlaying({ low }: { low: boolean }) {
  const audio = useRef<HTMLAudioElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    context = useRef<AudioContext | null>(null),
    analyser = useRef<AnalyserNode | null>(null);
  const [playing, setPlaying] = useState(false),
    [expanded, setExpanded] = useState(false),
    [duration, setDuration] = useState(0),
    [position, setPosition] = useState(0),
    [volume, setVolume] = useState(0.6),
    [muted, setMuted] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    const el = audio.current;
    if (el) el.volume = volume;
  }, [volume]);
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const sync = () => {
      if (Number.isFinite(el.duration)) setDuration(el.duration);
      if (el.error) setError("AUDIO UNAVAILABLE");
    };
    const frame = requestAnimationFrame(sync);
    el.addEventListener("loadedmetadata", sync);
    el.addEventListener("durationchange", sync);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("loadedmetadata", sync);
      el.removeEventListener("durationchange", sync);
    };
  }, []);
  useEffect(() => {
    let frame = 0;
    const draw = () => {
      const node = analyser.current,
        c = canvas.current;
      if (!node || !c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const values = new Uint8Array(node.frequencyBinCount);
      node.getByteFrequencyData(values);
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#c0ff42";
      for (let i = 0; i < 24; i++) {
        const h = (values[i * 2] / 255) * 24;
        ctx.fillRect(i * 4, 28 - h, 2, Math.max(1, h));
      }
      frame = requestAnimationFrame(draw);
    };
    if (
      playing &&
      !low &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      draw();
    return () => cancelAnimationFrame(frame);
  }, [playing, low]);
  useEffect(
    () => () => {
      context.current?.close();
    },
    [],
  );
  async function toggle() {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      return;
    }
    try {
      if (!context.current && window.AudioContext) {
        const ctx = new AudioContext();
        const source = ctx.createMediaElementSource(el);
        const node = ctx.createAnalyser();
        node.fftSize = 128;
        source.connect(node);
        node.connect(ctx.destination);
        context.current = ctx;
        analyser.current = node;
      }
      await context.current?.resume();
      await el.play();
    } catch {
      setError("AUDIO UNAVAILABLE — retry");
    }
  }
  return (
    <aside id="player" className="player" aria-label="Music player">
      <audio
        ref={audio}
        src="/audio/demons-shot.mp3"
        preload="metadata"
        onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
        onPlay={() => {
          setPlaying(true);
          setError("");
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError("AUDIO UNAVAILABLE")}
      />
      <div className="player-main">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause audio" : "Enable audio / play"}
        >
          {playing ? <Pause size={17} /> : <Play size={17} />}
        </button>
        <div className="track">
          <span>
            {error || (playing ? "NOW PLAYING" : "ENABLE AUDIO")} <i>↗</i>
          </span>
          <strong>DEMON’S SHOT</strong>
        </div>
        <canvas ref={canvas} width={96} height={30} aria-hidden="true" />
        <button
          aria-label={expanded ? "Collapse player" : "Expand player"}
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      {expanded && (
        <div className="player-details">
          <p>Aiobahn +81 feat. DEMONDICE</p>
          <div className="seek">
            <span>{time(position)}</span>
            <input
              aria-label="Seek audio"
              type="range"
              min="0"
              max={duration || 1}
              step=".1"
              value={position}
              disabled={!duration}
              onChange={(e) => {
                if (audio.current)
                  audio.current.currentTime = Number(e.target.value);
              }}
            />
            <span>{time(duration)}</span>
          </div>
          <div className="volume">
            <button
              aria-label={muted ? "Unmute audio" : "Mute audio"}
              onClick={() => {
                if (audio.current) audio.current.muted = !muted;
                setMuted(!muted);
              }}
            >
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <input
              aria-label="Volume"
              type="range"
              min="0"
              max="1"
              step=".01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
