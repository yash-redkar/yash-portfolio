

const PIECE_UNICODE = {
  w: { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙' },
  b: { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' },
};

export class ChessEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.board = this._createInitialBoard();
    this.turn = 'w';
    this.enPassantSquare = null;
  }

  _createInitialBoard() {
    const b = Array.from({ length: 8 }, () => Array(8).fill(null));
    const back = ['R','N','B','Q','K','B','N','R'];
    for (let c = 0; c < 8; c++) {
      b[0][c] = { type: back[c], color: 'b' }; 
      b[1][c] = { type: 'P', color: 'b' };      
      b[6][c] = { type: 'P', color: 'w' };      
      b[7][c] = { type: back[c], color: 'w' }; 
    }
    return b;
  }

  _sqToRC(sq) {
    return { r: 8 - parseInt(sq[1]), c: sq.charCodeAt(0) - 97 };
  }

  _rcToSq(r, c) {
    return String.fromCharCode(97 + c) + (8 - r);
  }

  _at(sq) {
    const { r, c } = this._sqToRC(sq);
    return this.board[r][c];
  }

  _set(sq, piece) {
    const { r, c } = this._sqToRC(sq);
    this.board[r][c] = piece;
  }

  
  _parseAlgebraic(moveStr) {
    moveStr = moveStr.replace(/[+#!?]/g, '');
    if (moveStr === 'O-O') return { castle: 'king' };
    if (moveStr === 'O-O-O') return { castle: 'queen' };

    let promotion = null;
    if (moveStr.includes('=')) {
      const parts = moveStr.split('=');
      promotion = parts[1];
      moveStr = parts[0];
    }

    const isCapture = moveStr.includes('x');
    moveStr = moveStr.replace('x', '');

    
    const toRank = moveStr[moveStr.length - 1];
    const toFile = moveStr[moveStr.length - 2];
    const prefix = moveStr.slice(0, -2);

    let pieceType, disambigFile = null, disambigRank = null;

    if (prefix.length === 0) {
      pieceType = 'P';
    } else if (prefix[0] >= 'A' && prefix[0] <= 'Z') {
      pieceType = prefix[0];
      const rest = prefix.slice(1);
      if (rest.length === 1) {
        if (rest[0] >= 'a' && rest[0] <= 'h') disambigFile = rest[0];
        else disambigRank = rest[0];
      } else if (rest.length === 2) {
        disambigFile = rest[0];
        disambigRank = rest[1];
      }
    } else {
      pieceType = 'P';
      disambigFile = prefix[0];
    }

    return { pieceType, disambigFile, disambigRank, isCapture, toSquare: toFile + toRank, promotion };
  }

  
  executeMove(moveStr) {
    const parsed = this._parseAlgebraic(moveStr);
    let result;

    if (parsed.castle) {
      result = this._executeCastle(parsed.castle);
    } else {
      result = this._executeNormal(parsed);
    }

    this.turn = this.turn === 'w' ? 'b' : 'w';
    return result;
  }

  _executeCastle(side) {
    const rank = this.turn === 'w' ? '1' : '8';
    const kingFrom = `e${rank}`;
    const kingTo = side === 'king' ? `g${rank}` : `c${rank}`;
    const rookFrom = side === 'king' ? `h${rank}` : `a${rank}`;
    const rookTo = side === 'king' ? `f${rank}` : `d${rank}`;

    const king = this._at(kingFrom);
    const rook = this._at(rookFrom);
    this._set(kingFrom, null);
    this._set(rookFrom, null);
    this._set(kingTo, king);
    this._set(rookTo, rook);
    this.enPassantSquare = null;

    const color = this.turn === 'w' ? 'white' : 'black';
    return {
      from: kingFrom, to: kingTo,
      pieceChar: PIECE_UNICODE[this.turn]['K'], color,
      capturedSquare: null, capturedChar: null, capturedColor: null,
      castleRookFrom: rookFrom, castleRookTo: rookTo,
      rookChar: PIECE_UNICODE[this.turn]['R'],
      promotion: null,
    };
  }

  _executeNormal(parsed) {
    const { pieceType, disambigFile, disambigRank, toSquare, promotion } = parsed;
    const color = this.turn;
    const from = this._findSource(pieceType, color, toSquare, disambigFile, disambigRank);
    if (!from) throw new Error(`No source for ${JSON.stringify(parsed)} turn=${color}`);

    const piece = this._at(from);
    const target = this._at(toSquare);
    let capturedSquare = null;
    let capturedChar = null;
    let capturedColor = null;

    if (target) {
      capturedSquare = toSquare;
      capturedChar = PIECE_UNICODE[target.color][target.type];
      capturedColor = target.color === 'w' ? 'white' : 'black';
    } else if (pieceType === 'P' && parsed.isCapture) {
      
      if (this.enPassantSquare === toSquare) {
        const { r, c } = this._sqToRC(toSquare);
        const epRow = color === 'w' ? r + 1 : r - 1;
        capturedSquare = this._rcToSq(epRow, c);
        const epPiece = this._at(capturedSquare);
        if (epPiece) {
          capturedChar = PIECE_UNICODE[epPiece.color][epPiece.type];
          capturedColor = epPiece.color === 'w' ? 'white' : 'black';
        }
        this._set(capturedSquare, null);
      }
    }

    this._set(from, null);
    if (promotion) {
      this._set(toSquare, { type: promotion, color });
    } else {
      this._set(toSquare, piece);
    }

    
    if (pieceType === 'P') {
      const fr = this._sqToRC(from);
      const tr = this._sqToRC(toSquare);
      if (Math.abs(fr.r - tr.r) === 2) {
        this.enPassantSquare = this._rcToSq((fr.r + tr.r) / 2, fr.c);
      } else {
        this.enPassantSquare = null;
      }
    } else {
      this.enPassantSquare = null;
    }

    const sideColor = color === 'w' ? 'white' : 'black';
    return {
      from, to: toSquare,
      pieceChar: PIECE_UNICODE[color][pieceType], color: sideColor,
      capturedSquare, capturedChar, capturedColor,
      castleRookFrom: null, castleRookTo: null, rookChar: null,
      promotion: promotion ? { char: PIECE_UNICODE[color][promotion], color: sideColor } : null,
    };
  }

  
  _findSource(pieceType, color, toSquare, disambigFile, disambigRank) {
    const to = this._sqToRC(toSquare);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (!p || p.color !== color || p.type !== pieceType) continue;
        const sq = this._rcToSq(r, c);
        if (disambigFile && sq[0] !== disambigFile) continue;
        if (disambigRank && sq[1] !== disambigRank) continue;
        if (this._canReach(pieceType, r, c, to.r, to.c, color)) return sq;
      }
    }
    return null;
  }

  _canReach(type, fr, fc, tr, tc, color) {
    switch (type) {
      case 'P': return this._pawnReach(fr, fc, tr, tc, color);
      case 'N': { const dr = Math.abs(fr-tr), dc = Math.abs(fc-tc); return (dr===2&&dc===1)||(dr===1&&dc===2); }
      case 'B': return Math.abs(fr-tr)===Math.abs(fc-tc) && this._pathClear(fr,fc,tr,tc);
      case 'R': return (fr===tr||fc===tc) && this._pathClear(fr,fc,tr,tc);
      case 'Q': return ((fr===tr||fc===tc)||(Math.abs(fr-tr)===Math.abs(fc-tc))) && this._pathClear(fr,fc,tr,tc);
      case 'K': return Math.abs(fr-tr)<=1 && Math.abs(fc-tc)<=1;
      default: return false;
    }
  }

  _pawnReach(fr, fc, tr, tc, color) {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    if (fc === tc) {
      if (tr === fr + dir && !this.board[tr][tc]) return true;
      if (fr === startRow && tr === fr + 2*dir && !this.board[fr+dir][tc] && !this.board[tr][tc]) return true;
    }
    if (Math.abs(fc - tc) === 1 && tr === fr + dir) {
      if (this.board[tr][tc] && this.board[tr][tc].color !== color) return true;
      if (this.enPassantSquare === this._rcToSq(tr, tc)) return true;
    }
    return false;
  }

  _pathClear(fr, fc, tr, tc) {
    const dr = Math.sign(tr - fr), dc = Math.sign(tc - fc);
    let r = fr + dr, c = fc + dc;
    while (r !== tr || c !== tc) {
      if (this.board[r][c]) return false;
      r += dr; c += dc;
    }
    return true;
  }

  
  getPositionArray() {
    const pieces = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p) {
          pieces.push({
            piece: PIECE_UNICODE[p.color][p.type],
            square: this._rcToSq(r, c),
            color: p.color === 'w' ? 'white' : 'black',
          });
        }
      }
    }
    return pieces;
  }
}


export function parseNotation(notation) {
  return notation.trim().split(/\s+/).filter(t => !/^\d+\.$/.test(t));
}
