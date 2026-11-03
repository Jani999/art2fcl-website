"use client";
import { Component, Suspense, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, OrbitControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";
function Model({ url, progress }: { url: string; progress?: number }) {
  const { scene } = useGLTF(url);
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (ref.current) {
      const p =
        progress ??
        window.scrollY /
          Math.max(1, document.documentElement.scrollHeight - innerHeight);
      ref.current.rotation.y = matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? 0
        : p * Math.PI * 2;
    }
  });
  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}
class ModelBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div>
        <p role="status">3D unavailable. Original artwork restored.</p>
        <img src="/assets/goddess.png" alt="Cybernetic Lady Justice" />
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function GoddessModel3D({
  url = "/models/goddess.glb",
  progress,
}: {
  url?: string;
  progress?: number;
}) {
  return (
    <ModelBoundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5] }}
        fallback={
          <img src="/assets/goddess.png" alt="Cybernetic Lady Justice" />
        }
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 4]} intensity={3} />
        <Suspense fallback={null}>
          <Bounds fit clip observe>
            <Model url={url} progress={progress} />
          </Bounds>
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </ModelBoundary>
  );
}
