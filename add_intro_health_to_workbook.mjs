import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "outputs/content-guidelines";
const outputPath = `${outputDir}/talkflow_content_guidelines_starter.xlsx`;
const fallbackOutputPath = `${outputDir}/talkflow_content_guidelines_starter_with_health.xlsx`;

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

const introHealthRows = [
  ["HL-ST-001", "건강", "입문", "오늘 컨디션 말하기", "가벼운 대화에서 오늘 몸 상태를 말해요.", "컨디션을 말하는 사람", "안부를 묻는 지인", "오늘 컨디션 말하기 / 쉬고 싶다고 말하기", "I feel~.", "저는 ~하게 느껴요.", "I feel good.", "I feel weak.", "I need rest.", "저는 휴식이 필요해요.", "I need rest.", "I need rest today.", "feel", "느끼다", "I feel better today.", "weak", "힘이 없는", "My body feels weak.", "rest", "휴식", "Rest is good for me.", "better", "더 나은", "I feel better now.", "초안"],
  ["HL-ST-002", "건강", "입문", "퇴근 후 걷기 계획 말하기", "하루가 끝난 뒤 가볍게 걸을 계획을 말해요.", "운동 계획을 말하는 사람", "운동을 권하는 지인", "걷겠다고 말하기 / 언제 걸을지 말하기", "I walk~.", "저는 ~ 걸어요.", "I walk after work.", "I walk in the evening.", "I exercise~.", "저는 ~ 운동해요.", "I exercise at home.", "I exercise on weekends.", "walk", "걷다", "I walk in the park.", "exercise", "운동하다", "I exercise every day.", "evening", "저녁", "I walk in the evening.", "weekend", "주말", "I rest on weekends.", "초안"],
  ["HL-ST-003", "건강", "입문", "잠을 더 잘 자고 싶다고 말하기", "요즘 수면 습관과 오늘의 목표를 말해요.", "수면 습관을 말하는 사람", "건강 습관을 묻는 지인", "피곤하다고 말하기 / 일찍 자고 싶다고 말하기", "I feel tired.", "저는 피곤해요.", "I feel tired.", "I feel tired today.", "I want to sleep~.", "저는 ~ 자고 싶어요.", "I want to sleep early.", "I want to sleep well.", "sleep", "자다", "I sleep at night.", "early", "일찍", "I get up early.", "late", "늦게", "I sleep late.", "night", "밤", "The night is quiet.", "초안"],
  ["HL-ST-004", "건강", "입문", "가벼운 식사 고르기", "부담 없는 식사를 고르고 이유를 말해요.", "메뉴를 고르는 사람", "함께 식사하는 지인", "가벼운 음식을 원한다고 말하기 / 먹고 싶은 음식 말하기", "I want something~.", "저는 ~한 것을 원해요.", "I want something light.", "I want something healthy.", "I eat~.", "저는 ~을/를 먹어요.", "I eat vegetables.", "I eat fruit.", "light", "가벼운", "This meal is light.", "healthy", "건강한", "This food is healthy.", "vegetable", "채소", "I eat vegetables.", "fruit", "과일", "Fruit is good for me.", "초안"],
  ["HL-ST-005", "건강", "입문", "스트레스를 줄이고 싶다고 말하기", "요즘 마음 상태와 쉬는 방법을 말해요.", "스트레스를 말하는 사람", "걱정해 주는 지인", "스트레스가 있다고 말하기 / 쉬는 방법 말하기", "I feel stressed.", "저는 스트레스를 받아요.", "I feel stressed.", "I feel stressed today.", "I take a break.", "저는 잠깐 쉬어요.", "I take a break.", "I take a short break.", "stressed", "스트레스받은", "I feel stressed at work.", "break", "휴식, 쉬는 시간", "I need a break.", "mind", "마음", "My mind is tired.", "quiet", "조용한", "I like quiet time.", "초안"],
  ["HL-ST-006", "건강", "입문", "눈 건강을 위해 쉬기", "화면을 오래 본 뒤 눈 상태를 말해요.", "눈이 피곤한 사람", "걱정해 주는 지인", "눈 상태 말하기 / 화면을 쉬겠다고 말하기", "My eyes feel~.", "제 눈이 ~하게 느껴져요.", "My eyes feel tired.", "My eyes feel dry.", "I take a break from~.", "저는 ~에서 잠깐 쉬어요.", "I take a break from screens.", "I take a break from work.", "eye", "눈", "My eyes feel tired.", "dry", "건조한", "My eyes are dry.", "screen", "화면", "The screen is bright.", "bright", "밝은", "The room is bright.", "초안"],
];

const reviewRows = [
  ["소재 범위", "아픈 상황에만 치우치지 않고 컨디션, 운동, 수면, 식생활, 정신 건강, 눈 건강을 포함합니다.", "성인 입문 학습자가 실제로 말할 법한 생활 건강 주제로 구성합니다."],
  ["3번 수정 기준", "음료 습관은 최대 10턴까지 이어가기에는 지협적이므로 수면 습관으로 교체했습니다.", "수면은 tired, early, late, night 등 쉬운 단어로 5~10턴 확장이 가능합니다."],
  ["미션 기준", "대화 시작과 끝맺음은 AI 역할이므로 학습자 미션에는 상태 말하기, 목표 말하기, 습관 말하기를 둡니다.", "감사 인사나 마무리 인사는 미션으로 넣지 않습니다."],
  ["질문 흐름", "입문에서는 yes/no 질문보다 정보 유도 질문을 우선합니다.", "What time do you sleep? / What do you eat? / How do your eyes feel?"],
  ["중복 점검", "약국·병원·서비스센터와 겹치는 표현은 피하고 건강 루틴 중심으로 구성합니다.", "medicine, appointment, My ~ hurts 중심 표현은 제외했습니다."],
];

const input = await FileBlob.load(outputPath);
const wb = await SpreadsheetFile.importXlsx(input);

addSheet(wb, "건강 검수", "입문 > 건강 검수 기준", ["항목", "기준", "메모"], reviewRows, [24, 92, 92]);
const healthSheet = addSheet(wb, "입문-건강 원고", "입문 > 건강 6개 원고 초안", manuscriptHeaders, introHealthRows, [14, 12, 12, 34, 42, 24, 26, 42, 28, 24, 32, 32, 28, 28, 32, 32, 18, 18, 34, 18, 18, 34, 18, 18, 34, 18, 18, 34, 14]);

for (const range of ["I3:I200", "M3:M200", "Q3:Q200", "T3:T200", "W3:W200", "Z3:Z200"]) {
  healthSheet.getRange(range).format = {
    fill: colors.white,
    font: { bold: true, color: colors.dark, name: "Malgun Gothic", size: 10 },
    verticalAlignment: "top",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.line },
  };
}

await fs.mkdir(outputDir, { recursive: true });

const preview = await wb.render({ sheetName: "입문-건강 원고", autoCrop: "all", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/입문-건강 원고.png`, new Uint8Array(await preview.arrayBuffer()));

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  maxChars: 2000,
});
console.log(errors.ndjson);

const overview = await wb.inspect({ kind: "sheet", include: "id,name", maxChars: 7000 });
console.log(overview.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(wb);
try {
  await xlsx.save(outputPath);
  console.log(outputPath);
} catch (error) {
  if (error?.code !== "EBUSY") throw error;
  await xlsx.save(fallbackOutputPath);
  console.log(fallbackOutputPath);
}
