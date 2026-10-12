const routeForm = document.getElementById('route-form');
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const turnList = document.getElementById('turn-list');
const currentTurn = document.getElementById('current-turn');
const routeSummary = document.getElementById('route-summary');
const voiceToggle = document.getElementById('voice-toggle');

let routeData = null;
let activeStepIndex = 0;
let voiceEnabled = true;
let lastSpokenText = '';
let demoTimer = null;
let mapMode = 'demo';

const demoRoute = {
  legs: [{
    distance: { text: '4.8 km' },
    duration: { text: '9 min' },
    steps: [
      { maneuver: 'depart', instructions: 'Head north on Cedar Avenue', distance: { text: '180 m' } },
      { maneuver: 'turn-right', instructions: 'Turn right onto Quarry Road', distance: { text: '420 m' } },
      { maneuver: 'fork-left', instructions: 'Keep left at the rally split', distance: { text: '650 m' } },
      { maneuver: 'slight-right', instructions: 'Slight right onto Ridge Line', distance: { text: '930 m' } },
      { maneuver: 'turn-left', instructions: 'Sharp left into Summit Lane', distance: { text: '550 m' } },
      { maneuver: 'arrive', instructions: 'Arrive at destination', distance: { text: '0 m' } }
    ]
  }]
};

const ARROW_MAP = {
  'turn-left': '←',
  'turn-right': '→',
  'uturn-left': '↺',
  'uturn-right': '↻',
  'straight': '↑',
  'slight-left': '↖',
  'slight-right': '↗',
  'merge': '↗',
  'fork-left': '↖',
  'fork-right': '↗',
  'depart': '⇢',
  'arrive': '✓',
  'roundabout-left': '↺',
  'roundabout-right': '↻'
};

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
    });
  }
}

function initDemoMap() {
  const mapElement = document.getElementById('map');
  mapElement.classList.add('demo-map');

  const badge = document.createElement('div');
  badge.className = 'demo-badge';
  badge.textContent = 'Demo Route';
  mapElement.appendChild(badge);

  routeData = demoRoute;
  renderTurnList(demoRoute.legs[0].steps);
  activeStepIndex = 0;
  updateCurrentTurn(demoRoute.legs[0].steps[0], 0);
  routeSummary.textContent = '4.8 km • 9 min';
  speakTurn(demoRoute.legs[0].steps[0], 0);

  startDemoProgress();
}

function handleRouteSubmit(event) {
  event.preventDefault();

  const origin = originInput.value.trim() || 'current location';
  const destination = destinationInput.value.trim();

  if (!destination) {
    destinationInput.focus();
    return;
  }

  routeData = demoRoute;
  renderTurnList(demoRoute.legs[0].steps);
  activeStepIndex = 0;
  updateCurrentTurn(demoRoute.legs[0].steps[0], 0);
  routeSummary.textContent = '4.8 km • 9 min';
  speakTurn(demoRoute.legs[0].steps[0], 0);
  startDemoProgress();
}

function renderTurnList(steps) {
  turnList.innerHTML = '';

  steps.forEach((step, index) => {
    const card = document.createElement('div');
    card.className = `turn-card${index === 0 ? ' active' : ''}`;
    const turnNumber = (index + 1).toString().padStart(2, '0');

    card.innerHTML = `
      <div class="turn-card__number">${turnNumber}</div>
      <div class="turn-card__icon">${getArrowIcon(step.maneuver, step.instructions)}</div>
      <div class="turn-card__text">${(step.instructions || '').replace(/<[^>]+>/g, '')}</div>
      <div class="turn-card__distance">${step.distance ? step.distance.text : ''}</div>
    `;

    card.addEventListener('click', () => {
      activeStepIndex = index;
      updateCurrentTurn(step, index);
      speakTurn(step, index);
    });

    turnList.appendChild(card);
  });
}

function updateCurrentTurn(step, index) {
  const cards = [...document.querySelectorAll('.turn-card')];
  cards.forEach((card, cardIndex) => card.classList.toggle('active', cardIndex === index));

  const turnNumber = (index + 1).toString().padStart(2, '0');
  currentTurn.innerHTML = `
    <div class="turn-hero__number">${turnNumber}</div>
    <div class="turn-hero__icon">${getArrowIcon(step.maneuver, step.instructions)}</div>
    <div class="turn-hero__text">${(step.instructions || '').replace(/<[^>]+>/g, '')}</div>
  `;
}

function getArrowIcon(maneuver, instructions) {
  const text = ((maneuver || instructions || '') + '').toLowerCase();
  for (const [key, value] of Object.entries(ARROW_MAP)) {
    if (text.includes(key)) {
      return value;
    }
  }

  if (text.includes('left')) return '←';
  if (text.includes('right')) return '→';
  if (text.includes('roundabout')) return '↻';
  if (text.includes('continue')) return '↑';
  return '→';
}

function speakTurn(step, index) {
  if (!voiceEnabled) return;

  const cleanInstruction = (step.instructions || '').replace(/<[^>]+>/g, '').trim();
  const speechText = `Turn ${index + 1}. ${cleanInstruction}`;

  if (speechText === lastSpokenText) {
    return;
  }

  lastSpokenText = speechText;
  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.rate = 1.05;
  utterance.pitch = 1.05;
  utterance.volume = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function startDemoProgress() {
  if (demoTimer) {
    clearInterval(demoTimer);
  }

  demoTimer = setInterval(() => {
    const steps = demoRoute.legs[0].steps;
    if (activeStepIndex >= steps.length - 1) {
      clearInterval(demoTimer);
      return;
    }

    activeStepIndex += 1;
    const step = steps[activeStepIndex];
    updateCurrentTurn(step, activeStepIndex);
    speakTurn(step, activeStepIndex);
  }, 4500);
}

voiceToggle.addEventListener('click', () => {
  voiceEnabled = !voiceEnabled;
  voiceToggle.textContent = voiceEnabled ? 'Voice On' : 'Voice Off';
  voiceToggle.setAttribute('aria-pressed', String(voiceEnabled));
  if (!voiceEnabled) {
    window.speechSynthesis.cancel();
  }
});

routeForm.addEventListener('submit', handleRouteSubmit);

registerServiceWorker();
initDemoMap();
