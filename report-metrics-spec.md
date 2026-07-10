# TalkFlow 학습 리포트 계산 기준서

이 문서는 TalkFlow의 학습 리포트에서 보여주는 모든 수치, 목록, 상태 문구를 어떻게 계산하고 표시할지 정의합니다.

## 1. 리포트 제공 기준

| 대화 상태 | 리포트 제공 | 리포트 유형 |
|---|---|---|
| 학습자 발화 0턴 | 제공 안 함 | 없음 |
| 학습자 발화 1~9턴 | 제공 | 짧은 리포트 |
| 학습자 발화 10턴 이상 | 제공 | 일반 리포트 |
| 미션 모두 완료 | 제공 | 완료 리포트 |
| 20턴 자동 종료 | 제공 | 진행 상태에 따른 리포트 |

## 2. 리포트 데이터 입력값

리포트 계산에는 아래 데이터가 필요합니다.

```json
{
  "sessionId": "session_001",
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "title": "미용실에서 원하는 머리 설명하기",
  "startedAt": "2026-07-10T09:00:00+09:00",
  "endedAt": "2026-07-10T09:03:00+09:00",
  "turnCount": 10,
  "missions": [],
  "completedMissionIds": [],
  "conversationTurns": [],
  "userTurnResults": []
}
```

## 3. 핵심 지표

리포트 상단에는 아래 3개 지표를 기본으로 표시합니다.

1. 말한 단어
2. 대화 시간
3. 미션 평가

## 4. 말한 단어 수 계산

### 기준

학습자가 실제로 말하거나 입력한 영어 텍스트만 계산합니다.

포함:

- 음성 인식 결과
- 키보드 입력 결과
- 다시 녹음 후 최종 확정된 답변

제외:

- AI 발화
- AI 발화 번역
- 힌트 문장
- 교정 문장
- 더 좋은 표현 문장
- 삭제된 과거 답변

### 계산 방식

```text
spokenWordCount = 모든 최종 학습자 발화의 영어 단어 수 합계
```

단어 분리 기준:

- 공백 기준으로 1차 분리
- 쉼표, 마침표, 물음표, 느낌표는 단어 수에서 제외
- 축약형은 1단어로 계산
  - I've = 1
  - I'd = 1
  - don't = 1

예:

```text
I've had body aches and a fever since last night.
```

계산:

```text
I've / had / body / aches / and / a / fever / since / last / night = 10개
```

## 5. 대화 시간 계산

### 기준

대화 시간은 실제 대화 화면에 머문 시간을 기준으로 계산합니다.

시작:

```text
대화하기 화면에 진입한 시점
```

종료:

```text
리포트 보기로 이동한 시점
```

제외 가능:

- 앱이 백그라운드로 간 시간
- 네트워크 오류로 멈춘 시간
- 사용자가 입력을 하지 않고 장시간 방치한 시간

MVP에서는 단순 계산을 우선합니다.

```text
durationSeconds = endedAt - startedAt
```

### 표시 기준

| 시간 | 표시 |
|---:|---|
| 0~59초 | 1분 미만 |
| 60~89초 | 1분 내외 |
| 90초 이상 | 반올림한 분 |

예:

- 42초: `1분 미만`
- 72초: `1분 내외`
- 138초: `2분 내외`

## 6. 미션 평가 계산

### 기준

미션 평가는 완료한 미션 수 / 전체 미션 수로 표시합니다.

```text
missionScore = completedMissionIds.length / missions.length
```

예:

```text
2/2
1/2
0/2
```

### 완료 판정

미션 완료는 키워드만으로 판단하지 않고 의미 기반으로 평가합니다.

예:

미션:

```text
앞머리를 특별히 신경 써 달라고 요청하기
```

완료로 인정:

```text
Please pay special attention to my bangs.
Please be careful with my bangs.
Could you be extra careful with my bangs?
```

미완료:

```text
My bangs.
I like bangs.
```

## 7. 피드백 개수 계산

### 교정 문장 개수

```text
correctionCount = userTurnResults 중 status가 correction인 항목 수
```

### 더 좋은 표현 개수

```text
betterCount = userTurnResults 중 status가 better인 항목 수
```

### 완벽 문장 개수

```text
perfectCount = userTurnResults 중 status가 perfect인 항목 수
```

## 8. 교정 문장 보기

### 표시 기준

`status = correction`인 학습자 발화만 모아서 보여줍니다.

각 항목은 실제 대화창 형식으로 보여줍니다.

포함:

1. 해당 학습자 발화 직전 AI 질문
2. AI 질문의 음성 버튼
3. AI 질문의 번역 버튼
4. 학습자 발화
5. 빨간 느낌표 아이콘
6. 피드백 박스
7. 한글 설명
8. 구분선
9. 교정 문장
10. 교정 영어 문장

제외:

- 다시하기 버튼
- 학습자 발화 번역

### 빈 상태 문구

```text
이번 대화에서는 교정이 필요한 문장이 없었어요.
```

## 9. 더 좋은 표현 보기

### 표시 기준

`status = better`인 학습자 발화만 모아서 보여줍니다.

각 항목은 실제 대화창 형식으로 보여줍니다.

포함:

1. 해당 학습자 발화 직전 AI 질문
2. AI 질문의 음성 버튼
3. AI 질문의 번역 버튼
4. 학습자 발화
5. 손바닥 아이콘
6. 피드백 박스
7. 한글 설명
8. 구분선
9. 더 좋은 표현
10. 추천 영어 문장

제외:

- 다시하기 버튼
- 학습자 발화 번역

### 빈 상태 문구

```text
이번 대화에서는 더 좋은 표현 제안이 없었어요.
```

## 10. 전체 대화 보기

### 표시 기준

실제 대화창과 같은 형식으로 전체 대화를 보여줍니다.

