const entries = {
  project1: {
    title: 'Harkness Discussion Table Tracker',
    body: `
      <p>This project was inspired by the Harkness Discussion table.</p>
      <p>This project is a stand alone webpage that allows teachers to upload csv files (or to manually enter) a student roster, a scoring rubric, and a set of discussion questions. Once teachers have uploaded this information, they are able to open a second window for an extended desktop display. This will display a student speaking queue that will update live based upon teacher actions, the discussion questions, and the scoring rubric. 
      The teacher will be able to continue working on their own screen on the main webpage to add students to the queue, award points to speakers using the rubric categories and values, make connections between students as they speak, and end the discussion. Once the discussion has ended, the student display page will update with the final Harkness table image. Teachers can export their discussion results as an excel spreadsheet and print the final 
      Harkness table with student connections.</p>
      <p><a href="https://mrlynchteaches.github.io/harkness_discussion/" target="_blank" rel="noopener">Mr. Lynch's Harkness Discussion Table Tracker</a></p>
    `
  },
  project2: {
    title: 'Georgia Standards Interdisciplinary Constellation',
    body: `
      <p>This project was inspired by the United Nations Radial Web of cultural connections found here: https://ich.unesco.org/en/dive.</p>
      <p>This website, which is still under construction, will allow teachers to select their course from the list of available GA DOE courses, select their current standards, and then search for standards from other courses to see if there are opportunities for interdisciplinary or cross-curricular lessons. 
      Teachers can filter results for certain grade levels, subjects, and the strength of the connection. Under the current code, connections are based upon skills, rather than on content. I hope to update this so that the content becomes the primary means of connection rather than on skills like expain, describe, etc. 
      For example, exponential functions is a concept explored as content in math, science, and economics and having those connections would be more meaningful for a teacher to work towards a project that is interdisciplinary or cross-curricular.</p>
      <p><a href="https://mrlynchteaches.github.io/georgia_standards_interdisciplinary_web/" target="_blank" rel="noopener">Mr. Lynch's Georgia Standards Interdisciplinary Constellation</a></p>
    `
  },
  project3: {
    title: 'Project Three',
    body: `
      <p>Add a short description of this project here.</p>
      <p>Replace this text with details about the project in education or web design.</p>
      <p><a href="#" target="_blank" rel="noopener">Optional external project link</a></p>
    `
  },
  project4: {
    title: 'Project Four',
    body: `
      <p>Add a short description of this project here.</p>
      <p>Replace this text with details about the project in education or web design.</p>
      <p><a href="#" target="_blank" rel="noopener">Optional external project link</a></p>
    `
  },
  project5: {
    title: 'Project Five',
    body: `
      <p>Add a short description of this project here.</p>
      <p>Replace this text with details about the project in education or web design.</p>
      <p><a href="#" target="_blank" rel="noopener">Optional external project link</a></p>
    `
  },
  project6: {
    title: 'Project Six',
    body: `
      <p>Add a short description of this project here.</p>
      <p>Replace this text with details about the project in education or web design.</p>
      <p><a href="#" target="_blank" rel="noopener">Optional external project link</a></p>
    `
  },
  project7: {
    title: 'Project Seven',
    body: `
      <p>Add a short description of this project here.</p>
      <p>Replace this text with details about the project in education or web design.</p>
      <p><a href="#" target="_blank" rel="noopener">Optional external project link</a></p>
    `
  }
};

const overlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModalButton = document.getElementById('closeModal');
const buttons = Array.from(document.querySelectorAll('.poi'));
const statusBox = document.getElementById('statusBox');
const avatar = document.getElementById('avatar');
const toggleAvatarButton = document.getElementById('toggleAvatarBtn');
const mapStage = document.getElementById('mapStage');
let lastTrigger = null;

const navigationMode = 'wasd-only';
const MAP_WIDTH = 693;
const MAP_HEIGHT = 520;

const avatarState = {
  enabled: false,
  x: 50,
  y: 50,
  speed: 0.35,
  keys: { up: false, down: false, left: false, right: false },
  nearestPoi: null,
  rafId: null
};

function openModal(key, trigger) {
  const entry = entries[key];
  if (!entry) return;
  modalTitle.textContent = entry.title;
  modalBody.innerHTML = entry.body;
  overlay.hidden = false;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  lastTrigger = trigger || null;
  statusBox.innerHTML = `
    <h3>${entry.title} opened</h3>
    <p>Well done traveler, you have entered <strong>${entry.title}</strong>. Update this project description later in <strong>projects_map.js</strong>.</p>
  `;
  closeModalButton.focus();
}

function closeModal() {
  overlay.classList.remove('open');
  overlay.hidden = true;
  document.body.style.overflow = '';
  if (lastTrigger) lastTrigger.focus();
}

function updateAvatarPosition() {
  avatar.style.left = `${avatarState.x}%`;
  avatar.style.top = `${avatarState.y}%`;
}

function resetPoiHighlights() {
  buttons.forEach((button) => button.classList.remove('poi--near'));
}

