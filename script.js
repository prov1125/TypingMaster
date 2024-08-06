// 단어 리스트
const words = ["hello", "world", "javascript", "coding", "challenge", "typing", "master", "keyboard", "programming", "developer"];

// 게임 상태 변수
let score = 0;
let time = 10; // 제한 시간 10초
let isPlaying = false;
let interval;
let currentWord;

// 최고 점수 저장 및 불러오기
let highScores = JSON.parse(localStorage.getItem('highScores')) || []; // 로컬 스토리지에서 최고 점수 가져오기

// DOM 요소 가져오기
const wordDisplay = document.querySelector('.word-display');
const wordInput = document.querySelector('.word-input');
const timeDisplay = document.querySelector('.time');
const scoreDisplay = document.querySelector('.score');
const button = document.querySelector('.button');

// 초기화 시 데이터 구조 검증 및 변환
highScores = highScores.map(entry => {
  if (typeof entry === 'object' && entry.name && entry.score) {
    return entry; // 이미 올바른 형식인 경우 그대로 반환
  } else if (typeof entry === 'number') {
    return { name: 'Unknown', score: entry }; // 기존에 점수만 저장된 경우 처리
  } else {
    return { name: 'Unknown', score: 0 }; // 잘못된 형식의 데이터 처리
  }
});

// 게임 초기화
function init() {
  button.addEventListener('click', startGame);
  wordInput.addEventListener('input', checkMatch);
  wordInput.disabled = true; // 게임 시작 전에는 입력 비활성화
  displayHighScores(); // 최고 점수 표시
}

// 게임 시작
function startGame() {
  score = 0;
  time = 20;
  isPlaying = true;
  wordInput.disabled = false; // 게임 시작 시 입력 활성화
  wordInput.focus(); // 입력 상자에 포커스
  wordInput.placeholder = '여기에 단어를 입력하세요!'
  button.textContent = '게임 중...';
  button.disabled = true; // 게임 중에는 버튼 비활성화
  scoreDisplay.textContent = score;
  timeDisplay.textContent = time;
  showNewWord();
  interval = setInterval(countDown, 1000);
}

// 새로운 단어 표시
function showNewWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];
  wordDisplay.textContent = currentWord;
  wordInput.value = '';
}

// 단어 일치 여부 확인
function checkMatch() {
  if (wordInput.value === currentWord) {
    score++;
    scoreDisplay.textContent = score;
    showNewWord();
  }
}

// 시간 카운트다운
function countDown() {
  if (time > 0) {
    time--;
    timeDisplay.textContent = time;
  } else {
    clearInterval(interval);
    endGame();
  }
}

// 게임 종료
function endGame() {
  isPlaying = false;
  wordInput.disabled = true; // 게임 종료 시 입력 비활성화
  wordInput.placeholder = '게임시작 버튼을 눌러 시작하세요.'
  button.textContent = '게임시작';
  button.disabled = false; // 게임 종료 시 버튼 활성화

  const playerName = prompt('이름을 입력하세요:', '플레이어'); // 사용자 이름 입력
  if (playerName) {
    saveScore(playerName, score); // 이름과 점수 저장
    displayHighScores(); // 최고 점수 업데이트
    alert(`게임 종료! 최종 점수: ${score}점`);
  } else {
    alert('이름을 입력해야 순위에 등록됩니다.');
  }
}

// 점수 저장
function saveScore(name, newScore) {
  highScores.push({ name, score: newScore });
  highScores.sort((a, b) => b.score - a.score); // 높은 점수 순으로 정렬
  highScores = highScores.slice(0, 5); // 최고 점수 상위 5개 유지
  localStorage.setItem('highScores', JSON.stringify(highScores)); // 로컬 스토리지에 저장
}

// 최고 점수 표시
function displayHighScores() {
  const highScoresList = document.querySelector('.high-scores-list');
  highScoresList.innerHTML = highScores
    .filter(entry => entry.name && entry.score) // name과 score가 있는 항목만 필터링
    .map((entry, index) => `<li>${index + 1}위: ${entry.name} - ${entry.score}점</li>`)
    .join('');
}


// 게임 초기화 함수 호출
init();
