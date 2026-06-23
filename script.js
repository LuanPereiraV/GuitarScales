// ============================================================
//  Escalas na Guitarra — lógica de teoria musical + render
// ============================================================

// Notas cromáticas. Mantemos sustenidos e bemóis para exibir
// o nome mais "amigável" dependendo do tom.
const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Tons que costumam ser escritos com bemóis.
const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb']);

// ------------------------------------------------------------
//  Definição das escalas (intervalos em semitons a partir da tônica)
//  e os graus correspondentes (para exibir 1, b3, 5, etc.)
// ------------------------------------------------------------
const SCALES = {
  'major':            { name: 'Maior (Jônio)',          intervals: [0, 2, 4, 5, 7, 9, 11],     degrees: ['1', '2', '3', '4', '5', '6', '7'] },
  'natural_minor':    { name: 'Menor Natural (Eólio)',  intervals: [0, 2, 3, 5, 7, 8, 10],     degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
  'harmonic_minor':   { name: 'Menor Harmônica',        intervals: [0, 2, 3, 5, 7, 8, 11],     degrees: ['1', '2', 'b3', '4', '5', 'b6', '7'] },
  'melodic_minor':    { name: 'Menor Melódica',         intervals: [0, 2, 3, 5, 7, 9, 11],     degrees: ['1', '2', 'b3', '4', '5', '6', '7'] },
  'altered':          { name: 'Alterada (Super Lócrio)',intervals: [0, 1, 3, 4, 6, 8, 10],     degrees: ['1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'] },

  // --- Modos gregos ---
  'ionian':           { name: 'Jônio (modo)',           intervals: [0, 2, 4, 5, 7, 9, 11],     degrees: ['1', '2', '3', '4', '5', '6', '7'] },
  'dorian':           { name: 'Dórico',                 intervals: [0, 2, 3, 5, 7, 9, 10],     degrees: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
  'phrygian':         { name: 'Frígio',                 intervals: [0, 1, 3, 5, 7, 8, 10],     degrees: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
  'lydian':           { name: 'Lídio',                  intervals: [0, 2, 4, 6, 7, 9, 11],     degrees: ['1', '2', '3', '#4', '5', '6', '7'] },
  'mixolydian':       { name: 'Mixolídio',              intervals: [0, 2, 4, 5, 7, 9, 10],     degrees: ['1', '2', '3', '4', '5', '6', 'b7'] },
  'aeolian':          { name: 'Eólio',                  intervals: [0, 2, 3, 5, 7, 8, 10],     degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
  'locrian':          { name: 'Lócrio',                 intervals: [0, 1, 3, 5, 6, 8, 10],     degrees: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },

  // --- Pentatônicas e blues ---
  'pentatonic_major': { name: 'Pentatônica Maior',      intervals: [0, 2, 4, 7, 9],            degrees: ['1', '2', '3', '5', '6'] },
  'pentatonic_minor': { name: 'Pentatônica Menor',      intervals: [0, 3, 5, 7, 10],           degrees: ['1', 'b3', '4', '5', 'b7'] },
  'blues_minor':      { name: 'Blues Menor',            intervals: [0, 3, 5, 6, 7, 10],        degrees: ['1', 'b3', '4', 'b5', '5', 'b7'] },
  'blues_major':      { name: 'Blues Maior',            intervals: [0, 2, 3, 4, 7, 9],         degrees: ['1', '2', 'b3', '3', '5', '6'] },

  // --- Simétricas e exóticas ---
  'whole_tone':       { name: 'Tons Inteiros',          intervals: [0, 2, 4, 6, 8, 10],        degrees: ['1', '2', '3', '#4', '#5', 'b7'] },
  'dim_whole_half':   { name: 'Diminuta (T-S)',         intervals: [0, 2, 3, 5, 6, 8, 9, 11],  degrees: ['1', '2', 'b3', '4', 'b5', 'b6', '6', '7'] },
  'dim_half_whole':   { name: 'Diminuta (S-T)',         intervals: [0, 1, 3, 4, 6, 7, 9, 10],  degrees: ['1', 'b2', 'b3', '3', 'b5', '5', '6', 'b7'] },
  'phrygian_dominant':{ name: 'Frígio Dominante',       intervals: [0, 1, 4, 5, 7, 8, 10],     degrees: ['1', 'b2', '3', '4', '5', 'b6', 'b7'] },
  'hungarian_minor':  { name: 'Menor Húngara',          intervals: [0, 2, 3, 6, 7, 8, 11],     degrees: ['1', '2', 'b3', '#4', '5', 'b6', '7'] },
  'harmonic_major':   { name: 'Maior Harmônica',        intervals: [0, 2, 4, 5, 7, 8, 11],     degrees: ['1', '2', '3', '4', '5', 'b6', '7'] },
};

// Agrupamento das escalas para os menus.
const SCALE_GROUPS = {
  'Principais': ['major', 'natural_minor', 'harmonic_minor', 'melodic_minor', 'altered'],
  'Modos Gregos': ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'],
  'Pentatônicas / Blues': ['pentatonic_major', 'pentatonic_minor', 'blues_minor', 'blues_major'],
  'Simétricas / Exóticas': ['whole_tone', 'dim_whole_half', 'dim_half_whole', 'phrygian_dominant', 'hungarian_minor', 'harmonic_major'],
};

// ------------------------------------------------------------
//  Afinações (notas das cordas, da grave para a aguda;
//  invertemos na hora de mostrar — corda 1 em cima).
// ------------------------------------------------------------
const TUNINGS = {
  'standard':    { name: 'Padrão (E A D G B E)',     notes: ['E', 'A', 'D', 'G', 'B', 'E'] },
  'drop_d':      { name: 'Drop D (D A D G B E)',     notes: ['D', 'A', 'D', 'G', 'B', 'E'] },
  'half_down':   { name: 'Meio tom abaixo (Eb...)',  notes: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'] },
  'full_down':   { name: 'Um tom abaixo (D G C F A D)', notes: ['D', 'G', 'C', 'F', 'A', 'D'] },
  'dadgad':      { name: 'DADGAD',                   notes: ['D', 'A', 'D', 'G', 'A', 'D'] },
  'open_g':      { name: 'Open G (D G D G B D)',     notes: ['D', 'G', 'D', 'G', 'B', 'D'] },
  'open_d':      { name: 'Open D (D A D F# A D)',    notes: ['D', 'A', 'D', 'F#', 'A', 'D'] },
  'seven_string':{ name: '7 cordas (B E A D G B E)', notes: ['B', 'E', 'A', 'D', 'G', 'B', 'E'] },
};

// Casas que recebem marcadores de referência no braço.
const MARKER_FRETS = [3, 5, 7, 9, 15, 17, 19, 21];
const DOUBLE_MARKER_FRETS = [12, 24];

// Paleta de cores das camadas (uma cor por escala sobreposta).
// A tônica é marcada por um anel dourado, então evitamos dourado aqui.
const LAYER_COLORS = [
  '#2e9e86', // verde-azulado
  '#4a86d8', // azul
  '#d9863a', // laranja
  '#a05cd0', // roxo
  '#d04a78', // rosa
  '#7fa83a', // verde-oliva
];
const MAX_LAYERS = LAYER_COLORS.length;

// ------------------------------------------------------------
//  Estado da aplicação
// ------------------------------------------------------------
const state = {
  // Cada camada é uma escala sobreposta, com seu tom e tipo.
  layers: [
    { key: 'C', scale: 'major' },
  ],
  tuning: 'standard',
  frets: 15,
  showDegrees: false,
  leftHanded: false,
  // "Box" de posição: janela do braço com largura/posição configuráveis.
  region: {
    enabled: false,
    start: 5,        // casa inicial da janela
    span: 4,         // quantidade de casas da janela
    hideOutside: false, // esconder (true) ou apenas esmaecer (false) o que está fora
  },
};

// ------------------------------------------------------------
//  Helpers de teoria
// ------------------------------------------------------------
function noteIndex(note) {
  let i = SHARP_NOTES.indexOf(note);
  if (i !== -1) return i;
  return FLAT_NOTES.indexOf(note);
}

function noteName(index, useFlats) {
  const arr = useFlats ? FLAT_NOTES : SHARP_NOTES;
  return arr[((index % 12) + 12) % 12];
}

// Retorna um Map: índice cromático -> grau (string), para uma camada.
function scaleMapFor(layer) {
  const scale = SCALES[layer.scale];
  const root = noteIndex(layer.key);
  const map = new Map();
  scale.intervals.forEach((interval, i) => {
    map.set((root + interval) % 12, scale.degrees[i]);
  });
  return map;
}

// Para cada nota cromática (0-11), lista quais camadas a contêm.
// Retorna array indexado por nota -> [{ li, color, degree, isTonic }]
function buildHitTable() {
  const table = Array.from({ length: 12 }, () => []);
  state.layers.forEach((layer, li) => {
    const map = scaleMapFor(layer);
    const root = noteIndex(layer.key);
    map.forEach((degree, idx) => {
      table[idx].push({
        li,
        color: LAYER_COLORS[li],
        degree,
        isTonic: idx === root,
        layer,
      });
    });
  });
  return table;
}

// Gradiente de "pizza" para notas presentes em várias escalas.
function conicBackground(colors) {
  const n = colors.length;
  const step = 360 / n;
  const stops = colors
    .map((c, i) => `${c} ${(i * step).toFixed(2)}deg ${((i + 1) * step).toFixed(2)}deg`)
    .join(', ');
  return `conic-gradient(from -90deg, ${stops})`;
}

// ------------------------------------------------------------
//  Áudio simples (clique para ouvir a nota)
// ------------------------------------------------------------
let audioCtx = null;
function playNote(chromaticIndex, stringFromTop, totalStrings) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const octaveOffset = (totalStrings - stringFromTop);
    const semitonesFromA4 = chromaticIndex - noteIndex('A') + (octaveOffset - 3) * 12;
    const freq = 440 * Math.pow(2, semitonesFromA4 / 12);
    if (!isFinite(freq) || freq < 20 || freq > 5000) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    /* áudio indisponível — ignora silenciosamente */
  }
}

// ------------------------------------------------------------
//  Render do braço
// ------------------------------------------------------------
function renderFretboard() {
  const board = document.getElementById('fretboard');
  board.innerHTML = '';

  // Para nomes de nota usamos a convenção (sustenido/bemol) do 1º tom.
  const useFlats = FLAT_KEYS.has(state.layers[0].key);
  const hitTable = buildHitTable();

  const tuning = TUNINGS[state.tuning];
  const stringsTopToBottom = [...tuning.notes].reverse();
  const totalStrings = stringsTopToBottom.length;
  const numFrets = state.frets;

  board.style.setProperty('--num-frets', numFrets);
  board.classList.toggle('left-handed', state.leftHanded);

  // Limites da região (box de posição).
  const region = state.region;
  const regStart = region.start;
  const regEnd = region.start + region.span - 1;
  const inRegion = (f) => f >= regStart && f <= regEnd;

  // ----- Linha de números das casas (topo) -----
  const fretNumbersRow = document.createElement('div');
  fretNumbersRow.className = 'fret-numbers';
  const nutLabel = document.createElement('div');
  nutLabel.className = 'fret-num nut-label';
  nutLabel.textContent = '0';
  fretNumbersRow.appendChild(nutLabel);
  for (let f = 1; f <= numFrets; f++) {
    const fn = document.createElement('div');
    fn.className = 'fret-num';
    if (MARKER_FRETS.includes(f) || DOUBLE_MARKER_FRETS.includes(f)) {
      fn.classList.add('marker-fret');
    }
    if (region.enabled && inRegion(f)) fn.classList.add('region-num');
    fn.textContent = f;
    fretNumbersRow.appendChild(fn);
  }
  board.appendChild(fretNumbersRow);

  // ----- Cada corda -----
  stringsTopToBottom.forEach((openNote, stringPos) => {
    const stringRow = document.createElement('div');
    stringRow.className = 'string-row';

    const openIdx = noteIndex(openNote);

    for (let f = 0; f <= numFrets; f++) {
      const chromatic = (openIdx + f) % 12;
      const cell = document.createElement('div');
      cell.className = f === 0 ? 'fret-cell open-cell' : 'fret-cell';

      // Marcadores de referência no braço.
      if (f > 0 && stringPos === Math.floor(totalStrings / 2)) {
        if (DOUBLE_MARKER_FRETS.includes(f)) cell.classList.add('inlay-double');
        else if (MARKER_FRETS.includes(f)) cell.classList.add('inlay');
      }

      // Destaque visual da região (faixa vertical com bordas).
      const cellInRegion = region.enabled && inRegion(f);
      if (cellInRegion) {
        cell.classList.add('region-cell');
        if (f === regStart) cell.classList.add('region-start');
        if (f === regEnd) cell.classList.add('region-end');
      }

      const hits = hitTable[chromatic];
      // Fora da região com "Ocultar fora" ativo: não desenha a nota.
      const skipNote = region.enabled && !cellInRegion && region.hideOutside;
      if (hits.length > 0 && !skipNote) {
        const noteEl = document.createElement('button');
        noteEl.className = 'note';
        if (region.enabled && !cellInRegion) noteEl.classList.add('dimmed');

        const isTonic = hits.some(h => h.isTonic);
        if (isTonic) noteEl.classList.add('tonic');

        // Cor de fundo: sólida (1 escala) ou "pizza" (notas comuns).
        if (hits.length === 1) {
          noteEl.style.background = hits[0].color;
        } else {
          noteEl.classList.add('shared');
          noteEl.style.background = conicBackground(hits.map(h => h.color));
        }

        // Rótulo: nome da nota; ou grau (só faz sentido com 1 escala).
        if (state.showDegrees && hits.length === 1) {
          noteEl.textContent = hits[0].degree;
        } else {
          noteEl.textContent = noteName(chromatic, useFlats);
        }

        // Tooltip detalhando a qual escala/grau a nota pertence.
        noteEl.title = hits
          .map(h => `${h.layer.key} ${SCALES[h.layer.scale].name}: grau ${h.degree}${h.isTonic ? ' (tônica)' : ''}`)
          .join('  •  ');

        noteEl.addEventListener('click', () => playNote(chromatic, stringPos, totalStrings));
        cell.appendChild(noteEl);
      }

      stringRow.appendChild(cell);
    }

    board.appendChild(stringRow);
  });
}

// ------------------------------------------------------------
//  Info textual das escalas (uma por camada)
// ------------------------------------------------------------
function renderScaleInfo() {
  const info = document.getElementById('scaleInfo');
  info.innerHTML = state.layers.map((layer, li) => {
    const useFlats = FLAT_KEYS.has(layer.key);
    const scale = SCALES[layer.scale];
    const root = noteIndex(layer.key);

    const noteList = scale.intervals.map((interval, i) => {
      const idx = (root + interval) % 12;
      const isRoot = i === 0;
      return `<span class="info-note${isRoot ? ' info-tonic' : ''}">${noteName(idx, useFlats)}<small>${scale.degrees[i]}</small></span>`;
    }).join('');

    return `
      <div class="info-scale" style="--layer-color: ${LAYER_COLORS[li]}">
        <span class="info-scale-label"><span class="info-swatch"></span>${layer.key} ${scale.name}:</span>
        <div class="info-notes">${noteList}</div>
      </div>`;
  }).join('');
}

// ------------------------------------------------------------
//  Selects reutilizáveis
// ------------------------------------------------------------
function buildKeySelect(selected, onChange) {
  const sel = document.createElement('select');
  sel.className = 'layer-key';
  SHARP_NOTES.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    const flat = FLAT_NOTES[SHARP_NOTES.indexOf(n)];
    opt.textContent = flat !== n ? `${n} / ${flat}` : n;
    sel.appendChild(opt);
  });
  sel.value = selected;
  sel.addEventListener('change', e => onChange(e.target.value));
  return sel;
}

function buildScaleSelect(selected, onChange) {
  const sel = document.createElement('select');
  sel.className = 'layer-scale';
  Object.entries(SCALE_GROUPS).forEach(([groupName, keys]) => {
    const og = document.createElement('optgroup');
    og.label = groupName;
    keys.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = SCALES[k].name;
      og.appendChild(opt);
    });
    sel.appendChild(og);
  });
  sel.value = selected;
  sel.addEventListener('change', e => onChange(e.target.value));
  return sel;
}