function getNearestPoi() {
  if (!avatarState.enabled) {
    avatarState.nearestPoi = null;
    resetPoiHighlights();
    return;
  }

  const avatarPxX = (avatarState.x / 100) * MAP_WIDTH;
  const avatarPxY = (avatarState.y / 100) * MAP_HEIGHT;

  let activeButton = null;
  let bestDistance = Infinity;

  buttons.forEach((button) => {
    const targetCxPx = Number(button.dataset.avatarCx);
    const targetCyPx = Number(button.dataset.avatarCy);
    const targetSize = Number(button.dataset.avatarSize);
    const halfSize = targetSize / 2;

    const insideSquare =
      Math.abs(avatarPxX - targetCxPx) <= halfSize &&
      Math.abs(avatarPxY - targetCyPx) <= halfSize;

    if (insideSquare) {
      const dx = avatarPxX - targetCxPx;
      const dy = avatarPxY - targetCyPx;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bestDistance) {
        bestDistance = distance;
        activeButton = button;
      }
    }
  });

  resetPoiHighlights();

  if (activeButton) {
    activeButton.classList.add('poi--near');
    avatarState.nearestPoi = activeButton;
    statusBox.innerHTML = `
      <h3>Avatar Exploration Active</h3>
      <p>You are inside the image zone for <strong>${entries[activeButton.dataset.key].title}</strong>. Press <strong>Enter</strong> to open this project.</p>
      <p>Mouse clicks still target the text label, while avatar Enter uses a square zone around the POI image.</p>
    `;
  } else {
    avatarState.nearestPoi = null;
    statusBox.innerHTML = `
      <h3>Avatar Exploration Active</h3>
      <p>Move the avatar with <strong>WASD</strong> until it enters a project image zone.</p>
      <p>Arrow-key page scrolling is disabled while avatar mode is active.</p>
    `;
  }
}

function tickAvatar() {
  if (!avatarState.enabled) return;
  const dx = (avatarState.keys.right ? 1 : 0) - (avatarState.keys.left ? 1 : 0);
  const dy = (avatarState.keys.down ? 1 : 0) - (avatarState.keys.up ? 1 : 0);
  avatarState.x = Math.min(Math.max(avatarState.x + dx * avatarState.speed, 2), 98);
  avatarState.y = Math.min(Math.max(avatarState.y + dy * avatarState.speed, 2), 98);
  updateAvatarPosition();
  getNearestPoi();
  avatarState.rafId = requestAnimationFrame(tickAvatar);
}

function startAvatar() {
  avatarState.enabled = true;
  avatar.classList.remove('avatar--hidden');
  avatar.setAttribute('aria-hidden', 'false');
  toggleAvatarButton.textContent = 'Disable Avatar Exploration';
  updateAvatarPosition();
  getNearestPoi();
  if (!avatarState.rafId) tickAvatar();
}

function stopAvatar() {
  avatarState.enabled = false;
  avatar.classList.add('avatar--hidden');
  avatar.setAttribute('aria-hidden', 'true');
  toggleAvatarButton.textContent = 'Enable Avatar Exploration';
  resetPoiHighlights();
  avatarState.nearestPoi = null;
  if (avatarState.rafId) {
    cancelAnimationFrame(avatarState.rafId);
    avatarState.rafId = null;
  }
  statusBox.innerHTML = `
    <h3>Project Map Ready</h3>
    <p>This page uses the same fantasy map design, pop-up system, and avatar exploration. Replace the map image file with your new PNG and then edit the project titles and descriptions inside <strong>projects_map.js</strong>.</p>
    <p><strong>Current placeholder labels:</strong> Project One, Project Two, Project Three, Project Four, Project Five, Project Six, and Project Seven.</p>
  `;
}

function isArrowKey(key) {
  return key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright';
}

function isMovementKey(key) {
  if (key === 'w' || key === 'a' || key === 's' || key === 'd') return true;
  if (navigationMode === 'wasd-and-arrows' && isArrowKey(key)) return true;
  return false;
}

function setMovementKeyState(key, isPressed) {
  if (key === 'w' || (navigationMode === 'wasd-and-arrows' && key === 'arrowup')) avatarState.keys.up = isPressed;
  if (key === 's' || (navigationMode === 'wasd-and-arrows' && key === 'arrowdown')) avatarState.keys.down = isPressed;
  if (key === 'a' || (navigationMode === 'wasd-and-arrows' && key === 'arrowleft')) avatarState.keys.left = isPressed;
  if (key === 'd' || (navigationMode === 'wasd-and-arrows' && key === 'arrowright')) avatarState.keys.right = isPressed;
}

buttons.forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.key, button));
});
closeModalButton.addEventListener('click', closeModal);
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !overlay.hidden) {
    closeModal();
    return;
  }
  if (!avatarState.enabled) return;

  const key = event.key.toLowerCase();

  if (isArrowKey(key)) event.preventDefault();

  if (isMovementKey(key)) {
    event.preventDefault();
    setMovementKeyState(key, true);
  }

  if (event.key === 'Enter' && avatarState.nearestPoi) {
    event.preventDefault();
    openModal(avatarState.nearestPoi.dataset.key, avatarState.nearestPoi);
  }
});

document.addEventListener('keyup', (event) => {
  if (!avatarState.enabled) return;
  const key = event.key.toLowerCase();

  if (isArrowKey(key)) event.preventDefault();

  if (isMovementKey(key)) {
    event.preventDefault();
    setMovementKeyState(key, false);
  }
});

toggleAvatarButton.addEventListener('click', () => {
  if (avatarState.enabled) stopAvatar();
  else startAvatar();
});

mapStage.addEventListener('mouseleave', () => {
  if (!avatarState.enabled) return;
  Object.keys(avatarState.keys).forEach((key) => {
    avatarState.keys[key] = false;
  });
});
