import './style.css'

const MODELS = {
  "NVIDIA Nemotron 3 Super": 450,
  "Grok 4.20 Beta 0309": 267,
  "gpt-oss-120B (high)": 267,
  "GPT-5 Codex (high)": 182,
  "Qwen3.5 122B A10B": 152,
  "Gemini 3 Flash": 150,
  "Gemini 2.5 Pro": 128,
  "Llama 4 Maverick": 127,
  "Gemini 3 Pro Preview (high)": 122,
  "Gemini 3.1 Pro Preview (high)": 118,
  "GPT-5.2 Codex (high)": 92,
  "GPT-5.1 Codex (high)": 90,
  "Llama 3.3 70B": 89,
  "Qwen3.5 397B A17B": 86,
  "Qwen3.5 27B": 83,
  "GPT-5.4 (xhigh)": 80,
  "Devstral 2": 75,
  "GLM-5": 73,
  "Kimi K2 Thinking": 72,
  "GPT-5.1 (high)": 72,
  "GPT-5.2 (xhigh)": 71,
  "GPT-5.3 Codex (xhigh)": 66,
  "GPT-5 (high)": 59,
  "GPT-5 (medium)": 55,
  "Claude Sonnet 4.6 (max)": 55,
  "Claude Opus 4.5": 53,
  "Claude Opus 4.6 (max)": 49,
  "Claude 4.5 Sonnet": 49,
  "MiniMax-M2.5": 48,
  "Mistral Large 3": 47,
  "Kimi K2.5": 46,
  "Claude Sonnet 4.6 (Non-reasoning, Low Effort)": 45,
  "MiniMax-M2.1": 44,
  "Claude Sonnet 4.6": 44,
  "DeepSeek V3.2": 44,
  "Grok 4": 44,
  "Claude Opus 4.6": 42,
  "GPT-4 Turbo": 23
};

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. In the heart of the digital frontier, tokens stream like lightning across a vast neural landscape. Every word, every character, is a pulse of intelligence, a fragment of a larger conversation between human and machine. As the models evolve, the speed of this exchange accelerates. What once took seconds now happens in the blink of an eye. This is the era of high-speed reasoning, where latency is the enemy and throughput is king. We measure progress in tokens per second, a heartbeat for the silicon minds that power our world. The future is being written in real-time, one token at a time. `;

const words = SAMPLE_TEXT.split(' ');

class ComboBox {
  constructor(containerId, optionsId, inputId, onSelect) {
    this.container = document.getElementById(containerId);
    this.optionsContainer = document.getElementById(optionsId);
    this.input = document.getElementById(inputId);
    this.onSelect = onSelect;
    this.allOptions = ["Manual Control", ...Object.keys(MODELS)];
    this.isOpen = false;

    this.init();
  }

  init() {
    this.input.addEventListener('focus', () => {
      if (this.input.value === 'Manual Control') {
        this.input.value = '';
      }
      this.showOptions();
    });

    this.input.addEventListener('input', () => this.filterOptions());

    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        if (this.input.value === '') {
          this.input.value = 'Manual Control';
        }
        this.hideOptions();
      }
    });

    this.renderOptions(this.allOptions);
  }

  showOptions() {
    this.optionsContainer.classList.add('show');
    this.isOpen = true;
    this.filterOptions();
  }

  hideOptions() {
    this.optionsContainer.classList.remove('show');
    this.isOpen = false;
  }

  filterOptions() {
    const query = this.input.value.toLowerCase();
    const filtered = this.allOptions.filter(opt =>
      opt.toLowerCase().includes(query)
    );
    this.renderOptions(filtered);
  }

  renderOptions(options) {
    this.optionsContainer.innerHTML = '';
    options.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'combo-option';
      const tps = MODELS[opt];
      div.textContent = tps ? `${opt} (${tps} TPS)` : opt;
      div.addEventListener('click', () => {
        this.input.value = opt;
        this.hideOptions();
        this.onSelect(opt);
      });
      this.optionsContainer.appendChild(div);
    });
  }

  setValue(val) {
    this.input.value = val;
    this.onSelect(val);
  }
}

class Simulator {
  constructor(cardId, terminalId, statsTpsId, statsTokensId, sliderId, displayId, manualControlId, staticTpsId, comboId, optionsId, inputId, onChange) {
    this.card = document.getElementById(cardId);
    this.terminal = document.querySelector(`#${terminalId} .content`);
    this.terminalContainer = document.getElementById(terminalId);
    this.statsTps = document.getElementById(statsTpsId);
    this.statsTokens = document.getElementById(statsTokensId);
    this.slider = document.getElementById(sliderId);
    this.display = document.getElementById(displayId);
    this.manualControl = document.getElementById(manualControlId);
    this.staticTpsDisplay = document.getElementById(staticTpsId);
    this.onChange = onChange;

    this.tps = 50;
    this.isActive = false;
    this.tokenCount = 0;
    this.lastTokenTime = 0;
    this.wordIndex = 0;
    this.animationId = null;

    this.comboBox = new ComboBox(comboId, optionsId, inputId, (val) => this.handleSelection(val));

    this.init();
  }

  init() {
    this.slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.display.textContent = val;
      if (this.comboBox.input.value === 'Manual Control' || this.comboBox.input.value === '') {
        this.tps = val;
        this.updateStats();
        this.onChange();
      }
    });
  }

  handleSelection(val) {
    if (val === 'Manual Control' || val === '') {
      this.manualControl.classList.remove('hidden');
      if (this.staticTpsDisplay) this.staticTpsDisplay.classList.add('hidden');
      this.tps = parseInt(this.slider.value);
    } else {
      this.manualControl.classList.add('hidden');
      if (this.staticTpsDisplay) {
        this.staticTpsDisplay.classList.remove('hidden');
        this.tps = MODELS[val];
        this.staticTpsDisplay.textContent = `${this.tps} TPS`;
      } else {
        this.tps = MODELS[val];
      }
    }
    this.updateStats();
    this.onChange();
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.lastTokenTime = performance.now();
    this.tick();
  }

  stop() {
    this.isActive = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  clear() {
    this.terminal.innerHTML = '';
    this.tokenCount = 0;
    this.wordIndex = 0;
    this.updateStats();
  }

  tick() {
    if (!this.isActive) return;
    const now = performance.now();
    const elapsed = now - this.lastTokenTime;
    const msPerToken = 1000 / this.tps;

    if (elapsed >= msPerToken) {
      const tokensToEmit = Math.floor(elapsed / msPerToken);
      for (let i = 0; i < tokensToEmit; i++) {
        this.addToken();
      }
      this.lastTokenTime = now - (elapsed % msPerToken);
      this.updateStats();
    }
    this.animationId = requestAnimationFrame(() => this.tick());
  }

  addToken() {
    const span = document.createElement('span');
    span.textContent = words[this.wordIndex] + ' ';
    this.terminal.appendChild(span);
    this.wordIndex = (this.wordIndex + 1) % words.length;
    this.tokenCount++;
    this.terminalContainer.scrollTop = this.terminalContainer.scrollHeight;

    if (this.terminal.childNodes.length > 500) {
      this.terminal.removeChild(this.terminal.firstChild);
    }
  }

  updateStats() {
    this.statsTps.textContent = `Current TPS: ${this.tps}`;
    this.statsTokens.textContent = `Tokens: ${this.tokenCount}`;
  }

  getState() {
    const modelValue = this.comboBox.input.value;
    return {
      model: modelValue || 'Manual Control',
      tps: this.tps
    };
  }

  setState(state) {
    if (state.model) {
      this.comboBox.setValue(state.model);
    }
    if (state.model === 'Manual Control' && state.tps) {
      this.slider.value = state.tps;
      this.display.textContent = state.tps;
      this.tps = state.tps;
      this.updateStats();
    }
  }
}

