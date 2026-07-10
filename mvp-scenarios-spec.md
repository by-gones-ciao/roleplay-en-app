# TalkFlow MVP 시나리오 확장 기준서

이 문서는 TalkFlow MVP에서 우선 제공할 기본 시나리오 5개를 정의합니다. 목표는 개발자가 같은 데이터 구조로 콘텐츠를 확장하고, AI 생성/평가 프롬프트를 검증할 수 있도록 하는 것입니다.

## 1. MVP 시나리오 선정 기준

MVP 시나리오는 아래 기준으로 선정합니다.

1. 초급 학습자가 실제로 자주 만나는 상황
2. 역할이 명확한 상황
3. 5~10턴 동안 자연스럽게 이어질 수 있는 상황
4. 미션 2개가 분명하게 들어가는 상황
5. 표현/단어/피드백을 만들기 쉬운 상황
6. 음성 말하기 연습 가치가 높은 상황

## 2. MVP 기본 시나리오 5개

| 우선순위 | 시나리오 | 카테고리 | 권장 레벨 | 나의 역할 | AI 역할 |
|---:|---|---|---|---|---|
| 1 | 미용실에서 원하는 머리 설명하기 | 일상 | 초급 | 손님 | 미용사 |
| 2 | 병원에서 증상 자세히 설명하기 | 병원 | 초급~초중급 | 환자 | 의사 |
| 3 | 식당에서 주문이 잘못 나왔을 때 말하기 | 일상 | 초급 | 손님 | 종업원 |
| 4 | 카페에서 원하는 음료 주문하기 | 일상 | 입문~초급 | 손님 | 바리스타 |
| 5 | 호텔 체크인 요청하기 | 여행 | 초급 | 투숙객 | 호텔 직원 |

## 3. 시나리오 1: 미용실에서 원하는 머리 설명하기

상세 기준은 `content-spec.md`와 `content-data-schema.md`를 따른다.

### 요약

- 상황: 미용사에게 원하는 머리 길이와 앞머리 요청을 말한다.
- 나의 역할: 손님
- AI 역할: 미용사
- 미션:
  1. 머리를 조금 다듬고 싶다고 말하기
  2. 앞머리를 특별히 신경 써 달라고 요청하기
- 핵심 표현:
  - I'd like to ...
  - Just a little ...
  - Please pay special attention to ...
- 핵심 단어:
  - trim
  - hair
  - bangs
  - a little
  - eyebrows

## 4. 시나리오 2: 병원에서 증상 자세히 설명하기

상세 기준은 `content-spec.md`와 `content-data-schema.md`를 따른다.

### 요약

- 상황: 의사에게 어디가 아픈지, 언제부터 증상이 있었는지 설명한다.
- 나의 역할: 환자
- AI 역할: 의사
- 미션:
  1. 어디가 아픈지 말하기
  2. 어젯밤부터 몸살과 열이 난다고 자세히 설명하기
- 핵심 표현:
  - I have ...
  - I've had ... since ...
  - I also feel ...
- 핵심 단어:
  - symptom
  - fever
  - body aches
  - since
  - temperature

주의:

- AI는 진단, 처방, 의학적 판단을 하지 않는다.
- 필요한 경우 “의사와 직접 상담하세요” 수준의 일반 안내만 한다.

## 5. 시나리오 3: 식당에서 주문이 잘못 나왔을 때 말하기

### 기본 정보

- 제목: 식당에서 주문이 잘못 나왔을 때 말하기
- 상황 설명: 식당에서 내가 주문하지 않은 음식이 나왔을 때 상황을 설명하고 조치를 요청한다.
- 나의 역할: 손님
- AI 역할: 종업원
- 권장 레벨: 초급

### 오늘의 미션

1. 내가 주문한 음식이 아니라고 말하기
2. 주문한 음식으로 바꿔 달라고 요청하기

### 오늘의 표현

1. I ordered ...
   - 의미: 저는 ...을 주문했어요
   - 미션 연결: 미션 1
   - 예문: I ordered pasta.

2. This isn't what I ordered.
   - 의미: 이건 제가 주문한 것이 아니에요
   - 미션 연결: 미션 1
   - 예문: This isn't what I ordered.

3. Could you change it to ...?
   - 의미: ...로 바꿔 주실 수 있나요?
   - 미션 연결: 미션 2
   - 예문: Could you change it to pasta?

### 오늘의 단어

1. order: 주문하다
2. dish: 음식, 요리
3. wrong: 잘못된
4. change: 바꾸다
5. receipt: 영수증

### 5~10턴 대화

