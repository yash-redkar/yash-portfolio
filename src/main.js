/* ===========================
   Main Entry Point
   =========================== */

import { renderBoard } from "./board.js";
import { initPhases } from "./phases.js";
import { initContent } from "./content.js";
import { initNavigation } from "./navigation.js";
import { initScrollHandling } from "./scroll.js";
import { isSoundEnabled, toggleSound } from "./sound.js";
import { goToPhase } from "./phases.js";

// Initialize everything on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // 1. Render the chess board
  renderBoard();

  // 2. Initialize content (populate dynamic HTML)
  initContent();

  // 3. Set up navigation strip with click handler
  initNavigation((phase) => {
    goToPhase(phase);
  });

  // 4. Initialize phase 0
  initPhases();

  // 5. Set up scroll/keyboard/touch handling
  initScrollHandling();

  // 6. Sound toggle
  const soundBtn = document.getElementById("sound-toggle");
  if (soundBtn) {
    soundBtn.classList.toggle("active", isSoundEnabled());
    soundBtn.addEventListener("click", () => {
      toggleSound();
    });
  }

  // 7. Interactive Background Parallax
  document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    const parallaxElems = document.querySelectorAll(".parallax");
    parallaxElems.forEach((el) => {
      const depth = el.getAttribute("data-depth") || 0.1;
      el.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px) rotate(${el.classList.contains("k-ghost") ? "15deg" : "-15deg"})`;
    });
  });
});
