import fs from "fs/promises";
import path from "path";

const KNOWLEDGE_DIR = path.join(process.cwd(), "content", "assistant");

export async function loadShopKnowledge(): Promise<string> {
  try {
    const entries = await fs.readdir(KNOWLEDGE_DIR, { withFileTypes: true });
    const mdFiles = entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => e.name)
      .sort();

    if (mdFiles.length === 0) {
      return "(Chưa có tài liệu. Thêm file .md vào thư mục content/assistant/)";
    }

    const parts = await Promise.all(
      mdFiles.map(async (name) => {
        const content = await fs.readFile(
          path.join(KNOWLEDGE_DIR, name),
          "utf-8"
        );
        return `### ${name}\n\n${content.trim()}`;
      })
    );

    return parts.join("\n\n---\n\n");
  } catch {
    return "(Không đọc được thư mục content/assistant. Kiểm tra đường dẫn trên server.)";
  }
}