function makeControl(labelText, selectEl) {
  const ctrl = document.createElement('div');
  ctrl.className = 'control';
  const label = document.createElement('label');
  label.textContent = labelText;
  ctrl.appendChild(label);
  ctrl.appendChild(selectEl);
  return ctrl;
}

// ------------------------------------------------------------
//  Render dos controles de camadas (escalas sobrepostas)
// ------------------------------------------------------------
function renderLayers() {
  const container = document.getElementById('scaleLayers');
  container.innerHTML = '';

  state.layers.forEach((layer, li) => {
    const block = document.createElement('div');
    block.className = 'layer';
    block.style.setProperty('--layer-color', LAYER_COLORS[li]);

    // Cabeçalho do card: cor + nome + remover
    const head = document.createElement('div');
    head.className = 'layer-head';

    const swatch = document.createElement('span');
    swatch.className = 'layer-color';
    head.appendChild(swatch);

    const name = document.createElement('span');
    name.className = 'layer-name';
    name.textContent = `Escala ${li + 1}`;
    head.appendChild(name);

    if (state.layers.length > 1) {
      const rm = document.createElement('button');
      rm.className = 'remove-layer';
      rm.textContent = '×';
      rm.title = 'Remover esta escala';
      rm.addEventListener('click', () => {
        state.layers.splice(li, 1);
        renderLayers();
        update();
      });
      head.appendChild(rm);
    }
    block.appendChild(head);

    block.appendChild(makeControl('Tom', buildKeySelect(layer.key, v => {
      layer.key = v;
      update();
    })));
    block.appendChild(makeControl('Escala', buildScaleSelect(layer.scale, v => {
      layer.scale = v;
      update();
    })));

    container.appendChild(block);
  });

  const addBtn = document.getElementById('addLayer');
  addBtn.disabled = state.layers.length >= MAX_LAYERS;
  addBtn.title = addBtn.disabled
    ? `Máximo de ${MAX_LAYERS} escalas`
    : 'Adicionar outra escala (sobreposição)';
}

