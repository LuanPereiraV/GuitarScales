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

// ------------------------------------------------------------
//  Afinações (notas das cordas, da mais aguda para a mais grave
//  na ordem de exibição — corda 1 em cima).
//  Guardamos da grave para a aguda e invertemos na hora de mostrar.
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

// ------------------------------------------------------------
//  Estado da aplicação
// ------------------------------------------------------------
const state = {
  key: 'C',
  scale: 'major',
  tuning: 'standard',
  frets: 15,
  showDegrees: false,
  leftHanded: false,
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

// Retorna um Map: índice cromático -> grau (string), para a escala/tom atuais.
function getScaleMap() {
  const scale = SCALES[state.scale];
  const root = noteIndex(state.key);
  const map = new Map();
  scale.intervals.forEach((interval, i) => {
    const idx = (root + interval) % 12;
    map.set(idx, scale.degrees[i]);
  });
  return map;
}

// ------------------------------------------------------------
//  Áudio simples (clique para ouvir a nota)
// ------------------------------------------------------------
let audioCtx = null;
function playNote(chromaticIndex, stringFromTop, totalStrings) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Frequência aproximada: usa A4 = 440 como referência.
    // Estimamos uma oitava com base na posição da corda só para variar o timbre.
    const octaveOffset = (totalStrings - stringFromTop); // cordas graves = oitava menor
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

  const useFlats = FLAT_KEYS.has(state.key);
  const scaleMap = getScaleMap();
  const rootIdx = noteIndex(state.key);

  const tuning = TUNINGS[state.tuning];
  // Cordas exibidas de cima (aguda) para baixo (grave): invertemos a lista grave->aguda.
  const stringsTopToBottom = [...tuning.notes].reverse();
  const totalStrings = stringsTopToBottom.length;
  const numFrets = state.frets;

  board.style.setProperty('--num-frets', numFrets);
  board.classList.toggle('left-handed', state.leftHanded);

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
    fn.textContent = f;
    fretNumbersRow.appendChild(fn);
  }
  board.appendChild(fretNumbersRow);

  // ----- Cada corda -----
  stringsTopToBottom.forEach((openNote, stringPos) => {
    const stringRow = document.createElement('div');
    stringRow.className = 'string-row';

    const openIdx = noteIndex(openNote);

    // Casa 0 (corda solta / pestana)
    for (let f = 0; f <= numFrets; f++) {
      const chromatic = (openIdx + f) % 12;
      const cell = document.createElement('div');
      cell.className = f === 0 ? 'fret-cell open-cell' : 'fret-cell';

      // Marcadores de referência no braço (só no meio visual de uma corda central).
      if (f > 0 && stringPos === Math.floor(totalStrings / 2)) {
        if (DOUBLE_MARKER_FRETS.includes(f)) cell.classList.add('inlay-double');
        else if (MARKER_FRETS.includes(f)) cell.classList.add('inlay');
      }

      if (scaleMap.has(chromatic)) {
        const noteEl = document.createElement('button');
        noteEl.className = 'note';
        if (chromatic === rootIdx) noteEl.classList.add('tonic');
        noteEl.textContent = state.showDegrees
          ? scaleMap.get(chromatic)
          : noteName(chromatic, useFlats);
        noteEl.title = `${noteName(chromatic, useFlats)} — grau ${scaleMap.get(chromatic)} (casa ${f})`;
        noteEl.addEventListener('click', () => playNote(chromatic, stringPos, totalStrings));
        cell.appendChild(noteEl);
      }

      stringRow.appendChild(cell);
    }

    board.appendChild(stringRow);
  });
}

// ------------------------------------------------------------
//  Info textual da escala
// ------------------------------------------------------------
function renderScaleInfo() {
  const info = document.getElementById('scaleInfo');
  const useFlats = FLAT_KEYS.has(state.key);
  const scale = SCALES[state.scale];
  const root = noteIndex(state.key);

  const noteList = scale.intervals.map((interval, i) => {
    const idx = (root + interval) % 12;
    const isRoot = i === 0;
    return `<span class="info-note${isRoot ? ' info-tonic' : ''}">${noteName(idx, useFlats)}<small>${scale.degrees[i]}</small></span>`;
  }).join('');

  info.innerHTML = `
    <h2>${state.key} ${scale.name}</h2>
    <div class="info-notes">${noteList}</div>
  `;
}

// ------------------------------------------------------------
//  Inicialização dos selects
// ------------------------------------------------------------
function populateSelectors() {
  const keySel = document.getElementById('key');
  SHARP_NOTES.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    // Mostra também o nome bemol quando houver.
    const flat = FLAT_NOTES[SHARP_NOTES.indexOf(n)];
    opt.textContent = flat !== n ? `${n} / ${flat}` : n;
    keySel.appendChild(opt);
  });
  keySel.value = state.key;

  const scaleSel = document.getElementById('scale');
  const groups = {
    'Principais': ['major', 'natural_minor', 'harmonic_minor', 'melodic_minor', 'altered'],
    'Modos Gregos': ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'],
    'Pentatônicas / Blues': ['pentatonic_major', 'pentatonic_minor', 'blues_minor', 'blues_major'],
    'Simétricas / Exóticas': ['whole_tone', 'dim_whole_half', 'dim_half_whole', 'phrygian_dominant', 'hungarian_minor', 'harmonic_major'],
  };
  Object.entries(groups).forEach(([groupName, keys]) => {
    const og = document.createElement('optgroup');
    og.label = groupName;
    keys.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = SCALES[k].name;
      og.appendChild(opt);
    });
    scaleSel.appendChild(og);
  });
  scaleSel.value = state.scale;

  const tuningSel = document.getElementById('tuning');
  Object.entries(TUNINGS).forEach(([k, t]) => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = t.name;
    tuningSel.appendChild(opt);
  });
  tuningSel.value = state.tuning;
}

// ------------------------------------------------------------
//  Eventos
// ------------------------------------------------------------
function bindEvents() {
  document.getElementById('key').addEventListener('change', e => {
    state.key = e.target.value;
    update();
  });
  document.getElementById('scale').addEventListener('change', e => {
    state.scale = e.target.value;
    update();
  });
  document.getElementById('tuning').addEventListener('change', e => {
    state.tuning = e.target.value;
    update();
  });
  document.getElementById('frets').addEventListener('change', e => {
    state.frets = parseInt(e.target.value, 10);
    update();
  });
  document.getElementById('showDegrees').addEventListener('change', e => {
    state.showDegrees = e.target.checked;
    renderFretboard();
  });
  document.getElementById('leftHanded').addEventListener('change', e => {
    state.leftHanded = e.target.checked;
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
populateSelectors();
bindEvents();
update();
