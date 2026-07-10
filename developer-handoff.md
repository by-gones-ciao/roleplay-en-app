# TalkFlow 개발자 인수인계 문서

이 문서는 TalkFlow 웹앱 MVP를 개발자가 구현하기 위해 가장 먼저 읽어야 하는 최상위 안내서입니다.

## 1. 프로젝트 개요

TalkFlow는 한국인 영어 학습자가 AI와 역할극 대화를 하며 말하기를 연습하는 웹앱입니다.

핵심 경험:

1. 학습자가 레벨과 말하기 속도를 선택한다.
2. AI가 추천하는 오늘의 대화 또는 나만의 시나리오를 선택한다.
3. 오늘의 표현과 단어를 확인한다.
4. AI와 5~10턴 대화를 진행한다.
5. 학습자 발화는 perfect / better / correction으로 평가된다.
6. 대화 종료 후 학습 리포트를 확인한다.

## 2. 현재 프로토타입 파일

현재 로컬 프로토타입은 아래 파일로 구성되어 있습니다.

| 파일 | 설명 |
|---|---|
| index.html | 앱 진입 HTML |
| app.js | 화면 상태, 대화 흐름, 샘플 콘텐츠 |
| styles.css | 모바일 앱 스타일 |

현재 프로토타입은 정적 프론트엔드입니다. 실제 AI, 음성 인식, TTS, 서버 저장은 아직 연결되어 있지 않습니다.

## 3. 개발자 참고 문서 읽는 순서

개발자는 아래 순서로 문서를 읽는 것을 권장합니다.

1. `developer-handoff.md`
   - 전체 구현 방향과 문서 지도

2. `content-spec.md`
   - 콘텐츠와 학습 시나리오의 사람이 읽는 기준

3. `content-data-schema.md`
   - 시나리오, 미션, 표현, 단어, 대화, 피드백의 데이터 구조

4. `mvp-scenarios-spec.md`
   - MVP 기본 시나리오 5개

5. `prompt-spec.md`
   - AI 프롬프트 4종

6. `level-spec.md`
   - 레벨별 난이도 기준

7. `voice-conversation-spec.md`
   - 마이크, 음성 인식, 키보드 입력, TTS, 번역, 대화 종료 기준

8. `report-metrics-spec.md`
   - 학습 리포트 계산 기준

9. `empty-error-copy-spec.md`
   - 오류, 빈 상태, 권한, 로딩, 토스트 문구

## 4. MVP 구현 범위

### MVP에 반드시 포함

1. 온보딩
   - 레벨 선택
   - 말하기 속도 선택

2. 홈
   - 오늘의 대화 추천 카드
   - 나만의 시나리오 진입
   - 마이 페이지 진입

3. 학습 플로우
   - 시나리오 상세
   - 오늘의 표현
   - 오늘의 단어
   - 대화 직전 리마인드
   - 실제 대화하기

4. 실제 대화하기
   - AI 발화
   - 학습자 음성 또는 키보드 입력
   - 발화 평가
   - perfect / better / correction 표시
   - 다시 녹음
   - 답변 진행 0/5, 더 연습 중 6/10 표시
   - 미션 완료 체크
   - X 종료 확인

5. 학습 리포트
   - 말한 단어
   - 대화 시간
   - 미션 평가
   - 교정 문장 보기
   - 더 좋은 표현 보기
   - 전체 대화 보기
   - AI 피드백

6. 마이 페이지
   - 레벨 선택
   - 말하기 속도
   - 알림 시간 설정

7. 콘텐츠
   - MVP 기본 시나리오 5개

### MVP에서 제외 가능

1. 결제
2. 소셜 로그인
3. 커뮤니티
4. 랭킹
5. 복잡한 학습 통계
6. 장기 복습 시스템
7. 푸시 알림 실제 발송
8. 네이티브 앱 기능

## 5. 추천 기술 구성

실제 구현 시 선택지는 다양하지만, MVP 기준 추천 구성은 아래와 같습니다.

### 프론트엔드

- React 또는 Next.js
- 모바일 우선 반응형 웹
- 상태 관리: React state, Zustand, 또는 Context

### 백엔드

- Next.js API Routes 또는 별도 Node.js 서버
- AI API 호출 프록시
- 사용자 세션/대화 기록 저장

### 데이터베이스

- Supabase, Firebase, PostgreSQL 중 하나
- MVP에서는 Supabase를 추천

### AI 기능

- 시나리오 생성
- 대화 중 AI 응답 생성
- 학습자 발화 평가
- 리포트 생성

### 음성 기능

- STT: 브라우저 Web Speech API 또는 외부 STT
- TTS: 브라우저 SpeechSynthesis 또는 외부 TTS
- MVP에서는 브라우저 기본 기능으로 시작 가능

## 6. 핵심 데이터 파일

개발 단계에서는 아래 정적 JSON 파일을 먼저 만들고, 이후 DB로 옮길 수 있습니다.

| 파일 | 목적 |
|---|---|
| scenarios.json | 기본 시나리오 5개 |
| level-config.json | 레벨별 난이도 기준 |
| error-copy.json | 오류/빈 상태 문구 |
| prompt-templates.json | AI 프롬프트 템플릿 |

## 7. API 초안

실제 서버 구현 시 필요한 API는 아래와 같습니다.