// ------------------------------------------------------------
//  Selects globais (afinação / casas) + eventos
// ------------------------------------------------------------
function populateGlobalSelectors() {
  const tuningSel = document.getElementById('tuning');
  Object.entries(TUNINGS).forEach(([k, t]) => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = t.name;
    tuningSel.appendChild(opt);
  });
  tuningSel.value = state.tuning;
}

// Sincroniza os controles da região com o estado (limites, rótulo, habilitado).
function updateRegionUI() {
  const region = state.region;
  const startSlider = document.getElementById('regionStart');
  const maxStart = Math.max(0, state.frets - region.span + 1);

  startSlider.max = maxStart;
  if (region.start > maxStart) region.start = maxStart;
  startSlider.value = region.start;

  const end = region.start + region.span - 1;
  document.getElementById('regionLabel').textContent = region.enabled
    ? `(casas ${region.start}–${end})`
    : '';

  // Habilita/desabilita os controles dependentes do toggle.
  document.querySelectorAll('.region-only').forEach(el => {
    el.classList.toggle('disabled', !region.enabled);
  });
  startSlider.disabled = !region.enabled;
  document.getElementById('regionSpan').disabled = !region.enabled;
  document.getElementById('regionHide').disabled = !region.enabled;
}

function bindEvents() {
  document.getElementById('addLayer').addEventListener('click', () => {
    if (state.layers.length >= MAX_LAYERS) return;
    // Nova camada sugere uma menor relativa para já mostrar algo útil.
    const base = state.layers[0];
    state.layers.push({ key: base.key, scale: 'pentatonic_minor' });
    renderLayers();
    update();
  });
  document.getElementById('tuning').addEventListener('change', e => {
    state.tuning = e.target.value;
    renderFretboard();
  });
  document.getElementById('frets').addEventListener('change', e => {
    state.frets = parseInt(e.target.value, 10);
    updateRegionUI(); // re-limita a posição da região ao novo nº de casas
    renderFretboard();
  });
  document.getElementById('showDegrees').addEventListener('change', e => {
    state.showDegrees = e.target.checked;
    renderFretboard();
  });
  document.getElementById('leftHanded').addEventListener('change', e => {
    state.leftHanded = e.target.checked;
    renderFretboard();
  });

  // ----- Região do braço -----
  document.getElementById('regionEnabled').addEventListener('change', e => {
    state.region.enabled = e.target.checked;
    updateRegionUI();
    renderFretboard();
  });
  document.getElementById('regionStart').addEventListener('input', e => {
    state.region.start = parseInt(e.target.value, 10);
    updateRegionUI();
    renderFretboard();
  });
  document.getElementById('regionSpan').addEventListener('change', e => {
    state.region.span = parseInt(e.target.value, 10);
    updateRegionUI();
    renderFretboard();
  });
  document.getElementById('regionHide').addEventListener('change', e => {
    state.region.hideOutside = e.target.checked;
    renderFretboard();
  });
}

function update() {
  renderScaleInfo();
  renderFretboard();
}

// ------------------------------------------------------------
//  Start
// ------------------------------------------------------------
populateGlobalSelectors();
renderLayers();
bindEvents();
updateRegionUI();
update();
