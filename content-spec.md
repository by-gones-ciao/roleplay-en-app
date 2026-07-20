# TalkFlow MVP 콘텐츠 기준서

이 문서는 웹 개발자가 TalkFlow의 기본 시나리오 콘텐츠와 AI 생성/평가 프롬프트 구조를 구현할 때 참고할 최소 기준입니다.

## 공통 콘텐츠 구조

각 시나리오는 아래 항목을 가져야 합니다.

1. 시나리오 제목
2. 상황 설명
3. 나의 역할
4. AI의 역할
5. 오늘의 미션 2~3개
6. 오늘의 표현 2~3개
7. 오늘의 단어 5개 내외
8. 레벨별 최소 답변 수 기본 대화
9. 레벨별 확장 대화 기준
10. 미션 달성 조건
11. 턴별 피드백 예시
12. 학습 리포트 문구

## 대화 운영 기준

- 1턴은 AI 발화 1회와 학습자 발화 1회를 합친 한 쌍
- 최소/최대 기준은 학습자 답변 수 기준으로 레벨별 적용
| 레벨 | 최소 학습자 답변 수 | 최대 학습자 답변 수 | 마무리 예고 | 자동 종료 |
|---|---:|---:|---:|---:|
| 입문 | 5회 | 10회 | 9회 이후 | 10회 |
| 초급 | 5회 | 20회 | 18회 이후 | 20회 |
| 초중급 | 6회 | 20회 | 18회 이후 | 20회 |
| 중급 | 7회 | 20회 | 18회 이후 | 20회 |
| 고급 | 8회 | 20회 | 18회 이후 | 20회 |
- 미션 완료 전에는 레벨별 최소 답변 수 전 자동 종료 없음
- 미션 완료 + 레벨별 최소 답변 수 이상이면 종료 선택지 노출
- 사용자가 계속하기를 선택하면 레벨별 최대 답변 수까지 확장
- 마무리 예고 시점부터 AI가 자연스럽게 종료 준비
- 최대 답변 수에서 AI가 마무리 후 리포트 이동
- 사용자는 언제든 X 버튼으로 중단 가능
- 완료 턴 0턴에서 중단하면 리포트 제공 없음
- 완료 턴 1턴 이상이면 짧은 리포트 제공

## 시나리오 1: 미용실에서 원하는 머리 설명하기

### 기본 정보

- 제목: 미용실에서 원하는 머리 설명하기
- 상황 설명: 미용사에게 원하는 머리 길이와 앞머리 요청을 자연스럽게 말한다.
- 나의 역할: 손님
- AI의 역할: 미용사
- 권장 레벨: 초급

### 오늘의 미션

1. 머리를 조금 다듬고 싶다고 말하기
2. 앞머리를 특별히 신경 써 달라고 요청하기

### 오늘의 표현

1. I'd like to ...
   - 의미: ...하고 싶어요
   - 미션 연결: 미션 1
   - 예문: I'd like to trim my hair a little.

2. Just a little ...
   - 의미: 조금만 ...
   - 미션 연결: 미션 1
   - 예문: Just a little trim, please.

3. Please pay special attention to ...
   - 의미: ...을 특별히 신경 써 주세요
   - 미션 연결: 미션 2
   - 예문: Please pay special attention to my bangs.

### 오늘의 단어

1. trim: 다듬다
2. hair: 머리카락
3. bangs: 앞머리
4. a little: 조금
5. eyebrows: 눈썹

### 레벨별 최소 답변 수 기본 대화

1. AI: Hello! How can I help you today?
   - 번역: 안녕하세요. 오늘 어떻게 도와드릴까요?
   - 학습자 목표: 원하는 서비스 말하기

2. User: I'd like to trim my hair a little.
   - 평가: 완벽
   - 미션: 1번 달성

3. AI: Sure. How much would you like me to cut?
   - 번역: 네. 얼마나 자르고 싶으세요?

