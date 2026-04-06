import { useState, useCallback } from "react";
import { SOUND_DEFINITIONS, SOUND_PRESETS, startSound, stopSound, setVolume, stopAllSounds, isPlaying } from "@/lib/soundEngine";
import { Volume2, VolumeX, X, ChevronUp, ChevronDown, Sparkles } from "lucide-react";

export default function SoundMixer() {
  const [open, setOpen] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setActiveSounds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        stopSound(id);
        next.delete(id);
      } else {
        const vol = volumes[id] ?? 0.4;
        startSound(id, vol);
        next.add(id);
        setVolumes(v => ({ ...v, [id]: vol }));
      }
      return next;
    });
  }, [volumes]);

  const changeVolume = useCallback((id: string, val: number) => {
    setVolumes(v => ({ ...v, [id]: val }));
    if (isPlaying(id)) setVolume(id, val);
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    stopAllSounds();
    const preset = SOUND_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    const newActive = new Set<string>();
    const newVols: Record<string, number> = {};
    preset.sounds.forEach(s => {
      startSound(s.id, s.volume);
      newActive.add(s.id);
      newVols[s.id] = s.volume;
    });
    setActiveSounds(newActive);
    setVolumes(prev => ({ ...prev, ...newVols }));
  }, []);

  const stopAll = useCallback(() => {
    stopAllSounds();
    setActiveSounds(new Set());
  }, []);

  const hasActive = activeSounds.size > 0;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-elevated flex items-center justify-center transition-all duration-300 ${
          hasActive
            ? "bg-primary text-primary-foreground animate-pulse hover:animate-none"
            : "bg-card border border-border text-foreground hover:bg-secondary"
        }`}
        aria-label="Sound Mixer"
      >
        {hasActive ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-h-[70vh] bg-card border border-border rounded-2xl shadow-elevated overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">Ambient Sounds</h3>
              <p className="text-[10px] font-body text-muted-foreground">Layer sounds for your perfect atmosphere</p>
            </div>
            <div className="flex items-center gap-2">
              {hasActive && (
                <button onClick={stopAll} className="text-xs font-body text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-secondary">
                  Stop All
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-secondary">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
            <div className="p-3">
              <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">Quick Presets</p>
              <div className="grid grid-cols-2 gap-1.5">
                {SOUND_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-secondary/60 transition-colors"
                  >
                    <span className="text-lg">{preset.icon}</span>
                    <div>
                      <p className="text-xs font-body font-medium text-foreground leading-tight">{preset.name}</p>
                      <p className="text-[9px] font-body text-muted-foreground">{preset.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="willow-divider mx-3" />

            <div className="p-3">
              <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">Individual Sounds</p>
              <div className="space-y-1">
                {SOUND_DEFINITIONS.map(sound => {
                  const active = activeSounds.has(sound.id);
                  const vol = volumes[sound.id] ?? 0.4;
                  return (
                    <div key={sound.id} className={`rounded-xl p-2 transition-colors ${active ? "bg-primary/5" : ""}`}>
                      <button
                        onClick={() => toggle(sound.id)}
                        className="w-full flex items-center gap-3"
                      >
                        <span className="text-lg w-7 text-center">{sound.icon}</span>
                        <span className={`flex-1 text-left text-sm font-body ${active ? "text-primary font-medium" : "text-foreground"}`}>
                          {sound.name}
                        </span>
                        {active && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      </button>
                      {active && (
                        <div className="flex items-center gap-2 mt-1.5 ml-10">
                          <VolumeX className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={vol}
                            onChange={(e) => changeVolume(sound.id, parseFloat(e.target.value))}
                            className="flex-1 h-1 accent-primary"
                          />
                          <Volume2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
