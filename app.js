const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

const S = {
  screen: "onboardingLevel",
  topic: "일상",
  level: "초급",
  tempLevel: "초급",
  levelSheet: false,
  onboardingLevel: "초급",
  onboardingSpeed: "Normal (x1.0)",
  reminder: true,
  speed: "Normal (x1.0)",
  turn: 0,
  mission: 0,
  hint: false,
  keyboard: false,
  typedTurns: [],
  feedbackOpen: null,
  reportDetail: null,
  lessonMode: "default",
  customLevel: "초급",
  customScenario: {
    topic: "",
    userRole: "",
    aiRole: "",
  },
};

const topics = ["일상", "학업", "직업", "사회", "문화", "여행"];
const levels = ["입문", "초급", "초중급", "중급", "고급"];
const onboardingLevels = [
  { label: "Starter", value: "입문", desc: "아주 짧은 표현부터 차근차근 연습하고 싶어요." },
  { label: "Beginner", value: "초급", desc: "기초적인 짧은 문장은 말할 수 있어요. 회화 감각을 키우고 싶어요." },
  { label: "Pre-Intermediate", value: "초중급", desc: "조금은 말할 수 있지만 더 자연스러워지고 싶어요." },
  { label: "Intermediate", value: "중급", desc: "일상 대화는 어느 정도 가능해요. 좀 더 체계적으로 말해보고 싶어요." },
  { label: "Advanced", value: "고급", desc: "대부분의 상황에서 말할 수 있어요. 더 정확하고 상세한 표현을 사용하고 싶어요." },
];
const speedOptions = [
  { label: "A Little faster", value: "A Little faster (x1.2)", desc: "원어민끼리 말하는 속도예요." },
  { label: "Normal", value: "Normal (x1.0)", desc: "평소 말하는 속도와 같아요." },
  { label: "A Little Slow", value: "A Little Slow (x0.9)", desc: "조금 더 쉽게 들리는 속도예요." },
  { label: "Slow", value: "Slow (x0.8)", desc: "학습하기 좋은 느린 템포예요." },
];

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

