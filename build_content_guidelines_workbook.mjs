import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/content-guidelines";
const outputPath = `${outputDir}/talkflow_content_guidelines_starter.xlsx`;

const wb = Workbook.create();

const colors = {
  dark: "#111111",
  header: "#D9D9D9",
  title: "#BFBFBF",
  white: "#FFFFFF",
  line: "#D9E5DF",
};

function colLetter(n) {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - m) / 26);
  }
  return s;
}

function setWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidth = width;
  });
}

function styleTitle(sheet, colCount) {
  const range = sheet.getRange(`A1:${colLetter(colCount)}1`);
  range.format = {
    fill: colors.title,
    font: { bold: true, color: colors.dark, size: 15, name: "Malgun Gothic" },
    horizontalAlignment: "left",
    verticalAlignment: "center",
  };
  range.format.rowHeight = 30;
}

function styleHeader(sheet, row, colCount) {
  const range = sheet.getRange(`A${row}:${colLetter(colCount)}${row}`);
  range.format = {
    fill: colors.header,
    font: { bold: true, color: colors.dark, name: "Malgun Gothic" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.line },
  };
  range.format.rowHeight = 30;
}

function styleBody(sheet, startRow, rowCount, colCount) {
  if (!rowCount) return;
  const range = sheet.getRange(`A${startRow}:${colLetter(colCount)}${startRow + rowCount - 1}`);
  range.format = {
    fill: colors.white,
    font: { color: colors.dark, name: "Malgun Gothic", size: 10 },
    verticalAlignment: "top",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.line },
  };
}

function addSheet(name, title, headers, rows, widths) {
  const sheet = wb.worksheets.add(name);
  sheet.showGridLines = false;
  const colCount = headers.length;
  sheet.getRangeByIndexes(0, 0, 1, colCount).merge();
  sheet.getRangeByIndexes(0, 0, 1, colCount).values = [[title]];
  styleTitle(sheet, colCount);
  sheet.getRangeByIndexes(1, 0, 1, colCount).values = [headers];
  styleHeader(sheet, 2, colCount);
  if (rows.length) {
    sheet.getRangeByIndexes(2, 0, rows.length, colCount).values = rows;
    styleBody(sheet, 3, rows.length, colCount);
  }
  setWidths(sheet, widths);
  sheet.freezePanes.freezeRows(2);
  return sheet;
}

