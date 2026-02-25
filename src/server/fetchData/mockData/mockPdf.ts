import fs from "node:fs/promises";
import path from "node:path";

export async function mockPdf() {
  const pdfPath = path.join(process.cwd(), "assets", "mock.pdf");
  const pdfBuffer = await fs.readFile(pdfPath);

  const headers = new Headers();
  headers.append("Content-Type", "application/pdf");
  headers.append(
    "Content-Disposition",
    'inline; filename="oppfolgingsplan.pdf"',
  );

  return new Response(pdfBuffer, { headers });
}
