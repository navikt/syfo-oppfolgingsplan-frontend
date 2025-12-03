import fs from "fs/promises";
import path from "path";

export async function mockPdf() {
  const pdfPath = path.join(process.cwd(), "assets", "mock.pdf");
  const pdfBuffer = await fs.readFile(pdfPath);

  const headers = new Headers();
  headers.append("Content-Type", "application/pdf");
  headers.append(
    "Content-Disposition",
    'attachment; filename="oppfolgingsplan.pdf"',
  );

  return new Response(pdfBuffer, { headers });
}
