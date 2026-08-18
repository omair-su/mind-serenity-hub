import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import logoSrc from "@/assets/logo/willow-sage-icon.png";

/* ────────────────────────────────────────────────────────────────
   Particle-morphing logo hero
   Logo mark → willow leaf → wave field, on a calm 3-stage loop.
   Brand palette only: forest / sage / gold on cream.
   ──────────────────────────────────────────────────────────────── */

const FOREST = new THREE.Color("#3a4d36");
const SAGE_DEEP = new THREE.Color("#7d9b76");
const GOLD = new THREE.Color("#c9a84c");

const STAGES = ["Presence", "Growth", "Flow"] as const;
const STAGE_MS = 6400;

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/* ── Target 1: sample the logo bitmap into a point cloud ───────── */
type LogoSample = { pos: Float32Array; tint: Float32Array };

async function sampleLogo(count: number): Promise<LogoSample> {
  const out = new Float32Array(count * 3);
  const tint = new Float32Array(count * 3);
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = logoSrc;

  const loaded = await new Promise<boolean>((resolve) => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });

  if (!loaded) {
    // Graceful fallback: a soft ring so the hero never renders empty.
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.05 + Math.random() * 0.12;
      out[i * 3] = Math.cos(a) * r;
      out[i * 3 + 1] = Math.sin(a) * r;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
      tint[i * 3] = 0.49;
      tint[i * 3 + 1] = 0.61;
      tint[i * 3 + 2] = 0.46;
    }
    return { pos: out, tint };
  }

  const S = 220;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { pos: out, tint };
  ctx.drawImage(img, 0, 0, S, S);
  const { data } = ctx.getImageData(0, 0, S, S);

  const candidates: number[] = [];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      const alpha = data[i + 3] / 255;
      const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
      // keep opaque ink (dark) pixels — works for both transparent and flat art
      const ink = alpha > 0.5 && lum < 0.9;
      if (ink) candidates.push(x, y, i);
    }
  }

  const n = candidates.length / 3;
  if (n === 0) return { pos: out, tint };

  for (let i = 0; i < count; i++) {
    const k = (Math.random() * n) | 0;
    const x = candidates[k * 3] + (Math.random() - 0.5);
    const y = candidates[k * 3 + 1] + (Math.random() - 0.5);
    const src = candidates[k * 3 + 2];
    // keep the emblem's own sage-and-gold shading in the cloud, slightly deepened
    tint[i * 3] = Math.min(1, (data[src] / 255) * 0.82);
    tint[i * 3 + 1] = Math.min(1, (data[src + 1] / 255) * 0.82);
    tint[i * 3 + 2] = Math.min(1, (data[src + 2] / 255) * 0.82);
    const nx = (x / S - 0.5) * 3.1;
    const ny = -(y / S - 0.5) * 3.1;
    out[i * 3] = nx;
    out[i * 3 + 1] = ny;
    // subtle relief: the mark bows gently toward the viewer at its centre
    out[i * 3 + 2] = Math.cos(nx * 0.9) * Math.cos(ny * 0.9) * 0.28 + (Math.random() - 0.5) * 0.05;
  }
  return { pos: out, tint };
}

/* ── Target 2: a willow leaf, curved and twisted in 3D ─────────── */
function buildLeaf(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const TILT = -0.28; // radians — the leaf hangs on a slight diagonal
  for (let i = 0; i < count; i++) {
    const stray = Math.random() < 0.035;
    const midrib = !stray && Math.random() < 0.16;

    // u runs -1 (base) → 1 (tip) along the spine
    const u = Math.random() * 2 - 1;
    // lens profile with drawn-out points: round belly, fine tips
    const w = Math.pow(Math.max(0, 1 - u * u), 0.62) * (1 - u * 0.22) * 0.58;
    // across the blade, denser toward the midrib
    let v = Math.random() * 2 - 1;
    v = Math.sign(v) * Math.pow(Math.abs(v), 0.62);
    if (midrib) v *= 0.12;

    // the spine itself is an arc, not a straight line
    const arc = (1 - u * u) * 0.34;
    let x = v * w + arc;
    let y = u * 1.72;
    // blade folds away from the midrib and lifts at the belly
    let z = (1 - u * u) * 0.34 - Math.abs(v) * w * 1.1;

    // gentle twist about the spine, then tilt the whole leaf
    const tw = u * 0.42;
    const rx = x * Math.cos(tw) - z * Math.sin(tw);
    z = x * Math.sin(tw) + z * Math.cos(tw);
    x = rx;
    const tx = x * Math.cos(TILT) - y * Math.sin(TILT);
    const ty = x * Math.sin(TILT) + y * Math.cos(TILT);

    out[i * 3] = tx;
    out[i * 3 + 1] = ty;
    out[i * 3 + 2] = z;

    if (stray) {
      out[i * 3] += (Math.random() - 0.5) * 1.8;
      out[i * 3 + 1] += (Math.random() - 0.5) * 1.8;
      out[i * 3 + 2] += (Math.random() - 0.5) * 0.7;
    }
  }
  return out;
}

