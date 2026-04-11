import { nextPhase, prevPhase, goToPhase, isTransitioning } from "./phases.js";

let scrollCooldown = false;
const COOLDOWN_MS = 1200;
const SWIPE_THRESHOLD = 60;

let touchStartY = 0;
let touchStartX = 0;



let boundaryHitCount = 0;
let boundaryHitTimer = null;
const BOUNDARY_HIT_THRESHOLD = 2; 
const BOUNDARY_RESET_MS = 800;    

export function initScrollHandling() {
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });
}

function handleWheel(e) {
  
  e.preventDefault();

  if (scrollCooldown || isTransitioning()) return;

  const scrollingDown = e.deltaY > 20;
  const scrollingUp   = e.deltaY < -20;

  
  if (!scrollingDown && !scrollingUp) return;

  
  
  
  const scrollable = e.target.closest(".content-panel");

  if (scrollable) {
    const maxScroll = scrollable.scrollHeight - scrollable.clientHeight;

    if (maxScroll > 0) {
      const atTop    = scrollable.scrollTop <= 0;
      const atBottom = scrollable.scrollTop >= maxScroll - 1;

      
      const canScrollMore = scrollingDown ? !atBottom : !atTop;
      if (canScrollMore) {
        scrollable.scrollTop += e.deltaY;
        resetBoundaryHit(); 
        return;
      }

      
      
      boundaryHitCount++;
      clearTimeout(boundaryHitTimer);
      boundaryHitTimer = setTimeout(resetBoundaryHit, BOUNDARY_RESET_MS);

      if (boundaryHitCount < BOUNDARY_HIT_THRESHOLD) return;
    }
  }

  
  resetBoundaryHit();
  if (scrollingDown) {
    nextPhase();
    startCooldown();
  } else if (scrollingUp) {
    prevPhase();
    startCooldown();
  }
}

function resetBoundaryHit() {
  boundaryHitCount = 0;
  clearTimeout(boundaryHitTimer);
  boundaryHitTimer = null;
}

function handleKeydown(e) {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (isTransitioning()) return;

  switch (e.key) {
    case "ArrowDown":
    case " ":
      e.preventDefault();
      nextPhase();
      break;
    case "ArrowUp":
      e.preventDefault();
      prevPhase();
      break;
    case "1":
      goToPhase(0);
      break;
    case "2":
      goToPhase(1);
      break;
    case "3":
      goToPhase(2);
      break;
    case "4":
      goToPhase(3);
      break;
    case "5":
      goToPhase(4);
      break;
  }
}

function handleTouchStart(e) {
  touchStartY = e.changedTouches[0].screenY;
  touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
  if (isTransitioning()) return;

  const touch = e.changedTouches[0];
  const deltaY = touchStartY - touch.screenY;
  const deltaX = touchStartX - touch.screenX;

  if (
    Math.abs(deltaY) > Math.abs(deltaX) &&
    Math.abs(deltaY) > SWIPE_THRESHOLD
  ) {
    
    const scrollable = e.target.closest(".content-panel");

    if (scrollable) {
      const maxScroll = scrollable.scrollHeight - scrollable.clientHeight;
      if (maxScroll > 0) {
        const atTop    = scrollable.scrollTop <= 0;
        const atBottom = scrollable.scrollTop >= maxScroll - 1;
        
        if (deltaY > 0 && !atBottom) return;
        if (deltaY < 0 && !atTop) return;
      }
    }

    if (deltaY > 0) {
      nextPhase();
    } else {
      prevPhase();
    }
  }
}

function startCooldown() {
  scrollCooldown = true;
  setTimeout(() => {
    scrollCooldown = false;
  }, COOLDOWN_MS);
}
