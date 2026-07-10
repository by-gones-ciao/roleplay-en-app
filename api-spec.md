# TalkFlow API 명세서

이 문서는 TalkFlow MVP 웹앱 구현에 필요한 서버 API 초안을 정의합니다.

## 1. 공통 원칙

- 모든 요청/응답은 JSON을 사용한다.
- 사용자가 보는 오류 문구는 `empty-error-copy-spec.md` 기준을 따른다.
- AI 관련 API는 서버에서 호출한다. 프론트엔드에 AI API 키를 노출하지 않는다.
- 응답은 앱이 바로 렌더링할 수 있는 구조를 유지한다.
- 의료 상황에서는 진단/처방을 생성하지 않는다.

## 2. 공통 응답 형식

### 성공

```json
{
  "ok": true,
  "data": {}
}
```

### 실패

```json
{
  "ok": false,
  "error": {
    "code": "network_unstable",
    "message": "연결이 불안정해요. 잠시 후 다시 시도해 주세요.",
    "recoverable": true
  }
}
```

## 3. 시나리오 목록 조회

```http
GET /api/scenarios
```

### Query

| 이름 | 필수 | 설명 |
|---|---|---|
| level | 선택 | starter, beginner 등 |
| category | 선택 | daily, travel, medical 등 |

### 응답

```json
{
  "ok": true,
  "data": {
    "scenarios": []
  }
}
```

## 4. 시나리오 상세 조회

```http
GET /api/scenarios/{scenarioId}
```

### 응답

```json
{
  "ok": true,
  "data": {
    "scenario": {}
  }
}
```

## 5. 나만의 시나리오 생성

```http
POST /api/scenarios/generate
```

### 요청

```json
{
  "topicDescription": "식당에서 내가 주문하지 않은 음식을 가져다 줍니다.",
  "userRole": "손님",
  "aiRole": "종업원",
  "level": "beginner",
  "speed": "Normal (x1.0)"
}
```

### 처리 기준

- `prompt-spec.md`의 나만의 시나리오 생성 프롬프트를 사용한다.
- 결과는 `content-data-schema.md`의 Scenario 구조를 따른다.
- 생성 실패 시 `scenario_generation_failed`를 반환한다.

### 응답

```json
{
  "ok": true,
  "data": {
    "scenario": {}
  }
}
```

## 6. 대화 세션 시작

```http
POST /api/conversation/start
```

### 요청

```json
{
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "level": "beginner",
  "speed": "Normal (x1.0)",
  "entry": "flow"
}
```

### 응답

```json
{
  "ok": true,
  "data": {
    "sessionId": "session_001",
    "scenario": {},
    "startedAt": "2026-07-10T09:00:00+09:00"
  }
}
```

## 7. 학습자 발화 평가

```http
POST /api/conversation/evaluate
```

### 요청

```json
{
  "sessionId": "session_001",
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "turnIndex": 3,
  "aiQuestion": "Okay. What about your bangs?",
  "userText": "At the same level my eyebrows.",
  "inputMode": "voice",
  "level": "beginner",
  "missions": [],
  "targetExpressions": [],
  "previousTurns": []
}
```

### 처리 기준

- `prompt-spec.md`의 학습자 발화 평가 프롬프트를 사용한다.
- 결과는 UserTurnResult 구조를 따른다.
- perfect는 feedback을 `null`로 반환한다.
- better/correction은 `koNote`, `suggestedText`를 반환한다.

### 응답

```json
{
  "ok": true,
  "data": {
    "turnResult": {
      "turnIndex": 3,
      "aiText": "Okay. What about your bangs?",
      "userText": "At the same level my eyebrows.",
      "status": "correction",
      "feedback": {
        "koNote": "비교 기준을 말할 때는 as를 넣는 것이 자연스러워요.",
        "suggestedText": "At the same level as my eyebrows."
      },
      "completedMissionIds": []
    }
  }
}
```

## 8. 다음 AI 발화 생성