const introDailyRows = [
  ["DA-ST-001", "일상", "입문", "처음 만난 사람에게 인사하기", "처음 만난 자리에서 이름을 말하고 인사해요.", "먼저 인사하는 사람", "처음 만난 상대", "이름 말하기 / 반갑다고 말하기", "I’m __.", "저는 __예요.", "I’m Jisoo.", "I’m happy.", "Nice to meet you.", "만나서 반가워요.", "Nice to meet you.", "It’s nice to meet you.", "name", "이름", "What is your name?", "from", "~에서 온", "This tea is from China.", "nice", "좋은, 친절한", "Have a nice day!", "first", "처음, 먼저", "I go first.", "초안"],
  ["DA-ST-002", "일상", "입문", "친구와 오늘 날씨 이야기하기", "밖에 나가기 전 날씨와 느낌을 말해요.", "날씨를 말하는 친구", "날씨를 묻는 친구", "날씨 말하기 / 느낌 말하기", "It’s sunny.", "날씨가 맑아요.", "It’s sunny here.", "The day is sunny.", "It’s cold.", "날씨가 추워요.", "It’s cold outside.", "The room is cold.", "sunny", "맑은", "I like sunny days.", "rainy", "비 오는", "Do you like rainy days?", "hot", "뜨거운, 더운", "I take a hot bath.", "cold", "차가운, 추운", "The water is cold.", "초안"],
  ["DA-ST-003", "일상", "입문", "바쁜 친구에게 안부 묻기", "지쳐 보이는 친구에게 괜찮은지 물어봐요.", "안부를 묻는 친구", "바빠 보이는 친구", "친구 상태 묻기 / 내 상태 말하기", "Are you okay?", "괜찮아요?", "Are you okay?", "Are you okay today?", "I’m tired.", "저는 피곤해요.", "I’m tired.", "I feel tired.", "okay", "괜찮은", "That’s okay.", "tired", "피곤한", "My eyes are tired.", "busy", "바쁜", "Mom has a busy day.", "feel", "느끼다", "I feel good.", "초안"],
  ["DA-ST-004", "일상", "입문", "카페에서 친구 취향 물어보기", "마실 것을 고르며 좋아하는 것을 물어봐요.", "친구 취향을 묻는 사람", "음료를 고르는 친구", "친구 취향 묻기 / 내 취향 말하기", "Do you like~?", "~을/를 좋아해요?", "Do you like coffee?", "Do you like hot drinks?", "I like~.", "저는 ~을/를 좋아해요.", "I like tea.", "Tea is good for me.", "tea", "차", "This tea is warm.", "like", "좋아하다", "Do you like this place?", "drink", "음료, 마시다", "This drink is cold.", "warm", "따뜻한", "Warm tea is good.", "초안"],
  ["DA-ST-005", "일상", "입문", "친구와 좋아하는 간식 말하기", "좋아하는 간식과 싫은 맛을 말해요.", "취향을 말하는 친구", "간식을 고르는 친구", "좋아하는 간식 말하기 / 싫어하는 맛 말하기", "I like~.", "저는 ~을/를 좋아해요.", "I like chips.", "I like this snack.", "I don’t like~.", "저는 ~을/를 좋아하지 않아요.", "I don’t like candy.", "I don’t like spicy food.", "snack", "간식", "Popcorn is my favorite snack.", "chips", "감자칩, 과자", "They eat potato chips.", "sweet", "단", "This candy is sweet.", "spicy", "매운", "This ramen is spicy.", "초안"],
  ["DA-ST-006", "일상", "입문", "공원에서 반려동물 소개하기", "산책 중 반려동물을 짧게 소개해요.", "반려동물을 소개하는 사람", "반려동물에 관심 있는 사람", "반려동물 소개하기 / 귀여운 점 말하기", "This is my~.", "이것은 제 ~예요.", "This is my dog.", "This is my cat.", "He’s cute.", "그는 귀여워요.", "He’s cute.", "She’s cute.", "dog", "개, 강아지", "The dog runs fast.", "cat", "고양이", "The cat sleeps here.", "cute", "귀여운", "This baby is cute.", "walk", "걷다, 산책하다", "We walk in the park.", "초안"],
  ["DA-ST-007", "일상", "입문", "카페에서 차가운 커피 주문하기", "원하는 음료와 차가운 옵션을 말해요.", "음료를 주문하는 손님", "카페 직원", "원하는 음료 말하기 / 차가운 음료 선택하기", "One coffee, please.", "커피 한 잔 주세요.", "One coffee, please.", "One latte, please.", "Iced coffee, please.", "아이스커피 주세요.", "Iced coffee, please.", "Iced tea, please.", "iced", "얼음이 든, 차가운", "Iced tea is cold.", "hot", "뜨거운", "Hot soup is good.", "small", "작은", "This cup is small.", "cup", "컵, 잔", "This cup is for tea.", "초안"],
  ["DA-ST-008", "일상", "입문", "편의점에서 간식 고르기", "사고 싶은 물건과 개수를 말해요.", "물건을 고르는 손님", "편의점 직원", "원하는 물건 말하기 / 수량 말하기", "This one, please.", "이걸로 주세요.", "This one, please.", "That one, please.", "Two, please.", "두 개 주세요.", "Two, please.", "One, please.", "water", "물", "Water is in the bottle.", "bottle", "병", "This bottle is small.", "bag", "가방, 봉투", "The snack is in the bag.", "cash", "현금", "I have cash.", "초안"],
  ["DA-ST-009", "일상", "입문", "친구에게 사진 부탁하기", "사진을 부탁하고 한 번 더 요청해요.", "사진을 부탁하는 사람", "사진을 찍어 주는 친구", "사진 부탁하기 / 한 번 더 요청하기", "Can you take a picture?", "사진 찍어 줄 수 있어요?", "Can you take a picture?", "Can you take one picture?", "One more, please.", "한 번 더 부탁해요.", "One more, please.", "One more photo, please.", "picture", "사진", "This picture is nice.", "here", "여기", "Please stand here.", "again", "다시", "Please say it again.", "photo", "사진", "This photo is for me.", "초안"],
  ["DA-ST-010", "일상", "입문", "동네에서 가까운 장소 물어보기", "찾는 곳이 근처인지 짧게 확인해요.", "길을 묻는 사람", "동네를 아는 사람", "찾는 장소 말하기 / 가까운지 묻기", "Where is~?", "~은/는 어디에 있나요?", "Where is the cafe?", "Where is the station?", "Is it near here?", "여기서 가까워요?", "Is it near here?", "Is the cafe near here?", "place", "장소", "This place is quiet.", "near", "가까운", "The store is near my home.", "left", "왼쪽", "The bank is on your left.", "right", "오른쪽", "I use my right hand.", "초안"],
];

