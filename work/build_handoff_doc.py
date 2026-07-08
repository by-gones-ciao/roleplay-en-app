from pathlib import Path
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
root=Path(r'C:/Users/mostl/Documents/Codex/2026-07-01/https-k-chao-vercel-app')
md=(root/'outputs/롤플레잉_영어학습앱_통합_개발명세서.md').read_text(encoding='utf-8')
doc=Document(); sec=doc.sections[0]
sec.top_margin=Inches(.65); sec.bottom_margin=Inches(.65); sec.left_margin=Inches(.72); sec.right_margin=Inches(.72)
styles=doc.styles
styles['Normal'].font.name='Malgun Gothic'; styles['Normal']._element.rPr.rFonts.set(qn('w:eastAsia'),'맑은 고딕'); styles['Normal'].font.size=Pt(9)
for name,size,color in [('Title',25,'533BC8'),('Heading 1',18,'533BC8'),('Heading 2',14,'1B1925'),('Heading 3',11,'6C54E6')]:
 st=styles[name]; st.font.name='Malgun Gothic'; st._element.rPr.rFonts.set(qn('w:eastAsia'),'맑은 고딕'); st.font.size=Pt(size); st.font.color.rgb=RGBColor.from_string(color); st.font.bold=True

def shade(cell,fill):
 tcPr=cell._tc.get_or_add_tcPr(); shd=OxmlElement('w:shd'); shd.set(qn('w:fill'),fill); tcPr.append(shd)
def add_inline(p,text):
 for idx,c in enumerate(text.split(chr(96))):
  r=p.add_run(c); r.font.name='Consolas' if idx%2 else 'Malgun Gothic'; r._element.rPr.rFonts.set(qn('w:eastAsia'),'맑은 고딕')
  if idx%2: r.font.color.rgb=RGBColor(83,59,200); r.font.size=Pt(8.5)
lines=md.splitlines(); i=0; in_code=False; code=[]
while i<len(lines):
 line=lines[i]
 if line.startswith('~~~'):
  if not in_code: in_code=True; code=[]
  else:
   p=doc.add_paragraph(); r=p.add_run('\n'.join(code)); r.font.name='Consolas'; r.font.size=Pt(8); p.paragraph_format.left_indent=Inches(.25); in_code=False
  i+=1; continue
 if in_code: code.append(line); i+=1; continue
 if not line.strip() or line=='---': i+=1; continue
 if line.startswith('# '):
  p=doc.add_paragraph(style='Title'); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.add_run(line[2:]); i+=1; continue
 if line.startswith('## '): doc.add_heading(line[3:],1); i+=1; continue
 if line.startswith('### '): doc.add_heading(line[4:],2); i+=1; continue
 if line.startswith('#### '): doc.add_heading(line[5:],3); i+=1; continue
 if line.startswith('|') and i+1<len(lines) and lines[i+1].startswith('|') and '---' in lines[i+1]:
  rows=[[x.strip() for x in line.strip('|').split('|')]]; i+=2
  while i<len(lines) and lines[i].startswith('|'): rows.append([x.strip() for x in lines[i].strip('|').split('|')]); i+=1
  table=doc.add_table(rows=len(rows),cols=len(rows[0])); table.alignment=WD_TABLE_ALIGNMENT.CENTER; table.style='Table Grid'
  for rr,row in enumerate(rows):
   for cc,val in enumerate(row):
    cell=table.cell(rr,cc); cell.text=val
    if rr==0: shade(cell,'EDE9FF')
    for pp in cell.paragraphs:
     for run in pp.runs: run.font.name='Malgun Gothic'; run._element.rPr.rFonts.set(qn('w:eastAsia'),'맑은 고딕'); run.font.size=Pt(7.5); run.font.bold=(rr==0)
  doc.add_paragraph(); continue
 if line.startswith('- [ ]'):
  p=doc.add_paragraph(style='List Bullet'); add_inline(p,'☐ '+line[5:].strip()); i+=1; continue
 if line.startswith('- '):
  p=doc.add_paragraph(style='List Bullet'); add_inline(p,line[2:]); i+=1; continue
 if len(line)>2 and line[0].isdigit() and '. ' in line[:4]:
  p=doc.add_paragraph(style='List Number'); add_inline(p,line.split('. ',1)[1]); i+=1; continue
 p=doc.add_paragraph(); add_inline(p,line.replace('**','')); p.paragraph_format.space_after=Pt(4); i+=1
header=sec.header.paragraphs[0]; header.text='롤플레잉 영어 학습 앱 · 통합 개발 명세서'; header.alignment=WD_ALIGN_PARAGRAPH.RIGHT
for r in header.runs: r.font.size=Pt(8); r.font.color.rgb=RGBColor(119,115,129)
footer=sec.footer.paragraphs[0]; footer.alignment=WD_ALIGN_PARAGRAPH.CENTER; rr=footer.add_run('내부 개발 인계용 · 2026-07-03'); rr.font.size=Pt(8); rr.font.color.rgb=RGBColor(119,115,129)
out=root/'outputs/롤플레잉_영어학습앱_통합_개발명세서.docx'; doc.save(out); print(out)
