import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "outputs/content-guidelines";
const outputPath = `${outputDir}/talkflow_content_guidelines_starter.xlsx`;

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

function addSheet(wb, name, title, headers, rows, widths) {
  const sheet = wb.worksheets.add(name);
  sheet.showGridLines = false;
  const colCount = headers.length;
  sheet.getRangeByIndexes(0, 0, 1, colCount).merge();
  sheet.getRangeByIndexes(0, 0, 1, colCount).values = [[title]];
  sheet.getRange(`A1:${colLetter(colCount)}1`).format = {
    fill: colors.title,
    font: { bold: true, color: colors.dark, size: 15, name: "Malgun Gothic" },
    horizontalAlignment: "left",
    verticalAlignment: "center",
  };
  sheet.getRangeByIndexes(1, 0, 1, colCount).values = [headers];
  sheet.getRange(`A2:${colLetter(colCount)}2`).format = {
    fill: colors.header,
    font: { bold: true, color: colors.dark, name: "Malgun Gothic" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.line },
  };
  sheet.getRangeByIndexes(2, 0, rows.length, colCount).values = rows;
  sheet.getRange(`A3:${colLetter(colCount)}${rows.length + 2}`).format = {
    fill: colors.white,
    font: { color: colors.dark, name: "Malgun Gothic", size: 10 },
    verticalAlignment: "top",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.line },
  };
  setWidths(sheet, widths);
  sheet.freezePanes.freezeRows(2);
  return sheet;
}

const manuscriptHeaders = ["ID", "카테고리", "레벨", "제목", "상황 설명", "나의 역할", "AI 역할", "미션", "표현1", "표현1 뜻", "표현1 예문1", "표현1 예문2", "표현2", "표현2 뜻", "표현2 예문1", "표현2 예문2", "단어1", "단어1 뜻", "단어1 예문", "단어2", "단어2 뜻", "단어2 예문", "단어3", "단어3 뜻", "단어3 예문", "단어4", "단어4 뜻", "단어4 예문", "검토 상태"];

const introServiceRows = [
  ["SV-ST-001", "생활 서비스", "입문", "매장에서 영수증 요청하기", "결제 후 직원에게 영수증을 부탁해요.", "결제한 손님", "매장 직원", "영수증 요청하기 / 결제했다고 말하기", "Could I get~?", "~을/를 받을 수 있을까요?", "Could I get a receipt?", "Could I get a copy?", "I paid by~.", "~로 결제했어요.", "I paid by card.", "I paid by cash.", "receipt", "영수증", "I need a receipt.", "pay", "결제하다, 내다", "I pay here.", "total", "총액", "The total is ten dollars.", "copy", "사본", "I need a copy.", "초안"],
  ["SV-ST-002", "생활 서비스", "입문", "약국에서 약 요청하기", "약국에서 간단한 증상을 말하고 약을 찾아요.", "약을 사려는 손님", "약사", "아픈 곳 말하기 / 필요한 약 요청하기", "I need medicine for~.", "~에 필요한 약이 필요해요.", "I need medicine for a headache.", "I need medicine for stomach pain.", "My ~ hurts.", "제 ~가 아파요.", "My head hurts.", "My stomach hurts.", "medicine", "약", "I take medicine.", "head", "머리", "My head hurts.", "stomach", "배, 위", "My stomach hurts.", "pain", "통증", "I have stomach pain.", "초안"],
  ["SV-ST-003", "생활 서비스", "입문", "병원 접수에서 예약 말하기", "병원 접수에서 예약과 방문 목적을 말해요.", "진료를 받으러 온 환자", "병원 접수 직원", "예약이 있다고 말하기 / 방문 목적 말하기", "I have an appointment.", "예약이 있어요.", "I have an appointment.", "I have an appointment today.", "I’m here for~.", "~ 때문에 왔어요.", "I’m here for a checkup.", "I’m here for my appointment.", "appointment", "예약", "I have an appointment.", "checkup", "검진", "I need a checkup.", "list", "명단, 목록", "My name is on the list.", "wait", "기다리다", "I can wait here.", "초안"],
  ["SV-ST-004", "생활 서비스", "입문", "은행에서 카드 문제 말하기", "카드가 안 될 때 직원에게 짧게 설명해요.", "카드 문제를 말하는 고객", "은행 직원", "카드가 안 된다고 말하기 / 계좌 확인 요청하기", "My card doesn’t work.", "제 카드가 작동하지 않아요.", "My card doesn’t work.", "This card doesn’t work.", "I want to check~.", "~을/를 확인하고 싶어요.", "I want to check my account.", "I want to check this.", "account", "계좌", "This is my account.", "work", "작동하다", "It doesn’t work.", "check", "확인하다", "I check my account.", "bank", "은행", "The bank is near here.", "초안"],
  ["SV-ST-005", "생활 서비스", "입문", "무인 프린터 사용 도움받기", "무인 프린터 앞에서 사용 방법을 물어봐요.", "문서를 출력하려는 손님", "매장 직원", "출력하고 싶다고 말하기 / 사용 방법 묻기", "I want to print~.", "~을/를 출력하고 싶어요.", "I want to print this.", "I want to print one page.", "How do I use~?", "~을/를 어떻게 사용하나요?", "How do I use this?", "How do I use this machine?", "print", "출력하다", "I print one page.", "page", "페이지", "This page is clear.", "machine", "기계", "This machine is new.", "file", "파일", "This file is ready.", "초안"],
  ["SV-ST-006", "생활 서비스", "입문", "세탁소에 옷 맡기기", "세탁소에서 옷을 맡기고 완료 시간을 물어봐요.", "옷을 맡기는 손님", "세탁소 직원", "세탁할 옷 말하기 / 언제 되는지 묻기", "Can you clean~?", "~을/를 세탁해 주실 수 있나요?", "Can you clean this shirt?", "Can you clean this coat?", "When is it ready?", "언제 준비되나요?", "When is it ready?", "When is my shirt ready?", "shirt", "셔츠", "This shirt is white.", "coat", "코트", "My coat is long.", "clean", "세탁하다, 깨끗한", "Please clean this shirt.", "ready", "준비된", "It is ready now.", "초안"],
  ["SV-ST-007", "생활 서비스", "입문", "배달 음식을 받으며 확인하기", "배달 기사와 주문 정보를 간단히 확인해요.", "배달 음식을 받는 사람", "배달 기사", "내 주문이라고 말하기 / 둘 위치를 말하기", "It’s my order.", "제 주문이에요.", "It’s my order.", "This is my order.", "Please leave it~.", "~에 두고 가 주세요.", "Please leave it at the door.", "Please leave it here.", "order", "주문", "This is my order.", "door", "문", "The order is at the door.", "leave", "두고 가다", "Please leave it here.", "address", "주소", "This is my address.", "초안"],
  ["SV-ST-008", "생활 서비스", "입문", "서비스센터에서 고장 말하기", "휴대폰이 안 될 때 직원에게 상태를 말해요.", "수리를 맡기려는 고객", "서비스센터 직원", "고장 상태 말하기 / 수리 요청하기", "My phone is broken.", "제 휴대폰이 고장 났어요.", "My phone is broken.", "This phone is broken.", "Can you fix~?", "~을/를 고쳐 주실 수 있나요?", "Can you fix my phone?", "Can you fix this?", "broken", "고장 난", "My phone is broken.", "fix", "고치다", "Please fix this.", "screen", "화면", "The screen is black.", "problem", "문제", "This is the problem.", "초안"],
];

