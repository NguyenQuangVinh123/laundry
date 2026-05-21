import { NextResponse } from "next/server";
import { loadShopKnowledge } from "@/lib/assistant/load-knowledge";
import { buildSystemMessage } from "@/lib/assistant/prompt";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Cần đăng nhập." }, { status: 401 });
    }

    const body = await request.json();
    const messages = body.messages as ChatMessage[] | undefined;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chưa cấu hình OPENAI_API_KEY trên server." },
        { status: 500 }
      );
    }

    if (!messages?.length) {
      return NextResponse.json(
        { error: "Tin nhắn trống." },
        { status: 400 }
      );
    }

    const last = messages[messages.length - 1];
    if (last.role !== "user" || !last.content.trim()) {
      return NextResponse.json(
        { error: "Cần tin nhắn từ nhân viên." },
        { status: 400 }
      );
    }

    const knowledge = await loadShopKnowledge();
    const systemMessage = buildSystemMessage(knowledge);

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          max_tokens: 1024,
          messages: [
            { role: "system", content: systemMessage },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        }),
      }
    );

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", openaiRes.status, errText);
      return NextResponse.json(
        { error: "Không gọi được AI. Kiểm tra API key hoặc thử lại." },
        { status: 502 }
      );
    }

    const data = await openaiRes.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Xin lỗi, tôi không tạo được câu trả lời.";

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Lỗi server. Thử lại sau." },
      { status: 500 }
    );
  }
}