### 시나리오 생성

```http
POST /api/scenarios/generate
```

입력:

```json
{
  "topicDescription": "식당에서 주문하지 않은 음식이 나왔어요.",
  "userRole": "손님",
  "aiRole": "종업원",
  "level": "beginner",
  "speed": "Normal (x1.0)"
}
```

출력:

```json
{
  "scenario": {}
}
```

### 학습자 발화 평가

```http
POST /api/conversation/evaluate
```

입력:

```json
{
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "turnIndex": 3,
  "aiQuestion": "Okay. What about your bangs?",
  "userText": "At the same level my eyebrows.",
  "level": "beginner",
  "missions": [],
  "targetExpressions": [],
  "previousTurns": []
}
```

출력:

```json
{
  "turnResult": {}
}
```

### 다음 AI 발화 생성

```http
POST /api/conversation/next
```

입력:

```json
{
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "turnCount": 6,
  "completedMissionIds": ["mission_1"],
  "conversationHistory": [],
  "level": "beginner"
}
```

출력:

```json
{
  "aiMessage": {
    "text": "Would you like me to be extra careful with your bangs?",
    "ko": "앞머리를 더 조심해서 봐 드릴까요?",
    "intent": "guide_incomplete_mission",
    "shouldEnd": false
  }
}
```

### 리포트 생성

```http
POST /api/reports/generate
```

입력:

```json
{
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "turnCount": 10,
  "missions": [],
  "completedMissionIds": [],
  "userTurnResults": [],
  "durationSeconds": 138
}
```

출력:

```json
{
  "report": {}
}
```

## 8. 대화 상태 모델

프론트엔드에서는 최소한 아래 상태가 필요합니다.

```json
{
  "currentScreen": "home",
  "selectedLevel": "beginner",
  "selectedSpeed": "Normal (x1.0)",
  "selectedScenarioId": "hair_salon_trim_bangs_beginner",
  "turnCount": 0,
  "completedMissionIds": [],
  "conversationTurns": [],
  "userTurnResults": [],
  "recordingState": "idle",
  "keyboardOpen": false,
  "exitConfirmOpen": false,
  "continueConversation": false,
  "finalizingConversation": false
}
```

## 9. 5~10턴 대화 규칙

- 최소 턴: 5턴
- 최대 턴: 10턴
- 1턴은 AI 발화 1회와 학습자 발화 1회를 합친 한 쌍이다.
- `turnCount`는 완료된 AI-학습자 대화 쌍의 개수이다.
- 5턴 전에는 미션이 완료되어도 자동 종료하지 않는다.
- 미션 완료 + 5턴 이상이면 종료 선택지를 보여준다.
- 사용자가 더 대화하기를 선택하면 최대 10턴까지 확장한다.
- 9턴부터 마무리 예고를 한다.
- 10턴에서 최종 발화 후 리포트로 이동한다.
- 0턴에서 X를 누르면 리포트를 제공하지 않는다.
- 1턴 이상에서 X를 누르면 리포트 보기를 제공한다.

## 10. AI 응답 핵심 규칙

- AI는 한 턴에 질문을 하나만 한다.
- AI 발화는 한 문장일 필요는 없다.
- 짧은 반응/상황 설명 + 질문 1개는 허용한다.
- 학습자가 주제에서 벗어나면 현재 시나리오로 자연스럽게 되돌린다.
- 의료 상황에서는 진단/처방을 하지 않는다.

## 11. 개발 우선순위

### 1단계: 정적 MVP

1. 현재 UI를 프레임워크로 옮긴다.
2. `scenarios.json`으로 시나리오 데이터를 분리한다.
3. AI 없이 샘플 데이터로 전체 플로우를 완성한다.
4. 리포트 계산을 클라이언트에서 구현한다.

### 2단계: AI 연결

1. 학습자 발화 평가 API 연결
2. 다음 AI 발화 생성 API 연결
3. 리포트 생성 API 연결
4. 나만의 시나리오 생성 API 연결

### 3단계: 음성 연결

1. 마이크 권한 처리
2. STT 연결
3. TTS 연결
4. 말하기 속도 반영

### 4단계: 저장/계정

1. 사용자 설정 저장
2. 대화 기록 저장
3. 리포트 저장
4. 로그인 도입

## 12. QA 필수 케이스

1. 첫 방문 온보딩
2. 오늘의 대화 추천 시작
3. 학습 후 대화하기
4. 바로 대화하기
5. 나만의 시나리오 생성
6. 키보드 입력
7. 음성 입력 실패
8. 다시 녹음
9. better 피드백
10. correction 피드백
11. perfect 피드백
12. 0턴 종료
13. 1~9턴 종료
14. 미션 완료 + 5턴 이상 종료
15. 더 대화하기
16. 9턴 마무리 예고
17. 10턴 자동 종료
18. 전체 대화 보기
19. 레벨 변경
20. 말하기 속도 변경
21. 알림 시간 변경

## 13. 현재 남은 작업

개발자가 바로 구현하기 위해 아직 필요한 실무 파일:

1. `scenarios.json`
2. `level-config.json`
3. `error-copy.json`
4. `api-spec.md`
5. `qa-test-plan.md`
6. `storage-schema.md`

이 문서들을 추가하면 개발 착수 패키지 완성도가 크게 올라갑니다.
