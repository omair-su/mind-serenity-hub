// React binding for the module-level globalPlayer.
import { useSyncExternalStore } from "react";
import { player, playerStore, formatTime } from "@/lib/globalPlayer";

export function usePlayer() {
  const state = useSyncExternalStore(playerStore.subscribe, playerStore.getSnapshot, playerStore.getSnapshot);
  return {
    ...state,
    play: player.play,
    togglePlayPause: player.togglePlayPause,
    seek: player.seek,
    setExpanded: player.setExpanded,
    close: player.close,
    formatTime,
  };
}