const lessonContent = {
  default: {
    emoji: "✂️",
    title: "미용실에서 원하는 머리 설명하기",
    summary: "미용사에게 원하는 머리와 앞머리 요청을 말해 봐요.",
    userRole: "손님",
    aiRole: "미용사",
    missions: ["머리를 조금 다듬고 싶다고 말하기", "앞머리를 특별히 신경 써 달라고 요청하기"],
    words,
    expressions: todayExpressions,
    turns: [
      { speaker: "ai", text: "Hello! How can I help you today?", ko: "안녕하세요. 오늘 어떻게 도와드릴까요?" },
      { speaker: "me", text: "I'd like to trim my hair a little.", status: "perfect" },
      { speaker: "ai", text: "Sure. How much would you like me to cut?", ko: "네. 얼마나 자르고 싶으세요?" },
      { speaker: "me", text: "Just a little, please.", status: "better" },
      { speaker: "ai", text: "Okay. What about your bangs?", ko: "좋아요. 앞머리는 어떻게 할까요?" },
      { speaker: "me", text: "At the same level my eyebrows.", status: "correction" },
    ],
    hints: [
      [["I'd like to trim my hair a little.", "머리를 조금 다듬고 싶어요."], ["Just a little trim, please.", "조금만 다듬어 주세요."]],
      [["Please pay special attention to my bangs.", "앞머리를 특별히 신경 써 주세요."], ["Please be careful with my bangs.", "앞머리를 조심해서 해 주세요."]],
    ],
    feedback: {
      better: { title: "더 좋은 표현", sentence: "Just a little trim, please.", note: "의미 전달은 되지만 자연스럽지 않아요." },
      correction: { title: "교정된 문장", sentence: "At the same level as my eyebrows.", note: "전치사 사용에 주의하세요." },
      perfect: { title: "완벽한 문장", sentence: "좋아요. 자연스럽게 전달됐어요.", note: "이 표현 그대로 사용해도 괜찮아요." },
    },
    report: {
      words: "21개",
      time: "2분 18초",
      feedback: "오늘의 미션을 잘 완료했어요. 다음에는 <b>pay attention to</b>를 한 덩어리 표현으로 기억해 보세요.",
      correctionWrong: "Please special attention my bangs.",
      correctionRight: "Please pay special attention to my bangs.",
      correctionNote: "“신경 써 주세요”는 영어로 <b>pay special attention to</b>처럼 말해요. <b>pay</b>와 <b>to</b>가 함께 필요해요.",
    },
  },
  custom: {
    emoji: "🩺",
    title: "병원에서 증상 자세히 설명하기",
    summary: "의사에게 어젯밤부터 시작된 몸살과 열 증상을 설명해 봐요.",
    userRole: "환자",
    aiRole: "의사",
    missions: ["어디가 아픈지 말하기", "어젯밤부터 몸살과 열이 난다고 자세히 설명하기"],
    words: [
      { word: "symptom", meaning: "증상", example: "What symptoms do you have?", ko: "어떤 증상이 있으세요?", focus: "symptoms" },
      { word: "fever", meaning: "열", example: "I have a fever.", ko: "열이 나요.", focus: "fever" },
      { word: "body aches", meaning: "몸살, 몸이 쑤심", example: "I have body aches.", ko: "몸살이 있어요.", focus: "body aches" },
      { word: "since", meaning: "...부터", example: "I've felt sick since last night.", ko: "어젯밤부터 아팠어요.", focus: "since" },
      { word: "temperature", meaning: "체온", example: "My temperature is high.", ko: "체온이 높아요.", focus: "temperature" },
    ],
    expressions: [
      {
        pattern: "I've had~ since...",
        meaning: "...부터 계속 ~이 있어요",
        examples: [
          { fixed: "I've had", variable: "a fever since last night.", ko: "어젯밤부터 열이 있어요." },
          { fixed: "I've had", variable: "body aches since last night.", ko: "어젯밤부터 몸살이 있어요." },
          { fixed: "I've had", variable: "these symptoms since yesterday.", ko: "어제부터 이런 증상이 있어요." },
        ],
      },
      {
        pattern: "I also feel~",
        meaning: "또 ...한 느낌이 들어요",
        examples: [
          { fixed: "I also feel", variable: "chills.", ko: "오한도 느껴져요." },
          { fixed: "I also feel", variable: "very tired.", ko: "너무 피곤해요." },
          { fixed: "I also feel", variable: "sore all over.", ko: "온몸이 쑤셔요." },
        ],
      },
    ],
    turns: [
      { speaker: "ai", text: "Hello. What seems to be the problem today?", ko: "안녕하세요. 오늘 어디가 불편하신가요?" },
      { speaker: "me", text: "I have a fever and body aches.", status: "perfect" },
      { speaker: "ai", text: "When did the symptoms start?", ko: "증상은 언제부터 시작됐나요?" },
      { speaker: "me", text: "Since last night, I feel fever.", status: "better" },
      { speaker: "ai", text: "Can you describe your symptoms in more detail?", ko: "증상을 조금 더 자세히 설명해 주시겠어요?" },
      { speaker: "me", text: "I have had body aches and a fever since last night.", status: "correction" },
    ],
    hints: [
      [["I have a fever and body aches.", "열과 몸살이 있어요."], ["I feel sick and achy.", "아프고 몸이 쑤셔요."]],
      [["I've had a fever since last night.", "어젯밤부터 열이 있어요."], ["I also feel chills and body aches.", "오한과 몸살도 있어요."]],
    ],
    feedback: {
      better: { title: "더 좋은 표현", sentence: "I've had a fever since last night.", note: "의미는 전달되지만 증상이 계속되는 상황에는 현재완료가 더 자연스러워요." },
      correction: { title: "교정된 문장", sentence: "I've had body aches and a fever since last night.", note: "어젯밤부터 지금까지 이어지는 증상은 I've had로 말해요." },
      perfect: { title: "완벽한 문장", sentence: "좋아요. 증상을 자연스럽게 전달했어요.", note: "이 표현 그대로 사용해도 괜찮아요." },
    },
    report: {
      words: "24개",
      time: "2분 34초",
      feedback: "증상과 시작 시점을 잘 설명했어요. 다음에는 <b>I've had</b>와 <b>since last night</b>를 함께 기억해 보세요.",
      correctionWrong: "I have had body aches and a fever since last night.",
      correctionRight: "I've had body aches and a fever since last night.",
      correctionNote: "증상이 과거부터 지금까지 이어질 때는 <b>I've had</b>처럼 줄여 말하면 더 자연스럽게 들려요.",
    },
  },
};

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

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function activeLesson() {
  const lesson = lessonContent[S.lessonMode] || lessonContent.default;
  if (S.lessonMode !== "custom") return lesson;
  return {
    ...lesson,
    summary: S.customScenario.topic,
    userRole: S.customScenario.userRole,
    aiRole: S.customScenario.aiRole,
  };
}

