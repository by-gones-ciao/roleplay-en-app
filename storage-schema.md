# TalkFlow 저장 구조 설계서

이 문서는 TalkFlow MVP에서 사용자 설정, 시나리오, 대화 세션, 학습자 발화 평가, 리포트를 저장하기 위한 데이터 구조를 정의합니다.

## 1. 저장 범위

### MVP에서 저장

- 사용자 설정
- 기본/사용자 생성 시나리오
- 대화 세션
- 학습자 발화 텍스트
- 평가 결과
- 미션 완료 상태
- 학습 리포트

### MVP에서 기본적으로 저장하지 않음

- 원본 음성 파일
- 민감한 의료 세부 정보
- 결제 정보
- 장기 학습 통계

## 2. users

사용자 계정 또는 익명 사용자를 저장합니다.

```sql
users (
  id uuid primary key,
  display_name text,
  created_at timestamptz,
  updated_at timestamptz
)
```

MVP에서 로그인 없이 시작한다면 익명 ID를 브라우저 로컬 저장소에 보관할 수 있습니다.

## 3. user_settings

```sql
user_settings (
  user_id uuid primary key references users(id),
  level text not null default 'beginner',
  speed text not null default 'Normal (x1.0)',
  notification_time text default '오전 9:00',
  created_at timestamptz,
  updated_at timestamptz
)
```

### level 값

- starter
- beginner
- pre_intermediate
- intermediate
- advanced

## 4. scenarios

기본 제공 시나리오와 사용자 생성 시나리오를 저장합니다.

```sql
scenarios (
  id text primary key,
  type text not null,
  category text not null,
  level text not null,
  title text not null,
  summary text not null,
  emoji text,
  user_role text not null,
  ai_role text not null,
  data jsonb not null,
  created_by uuid references users(id),
  created_at timestamptz,
  updated_at timestamptz
)
```

### data

`scenarios.json`의 시나리오 객체 전체를 저장할 수 있습니다.

## 5. conversation_sessions

대화 한 번의 전체 세션입니다.

```sql
conversation_sessions (
  id uuid primary key,
  user_id uuid references users(id),
  scenario_id text references scenarios(id),
  entry text,
  level text not null,
  speed text not null,
  status text not null,
  turn_count integer default 0,
  completed_mission_ids jsonb default '[]',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
```

### status 값

- active
- exited_without_report
- report_ready
- completed
- failed

## 6. conversation_turns

AI 발화와 학습자 발화를 순서대로 저장합니다.

```sql
conversation_turns (
  id uuid primary key,
  session_id uuid references conversation_sessions(id),
  turn_index integer not null,
  speaker text not null,
  text text not null,
  ko text,
  intent text,
  input_mode text,
  created_at timestamptz
)
```

### speaker 값

- ai
- user

### input_mode 값

- voice
- keyboard
- system

## 7. user_turn_results

학습자 발화 평가 결과입니다.

```sql
user_turn_results (
  id uuid primary key,
  session_id uuid references conversation_sessions(id),
  turn_index integer not null,
  ai_text text,
  user_text text not null,
  status text not null,
  feedback jsonb,
  completed_mission_ids jsonb default '[]',
  created_at timestamptz
)
```

### status 값

- perfect
- better
- correction

### feedback 예

```json
{
  "koNote": "비교 기준을 말할 때는 as를 넣는 것이 자연스러워요.",
  "suggestedText": "At the same level as my eyebrows."
}
```

## 8. reports

학습 리포트 저장 테이블입니다.

```sql
reports (
  id uuid primary key,
  session_id uuid references conversation_sessions(id),
  user_id uuid references users(id),
  scenario_id text references scenarios(id),
  report_type text not null,
  summary text not null,
  metrics jsonb not null,
  corrections jsonb default '[]',
  better_expressions jsonb default '[]',
  conversation jsonb default '[]',
  ai_feedback text,
  created_at timestamptz
)
```

### report_type 값

- short
- partial
- complete

0턴 종료는 리포트를 만들지 않으므로 `none`은 저장하지 않아도 됩니다.

## 9. 로컬 저장소

로그인 전 또는 MVP 초기에는 아래 값만 로컬에 저장할 수 있습니다.

```json
{
  "anonymousUserId": "uuid",
  "onboardingCompleted": true,
  "level": "beginner",
  "speed": "Normal (x1.0)",
  "notificationTime": "오전 9:00"
}
```

주의:

- 리포트와 대화 기록을 로컬에만 저장하면 다른 기기에서 이어서 볼 수 없습니다.
- 다른 PC에서도 이어가려면 서버 DB 저장이 필요합니다.

## 10. 다시 녹음 시 저장 처리

다시 녹음이 발생하면 선택한 턴 이후의 데이터를 삭제하거나 무효화합니다.

권장 방식:

1. 선택한 `turn_index` 이후의 `conversation_turns` 삭제
2. 선택한 `turn_index` 이후의 `user_turn_results` 삭제
3. `conversation_sessions.turn_count` 재계산
4. `completed_mission_ids` 재계산
5. 기존 report가 있으면 폐기하거나 재생성

## 11. 개인정보 기준

- 원본 음성 파일은 기본 저장하지 않는다.
- 학습자 발화 텍스트는 학습 리포트 제공을 위해 저장할 수 있다.
- 의료 시나리오에서는 실제 개인정보 입력을 유도하지 않는다.
- 사용자가 원하면 대화 기록 삭제가 가능해야 한다.

## 12. 인덱스 추천

```sql
create index idx_sessions_user_created on conversation_sessions(user_id, created_at desc);
create index idx_turns_session_index on conversation_turns(session_id, turn_index);
create index idx_results_session_index on user_turn_results(session_id, turn_index);
create index idx_reports_user_created on reports(user_id, created_at desc);
```

## 13. 개발 우선순위

1. 로컬 상태로 전체 플로우 구현
2. scenarios.json 정적 로드
3. conversation_sessions 저장
4. conversation_turns 저장
5. user_turn_results 저장
6. reports 저장
7. user_settings 저장
8. 로그인 후 사용자별 동기화

