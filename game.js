'use strict';

const $ = (id) => document.getElementById(id);
const electronCases = [
  { symbol: 'Na', name: '나트륨', shells: '2, 8, 1', valence: 1, action: 'lose', count: 1, ion: 'Na⁺', result: '2, 8', story: '잠깐, 문 잠갔나? 아니, 열었나?! 으..머릿속에서 알람이 계속 울려요!' },
  { symbol: 'Mg', name: '마그네슘', shells: '2, 8, 2', valence: 2, action: 'lose', count: 2, ion: 'Mg²⁺', result: '2, 8', story: '밤새 달렸는데 다리가 아직도 뛰고 있어요.. 멈춰...! 제발 멈추라고!' },
  { symbol: 'Al', name: '알루미늄', shells: '2, 8, 3', valence: 3, action: 'lose', count: 3, ion: 'Al³⁺', result: '2, 8', story: '출근하다가 냉장고에 가방을 넣었어요... 제 머리가 완전히 고장 났나 봐요!' },
  { symbol: 'Cl', name: '염소', shells: '2, 8, 7', valence: 7, action: 'gain', count: 1, ion: 'Cl⁻', result: '2, 8, 8', story: '분명 누가 제 이름을 불렀는데… 화분이었어요! 화분이 말을 해요, 말을 한다니까요?!' },
  { symbol: 'O', name: '산소', shells: '2, 6', valence: 6, action: 'gain', count: 2, ion: 'O²⁻', result: '2, 8', story: '으아악! 시계 소리도, 발소리도 전부 짜증 나요! 지금 폭발할 것 같아요!' },
  { symbol: 'F', name: '플루오린', shells: '2, 7', valence: 7, action: 'gain', count: 1, ion: 'F⁻', result: '2, 8', story: '하하, 웃으면 안 되는데 웃음이 멈추질 않아요! 하하하하하하하하!!' }
];
// First twenty elements: bonding exceptions are not forced into fictitious ions.
const elementRows = [
  ['H','수소',[1]], ['He','헬륨',[2]], ['Li','리튬',[2,1]], ['Be','베릴륨',[2,2]],
  ['B','붕소',[2,3]], ['C','탄소',[2,4]], ['N','질소',[2,5]], ['O','산소',[2,6]],
  ['F','플루오린',[2,7]], ['Ne','네온',[2,8]], ['Na','나트륨',[2,8,1]], ['Mg','마그네슘',[2,8,2]],
  ['Al','알루미늄',[2,8,3]], ['Si','규소',[2,8,4]], ['P','인',[2,8,5]], ['S','황',[2,8,6]],
  ['Cl','염소',[2,8,7]], ['Ar','아르곤',[2,8,8]], ['K','칼륨',[2,8,8,1]], ['Ca','칼슘',[2,8,8,2]]
];
const sharedCases = {
  H: { count: 1, product: 'H₂', explanation: '두 수소 원자가 전자쌍 하나를 공유하면 각각 전자 2개를 세는 듀엣을 만족합니다.' },
  B: { count: 3, product: 'BF₃', partner: '플루오린', explanation: 'BF₃에서 붕소는 플루오린 세 원자와 결합합니다. 붕소 주위 전자는 6개로, 옥텟 규칙의 예외입니다. B³⁺를 만드는 문제로 해석하지 않습니다.' },
  C: { count: 4, product: 'CH₄', explanation: '탄소는 수소 네 원자와 전자쌍 네 개를 공유합니다. 탄소는 옥텟, 각 수소는 듀엣을 만족합니다.' },
  Si: { count: 4, product: 'SiH₄', explanation: '규소는 수소 네 원자와 전자쌍 네 개를 공유하여 옥텟을 만족합니다. 각 수소는 듀엣을 만족합니다.' }
};
for (const [index, [symbol, name, layers]] of elementRows.entries()) {
  if (electronCases.some(c => c.symbol === symbol)) continue;
  const base = { symbol, name, shells: layers.join(', '), story: '약사님! 오늘 하루가 엉망진창이에요. 가져온 처방전부터 봐주세요!' };
  if (['He','Ne','Ar'].includes(symbol)) {
    electronCases.push({ ...base, kind: 'stable', answer: 'none', target: '전자 배치를 확인하고, 전자 이동이 필요한지 판단하세요.', explanation: `${name}은 이미 ${symbol === 'He' ? '첫 전자 껍질 2개(듀엣)' : '최외각 전자 8개(옥텟)'}로 채워져 있습니다. 전자를 잃거나 얻는 처방이 필요 없습니다. 손님의 감정과 전자 배치의 안정성은 별개입니다.` });
  } else if (sharedCases[symbol]) {
    const spec = sharedCases[symbol];
    electronCases.push({ ...base, kind: 'shared', answer: String(spec.count), target: `${spec.product}를 만들 ${spec.partner || '수소'} 원자 수를 선택하세요.`, partner: spec.partner || '수소', explanation: spec.explanation });
  } else {
    const valence = layers.at(-1), action = valence <= 3 ? 'lose' : 'gain', count = action === 'lose' ? valence : 8-valence;
    const result = action === 'lose' ? layers.slice(0,-1) : [...layers.slice(0,-1),8];
    const superscript = ['', '', '²', '³'][count];
    electronCases.push({ ...base, valence, action, count, ion: symbol + superscript + (action === 'lose' ? '⁺' : '⁻'), result: result.join(', ') });
  }
}
const specialCases = {
  ionic: { symbol: 'Na', name: '얼마 전 헤어진 나트륨', story: '헤어진 뒤로 자꾸 옛 애인한테 전화해요! 전화기를 숨겨도 또 찾고 있어요. 새로운 인연이 필요해요!', hint: 'Na: 최외각 전자 1개 / Cl: 최외각 전자 7개. 전자 하나가 이동하면 서로 반대 전하의 이온이 돼요.', answer: 'chlorine', explanation: '나트륨은 전자 1개를 잃어 Na⁺, 염소는 그 전자를 얻어 Cl⁻가 돼요. 두 이온은 정전기적 인력으로 결합해요. 실제 NaCl은 많은 이온이 반복 배열된 결정이에요.', reaction: 'Na → Na⁺ + e⁻  /  Cl + e⁻ → Cl⁻' },
  covalent: { symbol: 'O', name: '화가 잔뜩 난 산소', story: '오늘 너무 화가 나서 토스트기랑 싸웠어요! 아! 너무 화가 나네 정말!!', hint: '산소의 최외각 전자는 6개, 수소는 각각 1개. 전자를 주고받지 말고 전자쌍을 공유해 보세요.', answer: 'hydrogen-two', explanation: '산소는 수소 두 원자와 각각 전자쌍 하나를 공유해 H₂O를 이뤄요. 산소 주위에는 전자 8개, 각 수소 주위에는 2개가 있게 돼요. 시원해진다는 이야기는 비유이며, 실제 물 생성 반응은 열을 방출해요.', reaction: 'H — O — H  /  공유 전자쌍 2개' }
};
const state = { phase: 'welcome', score: 0, round: 0, combo: 0, lives: 3, correct: 0, current: null, choice: null, quantity: 1, remaining: 0, duration: 0, deadline: 0, frame: null, deck: [] };
let best = 0;
try { best = Number(localStorage.getItem('octet-best')) || 0; } catch { /* File URLs and private browsers may restrict storage. */ }
let arrivalTimer;
let departureTimer;
let handoffAnimation;
let rankings = [];
try {
  const saved = JSON.parse(localStorage.getItem('octet-rankings') || '[]');
  if (Array.isArray(saved)) rankings = saved.filter((entry) => Number.isFinite(entry.score) && entry.score >= 0 && Number.isInteger(entry.correct) && typeof entry.date === 'string').sort((a, b) => b.score - a.score).slice(0, 10);
} catch { /* The game also works without saved rankings. */ }

