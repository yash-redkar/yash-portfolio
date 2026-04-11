import { playMoveSound, playCaptureSound } from './sound.js';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

let boardEl = null;
let squares = {};
let pieceElements = []; 

function squareToCoords(sq) {
  return { col: FILES.indexOf(sq[0]), row: RANKS.indexOf(sq[1]) };
}


export function renderBoard() {
  boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const sq = document.createElement('div');
      const name = FILES[f] + RANKS[r];
      const isLight = (r + f) % 2 === 0;
      sq.className = `square ${isLight ? 'light' : 'dark'}`;
      sq.dataset.square = name;
      if (r === 7) { const l = document.createElement('span'); l.className = 'coord coord-file'; l.textContent = FILES[f]; sq.appendChild(l); }
      if (f === 0) { const l = document.createElement('span'); l.className = 'coord coord-rank'; l.textContent = RANKS[r]; sq.appendChild(l); }
      boardEl.appendChild(sq);
      squares[name] = sq;
    }
  }
}


export function setPosition(positionData) {
  pieceElements.forEach(p => p.el.remove());
  pieceElements = [];
  positionData.forEach((p, i) => {
    _createPiece(p.piece, p.square, p.color, `${p.color}-${p.piece}-${i}`);
  });
}

function _createPiece(piece, square, color, id) {
  const { col, row } = squareToCoords(square);
  const el = document.createElement('div');
  el.className = `piece ${color}-piece`;
  el.textContent = piece;
  el.dataset.pieceId = id;
  el.style.left = `${col * 12.5}%`;
  el.style.top = `${row * 12.5}%`;
  el.style.width = '12.5%';
  el.style.height = '12.5%';
  boardEl.appendChild(el);
  const entry = { el, piece, square, color, id };
  pieceElements.push(entry);
  return entry;
}




export async function playMoveSequence(moves, msPerMove = 100) {
  boardEl.classList.add('pieces-sliding');
  for (let i = 0; i < moves.length; i++) {
    await _animateSingleMove(moves[i], msPerMove);
  }
  boardEl.classList.remove('pieces-sliding');
  
  pieceElements.forEach(pe => { pe.el.style.transition = ''; });
}

async function _animateSingleMove(move, duration) {
  return new Promise(resolve => {
    const slideDur = Math.max(duration * 0.8, 40);

    
    if (move.capturedSquare) {
      const capIdx = pieceElements.findIndex(pe => pe.square === move.capturedSquare);
      if (capIdx >= 0) {
        const cap = pieceElements[capIdx];
        cap.el.style.transition = `opacity ${slideDur * 0.5}ms ease, transform ${slideDur * 0.5}ms ease`;
        cap.el.style.opacity = '0';
        cap.el.style.transform = 'scale(0.4)';
        setTimeout(() => cap.el.remove(), slideDur * 0.6);
        pieceElements.splice(capIdx, 1);
      }
    }

    
    const entry = pieceElements.find(pe => pe.square === move.from);
    if (entry) {
      const to = squareToCoords(move.to);
      entry.el.classList.add('sliding');
      entry.el.style.transition = `left ${slideDur}ms var(--ease-out-expo), top ${slideDur}ms var(--ease-out-expo)`;
      entry.el.style.left = `${to.col * 12.5}%`;
      entry.el.style.top = `${to.row * 12.5}%`;
      entry.square = move.to;

      
      if (move.promotion) {
        setTimeout(() => {
          entry.piece = move.promotion.char;
          entry.el.textContent = move.promotion.char;
        }, slideDur * 0.7);
      }
      
      if (move.capturedSquare) {
        playCaptureSound();
      } else {
        playMoveSound();
      }
    }

    
    if (move.castleRookFrom && move.castleRookTo) {
      const rook = pieceElements.find(pe => pe.square === move.castleRookFrom);
      if (rook) {
        const rookTo = squareToCoords(move.castleRookTo);
        rook.el.classList.add('sliding');
        rook.el.style.transition = `left ${slideDur}ms var(--ease-out-expo), top ${slideDur}ms var(--ease-out-expo)`;
        rook.el.style.left = `${rookTo.col * 12.5}%`;
        rook.el.style.top = `${rookTo.row * 12.5}%`;
        rook.square = move.castleRookTo;
      }
    }

    
    setTimeout(() => {
      if (entry) {
        entry.el.classList.remove('sliding');
        entry.el.style.transition = '';
      }
      resolve();
    }, duration);
  });
}




