

let soundEnabled = true;
let audioUnlocked = false;


class SoundPool {
  constructor(src, size = 5) {
    this.src = src;
    this.size = size;
    this.pool = [];
    this.current = 0;

    
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
      
    });

    this.current = (this.current + 1) % this.size;
  }
}


const pools = {
  move: new SoundPool("/sounds/Move.mp3", 8),
  capture: new SoundPool("/sounds/Capture.mp3", 5),
  check: new SoundPool("/sounds/Check.mp3", 2),
  gameEnd: new SoundPool("/sounds/Victory.mp3", 1),
  vanish: new SoundPool("/sounds/Draw.mp3", 1),
};


export function toggleSound() {
  soundEnabled = !soundEnabled;

  
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


export function isSoundEnabled() {
  return soundEnabled;
}


export function playMoveSound() {
  pools.move.play();
}


export function playCaptureSound() {
  pools.capture.play();
}


export function playPlaceSound() {
  playMoveSound();
}


export function playFlurrySound() {
  if (!soundEnabled) return;
  
  for (let i = 0; i < 4; i++) {
    setTimeout(() => playMoveSound(), i * 60);
  }
}


export function playVanishSound() {
  pools.vanish.play();
}


export function playClockSound() {
  playMoveSound();
}


export function playHoverSound() {
  
}
