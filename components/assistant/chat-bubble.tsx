"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";

const WELCOME_TEXT =
  "Xin chào! Tôi là trợ lý nội bộ — hỏi về giá, quy trình, nội quy, khuyến mãi… Tôi trả lời theo tài liệu của tiệm.";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_TEXT },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const historyForApi = nextMessages.filter(
      (m, i) =>
        !(i === 0 && m.role === "assistant" && m.content === WELCOME_TEXT)
    );

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error || "Có lỗi xảy ra. Thử lại hoặc hỏi chủ tiệm.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Mất kết nối. Kiểm tra mạng và thử lại.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-blue-500 px-4 py-3 text-white">
            <div>
              <p className="font-semibold text-sm">Trợ lý tiệm</p>
              <p className="text-xs opacity-90">Quy trình · Giá · Nội quy</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-white/20"
              aria-label="Đóng chat"
            >
              <IoClose size={22} />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex max-h-[min(60vh,420px)] flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-xs text-gray-400">Đang trả lời…</p>
            )}
          </div>

          <div className="flex gap-2 border-t border-gray-100 p-3">
            <input
              type="text"
              placeholder="Hỏi về giá, quy trình…"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700"
              aria-label="Gửi"
            >
              <IoSend size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-blue-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label={open ? "Đóng trợ lý" : "Mở trợ lý"}
      >
        {open ? <IoClose size={28} /> : <IoChatbubbleEllipses size={28} />}
      </button>
    </>
  );
}
