const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

const S = {
  screen: "onboardingLevel",
  topic: "일상",
  level: "초급",
  tempLevel: "초급",
  tempSpeed: "Normal (x1.0)",
  tempNotificationPeriod: "오전",
  tempNotificationHour: "9",
  tempNotificationMinute: "00",
  levelSheet: false,
  speedSheet: false,
  notificationSheet: false,
  topicExpanded: false,
  onboardingLevel: "초급",
  onboardingSpeed: "Normal (x1.0)",
  notificationTime: "오전 9:00",
  speed: "Normal (x1.0)",
  turn: 0,
  mission: 0,
  hint: false,
  keyboard: false,
  typedTurns: [],
  feedbackOpen: null,
  reportDetail: null,
  lessonMode: "default",
  liveEntry: "flow",
  continueConversation: false,
  finalizingConversation: false,
  exitConfirm: false,
  customLevel: "초급",
  customScenario: {
    topic: "",
    userRole: "",
    aiRole: "",
  },
};

const topics = ["일상", "여행", "생활 서비스", "건강", "관계", "직업", "학업", "여가/문화", "사회/의견"];
const levels = ["입문", "초급", "초중급", "중급", "고급"];
const levelConversationRules = {
  입문: { minAnswers: 5, maxAnswers: 10, wrapUpNoticeAnswer: 9 },
  초급: { minAnswers: 5, maxAnswers: 20, wrapUpNoticeAnswer: 18 },
  초중급: { minAnswers: 6, maxAnswers: 20, wrapUpNoticeAnswer: 18 },
  중급: { minAnswers: 7, maxAnswers: 20, wrapUpNoticeAnswer: 18 },
  고급: { minAnswers: 8, maxAnswers: 20, wrapUpNoticeAnswer: 18 },
};
const onboardingLevels = [
  { label: "Starter(입문)", value: "입문", desc: "아주 짧은 표현부터 차근차근 연습하고 싶어요." },
  { label: "Beginner(초급)", value: "초급", desc: "기초적인 짧은 문장은 말할 수 있어요. 회화 감각을 키우고 싶어요." },
  { label: "Pre-Intermediate(초중급)", value: "초중급", desc: "조금은 말할 수 있지만 더 자연스러워지고 싶어요." },
  { label: "Intermediate(중급)", value: "중급", desc: "일상 대화는 어느 정도 가능해요. 좀 더 체계적으로 말해보고 싶어요." },
  { label: "Advanced(고급)", value: "고급", desc: "대부분의 상황에서 말할 수 있어요. 더 정확하고 상세한 표현을 사용하고 싶어요." },
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
  { emoji: "🛒", topic: "생활 서비스", level: "초급", title: "마트에서 필요한 물건 찾기" },
  { emoji: "🛫", topic: "여행", level: "초급", title: "공항에서 탑승구 물어보기" },
  { emoji: "🏫", topic: "학업", level: "초급", title: "수업에서 과제 질문하기" },
  { emoji: "💼", topic: "직업", level: "초중급", title: "회의 시간을 다시 확인하기" },
  { emoji: "🤝", topic: "관계", level: "중급", title: "처음 만난 사람과 가볍게 대화하기" },
  { emoji: "🎭", topic: "여가/문화", level: "중급", title: "공연장에서 좌석 위치 묻기" },
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
      correction: { title: "교정 문장", sentence: "At the same level as my eyebrows.", note: "전치사 사용에 주의하세요." },
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
      { speaker: "me", text: "I have body aches and a fever since last night.", status: "correction" },
    ],
    hints: [
      [["I have a fever and body aches.", "열과 몸살이 있어요."], ["I feel sick and achy.", "아프고 몸이 쑤셔요."]],
      [["I've had a fever since last night.", "어젯밤부터 열이 있어요."], ["I also feel chills and body aches.", "오한과 몸살도 있어요."]],
    ],
    feedback: {
      better: { title: "더 좋은 표현", sentence: "I've had a fever since last night.", note: "의미는 전달되지만 증상이 계속되는 상황에는 현재완료가 더 자연스러워요." },
      correction: { title: "교정 문장", sentence: "I've[=I have] had body aches and a fever since last night.", note: "어젯밤부터 지금까지 이어지는 증상은 현재완료 have had로 말해요." },
      perfect: { title: "완벽한 문장", sentence: "좋아요. 증상을 자연스럽게 전달했어요.", note: "이 표현 그대로 사용해도 괜찮아요." },
    },
    report: {
      words: "24개",
      time: "2분 34초",
      feedback: "증상과 시작 시점을 잘 설명했어요. 다음에는 <b>I've had</b>와 <b>since last night</b>를 함께 기억해 보세요.",
      correctionWrong: "I have body aches and a fever since last night.",
      correctionRight: "I've[=I have] had body aches and a fever since last night.",
      correctionNote: "증상이 과거부터 지금까지 이어질 때는 현재완료 <b>have had</b>를 쓰면 자연스러워요.",
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
  const alignClass = options.align === "left" ? " topbar-left" : "";
  const right = options.right || (options.home ? `<button class="icon-btn home-top-btn" data-act="home" aria-label="홈으로">⌂</button>` : `<span class="icon-space"></span>`);
  return `
    ${phoneStatus()}
    <header class="topbar${alignClass}">
      ${back}
      <h1>${title}</h1>
      ${right}
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
        <span>☺</span><b>마이 페이지</b>
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

function rulesForLevel(level) {
  return levelConversationRules[level] || levelConversationRules["초급"];
}

function activeConversationLevel() {
  return S.lessonMode === "custom" ? S.customLevel : S.level;
}

function answerRangeText(level) {
  const rules = rulesForLevel(level);
  return `최소 ${rules.minAnswers}번 · 최대 ${rules.maxAnswers}번 답변`;
}

function onboardingLevel() {
  return `
    <section class="screen onboarding-screen">
      ${phoneStatus()}

      <section class="onboarding-section level-onboarding-section">
        <h2>영어 말하기 수준을 선택해 주세요.</h2>
        <p>나중에 바꿀 수 있으니 편하게 선택해 주세요.</p>
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
  const visibleTopics = S.topicExpanded ? topics : topics.slice(0, 4);
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
          <em>바로 시작 ›</em>
        </span>
      </button>

      <section class="topics-head">
        <h2>Topics</h2>
        <button class="level-select" data-act="level-sheet">레벨 선택 ▾</button>
      </section>

      <div class="topic-picker ${S.topicExpanded ? "expanded" : "collapsed"}">
        <div class="topic-tabs">
          ${visibleTopics.map((topic) => `
            <button class="${S.topic === topic ? "active" : ""}" data-topic="${topic}">
              ${topic}
            </button>
          `).join("")}
        </div>
        <button class="topic-toggle" data-act="toggle-topics" aria-label="${S.topicExpanded ? "카테고리 접기" : "카테고리 펼치기"}">
          ${S.topicExpanded ? "⌃" : "⌄"}
        </button>
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
            <span class="scenario-icon">${s.emoji}</span>
            <span class="scenario-copy">
              <small>${s.topic} · ${s.level}</small>
              <b>${s.title}</b>
            </span>
            <i>›</i>
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

function speedSheet() {
  if (!S.speedSheet) return "";
  return `
    <div class="backdrop" data-act="close-sheet">
      <div class="sheet" data-stop>
        <div class="handle"></div>
        <h2>말하기 속도</h2>
        <div class="setting-options">
          ${speedOptions.map((item) => `
            <button class="${S.tempSpeed === item.value ? "active" : ""}" data-select-speed="${item.value}">
              <span>${item.label}<small>${item.value.match(/\(.+\)/)?.[0] || ""}</small></span>
              <em>${item.desc}</em>
            </button>
          `).join("")}
        </div>
        <button class="primary" data-act="confirm-speed">확인</button>
      </div>
    </div>
  `;
}

function notificationSheet() {
  if (!S.notificationSheet) return "";
  const periods = ["오전", "오후"];
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const wheel = (label, values, activeValue, attr, suffix = "") => `
    <div class="alarm-wheel-column">
      <b>${label}</b>
      <div class="alarm-wheel-frame">
        <div class="alarm-wheel">
          ${values.map((value) => `<button class="${activeValue === value ? "active" : ""}" ${attr}="${value}">${value}${suffix}</button>`).join("")}
        </div>
      </div>
    </div>
  `;
  return `
    <div class="backdrop" data-act="close-sheet">
      <div class="sheet" data-stop>
        <div class="handle"></div>
        <h2>알림 시간</h2>
        <div class="alarm-preview">${S.tempNotificationPeriod} ${S.tempNotificationHour}:${S.tempNotificationMinute}</div>
        <div class="alarm-wheel-picker">
          ${wheel("오전/오후", periods, S.tempNotificationPeriod, "data-temp-period")}
          ${wheel("시간", hours, S.tempNotificationHour, "data-temp-hour", "시")}
          ${wheel("분", minutes, S.tempNotificationMinute, "data-temp-minute", "분")}
        </div>
        <button class="primary" data-act="confirm-notification">확인</button>
      </div>
    </div>
  `;
}

function profile() {
  return `
    <section class="screen profile-screen">
      ${topbar("마이 페이지")}
      <div class="profile-card">
        <div class="profile-avatar">☺</div>
        <h2>나의 학습 설정</h2>
      </div>

      <button class="setting-row" data-act="level-sheet">
        <span>레벨 선택</span><b>${S.level}</b>
      </button>
      <button class="setting-row" data-act="speed-sheet">
        <span>말하기 속도</span><b>${S.speed}</b>
      </button>
      <button class="setting-row" data-act="notification-sheet">
        <span>알림</span><b>${S.notificationTime}</b>
      </button>

      ${bottomNav("profile")}
      ${levelSheet()}
      ${speedSheet()}
      ${notificationSheet()}
    </section>
  `;
}

function freeView() {
  return `
    <section class="screen free-screen">
      ${topbar("나만의 시나리오", { back: true, home: true })}
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
      ${dock("학습 후 대화하기", "expressions", `<button class="secondary" data-act="start">바로 대화하기</button>`)}
    </section>
  `;
}

function wordView() {
  const lesson = activeLesson();
  return `
    <section class="screen learn-screen">
      ${topbar("오늘의 단어", { back: true, home: true })}
      <p class="learn-subtitle">오늘의 대화 핵심 단어예요.</p>
      ${progress(3)}
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
      ${dock("오늘의 대화 보기", "ready")}
    </section>
  `;
}

function exprView() {
  const lesson = activeLesson();
  return `
    <section class="screen learn-screen">
      ${topbar("오늘의 표현", { back: true, home: true })}
      <p class="learn-subtitle">오늘의 미션 핵심 표현이에요.</p>
      ${progress(2)}
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
      ${dock("오늘의 단어 보기", "words")}
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
  const rules = rulesForLevel(activeConversationLevel());
  return `
    <section class="screen ready-screen">
      ${topbar("오늘의 대화", { back: true, home: true })}
      <p class="ready-subtitle">오늘 배운 표현과 단어를 사용해 미션을 완료해 보세요.</p>
      ${progress(5)}
      <h2 class="ready-prompt">틀려도 괜찮아요. 편하게 말해 보세요.</h2>
      <div class="white-card reminder-mission-card">
        ${renderMissions(lesson)}
      </div>
      <div class="turn-guide">
        <p>최소 ${rules.minAnswers}번, 최대 ${rules.maxAnswers}번 답변해요.</p>
        <p>미션을 완료하면 마무리하거나 더 연습할 수 있어요.</p>
      </div>
      ${dock("대화 시작하기", "start")}
    </section>
  `;
}

const conversationRules = {
  get minTurns() {
    return rulesForLevel(activeConversationLevel()).minAnswers;
  },
  get maxTurns() {
    return rulesForLevel(activeConversationLevel()).maxAnswers;
  },
  get wrapUpNoticeTurn() {
    return rulesForLevel(activeConversationLevel()).wrapUpNoticeAnswer;
  },
};

const extensionAiPrompts = [
  ["Could you tell me a little more about what you want?", "원하는 내용을 조금 더 말해 줄 수 있나요?"],
  ["That helps. Is there anything else I should know?", "좋아요. 제가 더 알아야 할 것이 있을까요?"],
  ["How would you like the final result to look?", "마지막 결과가 어떻게 보이면 좋겠나요?"],
  ["Would you prefer something simple or a bit more detailed?", "간단한 쪽이 좋으세요, 아니면 조금 더 자세한 쪽이 좋으세요?"],
  ["Can you give me one more detail?", "한 가지 더 자세히 말해 줄 수 있나요?"],
  ["That sounds clear. What is most important to you?", "잘 이해했어요. 가장 중요한 점은 무엇인가요?"],
  ["Let me check one more thing before we finish.", "마무리하기 전에 한 가지만 더 확인할게요."],
  ["좋아요. 이제 마지막으로 하나만 더 확인해 볼게요.", "좋아요. 이제 마지막으로 하나만 더 확인해 볼게요."],
  ["오늘은 여기까지 대화해요. 학습 리포트를 확인해 보세요.", "오늘은 여기까지 대화해요. 학습 리포트를 확인해 보세요."],
];

function aiPromptForTurn(index) {
  const base = activeLesson().turns.filter((turn) => turn.speaker === "ai")[index];
  if (base) return base;
  if (index >= conversationRules.maxTurns) return { speaker: "ai", text: extensionAiPrompts.at(-1)[0], ko: extensionAiPrompts.at(-1)[1] };
  if (index >= conversationRules.wrapUpNoticeTurn) return { speaker: "ai", text: extensionAiPrompts.at(-2)[0], ko: extensionAiPrompts.at(-2)[1] };
  const prompt = extensionAiPrompts[(index - 4 + extensionAiPrompts.length) % (extensionAiPrompts.length - 2)];
  return { speaker: "ai", text: prompt[0], ko: prompt[1] };
}

function learnerTurnForIndex(index) {
  const base = activeLesson().turns.filter((turn) => turn.speaker === "me")[index];
  return {
    speaker: "me",
    text: S.typedTurns[index] || base?.text || "Let me explain a little more.",
    status: base?.status || "perfect",
    meIndex: index,
  };
}

function conversationTurnList() {
  const list = [];
  const aiLimit = S.finalizingConversation ? S.turn - 1 : S.turn;
  for (let index = 0; index <= aiLimit; index += 1) {
    list.push(aiPromptForTurn(index));
    if (S.turn > index) list.push(learnerTurnForIndex(index));
  }
  if (S.finalizingConversation) {
    list.push({
      speaker: "ai",
      text: "오늘은 여기까지 대화해요. 학습 리포트를 확인해 보세요.",
      ko: "오늘은 여기까지 대화해요. 학습 리포트를 확인해 보세요.",
    });
  }
  return list;
}

function shouldShowEndChoice() {
  return S.mission >= activeLesson().missions.length
    && S.turn >= conversationRules.minTurns
    && !S.continueConversation
    && !S.finalizingConversation;
}

function conversationGuidance() {
  const missionsDone = S.mission >= activeLesson().missions.length;
  if (S.finalizingConversation || shouldShowEndChoice()) return "";
  if (S.turn >= conversationRules.wrapUpNoticeTurn) {
    return "마무리 단계예요. 마지막 질문에 편하게 답해 보세요.";
  }
  if (S.continueConversation) {
    return "조금 더 대화 중이에요. 언제든 리포트 보기로 마무리할 수 있어요.";
  }
  if (missionsDone) {
    return "미션은 완료했어요. 조금 더 대화하며 표현을 연습해 볼게요.";
  }
  return "";
}

function conversationProgress() {
  const baseTurns = Math.min(S.turn, conversationRules.minTurns);
  const basePercent = Math.min(100, (baseTurns / conversationRules.minTurns) * 100);
  const isExtended = S.continueConversation && S.turn >= conversationRules.minTurns;
  const current = isExtended ? Math.min(S.turn, conversationRules.maxTurns) : baseTurns;
  const total = isExtended ? conversationRules.maxTurns : conversationRules.minTurns;
  const percent = isExtended
    ? Math.min(100, (current / conversationRules.maxTurns) * 100)
    : basePercent;
  let label = "답변 진행";

  if (S.turn >= conversationRules.wrapUpNoticeTurn) label = "마무리 단계";
  else if (isExtended) label = "더 연습 중";
  else if (S.mission >= activeLesson().missions.length && S.turn >= conversationRules.minTurns) label = "마무리 가능";
  else if (S.turn >= conversationRules.minTurns) label = `${conversationRules.minTurns}번 완료`;

  return `
    <div class="conversation-progress" style="--progress:${percent}%">
      <div class="conversation-progress-head">
        <b>${label}</b>
        <strong>${current}/${total}</strong>
      </div>
      <small>최소 ${conversationRules.minTurns}번 · 최대 ${conversationRules.maxTurns}번 답변</small>
      <div class="conversation-progress-track" aria-hidden="true"><span></span></div>
    </div>
  `;
}

function turns(options = {}) {
  const lesson = activeLesson();
  const showUserFeedback = options.showUserFeedback !== false;
  const showRetry = options.showRetry !== false;
  const showAiTools = options.showAiTools !== false;
  const list = options.fullConversation ? lesson.turns : conversationTurnList();
  return list.map((t, i) => `
    <div class="chat-row ${t.speaker}">
      <div class="bubble-line">
        ${t.speaker === "me" && showUserFeedback ? feedbackIcon(t.status, t.meIndex) : ""}
        <p>${escapeHtml(t.text)}</p>
        ${t.speaker === "me" && showRetry ? `<button class="retry-turn-btn" data-act="retry-turn" data-turn="${t.meIndex}" aria-label="다시 녹음">↻</button>` : ""}
      </div>
      ${t.speaker === "me" && showUserFeedback && S.feedbackOpen === t.meIndex ? feedbackPanel(t.status) : ""}
      ${t.speaker === "ai" && showAiTools ? `<div class="chat-tools"><button data-speak="${t.text}">🔊</button><button data-translation="l${i}">🌐</button></div><em id="translation-l${i}" class="translation hidden">${t.ko}</em>` : ""}
    </div>
  `).join("");
}

function feedbackIcon(status, meIndex, interactive = true) {
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
  if (status === "perfect" || !interactive) {
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
  const prompt = aiPromptForTurn(S.turn);
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

function endChoicePanel() {
  if (!shouldShowEndChoice()) return "";
  return `
    <div class="end-choice-panel">
      <p>미션을 모두 완료했어요!<br>마무리할까요 아니면 대화를 좀 더 할까요?</p>
      <button class="primary" data-act="finish">마무리하고 리포트 보기</button>
      <button class="secondary" data-act="continue-talk">조금 더 대화하기</button>
    </div>
  `;
}

function liveInputControls() {
  if (S.finalizingConversation) return "";
  if (shouldShowEndChoice()) return endChoicePanel();
  return `
    <div class="input ${S.keyboard ? "typing" : ""}">
      ${keyboardComposer()}
      <button class="keyboard-btn" data-act="keyboard" aria-label="키보드 입력">⌨️</button>
      <button class="mic-main-btn" data-act="mic" aria-label="마이크로 말하기">🎙️</button>
      <button class="hint-icon-btn" data-act="hint" aria-label="힌트 보기">💡</button>
    </div>
  `;
}

function exitConfirmSheet() {
  if (!S.exitConfirm) return "";
  const hasSpoken = S.turn > 0;
  return `
    <div class="backdrop" data-act="close-exit-confirm">
      <div class="sheet exit-confirm-sheet" data-stop>
        <div class="handle"></div>
        <h2>${hasSpoken ? "대화를 여기까지 할까요?" : "아직 대화를 시작하지 않았어요. 나가시겠어요?"}</h2>
        <button class="secondary" data-act="close-exit-confirm">${hasSpoken ? "계속하기" : "계속 대화하기"}</button>
        <button class="primary" data-act="${hasSpoken ? "finish" : "exit-without-report"}">${hasSpoken ? "리포트 보기" : "나가기"}</button>
      </div>
    </div>
  `;
}

function live() {
  const lesson = activeLesson();
  return `
    <section class="screen live-screen ${S.keyboard ? "typing-mode" : ""}">
      ${topbar("대화하기", { back: true, align: "left", right: `<button class="icon-btn close-live-btn" data-act="exit-confirm" aria-label="대화 종료">×</button>` })}
      <div class="live-mission-panel">
        <div class="conversation-context"><span>상황: ${escapeHtml(lesson.title)}</span></div>
        ${conversationProgress()}
        <div class="live-mission-list">
          ${lesson.missions.map((mission, index) => `
            <p class="${S.mission > index ? "done" : ""}"><span>${S.mission > index ? "✓" : index + 1}</span> ${mission}</p>
          `).join("")}
        </div>
        ${conversationGuidance() ? `<p class="conversation-guidance">${conversationGuidance()}</p>` : ""}
      </div>
      <div class="chat live-chat">${turns()}</div>
      ${liveInputControls()}
      ${hintSheet()}
      ${exitConfirmSheet()}
    </section>
  `;
}

function report() {
  const lesson = activeLesson();
  const spokenTurns = Math.max(0, S.turn);
  const completedMissions = Math.min(S.mission, lesson.missions.length);
  const isComplete = completedMissions >= lesson.missions.length;
  const reportSummary = isComplete
    ? "오늘의 미션을 모두 완료했어요. 리포트에서 표현과 피드백을 확인해 보세요."
    : "아직 미션을 모두 완료하지 않았어요. 그래도 지금까지 말한 내용으로 리포트를 확인할 수 있어요.";
  const aiFeedback = isComplete
    ? lesson.report.feedback
    : `현재 ${completedMissions}/${lesson.missions.length}개 미션을 완료했어요. 다음에는 남은 미션을 떠올리며 조금 더 이어서 말해 보세요.`;
  const spokenWords = spokenTurns > 0 ? `${Math.max(6, spokenTurns * 8)}개` : "0개";
  const talkTime = spokenTurns > 0 ? `${Math.max(1, Math.ceil(spokenTurns * 0.6))}분 내외` : "0분";
  const correctionCount = learnerFeedbackTurns("correction").length;
  const betterCount = learnerFeedbackTurns("better").length;
  return `
    <section class="screen report-screen">
      ${topbar("학습 리포트")}
      <h2 class="report-title">${escapeHtml(lesson.title)}</h2>
      <p class="report-state ${isComplete ? "complete" : "partial"}">${reportSummary}</p>
      <div class="report-metrics">
        <div class="metric-card"><small>말한 단어</small><b>${spokenWords}</b></div>
        <div class="metric-card"><small>대화 시간</small><b>${talkTime}</b></div>
        <div class="metric-card"><small>미션 평가</small><b>${completedMissions}/${lesson.missions.length}</b></div>
      </div>
      <button class="menu-row" data-report-detail="corrections">교정 문장 보기 <b>${correctionCount}개</b><span>›</span></button>
      <button class="menu-row" data-report-detail="better">더 좋은 표현 보기 <b>${betterCount}개</b><span>›</span></button>
      <button class="menu-row" data-report-detail="conversation">전체 대화 보기 <span>›</span></button>
      <div class="feedback-card">
        <b>AI 피드백</b>
        <p>${aiFeedback}</p>
      </div>
      ${dock("학습 완료", "home")}
    </section>
  `;
}

function learnerFeedbackTurns(status) {
  const lesson = activeLesson();
  const matches = [];
  let previousAi = null;
  let meIndex = 0;
  for (const turn of lesson.turns) {
    if (turn.speaker === "ai") {
      previousAi = turn;
      continue;
    }
    if (meIndex >= S.turn) break;
    if (turn.status === status) {
      matches.push({
        ai: previousAi,
        me: { ...turn, text: S.typedTurns[meIndex] || turn.text, meIndex },
      });
    }
    meIndex += 1;
  }
  return matches;
}

function reportFeedbackThreadList(status) {
  const items = learnerFeedbackTurns(status);
  const feedback = activeLesson().feedback[status];
  if (!items.length || !feedback) {
    return `
      <article class="detail-card empty-detail">
        <b>0개</b>
        <p>이번 대화에서는 해당하는 피드백이 없었어요.</p>
      </article>
    `;
  }
  return `
    <div class="chat report-chat feedback-thread-list">
      ${items.map(({ ai, me }, index) => `
        ${ai ? `
          <div class="chat-row ai">
            <div class="bubble-line">
              <p>${escapeHtml(ai.text)}</p>
            </div>
            <div class="chat-tools"><button data-speak="${ai.text}">🔊</button><button data-translation="rf${status}${index}">🌐</button></div>
            <em id="translation-rf${status}${index}" class="translation hidden">${ai.ko}</em>
          </div>
        ` : ""}
        <div class="chat-row me report-feedback-row">
          <div class="bubble-line">
            ${feedbackIcon(status, me.meIndex, false)}
            <p>${escapeHtml(me.text)}</p>
          </div>
          ${feedbackPanel(status)}
        </div>
      `).join("")}
    </div>
  `;
}

function reportDetail() {
  const lesson = activeLesson();
  const data = {
    corrections: {
      title: "교정 문장",
      body: reportFeedbackThreadList("correction"),
    },
    better: {
      title: "더 좋은 표현",
      body: reportFeedbackThreadList("better"),
    },
    conversation: {
      title: "전체 대화",
      body: `
        <div class="chat report-chat">
          ${turns({ showUserFeedback: false, showRetry: false, showAiTools: true })}
        </div>
      `,
    },
  }[S.reportDetail || "corrections"];

  return `
    <section class="screen report-screen">
      ${topbar(data.title, { back: true, home: true })}
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
  S.speedSheet = false;
  S.notificationSheet = false;
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
  if (S.turn >= conversationRules.maxTurns) {
    S.finalizingConversation = true;
    render();
    setTimeout(() => go("report"), 1200);
    return;
  }
  render();
}

function missionCountForTurn(turn) {
  if (turn >= 3) return activeLesson().missions.length;
  if (turn >= 1) return 1;
  return 0;
}

function back() {
  const map = { onboardingSpeed: "onboardingLevel", free: "home", intro: "home", expressions: "intro", words: "expressions", ready: "words", live: "ready", profile: "home", reportDetail: "report" };
  if (S.screen === "live" && S.liveEntry === "direct") {
    go("intro");
    return;
  }
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

  const selectedSpeed = e.target.closest("[data-select-speed]");
  if (selectedSpeed) {
    S.tempSpeed = selectedSpeed.dataset.selectSpeed;
    render();
    return;
  }

  const selectedPeriod = e.target.closest("[data-temp-period]");
  if (selectedPeriod) {
    S.tempNotificationPeriod = selectedPeriod.dataset.tempPeriod;
    render();
    return;
  }

  const selectedHour = e.target.closest("[data-temp-hour]");
  if (selectedHour) {
    S.tempNotificationHour = selectedHour.dataset.tempHour;
    render();
    return;
  }

  const selectedMinute = e.target.closest("[data-temp-minute]");
  if (selectedMinute) {
    S.tempNotificationMinute = selectedMinute.dataset.tempMinute;
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
  else if (action === "toggle-topics") {
    S.topicExpanded = !S.topicExpanded;
    render();
  }
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
    S.speedSheet = false;
    S.notificationSheet = false;
    render();
  } else if (action === "speed-sheet") {
    S.tempSpeed = S.speed;
    S.speedSheet = true;
    S.levelSheet = false;
    S.notificationSheet = false;
    render();
  } else if (action === "notification-sheet") {
    const match = S.notificationTime.match(/(오전|오후) (\d+):(\d+)/);
    S.tempNotificationPeriod = match?.[1] || "오전";
    S.tempNotificationHour = match?.[2] || "9";
    S.tempNotificationMinute = match?.[3] || "00";
    S.notificationSheet = true;
    S.levelSheet = false;
    S.speedSheet = false;
    render();
  } else if (action === "confirm-level") {
    S.level = S.tempLevel;
    S.onboardingLevel = S.tempLevel;
    S.levelSheet = false;
    render();
  } else if (action === "confirm-speed") {
    S.speed = S.tempSpeed;
    S.onboardingSpeed = S.tempSpeed;
    S.speedSheet = false;
    render();
  } else if (action === "confirm-notification") {
    S.notificationTime = `${S.tempNotificationPeriod} ${S.tempNotificationHour}:${S.tempNotificationMinute}`;
    S.notificationSheet = false;
    render();
  } else if (action === "close-sheet") {
    S.levelSheet = false;
    S.speedSheet = false;
    S.notificationSheet = false;
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
    S.continueConversation = false;
    S.finalizingConversation = false;
    S.exitConfirm = false;
    notify("입력한 내용으로 학습을 만들었어요.");
    setTimeout(() => go("intro"), 500);
  } else if (action === "start") {
    S.liveEntry = S.screen === "intro" ? "direct" : "flow";
    S.turn = 0;
    S.mission = 0;
    S.typedTurns = [];
    S.continueConversation = false;
    S.finalizingConversation = false;
    S.exitConfirm = false;
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
    const retryIndex = Number(e.target.closest("[data-turn]")?.dataset.turn);
    if (Number.isInteger(retryIndex) && retryIndex >= 0) {
      S.turn = retryIndex;
      S.typedTurns = S.typedTurns.slice(0, retryIndex);
      S.mission = missionCountForTurn(retryIndex);
      S.feedbackOpen = null;
      S.keyboard = false;
      S.continueConversation = false;
      S.finalizingConversation = false;
      S.exitConfirm = false;
      render();
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
  } else if (action === "continue-talk") {
    S.continueConversation = true;
    render();
  } else if (action === "exit-confirm") {
    S.exitConfirm = true;
    render();
  } else if (action === "close-exit-confirm") {
    S.exitConfirm = false;
    render();
  } else if (action === "exit-without-report") {
    S.exitConfirm = false;
    back();
  } else if (action === "finish") {
    S.exitConfirm = false;
    go("report");
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
