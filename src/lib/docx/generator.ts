import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Footer,
  PageNumber,
  NumberFormat,
  convertMillimetersToTwip,
  SectionType,
  PageBreak,
} from 'docx';
import type { DocumentContent, ExportOptions, DocumentSection, Source } from '@/types/documents';

// ГОСТ 7.32-2017 constants
const FONT = 'Times New Roman';
const FONT_SIZE = 28; // 14pt in half-points
const FONT_SIZE_SMALL = 24; // 12pt
const LINE_SPACING = 360; // 1.5 spacing (240 * 1.5)
const FIRST_LINE_INDENT = convertMillimetersToTwip(12.5); // 1.25cm

const MARGINS = {
  left: convertMillimetersToTwip(30),
  right: convertMillimetersToTwip(15),
  top: convertMillimetersToTwip(20),
  bottom: convertMillimetersToTwip(20),
};

function bodyParagraph(text: string, options: { centered?: boolean; noIndent?: boolean } = {}): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE })],
    spacing: { line: LINE_SPACING },
    alignment: options.centered ? AlignmentType.CENTER : AlignmentType.BOTH,
    indent: options.noIndent || options.centered ? undefined : { firstLine: FIRST_LINE_INDENT },
  });
}

function emptyLine(): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: '', font: FONT, size: FONT_SIZE })],
    spacing: { line: LINE_SPACING },
  });
}

function heading1(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), font: FONT, size: FONT_SIZE, bold: true })],
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { line: LINE_SPACING, before: 0, after: 0 },
  });
}

function heading2(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE, bold: true })],
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { line: LINE_SPACING, before: 240, after: 0 },
  });
}

function heading3(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE, bold: true, italics: true })],
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.LEFT,
    spacing: { line: LINE_SPACING, before: 120, after: 0 },
    indent: { firstLine: FIRST_LINE_INDENT },
  });
}

