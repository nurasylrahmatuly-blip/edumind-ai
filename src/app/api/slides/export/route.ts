import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { Slide } from '@/lib/agents/slides';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const { presentationId } = await req.json() as { presentationId: string };

  const presentation = await prisma.presentation.findFirst({
    where: { id: presentationId, userId: session.user.id },
  });

  if (!presentation) return new Response('Not found', { status: 404 });

  try {
    // Dynamic import to avoid SSR issues
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();

    pptx.defineLayout({ name: 'LAYOUT_WIDE', width: 13.33, height: 7.5 });
    pptx.layout = 'LAYOUT_WIDE';

    const slides = JSON.parse(JSON.stringify(presentation.slides)) as Slide[];

    for (const slide of slides) {
      const pSlide = pptx.addSlide();

      // Dark background
      pSlide.background = { color: '070809' };

      // Lime accent bar at top
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: '100%', h: 0.06,
        fill: { color: 'b8f727' },
      });

      if (slide.type === 'title' || slide.layout === 'centered') {
        // Centered title slide
        pSlide.addText(slide.title, {
          x: 0.5, y: 1.8, w: 12.33, h: 1.5,
          fontSize: 40, bold: true, color: 'f4f4f2',
          fontFace: 'Calibri', align: 'center',
        });
        if (slide.subtitle) {
          pSlide.addText(slide.subtitle, {
            x: 0.5, y: 3.5, w: 12.33, h: 0.8,
            fontSize: 20, color: 'c9f94a',
            fontFace: 'Calibri', align: 'center',
          });
        }
        if (slide.content) {
          pSlide.addText(slide.content, {
            x: 1.5, y: 4.5, w: 10.33, h: 1.2,
            fontSize: 16, color: '8b8b8b',
            fontFace: 'Calibri', align: 'center',
          });
        }
      } else if (slide.type === 'quote') {
        pSlide.addText(`"${slide.title}"`, {
          x: 0.8, y: 2, w: 11.73, h: 2,
          fontSize: 28, bold: true, color: 'b8f727',
          fontFace: 'Calibri', align: 'center', italic: true,
        });
        if (slide.content) {
          pSlide.addText(`— ${slide.content}`, {
            x: 0.8, y: 4.2, w: 11.73, h: 0.6,
            fontSize: 16, color: '8b8b8b',
            fontFace: 'Calibri', align: 'center',
          });
        }
      } else {
        // Content slide with bullets
        pSlide.addText(slide.title, {
          x: 0.5, y: 0.4, w: 12.33, h: 0.9,
          fontSize: 28, bold: true, color: 'f4f4f2',
          fontFace: 'Calibri',
        });

        // Underline using shape
        pSlide.addShape(pptx.ShapeType.rect, {
          x: 0.5, y: 1.25, w: 3, h: 0.04,
          fill: { color: 'b8f727' },
        });

        if (slide.bulletPoints && slide.bulletPoints.length > 0) {
          const bullets = slide.bulletPoints.map((b) => ({
            text: b,
            options: { bullet: { code: '25CF', indent: 15 }, color: 'f4f4f2', fontSize: 18, fontFace: 'Calibri', paraSpaceAfter: 8 },
          }));
          pSlide.addText(bullets, {
            x: 0.5, y: 1.5, w: 12.33, h: 5.5,
            valign: 'top',
          });
        } else if (slide.content) {
          pSlide.addText(slide.content, {
            x: 0.5, y: 1.6, w: 12.33, h: 5.2,
            fontSize: 18, color: 'b0b0b0',
            fontFace: 'Calibri', valign: 'top', breakLine: true,
          });
        }
      }

      // Slide number
      pSlide.addText(`${slides.indexOf(slide) + 1} / ${slides.length}`, {
        x: 11.5, y: 7.1, w: 1.5, h: 0.3,
        fontSize: 9, color: '444444', fontFace: 'Calibri', align: 'right',
      });
    }

    const buffer = await pptx.write({ outputType: 'nodebuffer' });

    const uint8 = new Uint8Array(buffer as Buffer);
    return new Response(uint8, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${presentation.title.replace(/[^a-zA-Z0-9-_]/g, '_')}.pptx"`,
      },
    });
  } catch (err) {
    console.error('PPTX export error:', err);
    return new Response('Export failed', { status: 500 });
  }
}