4. User: Just a little, please.
   - 평가: 더 좋은 표현
   - 더 좋은 표현: Just a little trim, please.
   - 설명: 의미 전달은 되지만 자연스럽지 않아요.

5. AI: Okay. What about your bangs?
   - 번역: 좋아요. 앞머리는 어떻게 할까요?

6. User: At the same level my eyebrows.
   - 평가: 교정
   - 교정 문장: At the same level as my eyebrows.
   - 설명: 전치사 사용에 주의하세요.

7. AI: Got it. Should I be extra careful with your bangs?
   - 번역: 알겠습니다. 앞머리를 더 조심해서 봐 드릴까요?

8. User: Yes, please pay special attention to my bangs.
   - 평가: 완벽
   - 미션: 2번 달성

9. AI: No problem. Do you want the rest of your hair layered?
   - 번역: 문제없어요. 나머지 머리는 층을 내길 원하시나요?

10. User: No, just keep it simple, please.
    - 평가: 완벽

### 레벨별 확장 대화 방향

확장 대화는 미션을 이미 완료한 뒤 자연스러운 추가 요청을 연습하게 한다.

추천 AI 질문:

11. Would you like the ends to look soft or straight?
12. Do you usually style your hair in the morning?
13. Would you like me to make it easy to manage?
14. Is there any style you want to avoid?
15. Do you want me to keep the length around your shoulders?
16. Would you like me to check the bangs once more?
17. Is this length okay for you?
18. 좋아요. 이제 마지막으로 하나만 더 확인해 볼게요.
19. Is there anything else you want to adjust?
20. 오늘은 여기까지 대화해요. 학습 리포트를 확인해 보세요.

### 피드백 기준

- 완벽: 미션 표현이 자연스럽고 의미가 명확한 경우
- 더 좋은 표현: 의미는 통하지만 더 자연스러운 표현이 있는 경우
- 교정 문장: 문법, 전치사, 어순, 핵심 표현 누락이 있는 경우

### 학습 리포트 문구

- 완료 리포트: 오늘의 미션을 모두 완료했어요. 원하는 머리 길이와 앞머리 요청을 자연스럽게 말했어요.
- 중간 종료 리포트: 아직 미션을 모두 완료하지 않았어요. 지금까지 말한 내용으로 표현을 확인해 보세요.
- AI 피드백: 다음에는 "pay special attention to"를 한 덩어리 표현으로 기억해 보세요.

## 시나리오 2: 병원에서 증상 자세히 설명하기

### 기본 정보

- 제목: 병원에서 증상 자세히 설명하기
- 상황 설명: 의사에게 어디가 아픈지, 언제부터 증상이 있었는지 자세히 설명한다.
- 나의 역할: 환자
- AI의 역할: 의사
- 권장 레벨: 초급~초중급

### 오늘의 미션

1. 어디가 아픈지 말하기
2. 어젯밤부터 몸살과 열이 난다고 자세히 설명하기

### 오늘의 표현

1. I have ...
   - 의미: ...이 있어요 / ...이 아파요
   - 미션 연결: 미션 1
   - 예문: I have a fever and body aches.

2. I've had ... since ...
   - 의미: ...부터 계속 ...이 있어요
   - 미션 연결: 미션 2
   - 예문: I've had body aches and a fever since last night.

3. I also feel ...
   - 의미: 또한 ...한 느낌이 들어요
   - 미션 연결: 미션 2
   - 예문: I also feel chills.

### 오늘의 단어

1. symptom: 증상
2. fever: 열
3. body aches: 몸살, 몸이 쑤심
4. since: ...부터
5. temperature: 체온

### 레벨별 최소 답변 수 기본 대화

1. AI: Hello. What seems to be the problem today?
   - 번역: 안녕하세요. 오늘 어디가 불편하신가요?

2. User: I have a fever and body aches.
   - 평가: 완벽
   - 미션: 1번 달성

3. AI: When did the symptoms start?
   - 번역: 증상은 언제부터 시작됐나요?

