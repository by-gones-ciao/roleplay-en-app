# TalkFlow 레벨별 난이도 기준서

이 문서는 TalkFlow의 레벨 선택이 콘텐츠 생성, AI 응답, 학습자 발화 평가, 학습 리포트에 일관되게 반영되도록 하기 위한 기준입니다.

## 1. 레벨 목록

| 앱 표시 | 내부 값 | 학습자 상태 |
|---|---|---|
| Starter(입문) | starter | 아주 짧은 표현부터 차근차근 연습하고 싶은 학습자 |
| Beginner(초급) | beginner | 기초적인 짧은 문장은 말할 수 있는 학습자 |
| Pre-Intermediate(초중급) | pre_intermediate | 조금은 말할 수 있지만 더 자연스러워지고 싶은 학습자 |
| Intermediate(중급) | intermediate | 일상 대화는 어느 정도 가능하고 체계적으로 말하고 싶은 학습자 |
| Advanced(고급) | advanced | 대부분의 상황에서 말할 수 있고 더 정확하고 상세한 표현을 쓰고 싶은 학습자 |

## 2. 레벨별 핵심 원칙

### Starter(입문)

- 목표: 영어로 입을 떼는 것
- AI 질문: 매우 짧고 직접적인 질문
- 학습자 기대 답변: 3~5단어 또는 아주 짧은 문장
- 미션 복잡도: 하나의 행동만 요구
- 표현 난이도: 고정 표현 위주
- 피드백 강도: 매우 가볍게, 말한 시도를 우선 인정
- 번역/힌트 의존도: 높음

예:

```text
AI: What do you want?
User: A little trim, please.
```

### Beginner(초급)

- 목표: 짧은 한 문장으로 원하는 바를 말하기
- AI 질문: 짧고 명확한 질문
- 학습자 기대 답변: 한 문장
- 미션 복잡도: 1~2개 정보를 말하기
- 표현 난이도: I'd like to, I have, Please ... 등 기본 패턴
- 피드백 강도: 핵심 오류 중심으로 짧게 설명
- 번역/힌트 의존도: 중간~높음

예:

```text
AI: How much would you like me to cut?
User: Just a little trim, please.
```

### Pre-Intermediate(초중급)

- 목표: 기본 문장에 이유나 상태 설명을 덧붙이기
- AI 질문: 짧은 상황 설명 + 질문 하나
- 학습자 기대 답변: 한 문장 또는 짧은 두 문장
- 미션 복잡도: 요청 + 이유/상세 조건
- 표현 난이도: since, because, a little more, could you 등
- 피드백 강도: 자연스러운 표현과 문장 구조 개선까지 제공
- 번역/힌트 의존도: 중간

예:

```text
AI: That helps. How would you like your bangs?
User: Please trim my bangs to the same level as my eyebrows.
```

### Intermediate(중급)

- 목표: 상황을 더 구체적으로 설명하고 선호를 말하기
- AI 질문: 자연스러운 반응 + 맥락 있는 질문 하나
- 학습자 기대 답변: 1~2문장
- 미션 복잡도: 요청 + 이유 + 조건
- 표현 난이도: prefer, make sure, avoid, in case, if possible 등
- 피드백 강도: 문장 구조, 어휘 선택, 뉘앙스까지 제공
- 번역/힌트 의존도: 낮음~중간

예:

```text
AI: I understand. What kind of style do you want to avoid?
User: I want to avoid anything too short because I still need to tie my hair.
```

### Advanced(고급)

- 목표: 정확한 뉘앙스, 조건, 예외까지 자연스럽게 말하기
- AI 질문: 실제 원어민 대화에 가까운 맥락형 질문 하나
- 학습자 기대 답변: 2문장 이상 가능
- 미션 복잡도: 요청 + 배경 + 선호 + 예외/조건
- 표현 난이도: nuance, soften, maintain, slightly, overall, depending on 등
- 피드백 강도: 원어민다운 표현, 문장 리듬, 수동/능동, 톤 조정까지 제공
- 번역/힌트 의존도: 낮음