포함:

- AI 발화
- AI 음성 버튼
- AI 번역 버튼
- 학습자 발화

제외:

- 미션 카드
- 학습자 평가 아이콘
- 다시하기 버튼
- 입력창

## 11. 리포트 요약 문구

### 완료 리포트

조건:

```text
completedMissionIds.length === missions.length
```

문구:

```text
오늘의 미션을 모두 완료했어요. 리포트에서 표현과 피드백을 확인해 보세요.
```

### 짧은 리포트

조건:

```text
turnCount >= 1 && turnCount < 10
```

문구:

```text
짧게 연습했어요. 지금까지 말한 내용으로 리포트를 확인해 보세요.
```

### 미션 미완료 리포트

조건:

```text
turnCount >= 10 && completedMissionIds.length < missions.length
```

문구:

```text
아직 미션을 모두 완료하지 않았어요. 다음에는 남은 미션까지 이어서 말해 보세요.
```

## 12. AI 피드백 생성 기준

AI 피드백은 아래 우선순위로 생성합니다.

1. 미션 완료 여부
2. 가장 많이 나온 피드백 유형
3. 가장 중요한 교정 포인트
4. 오늘의 표현 사용 여부
5. 다음 연습 방향

### 완료 리포트 예

```text
오늘의 미션을 잘 완료했어요. 다음에는 pay special attention to를 한 덩어리 표현으로 기억해 보세요.
```

### 짧은 리포트 예

```text
짧게 연습했지만 핵심 표현을 시작했어요. 다음에는 남은 미션까지 이어서 말해 보세요.
```

### 미션 미완료 리포트 예

```text
현재 1/2개 미션을 완료했어요. 다음에는 앞머리 요청까지 이어서 말해 보세요.
```

## 13. 리포트 상태값

```json
{
  "reportType": "none | short | partial | complete",
  "turnCount": 6,
  "completedMissionCount": 1,
  "totalMissionCount": 2
}
```

### 상태 기준

| reportType | 조건 |
|---|---|
| none | turnCount === 0 |
| short | turnCount >= 1 && turnCount < 10 |
| partial | turnCount >= 10 && 미션 일부 또는 전체 미완료 |
| complete | 미션 모두 완료 |

## 14. 다시 녹음 후 리포트 재계산

다시 녹음이 발생하면 해당 턴 이후의 리포트 데이터는 모두 재계산합니다.

재계산 항목:

- turnCount
- spokenWordCount
- durationSeconds는 유지 가능
- completedMissionIds
- correctionCount
- betterCount
- perfectCount
- 전체 대화 보기
- 교정 문장 보기
- 더 좋은 표현 보기
- AI 피드백

## 15. 리포트 저장 데이터

```json
{
  "reportId": "report_001",
  "sessionId": "session_001",
  "scenarioId": "hair_salon_trim_bangs_beginner",
  "reportType": "complete",
  "summary": "오늘의 미션을 모두 완료했어요. 리포트에서 표현과 피드백을 확인해 보세요.",
  "metrics": {
    "spokenWordCount": 24,
    "durationSeconds": 138,
    "displayDuration": "2분 내외",
    "missionScore": "2/2",
    "correctionCount": 1,
    "betterCount": 1,
    "perfectCount": 3
  },
  "corrections": [],
  "betterExpressions": [],
  "conversation": [],
  "aiFeedback": "오늘의 미션을 잘 완료했어요. 다음에는 pay special attention to를 한 덩어리 표현으로 기억해 보세요.",
  "createdAt": "2026-07-10T09:03:00+09:00"
}
```

## 16. 화면 표시 순서

학습 리포트 화면은 아래 순서로 표시합니다.

1. 상단 제목: 학습 리포트
2. 시나리오 제목
3. 리포트 상태 문구
4. 지표 3개
   - 말한 단어
   - 대화 시간
   - 미션 평가
5. 교정 문장 보기
6. 더 좋은 표현 보기
7. 전체 대화 보기
8. AI 피드백
9. 학습 완료 버튼

## 17. 예외 상황

### 교정 문장 0개

```text
이번 대화에서는 교정이 필요한 문장이 없었어요.
```

### 더 좋은 표현 0개

```text
이번 대화에서는 더 좋은 표현 제안이 없었어요.
```

### 전체 대화 없음

0턴에서는 리포트를 만들지 않으므로 전체 대화 없음 화면은 제공하지 않습니다.

### 리포트 생성 실패

문구:

```text
학습 리포트를 만들지 못했어요. 다시 시도해 주세요.
```

버튼:

- 다시 시도
- 홈으로 가기

## 18. 품질 검수 체크리스트

1. 0턴 종료 시 리포트가 생성되지 않는가?
2. 1~9턴 종료 시 짧은 리포트가 생성되는가?
3. 10턴 이상 미션 미완료 시 partial 리포트가 생성되는가?
4. 미션 완료 시 complete 리포트가 생성되는가?
5. 말한 단어 수가 학습자 발화만 기준으로 계산되는가?
6. AI 발화와 번역이 단어 수에 포함되지 않는가?
7. 다시 녹음 후 삭제된 답변이 리포트에서 제외되는가?
8. 교정 문장 개수가 실제 correction 개수와 일치하는가?
9. 더 좋은 표현 개수가 실제 better 개수와 일치하는가?
10. 전체 대화 보기에 평가 아이콘과 다시하기 버튼이 없는가?
11. AI 발화에는 음성/번역 버튼이 유지되는가?
12. 학습자 발화에는 번역이 없는가?
13. 짧은 리포트의 톤이 부담스럽지 않은가?
14. 완료 리포트가 실제 미션 완료 여부와 일치하는가?
15. 리포트 생성 실패 시 재시도 흐름이 있는가?