1. AI: Hi. Is everything okay with your food?
   - 번역: 안녕하세요. 음식은 괜찮으신가요?

2. User: This isn't what I ordered.
   - 평가: 완벽
   - 미션: 1번 달성

3. AI: I'm sorry about that. What did you order?
   - 번역: 죄송합니다. 무엇을 주문하셨나요?

4. User: I ordered pasta.
   - 평가: 완벽

5. AI: I see. Did you receive a different dish?
   - 번역: 알겠습니다. 다른 음식이 나온 건가요?

6. User: Yes, I got chicken instead.
   - 평가: 완벽

7. AI: Thank you for telling me. What would you like me to do?
   - 번역: 말씀해 주셔서 감사합니다. 어떻게 도와드릴까요?

8. User: Could you change it to pasta?
   - 평가: 완벽
   - 미션: 2번 달성

9. AI: Of course. Would you like to keep this dish while you wait?
   - 번역: 물론입니다. 기다리는 동안 이 음식은 그대로 두시겠어요?

10. User: No, that's okay. Thank you.
    - 평가: 완벽

### 피드백 예시

better:

- 학습자: I want pasta, not this.
- 더 좋은 표현: I ordered pasta, not this dish.
- 설명: 의미는 통하지만 더 공손하고 자연스럽게 말할 수 있어요.

correction:

- 학습자: This is not my order food.
- 교정 문장: This isn't what I ordered.
- 설명: “제가 주문한 것”은 what I ordered로 말하는 것이 자연스러워요.

## 6. 시나리오 4: 카페에서 원하는 음료 주문하기

### 기본 정보

- 제목: 카페에서 원하는 음료 주문하기
- 상황 설명: 카페에서 원하는 음료, 사이즈, 옵션을 말한다.
- 나의 역할: 손님
- AI 역할: 바리스타
- 권장 레벨: 입문~초급

### 오늘의 미션

1. 원하는 음료를 주문하기
2. 사이즈나 옵션을 말하기

### 오늘의 표현

1. I'd like ...
   - 의미: ... 주세요 / ... 원해요
   - 미션 연결: 미션 1
   - 예문: I'd like an iced latte.

2. Can I get ...?
   - 의미: ... 받을 수 있을까요?
   - 미션 연결: 미션 1
   - 예문: Can I get an iced latte?

3. Make it ...
   - 의미: ...로 해 주세요
   - 미션 연결: 미션 2
   - 예문: Make it medium, please.

### 오늘의 단어

1. iced: 차가운
2. latte: 라테
3. medium: 중간 사이즈
4. less sugar: 덜 달게
5. to go: 포장

### 5~10턴 대화

1. AI: Hi. What can I get for you?
   - 번역: 안녕하세요. 무엇을 드릴까요?

2. User: I'd like an iced latte.
   - 평가: 완벽
   - 미션: 1번 달성

3. AI: Sure. What size would you like?
   - 번역: 네. 어떤 사이즈로 드릴까요?

4. User: Medium, please.
   - 평가: 완벽
   - 미션: 2번 부분 달성

5. AI: Would you like it sweet?
   - 번역: 달게 해 드릴까요?

6. User: Less sugar, please.
   - 평가: 완벽

7. AI: Got it. Is that for here or to go?
   - 번역: 알겠습니다. 매장에서 드시나요, 포장인가요?

8. User: To go, please.
   - 평가: 완벽

9. AI: Great. Would you like anything else?
   - 번역: 좋아요. 더 필요한 건 있으신가요?

10. User: No, that's all.
    - 평가: 완벽

### 피드백 예시

better:

- 학습자: I want iced latte.
- 더 좋은 표현: I'd like an iced latte.
- 설명: 주문할 때는 I'd like를 쓰면 더 공손하고 자연스러워요.

correction:

- 학습자: Make medium it.
- 교정 문장: Make it medium, please.
- 설명: make it 다음에 원하는 옵션을 말하는 어순이 자연스러워요.

## 7. 시나리오 5: 호텔 체크인 요청하기

### 기본 정보

- 제목: 호텔 체크인 요청하기
- 상황 설명: 호텔 프런트에서 예약자 이름을 말하고 체크인을 요청한다.
- 나의 역할: 투숙객
- AI 역할: 호텔 직원
- 권장 레벨: 초급

### 오늘의 미션

1. 체크인하고 싶다고 말하기
2. 예약자 이름을 말하기

### 오늘의 표현

1. I'd like to check in.
   - 의미: 체크인하고 싶어요
   - 미션 연결: 미션 1
   - 예문: I'd like to check in.