const reviewRows = [
  ["생활 서비스 미션", "시작 인사·마무리 인사·감사 인사는 AI가 이끌 수 있으므로 미션에서 제외합니다.", "학습자 미션은 요청하기, 문제 말하기, 필요한 정보 말하기, 선택 말하기 중심입니다."],
  ["표현 선정", "오늘의 표현은 학습자가 실제 미션을 수행할 때 직접 말할 표현만 넣습니다.", "AI가 묻거나 마무리할 표현은 오늘의 표현으로 넣지 않습니다."],
  ["단어 선정", "오늘의 단어는 미션, 역할, 시나리오를 고려하여 학습자가 직접 사용할 단어를 고릅니다.", "단어가 조금 어렵더라도 성인 생활 서비스에서 필수이면 제한적으로 허용합니다."],
  ["중복 점검", "일상·여행에서 이미 쓴 표현과 단어는 되도록 피합니다.", "피할 수 없는 필수어는 예문과 역할을 달리해 사용합니다."],
  ["입문 레벨링", "쉽지만 유치하지 않게, 성인 학습자가 실제 상황에서 말할 만한 표현을 우선합니다.", "appointment, account, problem처럼 필수 생활 단어는 쉬운 예문으로 보완합니다."],
];

const input = await FileBlob.load(outputPath);
const wb = await SpreadsheetFile.importXlsx(input);

addSheet(wb, "생활서비스 검수", "입문 > 생활 서비스 검수 기준", ["항목", "기준", "메모"], reviewRows, [24, 90, 90]);
const serviceSheet = addSheet(wb, "입문-생활서비스 원고", "입문 > 생활 서비스 8개 원고 초안", manuscriptHeaders, introServiceRows, [14, 16, 12, 34, 42, 24, 26, 42, 28, 24, 32, 32, 28, 28, 32, 32, 18, 18, 34, 18, 18, 34, 18, 18, 34, 18, 18, 34, 14]);

for (const range of ["I3:I200", "M3:M200", "Q3:Q200", "T3:T200", "W3:W200", "Z3:Z200"]) {
  serviceSheet.getRange(range).format = {
    fill: colors.white,
    font: { bold: true, color: colors.dark, name: "Malgun Gothic", size: 10 },
    verticalAlignment: "top",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.line },
  };
}

await fs.mkdir(outputDir, { recursive: true });

const preview = await wb.render({ sheetName: "입문-생활서비스 원고", autoCrop: "all", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/입문-생활서비스 원고.png`, new Uint8Array(await preview.arrayBuffer()));

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  maxChars: 2000,
});
console.log(errors.ndjson);

const overview = await wb.inspect({ kind: "sheet", include: "id,name", maxChars: 6000 });
console.log(overview.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(outputPath);
console.log(outputPath);
