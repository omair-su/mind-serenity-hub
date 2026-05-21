// Index of all multi-day wellness mini-programs.
import type { MiniProgram } from "./types";
import { VAGUS_NERVE_RESET } from "./vagusNerveReset";
import { BOX_BREATHING_ATHLETES } from "./boxBreathingAthletes";
import { GRIEF_COMPANION } from "./griefCompanion";
import { ADHD_FOCUS_STACK } from "./adhdFocusStack";
import { CYCLE_SYNC } from "./cycleSync";
import { SOUND_FREQUENCY_THERAPY } from "./soundFrequencyTherapy";
import { RITUAL_PACK } from "./ritualPack";

export const ALL_PROGRAMS: MiniProgram[] = [
  VAGUS_NERVE_RESET,
  BOX_BREATHING_ATHLETES,
  GRIEF_COMPANION,
  ADHD_FOCUS_STACK,
  CYCLE_SYNC,
  SOUND_FREQUENCY_THERAPY,
  RITUAL_PACK,
];

export function getProgramById(id: string): MiniProgram | undefined {
  return ALL_PROGRAMS.find((p) => p.id === id);
}

export {
  VAGUS_NERVE_RESET,
  BOX_BREATHING_ATHLETES,
  GRIEF_COMPANION,
  ADHD_FOCUS_STACK,
  CYCLE_SYNC,
  SOUND_FREQUENCY_THERAPY,
  RITUAL_PACK,
};
