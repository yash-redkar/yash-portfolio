/* ===========================
   Game Data — Parses game.json through ChessEngine
   Pre-computes all moves and phase boundary snapshots
   =========================== */

import { ChessEngine, parseNotation } from './chess-engine.js';
import gameData from './game.json';

// Phase boundaries (full move numbers → half-move indices)
// Phase 0: Starting position
// Phase 1: After move 8  (half-move 16)
// Phase 2: After move 23 (half-move 46)
// Phase 3: After move 50 (half-move 100)
// Phase 4: End of game, move 65 (half-move 130)
const PHASE_HALF_MOVES = [0, 16, 46, 100, 130];

// Parse the full game notation into individual move strings
const allMoveStrings = parseNotation(gameData.notation);

// Run the entire game through the engine, collecting:
// 1. Animation data for every move
// 2. Board snapshots at phase boundaries
const engine = new ChessEngine();
const allMoves = [];           // animation data per half-move
const phaseSnapshots = [];     // board position array at each phase boundary

// Snapshot at move 0 (starting position)
phaseSnapshots.push(engine.getPositionArray());

let snapshotIdx = 1; // next snapshot to take

for (let i = 0; i < allMoveStrings.length; i++) {
  const moveData = engine.executeMove(allMoveStrings[i]);
  allMoves.push(moveData);

  // Check if we've reached a phase boundary
  if (snapshotIdx < PHASE_HALF_MOVES.length && (i + 1) === PHASE_HALF_MOVES[snapshotIdx]) {
    phaseSnapshots.push(engine.getPositionArray());
    snapshotIdx++;
  }
}

// If game ends before all phase boundaries, snapshot the final position
while (phaseSnapshots.length < PHASE_HALF_MOVES.length) {
  phaseSnapshots.push(engine.getPositionArray());
}

/**
 * Get the sequence of moves to play for a phase transition
 * @param {number} fromPhase - current phase (0-3)
 * @param {number} toPhase - target phase (0-3), must be > fromPhase
 * @returns {Array} slice of allMoves for animation
 */
export function getMovesForTransition(fromPhase, toPhase) {
  const startHM = PHASE_HALF_MOVES[fromPhase];
  const endHM = Math.min(PHASE_HALF_MOVES[toPhase], allMoves.length);
  return allMoves.slice(startHM, endHM);
}

/**
 * Get the stored board snapshot for a phase
 * @param {number} phase - phase index (0-3)
 * @returns {Array} position array for setPosition()
 */
export function getPhaseSnapshot(phase) {
  return phaseSnapshots[phase];
}

/**
 * Build notation summary strings for display during transitions
 */
export function getNotationForTransition(fromPhase, toPhase) {
  const startHM = PHASE_HALF_MOVES[fromPhase];
  const endHM = Math.min(PHASE_HALF_MOVES[toPhase], allMoveStrings.length);
  const moves = allMoveStrings.slice(startHM, endHM);

  // Show first few and last few moves
  if (moves.length <= 8) {
    return _formatMoves(moves, startHM);
  }
  const first = moves.slice(0, 4);
  const last = moves.slice(-4);
  return _formatMoves(first, startHM) + ' ... ' + _formatMoves(last, startHM + moves.length - 4);
}

function _formatMoves(moves, startHM) {
  let s = '';
  for (let i = 0; i < moves.length; i++) {
    const hm = startHM + i;
    const moveNum = Math.floor(hm / 2) + 1;
    if (hm % 2 === 0) s += `${moveNum}. `;
    s += moves[i] + ' ';
  }
  return s.trim();
}

// Export for phases.js
export { phaseSnapshots, allMoves, PHASE_HALF_MOVES };
