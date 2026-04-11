

import { renderBoard } from "./board.js";
import { initPhases } from "./phases.js";
import { initContent } from "./content.js";
import { initNavigation } from "./navigation.js";
import { initScrollHandling } from "./scroll.js";
import { isSoundEnabled, toggleSound } from "./sound.js";
import { goToPhase } from "./phases.js";


document.addEventListener("DOMContentLoaded", () => {
  
  renderBoard();

  
  initContent();

  
  initNavigation((phase) => {
    goToPhase(phase);
  });

  
  initPhases();

  
  initScrollHandling();

  
  const soundBtn = document.getElementById("sound-toggle");
  if (soundBtn) {
    soundBtn.classList.toggle("active", isSoundEnabled());
    soundBtn.addEventListener("click", () => {
      toggleSound();
    });
  }

  
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
