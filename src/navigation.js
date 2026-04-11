

let navNodes = [];


export function initNavigation(onPhaseClick) {
  navNodes = document.querySelectorAll('.nav-node');

  navNodes.forEach(node => {
    node.addEventListener('click', () => {
      const phase = parseInt(node.dataset.phase, 10);
      if (!isNaN(phase)) {
        onPhaseClick(phase);
      }
    });
  });
}


export function updateNavigation(currentPhase) {
  navNodes.forEach(node => {
    const phase = parseInt(node.dataset.phase, 10);
    node.classList.remove('active', 'completed');

    if (phase === currentPhase) {
      node.classList.add('active');
    } else if (phase < currentPhase) {
      node.classList.add('completed');
    }
  });
}