function showRankings() {
  $('ranking-list').replaceChildren();
  rankings.forEach((entry, index) => {
    const row = document.createElement('li');
    const rank = document.createElement('span');
    rank.className = 'rank-number';
    rank.textContent = String(index + 1).padStart(2, '0');
    const detail = document.createElement('span');
    detail.textContent = `성공 처방 ${entry.correct}회`;
    const date = document.createElement('small');
    date.textContent = entry.date;
    detail.append(date);
    const score = document.createElement('strong');
    score.textContent = `${entry.score}점`;
    row.append(rank, detail, score);
    $('ranking-list').append(row);
  });
  $('ranking-empty').hidden = rankings.length > 0;
  $('ranking-dialog').showModal();
}

function showView(id) {
  ['arrival', 'prescription', 'feedback', 'game-over'].forEach((view) => { $(view).hidden = view !== id; });
}
function updateDashboard() {
  $('score').textContent = String(state.score).padStart(4, '0');
  $('round').textContent = state.round;
  $('combo').textContent = state.combo;
  $('lives').textContent = Array.from({ length: 3 }, (_, i) => i < state.lives ? '♥' : '♡').join(' ');
  $('lives').setAttribute('aria-label', `남은 기회 ${state.lives}회`);
}
function renderTimer() {
  const percent = Math.max(0, state.remaining / state.duration * 100);
  $('time').textContent = `${Math.max(0, state.remaining / 1000).toFixed(1)}초`;
  $('timer-fill').style.width = `${percent}%`;
  $('timer-track').setAttribute('aria-valuenow', String(Math.round(percent)));
  $('timer-track').classList.toggle('urgent', percent < 25);
}
function tick() {
  if (state.phase !== 'playing') return;
  state.remaining = Math.max(0, state.deadline - performance.now());
  renderTimer();
  if (state.remaining <= 0) finish(false, true);
  else state.frame = requestAnimationFrame(tick);
}
function electronFromDeck() {
  if (!state.deck.length) {
    state.deck = [...electronCases];
    for (let i = state.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];
    }
  }
  return state.deck.pop();
}
function makeChoice(value, icon, title, description) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'choice';
  button.dataset.value = value;
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `<span class="choice-icon">${icon}</span><span><strong>${title}</strong><small>${description}</small></span>`;
  if (value === 'lose' || value === 'gain') {
    const box = document.createElement('span');
    box.className = `medicine-box medicine-box--${value}`;
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = `<span class="medicine-brand">OCTET ℞</span><span class="medicine-symbol">${value === 'lose' ? '−e⁻' : '+e⁻'}</span><span class="medicine-name">${value === 'lose' ? '전자 잃는 약' : '전자 얻는 약'}</span><span class="medicine-dose">ELECTRON RX</span>`;
    button.classList.add('medicine-choice');
    button.append(box);
  }
  button.addEventListener('click', () => {
    if (state.phase !== 'playing') return;
    state.choice = value;
    document.querySelectorAll('.choice').forEach((item) => {
      const selected = item.dataset.value === value;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    $('submit').disabled = false;
    updateSelection();
  });
  return button;
}
function nextCustomer() {
  cancelAnimationFrame(state.frame);
  clearTimeout(arrivalTimer);
  clearTimeout(departureTimer);
  state.round++;
  state.phase = 'arriving';
  state.choice = null;
  state.quantity = 1;
  // A repeating schedule guarantees both special cases in the first three visits.
  const scheduledKind = ['electron', 'ionic', 'covalent', 'electron', 'electron', 'electron'][(state.round - 1) % 6];
  const data = scheduledKind === 'electron' ? electronFromDeck() : specialCases[scheduledKind];
  const kind = data.kind || scheduledKind;
  state.current = { ...data, kind };
  renderPrescription();
  state.duration = Math.max(6000, 22000 - (state.round - 1) * 750);
  state.remaining = state.duration;
  $('case-type').textContent = kindNames[kind];
  $('symbol').textContent = data.symbol;
  $('customer-sprite').style.setProperty('--atom-color', { Na: '#e9c28b', Mg: '#a8d5b5', Al: '#b6c9d6', Cl: '#c7df94', O: '#edab94', F: '#b8d8c8' }[data.symbol] || '#d3cba2');
  setMood('unstable');
  $('customer-sprite').hidden = false;
  $('customer-sprite').classList.remove('leaving');
  $('stage-note').textContent = '상태 이상 · 긴급 처방 필요';
  $('customer-label').textContent = `PATIENT ${String(state.round).padStart(3, '0')}`;
  $('customer-name').textContent = data.name;
  $('customer-story').textContent = `“${data.story}”`;

  $('choices').replaceChildren();
  const options = kind === 'shared' ? [1, 2, 3, 4].map(n => [String(n), `${n}${data.partner === '플루오린' ? 'F' : 'H'}`, `${data.partner} ${n}개`, `${n}번 키`]) : kind === 'stable' ? [['lose', '−e⁻', '전자 잃는 약', 'A'], ['gain', '+e⁻', '전자 얻는 약', 'S'], ['none', '✓', '처방 불필요', 'D']] : kind === 'electron' ? [['lose', '−e⁻', '전자 잃게 하는 약', '전자를 내보내 양이온 만들기'], ['gain', '+e⁻', '전자 얻게 하는 약', '전자를 받아 음이온 만들기']] : kind === 'ionic' ? [['chlorine', 'Cl', '염소 원자 1개', '최외각 전자 7개인 새로운 인연'], ['neon', 'Ne', '네온 원자 1개', '최외각 전자 8개로 이미 안정'], ['sodium', 'Na', '나트륨 원자 1개', '똑같이 전자를 잃기 쉬운 친구']] : [['hydrogen-one', 'H', '수소 원자 1개', '수소 한 명과 만나기'], ['hydrogen-two', '2H', '수소 원자 2개', '수소 두 명과 전자쌍 공유하기'], ['helium', 'He', '헬륨 원자 1개', '전자 2개로 이미 안정한 친구']];
  options.forEach((option, index) => {
    const button = makeChoice(...option);
    const shortcut = document.createElement('kbd');
    shortcut.textContent = ['A', 'S', 'D', 'F'][index];
    button.prepend(shortcut);
    $('choices').append(button);
  });
  $('quantity-field').hidden = kind !== 'electron';
  document.querySelectorAll('[data-quantity]').forEach((button) => {
    button.classList.toggle('selected', button.dataset.quantity === '1');
    button.setAttribute('aria-pressed', String(button.dataset.quantity === '1'));
    button.disabled = false;
  });
  $('submit').disabled = true;
  updateSelection();
  $('pause').disabled = true;
  $('pause').textContent = '일시정지';
  $('timer-caption').textContent = '손님별 처방 제한 시간';
  showView('arrival');
  updateDashboard();
  renderTimer();
  const sprite = $('customer-sprite');
  sprite.classList.remove('entering');
  void sprite.offsetWidth;
  sprite.classList.add('entering');
  $('rx-paper').style.visibility = 'hidden';
  $('handoff-paper').hidden = false;
  // Arrival and handoff are separate phases; neither consumes prescription time.
  arrivalTimer = setTimeout(() => {
    if (state.phase !== 'arriving') return;
    sprite.classList.remove('entering');
    handOverPrescription();
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 700);
}
function finish(correct, timedOut = false) {
  if (state.phase !== 'playing') return;
  state.phase = 'departing';
  cancelAnimationFrame(state.frame);
  const c = state.current;
  let points = 0;
  if (correct) {
    state.combo++;
    state.correct++;
    points = 100 + Math.floor(state.remaining / state.duration * 50) + Math.min(state.combo - 1, 10) * 10;
    state.score += points;
  } else {
    state.lives--;
    state.combo = 0;
  }
  $('result-label').textContent = correct ? `PRESCRIPTION COMPLETE / +${points}점` : timedOut ? 'TIME OUT / 신뢰도 −1' : 'CHECK YOUR PRESCRIPTION / 신뢰도 −1';
  $('result-title').textContent = correct ? '처방 성공! 안정을 되찾았어요.' : timedOut ? '시간 초과 · 오답 노트에 기록했어요.' : '처방 오류 · 오답 노트에 기록했어요.';
  if (!correct) {
    mistakes.push({ round: state.round, name: c.name, symbol: c.symbol, kind: c.kind,
      nucleus: atomicNumbers[c.symbol], electrons: atomicNumbers[c.symbol], charge: 0,
      selected: choiceLabel(c, state.choice, state.quantity), timedOut,
      answer: correctLabel(c), explanation: explainCase(c) });
    saveMistakes();
  }
  $('result-reaction').textContent = c.kind === 'electron'
    ? `${c.symbol} [${shells[c.symbol]}] → ${correctLabel(c)} → ${c.ion} [${c.result.replaceAll(', ', ' · ')}]`
    : c.reaction || correctLabel(c);
  $('result-explanation').textContent = explainCase(c);
  document.querySelector('.result-notes').open = false;
  $('next-customer').textContent = state.lives > 0 ? '다음 손님 →' : '영업 결과 보기 →';
  $('next-customer').disabled = true;
  $('pause').disabled = true;
  updateDashboard();
  showView('feedback');
  setMood(correct ? 'happy' : 'furious');
  $('stage-note').textContent = correct ? '안정 회복 · 웃으며 귀가 중' : '상태 악화 · 소란스럽게 퇴장 중';
  $('customer-story').textContent = correct ? '“와! 이제 괜찮아요! 정말 고마워요, 약사님. 좋은 하루 보내세요!”' : timedOut ? '“으아아! 더는 못 기다려요! 머리가 터질 것 같다고요!”' : '“으아악! 세상이 더 빙글빙글 도는거 같아요!! 대체 뭘 준 거예요?!”';

  $('customer-sprite').classList.add('leaving');
  departureTimer = setTimeout(() => {
    if (state.phase !== 'departing') return;
    $('customer-sprite').hidden = true;
    $('stage-note').textContent = '손님이 약국을 떠났습니다';
    state.phase = 'feedback';
    $('next-customer').disabled = false;
    $('next-customer').focus({ preventScroll: true });
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 400 : 1400);
}
function pauseGame() {
  if (state.phase === 'playing') {
    state.remaining = Math.max(0, state.deadline - performance.now());
    if (!state.remaining) { finish(false, true); return; }
    state.phase = 'paused';
    cancelAnimationFrame(state.frame);
    renderTimer();
    $('pause').textContent = '계속하기';
    $('timer-caption').textContent = '일시정지 · 편하게 생각해보세요';
  } else if (state.phase === 'paused') {
    state.phase = 'playing';
    state.deadline = performance.now() + state.remaining;
    $('pause').textContent = '일시정지';
    $('timer-caption').textContent = '처방 제한 시간';
    tick();
  } else return;
  document.querySelectorAll('.choice, [data-quantity]').forEach((button) => { button.disabled = state.phase === 'paused'; });
  $('submit').disabled = state.phase === 'paused' || !state.choice;
}
function endGame() {
  if (state.phase !== 'feedback' || state.lives > 0) return;
  state.phase = 'over';
  best = Math.max(best, state.score);
  rankings.push({ score: state.score, correct: state.correct, date: new Date().toLocaleDateString('ko-KR') });
  rankings.sort((a, b) => b.score - a.score);
  rankings = rankings.slice(0, 10);
  try { localStorage.setItem('octet-rankings', JSON.stringify(rankings)); } catch { /* Keep session rankings when storage is unavailable. */ }
  try { localStorage.setItem('octet-best', String(best)); } catch { /* Scores still work without persistence. */ }
  $('final-score').textContent = `${state.score}점`;
  $('final-detail').textContent = `${state.round}명의 손님 중 ${state.correct}명에게 정확히 처방했어요. 배운 내용을 기억하고 다시 도전해보세요!`;
  $('best-score').textContent = `이 브라우저의 최고 기록: ${best}점`;
  $('shop-sign').firstChild.textContent = '영업 종료';
  renderMistakes($('review-list'), mistakes);
  $('save-status').textContent = storageAvailable ? '오답이 자동 저장되었습니다. 메인 화면에서도 다시 볼 수 있어요.' : '이 브라우저에서는 저장이 제한되어 현재 세션에서만 볼 수 있어요.';
  $('game-screen').classList.add('review-mode');
  showView('game-over');
  $('restart').focus({ preventScroll: true });
}
function startGame() {
  mistakes = [];
  $('game-screen').classList.remove('review-mode');
  $('main-menu').hidden = true;
  $('game-screen').hidden = false;
  window.scrollTo(0, 0);
  Object.assign(state, { score: 0, round: 0, combo: 0, lives: 3, correct: 0, deck: [] });
  $('shop-sign').firstChild.textContent = '영업 중';
  showTutorial();
}
$('start').addEventListener('click', startGame);
$('open-guide').addEventListener('click', () => $('guide-dialog').showModal());
$('close-guide').addEventListener('click', () => $('guide-dialog').close());
$('show-ranking').addEventListener('click', showRankings);
$('close-ranking').addEventListener('click', () => $('ranking-dialog').close());
$('back-menu').addEventListener('click', () => {
  cancelAnimationFrame(state.frame);
  clearTimeout(arrivalTimer);
  clearTimeout(departureTimer);
  state.phase = 'welcome';
  $('game-screen').hidden = true;
  $('main-menu').hidden = false;
  window.scrollTo(0, 0);
  $('start').focus({ preventScroll: true });
});
$('restart').addEventListener('click', startGame);
$('pause').addEventListener('click', pauseGame);
$('next-customer').addEventListener('click', () => {
  if (state.phase !== 'feedback') return;
  if (state.lives > 0) nextCustomer(); else endGame();
});
document.addEventListener('visibilitychange', () => { if (document.hidden && state.phase === 'playing') pauseGame(); });
$('prescription').addEventListener('submit', (event) => {
  event.preventDefault();
  if (state.phase !== 'playing' || !state.choice) return;
  state.remaining = Math.max(0, state.deadline - performance.now());
  renderTimer();
  if (!state.remaining) { finish(false, true); return; }
  const c = state.current;
  finish(c.kind === 'electron' ? state.choice === c.action && state.quantity === c.count : state.choice === c.answer);
});
document.querySelectorAll('[data-quantity]').forEach((button) => button.addEventListener('click', () => {
  if (state.phase !== 'playing') return;
  state.quantity = Number(button.dataset.quantity);
  updateSelection();
  document.querySelectorAll('[data-quantity]').forEach((item) => {
    const selected = item === button;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
}));

function setMood(mood) {
  $('customer-sprite').dataset.mood = mood;
  $('customer-face').textContent = { unstable: '◎ ﹏ ◉', happy: '＾ ▽ ＾', furious: '۞ 皿 ۞' }[mood];
  $('customer-sprite').setAttribute('aria-label', { unstable: '불안정하게 떨리는 손님', happy: '웃으며 퇴장하는 손님', furious: '상태가 악화되어 퇴장하는 손님' }[mood]);
}
function requestFullscreen() {
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}
$('fullscreen').addEventListener('click', requestFullscreen);
document.addEventListener('fullscreenchange', () => {
  $('fullscreen').hidden = Boolean(document.fullscreenElement);
  if (!document.fullscreenElement && state.phase === 'playing') pauseGame();
});

const atomicNumbers = Object.fromEntries(elementRows.map(([symbol], i) => [symbol, i + 1]));
const shells = Object.fromEntries(elementRows.map(([symbol, , layers]) => [symbol, layers.join(' · ')]));
const kindNames = { electron: '전자 조절', ionic: '이온결합', covalent: '공유결합', shared: '공유결합', stable: '안정성 확인' };
let mistakes = [];
let savedMistakes = [];
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem('octet-mistakes') || '[]');
  if (Array.isArray(saved)) savedMistakes = saved.filter(entry => entry && ['name', 'symbol', 'selected', 'answer', 'explanation'].every(key => typeof entry[key] === 'string')).slice(0, 3);
} catch { storageAvailable = false; }
function saveMistakes() {
  savedMistakes = mistakes.map(entry => ({ ...entry }));
  try { localStorage.setItem('octet-mistakes', JSON.stringify(savedMistakes)); }
  catch { storageAvailable = false; }
}
function renderPrescription() {
  const c = state.current;
  $('rx-number').textContent = `No. ${String(state.round).padStart(3, '0')}`;
  $('rx-name').textContent = `${c.name} (${c.symbol})`;
  $('rx-kind').textContent = kindNames[c.kind];
  $('rx-nucleus').textContent = `+${atomicNumbers[c.symbol]}`;
  $('rx-electrons').textContent = `${atomicNumbers[c.symbol]}개`;
  $('rx-charge').textContent = '0 · 중성';
  $('rx-shells').textContent = shells[c.symbol];
  $('rx-task').textContent = c.target || (c.kind === 'electron' ? (['Li', 'Be'].includes(c.symbol) ? '처방 목표: 전자를 잃어 첫 껍질 전자 2개(듀엣)의 이온을 만드세요.' : '처방 목표: 전자를 잃거나 얻어 최외각 전자 8개의 이온을 만드세요.') : c.kind === 'ionic' ? '처방 목표: NaCl을 이루도록 이온결합할 상대 원자를 선택하세요.' : '처방 목표: H₂O를 이루도록 공유결합할 상대 원자와 수를 선택하세요.');
}
function choiceLabel(c, choice, quantity) {
  if (!choice) return '선택하지 않음';
  if (c.kind === 'shared') return `${c.partner} 원자 ${choice}개`;
  if (c.kind === 'stable') return { none: '처방 불필요', lose: '전자 잃는 약', gain: '전자 얻는 약' }[choice];
  if (c.kind === 'electron') return `전자 ${quantity}개 ${choice === 'lose' ? '잃기' : '얻기'}`;
  return { chlorine: '염소 원자 1개', neon: '네온 원자 1개', sodium: '나트륨 원자 1개', 'hydrogen-one': '수소 원자 1개', 'hydrogen-two': '수소 원자 2개', helium: '헬륨 원자 1개' }[choice] || '선택하지 않음';
}
function correctLabel(c) {
  return choiceLabel(c, c.kind === 'electron' ? c.action : c.answer, c.count);
}
function explainCase(c) {
  if (c.kind !== 'electron') return c.explanation;
  const total = atomicNumbers[c.symbol] + (c.action === 'lose' ? -c.count : c.count);
  return `${c.name}의 원자핵 전하는 +${atomicNumbers[c.symbol]}, 처음 전자는 ${atomicNumbers[c.symbol]}개로 순전하가 0입니다. 전자 ${c.count}개를 ${c.action === 'lose' ? '잃으면' : '얻으면'} 전자가 ${total}개가 되어 ${c.ion} 이온이 됩니다. 전자 배치는 ${c.result}로 최외각 전자 ${total === 2 ? '2개(듀엣)' : '8개(옥텟)'}를 만족합니다. 이온의 전자 수를 다루는 단순화 모형이며 실제 결합에는 공유결합 성격과 반응 조건도 영향을 줍니다. 원자핵 전하는 그대로이며, 전자를 잃으면 양이온, 얻으면 음이온이 됩니다.`;
}
function renderMistakes(container, entries) {
  container.replaceChildren();
  if (!entries.length) { const empty = document.createElement('p'); empty.textContent = '저장된 오답이 없어요. 게임을 플레이하면 이곳에 복습 기록이 쌓입니다.'; container.append(empty); return; }
  entries.forEach(entry => {
    const card = document.createElement('article'); card.className = 'review-card';
    const heading = document.createElement('h4'); heading.textContent = `${entry.round}번째 손님 · ${entry.name} (${entry.symbol})`;
    const info = document.createElement('p'); info.className = 'review-info'; info.textContent = `처방전: 원자핵 +${entry.nucleus} / 전자 ${entry.electrons}개 / 순전하 ${entry.charge}`;
    const mine = document.createElement('p'); mine.className = 'review-wrong'; mine.textContent = entry.timedOut ? `시간 초과 · 미제출 (당시 선택: ${entry.selected})` : `내 처방: ${entry.selected}`;
    const answer = document.createElement('p'); answer.className = 'review-right'; answer.textContent = `올바른 처방: ${entry.answer}`;
    const explanation = document.createElement('p'); explanation.textContent = entry.explanation;
    const details = document.createElement('details');
    const summary = document.createElement('summary'); summary.textContent = '해설 보기';
    details.append(summary, explanation);
    card.append(heading, info, mine, answer, details); container.append(card);
  });
}
function updateSelection() {
  $('submit').textContent = state.choice ? `${choiceLabel(state.current, state.choice, state.quantity)} · 처방 ↵` : '처방을 선택하세요';
}
$('open-review').addEventListener('click', () => { renderMistakes($('saved-review'), savedMistakes); $('review-dialog').showModal(); });
$('close-review').addEventListener('click', () => $('review-dialog').close());
document.addEventListener('keydown', event => {
  if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || document.querySelector('dialog[open]')) return;
  if (event.code === 'KeyP' && ['playing', 'paused'].includes(state.phase)) { event.preventDefault(); pauseGame(); return; }
  if (state.phase !== 'playing' || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  const key = ({ Enter: 'enter', NumpadEnter: 'enter' })[event.code];
  const choices = document.querySelectorAll('.choice');
  const choiceIndex = ['KeyA', 'KeyS', 'KeyD', 'KeyF'].indexOf(event.code);
  if (choiceIndex !== -1) { event.preventDefault(); choices[choiceIndex]?.click(); }
  if (/^(Digit|Numpad)[1-4]$/.test(event.code)) {
    event.preventDefault();
    const quantity = event.code.at(-1);
    if (state.current.kind === 'electron') document.querySelector(`[data-quantity="${quantity}"]`)?.click();
    // These choices are amounts of the same partner atom, not different medicines.
    if (state.current.kind === 'shared') choices[Number(quantity) - 1]?.click();
  }
  if (key === 'enter') { event.preventDefault(); if (state.choice) $('prescription').requestSubmit(); }
});

function handOverPrescription() {
  state.phase = 'handoff';
  $('stage-note').textContent = '처방전 건네는 중…';
  const paper = $('handoff-paper');
  const from = paper.getBoundingClientRect();
  const to = $('rx-paper').getBoundingClientRect();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  handoffAnimation = paper.animate([
    { transform: 'translate(0, 0) rotate(-12deg) scale(1)', opacity: 1 },
    { transform: `translate(${to.x + to.width/2 - from.x - from.width/2}px, ${to.y + to.height/2 - from.y - from.height/2}px) rotate(0deg) scale(2)`, opacity: 0.3 }
  ], { duration: reduced ? 0 : 850, easing: 'ease-in-out', fill: 'forwards' });
  handoffAnimation.finished.then(() => {
    if (state.phase !== 'handoff') return;
    paper.hidden = true;
    handoffAnimation.cancel();
    $('rx-paper').style.visibility = 'visible';
    $('stage-note').textContent = '처방전 접수 완료 · 처방해주세요';
    state.phase = 'playing';
    showView('prescription');
    $('pause').disabled = false;
    state.deadline = performance.now() + state.remaining;
    if (document.hidden) pauseGame(); else tick();
  }).catch(() => {});
}
function showTutorial() {
  state.phase = 'tutorial';
  $('customer-sprite').hidden = true;
  $('rx-paper').style.visibility = 'hidden';
  showView('arrival');
  updateDashboard();
  $('pause').disabled = true;
  $('tutorial-dialog').showModal();
}
$('begin-shift').addEventListener('click', () => {
  if (state.phase !== 'tutorial') return;
  $('tutorial-dialog').close();
  nextCustomer();
});
$('tutorial-dialog').addEventListener('cancel', event => event.preventDefault());
