import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "outputs/content-guidelines";
const inputPath = `${outputDir}/talkflow_content_guidelines_starter_with_health.xlsx`;
const fallbackPath = `${outputDir}/talkflow_content_guidelines_starter_with_relationship.xlsx`;

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

const introRelationshipRows = [
  ["RL-ST-001", "관계", "입문", "동료에게 점심 약속 제안하기", "점심시간 전에 동료에게 가볍게 제안해요.", "점심을 제안하는 동료", "함께 일하는 동료", "점심을 제안하기 / 가능한 시간 말하기", "Are you free~?", "~에 시간 괜찮아요?", "Are you free at lunch?", "Are you free today?", "Let’s have~.", "~을/를 같이 해요.", "Let’s have lunch.", "Let’s have lunch together.", "free", "시간이 되는", "I am free today.", "lunch", "점심", "Lunch is at twelve.", "together", "함께", "We eat together.", "time", "시간", "I have time now.", "초안"],
  ["RL-ST-002", "관계", "입문", "가족에게 필요한 물건 부탁하기", "집에서 가족에게 필요한 물건을 부탁해요.", "물건을 부탁하는 가족", "부탁을 듣는 가족", "필요한 물건 말하기 / 가져다 달라고 부탁하기", "Can you bring~?", "~을/를 가져다줄 수 있어요?", "Can you bring my book?", "Can you bring water?", "Can you pass~?", "~을/를 건네줄 수 있어요?", "Can you pass the salt?", "Can you pass this to me?", "bring", "가져오다", "Please bring my book.", "pass", "건네주다", "Please pass the salt.", "salt", "소금", "The soup needs salt.", "book", "책", "My book is on the table.", "초안"],
  ["RL-ST-003", "관계", "입문", "이웃에게 소리 줄여 달라고 말하기", "밤에 소리가 커서 정중히 부탁해요.", "조용히 부탁하는 이웃", "소리를 내는 이웃", "소리가 크다고 말하기 / 소리를 줄여 달라고 부탁하기", "It’s a little~.", "조금 ~해요.", "It’s a little loud.", "It’s a little noisy.", "Please turn down~.", "~을/를 줄여 주세요.", "Please turn down the music.", "Please turn down the TV.", "noise", "소음", "The noise is loud.", "music", "음악", "The music is loud.", "TV", "텔레비전", "The TV is loud.", "night", "밤", "The night is quiet.", "초안"],
  ["RL-ST-004", "관계", "입문", "지인에게 늦는다고 메시지하기", "약속 장소로 가는 중 늦는다고 알려요.", "늦는 사람", "기다리는 지인", "늦는다고 말하기 / 도착 시간을 말하기", "I’m sorry I’m late.", "늦어서 미안해요.", "I’m sorry I’m late.", "I’m sorry I’m a little late.", "I’ll be there~.", "~에 도착할게요.", "I’ll be there soon.", "I’ll be there at three.", "soon", "곧", "I will be there soon.", "minute", "분", "I need five minutes.", "wait", "기다리다", "Please wait for me.", "message", "메시지", "I send a message.", "초안"],
  ["RL-ST-005", "관계", "입문", "좋은 소식에 축하 전하기", "상대의 좋은 소식을 듣고 따뜻하게 반응해요.", "축하를 전하는 사람", "좋은 소식을 전하는 지인", "좋은 소식이라고 말하기 / 상대를 축하하기", "That’s great news.", "정말 좋은 소식이에요.", "That’s great news.", "That’s great.", "I’m happy for you.", "당신이 잘돼서 기뻐요.", "I’m happy for you.", "I am happy today.", "news", "소식", "This news is good.", "great", "아주 좋은", "That is great.", "happy", "기쁜", "I am happy today.", "smile", "웃다, 미소", "I smile a lot.", "초안"],
];

const input = await FileBlob.load(inputPath);
const wb = await SpreadsheetFile.importXlsx(input);

const relationshipSheet = addSheet(wb, "입문-관계 원고", "입문 > 관계 5개 원고 초안", manuscriptHeaders, introRelationshipRows, [14, 12, 12, 34, 42, 24, 26, 42, 28, 24, 32, 32, 28, 28, 32, 32, 18, 18, 34, 18, 18, 34, 18, 18, 34, 18, 18, 34, 14]);

for (const range of ["I3:I200", "M3:M200", "Q3:Q200", "T3:T200", "W3:W200", "Z3:Z200"]) {
  relationshipSheet.getRange(range).format = {
    fill: colors.white,
    font: { bold: true, color: colors.dark, name: "Malgun Gothic", size: 10 },
    verticalAlignment: "top",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: colors.line },
  };
}

await fs.mkdir(outputDir, { recursive: true });

const preview = await wb.render({ sheetName: "입문-관계 원고", autoCrop: "all", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/입문-관계 원고.png`, new Uint8Array(await preview.arrayBuffer()));

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  maxChars: 2000,
});
console.log(errors.ndjson);

const overview = await wb.inspect({ kind: "sheet", include: "id,name", maxChars: 8000 });
console.log(overview.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(wb);
try {
  await xlsx.save(inputPath);
  console.log(inputPath);
} catch (error) {
  if (error?.code !== "EBUSY") throw error;
  await xlsx.save(fallbackPath);
  console.log(fallbackPath);
}