```http
POST /api/conversation/next
```

### 요청

```json
{
  "sessionId": "session_001",
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "aiRole": "미용사",
  "userRole": "손님",
  "level": "beginner",
  "turnCount": 6,
  "minTurns": 10,
  "maxTurns": 20,
  "completedMissionIds": ["hair_mission_1"],
  "missions": [],
  "conversationHistory": []
}
```

### 처리 기준

- `prompt-spec.md`의 대화 중 AI 응답 생성 프롬프트를 사용한다.
- AI는 한 턴에 질문 하나만 한다.
- 주제 이탈 시 `intent = off_topic_redirect`를 사용할 수 있다.
- 20턴에서는 `shouldEnd = true`를 반환한다.

### 응답

```json
{
  "ok": true,
  "data": {
    "aiMessage": {
      "text": "Would you like me to be extra careful with your bangs?",
      "ko": "앞머리를 더 조심해서 봐 드릴까요?",
      "intent": "guide_incomplete_mission",
      "shouldEnd": false
    }
  }
}
```

## 9. 대화 세션 저장

```http
PATCH /api/conversation/{sessionId}
```

### 요청

```json
{
  "turnCount": 4,
  "completedMissionIds": ["hair_mission_1"],
  "conversationTurns": [],
  "userTurnResults": []
}
```

### 응답

```json
{
  "ok": true,
  "data": {
    "sessionId": "session_001",
    "saved": true
  }
}
```

## 10. 리포트 생성

```http
POST /api/reports/generate
```

### 요청

```json
{
  "sessionId": "session_001",
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "title": "미용실에서 원하는 머리 설명하기",
  "missions": [],
  "completedMissionIds": ["hair_mission_1", "hair_mission_2"],
  "turnCount": 10,
  "userTurnResults": [],
  "conversationTurns": [],
  "durationSeconds": 138
}
```

### 처리 기준

- `report-metrics-spec.md`의 계산 기준을 따른다.
- AI 피드백이 필요한 경우 `prompt-spec.md`의 학습 리포트 생성 프롬프트를 사용한다.
- 0턴에서는 리포트를 생성하지 않는다.

### 응답

```json
{
  "ok": true,
  "data": {
    "report": {}
  }
}
```

## 11. 사용자 설정 조회

```http
GET /api/user/settings
```

### 응답

```json
{
  "ok": true,
  "data": {
    "settings": {
      "level": "beginner",
      "speed": "Normal (x1.0)",
      "notificationTime": "오전 9:00"
    }
  }
}
```

## 12. 사용자 설정 저장

```http
PATCH /api/user/settings
```

### 요청

```json
{
  "level": "beginner",
  "speed": "Normal (x1.0)",
  "notificationTime": "오전 9:00"
}
```

### 응답

```json
{
  "ok": true,
  "data": {
    "settings": {
      "level": "beginner",
      "speed": "Normal (x1.0)",
      "notificationTime": "오전 9:00"
    }
  }
}
```

## 13. 리포트 목록 조회

```http
GET /api/reports
```

### 응답

```json
{
  "ok": true,
  "data": {
    "reports": []
  }
}
```

## 14. 리포트 상세 조회

```http
GET /api/reports/{reportId}
```

### 응답

```json
{
  "ok": true,
  "data": {
    "report": {}
  }
}
```

## 15. 오류 코드

| 코드 | HTTP | 의미 |
|---|---:|---|
| validation_failed | 400 | 입력값 부족 또는 형식 오류 |
| mic_permission_denied | 403 | 마이크 권한 거부 |
| ai_response_failed | 502 | AI 응답 생성 실패 |
| evaluation_failed | 502 | 발화 평가 실패 |
| report_failed | 502 | 리포트 생성 실패 |
| scenario_generation_failed | 502 | 시나리오 생성 실패 |
| network_unstable | 503 | 네트워크 불안정 |
| save_failed | 500 | 저장 실패 |

