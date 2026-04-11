

import { ChessEngine, parseNotation } from './chess-engine.js';
import gameData from './game.json';







const PHASE_HALF_MOVES = [0, 16, 46, 100, 130];


const allMoveStrings = parseNotation(gameData.notation);




const engine = new ChessEngine();
const allMoves = [];           
const phaseSnapshots = [];     


phaseSnapshots.push(engine.getPositionArray());

let snapshotIdx = 1; 

for (let i = 0; i < allMoveStrings.length; i++) {
  const moveData = engine.executeMove(allMoveStrings[i]);
  allMoves.push(moveData);

  
  if (snapshotIdx < PHASE_HALF_MOVES.length && (i + 1) === PHASE_HALF_MOVES[snapshotIdx]) {
    phaseSnapshots.push(engine.getPositionArray());
    snapshotIdx++;
  }
}


while (phaseSnapshots.length < PHASE_HALF_MOVES.length) {
  phaseSnapshots.push(engine.getPositionArray());
}


export function getMovesForTransition(fromPhase, toPhase) {
  const startHM = PHASE_HALF_MOVES[fromPhase];
  const endHM = Math.min(PHASE_HALF_MOVES[toPhase], allMoves.length);
  return allMoves.slice(startHM, endHM);
}


export function getPhaseSnapshot(phase) {
  return phaseSnapshots[phase];
}


export function getNotationForTransition(fromPhase, toPhase) {
  const startHM = PHASE_HALF_MOVES[fromPhase];
  const endHM = Math.min(PHASE_HALF_MOVES[toPhase], allMoveStrings.length);
  const moves = allMoveStrings.slice(startHM, endHM);

  
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


export { phaseSnapshots, allMoves, PHASE_HALF_MOVES };
