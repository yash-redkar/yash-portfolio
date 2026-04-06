/* ===========================
   Content Renderer
   Populates all dynamic content into the DOM
   =========================== */

import { personalData, skills, projects, experience, contactLinks, heatmapData } from './data.js';

/**
 * Initialize all content across all phases
 */
export function initContent() {
  renderPhase0();
  renderPhase1();
  renderPhase2();
  renderPhase3();
  setupTabs();
  setupContactForm();
  setupScrollArrows();
  observePhaseActivation();
}

/* ---------- Phase 0: Hero ---------- */
function renderPhase0() {
  // Content is mostly in HTML; just set up the scroll hint timer
  setTimeout(() => {
    const hint = document.getElementById('scroll-hint');
    if (hint && hint.classList.contains('hidden')) {
      hint.classList.remove('hidden');
      hint.classList.add('visible');
    }
  }, 2500);
}

/* ---------- Phase 1: About & Skills ---------- */
function renderPhase1() {
  // Bio
  const bioEl = document.getElementById('player-bio');
  if (bioEl) bioEl.textContent = personalData.bio;

  // Skills
  const container = document.getElementById('skills-container');
  if (!container) return;

  const depthIcons = {
    deep: '🟡',
    solid: '🟢',
    studying: '⚪',
  };
  const depthLabels = {
    deep: 'expert / strong',
    solid: 'comfortable',
    studying: 'learning',
  };

  skills.forEach(line => {
    const lineEl = document.createElement('div');
    lineEl.className = 'skill-line';

    const nameEl = document.createElement('div');
    nameEl.className = 'skill-line-name';
    nameEl.textContent = line.line;
    lineEl.appendChild(nameEl);

    const itemsEl = document.createElement('div');
    itemsEl.className = 'skill-items';

    line.items.forEach(item => {
      const tag = document.createElement('div');
      tag.className = 'skill-item';
      tag.innerHTML = `
        <span class="skill-depth" title="${depthLabels[item.depth]}">${depthIcons[item.depth]}</span>
        <span>${item.name}</span>
      `;
      itemsEl.appendChild(tag);
    });

    lineEl.appendChild(itemsEl);
    container.appendChild(lineEl);
  });
}