예:

```text
AI: That makes sense. How would you like the overall shape to look after the trim?
User: I'd like to keep the overall length, but I'd prefer the ends to look softer and less heavy.
```

## 3. 레벨별 AI 질문 기준

| 레벨 | AI 질문 길이 | AI 발화 구조 | 질문 수 |
|---|---|---|---|
| starter | 3~7단어 | 질문만 | 1개 |
| beginner | 5~10단어 | 질문만 또는 짧은 확인 + 질문 | 1개 |
| pre_intermediate | 8~14단어 | 짧은 반응 + 질문 | 1개 |
| intermediate | 10~18단어 | 맥락 반응 + 질문 | 1개 |
| advanced | 12~24단어 | 자연스러운 의견/상황 설명 + 질문 | 1개 |

공통 기준:

- 한 턴에 질문은 반드시 하나만 한다.
- 문장이 여러 개일 수는 있지만 학습자가 답해야 하는 질문은 하나여야 한다.
- 질문이 두 개로 나뉘는 선택지는 피한다.
- 필요하면 짧은 진술 뒤에 질문 하나를 붙인다.

## 4. 레벨별 학습자 기대 답변

| 레벨 | 기대 답변 길이 | 예 |
|---|---|---|
| starter | 3~5단어 | A little trim, please. |
| beginner | 짧은 한 문장 | I'd like a little trim. |
| pre_intermediate | 한 문장 또는 짧은 두 문장 | I'd like a little trim. Please be careful with my bangs. |
| intermediate | 1~2문장 | I'd like a little trim, but please keep the length around my shoulders. |
| advanced | 2문장 이상 가능 | I'd like to keep the overall length, but soften the ends a bit. I also want my bangs to stay just above my eyebrows. |

## 5. 레벨별 미션 설계 기준

| 레벨 | 미션 수 | 미션 형태 |
|---|---:|---|
| starter | 1~2개 | 단순 요청 말하기 |
| beginner | 2개 | 요청 + 간단한 상세 정보 |
| pre_intermediate | 2개 | 요청 + 이유/기간/상태 |
| intermediate | 2~3개 | 요청 + 조건 + 선호 |
| advanced | 2~3개 | 요청 + 뉘앙스 + 예외/조건 |

예: 미용실 시나리오

- starter: 머리를 조금 다듬고 싶다고 말하기
- beginner: 머리를 조금 다듬고, 앞머리를 신경 써 달라고 말하기
- pre_intermediate: 앞머리 길이를 눈썹 기준으로 설명하기
- intermediate: 원하는 스타일과 피하고 싶은 스타일을 말하기
- advanced: 전체 길이는 유지하면서 끝부분의 무게감과 질감을 설명하기

## 6. 레벨별 표현/단어 기준

### Starter

- 표현: fixed chunk 중심
- 예: A little, please. / This one, please. / I have a fever.
- 단어: 가장 직접적인 명사/동사

### Beginner

- 표현: 기본 문장 패턴
- 예: I'd like to ... / I have ... / Please ...
- 단어: 상황 핵심 단어

### Pre-Intermediate

- 표현: 시간, 이유, 상태 설명
- 예: I've had ... since ... / Could you ...? / I also feel ...
- 단어: 증상, 선호, 정도 표현

### Intermediate

- 표현: 조건, 선호, 요청 조정
- 예: I'd prefer ... / Please make sure ... / If possible ...
- 단어: 뉘앙스가 있는 형용사/부사

### Advanced

- 표현: 세밀한 뉘앙스와 자연스러운 회화 표현
- 예: I'd like to keep ..., but ... / I'm aiming for ... / Depending on ...
- 단어: 질감, 정도, 예외 조건, 분위기 표현

## 7. 레벨별 피드백 기준

