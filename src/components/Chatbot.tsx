import { useState } from "react";

/* -----------------------------
   Types
--------------------------------*/

type Sender = "user" | "bot";

interface Message {
  text: string;
  from: Sender;
}

/* -----------------------------
   Hard-coded responses
--------------------------------*/

const responses: Record<string, string> = {
  "what are your return policies?":
    "Returns are accepted within 30 days for store credit.",
  "how do i measure for tailoring?":
    "Use our sizing guide: chest, waist, etc.",
  "shipping time?":
    "Standard shipping takes 5-7 days.",
  default:
    "Sorry, I can only answer a few questions. Contact support for more.",
};

/* -----------------------------
   Component
--------------------------------*/

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSend = (): void => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: input, from: "user" },
    ]);

    const reply =
      responses[input.toLowerCase()] ??
      responses.default;

    setMessages((prev) => [
      ...prev,
      { text: reply, from: "bot" },
    ]);

    setInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "60px",
        right: "20px",
        border: "1px solid #ccc",
        padding: "10px",
        width: "300px",
        background: "#fff",
      }}
    >
      <h3>Chatbot</h3>

      <div
        style={{
          height: "200px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, idx) => (
          <p
            key={idx}
            style={{
              textAlign:
                msg.from === "user"
                  ? "right"
                  : "left",
            }}
          >
            {msg.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question..."
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
}
