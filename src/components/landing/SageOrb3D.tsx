import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Trail } from "@react-three/drei";
import * as THREE from "three";

const FOREST = "#3a4d36";
const SAGE = "#a8c0a0";
const SAGE_DEEP = "#7d9b76";
const GOLD = "#c9a84c";
const CREAM = "#f5f0e8";

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

function BreathingOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      const breath = 1 + Math.sin(t * 0.55) * 0.05;
      mesh.current.scale.setScalar(breath);
      mesh.current.rotation.y += (target.current.x * 0.4 - mesh.current.rotation.y) * 0.03;
      mesh.current.rotation.x += (-target.current.y * 0.3 - mesh.current.rotation.x) * 0.03;
    }
    if (glow.current) {
      glow.current.scale.setScalar(1.1 + Math.sin(t * 0.55) * 0.06);
    }
  });

  return (
    <Float speed={1.0} rotationIntensity={0.3} floatIntensity={1.0}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.55, 48]} />
        <MeshDistortMaterial
          color={SAGE_DEEP}
          emissive={FOREST}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.85}
          distort={0.36}
          speed={1.1}
        />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[1.55, 48, 48]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.08} />
      </mesh>
    </Float>
  );
}

function GoldOrbitRing({ radius = 2.6, count = 5, speed = 0.18, tilt = 0.4 }) {
  const group = useRef<THREE.Group>(null);
  const offsets = useMemo(() => new Array(count).fill(0).map((_, i) => (i / count) * Math.PI * 2), [count]);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.z = tilt;
    group.current.children.forEach((child, i) => {
      const a = offsets[i] + t * speed;
      child.position.set(Math.cos(a) * radius, Math.sin(a) * radius, Math.sin(a * 0.7) * 0.4);
    });
  });
  return (
    <group ref={group}>
      {offsets.map((_, i) => (
        <Trail key={i} width={0.45} length={4} color={GOLD as unknown as THREE.Color} attenuation={(w) => w * w}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </Trail>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 5]} intensity={1.0} color={CREAM} />
      <pointLight position={[-5, -2, -2]} intensity={1.4} color={FOREST} />
      <pointLight position={[5, 3, -3]} intensity={1.2} color={SAGE} />
      <pointLight position={[0, 0, 3]} intensity={0.8} color={GOLD} />

      <BreathingOrb />
      <GoldOrbitRing radius={2.5} count={5} speed={0.18} tilt={0.35} />
      <GoldOrbitRing radius={3.0} count={3} speed={-0.12} tilt={-0.55} />

      <Sparkles count={60} scale={[10, 6, 6]} size={2.0} speed={0.2} opacity={0.65} color={SAGE} />
      <Sparkles count={40} scale={[12, 7, 7]} size={3.0} speed={0.14} opacity={0.5} color={GOLD} />
    </>
  );
}

function CSSFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          width: "60%",
          height: "60%",
          background: `radial-gradient(circle at 35% 35%, ${SAGE} 0%, ${SAGE_DEEP} 45%, ${FOREST} 100%)`,
          boxShadow: `0 0 80px 20px ${GOLD}33, inset -20px -20px 60px ${FOREST}`,
          animation: "breathe 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full border opacity-60"
        style={{ width: "75%", height: "75%", borderColor: `${GOLD}66`, transform: "rotate(15deg)" }}
      />
      <div
        className="absolute rounded-full border opacity-40"
        style={{ width: "90%", height: "90%", borderColor: `${GOLD}44`, transform: "rotate(-25deg)" }}
      />
      <style>{`@keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }`}</style>
    </div>
  );
}

export default function SageOrb3D() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  if (webgl === null) return null;
  if (!webgl) return <CSSFallback />;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
      style={{ width: "100%", height: "100%" }}
      onCreated={() => {}}
      fallback={<CSSFallback />}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