const introTravelRows = [
  ["TR-ST-001", "여행", "입문", "공항에서 탑승구 확인하기", "비행 전 직원에게 탑승구를 확인해요.", "탑승구를 찾는 여행자", "공항 직원", "탑승구를 묻기 / 비행편을 보여주기", "Can you help me?", "도와주실 수 있나요?", "Can you help me?", "Can you help me here?", "What is my gate?", "제 탑승구가 어디인가요?", "What is my gate?", "What is the gate number?", "gate", "탑승구", "My gate is over there.", "flight", "비행편", "This is my flight.", "number", "번호", "The number is five.", "show", "보여주다", "I can show my phone.", "초안"],
  ["TR-ST-002", "여행", "입문", "기내에서 필요한 물건 요청하기", "비행기 안에서 필요한 것을 정중히 요청해요.", "승객", "승무원", "필요한 물건 요청하기 / 감사 인사하기", "Can I have~?", "~을/를 받을 수 있을까요?", "Can I have water?", "Can I have a blanket?", "~, please.", "~ 주세요.", "Water, please.", "A blanket, please.", "blanket", "담요", "This blanket is warm.", "seat", "좌석", "This is my seat.", "cold", "추운, 차가운", "The room is cold.", "water", "물", "I drink water.", "초안"],
  ["TR-ST-003", "여행", "입문", "호텔에서 와이파이 물어보기", "체크인 후 와이파이 정보를 물어봐요.", "투숙객", "호텔 직원", "와이파이 여부 묻기 / 비밀번호 묻기", "Is there~?", "~이 있나요?", "Is there Wi-Fi?", "Is there a password?", "What is~?", "~이 무엇인가요?", "What is the password?", "What is my room number?", "password", "비밀번호", "This password is long.", "room", "방", "My room is clean.", "key", "열쇠, 키", "I have my key.", "floor", "층", "My room is on this floor.", "초안"],
  ["TR-ST-004", "여행", "입문", "택시에서 목적지 말하기", "택시 기사에게 목적지와 정차 위치를 말해요.", "택시 승객", "택시 기사", "목적지 말하기 / 여기서 세워 달라고 말하기", "Please go to~.", "~로 가 주세요.", "Please go to the station.", "Please go to this address.", "Please stop~.", "~에 세워 주세요.", "Please stop here.", "Please stop near the station.", "station", "역", "The station is near here.", "address", "주소", "This is the address.", "stop", "멈추다, 세우다", "Please stop here.", "near", "가까운", "The shop is near here.", "초안"],
  ["TR-ST-005", "여행", "입문", "관광지에서 입장권 사기", "관광지 입구에서 표를 사고 들어가요.", "관광객", "매표 직원", "표를 살 수 있는지 묻기 / 입구를 확인하기", "Can I buy~?", "~을/를 살 수 있을까요?", "Can I buy a ticket?", "Can I buy a ticket here?", "Is this~?", "이것이 ~인가요?", "Is this the entrance?", "Is this the line?", "buy", "사다", "I buy food here.", "entrance", "입구", "This is the entrance.", "line", "줄", "The line is long.", "open", "열려 있는", "The door is open.", "초안"],
  ["TR-ST-006", "여행", "입문", "기념품 가게에서 선물 고르기", "작은 선물을 고르고 직원에게 말해요.", "선물을 고르는 여행자", "가게 직원", "선물용이라고 말하기 / 이것으로 사겠다고 말하기", "I’m looking for~.", "~을/를 찾고 있어요.", "I’m looking for a gift.", "I’m looking for something local.", "I’ll take~.", "~로 할게요.", "I’ll take this one.", "I’ll take this gift.", "gift", "선물", "This gift is for my friend.", "local", "현지의", "This is a local gift.", "friend", "친구", "My friend likes tea.", "take", "고르다, 사다", "I’ll take this one.", "초안"],
  ["TR-ST-007", "여행", "입문", "여행 중 물건 분실 말하기", "잃어버린 물건을 직원에게 설명해요.", "물건을 잃어버린 여행자", "안내 직원", "무엇을 잃어버렸는지 말하기 / 물건의 특징 말하기", "I lost~.", "~을/를 잃어버렸어요.", "I lost my bag.", "I lost my phone.", "It is~.", "그것은 ~예요.", "It is black.", "It is small.", "bag", "가방", "My bag is black.", "color", "색깔", "What color is it?", "black", "검은색의", "This phone is black.", "phone", "휴대폰", "My phone is in my bag.", "초안"],
];

