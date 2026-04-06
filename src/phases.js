/* ===========================
   Phase State Machine & Transition Orchestrator
   Uses move-by-move fast-forward for forward transitions
   Uses instant snapshots for backward transitions
   =========================== */

import { getMovesForTransition, getPhaseSnapshot, getNotationForTransition } from './positions.js';
import { setPosition, playMoveSequence, playMoveSequenceReverse, setTilt, setLayout, setFloating, getSquares } from './board.js';
import { updateNavigation } from './navigation.js';
import { applyHeatmap, removeHeatmap } from './content.js';
import { playPlaceSound, playFlurrySound, playVanishSound, playClockSound } from './sound.js';

let currentPhase = 0;
let transitioning = false;
const TOTAL_PHASES = 5;

// Layout + tilt config per phase
const phaseConfig = {
  0: { layout: 'center', tilt: 0, floating: true },
  1: { layout: 'left', tilt: 1, floating: false },
  2: { layout: 'right', tilt: 2, floating: false },
  3: { layout: 'center-small', tilt: 3, floating: false },
  4: { layout: 'center-small', tilt: 3, floating: false },
};

// ms per half-move during fast-forward (shorter = faster scrub)
const phaseSpeed = {
  1: 90,   // Opening: 16 moves × 90ms ≈ 1.4s
  2: 65,   // Middlegame: 30 moves × 65ms ≈ 2.0s
  3: 40,   // Endgame: 54 moves × 40ms ≈ 2.2s
  4: 35,   // Game Over: 30 moves × 35ms ≈ 1.1s
};

export function getCurrentPhase() { return currentPhase; }
export function isTransitioning() { return transitioning; }

/**
 * Go to a specific phase
 */
export async function goToPhase(targetPhase) {
  if (transitioning) return;
  if (targetPhase < 0 || targetPhase >= TOTAL_PHASES) return;
  if (targetPhase === currentPhase) return;

  transitioning = true;
  const fromPhase = currentPhase;
  const goingForward = targetPhase > fromPhase;
  const config = phaseConfig[targetPhase];

  // Hide scroll hint
  const hint = document.getElementById('scroll-hint');
  if (hint) { hint.classList.remove('visible'); hint.classList.add('hidden'); }

  // Sound
  if (goingForward) {
    if (targetPhase === 1) playPlaceSound();
    else if (targetPhase === 2) playFlurrySound();
    else if (targetPhase === 3 || targetPhase === 4) playVanishSound();
  }

  // Remove heatmap if leaving phase 3
  if (fromPhase === 3) removeHeatmap(getSquares());

  // Fade out current content
  const currentContent = document.getElementById(`phase-${fromPhase}`);
  if (currentContent) currentContent.classList.remove('active');

  // Update board layout and tilt
  setLayout(config.layout);
  setTilt(targetPhase);
  setFloating(config.floating);

  // Board transition
  if (goingForward) {
    // Forward: play every move in the game between the two phase boundaries
    const moves = getMovesForTransition(fromPhase, targetPhase);
    const speed = phaseSpeed[targetPhase] || 60;

    // Show notation
    showNotation(targetPhase, getNotationForTransition(fromPhase, targetPhase));

    await playMoveSequence(moves, speed);
  } else {
    // Backward: rewind moves in reverse order
    const moves = getMovesForTransition(targetPhase, fromPhase);
    const speed = phaseSpeed[fromPhase] || 60;

    await playMoveSequenceReverse(moves, speed);
  }

  // Apply heatmap on phase 3
  if (targetPhase === 3) {
    setTimeout(() => applyHeatmap(getSquares()), 300);
  }

  // Fade in new content
  const newContent = document.getElementById(`phase-${targetPhase}`);
  if (newContent) newContent.classList.add('active');

  // Update nav
  updateNavigation(targetPhase);

  if (targetPhase === 3 || targetPhase === 4) setTimeout(() => playClockSound(), 200);

  currentPhase = targetPhase;
  setTimeout(() => { transitioning = false; }, 300);
}

export function nextPhase() {
  if (currentPhase < TOTAL_PHASES - 1) goToPhase(currentPhase + 1);
}

export function prevPhase() {
  if (currentPhase > 0) goToPhase(currentPhase - 1);
}

function showNotation(phase, text) {
  const el = document.getElementById(`notation-${phase}`);
  if (!el) return;
  el.textContent = text;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 4000);
}

/** Initialize Phase 0 */
export function initPhases() {
  setPosition(getPhaseSnapshot(0));
  setTilt(0);
  setLayout('center');
  setFloating(true);
  updateNavigation(0);
}