/* ---------- Phase 2: Projects & Experience ---------- */
function renderPhase2() {
  renderProjects();
  renderExperience();
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  projects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const stackStr = proj.stack.map((t, i) =>
      i < proj.stack.length - 1 ? `${t} <span class="arrow">→</span> ` : t
    ).join('');

    card.innerHTML = `
      <div class="project-header">
        <span class="project-name">${proj.name}</span>
      </div>

      <p class="project-desc">${proj.desc}</p>

      <div class="project-stack">${stackStr}</div>

      <div class="project-links">
        <a href="${proj.liveUrl}" class="project-link" target="_blank" rel="noopener">
          Live Demo
        </a>
        <a href="${proj.repoUrl}" class="project-link" target="_blank" rel="noopener">
          Source Code
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}

function renderExperience() {
  const log = document.getElementById('experience-log');
  if (!log) return;

    // Reverse to show most recent first
  [...experience].reverse().forEach(role => {
    const round = document.createElement('div');
    round.className = 'exp-round';

    const annotationsHTML = role.annotations ? role.annotations.map(a => `
      <div class="exp-annotation">
        <span class="annotation-symbol">${a.symbol}</span>
        <span>${a.text}</span>
      </div>
    `).join('') : '';

    round.innerHTML = `
      <div class="exp-round-header">${role.period}</div>
      <div class="exp-company">
        ${role.company}
        <div class="engine-bar">
          <div class="engine-bar-fill" style="width: ${role.barFill}%"></div>
        </div>
      </div>
      <div class="exp-title">${role.title}</div>
      <div class="exp-venue">${role.venue}</div>
      <div class="exp-annotations">${annotationsHTML}</div>
    `;

    log.appendChild(round);
  });
}

/* ---------- Phase 3: Contact & Connect ---------- */
function renderPhase3() {
  renderScoresheet();
}

function renderScoresheet() {
  const container = document.getElementById('scoresheet-links');
  if (!container) return;

  contactLinks.forEach((link, i) => {
    const row = document.createElement('a');
    row.className = 'scoresheet-row';
    row.href = link.url;
    row.target = '_blank';
    row.rel = 'noopener';
    row.innerHTML = `
      <span class="scoresheet-move-num">${i + 1}.</span>
      <span><span class="scoresheet-icon">${link.icon}</span> ${link.label}</span>
      <span class="scoresheet-response">${link.response}</span>
    `;
    container.appendChild(row);
  });
}

/* ---------- Tabs ---------- */
function setupTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      // Update buttons
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update contents
      const allContents = document.querySelectorAll('.tab-content');
      allContents.forEach(tc => {
        tc.classList.remove('active');
        tc.style.display = 'none'; // Force display none for exact certainty
      });
      
      const target = document.getElementById(`tab-${tabName}`);
      if (target) {
        target.classList.add('active');
        target.style.display = 'block'; // Force display block
      } else {
        console.error(`Tab target not found: tab-${tabName}`);
      }

      // Reset scroll + update arrows when switching tabs
      const panel2 = document.getElementById('panel-phase-2');
      if (panel2) {
        panel2.scrollTop = 0;
        if (panel2._updateArrows) panel2._updateArrows();
      }
    });
  });
}

/* ---------- Scroll Arrow Navigation ---------- */
function setupScrollArrows() {
  const app = document.getElementById('app');

  const configs = [
    { panelId: 'panel-phase-1', phaseId: 'phase-1' },
    { panelId: 'panel-phase-2', phaseId: 'phase-2' },
  ];

  configs.forEach(({ panelId, phaseId }) => {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    // Create buttons as #app children (root stacking context → above nav-strip)
    const upBtn   = createArrowBtn('▲', `arrow-up-${phaseId.slice(-1)}`,   'Scroll up');
    const downBtn = createArrowBtn('▼', `arrow-down-${phaseId.slice(-1)}`, 'Scroll down');
    app.appendChild(upBtn);
    app.appendChild(downBtn);

    // Position and show/hide based on panel state
    const updateArrows = () => {
      const { scrollTop, scrollHeight, clientHeight } = panel;
      const canScroll = scrollHeight > clientHeight + 4;
      const atTop    = scrollTop <= 1;
      const atBottom = scrollTop >= scrollHeight - clientHeight - 1;

      // Only show when the phase panel is visible
      const phaseEl = document.getElementById(phaseId);
      const phaseVisible = phaseEl && phaseEl.classList.contains('active');

      upBtn.classList.toggle('hidden',   !phaseVisible || !canScroll || atTop);
      downBtn.classList.toggle('hidden', !phaseVisible || !canScroll || atBottom);

      if (!phaseVisible) return;

      // Anchor buttons to the panel's bounding rect
      const rect = panel.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;

      upBtn.style.left = `${cx}px`;
      upBtn.style.top  = `${rect.top - 15}px`;
      downBtn.style.left = `${cx}px`;
      downBtn.style.top  = `${rect.bottom - 15}px`;
    };

    panel.addEventListener('scroll', updateArrows, { passive: true });
    upBtn.addEventListener('click',   () => { panel.scrollBy({ top: -260, behavior: 'smooth' }); });
    downBtn.addEventListener('click', () => { panel.scrollBy({ top:  260, behavior: 'smooth' }); });

    // Keep positions updated on resize
    const ro = new ResizeObserver(updateArrows);
    ro.observe(panel);

    // Expose for tab-switching and phase-activation
    panel._updateArrows = updateArrows;
    setTimeout(updateArrows, 200);
  });
}

function createArrowBtn(symbol, id, label) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.className = 'scroll-arrow hidden';
  btn.setAttribute('aria-label', label);
  btn.textContent = symbol;
  // Root-level absolute positioning; z-index above everything
  btn.style.cssText = 'position:fixed; transform:translateX(-50%); z-index:150;';
  return btn;
}


/* Watch for phase becoming active → refresh arrows (and reset scroll on leave) */
function observePhaseActivation() {
  [1, 2].forEach(num => {
    const phaseEl = document.getElementById(`phase-${num}`);
    if (!phaseEl) return;

    const observer = new MutationObserver(() => {
      const panel = document.getElementById(`panel-phase-${num}`);
      if (!panel) return;
      if (phaseEl.classList.contains('active')) {
        // Delay matches the CSS transition-delay so content is fully visible
        setTimeout(() => { if (panel._updateArrows) panel._updateArrows(); }, 550);
      } else {
        panel.scrollTop = 0;             // reset for next visit
        if (panel._updateArrows) panel._updateArrows(); // ← hide arrows immediately
      }
    });

    observer.observe(phaseEl, { attributes: true, attributeFilter: ['class'] });
  });
}

/* ---------- Contact Form ---------- */
function setupContactForm() {
  // Now fully handled by EmailJS script in index.html to ensure UI 
  // only updates upon successful network response.
}

/**
 * Apply heatmap data to board squares
 */
export function applyHeatmap(squares) {
  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

  let idx = 0;
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const sqName = FILES[f] + RANKS[r];
      const sq = squares[sqName];
      if (!sq || idx >= heatmapData.length) continue;

      const data = heatmapData[idx];
      const intensity = Math.min(data.contributions / 40, 1);
      const isLight = (r + f) % 2 === 0;

      sq.classList.add('heatmap-sq');

      // Modulate the base color by contribution intensity
      if (isLight) {
        const g = Math.round(200 - intensity * 80);
        const b = Math.round(180 - intensity * 120);
        sq.style.backgroundColor = `rgb(${Math.round(220 - intensity * 40)}, ${g}, ${b})`;
      } else {
        const r2 = Math.round(60 + intensity * 80);
        const g = Math.round(80 + intensity * 60);
        const b2 = Math.round(40 - intensity * 20);
        sq.style.backgroundColor = `rgb(${r2}, ${g}, ${b2})`;
      }

      // Add tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'heatmap-tooltip';
      tooltip.textContent = `Week of ${data.week} — ${data.contributions} contributions`;
      sq.appendChild(tooltip);

      idx++;
    }
  }
}

/**
 * Remove heatmap from board squares
 */
export function removeHeatmap(squares) {
  Object.values(squares).forEach(sq => {
    sq.classList.remove('heatmap-sq');
    sq.style.backgroundColor = '';
    const tooltip = sq.querySelector('.heatmap-tooltip');
    if (tooltip) tooltip.remove();
  });
}
