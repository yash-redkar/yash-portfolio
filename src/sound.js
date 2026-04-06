/* ===========================
   Sound System (Audio Pool)
   =========================== */

let soundEnabled = true;
let audioUnlocked = false;

/**
 * SoundPool class
 * Manages multiple Audio instances for the same file to allow overlapping playback.
 */
class SoundPool {
  constructor(src, size = 5) {
    this.src = src;
    this.size = size;
    this.pool = [];
    this.current = 0;

    // Lazy initialize pool on first use
    for (let i = 0; i < size; i++) {
      const audio = new Audio(src);
      audio.preload = "auto";
      this.pool.push(audio);
    }
  }

  play() {
    if (!soundEnabled) return;

    const audio = this.pool[this.current];
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Silently catch browser autoplay prevention
    });

    this.current = (this.current + 1) % this.size;
  }
}

// Initialize pools for common sounds
const pools = {
  move: new SoundPool("/sounds/Move.mp3", 8),
  capture: new SoundPool("/sounds/Capture.mp3", 5),
  check: new SoundPool("/sounds/Check.mp3", 2),
  gameEnd: new SoundPool("/sounds/Victory.mp3", 1),
  vanish: new SoundPool("/sounds/Draw.mp3", 1),
};

/**
 * Toggle sound on/off
 */
export function toggleSound() {
  soundEnabled = !soundEnabled;

  // "Unlock" audio on the first user gesture
  if (!audioUnlocked && soundEnabled) {
    Object.values(pools).forEach((p) => {
      p.pool.forEach((a) => {
        a.play()
          .then(() => {
            a.pause();
            a.currentTime = 0;
          })
          .catch(() => {});
      });
    });
    audioUnlocked = true;
  }

  const btn = document.getElementById("sound-toggle");
  if (btn) btn.classList.toggle("active", soundEnabled);
  return soundEnabled;
}

/**
 * Check if sound is enabled
 */
export function isSoundEnabled() {
  return soundEnabled;
}

/**
 * Play a standard chess piece move sound
 */
export function playMoveSound() {
  pools.move.play();
}

/**
 * Play a chess piece capture sound
 */
export function playCaptureSound() {
  pools.capture.play();
}

/**
 * Export playPlaceSound for backward compatibility with board.js/phases.js
 */
export function playPlaceSound() {
  playMoveSound();
}

/**
 * Play rapid piece flurry (fast forward)
 */
export function playFlurrySound() {
  if (!soundEnabled) return;
  // Flurry is now handled by the pool automatically!
  for (let i = 0; i < 4; i++) {
    setTimeout(() => playMoveSound(), i * 60);
  }
}

/**
 * Play piece vanish/dissolve sound
 */
export function playVanishSound() {
  pools.vanish.play();
}

/**
 * Play clock press sound
 */
export function playClockSound() {
  playMoveSound();
}

/**
 * Play subtle hover lift sound
 */
export function playHoverSound() {
  // Silent or very subtle (requires dedicated asset)
}