function renderMissions(lesson = activeLesson()) {
  return `
    <div class="missions">
      <h3>오늘의 미션</h3>
      ${lesson.missions.map((mission, index) => `<p><b>${index + 1}</b> ${mission}</p>`).join("")}
    </div>
  `;
}

function filteredScenarios() {
  return scenarios.filter((s) => {
    const topicOk = s.topic === S.topic;
    const levelOk = s.level === S.level;
    return topicOk && levelOk;
  });
}

function onboardingLevel() {
  return `
    <section class="screen onboarding-screen">
      ${phoneStatus()}
      <header class="onboarding-hero">
        <small>TalkFlow 시작 설정</small>
        <h1>나에게 맞는 대화로 시작해요</h1>
      </header>

      <section class="onboarding-section">
        <h2>영어 말하기 수준을 선택해 주세요.</h2>
        <p>난이도에 맞는 대화문을 추천해 드려요.</p>
        <div class="choice-list level-choice-list">
          ${onboardingLevels.map((item) => `
            <button class="${S.onboardingLevel === item.value ? "active" : ""}" data-onboarding-level="${item.value}">
              <span>${item.label}</span>
              <em>${item.desc}</em>
            </button>
          `).join("")}
        </div>
      </section>

      ${dock("다음", "next-onboarding")}
    </section>
  `;
}

function onboardingSpeed() {
  return `
    <section class="screen onboarding-screen">
      ${topbar("", { back: true })}
      <header class="onboarding-hero">
        <small>TalkFlow 시작 설정</small>
        <h1>듣기 편한 속도를 골라요</h1>
      </header>

      <section class="onboarding-section">
        <h2>영어 말하기 속도를 선택하세요.</h2>
        <div class="choice-list speed-choice-list">
          ${speedOptions.map((item) => `
            <button class="${S.onboardingSpeed === item.value ? "active" : ""}" data-onboarding-speed="${item.value}">
              <span>${item.label}<small>${item.value.match(/\(.+\)/)?.[0] || ""}</small></span>
              <em>${item.desc}</em>
            </button>
          `).join("")}
        </div>
      </section>

      ${dock("TalkFlow 시작하기", "finish-onboarding")}
    </section>
  `;
}

