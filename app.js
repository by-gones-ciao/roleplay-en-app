const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

const S = {
  screen: "home",
  topic: "일상",
  level: "초급",
  tempLevel: "초급",
  levelSheet: false,
  reminder: true,
  speed: "보통",
  turn: 0,
  mission: 0,
  hint: false,
  keyboard: false,
  reportDetail: null,
};

const topics = ["일상", "학업", "직업", "사회", "문화", "여행"];
const levels = ["입문", "초급", "초중급", "중급", "고급"];

const scenarios = [
  { emoji: "✂️", topic: "일상", level: "초급", title: "미용실에서 원하는 머리 설명하기" },
  { emoji: "☕", topic: "일상", level: "초급", title: "카페에서 원하는 음료 주문하기" },
  { emoji: "🛒", topic: "일상", level: "초급", title: "마트에서 필요한 물건 찾기" },
  { emoji: "🛫", topic: "일상", level: "초급", title: "공항에서 탑승구 물어보기" },
  { emoji: "🏫", topic: "학업", level: "초급", title: "수업에서 과제 질문하기" },
  { emoji: "💼", topic: "직업", level: "초중급", title: "회의 시간을 다시 확인하기" },
  { emoji: "🤝", topic: "사회", level: "중급", title: "처음 만난 사람과 가볍게 대화하기" },
  { emoji: "🎭", topic: "문화", level: "중급", title: "공연장에서 좌석 위치 묻기" },
  { emoji: "✈️", topic: "여행", level: "초급", title: "호텔 체크인 요청하기" },
  { emoji: "🧳", topic: "여행", level: "입문", title: "공항에서 탑승구 물어보기" },
];

const words = [
  { word: "trim", meaning: "다듬다", example: "I'd like a trim.", ko: "머리를 다듬고 싶어요.", focus: "trim" },
  { word: "hair", meaning: "머리카락", example: "Please trim my hair.", ko: "제 머리를 다듬어 주세요.", focus: "hair" },
  { word: "bangs", meaning: "앞머리", example: "Please trim my bangs.", ko: "제 앞머리를 다듬어 주세요.", focus: "bangs" },
  { word: "a little", meaning: "조금", example: "Just a little, please.", ko: "조금만 해 주세요.", focus: "a little" },
  { word: "shorter", meaning: "더 짧게", example: "A little shorter, please.", ko: "조금 더 짧게 해 주세요.", focus: "shorter" },
];

const todayExpressions = [
  {
    pattern: "I'd like to~",
    meaning: "...을/를 하고 싶어요",
    examples: [
      { fixed: "I'd like to", variable: "make a reservation.", ko: "예약을 하고 싶어요." },
      { fixed: "I'd like to", variable: "get a haircut.", ko: "머리를 자르고 싶어요." },
      { fixed: "I'd like to", variable: "get a perm.", ko: "펌을 하고 싶어요." },
    ],
  },
  {
    pattern: "Please be careful with~",
    meaning: "...을/를 특별히 신경 써 주세요",
    examples: [
      { fixed: "Please be careful with", variable: "my bangs.", ko: "앞머리를 특별히 신경 써 주세요." },
      { fixed: "Please be careful with", variable: "the length.", ko: "길이를 특별히 신경 써 주세요." },
      { fixed: "Please be careful with", variable: "the sides.", ko: "옆머리를 특별히 신경 써 주세요." },
    ],
  },
];

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 1600);
}

function phoneStatus() {
  return `<div class="phone-status"><span>9:41</span><span>▮▮▮  Wi‑Fi  ▰</span></div>`;
}

function topbar(title, options = {}) {
  const back = options.back ? `<button class="icon-btn" data-act="back" aria-label="뒤로">‹</button>` : `<span class="icon-space"></span>`;
  return `
    ${phoneStatus()}
    <header class="topbar">
      ${back}
      <h1>${title}</h1>
      <span class="icon-space"></span>
    </header>
  `;
}