const manuscriptHeaders = ["ID", "카테고리", "레벨", "제목", "상황 설명", "나의 역할", "AI 역할", "미션", "표현1", "표현1 뜻", "표현1 예문1", "표현1 예문2", "표현2", "표현2 뜻", "표현2 예문1", "표현2 예문2", "단어1", "단어1 뜻", "단어1 예문", "단어2", "단어2 뜻", "단어2 예문", "단어3", "단어3 뜻", "단어3 예문", "단어4", "단어4 뜻", "단어4 예문", "검토 상태"];

addSheet("README", "TalkFlow 콘텐츠 제작 기준 통합 문서", ["구분", "내용"], [
  ["목적", "성인 영어 스피킹 앱 TalkFlow의 롤플레잉 콘텐츠를 같은 기준으로 설계하고 검수하기 위한 문서입니다."],
  ["현재 범위", "확정된 운영 원칙, 레벨/카테고리 구조, 입문 > 일상 10개 초안, 입문 > 여행 7개 초안을 포함합니다."],
  ["작성 방식", "채팅에서 먼저 제시하고 사용자가 검토·승인한 뒤 문서화합니다. 이 파일의 원고는 검토용 초안입니다."],
  ["표기 스타일", "제목/헤더는 볼드와 회색 음영, 본문은 검정 글씨와 흰 배경으로 구성합니다."],
  ["핵심 철학", "쉽지만 비문이 되지 않게, 성인 학습자가 실제로 말하고 싶은 상황을 설계합니다."],
], [24, 130]);

addSheet("전체 원칙", "콘텐츠 설계 전체 원칙", ["항목", "기준", "메모"], [
  ["시나리오 기준", "장소보다 대화 목적을 기준으로 구분합니다.", "같은 장소라도 목적이 다르면 다른 시나리오가 될 수 있습니다."],
  ["제목", "홈 카드에서 바로 이해되는 25자 미만의 명사형 제목을 씁니다.", "딱딱한 운영명보다 구체적이고 고르고 싶은 제목을 우선합니다."],
  ["상황 설명", "35자 내외의 친근한 문장으로 제목을 보완합니다.", "제목과 같은 말을 반복하지 않습니다."],
  ["미션", "학습자가 직접 말해서 완료할 수 있는 목표만 넣습니다.", "AI가 말할 내용이나 배경 정보는 미션이 아닙니다."],
  ["오늘의 표현", "제시된 미션을 수행할 수 있어야 합니다.", "통째 표현이 아닌 경우 되도록 패턴으로 제시합니다."],
  ["오늘의 단어", "미션, 역할, 시나리오를 고려하여 학습자가 직접 사용할 단어를 선정합니다.", "AI가 주로 말할 단어는 우선순위가 낮습니다."],
  ["중복 방지", "같은 레벨 안에서는 오늘의 표현 패턴 중복을 피합니다.", "예: One coffee, please.와 One sandwich, please.는 같은 패턴으로 봅니다."],
  ["현대성", "키오스크, 앱, 무인 서비스 등 현대적 상황을 적절히 반영합니다.", "대면 상황은 유지하되 지나치게 오래된 상황은 피합니다."],
  ["입문 문장", "완전한 문장을 기본으로 하되 자연스러운 짧은 고정 표현은 허용합니다.", "One coffee, please.는 가능하지만 Bus to __? 같은 어색한 생략은 제외합니다."],
], [24, 82, 82]);