function home() {
  const cards = filteredScenarios();
  return `
    <section class="screen home-screen">
      ${phoneStatus()}
      <header class="home-title">
        <h1>TalkFlow</h1>
      </header>

      <button class="practice-banner" data-act="today">
        <span>
          <small>AI가 추천해 주는</small>
          <b>오늘의 대화</b>
          <strong class="recommend-meta">${S.level} · ${S.speed}</strong>
          <em>바로 시작 ›</em>
        </span>
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
      <h2>원하는 대화를 만들어 보세요</h2>
      <p class="sub">상황과 역할을 입력하면 맞춤형 대화를 할 수 있어요.</p>

      <section class="custom-level-section">
        <b>레벨 선택</b>
        <div class="custom-level-options">
          ${levels.map((level) => `<button class="${S.customLevel === level ? "active" : ""}" data-custom-level="${level}">${level}</button>`).join("")}
        </div>
      </section>

      <label class="field">
        <b>상황이나 주제 설명</b>
        <button class="recommend" data-act="recommend"><span>AI</span> 추천</button>
        <textarea id="custom-topic" maxlength="300" placeholder="예: 식당에서 내가 주문하지 않은 음식을 가져다 줍니다. 이에 상황을 설명하고 조치를 안내 받습니다." inputmode="text">${escapeHtml(S.customScenario.topic)}</textarea>
      </label>

      <label class="field">
        <b>나의 역할</b>
        <input id="custom-user" maxlength="50" placeholder="예: 손님" inputmode="text" autocomplete="off" value="${escapeHtml(S.customScenario.userRole)}">
      </label>

      <label class="field">
        <b>AI의 역할</b>
        <input id="custom-ai" maxlength="50" placeholder="예: 종업원" inputmode="text" autocomplete="off" value="${escapeHtml(S.customScenario.aiRole)}">
      </label>

      <div class="notice">
        <b>주의사항</b>
        <p>학습 목적에 맞지 않는 어휘나 내용을 입력할 경우, 시스템이 정상적으로 작동하지 않거나 이용이 제한될 수 있습니다.</p>
      </div>

      ${dock("입력 완료", "custom-start")}
    </section>
  `;
}

function roleBlock(lesson = activeLesson()) {
  return `
    <div class="role-stack">
      <div class="role-line user-role"><span>🙂</span><small>나의 역할</small><b>${escapeHtml(lesson.userRole)}</b></div>
      <div class="role-line ai-role"><span>${lesson.emoji}</span><small>AI의 역할</small><b>${escapeHtml(lesson.aiRole)}</b></div>
    </div>
  `;
}

function intro() {
  const lesson = activeLesson();
  return `
    <section class="screen intro-screen">
      ${topbar("", { back: true })}
      <h2>${escapeHtml(lesson.title)}</h2>
      <p class="sub">${escapeHtml(lesson.summary)}</p>
      <div class="hero-emoji">${lesson.emoji}</div>
      <div class="white-card">
        ${roleBlock(lesson)}
        ${renderMissions(lesson)}
      </div>
      ${dock("학습 시작하기", "words")}
    </section>
  `;
}

