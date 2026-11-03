"use client";
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  TextureLoader,
  SRGBColorSpace,
  type Texture,
  type ShaderMaterial,
} from "three";
import { cinema, cinemaClock, goddessAsset } from "@/lib/cinema";

// Original GLSL: fixed spatial slicing, no time noise or flashing. A single RGBA texture.
const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragment = `
precision mediump float;
uniform sampler2D uImage;
uniform float uProgress;
uniform float uVelocity;
uniform float uCorruption;
varying vec2 vUv;
float hash(float n){return fract(sin(n*127.1)*43758.5453);}
vec4 sampleSafe(vec2 uv){if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)return vec4(0.);return texture2D(uImage,uv);}
void main(){
 float p=clamp(uProgress,0.,1.);
 float intensity=pow(sin(p*3.14159265),2.);
 intensity=max(intensity,uCorruption*.65);
 float row=floor(vUv.y*36.);
 float offset=(hash(row)-.5)*.43*intensity;
 offset+=uVelocity*.014*intensity;
 vec2 uv=vUv+vec2(offset, sin(row*.7+p*5.)*.015*intensity);
 float channel=.0025*intensity;
 vec4 c=sampleSafe(uv);
 vec4 red=sampleSafe(uv+vec2(channel,0.));
 vec4 blue=sampleSafe(uv-vec2(channel,0.));
 vec3 rgb=vec3(red.r,c.g,blue.b);
 float scan=1.-.12*intensity*step(.65,fract(vUv.y*220.));
 float a=max(c.a,max(red.a,blue.a))*(1.-.15*intensity);
 gl_FragColor=vec4(rgb*scan,a);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;

function Plane({ host }: { host: React.RefObject<HTMLDivElement | null> }) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const material = useRef<ShaderMaterial>(null);
  const { viewport, advance } = useThree();
  const uniforms = useMemo(
    () => ({
      uImage: { value: texture },
      uProgress: { value: 0 },
      uVelocity: { value: 0 },
      uCorruption: { value: 0 },
    }),
    [texture],
  );
  useEffect(() => {
    let disposed = false;
    const loaded = new TextureLoader().load(
      goddessAsset,
      (t) => {
        if (disposed) {
          t.dispose();
          return;
        }
        t.colorSpace = SRGBColorSpace;
        setTexture(t);
      },
      undefined,
      () => host.current?.setAttribute("data-failed", "true"),
    );
    return () => {
      disposed = true;
      loaded.dispose();
    };
  }, [host]);
  useEffect(() => {
    if (!texture) return;
    let active = false,
      lastKey = "",
      lastTime = 0;
    const el = host.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) lastKey = "";
      },
      { rootMargin: "80px" },
    );
    observer.observe(el);
    const small = matchMedia("(max-width:700px)").matches;
    const off = cinemaClock.subscribe((time) => {
      if (!active || document.hidden || el.dataset.failed === "true") return;
      if (small && time - lastTime < 1 / 30) return;
      const key = [
        cinema.progress[2].toFixed(4),
        cinema.velocity.toFixed(2),
        cinema.corruption.toFixed(2),
        viewport.width,
        viewport.height,
      ].join(":");
      if (key === lastKey) return;
      lastKey = key;
      lastTime = time;
      const values = material.current?.uniforms;
      if (!values) return;
      values.uProgress.value = cinema.progress[2];
      values.uVelocity.value = cinema.velocity;
      values.uCorruption.value = cinema.corruption;
      advance(time);
    });
    return () => {
      off();
      observer.disconnect();
      el.removeAttribute("data-ready");
    };
  }, [texture, advance, host, viewport.width, viewport.height]);
  const h = Math.min(viewport.height, (viewport.width * 1664) / 1152);
  return texture ? (
    <mesh
      onAfterRender={() => host.current?.setAttribute("data-ready", "true")}
    >
      <planeGeometry args={[(h * 1152) / 1664, h]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </mesh>
  ) : null;
}
class ShaderBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function ScrollDistortion({ enabled }: { enabled: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  return (
    <div
      className="distortion-art"
      ref={host}
      aria-label="Scroll-fractured cybernetic sculpture"
      role="img"
    >
      <img
        className="shader-fallback"
        src={goddessAsset}
        alt=""
        width="1152"
        height="1664"
      />
      {enabled && (
        <ShaderBoundary>
          <Suspense fallback={null}>
            <Canvas
              orthographic
              frameloop="never"
              dpr={[1, 1.35]}
              gl={{
                alpha: true,
                antialias: false,
                powerPreference: "low-power",
              }}
              camera={{ position: [0, 0, 5], zoom: 1 }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.domElement.addEventListener(
                  "webglcontextlost",
                  () => {
                    host.current?.setAttribute("data-failed", "true");
                  },
                  { once: true },
                );
              }}
            >
              <Plane host={host} />
            </Canvas>
          </Suspense>
        </ShaderBoundary>
      )}
    </div>
  );
}
