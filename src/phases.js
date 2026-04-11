

import { getMovesForTransition, getPhaseSnapshot, getNotationForTransition } from './positions.js';
import { setPosition, playMoveSequence, playMoveSequenceReverse, setTilt, setLayout, setFloating, getSquares } from './board.js';
import { updateNavigation } from './navigation.js';
import { applyHeatmap, removeHeatmap } from './content.js';
import { playPlaceSound, playFlurrySound, playVanishSound, playClockSound } from './sound.js';

let currentPhase = 0;
let transitioning = false;
const TOTAL_PHASES = 5;


const phaseConfig = {
  0: { layout: 'center', tilt: 0, floating: true },
  1: { layout: 'left', tilt: 1, floating: false },
  2: { layout: 'right', tilt: 2, floating: false },
  3: { layout: 'center-small', tilt: 3, floating: false },
  4: { layout: 'center-small', tilt: 3, floating: false },
};


const phaseSpeed = {
  1: 90,   
  2: 65,   
  3: 40,   
  4: 35,   
};

export function getCurrentPhase() { return currentPhase; }
export function isTransitioning() { return transitioning; }


export async function goToPhase(targetPhase) {
  if (transitioning) return;
  if (targetPhase < 0 || targetPhase >= TOTAL_PHASES) return;
  if (targetPhase === currentPhase) return;

  transitioning = true;
  const fromPhase = currentPhase;
  const goingForward = targetPhase > fromPhase;
  const config = phaseConfig[targetPhase];

  
  const hint = document.getElementById('scroll-hint');
  if (hint) { hint.classList.remove('visible'); hint.classList.add('hidden'); }

  
  if (goingForward) {
    if (targetPhase === 1) playPlaceSound();
    else if (targetPhase === 2) playFlurrySound();
    else if (targetPhase === 3 || targetPhase === 4) playVanishSound();
  }

  
  if (fromPhase === 3) removeHeatmap(getSquares());

  
  const currentContent = document.getElementById(`phase-${fromPhase}`);
  if (currentContent) currentContent.classList.remove('active');

  
  setLayout(config.layout);
  setTilt(targetPhase);
  setFloating(config.floating);

  
  if (goingForward) {
    
    const moves = getMovesForTransition(fromPhase, targetPhase);
    const speed = phaseSpeed[targetPhase] || 60;

    
    showNotation(targetPhase, getNotationForTransition(fromPhase, targetPhase));

    await playMoveSequence(moves, speed);
  } else {
    
    const moves = getMovesForTransition(targetPhase, fromPhase);
    const speed = phaseSpeed[fromPhase] || 60;

    await playMoveSequenceReverse(moves, speed);
  }

  
  if (targetPhase === 3) {
    setTimeout(() => applyHeatmap(getSquares()), 300);
  }

  
  const newContent = document.getElementById(`phase-${targetPhase}`);
  if (newContent) newContent.classList.add('active');

  
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


export function initPhases() {
  setPosition(getPhaseSnapshot(0));
  setTilt(0);
  setLayout('center');
  setFloating(true);
  updateNavigation(0);
}