function wordView() {
  const lesson = activeLesson();
  return `
    <section class="screen learn-screen">
      ${topbar("오늘의 단어", { back: true })}
      ${progress(2)}
      <div class="learn-list">
        ${lesson.words.map((w, index) => `
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
  const lesson = activeLesson();
  return `
    <section class="screen learn-screen">
      ${topbar("오늘의 표현", { back: true })}
      ${progress(3)}
      <div class="today-expression-list">
        ${lesson.expressions.map((item, patternIndex) => `
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
  return activeLesson().expressions.map((item) => `
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
  const lesson = activeLesson();
  return `
    <section class="screen ready-screen">
      ${topbar("오늘의 대화", { back: true })}
      ${progress(5)}
      <h2>이제 직접 말해 보세요</h2>
      <p class="sub">틀려도 괜찮아요. AI가 대화를 이어갈게요.</p>
      <div class="white-card">
        ${roleBlock(lesson)}
        ${renderMissions(lesson)}
      </div>
      <div class="tip"><b>💡 말이 떠오르지 않나요?</b><br>힌트를 누르면 바로 말할 수 있는 쉬운 답변 두 개를 보여드려요.</div>
      ${dock("대화 시작하기", "start")}
    </section>
  `;
}

function turns(options = {}) {
  const lesson = activeLesson();
  const showUserFeedback = options.showUserFeedback !== false;
  const showRetry = options.showRetry !== false;
  const showAiTools = options.showAiTools !== false;
  const list = [];
  let meIndex = 0;
  lesson.turns.forEach((turn) => {
    if (turn.speaker === "ai") {
      if (meIndex <= S.turn) list.push(turn);
      return;
    }
    if (S.turn > meIndex) {
      list.push({ ...turn, text: S.typedTurns[meIndex] || turn.text, meIndex });
    }
    meIndex += 1;
  });
  return list.map((t, i) => `
    <div class="chat-row ${t.speaker}">
      <div class="bubble-line">
        ${t.speaker === "me" && showUserFeedback ? feedbackIcon(t.status, t.meIndex) : ""}
        <p>${escapeHtml(t.text)}</p>
        ${t.speaker === "me" && showRetry ? `<button class="retry-turn-btn" data-act="retry-turn" data-turn="${i}" aria-label="다시 녹음">↻</button>` : ""}
      </div>
      ${t.speaker === "me" && showUserFeedback && S.feedbackOpen === t.meIndex ? feedbackPanel(t.status) : ""}
      ${t.speaker === "ai" && showAiTools ? `<div class="chat-tools"><button data-speak="${t.text}">🔊</button><button data-translation="l${i}">🌐</button></div><em id="translation-l${i}" class="translation hidden">${t.ko}</em>` : ""}
    </div>
  `).join("");
}

function feedbackIcon(status, meIndex) {
  const labels = {
    perfect: "완벽한 문장",
    better: "더 좋은 표현 제안",
    correction: "교정이 필요한 문장",
  };
  const symbols = {
    perfect: "✓",
    better: "🫴",
    correction: "!",
  };
  if (status === "perfect") {
    return `<span class="feedback-icon ${status}" aria-label="${labels[status]}">${symbols[status]}</span>`;
  }
  return `<button class="feedback-icon ${status}" data-act="feedback" data-feedback="${meIndex}" aria-label="${labels[status]}">${symbols[status]}</button>`;
}

function feedbackPanel(status) {
  const feedback = activeLesson().feedback[status];
  return `
    <article class="inline-feedback ${status}">
      <p>${feedback.note}</p>
      <hr>
      <small>${feedback.title}</small>
      <b>${feedback.sentence}</b>
    </article>
  `;
}

function currentAiPrompt() {
  const prompt = activeLesson().turns.filter((turn) => turn.speaker === "ai")[S.turn];
  return [prompt?.text || "", prompt?.ko || ""];
}

function hintSheet() {
  if (!S.hint) return "";
  const hints = activeLesson().hints[S.turn < 2 ? 0 : 1];
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

function keyboardComposer() {
  if (!S.keyboard) return "";
  return `
    <div class="keyboard-composer" data-stop>
      <div class="keyboard-entry">
        <input id="keyboard-text" maxlength="180" placeholder="여기에 입력하세요." inputmode="text" enterkeyhint="send" autocomplete="off" autofocus>
        <button class="send-btn" data-act="submit-keyboard" aria-label="보내기">➤</button>
      </div>
      <button class="close-keyboard-btn" data-act="close-keyboard" aria-label="닫기">×</button>
    </div>
  `;
}

function live() {
  const lesson = activeLesson();
  const totalMissions = lesson.missions.length;
  return `
    <section class="screen live-screen ${S.keyboard ? "typing-mode" : ""}">
      ${topbar("오늘의 대화", { back: true })}
      <div class="live-mission-panel">
        <div class="mission-count">오늘의 미션 <b>${S.mission}/${totalMissions} 완료</b></div>
        <div class="mission-bar"><i style="width:${(S.mission / totalMissions) * 100}%"></i></div>
        <div class="live-mission-list">
          ${lesson.missions.map((mission, index) => `
            <p class="${S.mission > index ? "done" : ""}"><span>${S.mission > index ? "✓" : index + 1}</span> ${mission}</p>
          `).join("")}
        </div>
      </div>
      <div class="chat live-chat">${turns()}</div>
      <div class="input ${S.keyboard ? "typing" : ""}">
        ${keyboardComposer()}
        <button class="keyboard-btn" data-act="keyboard" aria-label="키보드 입력">⌨️</button>
        <button class="mic-main-btn" data-act="mic" aria-label="마이크로 말하기">🎙️</button>
        <button class="hint-icon-btn" data-act="hint" aria-label="힌트 보기">💡</button>
      </div>
      ${hintSheet()}
    </section>
  `;
}

function report() {
  const lesson = activeLesson();
  return `
    <section class="screen report-screen">
      ${topbar("학습 리포트")}
      <h2 class="report-title">${escapeHtml(lesson.title)}</h2>
      <div class="report-metrics">
        <div class="metric-card"><small>말한 단어</small><b>${lesson.report.words}</b></div>
        <div class="metric-card"><small>대화 시간</small><b>${lesson.report.time}</b></div>
        <div class="metric-card"><small>미션 평가</small><b>${lesson.missions.length}/${lesson.missions.length}</b></div>
      </div>
      <button class="menu-row" data-report-detail="corrections">교정 문장 <b>1개</b><span>›</span></button>
      <button class="menu-row" data-report-detail="better">더 좋은 표현 문장 <b>0개</b><span>›</span></button>
      <button class="menu-row" data-report-detail="conversation">전체 대화 내용 보기 <span>›</span></button>
      <div class="feedback-card">
        <b>AI 피드백</b>
        <p>${lesson.report.feedback}</p>
      </div>
      ${dock("학습 완료", "home")}
    </section>
  `;
}

function reportDetail() {
  const lesson = activeLesson();
  const data = {
    corrections: {
      title: "교정 문장",
      body: `
        <article class="detail-card">
          <small>내가 말한 문장</small>
          <p class="wrong-sentence">${escapeHtml(lesson.report.correctionWrong)}</p>
          <small>교정 문장</small>
          <p class="correct-sentence">${escapeHtml(lesson.report.correctionRight)}</p>
          <div class="detail-note">${lesson.report.correctionNote}</div>
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
        <div class="chat report-chat">
          ${turns({ showUserFeedback: false, showRetry: false, showAiTools: false })}
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

const views = { onboardingLevel, onboardingSpeed, home, profile, free: freeView, intro, words: wordView, expressions: exprView, ready, live, report, reportDetail };

function render() {
  app.innerHTML = views[S.screen]();
  document.querySelector(".phone").scrollTop = 0;
}

function go(screen) {
  S.screen = screen;
  S.levelSheet = false;
  S.hint = false;
  S.keyboard = false;
  render();
}

function submitUserTurn(text = "") {
  const cleaned = text.trim();
  if (cleaned) S.typedTurns[S.turn] = cleaned;
  S.turn += 1;
  if (S.turn === 1) S.mission = 1;
  if (S.turn >= 3) S.mission = activeLesson().missions.length;
  S.keyboard = false;
  S.feedbackOpen = null;
  if (S.turn > 3) go("report");
  else render();
}

function back() {
  const map = { onboardingSpeed: "onboardingLevel", free: "home", intro: "home", words: "intro", expressions: "words", ready: "expressions", live: "ready", profile: "home", reportDetail: "report" };
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

  const onboardingLevel = e.target.closest("[data-onboarding-level]");
  if (onboardingLevel) {
    S.onboardingLevel = onboardingLevel.dataset.onboardingLevel;
    render();
    return;
  }

  const onboardingSpeed = e.target.closest("[data-onboarding-speed]");
  if (onboardingSpeed) {
    S.onboardingSpeed = onboardingSpeed.dataset.onboardingSpeed;
    render();
    return;
  }

  const customLevel = e.target.closest("[data-custom-level]");
  if (customLevel) {
    S.customLevel = customLevel.dataset.customLevel;
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

  const field = e.target.closest(".field");
  if (field && !e.target.closest("button")) {
    field.querySelector("textarea, input")?.focus();
  }

  const keyboardEntry = e.target.closest(".keyboard-entry");
  if (keyboardEntry && !e.target.closest("button")) {
    keyboardEntry.querySelector("#keyboard-text")?.focus();
  }

  const inputBar = e.target.closest(".input");
  if (inputBar && S.screen === "live" && !S.keyboard && !e.target.closest("button")) {
    S.keyboard = true;
    render();
    setTimeout(() => document.querySelector("#keyboard-text")?.focus(), 0);
    return;
  }

  const speak = e.target.closest("[data-speak]");
  if (speak) {
    notify(`듣기: ${speak.dataset.speak}`);
    return;
  }

  const action = e.target.closest("[data-act]")?.dataset.act;
  if (!action) return;

  if (["home", "profile", "free", "words", "expressions", "ready"].includes(action)) go(action);
  else if (action === "next-onboarding") {
    go("onboardingSpeed");
  }
  else if (action === "finish-onboarding") {
    S.level = S.onboardingLevel;
    S.tempLevel = S.onboardingLevel;
    S.speed = S.onboardingSpeed;
    notify("맞춤 추천 설정이 저장되었어요.");
    setTimeout(() => go("home"), 500);
  }
  else if (action === "intro") {
    S.lessonMode = "default";
    go("intro");
  }
  else if (action === "today") {
    S.lessonMode = "default";
    notify("AI가 오늘의 대화를 골랐어요.");
    setTimeout(() => go("intro"), 500);
  } else if (action === "level-sheet") {
    S.tempLevel = S.level;
    S.levelSheet = true;
    render();
  } else if (action === "confirm-level") {
    S.level = S.tempLevel;
    S.onboardingLevel = S.tempLevel;
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
    const topicValue = document.querySelector("#custom-topic")?.value.trim() || "";
    const userRoleValue = document.querySelector("#custom-user")?.value.trim() || "";
    const aiRoleValue = document.querySelector("#custom-ai")?.value.trim() || "";
    if (!topicValue || !userRoleValue || !aiRoleValue) {
      notify("상황과 역할을 모두 입력해 주세요.");
      return;
    }
    S.lessonMode = "custom";
    S.customScenario = {
      topic: topicValue,
      userRole: userRoleValue,
      aiRole: aiRoleValue,
    };
    S.turn = 0;
    S.mission = 0;
    S.typedTurns = [];
    S.feedbackOpen = null;
    notify("입력한 내용으로 학습을 만들었어요.");
    setTimeout(() => go("intro"), 500);
  } else if (action === "start") {
    S.turn = 0;
    S.mission = 0;
    S.typedTurns = [];
    go("live");
  } else if (action === "mic") {
    submitUserTurn();
  } else if (action === "hint") {
    S.hint = true;
    render();
  } else if (action === "close") {
    S.hint = false;
    render();
  } else if (action === "keyboard") {
    S.keyboard = true;
    render();
    setTimeout(() => document.querySelector("#keyboard-text")?.focus(), 0);
  } else if (action === "feedback") {
    const next = Number(e.target.closest("[data-feedback]")?.dataset.feedback);
    S.feedbackOpen = S.feedbackOpen === next ? null : next;
    render();
  } else if (action === "retry-turn") {
    const meRowsBeforeButton = [...document.querySelectorAll(".retry-turn-btn")].indexOf(e.target.closest(".retry-turn-btn"));
    if (meRowsBeforeButton >= 0) {
      S.turn = meRowsBeforeButton;
      S.typedTurns = S.typedTurns.slice(0, meRowsBeforeButton);
      S.mission = meRowsBeforeButton === 0 ? 0 : 1;
      S.feedbackOpen = null;
      S.keyboard = true;
      render();
      setTimeout(() => document.querySelector("#keyboard-text")?.focus(), 0);
    }
  } else if (action === "close-keyboard") {
    S.keyboard = false;
    render();
  } else if (action === "submit-keyboard") {
    const value = document.querySelector("#keyboard-text")?.value || "";
    if (!value.trim()) {
      notify("영어 문장을 입력해 주세요.");
      return;
    }
    submitUserTurn(value);
  } else if (action === "finish") {
    S.turn = 3;
    S.mission = 2;
    go("report");
  } else if (action === "speed") {
    const currentIndex = speedOptions.findIndex((item) => item.value === S.speed);
    S.speed = speedOptions[(currentIndex + 1) % speedOptions.length].value;
    S.onboardingSpeed = S.speed;
    render();
  } else if (action === "reminder") {
    S.reminder = !S.reminder;
    render();
  } else if (action === "soon") {
    notify("이 대화는 곧 추가될 예정이에요.");
  } else if (action === "back") back();
});

app.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || e.target?.id !== "keyboard-text") return;
  e.preventDefault();
  const value = e.target.value || "";
  if (!value.trim()) {
    notify("영어 문장을 입력해 주세요.");
    return;
  }
  submitUserTurn(value);
});

render();