| 레벨 | better 기준 | correction 기준 | 설명 길이 |
|---|---|---|---|
| starter | 더 쉬운 고정 표현 제안 | 의미 전달을 막는 오류만 교정 | 매우 짧게 |
| beginner | 더 자연스러운 기본 문장 제안 | 핵심 문법/전치사/어순 교정 | 짧게 |
| pre_intermediate | 문장 구조와 시제 개선 | 시제, 전치사, 단수/복수 등 교정 | 1문장 |
| intermediate | 어휘 선택, 능동/수동, 문장 연결 개선 | 구조/시제/관사/어휘 뉘앙스 교정 | 1~2문장 |
| advanced | 원어민다운 표현, 톤, 리듬 개선 | 뉘앙스, 정확성, 문체까지 교정 | 1~2문장 |

공통:

- 모든 한국어 피드백은 친절한 EFL 교사 말투로 작성한다.
- 모든 한국어 피드백은 "~요."로 끝낸다.
- perfect일 때는 별도 설명을 보여주지 않는다.

## 8. 레벨별 대화 진행 방식

### Starter

- AI가 많이 이끌어 준다.
- 질문은 매우 짧게 한다.
- 학습자가 단어 또는 짧은 구로 답해도 진행한다.

### Beginner

- AI가 자연스럽게 다음 질문을 제시한다.
- 학습자가 한 문장으로 답하도록 유도한다.
- 미션 표현을 쓸 기회를 명확히 만든다.

### Pre-Intermediate

- AI가 짧게 반응한 뒤 질문한다.
- 학습자가 이유/기간/상태를 추가하도록 유도한다.

### Intermediate

- AI가 실제 대화처럼 맥락을 이어간다.
- 학습자가 조건이나 선호를 말하도록 유도한다.

### Advanced

- AI가 더 실제적인 대화 파트너처럼 반응한다.
- 학습자가 세부 뉘앙스, 예외, 조건을 말하도록 유도한다.

## 9. 레벨별 주제 이탈 대응

주제 이탈 대응도 레벨별로 복잡도를 다르게 한다.

| 레벨 | 대응 방식 |
|---|---|
| starter | 짧게 인정하고 바로 쉬운 질문으로 복귀 |
| beginner | 짧게 인정하고 현재 상황 질문으로 복귀 |
| pre_intermediate | 인정 + 상황 복귀 + 미션 관련 질문 |
| intermediate | 자연스러운 연결 문장 + 미션/상황 질문 |
| advanced | 대화 흐름을 해치지 않게 부드럽게 재정렬 |

예:

Starter:

```text
Okay. Haircut now. Shorter?
```

Beginner:

```text
I see. Let's talk about your haircut. How short do you want it?
```

Intermediate:

```text
I understand, but let's focus on your haircut for now. What length would feel comfortable for you?
```

## 10. 레벨별 리포트 톤

| 레벨 | 리포트 톤 |
|---|---|
| starter | 시도 자체를 많이 인정 |
| beginner | 말한 핵심 표현을 확인 |
| pre_intermediate | 자연스러워진 표현을 짚어 줌 |
| intermediate | 표현 정확도와 구조를 함께 피드백 |
| advanced | 뉘앙스, 자연스러움, 세부 표현을 피드백 |

## 11. 개발 반영 기준

AI 프롬프트에는 항상 아래 값을 전달해야 한다.

```json
{
  "level": "beginner",
  "levelSpec": {
    "expectedUserAnswerLength": "short_sentence",
    "aiQuestionStyle": "short_clear_question",
    "feedbackDepth": "short_core_feedback",
    "missionComplexity": "request_plus_detail"
  }
}
```

## 12. 품질 검수 체크리스트

1. 선택한 레벨에 비해 AI 질문이 너무 길지 않은가?
2. 한 턴에 질문이 하나만 있는가?
3. 학습자 기대 답변 길이가 레벨에 맞는가?
4. 단어와 표현이 레벨에 비해 너무 어렵지 않은가?
5. 피드백 설명이 레벨에 맞게 충분하거나 간결한가?
6. 주제 이탈 시 레벨에 맞는 방식으로 대화를 되돌리는가?
7. 리포트 문구가 학습자의 레벨과 진행 정도에 맞는가?

