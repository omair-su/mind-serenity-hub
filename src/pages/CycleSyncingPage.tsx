import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";



/**
 * Cycle Syncing — premium standalone feature page.
 *
 * Self-contained styling: all spec-required colors and fonts are scoped via
 * inline CSS variables on the root wrapper so this page renders with the
 * exact luxurious palette without touching the global design tokens.
 */

const PALETTE = {
  sageDeep: "#4A6741",
  sageMid: "#7A9E76",
  sageLight: "#B8D4B4",
  sageWhisper: "#EBF3EA",
  blushRose: "#C9A99A",
  springPeach: "#E8C4A8",
  goldenPollen: "#D4B896",
  dustyPlum: "#9B8AA0",
  cream: "#FAF8F5",
  forest: "#2C3E2D",
  charcoal: "#4A4A4A",
  mutedSage: "#6B8C68",
};

const px = (n: number) => `${n}px`;

const img = (url: string) => `${url}?auto=compress&cs=tinysrgb&w=1600`;

// ---------------- shared atoms ----------------

function Eyebrow({ children, color = PALETTE.mutedSage }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        fontFamily: "Karla, system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color,
      }}
    >
      {children}
    </span>
  );
}

function Display({
  children,
  size = 48,
  italic = true,
  color = PALETTE.forest,
  as: As = "h2",
}: {
  children: React.ReactNode;
  size?: number;
  italic?: boolean;
  color?: string;
  as?: any;
}) {
  return (
    <As
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 600,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        lineHeight: 1.1,
        color,
        margin: 0,
      }}
    >
      {children}
    </As>
  );
}

function Body({
  children,
  size = 16,
  color = PALETTE.charcoal,
  weight = 400,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: 400 | 700;
}) {
  return (
    <p
      style={{
        fontFamily: "Karla, system-ui, sans-serif",
        fontSize: size,
        lineHeight: 1.65,
        color,
        margin: 0,
        fontWeight: weight,
      }}
    >
      {children}
    </p>
  );
}

function Card({
  children,
  bg = PALETTE.cream,
  border,
  pad = 28,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  bg?: string;
  border?: string;
  pad?: number;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <div
      className="cs-fade"
      style={{
        background: bg,
        border: border ? `1px solid ${border}` : "none",
        borderRadius: 20,
        padding: pad,
        boxShadow: "0 4px 24px rgba(74,103,65,0.08)",
        animationDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CTAButton({
  children,
  bg = PALETTE.sageDeep,
  color = "white",
  onClick,
  large = false,
}: {
  children: React.ReactNode;
  bg?: string;
  color?: string;
  onClick?: () => void;
  large?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Karla, system-ui, sans-serif",
        fontWeight: 700,
        fontSize: large ? 17 : 16,
        color,
        background: bg,
        border: "none",
        borderRadius: 50,
        padding: large ? "18px 44px" : "16px 40px",
        cursor: "pointer",
        boxShadow: "0 8px 28px rgba(74,103,65,0.25)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </button>
  );
}

function HormoneBadge({ children, color = PALETTE.sageDeep }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 14px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(6px)",
        border: `1px solid ${color}33`,
        color,
        fontFamily: "Karla, system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: "0.05em",
        marginRight: 8,
        marginTop: 8,
      }}
    >
      {children}
    </span>
  );
}

function YouTubeEmbed({ id, height = 280 }: { id: string; height?: number }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ width: "100%", height, borderRadius: 16, border: "none", display: "block" }}
      title={`Cycle Syncing video ${id}`}
    />
  );
}

// ---------------- Section 1: Hero ----------------