/* ── Target 3: a slow, breathing wave field ────────────────────── */
function buildWaveField(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const cols = Math.ceil(Math.sqrt(count * 1.6));
  const rows = Math.ceil(count / cols);
  let i = 0;
  for (let r = 0; r < rows && i < count; r++) {
    for (let c = 0; c < cols && i < count; c++, i++) {
      const u = c / (cols - 1) - 0.5;
      const v = r / (rows - 1) - 0.5;
      const x = u * 3.6 + (Math.random() - 0.5) * 0.04;
      const y = v * 1.9 + (Math.random() - 0.5) * 0.04;
      const z = Math.sin(u * 5.2) * 0.16 + Math.cos(v * 4.1) * 0.12;
      out[i * 3] = x;
      out[i * 3 + 1] = y * 0.9;
      out[i * 3 + 2] = z;
    }
  }
  return out;
}

const vertexShader = /* glsl */ `
  attribute vec3 aLogo;
  attribute vec3 aLeaf;
  attribute vec3 aWave;
  attribute float aRand;
  attribute vec3 aTint;

  uniform vec3  uWeights;   // logo / leaf / wave
  uniform float uTime;
  uniform float uSize;
  uniform float uBreath;
  uniform float uTurbulence;
  uniform float uPixelRatio;

  varying float vRand;
  varying float vGlow;
  varying vec3 vTint;
  varying float vLogo;

  void main() {
    vTint = aTint;
    vLogo = uWeights.x;
    vec3 pos = aLogo * uWeights.x + aLeaf * uWeights.y + aWave * uWeights.z;

    // calm drift — slow, organic, never jittery
    float ph = aRand * 6.2831;
    pos.x += sin(uTime * 0.28 + ph + pos.y * 0.9) * 0.035;
    pos.y += cos(uTime * 0.24 + ph + pos.x * 0.8) * 0.035;
    pos.z += sin(uTime * 0.32 + ph) * 0.05;

    // wave field ripples only while the field is present
    float wave = sin(pos.x * 2.1 + uTime * 0.6) * cos(pos.y * 1.7 - uTime * 0.42);
    pos.z += wave * 0.34 * uWeights.z;
    pos.y += wave * 0.06 * uWeights.z;

    // transition turbulence: particles bloom outward mid-morph, then settle
    pos += normalize(pos + 0.0001) * uTurbulence * (0.18 + aRand * 0.5);

    // shared breath
    pos *= uBreath;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aRand * 0.9) * uPixelRatio * (7.5 / -mv.z);

    vRand = aRand;
    vGlow = clamp(0.52 + pos.z * 0.5 + uTurbulence * 1.0, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uForest;
  uniform vec3 uSage;
  uniform vec3 uGold;
  uniform float uOpacity;

  varying float vRand;
  varying float vGlow;
  varying vec3 vTint;
  varying float vLogo;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.06, d);
    if (alpha < 0.01) discard;

    vec3 base = mix(uForest, uSage, smoothstep(0.0, 1.0, vGlow));
    vec3 col  = mix(base, uGold, smoothstep(0.9, 1.0, vRand) * 0.85);
    // while the emblem is formed, particles carry the logo's own shading
    col = mix(col, vTint, clamp(vLogo, 0.0, 1.0) * 0.8);

    gl_FragColor = vec4(col, alpha * uOpacity * (0.5 + vRand * 0.5));
  }
`;