function bottomNav(active = "home") {
  return `
    <nav class="bottom-nav">
      <button class="${active === "home" ? "active" : ""}" data-act="home">
        <span>⌂</span><b>홈</b>
      </button>
      <button class="${active === "profile" ? "active" : ""}" data-act="profile">
        <span>☺</span><b>프로필</b>
      </button>
    </nav>
  `;
}

function progress(step) {
  return `<div class="progress"><i style="width:${(step / 6) * 100}%"></i></div>`;
}

function dock(label, act, extra = "") {
  return `<div class="dock"><button class="primary" data-act="${act}">${label}</button>${extra}</div>`;
}

function highlightFocus(text, focus) {
  const escaped = focus.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(escaped, "i"), (match) => `<span class="word-focus">${match}</span>`);
}

function filteredScenarios() {
  return scenarios.filter((s) => {
    const topicOk = s.topic === S.topic;
    const levelOk = s.level === S.level;
    return topicOk && levelOk;
  });
}

function home() {
  const cards = filteredScenarios();
  return `
    <section class="screen home-screen">
      ${phoneStatus()}
      <header class="home-title">
        <h1>오늘의 대화</h1>
      </header>

      <button class="practice-banner" data-act="today">
        <span>
          <b>AI와 대화하며<br>안전하게 실수해 보세요</b>
          <em>오늘의 대화 시작</em>
        </span>
        <i>💬</i>
      </button>

      <section class="topics-head">
        <h2>Topics</h2>
        <button class="level-select" data-act="level-sheet">레벨 선택 ▾</button>
      </section>

      <div class="topic-tabs">
        ${topics.map((topic) => `<button class="${S.topic === topic ? "active" : ""}" data-topic="${topic}">${topic}</button>`).join("")}
      </div>

      <button class="custom-scenario-card" data-act="free">
        <span class="custom-emoji">✨</span>
        <span>
          <b>나만의 시나리오</b>
          <small>원하는 상황과 역할로 맞춤형 대화를 만들어요.</small>
        </span>
        <i>›</i>
      </button>

      <div class="scenario-grid">
        ${cards.map((s) => `
          <button class="topic-card" data-act="${s.title.includes("미용실") ? "intro" : "soon"}">
            <span>${s.emoji}</span>
            <b>${s.title}</b>
            <small>${s.level}</small>
          </button>
        `).join("")}
      </div>

      ${cards.length ? "" : `<div class="empty-card">선택한 레벨의 대화가 아직 준비 중이에요.</div>`}
      ${bottomNav("home")}
      ${levelSheet()}
    </section>
  `;
}

function levelSheet() {
  if (!S.levelSheet) return "";
  return `
    <div class="backdrop" data-act="close-sheet">
      <div class="sheet" data-stop>
        <div class="handle"></div>
        <h2>레벨 선택</h2>
        <div class="level-options">
          ${levels.map((level) => `
            <button class="${S.tempLevel === level ? "active" : ""}" data-temp-level="${level}">
              <span></span>${level}
            </button>
          `).join("")}
        </div>
        <button class="primary" data-act="confirm-level">확인</button>
      </div>
    </div>
  `;
}

function profile() {
  return `
    <section class="screen profile-screen">
      ${topbar("프로필")}
      <div class="profile-card">
        <div class="profile-avatar">☺</div>
        <h2>나의 학습 설정</h2>
        <p>초급 학습자에게 맞춰 천천히, 안전하게 연습해요.</p>
      </div>

      <button class="setting-row" data-act="level-sheet">
        <span>코스 선택</span><b>${S.level}</b>
      </button>
      <button class="setting-row" data-act="speed">
        <span>속도 변경하기</span><b>${S.speed}</b>
      </button>
      <button class="setting-row" data-act="reminder">
        <span>리마인더</span><b>${S.reminder ? "ON" : "OFF"}</b>
      </button>

      ${bottomNav("profile")}
      ${levelSheet()}
    </section>
  `;
}

