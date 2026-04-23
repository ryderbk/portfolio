"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function formatMessage(content: string): React.ReactNode {
  const lines = content.split("\n");
  const parts: React.ReactNode[] = [];
  let lineIndex = 0;

  for (const line of lines) {
    if (lineIndex > 0) parts.push(<br key={`br-${lineIndex}`} />);

    const regex = /(https?:\/\/[^\s]+)|\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      if (match[1]) {
        parts.push(
          <a
            key={`${lineIndex}-${keyIndex++}`}
            href={match[1]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 dark:text-violet-400 underline hover:text-violet-800"
          >
            {match[1]}
          </a>,
        );
      } else if (match[2]) {
        parts.push(
          <span key={`${lineIndex}-${keyIndex++}`} className="font-semibold">
            {match[2]}
          </span>,
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    lineIndex++;
  }

  return parts;
}

interface ChatInterfaceProps {
  className?: string;
  onClose?: () => void;
  isInline?: boolean;
}

export function ChatInterface({
  className,
  onClose,
  isInline = false,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus logic: Focus input when typing starts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is already in an input or if it's a modifier key
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        e.metaKey || e.ctrlKey || e.altKey
      ) {
        return;
      }

      // If it's a printable character or backspace/enter, focus
      if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Listen for virtual keyboard events (clicks)
  useEffect(() => {
    const handleVirtualKey = (e: any) => {
      const { key, isVirtual } = e.detail;

      // We ONLY manually handle virtual keys (mouse clicks on the 3D keyboard).
      // All physical typing is handled natively by the browser's input field,
      // including the very first keystroke that triggers auto-focus.
      if (!isVirtual) {
        return;
      }

      if (key === "Enter") {
        handleSendMessage();
      } else if (key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      } else if (key.length === 1) {
        setInput((prev) => prev + key);
      }
    };

    window.addEventListener("keyboard-press", handleVirtualKey);
    return () => window.removeEventListener("keyboard-press", handleVirtualKey);
  }, [input, isLoading]);

  // Fetch full portfolio context on mount
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const { getPortfolioContext } = await import("@/services/firestore");
        const context = await getPortfolioContext();
        setPortfolioData(context);
      } catch (err) {
        console.error("Error fetching context for chat:", err);
      }
    };
    fetchContext();
  }, []);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: portfolioData,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid JSON from API");
      }

      if (!data || !data.reply) {
        throw new Error("Invalid response");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI is temporarily unavailable." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col overflow-hidden ${isInline
          ? "w-full h-full rounded-xl bg-muted shadow-sm ring-1 ring-border/50"
          : "glass-card h-[500px] z-50 shadow-2xl"
        } ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-border/10 flex items-center justify-between bg-card">
        <div>
          <h3 className="font-display font-black text-2xl text-foreground">
            Chat / AI
          </h3>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Bharath's Portfolio Assistant
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors border border-border/10"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-background/50 relative flex flex-col"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="max-w-[90%] px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              Hi!👋 Ask me anything about my work.
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[90%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-accent/10 border border-accent/20 text-foreground shadow-sm"
                  : "bg-muted/30 border border-border/10 text-foreground"
                }`}
            >
              {formatMessage(msg.content)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted/30 border border-border/10 px-5 py-4 rounded-2xl">
              <div className="flex gap-1.5 item-center h-4">
                <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-6 bg-card border-t border-border/10"
      >
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-5 py-4 rounded-lg bg-background border border-border focus:border-accent/40 outline-none text-sm font-medium transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-14 h-14 flex items-center justify-center rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-30 transition-all active:scale-95 group/send shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-6 h-6 fill-current transition-transform duration-300 ${isLoading
                  ? "animate-pulse"
                  : "group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5"
                }`}
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