2. I have a reservation under ...
   - 의미: ... 이름으로 예약했어요
   - 미션 연결: 미션 2
   - 예문: I have a reservation under Kim.

3. Could you check my reservation?
   - 의미: 제 예약을 확인해 주실 수 있나요?
   - 미션 연결: 미션 2
   - 예문: Could you check my reservation?

### 오늘의 단어

1. check in: 체크인하다
2. reservation: 예약
3. passport: 여권
4. room: 방
5. key card: 카드키

### 5~10턴 대화

1. AI: Hello. Welcome to our hotel. How can I help you?
   - 번역: 안녕하세요. 저희 호텔에 오신 것을 환영합니다. 어떻게 도와드릴까요?

2. User: I'd like to check in.
   - 평가: 완벽
   - 미션: 1번 달성

3. AI: Of course. What name is the reservation under?
   - 번역: 물론입니다. 어느 이름으로 예약하셨나요?

4. User: I have a reservation under Kim.
   - 평가: 완벽
   - 미션: 2번 달성

5. AI: Thank you. May I see your passport?
   - 번역: 감사합니다. 여권을 보여 주시겠어요?

6. User: Yes, here it is.
   - 평가: 완벽

7. AI: Great. Would you prefer a quiet room?
   - 번역: 좋습니다. 조용한 방을 원하시나요?

8. User: Yes, a quiet room, please.
   - 평가: 완벽

9. AI: Your room is ready. Do you need help with your bags?
   - 번역: 객실이 준비되었습니다. 짐 옮기는 것을 도와드릴까요?

10. User: No, thank you.
    - 평가: 완벽

### 피드백 예시

better:

- 학습자: I want check in.
- 더 좋은 표현: I'd like to check in.
- 설명: 호텔에서는 I'd like to check in이라고 말하면 더 공손해요.

correction:

- 학습자: My reservation is Kim name.
- 교정 문장: I have a reservation under Kim.
- 설명: 예약자 이름은 under를 사용해 말하는 것이 자연스러워요.

## 8. 6~10턴 추가 연습 대화 공통 기준

확장 대화는 미션을 완료한 뒤 추가 연습을 제공한다.

### 식당 확장 질문 예

11. Would you like anything while you wait?
12. Do you want me to check the order again?
13. Would you like the same drink?
14. Is there anything else wrong with the order?
15. Should I bring a new receipt?
16. Would you like to speak with the manager?
17. Is this dish correct now?
18. 좋아요. 이제 마지막으로 하나만 더 확인해 볼게요.
19. Is everything okay now?
20. 오늘은 여기까지 대화해요. 학습 리포트를 확인해 보세요.

### 카페 확장 질문 예

11. Would you like whipped cream?
12. Do you want less ice?
13. Would you like an extra shot?
14. Do you need a straw?
15. Would you like to pay by card?
16. Should I add your name to the cup?
17. Is this order correct?
18. 좋아요. 이제 마지막으로 하나만 더 확인해 볼게요.
19. Would you like anything for later?
20. 오늘은 여기까지 대화해요. 학습 리포트를 확인해 보세요.

### 호텔 확장 질문 예

11. Would you like breakfast included?
12. Do you need the Wi-Fi password?
13. Would you like a wake-up call?
14. Do you need directions to the elevator?
15. Would you like a late checkout?
16. Is the room number clear?
17. Do you need anything else before you go up?
18. 좋아요. 이제 마지막으로 하나만 더 확인해 볼게요.
19. Is there anything else I can help you with?
20. 오늘은 여기까지 대화해요. 학습 리포트를 확인해 보세요.

## 9. MVP 시나리오 데이터화 우선순위

1. 미용실 시나리오를 완성 데이터로 정리
2. 병원 시나리오를 완성 데이터로 정리
3. 식당 시나리오 추가
4. 카페 시나리오 추가
5. 호텔 시나리오 추가
6. 각 시나리오별 레벨 변형 생성
7. 각 시나리오별 피드백 규칙 확장

## 10. 품질 검수 체크리스트

1. 시나리오별 역할이 명확한가?
2. 미션 2개가 실제 대화에서 수행 가능한가?
3. 오늘의 표현이 미션과 직접 연결되는가?
4. 오늘의 단어가 실제 대화에서 반복되는가?
5. 5턴 안에 미션 완료가 가능한가?
6. AI 질문이 한 턴에 하나만 있는가?
7. 피드백 예시가 better와 correction을 모두 포함하는가?
8. 6~10턴 추가 연습 질문이 자연스러운가?
9. 의료 상황에서 진단/처방이 제외되어 있는가?
10. 초급 학습자가 실제로 말할 수 있는 난이도인가?