function freeView() {
  return `
    <section class="screen free-screen">
      ${topbar("나만의 시나리오", { back: true })}
      <h2>원하는 대화를 만들어 보세요.</h2>
      <p class="sub">상황과 역할을 입력하면 맞춤형 대화를 할 수 있어요.</p>

      <label class="field">
        <b>상황이나 주제 설명</b>
        <button class="recommend" data-act="recommend">AI 추천</button>
        <textarea id="custom-topic" maxlength="300" placeholder="예: 서점에서 원하는 영어책을 찾고 싶어요."></textarea>
      </label>

      <label class="field">
        <b>나의 역할</b>
        <input id="custom-user" maxlength="50" placeholder="예: 손님">
      </label>

      <label class="field">
        <b>AI의 역할</b>
        <input id="custom-ai" maxlength="50" placeholder="예: 서점 직원">
      </label>

      <div class="notice">
        <b>주의사항</b>
        <p>학습 목적에 맞지 않는 어휘나 내용을 입력할 경우, 시스템이 정상적으로 작동하지 않거나 이용이 제한될 수 있습니다.</p>
      </div>

      ${dock("학습 시작하기", "custom-start")}
    </section>
  `;
}

function roleBlock() {
  return `
    <div class="role-stack">
      <div class="role-line user-role"><span>🙂</span><small>나의 역할</small><b>손님</b></div>
      <div class="role-line ai-role"><span>✂️</span><small>AI의 역할</small><b>미용사</b></div>
    </div>
  `;
}

function intro() {
  return `
    <section class="screen intro-screen">
      ${topbar("", { back: true })}
      <h2>미용실에서 원하는 머리 설명하기</h2>
      <p class="sub">미용사에게 원하는 머리와 앞머리 요청을 말해 봐요.</p>
      <div class="hero-emoji">✂️</div>
      <div class="white-card">
        ${roleBlock()}
        <div class="missions">
          <h3>오늘의 미션</h3>
          <p><b>1</b> 머리를 조금 다듬고 싶다고 말하기</p>
          <p><b>2</b> 앞머리를 특별히 신경 써 달라고 요청하기</p>
        </div>
      </div>
      ${dock("학습 시작하기", "words")}
    </section>
  `;
}

function wordView() {
  return `
    <section class="screen learn-screen">
      ${topbar("오늘의 단어", { back: true })}
      ${progress(2)}
      <div class="learn-list">
        ${words.map((w, index) => `
          <article class="learn-card">
            <div class="word-main">
              <button class="mini-sound" data-speak="${w.word}" aria-label="${w.word} 듣기">▶</button>
              <div>
                <b>${w.word}</b>
                <small>${w.meaning}</small>
              </div>
            </div>
            <div class="word-example">
              <button class="mini-sound" data-speak="${w.example}" aria-label="예문 듣기">▶</button>
              <em>${highlightFocus(w.example, w.focus)}</em>
              <button class="translate-btn" data-translation="word${index}" aria-label="예문 번역 보기">🌐</button>
            </div>
            <p id="translation-word${index}" class="word-translation hidden">${w.ko}</p>
          </article>
        `).join("")}
      </div>
      ${dock("오늘의 표현 배우기", "expressions")}
    </section>
  `;
}

function exprView() {
  return `
    <section class="screen learn-screen">
      ${topbar("오늘의 표현", { back: true })}
      ${progress(3)}
      <div class="today-expression-list">
        ${todayExpressions.map((item, patternIndex) => `
          <article class="pattern-card">
            <div class="pattern-head">
              <button class="mini-sound" data-speak="${item.pattern}" aria-label="표현 듣기">▶</button>
              <div class="pattern-title-copy">
                <h2>${item.pattern}</h2>
                <p>${item.meaning}</p>
              </div>
            </div>
            <ol class="pattern-examples">
              ${item.examples.map((ex, exampleIndex) => `
                <li>
                  <button class="mini-sound" data-speak="${ex.fixed} ${ex.variable}" aria-label="예문 듣기">▶</button>
                  <div class="example-en">
                    <span class="fixed">${ex.fixed}</span>
                    <span class="variable">${ex.variable}</span>
                  </div>
                  <button class="translate-btn" data-translation="expr${patternIndex}-${exampleIndex}" aria-label="예문 번역 보기">🌐</button>
                  <em id="translation-expr${patternIndex}-${exampleIndex}" class="expression-translation hidden">${ex.ko}</em>
                </li>
              `).join("")}
            </ol>
          </article>
        `).join("")}
      </div>
      ${dock("오늘의 대화", "ready")}
    </section>
  `;
}

