const routeForm = document.getElementById('route-form');
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const turnList = document.getElementById('turn-list');
const currentTurn = document.getElementById('current-turn');
const routeSummary = document.getElementById('route-summary');
const voiceToggle = document.getElementById('voice-toggle');

let map = null;
let directionsService = null;
let directionsRenderer = null;
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

function startApp() {
  if (window.google && google.maps) {
    mapMode = 'live';
    initLiveMap();
  } else {
    mapMode = 'demo';
    initDemoMap();
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
}

function initLiveMap() {
  const mapElement = document.getElementById('map');
  map = new google.maps.Map(mapElement, {
    center: { lat: 40.712776, lng: -74.005974 },
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#ff7a18',
      strokeWeight: 8,
      strokeOpacity: 0.9
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.setCenter({ lat: coords.latitude, lng: coords.longitude });
        originInput.placeholder = 'Current location ready';
      },
      () => {
        originInput.placeholder = 'Use a city or address';
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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

  if (mapMode === 'live' && window.google && google.maps) {
    const finalOrigin = origin === 'current location' ? undefined : origin;

    directionsService.route(
      {
        origin: finalOrigin || { lat: map.getCenter().lat(), lng: map.getCenter().lng() },
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        provideRouteAlternatives: false
      },
      (response, status) => {
        if (status !== 'OK') {
          alert(`Route request failed: ${status}`);
          return;
        }

        routeData = response.routes[0];
        directionsRenderer.setDirections(routeData);
        renderTurnList(routeData.legs[0].steps);
        activeStepIndex = 0;
        updateCurrentTurn(routeData.legs[0].steps[0], 0);
        routeSummary.textContent = `${routeData.legs[0].distance.text} • ${routeData.legs[0].duration.text}`;
        speakTurn(routeData.legs[0].steps[0], 0);
        monitorDriverProgress();
      }
    );
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

function monitorDriverProgress() {
  if (!navigator.geolocation || !routeData || mapMode !== 'live') return;

  navigator.geolocation.watchPosition(
    ({ coords }) => {
      const currentLatLng = new google.maps.LatLng(coords.latitude, coords.longitude);
      const steps = routeData.legs[0].steps;

      if (!steps.length) return;

      const activeStep = steps[activeStepIndex];
      if (!activeStep) return;

      const distanceToStep = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng, activeStep.start_location || activeStep.end_location);

      if (distanceToStep < 85 && activeStepIndex < steps.length - 1) {
        activeStepIndex += 1;
        const nextStep = steps[activeStepIndex];
        updateCurrentTurn(nextStep, activeStepIndex);
        speakTurn(nextStep, activeStepIndex);
      }
    },
    () => {
      console.warn('GPS unavailable while tracking rally voice cues.');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 2000
    }
  );
}

window.addEventListener('load', startApp);
