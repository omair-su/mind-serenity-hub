import { useEffect, useRef, useState } from "react";
import { Music, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { AmbientTrack, REAL_AMBIENT_TRACKS } from "@/lib/realAmbientTracks";

interface Props {
  /** Default track to autoload (not autoplay — autoplay needs a user gesture) */
  defaultTrack: AmbientTrack;
  /** Show the track-picker dropdown */
  allowSwitch?: boolean;
  className?: string;
}

/**
 * Lightweight, premium-feeling ambient music player.
 * Uses real royalty-free MP3s. Loops automatically. User-gesture starts playback.
 */
export default function AmbientMusicPlayer({ defaultTrack, allowSwitch = true, className = "" }: Props) {
  const [track, setTrack] = useState<AmbientTrack>(defaultTrack);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialise / swap source
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.preload = "metadata";
    }
    const a = audioRef.current;
    if (a.src !== track.url) {
      const wasPlaying = playing;
      a.src = track.url;
      a.load();
      if (wasPlaying) void a.play().catch(() => setPlaying(false));
    }
    a.volume = muted ? 0 : volume;
    return () => {
      // Note: do NOT pause here — keeps music going during state updates
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  // Volume changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // hard stop, not just pause
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <div className={`relative rounded-2xl border border-[hsl(var(--gold))]/20 bg-gradient-to-br from-[hsl(var(--forest))]/5 via-card to-[hsl(var(--gold))]/5 p-4 shadow-[var(--shadow-soft-val)] ${className}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center shadow-md hover:scale-105 transition-transform flex-shrink-0"
          aria-label={playing ? "Pause ambient music" : "Play ambient music"}
        >
          {playing ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{track.emoji}</span>
            <p className="font-display text-sm font-semibold text-foreground truncate">{track.name}</p>
            <span className="text-[10px] font-body text-muted-foreground/70 hidden sm:inline">· Real audio</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMuted(!muted)} className="text-muted-foreground hover:text-foreground" aria-label="Toggle mute">
              {muted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <Slider
              value={[muted ? 0 : volume * 100]}
              onValueChange={(v) => {
                setVolume(v[0] / 100);
                if (muted) setMuted(false);
              }}
              max={100}
              step={1}
              className="flex-1"
              aria-label="Ambient volume"
            />
          </div>
        </div>

        {allowSwitch && (
          <button
            onClick={() => setShowPicker((s) => !s)}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Switch ambient track"
            aria-expanded={showPicker}
          >
            <Music className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-[10px] font-body text-muted-foreground/60 mt-2 text-right">{track.credit}</p>

      {showPicker && (
        <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {REAL_AMBIENT_TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTrack(t);
                setShowPicker(false);
              }}
              className={`p-2 rounded-lg text-left transition-all ${
                t.id === track.id
                  ? "bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/40"
                  : "bg-secondary/50 hover:bg-secondary border border-transparent"
              }`}
            >
              <div className="text-lg">{t.emoji}</div>
              <p className="text-[11px] font-body font-semibold text-foreground truncate">{t.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
