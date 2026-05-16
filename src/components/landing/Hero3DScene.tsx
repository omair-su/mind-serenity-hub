import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * Cinematic 3D hero scene — calming meditation aesthetic.
 * Iridescent breathing orb + particle dust + soft starfield.
 * Reacts subtly to cursor. Designed to feel premium (aicm/fineo tier).
 */
function BreathingOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  // Track pointer at the window level so the orb feels alive across the hero
  useMemo(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    // Breathing scale — 4s in / 4s out feel
    const breath = 1 + Math.sin(t * 0.6) * 0.04;
    mesh.current.scale.setScalar(breath);
    // Cursor parallax (eased)
    mesh.current.rotation.y += (target.current.x * 0.4 - mesh.current.rotation.y) * 0.03;
    mesh.current.rotation.x += (-target.current.y * 0.3 - mesh.current.rotation.x) * 0.03;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={mesh} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.6, 64]} />
        <MeshDistortMaterial
          color="#9FB8FF"
          emissive="#5B7FE0"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.85}
          distort={0.42}
          speed={1.3}
        />
      </mesh>
      {/* Inner glow shell */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color="#E9D9FF" transparent opacity={0.06} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050f1f"]} />
      <fog attach="fog" args={["#050f1f", 6, 16]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 5]} intensity={1.1} color="#E9D9FF" />
      <pointLight position={[-5, -3, -2]} intensity={1.4} color="#8267D6" />
      <pointLight position={[5, 3, -4]} intensity={1.0} color="#5B7FE0" />

      <BreathingOrb />

      {/* Soft drifting dust */}
      <Sparkles count={80} scale={[10, 6, 6]} size={2.2} speed={0.25} opacity={0.7} color="#E9D9FF" />
      <Sparkles count={40} scale={[14, 8, 8]} size={3.5} speed={0.15} opacity={0.4} color="#9FB8FF" />

      {/* Distant starfield for depth */}
      <Stars radius={40} depth={20} count={1200} factor={2.5} saturation={0} fade speed={0.4} />

      <Environment preset="night" />
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
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