addSheet("AI 질문 원칙", "롤플레잉 AI 질문 설계 원칙", ["항목", "기준", "예시"], [
  ["한 턴 기준", "1턴은 AI 질문 1회와 학습자 답변 1회를 말합니다.", "AI: What color is it? / 학습자: It is black."],
  ["입문 대화 길이", "입문은 학습자가 최소 5번, 최대 10번 답변하도록 설계합니다.", "미션 완료 후에도 색깔, 크기, 위치, 선택 등으로 자연스럽게 확장합니다."],
  ["Yes/No 질문 회피", "입문에서는 yes/no 질문을 웬만하면 피합니다.", "Do you have your phone?보다 What is in your bag?이 낫습니다."],
  ["정보 유도 질문", "학습자가 단어·구·짧은 문장으로 정보를 말해야 하는 질문을 우선합니다.", "What color is it? / Where do you want to go? / What do you need?"],
  ["선택형 질문", "필요하면 A or B 선택형 질문을 사용합니다.", "Is it big or small? / Water or juice?"],
  ["질문 수", "AI는 한 턴에 반드시 하나의 질문만 합니다.", "두 가지를 한 번에 묻지 않습니다."],
  ["주제 복귀", "학습자가 주제를 벗어나면 부드럽게 원래 상황으로 돌아옵니다.", "That’s interesting. For your flight, what is your gate?"],
], [24, 84, 84]);

addSheet("레벨 기준", "레벨별 롤플레잉 운영 기준", ["레벨", "최소 답변수", "최대 답변수", "학습 목표", "피드백 기준"], [
  ["입문", 5, 10, "단어 조합과 아주 기본 문장으로 오류 없는 의사소통 경험을 쌓습니다.", "짧고 쉬운 오류 교정은 제공하되 자신감을 해치지 않습니다."],
  ["초급", 5, 20, "짧은 문장으로 기본 상황을 자연스럽게 해결합니다.", "문장 구조, 시제, 관사, 수 일치 등을 쉽고 정확하게 알려줍니다."],
  ["초중급", 6, 20, "상황 설명과 선택 이유를 조금 더 구체적으로 말합니다.", "자연스러운 표현과 더 좋은 문장 구조를 제안합니다."],
  ["중급", 7, 20, "일상·업무 상황에서 의견과 이유를 체계적으로 말합니다.", "문법뿐 아니라 논리, 연결, 어휘 선택을 봅니다."],
  ["고급", 8, 20, "구체적인 인사이트와 정확한 표현으로 대화를 확장합니다.", "뉘앙스, 레지스터, 설득력, 표현 정확성까지 다룹니다."],
], [16, 16, 16, 80, 80]);

