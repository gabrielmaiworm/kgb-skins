import fs from "fs";
import path from "path";

export function imageToBase64(imagePath: string): string {
  try {
    const fullPath = path.join(process.cwd(), imagePath);
    const imageBuffer = fs.readFileSync(fullPath);
    const base64 = imageBuffer.toString("base64");
    const ext = path.extname(imagePath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
    };

    const mimeType = mimeTypes[ext] || "image/png";

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Erro ao converter imagem para base64: ${imagePath}`, error);
    return "";
  }
}