function reportExpressionList() {
  return todayExpressions.map((item) => `
        <article class="pattern-card">
          <div class="pattern-head">
            <div>
              <h2>${item.pattern}</h2>
              <p>${item.meaning}</p>
            </div>
          </div>
        </article>
      `).join("")}

function ready() {
  return `
    <section class="screen ready-screen">
      ${topbar("오늘의 대화", { back: true })}
      ${progress(5)}
      <h2>이제 직접 말해 보세요</h2>
      <p class="sub">틀려도 괜찮아요. AI가 대화를 이어갈게요.</p>
      <div class="white-card">
        ${roleBlock()}
        <div class="missions">
          <h3>오늘의 미션</h3>
          <p><b>1</b> 머리를 조금 다듬고 싶다고 말하기</p>
          <p><b>2</b> 앞머리를 특별히 신경 써 달라고 요청하기</p>
        </div>
      </div>
      <div class="tip"><b>💡 말이 떠오르지 않나요?</b><br>힌트를 누르면 바로 말할 수 있는 쉬운 답변 두 개를 보여드려요.</div>
      ${dock("대화 시작하기", "start")}
    </section>
  `;
}

function turns() {
  const list = [["ai", "Hello! How can I help you today?", "안녕하세요. 오늘 어떻게 도와드릴까요?"]];
  if (S.turn > 0) list.push(["me", "I'd like to trim my hair a little.", "머리를 조금 다듬고 싶어요."]);
  if (S.turn > 0) list.push(["ai", "Sure. How much would you like me to cut?", "네. 얼마나 자르고 싶으세요?"]);
  if (S.turn > 1) list.push(["me", "Just a little, please.", "조금만 해 주세요."]);
  if (S.turn > 1) list.push(["ai", "Okay. What about your bangs?", "좋아요. 앞머리는 어떻게 할까요?"]);
  if (S.turn > 2) list.push(["me", "Please special attention my bangs.", "교정이 필요한 문장이에요."]);
  return list.map((t, i) => `
    <div class="chat-row ${t[0]}">
      <small>${t[0] === "ai" ? "AI · 미용사" : "나 · 손님"}</small>
      <p>${t[1]}</p>
      ${t[0] === "ai" ? `<div class="chat-tools"><button data-speak="${t[1]}">🔊</button><button data-translation="l${i}">🌐</button></div><em id="translation-l${i}" class="translation hidden">${t[2]}</em>` : `<em class="translation">${t[2]}</em>`}
    </div>
  `).join("");
}

function hintSheet() {
  if (!S.hint) return "";
  const hints = S.turn < 2
    ? [["I'd like to trim my hair a little.", "머리를 조금 다듬고 싶어요."], ["Just a little trim, please.", "조금만 다듬어 주세요."]]
    : [["Please pay special attention to my bangs.", "앞머리를 특별히 신경 써 주세요."], ["Please be careful with my bangs.", "앞머리를 조심해서 해 주세요."]];
  return `
    <div class="backdrop" data-act="close">
      <div class="sheet" data-stop>
        <div class="handle"></div>
        <h2>이렇게 말해 보세요</h2>
        <p class="sub">힌트는 대화를 자동으로 진행하지 않아요.</p>
        ${hints.map((h, i) => `<button class="hint-choice" data-speak="${h[0]}"><small>힌트 ${i + 1}</small><b>${h[0]}</b><em>${h[1]}</em></button>`).join("")}
        <button class="secondary" data-act="close">닫기</button>
      </div>
    </div>
  `;
}