function ParticleField({
  count,
  stage,
  reduced,
}: {
  count: number;
  stage: number;
  reduced: boolean;
}) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const [logo, setLogo] = useState<LogoSample | null>(null);

  const leaf = useMemo(() => buildLeaf(count), [count]);
  const wave = useMemo(() => buildWaveField(count), [count]);
  const rand = useMemo(() => {
    const a = new Float32Array(count);
    for (let i = 0; i < count; i++) a[i] = Math.random();
    return a;
  }, [count]);

  useEffect(() => {
    let alive = true;
    sampleLogo(count).then((d) => alive && setLogo(d));
    return () => {
      alive = false;
    };
  }, [count]);

  const weights = useRef(new THREE.Vector3(1, 0, 0));
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  const uniforms = useMemo(
    () => ({
      uWeights: { value: new THREE.Vector3(1, 0, 0) },
      uTime: { value: 0 },
      uSize: { value: 6.4 },
      uBreath: { value: 1 },
      uTurbulence: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uForest: { value: FOREST },
      uSage: { value: SAGE_DEEP },
      uGold: { value: GOLD },
      uOpacity: { value: 0 },
    }),
    [gl],
  );

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const t = state.clock.getElapsedTime();
    const d = Math.min(delta, 0.05);

    u.uTime.value = reduced ? 0 : t;
    u.uOpacity.value += ((logo ? 1 : 0) - u.uOpacity.value) * d * 1.6;

    // target weights for the active stage
    const target = new THREE.Vector3(stage === 0 ? 1 : 0, stage === 1 ? 1 : 0, stage === 2 ? 1 : 0);
    const w = weights.current;
    const speed = reduced ? 6 : 1.15;
    w.lerp(target, 1 - Math.exp(-speed * d));
    u.uWeights.value.copy(w);

    // turbulence peaks while the cloud is between two shapes
    const settle = Math.max(w.x, Math.max(w.y, w.z));
    u.uTurbulence.value = reduced ? 0 : (1 - settle) * 0.75;

    // 5.5s breath cycle
    u.uBreath.value = reduced ? 1 : 1 + Math.sin(t * (Math.PI * 2) / 5.5) * 0.035;

    if (points.current) {
      const p = pointer.current;
      p.x += (p.tx - p.x) * d * 1.4;
      p.y += (p.ty - p.y) * d * 1.4;
      points.current.rotation.y += (p.x * 0.32 - points.current.rotation.y) * d * 1.6;
      points.current.rotation.x += (-p.y * 0.2 - points.current.rotation.x) * d * 1.6;
      if (!reduced) points.current.rotation.z = Math.sin(t * 0.12) * 0.04;
    }
  });

  if (!logo) return null;

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[logo.pos, 3]} />
        <bufferAttribute attach="attributes-aLogo" args={[logo.pos, 3]} />
        <bufferAttribute attach="attributes-aTint" args={[logo.tint, 3]} />
        <bufferAttribute attach="attributes-aLeaf" args={[leaf, 3]} />
        <bufferAttribute attach="attributes-aWave" args={[wave, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rand, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function ParticleLogoHero() {
  const [ok, setOk] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [stage, setStage] = useState(0);
  const [count, setCount] = useState(9000);

  useEffect(() => {
    setOk(detectWebGL());
    setReduced(prefersReducedMotion());
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const weak = (navigator.hardwareConcurrency ?? 4) <= 4;
    setCount(mobile ? 4500 : weak ? 7000 : 11000);
  }, []);

  useEffect(() => {
    if (!ok || reduced) return;
    const id = window.setInterval(() => setStage((s) => (s + 1) % 3), STAGE_MS);
    return () => window.clearInterval(id);
  }, [ok, reduced]);

  if (!ok) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={logoSrc}
          alt="Willow Vibes emblem"
          className="w-1/2 h-auto opacity-90"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ParticleField count={count} stage={stage} reduced={reduced} />
      </Canvas>

      {!reduced && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[12%] flex justify-center"
          aria-hidden
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={stage}
              initial={{ opacity: 0, y: 8, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.34em" }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="ff-eyebrow text-[9px] uppercase"
              style={{ color: "rgba(58,77,54,0.55)" }}
            >
              {STAGES[stage]}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
