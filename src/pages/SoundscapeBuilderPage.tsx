import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  Music, Plus, Save, Trash2, Play, Pause, Volume2, Sparkles,
  ChevronRight, Copy, Download, Share2, Zap, Wind, Heart, Brain
} from "lucide-react";
import { SOUND_DEFINITIONS, SOUND_PRESETS } from "@/lib/soundEngine";
import {
  createCustomSoundscape,
  playSoundscape,
  getSavedSoundscapes,
  deleteSoundscape,
  exportSoundscape,
  getAllPremiumSoundscapes,
  getRecommendedSoundscapes,
} from "@/lib/advancedSoundEngine";

export default function SoundscapeBuilderPage() {
  const [soundscapeName, setSoundscapeName] = useState("");
  const [selectedSounds, setSelectedSounds] = useState<{ id: string; volume: number }[]>([]);
  const [reverbLevel, setReverbLevel] = useState(0.3);
  const [delayLevel, setDelayLevel] = useState(0.2);
  const [spatialWidth, setSpatialWidth] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedSoundscapes, setSavedSoundscapes] = useState(getAllPremiumSoundscapes());
  const [activeTab, setActiveTab] = useState<'builder' | 'presets' | 'saved'>('builder');

  const handleAddSound = (soundId: string) => {
    if (!selectedSounds.find(s => s.id === soundId)) {
      setSelectedSounds([...selectedSounds, { id: soundId, volume: 0.5 }]);
    }
  };

  const handleRemoveSound = (soundId: string) => {
    setSelectedSounds(selectedSounds.filter(s => s.id !== soundId));
  };

  const handleVolumeChange = (soundId: string, volume: number) => {
    setSelectedSounds(selectedSounds.map(s =>
      s.id === soundId ? { ...s, volume } : s
    ));
  };

  const handleSaveSoundscape = async () => {
    if (!soundscapeName || selectedSounds.length === 0) {
      return;
    }

    const soundscape = await createCustomSoundscape(
      soundscapeName,
      selectedSounds,
      { reverb: reverbLevel, delay: delayLevel, spatialWidth }
    );

    setSavedSoundscapes(getAllPremiumSoundscapes());
    setSoundscapeName("");
    setSelectedSounds([]);
    // In a real app, we'd use a toast here for a premium feel
  };

  const handlePlaySoundscape = (soundscapeId: string) => {
    const soundscape = savedSoundscapes.find(s => s.id === soundscapeId);
    if (soundscape) {
      playSoundscape(soundscape);
      setIsPlaying(true);
    }
  };

  const handleDeleteSoundscape = (soundscapeId: string) => {
    if (confirm("Are you sure you want to delete this soundscape?")) {
      deleteSoundscape(soundscapeId);
      setSavedSoundscapes(getAllPremiumSoundscapes());
    }
  };

  const handleExportSoundscape = (soundscapeId: string) => {
    const json = exportSoundscape(soundscapeId);
    if (json) {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `soundscape-${soundscapeId}.json`;
      a.click();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* ── Hero Section ── */}
        <div className="relative overflow-hidden rounded-2xl shadow-elevated bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-indigo-500/10 border border-border/50">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/10 blur-3xl" />
          <div className="relative p-8 sm:p-12">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">
                  Premium Soundscape Builder
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Create personalized ambient soundscapes with binaural frequencies and spatial audio effects. Mix and match sounds to craft your perfect meditation environment.
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/15 flex items-center justify-center flex-shrink-0">
                <Music className="w-8 h-8 text-violet-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 border-b border-border/50">
          {[
            { id: 'builder', label: 'Builder', icon: Sparkles },
            { id: 'presets', label: 'Presets', icon: Music },
            { id: 'saved', label: 'My Soundscapes', icon: Heart },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-body font-medium text-sm border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Builder Tab ── */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Sound Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Available Sounds */}
              <div className="bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Available Sounds</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SOUND_DEFINITIONS.map(sound => (
                    <button
                      key={sound.id}
                      onClick={() => handleAddSound(sound.id)}
                      disabled={selectedSounds.some(s => s.id === sound.id)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        selectedSounds.some(s => s.id === sound.id)
                          ? 'bg-primary/20 border border-primary/50 opacity-50'
                          : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-border/50 hover:border-primary/50 hover:bg-emerald-500/15'
                      }`}
                    >
                      <div className="text-2xl mb-1">{sound.icon}</div>
                      <div className="text-xs font-body font-medium text-foreground">{sound.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Sounds & Volume Control */}
              {selectedSounds.length > 0 && (
                <div className="bg-gradient-to-br from-gold/5 via-card to-amber-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Sound Mix</h3>
                  <div className="space-y-4">
                    {selectedSounds.map(sound => {
                      const soundDef = SOUND_DEFINITIONS.find(s => s.id === sound.id);
                      return (
                        <div key={sound.id} className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-body font-medium text-foreground">
                                {soundDef?.icon} {soundDef?.name}
                              </span>
                              <span className="text-xs text-muted-foreground">{Math.round(sound.volume * 100)}%</span>
                            </div>
                    <Slider
                      value={[sound.volume]}
                      onValueChange={([v]) => handleVolumeChange(sound.id, v)}
                      min={0}
                      max={1}
                      step={0.05}
                      className="w-full h-6"
                    />
                          </div>
                          <button
                            onClick={() => handleRemoveSound(sound.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Effects & Save */}
            <div className="space-y-6">
              {/* Effects */}
              <div className="bg-gradient-to-br from-rose-500/5 via-card to-pink-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Effects</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-body font-medium text-foreground">Reverb</label>
                      <span className="text-xs text-muted-foreground">{Math.round(reverbLevel * 100)}%</span>
                    </div>
                    <Slider
                      value={[reverbLevel]}
                      onValueChange={([v]) => setReverbLevel(v)}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-body font-medium text-foreground">Delay</label>
                      <span className="text-xs text-muted-foreground">{Math.round(delayLevel * 100)}%</span>
                    </div>
                    <Slider
                      value={[delayLevel]}
                      onValueChange={([v]) => setDelayLevel(v)}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-body font-medium text-foreground">Spatial Width</label>
                      <span className="text-xs text-muted-foreground">{Math.round(spatialWidth * 100)}%</span>
                    </div>
                    <Slider
                      value={[spatialWidth]}
                      onValueChange={([v]) => setSpatialWidth(v)}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                  </div>
                </div>
              </div>

              {/* Save Section */}
              <div className="bg-gradient-to-br from-primary/5 via-card to-sage/5 rounded-2xl p-6 border border-border/50 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Save Soundscape</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Soundscape name..."
                    value={soundscapeName}
                    onChange={(e) => setSoundscapeName(e.target.value)}
                    className="font-body text-sm"
                  />
                  <Button
                    onClick={handleSaveSoundscape}
                    disabled={!soundscapeName || selectedSounds.length === 0}
                    className="w-full bg-gradient-to-r from-primary to-sage hover:opacity-90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Soundscape
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Presets Tab ── */}
        {activeTab === 'presets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOUND_PRESETS.map(preset => (
              <Card
                key={preset.id}
                className="bg-gradient-to-br from-violet-500/5 via-card to-purple-500/5 border border-border/50 p-5 hover:shadow-card transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-2xl mb-2">{preset.icon}</div>
                    <h4 className="font-display font-semibold text-foreground">{preset.name}</h4>
                    <p className="text-xs text-muted-foreground">{preset.category}</p>
                  </div>
                  <Zap className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  {preset.sounds.length} sounds mixed
                </div>
                <Button
                  onClick={() => handlePlaySoundscape(preset.id)}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 text-white"
                  size="sm"
                >
                  <Play className="w-3 h-3 mr-2" />
                  Play
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* ── Saved Tab ── */}
        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedSoundscapes.filter(s => s.isPremium && s.category === 'Custom').length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Music className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground font-body">No custom soundscapes yet. Create one in the Builder tab!</p>
              </div>
            ) : (
              savedSoundscapes
                .filter(s => s.isPremium && s.category === 'Custom')
                .map(soundscape => (
                  <Card
                    key={soundscape.id}
                    className="bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 border border-border/50 p-5 hover:shadow-card transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-display font-semibold text-foreground">{soundscape.name}</h4>
                        <p className="text-xs text-muted-foreground">{soundscape.sounds.length} sounds</p>
                      </div>
                      <Heart className="w-5 h-5 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">{soundscape.description}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handlePlaySoundscape(soundscape.id)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white"
                        size="sm"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Play
                      </Button>
                      <Button
                        onClick={() => handleExportSoundscape(soundscape.id)}
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteSoundscape(soundscape.id)}
                        variant="outline"
                        size="sm"
                        className="px-3 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