addSheet("예문 원칙", "오늘의 단어 예문 생성 원칙", ["항목", "기준", "중요도", "메모"], [
  ["학습자 레벨", "Target Word 외 단어도 이해 가능한 수준이어야 합니다.", "★★★★★", "입문은 이미 익숙한 보조 단어를 씁니다."],
  ["새 정보 수", "새 단어·문법·표현은 최소화합니다.", "★★★★★", "예문에서 새로 배울 초점은 Target Word 하나입니다."],
  ["직관성", "예문만 봐도 단어의 의미가 최대한 드러나야 합니다.", "★★★★★", "snack 예문에는 popcorn처럼 직관적인 보조 단어를 쓸 수 있습니다."],
  ["실사용성", "실제 회화에서 사용할 수 있는 문장이어야 합니다.", "★★★★★", "설명용 문장보다 발화 가능한 문장을 우선합니다."],
  ["패턴 중복 방지", "한 롤플레잉 안에서 표현 예문과 단어 예문의 패턴 반복을 피합니다.", "★★★★★", "I’m / It’s / I like만 반복하지 않습니다."],
  ["문장 길이", "입문은 3~6단어, 초급은 5~8단어를 우선합니다.", "★★★★☆", "자연스러운 고정 표현은 예외 가능합니다."],
  ["고유명사 제한", "꼭 필요한 경우를 제외하고 사람 이름 고유명사는 사용하지 않습니다.", "★★★★☆", "이름 말하기 미션에서는 제한적으로 허용합니다."],
  ["자연스러움", "쉽게 만들더라도 비문이나 어색한 표현은 쓰지 않습니다.", "★★★★★", "Bus to __? 같은 표현은 제외합니다."],
], [28, 84, 14, 84]);

addSheet("제외 단어 기준", "입문 오늘의 단어 제외·허용 기준", ["구분", "예시", "처리 기준", "비고"], [
  ["한국어에서 그대로 쓰이는 외래어", "coffee, popcorn, pizza, hotel, taxi", "오늘의 단어에서는 되도록 제외", "예문 보조 단어로는 사용 가능합니다."],
  ["기본 인사·반응", "hello, hi, thank you, bye, yes, no", "오늘의 단어에서는 제외", "확장 표현이면 별도 검토합니다."],
  ["기본 숫자", "one, two, three, four", "오늘의 단어에서는 제외", "표현 패턴 안에서는 사용 가능합니다."],
  ["쉬워도 학습 가치 있는 생활어", "dog, cat, water, friend, name", "포함 가능", "한국어와 형태가 달라 실제 학습 가치가 있습니다."],
  ["상황 수행 핵심어", "receipt, gate, entrance, password", "포함 가능", "조금 낯설어도 미션 수행에 직접 필요하면 포함합니다."],
], [30, 54, 42, 72]);

addSheet("카테고리 구성", "TalkFlow 카테고리와 전체 시나리오 개수", ["카테고리", "전체 개수", "역할", "참고 소재"], [
  ["일상", 50, "가장 기본적인 생활 대화와 자신감 형성", "인사, 날씨, 취향, 간식, 반려동물, 카페, 편의점, 사진 부탁, 길 묻기"],
  ["여행", 45, "여행 중 실제로 마주치는 요청과 확인", "공항, 기내, 호텔, 택시, 관광지, 기념품, 분실 상황"],
  ["생활 서비스", 55, "성인이 자주 이용하는 서비스 상황 해결", "영수증, 은행, 병원 접수, 인쇄, 이동센터, 무인 서비스"],
  ["건강", 35, "몸과 마음, 운동과 식생활을 쉬운 말로 표현", "컨디션, 운동 습관, 식생활, 통증, 스트레스, 눈 건강"],
  ["관계", 40, "친구, 가족, 동료 등 관계 속 말하기", "축하, 약속, 부탁, 응원, 사과, 감사"],
  ["직업", 60, "성인 학습자의 업무·구직·협업 상황", "구직, 인터뷰, 직장 생활, 회의, 고객 관리, 부재중, 협업 요청"],
  ["학업", 30, "대학생·대학원생 이상 성인의 학업 상황", "시간표, 과제, 수업 요청, 스터디, 발표, 교수 상담"],
  ["여가/문화", 30, "성인의 여가와 문화생활 말하기", "독서, 음악, 웹툰, 영화, 공연, 게임, SNS, 외부 활동"],
  ["사회/의견", 20, "가까운 생활 주제에서 짧은 의견 말하기", "소비습관, 기술 사용, 환경 실천, 일과 삶, 문화 차이"],
  ["합계", 365, "1년 운영 가능한 콘텐츠 맵", "개수보다 중복 없는 상황과 목적을 우선합니다."],
], [22, 14, 58, 110]);

