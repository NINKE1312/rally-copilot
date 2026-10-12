/* existing CSS plus fallback map styles */

:root {
  --bg: #0a1220;
  --panel: rgba(13, 20, 31, 0.88);
  --panel-alt: rgba(18, 28, 42, 0.96);
  --line: rgba(127, 170, 255, 0.18);
  --text: #ebf2ff;
  --muted: #a9b9d1;
  --brand: #ff7a18;
  --brand-2: #ffb341;
  --danger: #ff4f6b;
  --warning: #ffd166;
  --success: #3ae28a;
  --shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  height: 100%;
  font-family: 'Inter', sans-serif;
  background: radial-gradient(circle at top, #122033 0%, #09121d 50%, #060d15 100%);
  color: var(--text);
}

body {
  min-height: 100vh;
}

button, input {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 360px 1fr;
  min-height: 100vh;
}

.sidebar {
  padding: 28px 20px 20px;
  background: var(--panel);
  border-right: 1px solid var(--line);
  backdrop-filter: blur(12px);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.brand-badge {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #160d07;
  font-weight: 800;
  box-shadow: var(--shadow);
  font-family: 'Orbitron', sans-serif;
}

.eyebrow {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

h1 {
  margin: 4px 0 0;
  font-size: clamp(1.8rem, 2vw, 2.3rem);
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.05em;
}

.route-form {
  display: grid;
  gap: 14px;
  margin-bottom: 24px;
}

.route-form label {
  display: grid;
  gap: 8px;
}

.route-form span {
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.route-form input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(9, 18, 29, 0.8);
  color: var(--text);
  padding: 14px 16px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.route-form input:focus {
  outline: none;
  border-color: rgba(255, 166, 92, 0.8);
  box-shadow: 0 0 0 3px rgba(255, 122, 24, 0.15);
}

.actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.primary-btn, .secondary-btn {
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  font-weight: 700;
}

.primary-btn {
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #1f130d;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  border: 1px solid var(--line);
}

.primary-btn:hover, .secondary-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
}

.status-panel {
  background: var(--panel-alt);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 18px;
  box-shadow: var(--shadow);
}

.status-label {
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.turn-hero {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 14px;
  align-items: center;
  margin-top: 12px;
}

.turn-hero__number {
  min-width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, rgba(255, 122, 24, 0.2), rgba(255, 179, 65, 0.12));
  border: 1px solid rgba(255, 171, 73, 0.2);
  color: var(--warning);
  font-family: 'Orbitron', sans-serif;
}

.turn-hero__icon {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--danger);
}

.turn-hero__text {
  color: var(--text);
  line-height: 1.4;
  font-weight: 600;
}

.legend {
  display: grid;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot.danger {
  background: var(--danger);
}

.legend-dot.warning {
  background: var(--warning);
}

.map-panel {
  display: grid;
  grid-template-rows: minmax(400px, 1fr) auto;
}

#map {
  width: 100%;
  min-height: 400px;
  background: #0d1520;
  position: relative;
  overflow: hidden;
}

.demo-map {
  background:
    linear-gradient(rgba(44, 77, 122, 0.15), rgba(44, 77, 122, 0.15)),
    repeating-linear-gradient(
      0deg,
      rgba(80, 120, 174, 0.15),
      rgba(80, 120, 174, 0.15) 2px,
      transparent 2px,
      transparent 28px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(80, 120, 174, 0.15),
      rgba(80, 120, 174, 0.15) 2px,
      transparent 2px,
      transparent 28px
    ),
    #0b1520;
}

.demo-map::before {
  content: "";
  position: absolute;
  inset: 12% 10% 15% 18%;
  border-radius: 36px;
  border: 2px dashed rgba(255, 201, 125, 0.44);
  transform: rotate(-8deg);
}

.demo-map::after {
  content: "";
  position: absolute;
  inset: 8% 10% 6% 12%;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 122, 24, 0.2) 15%, rgba(255, 122, 24, 0.7) 52%, rgba(255, 179, 65, 0.3) 100%);
  clip-path: polygon(10% 28%, 32% 12%, 54% 26%, 70% 18%, 84% 34%, 90% 58%, 72% 77%, 48% 90%, 18% 72%);
  opacity: 0.7;
}

.demo-badge {
  position: absolute;
  top: 18px;
  right: 18px;
  background: rgba(5, 12, 18, 0.78);
  border: 1px solid rgba(255, 179, 65, 0.3);
  color: var(--warning);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.route-list-wrap {
  background: rgba(8, 13, 20, 0.82);
  border-top: 1px solid var(--line);
  padding: 18px 20px 22px;
}

.route-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.route-header h2 {
  margin: 0;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

#route-summary {
  color: var(--warning);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

.turn-list {
  display: grid;
  gap: 10px;
  max-height: 270px;
  overflow: auto;
  padding-right: 6px;
}

.turn-card {
  display: grid;
  grid-template-columns: 70px 72px 1fr auto;
  align-items: center;
  gap: 10px;
  background: rgba(18, 28, 42, 0.9);
  border: 1px solid rgba(128, 164, 255, 0.12);
  border-radius: 14px;
  padding: 12px 14px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.turn-card.active {
  border-color: rgba(255, 171, 73, 0.8);
  background: linear-gradient(135deg, rgba(255, 122, 24, 0.14), rgba(255, 186, 94, 0.06));
  box-shadow: 0 0 0 1px rgba(255, 179, 65, 0.25);
}

.turn-card__number {
  font-family: 'Orbitron', sans-serif;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--warning);
  font-size: 1.2rem;
}

.turn-card__icon {
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  font-size: 2rem;
  font-weight: 800;
  color: var(--danger);
}

.turn-card__text {
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--text);
}

.turn-card__distance {
  color: var(--muted);
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 980px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--line);
  }

  .map-panel {
    min-height: 60vh;
  }
}