function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: `linear-gradient(135deg, rgba(74,103,65,0.55) 0%, rgba(44,62,45,0.30) 100%), url(${img(
          "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg",
        )})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        textAlign: "center",
        color: "white",
      }}
      className="cs-hero"
    >
      <div style={{ maxWidth: 760 }}>
        <Eyebrow color="rgba(255,255,255,0.85)">Your Sacred Feminine Rhythm</Eyebrow>
        <div style={{ height: 24 }} />
        <h1
          className="cs-hero-title"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 72,
            lineHeight: 1.05,
            margin: 0,
            color: "white",
            textShadow: "0 2px 24px rgba(0,0,0,0.25)",
          }}
        >
          Live in Sync With Your Cycle
        </h1>
        <div style={{ height: 22 }} />
        <p
          style={{
            fontFamily: "Karla, system-ui, sans-serif",
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto",
            color: "rgba(255,255,255,0.95)",
          }}
        >
          Unlock personalized rituals, science-backed nutrition, guided breathwork, and nervous system healing — tailored to each of your four hormonal phases.
        </p>
        <div style={{ height: 36 }} />
        <CTAButton
          large
          onClick={() => {
            const el = document.getElementById("phase-navigator");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Begin Your Cycle Journey →
        </CTAButton>
      </div>
    </section>
  );
}


// ---------------- Section 2: Phase Navigator ----------------

type PhaseKey = "menstrual" | "follicular" | "ovulatory" | "luteal";

const PHASES: Record<
  PhaseKey,
  {
    key: PhaseKey;
    icon: string;
    label: string;
    days: string;
    color: string;
    season: string;
    sub: string;
    hormones: string[];
    image: string;
    startDay: number;
    endDay: number;
  }
> = {
  menstrual: {
    key: "menstrual",
    icon: "🩸",
    label: "Menstrual",
    days: "Days 1–5",
    color: PALETTE.blushRose,
    season: "The Winter of Your Cycle",
    sub: "A time for rest, release, and deep inward wisdom. Your body is doing sacred work.",
    hormones: ["↓ Estrogen", "↓ Progesterone"],
    image: "https://images.pexels.com/photos/3759658/pexels-photo-3759658.jpeg",
    startDay: 1,
    endDay: 5,
  },
  follicular: {
    key: "follicular",
    icon: "🌱",
    label: "Follicular",
    days: "Days 6–14",
    color: PALETTE.springPeach,
    season: "The Spring of Your Cycle",
    sub: "Estrogen rises, energy returns, and creativity blooms. This is your season of new beginnings.",
    hormones: ["↑ Estrogen Rising", "↑ FSH Active"],
    image: "https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg",
    startDay: 6,
    endDay: 14,
  },
  ovulatory: {
    key: "ovulatory",
    icon: "✨",
    label: "Ovulatory",
    days: "Days 15–17",
    color: PALETTE.goldenPollen,
    season: "The Summer of Your Cycle",
    sub: "Your peak power window. Estrogen, testosterone, and LH surge together — giving you charisma, confidence, and magnetic energy.",
    hormones: ["⚡ Estrogen Peak", "⚡ LH Surge", "↑ Testosterone"],
    image: "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg",
    startDay: 15,
    endDay: 17,
  },
  luteal: {
    key: "luteal",
    icon: "🌙",
    label: "Luteal",
    days: "Days 18–28",
    color: PALETTE.dustyPlum,
    season: "The Autumn of Your Cycle",
    sub: "Progesterone rises, energy turns inward. Your body prepares. Your intuition deepens. This phase demands boundaries, nourishment, and gentleness.",
    hormones: ["↑ Progesterone", "↓ Serotonin", "PMS Window"],
    image: "https://images.pexels.com/photos/4498318/pexels-photo-4498318.jpeg",
    startDay: 18,
    endDay: 28,
  },
};

function PhaseTabs({ active, onChange }: { active: PhaseKey; onChange: (k: PhaseKey) => void }) {
  return (
    <div
      className="cs-tabs"
      style={{
        display: "flex",
        gap: 12,
        overflowX: "auto",
        padding: "8px 4px 16px",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}
    >
      {(Object.keys(PHASES) as PhaseKey[]).map((k) => {
        const p = PHASES[k];
        const isActive = active === k;
        return (
          <button
            key={k}
            onClick={() => onChange(k)}
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              borderRadius: 999,
              border: `1.5px solid ${p.color}`,
              background: isActive ? p.color : "transparent",
              color: isActive ? "white" : PALETTE.forest,
              fontFamily: "Karla, system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: isActive ? `0 6px 20px ${p.color}55` : "none",
            }}
          >
            <span style={{ fontSize: 18 }}>{p.icon}</span>
            <span>
              {p.label} · {p.days}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PhaseHeader({ phase }: { phase: typeof PHASES[PhaseKey] }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${phase.color}cc 0%, ${phase.color}77 100%), url(${img(phase.image)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "56px 36px",
        color: "white",
        minHeight: 280,
        boxShadow: "0 12px 40px rgba(74,103,65,0.18)",
      }}
      className="cs-fade"
    >
      <Eyebrow color="rgba(255,255,255,0.9)">
        {phase.icon} {phase.label} · {phase.days}
      </Eyebrow>
      <div style={{ height: 14 }} />
      <Display size={48} color="white">
        {phase.season}
      </Display>
      <div style={{ height: 14 }} />
      <p
        style={{
          fontFamily: "Karla, system-ui, sans-serif",
          fontSize: 16,
          color: "rgba(255,255,255,0.95)",
          maxWidth: 580,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {phase.sub}
      </p>
      <div style={{ height: 16 }} />
      <div>
        {phase.hormones.map((h) => (
          <HormoneBadge key={h} color="white">
            {h}
          </HormoneBadge>
        ))}
      </div>
    </div>
  );
}

// ---------------- Phase content blocks ----------------

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 12px",
        background: PALETTE.sageWhisper,
        color: PALETTE.sageDeep,
        borderRadius: 999,
        fontFamily: "Karla, system-ui, sans-serif",
        fontSize: 12,
        fontWeight: 700,
        marginRight: 8,
        marginTop: 8,
      }}
    >
      {children}
    </span>
  );
}

function ScienceBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 18,
        background: PALETTE.sageWhisper,
        borderLeft: `4px solid ${PALETTE.sageMid}`,
        borderRadius: 12,
      }}
    >
      <Body size={13} color={PALETTE.forest}>
        {children}
      </Body>
    </div>
  );
}

function PremiumLockOverlay({ unlocked }: { unlocked: boolean }) {
  if (unlocked) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(44,62,45,0.45)",
        backdropFilter: "blur(4px)",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        zIndex: 2,
      }}
    >
      <div style={{ fontSize: 28 }}>🔒</div>
      <Display size={22} color="white">
        Willow Plus Members
      </Display>
      <CTAButton bg={PALETTE.goldenPollen} color={PALETTE.forest}>
        Unlock with Willow Plus →
      </CTAButton>
    </div>
  );
}

function FoodPill({ emoji, name, why }: { emoji: string; name: string; why?: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "12px 14px",
        background: PALETTE.cream,
        borderRadius: 14,
        border: `1px solid ${PALETTE.sageWhisper}`,
      }}
    >
      <div style={{ fontSize: 22 }}>{emoji}</div>
      <div>
        <Body size={14} color={PALETTE.forest} weight={700}>
          {name}
        </Body>
        {why && (
          <Body size={12} color={PALETTE.mutedSage}>
            {why}
          </Body>
        )}
      </div>
    </div>
  );
}

// ---- Menstrual content ----

function MenstrualContent({ unlocked }: { unlocked: boolean }) {
  const accent = PALETTE.blushRose;
  return (
    <div className="cs-grid">
      {/* A */}
      <Card delay={0}>
        <Eyebrow color={accent}>Today's Ritual</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={28}>Womb Healing Meditation</Display>
        <div style={{ height: 10 }} />
        <Body>
          A 12-minute guided meditation to honor your body's natural release, ease cramping through breath, and restore emotional peace.
        </Body>
        <div style={{ height: 14 }} />
        <YouTubeEmbed id="eFV0FfMc_uo" />
        <div style={{ height: 12 }} />
        <MetaPill>12 min</MetaPill>
        <MetaPill>Difficulty: Gentle</MetaPill>
      </Card>

      {/* B - premium */}
      <Card delay={100} style={{ position: "relative" }}>
        <Eyebrow color={accent}>Nervous System Healing</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={28}>Vagus Nerve Reset</Display>
        <div style={{ height: 10 }} />
        <Body>
          Your vagus nerve — the body's longest cranial nerve, running from brain to gut — is your natural calm switch. During menstruation, activating it through humming and slow exhale breathing reduces cramping and emotional overwhelm.
        </Body>
        <div style={{ height: 14 }} />
        <div style={{ filter: unlocked ? "none" : "blur(6px)" }}>
          <YouTubeEmbed id="2fYcbJ4IOn8" />
          <ScienceBox>
            🧬 <strong>Why This Works</strong> — The vagus nerve controls 75% of your parasympathetic nervous system. Humming creates internal vibration that directly stimulates vagal tone, reduces cortisol, and signals safety to your nervous system. <em>— Cleveland Clinic & Polyvagal Theory (Dr. Stephen Porges)</em>
          </ScienceBox>
        </div>
        <PremiumLockOverlay unlocked={unlocked} />
      </Card>

      {/* C - vagus svg */}
      <Card delay={150} bg={PALETTE.sageWhisper}>
        <Eyebrow color={accent}>Anatomy</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={26}>Understanding Your Vagus Nerve</Display>
        <div style={{ height: 14 }} />
        <VagusPathwaySVG compact />
        <div style={{ height: 14 }} />
        <Body size={13}>
          80% sensory (gut → brain) · Regulates heartbeat, digestion & mood · Activated by slow exhale, humming, cold water, singing.
        </Body>
      </Card>

      {/* D - nourish */}
      <Card delay={200}>
        <Eyebrow color={accent}>Nourish</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={26}>What to Eat This Week</Display>
        <div style={{ height: 14 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          <FoodPill emoji="🥩" name="Iron-rich foods" why="Spinach, lentils, red meat" />
          <FoodPill emoji="🍊" name="Vitamin C" why="Boosts iron absorption" />
          <FoodPill emoji="🐟" name="Omega-3s" why="Reduces inflammation" />
          <FoodPill emoji="🍫" name="Dark chocolate" why="Magnesium eases tension" />
          <FoodPill emoji="🫖" name="Raspberry leaf tea" why="Traditional womb support" />
        </div>
        <ScienceBox>
          💡 Warm, grounding meals like soups and stews comfort the body. Avoid cold, raw foods which can increase cramping.
        </ScienceBox>
      </Card>

      {/* E - move */}
      <Card delay={250}>
        <Eyebrow color={accent}>Move</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={26}>Gentle Movement for Today</Display>
        <div style={{ height: 14 }} />
        <img
          src={img("https://images.pexels.com/photos/5938390/pexels-photo-5938390.jpeg")}
          alt="Restorative yoga pose"
          loading="lazy"
          style={{ width: "100%", borderRadius: 16, marginBottom: 14, display: "block" }}
        />
        <Body>
          ✓ Yin yoga & restorative poses (child's pose, supine twist)<br />
          ✓ Slow walks in nature (15–20 min)<br />
          ✓ Gentle stretching & somatic movement<br />
          ✓ Yoga nidra / body scan meditation<br />
          ✗ Avoid: HIIT, heavy lifting, hot yoga
        </Body>
        <div style={{ height: 14 }} />
        <YouTubeEmbed id="zUx5kLFyx-M" />
      </Card>

      {/* F - archetype */}
      <Card
        delay={300}
        bg={`linear-gradient(135deg, ${PALETTE.dustyPlum}33 0%, ${PALETTE.blushRose}33 100%)`}
        style={{ gridColumn: "1 / -1", textAlign: "center" }}
        pad={48}
      >
        <Eyebrow color={accent}>Archetype</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={36}>The Inner Wise Woman</Display>
        <div style={{ height: 14 }} />
        <Body>
          During menstruation, your veil between conscious and subconscious is thinnest. Dreams are vivid, intuition is sharp, and your body asks you to slow down and listen. Honor this phase — it is not weakness. It is wisdom.
        </Body>
        <div style={{ height: 24 }} />
        <Display size={24}>
          "I honor my body's sacred rhythm. Rest is productive. Release is renewal."
        </Display>
        <div style={{ height: 24 }} />
        <CTAButton bg={PALETTE.sageDeep}>✍️ Open Today's Journal Prompt</CTAButton>
      </Card>
    </div>
  );
}

// ---- Follicular content ----

function FollicularContent() {
  const accent = PALETTE.springPeach;
  return (
    <div className="cs-grid">
      <Card delay={0}>
        <Eyebrow color={accent}>Today's Meditation</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={28}>Morning Clarity Meditation</Display>
        <div style={{ height: 10 }} />
        <Body>
          As estrogen rises, your brain becomes more verbal, creative, and outward-facing. This 10-minute visualization meditation helps you set powerful intentions and ride the rising wave of energy.
        </Body>
        <div style={{ height: 14 }} />
        <YouTubeEmbed id="Y_8mR_SsUnw" />
      </Card>

      <Card delay={100}>
        <Eyebrow color={accent}>Vagus Practice</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={28}>Cold Splash Reset</Display>
        <div style={{ height: 10 }} />
        <Body>
          The follicular phase is the perfect time to build vagal resilience. Cold water exposure (splashing face with cold water for 30 seconds) activates the dive reflex, immediately stimulating vagus nerve activity and boosting mental clarity.
        </Body>
        <div style={{ height: 14 }} />
        <Body size={14}>
          <strong>1.</strong> Fill your sink with cold water<br />
          <strong>2.</strong> Take a deep breath in<br />
          <strong>3.</strong> Submerge your face or splash cold water 5–10 times<br />
          <strong>4.</strong> Exhale slowly through pursed lips<br />
          <strong>5.</strong> Notice the immediate calm clarity
        </Body>
        <ScienceBox>
          🧬 Cold water exposure triggers the mammalian dive reflex — directly stimulating your vagal pathways for an instant nervous system reset.
        </ScienceBox>
      </Card>

      <Card delay={150}>
        <Eyebrow color={accent}>Nourish</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={26}>Fresh, Energizing Foods</Display>
        <div style={{ height: 14 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          <FoodPill emoji="🥗" name="Fresh salads" why="Your ideal raw-food window" />
          <FoodPill emoji="🥚" name="Eggs & lean protein" why="Supports follicle development" />
          <FoodPill emoji="🫐" name="Fermented foods" why="Estrogen supports gut flora" />
          <FoodPill emoji="🌾" name="Complex carbs" why="Quinoa, brown rice" />
          <FoodPill emoji="🥑" name="Healthy fats" why="Avocado, nuts, seeds" />
          <FoodPill emoji="🍵" name="Green tea" why="Supports estrogen metabolism" />
        </div>
        <ScienceBox>
          🍲 <strong>Recipe — Quinoa Power Bowl:</strong> quinoa, roasted sweet potato, kale, chickpeas, lemon-tahini drizzle, pumpkin seeds. 20 min.
        </ScienceBox>
      </Card>

      <Card delay={200}>
        <Eyebrow color={accent}>Move</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={26}>Your Season to Build Strength</Display>
        <div style={{ height: 14 }} />
        <img
          src={img("https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg")}
          alt="Strength training"
          loading="lazy"
          style={{ width: "100%", borderRadius: 16, marginBottom: 14, display: "block" }}
        />
        <Body>
          ✓ Running & cardio (jog, bike, swim)<br />
          ✓ Strength training — start heavier sets this week<br />
          ✓ Dance, vinyasa yoga, pilates<br />
          ✓ Try something new — a class, a sport, a trail
        </Body>
      </Card>

      <Card
        delay={250}
        bg={`linear-gradient(135deg, ${PALETTE.springPeach}55 0%, ${PALETTE.sageLight}55 100%)`}
        style={{ gridColumn: "1 / -1", textAlign: "center" }}
        pad={48}
      >
        <Eyebrow color={accent}>Archetype</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={36}>The Creative Maiden</Display>
        <div style={{ height: 14 }} />
        <Body>
          Your mind is sharp, social, curious. Estrogen boosts serotonin and verbal fluency. You naturally want to connect, create, and begin. Start that project. Make that call. This is your season of yes.
        </Body>
        <div style={{ height: 24 }} />
        <Display size={24}>"I am blooming. New energy flows through me. I welcome fresh beginnings."</Display>
      </Card>
    </div>
  );
}

// ---- Ovulatory content ----

function OvulatoryContent() {
  const accent = PALETTE.goldenPollen;
  return (
    <div className="cs-grid">
      <Card delay={0}>
        <Eyebrow color={accent}>Today's Meditation</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={28}>Radiance & Presence</Display>
        <div style={{ height: 10 }} />
        <Body>
          You are at your most magnetic. This brief, powerful visualization helps you channel peak confidence, embody your full feminine power, and move through the world with ease.
        </Body>
        <div style={{ height: 14 }} />
        <YouTubeEmbed id="WmhCqjc6-Mo" />
      </Card>

      <Card delay={100}>
        <Eyebrow color={accent}>Vagus Practice</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={28}>Singing & Sound Bath Reset</Display>
        <div style={{ height: 10 }} />
        <Body>
          Your vagus nerve connects directly to your vocal cords. During ovulation — when your voice is literally at its most resonant — singing, chanting, or toning is the most powerful vagal activator of your cycle.
        </Body>
        <div style={{ height: 14 }} />
        <Body size={14}>
          <strong>1.</strong> Sit comfortably, spine upright<br />
          <strong>2.</strong> Inhale slowly (4 counts)<br />
          <strong>3.</strong> On exhale, hum or sing "MMMM" or "AUM"<br />
          <strong>4.</strong> Feel the vibration in your chest and throat<br />
          <strong>5.</strong> Repeat 6–8 times
        </Body>
        <div style={{ height: 14 }} />
        <YouTubeEmbed id="PBBjjimtxpo" />
        <div style={{ height: 10 }} />
        <MetaPill>🎵 432 Hz</MetaPill>
        <MetaPill>Parasympathetic Activation</MetaPill>
        <MetaPill>5 min</MetaPill>
      </Card>

      <Card delay={150}>
        <Eyebrow color={accent}>Nourish</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={26}>Foods for Your Peak</Display>
        <div style={{ height: 14 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          <FoodPill emoji="🥦" name="Cruciferous veg" why="Liver clears excess estrogen" />
          <FoodPill emoji="🐟" name="Salmon" why="Anti-inflammatory" />
          <FoodPill emoji="🥗" name="Big beautiful salads" why="Your best raw-food window" />
          <FoodPill emoji="🍒" name="Antioxidant fruits" why="Cherries, blueberries" />
          <FoodPill emoji="💧" name="Extra hydration" why="Estrogen peaks = water retention" />
        </div>
      </Card>

      <Card delay={200}>
        <Eyebrow color={accent}>Move</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={26}>Your Power Week — Go All In</Display>
        <div style={{ height: 14 }} />
        <Body>
          Testosterone peaks alongside estrogen. Muscle performance, pain tolerance, and motivation are at their highest.
        </Body>
        <div style={{ height: 12 }} />
        <Body>
          ✓ HIIT, interval training, heavy lifting<br />
          ✓ Rock climbing, cycling, competitive sport<br />
          ✓ Power yoga, vinyasa flow, aerial<br />
          ✓ Social workouts — group classes, tennis, dance
        </Body>
      </Card>

      <Card
        delay={250}
        bg={`linear-gradient(135deg, ${PALETTE.goldenPollen}55 0%, ${PALETTE.cream} 100%)`}
        style={{ gridColumn: "1 / -1", textAlign: "center" }}
        pad={48}
      >
        <Eyebrow color={accent}>Archetype</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={36}>The Luminous Queen</Display>
        <div style={{ height: 14 }} />
        <Body>
          You are seen. You are magnetic. Words flow. Connection comes naturally. This is the time for presentations, difficult conversations, dates, performances — anything requiring your full presence. The world receives you most openly right now.
        </Body>
        <div style={{ height: 24 }} />
        <Display size={24}>"I am radiant. I speak my truth with clarity and grace. I receive and give love fully."</Display>
      </Card>
    </div>
  );
}

// ---- Luteal content ----

function LutealContent({ unlocked }: { unlocked: boolean }) {
  const accent = PALETTE.dustyPlum;
  return (
    <div className="cs-grid">
      <Card delay={0}>
        <Eyebrow color={accent}>Today's Meditation</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={28}>Surrender & Self-Compassion</Display>
        <div style={{ height: 10 }} />
        <Body>
          As progesterone rises and serotonin dips, anxiety and irritability increase. This 15-minute somatic meditation uses body scanning and loving-kindness to soothe the nervous system and release pre-menstrual tension.
        </Body>
        <div style={{ height: 14 }} />
        <YouTubeEmbed id="QtltKD73vfI" />
      </Card>

      {/* HERO: Luteal Vagus Reset Protocol — extra large */}
      <Card
        delay={100}
        bg={`linear-gradient(135deg, ${PALETTE.dustyPlum}22 0%, ${PALETTE.cream} 100%)`}
        style={{ gridColumn: "1 / -1", position: "relative" }}
        pad={40}
      >
        <Eyebrow color={accent}>Vagus Practice · Premium Protocol</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={32}>The Luteal Vagus Reset Protocol</Display>
        <div style={{ height: 12 }} />
        <Body>
          The luteal phase is when your vagal tone is most vulnerable. Progesterone sensitizes your nervous system. This 3-part protocol is specifically designed for this phase.
        </Body>

        <div style={{ filter: unlocked ? "none" : "blur(6px)" }}>
          <div style={{ height: 24 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                step: "Step 1",
                title: "Extended Exhale Breathing",
                time: "5 min",
                body:
                  "Inhale 4 counts → Hold 1 → Exhale 7 counts. The extended exhale directly activates parasympathetic response. Slowing exhale lengthens RR interval, increasing HRV — the key marker of vagal tone.",
              },
              {
                step: "Step 2",
                title: "Cold Water Face Immersion",
                time: "1 min",
                body:
                  "Splash or submerge face in cold water. Triggers mammalian dive reflex → immediate vagal activation. Reduces cortisol within 30 seconds.",
              },
              {
                step: "Step 3",
                title: "Self-Neck Massage",
                time: "3 min",
                body:
                  "Gently massage the left side of neck along carotid artery. The vagus nerve runs directly beneath this area. Use gentle circular motions from jaw to collarbone.",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: 20,
                  border: `1px solid ${PALETTE.sageLight}`,
                  boxShadow: "0 4px 16px rgba(74,103,65,0.06)",
                }}
              >
                <Eyebrow color={accent}>{s.step} · {s.time}</Eyebrow>
                <div style={{ height: 8 }} />
                <Display size={22}>{s.title}</Display>
                <div style={{ height: 10 }} />
                <Body size={14}>{s.body}</Body>
              </div>
            ))}
          </div>

          <ScienceBox>
            🧬 "The vagus nerve is the single largest neural highway connecting brain to gut, regulating heartbeat, digestion, immunity, and mood. 75% of parasympathetic nerve fibers are vagal." <em>— Physiopedia / Cleveland Clinic</em>
          </ScienceBox>
          <div style={{ height: 14 }} />
          <YouTubeEmbed id="m7d2s0CEFPI" />
        </div>
        <PremiumLockOverlay unlocked={unlocked} />
      </Card>

      <Card delay={150}>
        <Eyebrow color={accent}>Nourish</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={26}>Comfort Meets Nourishment</Display>
        <div style={{ height: 14 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          <FoodPill emoji="🍠" name="Sweet potatoes" why="Stabilize blood sugar" />
          <FoodPill emoji="🥜" name="Magnesium nuts & seeds" why="Ease cramps, reduce anxiety" />
          <FoodPill emoji="🐚" name="Zinc foods" why="Regulate progesterone" />
          <FoodPill emoji="🍫" name="Dark chocolate (70%+)" why="Magnesium + mood lift" />
          <FoodPill emoji="🥑" name="Healthy fats" why="Support progesterone" />
          <FoodPill emoji="🍵" name="Chamomile & valerian" why="Calm nervous system" />
        </div>
        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: "#FFF6E6",
            borderLeft: `4px solid ${PALETTE.goldenPollen}`,
            borderRadius: 12,
          }}
        >
          <Body size={13}>
            ⚠️ Blood sugar stability is crucial in the luteal phase. Eat every 3–4 hours. Skipping meals significantly worsens PMS symptoms. Limit caffeine, alcohol, and salt.
          </Body>
        </div>
      </Card>

      <Card delay={200}>
        <Eyebrow color={accent}>Move</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={26}>Honor This Phase</Display>
        <div style={{ height: 14 }} />
        <Body>
          Energy is declining. Your body needs support, not punishment.
        </Body>
        <div style={{ height: 12 }} />
        <Body>
          ✓ Walks in nature (20–30 min, grounding)<br />
          ✓ Yin yoga & restorative stretches<br />
          ✓ Light pilates, swimming, barre<br />
          ✓ Somatic movement — dance freely, shake it out<br />
          ✗ Avoid: HIIT, heavy strength training, pushing through fatigue
        </Body>
      </Card>

      <Card
        delay={250}
        bg={`linear-gradient(135deg, ${PALETTE.dustyPlum}55 0%, ${PALETTE.cream} 100%)`}
        style={{ gridColumn: "1 / -1", textAlign: "center" }}
        pad={48}
      >
        <Eyebrow color={accent}>Archetype</Eyebrow>
        <div style={{ height: 10 }} />
        <Display size={36}>The Intuitive Priestess</Display>
        <div style={{ height: 14 }} />
        <Body>
          Your discernment is sharpest now. You see clearly what is and isn't working in your life. The irritability isn't a flaw — it's information. Create space for what your body is asking you to acknowledge and release before your next cycle.
        </Body>
        <div style={{ height: 24 }} />
        <Display size={24}>"I trust what I feel. I release what no longer serves me. I am preparing for renewal."</Display>
      </Card>
    </div>
  );
}

// ---------------- Vagus pathway SVG ----------------

function VagusPathwaySVG({ compact = false }: { compact?: boolean }) {
  const h = compact ? 360 : 600;
  return (
    <svg viewBox="0 0 400 600" style={{ width: "100%", maxWidth: 400, height: h, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="vagusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={PALETTE.sageLight} />
          <stop offset="50%" stopColor={PALETTE.sageMid} />
          <stop offset="100%" stopColor={PALETTE.sageDeep} />
        </linearGradient>
        <filter id="vagusGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* feminine silhouette */}
      <g fill="none" stroke={PALETTE.forest} strokeOpacity="0.25" strokeWidth="1.5">
        <ellipse cx="200" cy="80" rx="38" ry="44" />
        <path d="M162 122 Q200 140 238 122 L260 220 Q230 260 200 260 Q170 260 140 220 Z" />
        <path d="M150 250 Q200 280 250 250 L260 460 Q230 520 200 520 Q170 520 140 460 Z" />
      </g>

      {/* vagus pathway */}
      <path
        d="M200 100 Q210 140 200 180 Q190 220 205 260 Q220 300 195 340 Q175 380 205 420 Q215 460 200 500"
        stroke="url(#vagusGrad)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        filter="url(#vagusGlow)"
      />

      {/* labeled dots */}
      {[
        { x: 200, y: 100, label: "Brainstem" },
        { x: 200, y: 180, label: "Throat" },
        { x: 200, y: 260, label: "Heart" },
        { x: 200, y: 340, label: "Lungs" },
        { x: 200, y: 420, label: "Stomach" },
        { x: 200, y: 500, label: "Gut" },
      ].map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r={6} fill={PALETTE.sageDeep} />
          <text
            x={p.x + 18}
            y={p.y + 4}
            fontFamily="Karla, sans-serif"
            fontSize={12}
            fontWeight={700}
            fill={PALETTE.forest}
          >
            {p.label}
          </text>
        </g>
      ))}

      <text
        x="200"
        y="568"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontSize={18}
        fill={PALETTE.forest}
      >
        The Wandering Nerve
      </text>
    </svg>
  );
}

// ---------------- Section 3: Vagus Deep Dive ----------------

function VagusDeepDive() {
  return (
    <section
      style={{
        background: PALETTE.forest,
        padding: "96px 24px",
        color: "white",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <Eyebrow color={PALETTE.sageLight}>Premium Science Content</Eyebrow>
          <div style={{ height: 18 }} />
          <Display size={56} color="white">
            Your Vagus Nerve: The Body's Reset Button
          </Display>
          <div style={{ height: 16 }} />
          <Body size={18} color={PALETTE.sageLight}>
            The longest cranial nerve in your body. Your direct line from brain to gut. Your natural anxiety off-switch.
          </Body>
        </div>

        <div style={{ height: 56 }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              icon: "🧠",
              title: "The Wandering Nerve",
              body:
                "The vagus nerve (Latin: wanderer) runs from your brainstem through your throat, heart, lungs, and all the way to your gut. It is the main highway of your parasympathetic nervous system — responsible for 'rest, digest, and restore.' 75% of its fibers carry information FROM your body TO your brain.",
            },
            {
              icon: "🌊",
              title: "Hormones & Vagal Tone",
              body:
                "Your menstrual hormones directly affect vagal tone. Estrogen supports vagal activity. The progesterone drop before menstruation reduces vagal tone — making you more reactive to stress. This is why PMS and luteal anxiety feel so real: your nervous system is genuinely more activated.",
            },
            {
              icon: "✨",
              title: "Instant Reset Tools",
              body:
                "Humming & singing · Extended exhale breathing · Cold water face immersion · Gentle neck massage · Gargling with water · Eye movements (Hess exercise) · Loving-kindness meditation · 432Hz sound frequencies.",
            },
          ].map((c) => (
            <Card key={c.title} bg={PALETTE.sageWhisper} delay={0}>
              <div style={{ fontSize: 32 }}>{c.icon}</div>
              <div style={{ height: 10 }} />
              <Display size={24}>{c.title}</Display>
              <div style={{ height: 10 }} />
              <Body size={14}>{c.body}</Body>
            </Card>
          ))}
        </div>

        <div style={{ height: 56 }} />

        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <YouTubeEmbed id="Y_8mR_SsUnw" height={460} />
          <div style={{ height: 12 }} />
          <Body size={13} color={PALETTE.sageLight}>
            Watch: Clinically-backed vagus nerve reset techniques from Cleveland Clinic.
          </Body>
        </div>

        <div style={{ height: 56 }} />

        <Card bg={PALETTE.forest} border={PALETTE.sageMid} style={{ maxWidth: 480, margin: "0 auto" }} pad={28}>
          <div style={{ textAlign: "center" }}>
            <Eyebrow color={PALETTE.sageLight}>Anatomy</Eyebrow>
            <div style={{ height: 8 }} />
            <Display size={24} color="white">
              Your Vagus Nerve Pathway
            </Display>
          </div>
          <div style={{ height: 14 }} />
          <VagusPathwaySVG />
        </Card>
      </div>
    </section>
  );
}

// ---------------- Section 4: Cycle Wheel Tracker ----------------

function getPhaseFromDay(day: number, cycleLen: number): { phase: PhaseKey; description: string; nextIn: number } {
  // Scale phases proportionally for non-28 cycles, anchored to ovulation = ~14 days before next period.
  const menstrualEnd = Math.round((5 / 28) * cycleLen);
  const ovulationDay = cycleLen - 14;
  const follicularEnd = ovulationDay - 1;
  const ovulationEnd = ovulationDay + 2;

  if (day <= menstrualEnd) return { phase: "menstrual", description: "Rest · Release · Renew", nextIn: menstrualEnd - day + 1 };
  if (day <= follicularEnd) return { phase: "follicular", description: "Rise · Create · Begin", nextIn: follicularEnd - day + 1 };
  if (day <= ovulationEnd) return { phase: "ovulatory", description: "Radiate · Connect · Express", nextIn: ovulationEnd - day + 1 };
  return { phase: "luteal", description: "Settle · Discern · Prepare", nextIn: cycleLen - day + 1 };
}

function CycleWheelTracker({ onPhaseDetected }: { onPhaseDetected: (p: PhaseKey) => void }) {
  const [periodStart, setPeriodStart] = useState<string>("");
  const [cycleLen, setCycleLen] = useState<number>(28);
  const [result, setResult] = useState<{ day: number; phase: PhaseKey; description: string; nextIn: number } | null>(null);

  const submit = () => {
    if (!periodStart) return;
    const start = new Date(periodStart);
    const today = new Date();
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const day = ((diff % cycleLen) + cycleLen) % cycleLen + 1;
    const r = getPhaseFromDay(day, cycleLen);
    setResult({ day, ...r });
    onPhaseDetected(r.phase);
    setTimeout(() => {
      document.getElementById("phase-navigator")?.scrollIntoView({ behavior: "smooth" });
    }, 600);
  };

  // Build 4 arcs
  const arcs = useMemo(() => {
    const segments: { color: string; from: number; to: number; key: PhaseKey }[] = [];
    const menstrualEnd = Math.round((5 / 28) * cycleLen);
    const ovulationDay = cycleLen - 14;
    const follicularEnd = ovulationDay - 1;
    const ovulationEnd = ovulationDay + 2;
    segments.push({ color: PALETTE.blushRose, from: 1, to: menstrualEnd, key: "menstrual" });
    segments.push({ color: PALETTE.springPeach, from: menstrualEnd + 1, to: follicularEnd, key: "follicular" });
    segments.push({ color: PALETTE.goldenPollen, from: follicularEnd + 1, to: ovulationEnd, key: "ovulatory" });
    segments.push({ color: PALETTE.dustyPlum, from: ovulationEnd + 1, to: cycleLen, key: "luteal" });
    return segments;
  }, [cycleLen]);

  const angleFor = (d: number) => ((d - 1) / cycleLen) * 360 - 90;
  const polar = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arcPath = (from: number, to: number) => {
    const cx = 150, cy = 150, r = 110;
    const a1 = angleFor(from);
    const a2 = angleFor(to + 1);
    const p1 = polar(cx, cy, r, a1);
    const p2 = polar(cx, cy, r, a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`;
  };

  const currentDotPos = result ? polar(150, 150, 110, angleFor(result.day)) : null;

  return (
    <section style={{ padding: "96px 24px", background: PALETTE.sageWhisper }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <Eyebrow>Personalize</Eyebrow>
          <div style={{ height: 14 }} />
          <Display size={48}>Where Are You In Your Cycle?</Display>
          <div style={{ height: 14 }} />
          <Body>
            Enter the first day of your last period to unlock your personalized phase content.
          </Body>
        </div>

        <div style={{ height: 40 }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "center",
          }}
          className="cs-wheel-grid"
        >
          <Card bg="white">
            <Body weight={700} color={PALETTE.forest}>
              When did your last period start?
            </Body>
            <div style={{ height: 8 }} />
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: `1.5px solid ${PALETTE.sageLight}`,
                fontFamily: "Karla, sans-serif",
                fontSize: 15,
                color: PALETTE.forest,
                background: PALETTE.cream,
              }}
            />
            <div style={{ height: 18 }} />
            <Body weight={700} color={PALETTE.forest}>
              Cycle length: <span style={{ color: PALETTE.sageDeep }}>{cycleLen} days</span>
            </Body>
            <div style={{ height: 8 }} />
            <input
              type="range"
              min={21}
              max={35}
              value={cycleLen}
              onChange={(e) => setCycleLen(Number(e.target.value))}
              style={{ width: "100%", accentColor: PALETTE.sageDeep }}
            />
            <div style={{ height: 22 }} />
            <CTAButton onClick={submit}>Reveal My Phase →</CTAButton>
          </Card>

          <div style={{ position: "relative" }}>
            <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: 380, display: "block", margin: "0 auto" }}>
              {arcs.map((a) => (
                <path
                  key={a.key}
                  d={arcPath(a.from, a.to)}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={28}
                  strokeLinecap="butt"
                  opacity={result && result.phase === a.key ? 1 : 0.55}
                />
              ))}
              {currentDotPos && (
                <>
                  <circle cx={currentDotPos.x} cy={currentDotPos.y} r={14} fill="white" />
                  <circle
                    cx={currentDotPos.x}
                    cy={currentDotPos.y}
                    r={8}
                    fill={PHASES[result!.phase].color}
                    className="cs-pulse-dot"
                  />
                </>
              )}
              {/* center text */}
              {result && (
                <>
                  <text
                    x="150"
                    y="138"
                    textAnchor="middle"
                    fontFamily="Cormorant Garamond, serif"
                    fontStyle="italic"
                    fontSize={28}
                    fill={PALETTE.forest}
                  >
                    {PHASES[result.phase].label}
                  </text>
                  <text
                    x="150"
                    y="162"
                    textAnchor="middle"
                    fontFamily="Karla, sans-serif"
                    fontWeight={700}
                    fontSize={13}
                    fill={PALETTE.mutedSage}
                  >
                    Day {result.day} · {result.description}
                  </text>
                </>
              )}
              {!result && (
                <text
                  x="150"
                  y="158"
                  textAnchor="middle"
                  fontFamily="Cormorant Garamond, serif"
                  fontStyle="italic"
                  fontSize={22}
                  fill={PALETTE.mutedSage}
                >
                  Your Cycle
                </text>
              )}
            </svg>
            {result && (
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <Body size={14} color={PALETTE.mutedSage}>
                  Days until next phase: <strong style={{ color: PALETTE.sageDeep }}>{result.nextIn}</strong>
                </Body>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Section 5: Daily Rituals Checklist ----------------

function RitualChecklist() {
  const morning = [
    "Check your phase for today (2 min)",
    "Drink a glass of warm water with lemon",
    "Phase-specific breathwork or vagus reset (5 min)",
    "Set one intention aligned with your phase energy",
    "Eat a phase-supportive breakfast",
  ];
  const evening = [
    "Body scan or evening meditation (5–10 min)",
    "Journal one thing your body told you today",
    "Phase-appropriate herbal tea",
    "Log your mood, energy, and symptoms",
    "Tomorrow's phase preparation (if changing phases)",
  ];

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setChecked((c) => ({ ...c, [k]: !c[k] }));

  const renderList = (items: string[], prefix: string) =>
    items.map((t) => {
      const id = `${prefix}-${t}`;
      const isOn = !!checked[id];
      return (
        <button
          key={id}
          onClick={() => toggle(id)}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            width: "100%",
            textAlign: "left",
            padding: "12px 14px",
            background: isOn ? PALETTE.sageWhisper : "transparent",
            border: `1px solid ${isOn ? PALETTE.sageLight : "transparent"}`,
            borderRadius: 12,
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              border: `2px solid ${isOn ? PALETTE.sageDeep : PALETTE.sageMid}`,
              background: isOn ? PALETTE.sageDeep : "transparent",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {isOn ? "✓" : ""}
          </span>
          <span
            style={{
              fontFamily: "Karla, sans-serif",
              fontSize: 15,
              color: PALETTE.charcoal,
              textDecoration: isOn ? "line-through" : "none",
              opacity: isOn ? 0.65 : 1,
            }}
          >
            {t}
          </span>
        </button>
      );
    });

  return (
    <section style={{ padding: "96px 24px", background: PALETTE.cream }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
          <Eyebrow>Daily Practice</Eyebrow>
          <div style={{ height: 14 }} />
          <Display size={44}>Your Daily Cycle Ritual</Display>
          <div style={{ height: 12 }} />
          <Body>A gentle morning and evening practice to stay in sync all month.</Body>
        </div>
        <div style={{ height: 40 }} />
        <div className="cs-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <Card bg="white" border={PALETTE.sageLight}>
            <Display size={28}>Morning Ritual</Display>
            <div style={{ height: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{renderList(morning, "am")}</div>
          </Card>
          <Card bg="white" border={PALETTE.sageLight}>
            <Display size={28}>Evening Ritual</Display>
            <div style={{ height: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{renderList(evening, "pm")}</div>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ---------------- Section 6: Upgrade CTA ----------------

function UpgradeCTA() {
  return (
    <section
      style={{
        position: "relative",
        background: PALETTE.sageDeep,
        padding: "96px 24px",
        textAlign: "center",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Organic leaf pattern overlay */}
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12, pointerEvents: "none" }}
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 60 + 30} ${(i % 3) * 120 + 80} Q${i * 60 + 70} ${(i % 3) * 120 + 40}, ${i * 60 + 100} ${(i % 3) * 120 + 80} Q${i * 60 + 70} ${(i % 3) * 120 + 130}, ${i * 60 + 30} ${(i % 3) * 120 + 80} Z`}
            fill={PALETTE.sageLight}
          />
        ))}
      </svg>

      <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
        <Eyebrow color={PALETTE.goldenPollen}>Willow Plus</Eyebrow>
        <div style={{ height: 16 }} />
        <Display size={52} color="white">
          Unlock Your Complete Cycle Sanctuary
        </Display>
        <div style={{ height: 28 }} />

        <div style={{ display: "inline-block", textAlign: "left" }}>
          {[
            "Full vagus nerve reset audio library (12 guided sessions)",
            "Phase-specific guided meditations (28 total, one per day)",
            "Personalized cycle-based daily schedule",
            "Cycle journal with AI reflection prompts",
            "Hormone-balancing recipe library (100+ recipes)",
            "Live monthly Cycle Syncing workshop",
            "All 30+ WillowVibes features (sleep, breathwork, AI coach)",
          ].map((f) => (
            <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0" }}>
              <span style={{ color: PALETTE.goldenPollen, fontWeight: 700 }}>✓</span>
              <Body size={15} color="rgba(255,255,255,0.95)">
                {f}
              </Body>
            </div>
          ))}
        </div>

        <div style={{ height: 36 }} />
        <Display size={40} color="white">
          $12<span style={{ fontSize: 22, fontStyle: "normal", fontWeight: 400 }}>/month</span>
        </Display>
        <Body size={14} color={PALETTE.sageLight}>
          or $89/year (save 38%)
        </Body>
        <div style={{ height: 28 }} />
        <CTAButton bg={PALETTE.goldenPollen} color={PALETTE.forest} large onClick={() => (window.location.href = "/pricing")}>
          Start My 7-Day Free Trial →
        </CTAButton>
        <div style={{ height: 16 }} />
        <Body size={13} color="rgba(255,255,255,0.85)">
          🔒 Cancel anytime · No credit card required for trial · Loved by 50,000+ women
        </Body>
      </div>
    </section>
  );
}

// ---------------- Section 7: Testimonials ----------------

function Testimonials() {
  const items = [
    {
      quote: "The cycle syncing feature completely changed how I relate to my body. I used to fight my luteal phase. Now I honor it.",
      name: "Sarah M.",
      meta: "Verified Willow Plus Member",
      tag: "🌙 Luteal Phase Lover",
    },
    {
      quote: "The vagus nerve reset for my period cramps was LIFE-CHANGING. I do the 5-minute humming meditation and the pain eases within minutes.",
      name: "Priya K.",
      meta: "3 months on Willow Plus",
      tag: "🩸 Menstrual Phase",
    },
    {
      quote: "I finally understand why I feel invincible some weeks and completely depleted others. This app gave me the language AND the tools.",
      name: "Emma L.",
      meta: "Cycle Syncing since 2024",
      tag: "✨ Ovulatory Phase Devotee",
    },
  ];
  return (
    <section style={{ padding: "96px 24px", background: PALETTE.sageWhisper }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
          <Eyebrow>Loved by Members</Eyebrow>
          <div style={{ height: 14 }} />
          <Display size={44}>Real Women, Real Rhythm</Display>
        </div>
        <div style={{ height: 40 }} />
        <div
          className="cs-testi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((t) => (
            <div
              key={t.name}
              style={{
                background: PALETTE.cream,
                borderRadius: 20,
                borderLeft: `4px solid ${PALETTE.sageMid}`,
                padding: 26,
                boxShadow: "0 4px 24px rgba(74,103,65,0.08)",
              }}
            >
              <div style={{ color: PALETTE.goldenPollen, fontSize: 16, letterSpacing: 2 }}>★★★★★</div>
              <div style={{ height: 12 }} />
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 19,
                  lineHeight: 1.5,
                  color: PALETTE.forest,
                  margin: 0,
                }}
              >
                "{t.quote}"
              </p>
              <div style={{ height: 18 }} />
              <Body size={14} color={PALETTE.forest} weight={700}>
                {t.name}
              </Body>
              <Body size={12} color={PALETTE.mutedSage}>
                {t.meta}
              </Body>
              <div style={{ height: 8 }} />
              <MetaPill>{t.tag}</MetaPill>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Page composition ----------------

export default function CycleSyncingPage() {
  const [active, setActive] = useState<PhaseKey>("menstrual");
  // Treat all users as unlocked here; the gate is purely visual aspiration.
  // To re-introduce a real gate, swap in useIsPremium().
  const unlocked = true;

  useEffect(() => {
    // Inject Google Fonts once for Cormorant Garamond + Karla.
    const id = "cs-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Karla:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = "Cycle Syncing — Live in Sync With Your Hormones | WillowVibes";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div style={{ background: PALETTE.cream, color: PALETTE.charcoal, minHeight: "100vh" }}>

      <style>{`
        @keyframes csFadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cs-fade {
          opacity: 0;
          animation: csFadeInUp 0.7s ease forwards;
        }
        @keyframes csPulseRing {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .cs-pulse-dot {
          transform-origin: center;
          transform-box: fill-box;
          animation: csPulseRing 1.8s ease-out infinite;
        }
        .cs-tabs::-webkit-scrollbar { display: none; }
        .cs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .cs-grid { grid-template-columns: 1fr !important; }
          .cs-wheel-grid { grid-template-columns: 1fr !important; }
          .cs-hero-title { font-size: 42px !important; }
          .cs-floating-badge { right: 16px !important; bottom: 16px !important; max-width: 220px !important; padding: 14px !important; }
        }
        @media (max-width: 600px) {
          .cs-hero { min-height: 70vh !important; padding: 90px 20px 60px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-fade { animation: none; opacity: 1; }
          .cs-pulse-dot { animation: none; }
        }
      `}</style>

      <HeroSection />

      {/* Section 2 — Phase Navigator */}
      <section id="phase-navigator" style={{ padding: "96px 24px 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <Eyebrow>The Four Phases</Eyebrow>
            <div style={{ height: 14 }} />
            <Display size={48}>Your Cycle, Honored</Display>
            <div style={{ height: 14 }} />
            <Body>Tap a phase to enter its complete sanctuary — meditation, nervous system practice, nutrition, movement, and archetype.</Body>
          </div>

          <div style={{ height: 40 }} />
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: `${PALETTE.cream}f0`,
              backdropFilter: "blur(8px)",
              paddingTop: 8,
              marginBottom: 24,
            }}
          >
            <PhaseTabs active={active} onChange={setActive} />
          </div>

          <PhaseHeader phase={PHASES[active]} />

          <div style={{ height: 32 }} />

          {active === "menstrual" && <MenstrualContent unlocked={unlocked} />}
          {active === "follicular" && <FollicularContent />}
          {active === "ovulatory" && <OvulatoryContent />}
          {active === "luteal" && <LutealContent unlocked={unlocked} />}
        </div>
      </section>

      <VagusDeepDive />
      <CycleWheelTracker onPhaseDetected={setActive} />
      <RitualChecklist />
      <UpgradeCTA />
      <Testimonials />
    </div>
  );
}
