import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";

/**
 * Willow Vibes cinematic 3D hero — branded forest + gold palette.
 * No Environment HDR (was causing slow first paint by fetching remote assets).
 * All lights are local — scene paints on first frame.
 */

// Brand tokens (forest / sage / gold / cream)
const FOREST = "#1a3c2a";
const SAGE = "#7d9b76";
const SAGE_LIGHT = "#a8c0a0";
const GOLD = "#c9a84c";
const GOLD_BRIGHT = "#f0d78c";
const CREAM = "#f5f0e0";

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
      const g = 1.08 + Math.sin(t * 0.55) * 0.06;
      glow.current.scale.setScalar(g);
    }
  });

  return (
    <Float speed={1.0} rotationIntensity={0.35} floatIntensity={1.1}>
      {/* Core iridescent orb — emerald with gold sheen */}
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.55, 48]} />
        <MeshDistortMaterial
          color={SAGE}
          emissive={FOREST}
          emissiveIntensity={0.55}
          roughness={0.18}
          metalness={0.92}
          distort={0.38}
          speed={1.1}
        />
      </mesh>
      {/* Inner gold glow shell */}
      <mesh ref={glow}>
        <sphereGeometry args={[1.55, 48, 48]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.07} />
      </mesh>
    </Float>
  );
}

/** Slowly orbiting gold "fireflies" — branded, calming, premium feel */
function GoldOrbitRing({ radius = 2.6, count = 5, speed = 0.18, tilt = 0.4 }: { radius?: number; count?: number; speed?: number; tilt?: number }) {
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
        <Trail key={i} width={0.6} length={4} color={GOLD as unknown as THREE.Color} attenuation={(w) => w * w}>
          <mesh>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color={GOLD_BRIGHT} toneMapped={false} />
          </mesh>
        </Trail>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#06120c"]} />
      <fog attach="fog" args={["#06120c", 6, 18]} />

      {/* Local lights only — no remote HDR */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 5]} intensity={1.2} color={CREAM} />
      <pointLight position={[-5, -2, -2]} intensity={1.6} color={FOREST} />
      <pointLight position={[5, 3, -3]} intensity={1.4} color={SAGE_LIGHT} />
      <pointLight position={[0, 0, 3]} intensity={0.9} color={GOLD} />

      <BreathingOrb />

      {/* Two orbiting gold rings at different tilts */}
      <GoldOrbitRing radius={2.55} count={5} speed={0.18} tilt={0.35} />
      <GoldOrbitRing radius={3.1} count={3} speed={-0.12} tilt={-0.55} />

      {/* Drifting dust — cream + sage */}
      <Sparkles count={70} scale={[10, 6, 6]} size={2.2} speed={0.22} opacity={0.7} color={CREAM} />
      <Sparkles count={45} scale={[14, 8, 8]} size={3.5} speed={0.14} opacity={0.45} color={SAGE_LIGHT} />
      <Sparkles count={30} scale={[12, 7, 7]} size={2.8} speed={0.18} opacity={0.55} color={GOLD_BRIGHT} />

      {/* Distant starfield for depth */}
      <Stars radius={45} depth={22} count={900} factor={2.2} saturation={0} fade speed={0.35} />
    </>
  );
}

export default function Hero3DScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
