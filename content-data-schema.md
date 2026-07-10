# TalkFlow 콘텐츠 데이터 구조 설계서

이 문서는 TalkFlow의 기본 시나리오, AI 생성 시나리오, 대화 평가, 학습 리포트를 개발자가 동일한 구조로 구현하기 위한 데이터 기준입니다.

## 1. Scenario

시나리오 하나를 구성하는 최상위 데이터입니다.

```json
{
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "type": "preset",
  "category": "daily",
  "level": "beginner",
  "title": "미용실에서 원하는 머리 설명하기",
  "summary": "미용사에게 원하는 머리 길이와 앞머리 요청을 자연스럽게 말한다.",
  "userRole": "손님",
  "aiRole": "미용사",
  "missions": [],
  "expressions": [],
  "words": [],
  "turns": [],
  "extensionPrompts": [],
  "feedbackRules": [],
  "reportCopy": {}
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|---|---:|---:|---|
| scenarioId | string | 필수 | 고유 ID |
| type | preset/custom | 필수 | 기본 제공 또는 사용자 생성 |
| category | string | 필수 | daily, travel, work, school, medical 등 |
| level | string | 필수 | starter, beginner, pre_intermediate, intermediate, advanced |
| title | string | 필수 | 화면에 표시되는 시나리오 제목 |
| summary | string | 필수 | 상황 설명 |
| userRole | string | 필수 | 학습자 역할 |
| aiRole | string | 필수 | AI 역할 |
| missions | Mission[] | 필수 | 오늘의 미션 |
| expressions | Expression[] | 필수 | 오늘의 표현 |
| words | Word[] | 필수 | 오늘의 단어 |
| turns | Turn[] | 필수 | 기본 5턴 대화 |
| extensionPrompts | ExtensionPrompt[] | 필수 | 6~10턴 확장 질문 |
| feedbackRules | FeedbackRule[] | 필수 | 발화 평가 기준 |
| reportCopy | ReportCopy | 필수 | 리포트 문구 |

## 2. Mission

```json
{
  "missionId": "mission_1",
  "order": 1,
  "text": "머리를 조금 다듬고 싶다고 말하기",
  "successCriteria": [
    "trim",
    "hair",
    "a little"
  ],
  "recommendedExpressionIds": ["expr_1", "expr_2"]
}
```

### 기준

- MVP에서는 시나리오당 미션 2개를 기본으로 한다.
- 미션은 학습자가 대화 중 실제로 말할 수 있는 행동이어야 한다.
- 미션 성공 조건은 키워드만이 아니라 의미 기반 평가가 가능해야 한다.

## 3. Expression

```json
{
  "expressionId": "expr_1",
  "pattern": "I'd like to ...",
  "meaning": "...하고 싶어요",
  "missionIds": ["mission_1"],
  "examples": [
    {
      "fixed": "I'd like to",
      "variable": "trim my hair a little.",
      "ko": "머리를 조금 다듬고 싶어요."
    }
  ]
}
```

### 기준

- 표현은 미션 수행에 직접 필요한 것만 제공한다.
- 한 시나리오당 2~3개가 적절하다.
- 예문은 실제 대화에서 바로 쓸 수 있어야 한다.

## 4. Word

```json
{
  "wordId": "word_1",
  "word": "trim",
  "meaning": "다듬다",
  "example": "I'd like a trim.",
  "ko": "머리를 다듬고 싶어요.",
  "focus": "trim",
  "missionIds": ["mission_1"]
}
```

### 기준

- 한 시나리오당 5개 내외를 기본으로 한다.
- 단어는 오늘의 대화에서 반복적으로 쓰일 가능성이 높아야 한다.
- 너무 어려운 단어보다 미션 수행에 필요한 단어를 우선한다.

## 5. Turn

기본 5턴 대화 데이터입니다. 여기서 1턴은 AI 발화 1회와 학습자 발화 1회를 합친 한 쌍을 의미합니다.

예:

- 1턴 = AI 질문/반응 1회 + 학습자 답변 1회
- `turnIndex: 1`에는 첫 번째 AI 발화와 그에 대한 첫 번째 학습자 예상 답변이 함께 들어갑니다.
- `turnCount`는 완료된 AI-학습자 대화 쌍의 개수를 의미합니다.

```json
{
  "turnIndex": 1,
  "ai": {
    "text": "Hello! How can I help you today?",
    "ko": "안녕하세요. 오늘 어떻게 도와드릴까요?",
    "intent": "open_request"
  },
  "expectedUser": {
    "text": "I'd like to trim my hair a little.",
    "status": "perfect",
    "missionIdsCompleted": ["mission_1"],
    "feedbackId": null
  }
}
```

### 기준

- 기본 대화는 최소 5턴, 즉 AI-학습자 대화 쌍 5개를 가진다.
- 5턴 안에 모든 미션을 완료할 수 있어야 한다.
- AI 질문은 너무 길지 않아야 한다.
- 학습자 예상 답변은 perfect, better, correction을 섞어야 한다.
- 학습자가 실제로 다른 답변을 하면 평가 프롬프트가 status와 feedback을 동적으로 생성한다.

## 6. ExtensionPrompt

6~10턴 확장 대화용 질문입니다.

```json
{
  "turnIndex": 6,
  "text": "Would you like the ends to look soft or straight?",
  "ko": "끝부분이 부드럽게 보이면 좋으세요, 아니면 일자로 보이면 좋으세요?",
  "purpose": "additional_preference"
}
```

### 기준

- 확장 질문은 미션 이후 추가 연습을 돕는다.
- 9턴은 마무리 예고 성격이어야 한다.
- 10턴은 리포트 이동 안내 문구여야 한다.

## 7. FeedbackRule

학습자 발화를 평가할 때 사용하는 기준입니다.

```json
{
  "feedbackId": "feedback_better_trim",
  "status": "better",
  "trigger": "User says 'Just a little, please' when a more specific haircut request is better.",
  "userTextExample": "Just a little, please.",
  "suggestedText": "Just a little trim, please.",
  "koNote": "의미 전달은 되지만 자연스럽지 않아요.",
  "relatedMissionIds": ["mission_1"],
  "relatedExpressionIds": ["expr_2"]
}
```

### status 값

| status | 의미 | UI |
|---|---|---|
| perfect | 자연스럽고 명확함 | 초록 체크 |
| better | 의미는 통하지만 더 좋은 표현 있음 | 손바닥 |
| correction | 문법/시제/전치사/어순 오류 있음 | 빨간 느낌표 |

## 8. ReportCopy

```json
{
  "completeSummary": "오늘의 미션을 모두 완료했어요. 리포트에서 표현과 피드백을 확인해 보세요.",
  "partialSummary": "아직 미션을 모두 완료하지 않았어요. 그래도 지금까지 말한 내용으로 리포트를 확인할 수 있어요.",
  "completeFeedback": "오늘의 미션을 잘 완료했어요. 다음에는 pay special attention to를 한 덩어리 표현으로 기억해 보세요.",
  "partialFeedbackTemplate": "현재 {completedMissions}/{totalMissions}개 미션을 완료했어요. 다음에는 남은 미션을 떠올리며 조금 더 이어서 말해 보세요."
}
```

## 9. ConversationResult

대화가 끝났을 때 저장되는 결과 데이터입니다.

```json
{
  "sessionId": "session_001",
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "startedAt": "2026-07-10T09:00:00+09:00",
  "endedAt": "2026-07-10T09:03:00+09:00",
  "turnCount": 10,
  "completedMissionIds": ["mission_1", "mission_2"],
  "userTurns": [],
  "metrics": {
    "spokenWordCount": 24,
    "durationSeconds": 180,
    "correctionCount": 1,
    "betterCount": 1,
    "perfectCount": 3
  }
}
```

## 10. UserTurnResult

학습자 발화 1개에 대한 평가 결과입니다.

```json
{
  "turnIndex": 4,
  "aiText": "Sure. How much would you like me to cut?",
  "userText": "Just a little, please.",
  "status": "better",
  "feedback": {
    "koNote": "의미 전달은 되지만 자연스럽지 않아요.",
    "suggestedText": "Just a little trim, please."
  },
  "completedMissionIds": []
}
```

## 11. 미용실 시나리오 예시 데이터

```json
{
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "type": "preset",
  "category": "daily",
  "level": "beginner",
  "title": "미용실에서 원하는 머리 설명하기",
  "summary": "미용사에게 원하는 머리 길이와 앞머리 요청을 자연스럽게 말한다.",
  "userRole": "손님",
  "aiRole": "미용사",
  "missions": [
    {
      "missionId": "mission_1",
      "order": 1,
      "text": "머리를 조금 다듬고 싶다고 말하기",
      "successCriteria": ["trim", "hair", "a little"],
      "recommendedExpressionIds": ["expr_1", "expr_2"]
    },
    {
      "missionId": "mission_2",
      "order": 2,
      "text": "앞머리를 특별히 신경 써 달라고 요청하기",
      "successCriteria": ["bangs", "pay attention", "careful"],
      "recommendedExpressionIds": ["expr_3"]
    }
  ],
  "expressions": [
    {
      "expressionId": "expr_1",
      "pattern": "I'd like to ...",
      "meaning": "...하고 싶어요",
      "missionIds": ["mission_1"],
      "examples": [
        {
          "fixed": "I'd like to",
          "variable": "trim my hair a little.",
          "ko": "머리를 조금 다듬고 싶어요."
        }
      ]
    },
    {
      "expressionId": "expr_2",
      "pattern": "Just a little ...",
      "meaning": "조금만 ...",
      "missionIds": ["mission_1"],
      "examples": [
        {
          "fixed": "Just a little",
          "variable": "trim, please.",
          "ko": "조금만 다듬어 주세요."
        }
      ]
    },
    {
      "expressionId": "expr_3",
      "pattern": "Please pay special attention to ...",
      "meaning": "...을 특별히 신경 써 주세요",
      "missionIds": ["mission_2"],
      "examples": [
        {
          "fixed": "Please pay special attention to",
          "variable": "my bangs.",
          "ko": "앞머리를 특별히 신경 써 주세요."
        }
      ]
    }
  ]
}
```

## 12. 병원 시나리오 예시 데이터

```json
{
  "scenarioId": "clinic_symptoms_beginner",
  "type": "preset",
  "category": "medical",
  "level": "beginner",
  "title": "병원에서 증상 자세히 설명하기",
  "summary": "의사에게 어디가 아픈지, 언제부터 증상이 있었는지 자세히 설명한다.",
  "userRole": "환자",
  "aiRole": "의사",
  "missions": [
    {
      "missionId": "mission_1",
      "order": 1,
      "text": "어디가 아픈지 말하기",
      "successCriteria": ["fever", "body aches", "sick"],
      "recommendedExpressionIds": ["expr_1"]
    },
    {
      "missionId": "mission_2",
      "order": 2,
      "text": "어젯밤부터 몸살과 열이 난다고 자세히 설명하기",
      "successCriteria": ["since last night", "have had", "fever", "body aches"],
      "recommendedExpressionIds": ["expr_2", "expr_3"]
    }
  ],
  "expressions": [
    {
      "expressionId": "expr_1",
      "pattern": "I have ...",
      "meaning": "...이 있어요 / ...이 아파요",
      "missionIds": ["mission_1"],
      "examples": [
        {
          "fixed": "I have",
          "variable": "a fever and body aches.",
          "ko": "열과 몸살이 있어요."
        }
      ]
    },
    {
      "expressionId": "expr_2",
      "pattern": "I've had ... since ...",
      "meaning": "...부터 계속 ...이 있어요",
      "missionIds": ["mission_2"],
      "examples": [
        {
          "fixed": "I've had",
          "variable": "body aches and a fever since last night.",
          "ko": "어젯밤부터 몸살과 열이 있어요."
        }
      ]
    }
  ]
}
```

## 13. 구현 우선순위

1. Scenario, Mission, Expression, Word 구조 확정
2. Turn, UserTurnResult 구조 확정
3. FeedbackRule 구조 확정
4. ReportCopy와 ConversationResult 구조 확정
5. 기본 시나리오 2개를 위 구조로 마이그레이션
6. 나만의 시나리오 생성 프롬프트가 이 구조를 반환하도록 설계
7. 학습자 발화 평가 프롬프트가 UserTurnResult를 반환하도록 설계