function buildTitlePage(content: DocumentContent): Paragraph[] {
  const { titlePage } = content;
  const paras: Paragraph[] = [];

  paras.push(
    new Paragraph({
      children: [new TextRun({ text: titlePage.university || 'МИНИСТЕРСТВО ОБРАЗОВАНИЯ И НАУКИ РОССИЙСКОЙ ФЕДЕРАЦИИ', font: FONT, size: FONT_SIZE_SMALL, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING },
    })
  );

  if (titlePage.faculty) {
    paras.push(emptyLine());
    paras.push(
      new Paragraph({
        children: [new TextRun({ text: titlePage.faculty, font: FONT, size: FONT_SIZE_SMALL })],
        alignment: AlignmentType.CENTER,
        spacing: { line: LINE_SPACING },
      })
    );
  }

  // Big spacing before topic
  for (let i = 0; i < 4; i++) paras.push(emptyLine());

  const docTypeLabel: Record<string, string> = {
    'реферат': 'РЕФЕРАТ',
    'курсовая': 'КУРСОВАЯ РАБОТА',
    'дипломная': 'ВЫПУСКНАЯ КВАЛИФИКАЦИОННАЯ РАБОТА (ДИПЛОМНАЯ РАБОТА)',
  };
  const typeStr = docTypeLabel[titlePage.specialty] ?? 'КУРСОВАЯ РАБОТА';

  paras.push(
    new Paragraph({
      children: [new TextRun({ text: 'по дисциплине:', font: FONT, size: FONT_SIZE })],
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING },
    })
  );
  paras.push(
    new Paragraph({
      children: [new TextRun({ text: titlePage.specialty, font: FONT, size: FONT_SIZE, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING },
    })
  );
  paras.push(emptyLine());
  paras.push(
    new Paragraph({
      children: [new TextRun({ text: typeStr, font: FONT, size: FONT_SIZE, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING },
    })
  );
  paras.push(
    new Paragraph({
      children: [new TextRun({ text: `на тему: «${titlePage.topic}»`, font: FONT, size: FONT_SIZE, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING },
    })
  );

  for (let i = 0; i < 6; i++) paras.push(emptyLine());

  if (titlePage.studentName) {
    paras.push(
      new Paragraph({
        children: [new TextRun({ text: `Выполнил(а): ${titlePage.studentName}`, font: FONT, size: FONT_SIZE })],
        alignment: AlignmentType.RIGHT,
        spacing: { line: LINE_SPACING },
      })
    );
  }

  for (let i = 0; i < 8; i++) paras.push(emptyLine());

  paras.push(
    new Paragraph({
      children: [new TextRun({ text: `${titlePage.city ?? 'Москва'} — ${titlePage.year}`, font: FONT, size: FONT_SIZE })],
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING },
    })
  );

  return paras;
}

function buildTableOfContents(): Paragraph[] {
  return [
    new Paragraph({ children: [new PageBreak()] }),
    heading1('СОДЕРЖАНИЕ'),
    emptyLine(),
    bodyParagraph('Введение ......................................................................................................................3', { noIndent: true }),
    bodyParagraph('Глава 1. [Раздел 1] ..................................................................................................5', { noIndent: true }),
    bodyParagraph('Глава 2. [Раздел 2] ................................................................................................10', { noIndent: true }),
    bodyParagraph('Глава 3. [Раздел 3] ................................................................................................15', { noIndent: true }),
    bodyParagraph('Заключение ............................................................................................................20', { noIndent: true }),
    bodyParagraph('Список использованных источников .....................................................................22', { noIndent: true }),
    emptyLine(),
    new Paragraph({
      children: [new TextRun({ text: '(Данное оглавление является шаблоном. Используйте функцию автооглавления в Microsoft Word)', font: FONT, size: FONT_SIZE_SMALL, italics: true, color: '888888' })],
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING },
    }),
  ];
}

function buildSections(sections: DocumentSection[]): Paragraph[] {
  const paras: Paragraph[] = [];

  for (const section of sections) {
    paras.push(new Paragraph({ children: [new PageBreak()] }));

    if (section.level === 1) {
      paras.push(heading1(section.title));
    } else if (section.level === 2) {
      paras.push(heading2(section.title));
    } else {
      paras.push(heading3(section.title));
    }

    paras.push(emptyLine());

    // Split content into paragraphs on double newlines or single newlines
    const textBlocks = section.content.split(/\n\n+/).filter(Boolean);
    for (const block of textBlocks) {
      const lines = block.split('\n').join(' ').trim();
      if (lines) {
        paras.push(bodyParagraph(lines));
      }
    }
  }

  return paras;
}

function formatSourceGost(source: Source): string {
  if (source.type === 'интернет') {
    const url = source.url ?? source.publisher;
    return `${source.authors} ${source.title} [Электронный ресурс]. — URL: ${url} (дата обращения: ${new Date().toLocaleDateString('ru-RU')}).`;
  }
  if (source.type === 'статья') {
    return `${source.authors} ${source.title} // ${source.publisher}. — ${source.year}. — С. ${source.pages ?? '1–10'}.`;
  }
  if (source.type === 'норматив') {
    return `${source.title} : ${source.publisher}. — Москва : Стандартинформ, ${source.year}. — ${source.pages ?? '20'} с.`;
  }
  return `${source.authors} ${source.title} / ${source.authors}. — ${source.publisher}, ${source.year}. — ${source.pages ?? '200'} с.`;
}

function buildBibliography(bibliography: Source[]): Paragraph[] {
  const paras: Paragraph[] = [
    new Paragraph({ children: [new PageBreak()] }),
    heading1('СПИСОК ИСПОЛЬЗОВАННЫХ ИСТОЧНИКОВ'),
    emptyLine(),
  ];

  for (const source of bibliography) {
    paras.push(
      new Paragraph({
        children: [new TextRun({ text: `${source.number}. ${formatSourceGost(source)}`, font: FONT, size: FONT_SIZE })],
        spacing: { line: LINE_SPACING },
        alignment: AlignmentType.BOTH,
        indent: { left: convertMillimetersToTwip(12.5), hanging: convertMillimetersToTwip(12.5) },
      })
    );
  }

  return paras;
}

export async function generateDocx(content: DocumentContent, options: ExportOptions): Promise<Buffer> {
  const allParagraphs: Paragraph[] = [];

  if (options.includeTitlePage) {
    allParagraphs.push(...buildTitlePage(content));
  }

  if (options.includeTableOfContents) {
    allParagraphs.push(...buildTableOfContents());
  }

  allParagraphs.push(...buildSections(content.sections));

  if (content.bibliography.length > 0) {
    allParagraphs.push(...buildBibliography(content.bibliography));
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: FONT_SIZE },
          paragraph: {
            spacing: { line: LINE_SPACING },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          run: { font: FONT, size: FONT_SIZE },
          paragraph: { spacing: { line: LINE_SPACING } },
        },
      ],
    },
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            margin: MARGINS,
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT,
                    size: FONT_SIZE,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: allParagraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