function live() {
  return `
    <section class="screen live-screen">
      ${topbar("오늘의 대화", { back: true })}
      <div class="live-mission-panel">
        <div class="mission-count">오늘의 미션 <b>${S.mission}/2 완료</b></div>
        <div class="mission-bar"><i style="width:${(S.mission / 2) * 100}%"></i></div>
        <div class="live-mission-list">
          <p class="${S.mission > 0 ? "done" : ""}"><span>${S.mission > 0 ? "✓" : "1"}</span> 머리를 조금 다듬고 싶다고 말하기</p>
          <p class="${S.mission > 1 ? "done" : ""}"><span>${S.mission > 1 ? "✓" : "2"}</span> 앞머리를 특별히 신경 써 달라고 요청하기</p>
        </div>
      </div>
      <div class="chat live-chat">${turns()}</div>
      <div class="input">
        <button class="keyboard-btn" data-act="keyboard" aria-label="키보드 입력">⌨️</button>
        <button class="mic-main-btn" data-act="mic" aria-label="마이크로 말하기">🎙️</button>
        <button class="hint-icon-btn" data-act="hint" aria-label="힌트 보기">💡</button>
      </div>
      ${hintSheet()}
    </section>
  `;
}

function report() {
  return `
    <section class="screen report-screen">
      ${topbar("학습 리포트")}
      <h2 class="report-title">미용실에서 원하는 머리 설명하기</h2>
      <div class="report-metrics">
        <div class="metric-card"><small>말한 단어</small><b>21개</b></div>
        <div class="metric-card"><small>대화 시간</small><b>2분 18초</b></div>
      </div>
      <div class="mission-eval-card">
        <div>
          <small>미션 평가</small>
          <b>2/2 완료</b>
        </div>
        <p>머리를 조금 다듬고 싶다는 요청과 앞머리를 신경 써 달라는 요청을 모두 전달했어요.</p>
      </div>
      <button class="menu-row" data-report-detail="corrections">교정 문장 <b>1개</b><span>›</span></button>
      <button class="menu-row" data-report-detail="better">더 좋은 표현 문장 <b>0개</b><span>›</span></button>
      <button class="menu-row" data-report-detail="conversation">전체 대화 내용 보기 <span>›</span></button>
      <div class="feedback-card">
        <b>AI 피드백</b>
        <p>오늘의 미션을 잘 완료했어요. 다음에는 <b>pay attention to</b>를 한 덩어리 표현으로 기억해 보세요.</p>
      </div>
      ${dock("학습 완료", "home")}
    </section>
  `;
}

function reportDetail() {
  const data = {
    corrections: {
      title: "교정 문장",
      body: `
        <article class="detail-card">
          <small>내가 말한 문장</small>
          <p class="wrong-sentence">Please special attention my bangs.</p>
          <small>교정 문장</small>
          <p class="correct-sentence">Please pay special attention to my bangs.</p>
          <div class="detail-note">“신경 써 주세요”는 영어로 <b>pay special attention to</b>처럼 말해요. <b>pay</b>와 <b>to</b>가 함께 필요해요.</div>
        </article>
      `,
    },
    better: {
      title: "더 좋은 표현 문장",
      body: `
        <article class="detail-card empty-detail">
          <b>0개</b>
          <p>이번 대화에서는 문법과 상황이 맞으면서 별도로 더 자연스러운 표현을 제안할 문장이 없었어요.</p>
        </article>
      `,
    },
    conversation: {
      title: "전체 대화 내용",
      body: `
        <div class="report-conversation">
          <div class="report-line ai"><small>AI · 미용사</small><p>Hello! How can I help you today?</p><em>안녕하세요. 오늘 어떻게 도와드릴까요?</em></div>
          <div class="report-line me"><small>나 · 손님</small><p>I'd like to trim my hair a little.</p><em>머리를 조금 다듬고 싶어요.</em></div>
          <div class="report-line ai"><small>AI · 미용사</small><p>Sure. How much would you like me to cut?</p><em>네. 얼마나 자르고 싶으세요?</em></div>
          <div class="report-line me"><small>나 · 손님</small><p>Just a little, please.</p><em>조금만 해 주세요.</em></div>
          <div class="report-line ai"><small>AI · 미용사</small><p>Okay. What about your bangs?</p><em>좋아요. 앞머리는 어떻게 할까요?</em></div>
          <div class="report-line me needs-correction"><small>나 · 손님</small><p>Please special attention my bangs.</p><em>교정: Please pay special attention to my bangs.</em></div>
        </div>
      `,
    },
  }[S.reportDetail || "corrections"];

  return `
    <section class="screen report-screen">
      ${topbar(data.title, { back: true })}
      ${data.body}
    </section>
  `;
}