export async function playMoveSequenceReverse(moves, msPerMove = 100) {
  boardEl.classList.add('pieces-sliding');
  for (let i = moves.length - 1; i >= 0; i--) {
    await _animateSingleMoveReverse(moves[i], msPerMove);
  }
  boardEl.classList.remove('pieces-sliding');
  pieceElements.forEach(pe => { pe.el.style.transition = ''; });
}

async function _animateSingleMoveReverse(move, duration) {
  return new Promise(resolve => {
    const slideDur = Math.max(duration * 0.8, 40);

    
    const entry = pieceElements.find(pe => pe.square === move.to);
    if (entry) {
      
      if (move.promotion) {
        entry.piece = move.pieceChar; 
        entry.el.textContent = move.pieceChar;
      }

      const fromCoords = squareToCoords(move.from);
      entry.el.classList.add('sliding');
      entry.el.style.transition = `left ${slideDur}ms var(--ease-out-expo), top ${slideDur}ms var(--ease-out-expo)`;
      entry.el.style.left = `${fromCoords.col * 12.5}%`;
      entry.el.style.top = `${fromCoords.row * 12.5}%`;
      entry.square = move.from;
    }

    
    if (move.castleRookFrom && move.castleRookTo) {
      const rook = pieceElements.find(pe => pe.square === move.castleRookTo);
      if (rook) {
        const rookOriginal = squareToCoords(move.castleRookFrom);
        rook.el.classList.add('sliding');
        rook.el.style.transition = `left ${slideDur}ms var(--ease-out-expo), top ${slideDur}ms var(--ease-out-expo)`;
        rook.el.style.left = `${rookOriginal.col * 12.5}%`;
        rook.el.style.top = `${rookOriginal.row * 12.5}%`;
        rook.square = move.castleRookFrom;
      }
    }

    
    if (move.capturedSquare && move.capturedChar) {
      setTimeout(() => {
        const restored = _createPiece(
          move.capturedChar,
          move.capturedSquare,
          move.capturedColor,
          `restored-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        );
        restored.el.style.opacity = '0';
        restored.el.style.transform = 'scale(0.3)';
        requestAnimationFrame(() => {
          restored.el.style.transition = `opacity ${slideDur * 0.5}ms ease, transform ${slideDur * 0.5}ms ease`;
          restored.el.style.opacity = '1';
          restored.el.style.transform = 'scale(1)';
        });
      }, slideDur * 0.2);
    }

    
    if (move.capturedSquare) {
      playCaptureSound();
    } else {
      playMoveSound();
    }

    
    setTimeout(() => {
      if (entry) {
        entry.el.classList.remove('sliding');
        entry.el.style.transition = '';
      }
      resolve();
    }, duration);
  });
}


export function setTilt(phase) {
  if (!boardEl) return;
  boardEl.classList.remove('tilt-0', 'tilt-1', 'tilt-2', 'tilt-3');
  boardEl.classList.add(`tilt-${phase}`);
}

export function setLayout(layout) {
  const wrapper = document.getElementById('board-wrapper');
  wrapper.classList.remove('layout-center', 'layout-left', 'layout-right', 'layout-center-small');
  wrapper.classList.add(`layout-${layout}`);
}

export function setFloating(floating) {
  const wrapper = document.getElementById('board-wrapper');
  wrapper.classList.toggle('floating', floating);
}

export function getSquares() {
  return squares;
}
