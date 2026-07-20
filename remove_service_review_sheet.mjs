import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "outputs/content-guidelines/talkflow_content_guidelines_starter_with_health.xlsx";
const fallbackPath = "outputs/content-guidelines/talkflow_content_guidelines_starter_with_health_no_service_review.xlsx";

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

const sheet = wb.worksheets.getItem("생활서비스 검수");
sheet.delete();

const overview = await wb.inspect({ kind: "sheet", include: "id,name", maxChars: 7000 });
console.log(overview.ndjson);

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  maxChars: 2000,
});
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(wb);
try {
  await xlsx.save(inputPath);
  console.log(inputPath);
} catch (error) {
  if (error?.code !== "EBUSY") throw error;
  await xlsx.save(fallbackPath);
  console.log(fallbackPath);
}