const views = { home, profile, free: freeView, intro, words: wordView, expressions: exprView, ready, live, report, reportDetail };

function render() {
  app.innerHTML = views[S.screen]();
  document.querySelector(".phone").scrollTop = 0;
}

function go(screen) {
  S.screen = screen;
  S.levelSheet = false;
  S.hint = false;
  render();
}

function back() {
  const map = { free: "home", intro: "home", words: "intro", expressions: "words", ready: "expressions", live: "ready", profile: "home", reportDetail: "report" };
  go(map[S.screen] || "home");
}

app.addEventListener("click", (e) => {
  if (e.target.closest("[data-stop]")) e.stopPropagation();

  const topic = e.target.closest("[data-topic]");
  if (topic) {
    S.topic = topic.dataset.topic;
    render();
    return;
  }

  const tempLevel = e.target.closest("[data-temp-level]");
  if (tempLevel) {
    S.tempLevel = tempLevel.dataset.tempLevel;
    render();
    return;
  }

  const translation = e.target.closest("[data-translation]");
  if (translation) {
    document.querySelector(`#translation-${translation.dataset.translation}`)?.classList.toggle("hidden");
    return;
  }

  const reportDetailButton = e.target.closest("[data-report-detail]");
  if (reportDetailButton) {
    S.reportDetail = reportDetailButton.dataset.reportDetail;
    go("reportDetail");
    return;
  }

  const speak = e.target.closest("[data-speak]");
  if (speak) {
    notify(`듣기: ${speak.dataset.speak}`);
    return;
  }

  const action = e.target.closest("[data-act]")?.dataset.act;
  if (!action) return;

  if (["home", "profile", "free", "intro", "words", "expressions", "ready"].includes(action)) go(action);
  else if (action === "today") {
    notify("AI가 오늘의 대화를 골랐어요.");
    setTimeout(() => go("intro"), 500);
  } else if (action === "level-sheet") {
    S.tempLevel = S.level;
    S.levelSheet = true;
    render();
  } else if (action === "confirm-level") {
    S.level = S.tempLevel;
    S.levelSheet = false;
    render();
  } else if (action === "close-sheet") {
    S.levelSheet = false;
    render();
  } else if (action === "recommend") {
    document.querySelector("#custom-topic").value = "의사는 환자에게 어디가 아픈지 물어본다. 이에 환자는 어젯밤부터 몸살과 열이 나는 증상을 자세히 설명한다.";
    document.querySelector("#custom-user").value = "환자";
    document.querySelector("#custom-ai").value = "의사";
    notify("AI 추천 내용이 입력되었어요.");
  } else if (action === "custom-start") {
    notify("추천한 내용으로 오늘의 대화를 시작해요.");
    setTimeout(() => go("live"), 500);
  } else if (action === "start") {
    S.turn = 0;
    S.mission = 0;
    go("live");
  } else if (action === "mic") {
    S.turn += 1;
    if (S.turn === 1) S.mission = 1;
    if (S.turn >= 3) S.mission = 2;
    if (S.turn > 3) go("report");
    else render();
  } else if (action === "hint") {
    S.hint = true;
    render();
  } else if (action === "close") {
    S.hint = false;
    render();
  } else if (action === "keyboard") {
    notify("키보드 입력은 다음 단계에서 연결할 예정이에요.");
  } else if (action === "finish") {
    S.turn = 3;
    S.mission = 2;
    go("report");
  } else if (action === "speed") {
    S.speed = S.speed === "보통" ? "천천히" : S.speed === "천천히" ? "빠르게" : "보통";
    render();
  } else if (action === "reminder") {
    S.reminder = !S.reminder;
    render();
  } else if (action === "soon") {
    notify("이 대화는 곧 추가될 예정이에요.");
  } else if (action === "back") back();
});

render();