addSheet("레벨x카테고리 개수", "레벨별·카테고리별 시나리오 배분", ["카테고리", "입문", "초급", "초중급", "중급", "고급", "합계", "배분 메모"], [
  ["일상", 10, 11, 12, 9, 8, 50, "입문에서 가장 많이 접하는 기본 상황을 충분히 제공합니다."],
  ["여행", 7, 9, 11, 10, 8, 45, "입문은 생존 표현, 상위 레벨은 문제 해결과 상세 요청으로 확장합니다."],
  ["생활 서비스", 8, 10, 13, 13, 11, 55, "현대적 무인/앱 상황과 대면 서비스를 함께 반영합니다."],
  ["건강", 6, 7, 8, 7, 7, 35, "아픈 상황뿐 아니라 운동, 식생활, 정신 건강도 포함합니다."],
  ["관계", 5, 8, 10, 9, 8, 40, "상대가 친구로만 반복되지 않도록 다양화합니다."],
  ["직업", 4, 10, 16, 16, 14, 60, "입문은 쉬운 업무 생존 표현, 중급 이상은 협업·협상·평가로 확장합니다."],
  ["학업", 4, 6, 7, 7, 6, 30, "대학생·대학원생 이상의 실제 학업 상황을 중심으로 합니다."],
  ["여가/문화", 5, 6, 6, 7, 6, 30, "오프라인 활동과 온라인/SNS/게임 문화를 함께 반영합니다."],
  ["사회/의견", 1, 3, 2, 7, 7, 20, "입문은 부담 없는 생활 의견, 중급 이상은 구체적 인사이트 중심입니다."],
  ["합계", 50, 70, 85, 85, 75, 365, "입문은 자신감, 상위 레벨은 세부성과 난이도를 높입니다."],
], [22, 10, 10, 10, 10, 10, 10, 92]);

const introDailySheet = addSheet("입문-일상 원고", "입문 > 일상 10개 원고 초안", manuscriptHeaders, introDailyRows, [14, 12, 12, 34, 42, 24, 26, 42, 26, 24, 30, 30, 28, 28, 30, 30, 16, 18, 32, 16, 18, 32, 16, 18, 32, 16, 18, 32, 14]);
const introTravelSheet = addSheet("입문-여행 원고", "입문 > 여행 7개 원고 초안", manuscriptHeaders, introTravelRows, [14, 12, 12, 34, 42, 24, 26, 42, 26, 24, 30, 30, 28, 28, 30, 30, 16, 18, 32, 16, 18, 32, 16, 18, 32, 16, 18, 32, 14]);

for (const sheet of [introDailySheet, introTravelSheet]) {
  for (const range of ["I3:I200", "M3:M200", "Q3:Q200", "T3:T200", "W3:W200", "Z3:Z200"]) {
    sheet.getRange(range).format = {
      fill: colors.white,
      font: { bold: true, color: colors.dark, name: "Malgun Gothic", size: 10 },
      verticalAlignment: "top",
      wrapText: true,
      borders: { preset: "all", style: "thin", color: colors.line },
    };
  }
}

for (const sheet of wb.worksheets.items) {
  const used = sheet.getUsedRange();
  used.format.font = { name: "Malgun Gothic", size: 10, color: colors.dark };
  used.format.wrapText = true;
  used.format.verticalAlignment = "top";
}

await fs.mkdir(outputDir, { recursive: true });

const overview = await wb.inspect({ kind: "sheet", include: "id,name", maxChars: 4000 });
console.log(overview.ndjson);

for (const sheetName of ["README", "AI 질문 원칙", "입문-일상 원고", "입문-여행 원고"]) {
  const preview = await wb.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${sheetName}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  maxChars: 2000,
});
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(outputPath);
console.log(outputPath);