4. User: Since last night, I feel fever.
   - 평가: 더 좋은 표현
   - 더 좋은 표현: I've had a fever since last night.
   - 설명: 증상이 계속되는 상황에는 현재완료가 더 자연스러워요.

5. AI: Can you describe your symptoms in more detail?
   - 번역: 증상을 조금 더 자세히 설명해 주시겠어요?

6. User: I have body aches and a fever since last night.
   - 평가: 교정
   - 교정 문장: I've[=I have] had body aches and a fever since last night.
   - 설명: 어젯밤부터 지금까지 이어지는 증상은 현재완료 have had로 말해요.

7. AI: Do you also have chills or a sore throat?
   - 번역: 오한이나 목 통증도 있나요?

8. User: Yes, I also feel chills.
   - 평가: 완벽
   - 미션: 2번 달성

9. AI: Have you checked your temperature?
   - 번역: 체온을 재 보셨나요?

10. User: Yes, my temperature is high.
    - 평가: 완벽

### 레벨별 확장 대화 방향

확장 대화는 증상의 정도, 복용한 약, 추가 증상을 말하게 한다.

추천 AI 질문:

11. Did you take any medicine?
12. Do you have a cough?
13. Are you able to eat normally?
14. Do you feel dizzy?
15. Have you had these symptoms before?
16. Is the fever getting worse?
17. I see. Let me ask one more thing.
18. 좋아요. 이제 마지막으로 하나만 더 확인해 볼게요.
19. Do you need a note for work or school?
20. 오늘은 여기까지 대화해요. 학습 리포트를 확인해 보세요.

### 피드백 기준

- 완벽: 증상과 시작 시점을 명확하게 말한 경우
- 더 좋은 표현: 의미는 통하지만 시제나 표현이 덜 자연스러운 경우
- 교정 문장: since와 현재완료가 어색하게 연결된 경우

### 학습 리포트 문구

- 완료 리포트: 오늘의 미션을 모두 완료했어요. 증상과 시작 시점을 잘 설명했어요.
- 중간 종료 리포트: 아직 미션을 모두 완료하지 않았어요. 지금까지 말한 증상 표현을 확인해 보세요.
- AI 피드백: 다음에는 "I've had"와 "since last night"를 함께 기억해 보세요.

## AI 생성 프롬프트 기준

나만의 시나리오에서 AI가 콘텐츠를 생성할 때는 아래 기준을 따른다.

1. 사용자가 입력한 상황을 한 문장으로 요약한다.
2. 나의 역할과 AI의 역할을 명확히 분리한다.
3. 미션은 2개를 기본으로 생성한다.
4. 오늘의 표현은 미션 수행에 직접 필요한 표현만 고른다.
5. 오늘의 단어는 대화에서 반복될 핵심 단어만 고른다.
6. 대화는 레벨별 최소 답변 수까지 자연스럽게 이어지도록 설계한다.
7. 레벨별 최소 답변 수 안에 미션을 완료할 수 있게 한다.
8. 최소 답변 수 이후 최대 답변 수까지는 추가 연습용 질문으로 구성한다.
9. 학습자 답변에는 완벽, 더 좋은 표현, 교정 문장이 섞이도록 한다.
10. 피드백은 한 문장으로 짧고 명확하게 제공한다.

## 평가 프롬프트 기준

학습자의 발화를 평가할 때는 아래 중 하나로 분류한다.

1. perfect
   - 의미가 명확하고 자연스러움
   - 아이콘: 초록 체크
   - 설명 팝업 없음

2. better
   - 의미는 통하지만 더 자연스러운 표현이 있음
   - 아이콘: 손바닥
   - 제공 항목: 한글 설명, 더 좋은 표현

3. correction
   - 문법, 시제, 전치사, 어순, 핵심 표현 오류가 있음
   - 아이콘: 빨간 느낌표
   - 제공 항목: 한글 설명, 교정 문장