// State Management
function syncUrl() {
  const params = new URLSearchParams();
  const stateA = simA.getState();
  const stateB = simB.getState();
  const isComparing = !cardB.classList.contains('hidden');

  params.set('mA', stateA.model);
  if (stateA.model === 'Manual Control') params.set('tA', stateA.tps);

  if (isComparing) {
    params.set('compare', '1');
    params.set('mB', stateB.model);
    if (stateB.model === 'Manual Control') params.set('tB', stateB.tps);
  }

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

const simA = new Simulator(
  'card-a', 'terminal-a', 'stats-a-tps', 'stats-a-tokens',
  'tps-slider-a', 'tps-display-a', 'manual-control-a', 'static-tps-a',
  'combo-a', 'model-a-options', 'model-a-input', syncUrl
);

const simB = new Simulator(
  'card-b', 'terminal-b', 'stats-b-tps', 'stats-b-tokens',
  'tps-slider-b', 'tps-display-b', 'manual-control-b', 'static-tps-b',
  'combo-b', 'model-b-options', 'model-b-input', syncUrl
);

const compareToggleBtn = document.getElementById('compare-toggle-btn');
const closeBBtn = document.getElementById('close-b-btn');
const comparisonContainer = document.getElementById('comparison-container');
const cardB = document.getElementById('card-b');

function toggleComparison(show, silent = false) {
  if (show) {
    cardB.classList.remove('hidden');
    comparisonContainer.classList.remove('single-view');
    compareToggleBtn.classList.add('hidden');
  } else {
    cardB.classList.add('hidden');
    comparisonContainer.classList.add('single-view');
    compareToggleBtn.classList.remove('hidden');
    simB.stop();
  }
  if (!silent) syncUrl();
}

compareToggleBtn.addEventListener('click', () => toggleComparison(true));
closeBBtn.addEventListener('click', () => toggleComparison(false));

// Load initial state
function loadState() {
  const params = new URLSearchParams(window.location.search);

  if (params.has('mA')) {
    simA.setState({
      model: params.get('mA'),
      tps: parseInt(params.get('tA'))
    });
  }

  if (params.get('compare') === '1') {
    toggleComparison(true, true);
    if (params.has('mB')) {
      simB.setState({
        model: params.get('mB'),
        tps: parseInt(params.get('tB'))
      });
    }
  }
}

loadState();

document.getElementById('start-btn').addEventListener('click', () => {
  simA.start();
  if (!cardB.classList.contains('hidden')) simB.start();
});

document.getElementById('stop-btn').addEventListener('click', () => {
  simA.stop();
  simB.stop();
});

document.getElementById('clear-btn').addEventListener('click', () => {
  simA.clear();
  simB.clear();
});
