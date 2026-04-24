"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Formats AI response text into rendered React nodes.
 * Supports: **bold**, hyperlinks, newlines, and bullet points.
 */
function formatMessage(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    
    // Skip empty lines but add spacing
    if (line.trim() === "") {
      if (lineIndex > 0) elements.push(<div key={`sp-${lineIndex}`} className="h-2" />);
      continue;
    }

    // Detect bullet points
    const isBullet = /^\s*[-•*]\s+/.test(line);
    const cleanLine = isBullet ? line.replace(/^\s*[-•*]\s+/, "") : line;

    // Parse inline formatting: **bold** and URLs
    const parts: React.ReactNode[] = [];
    const regex = /(https?:\/\/[^\s]+)|\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = regex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanLine.slice(lastIndex, match.index));
      }

      if (match[1]) {
        parts.push(
          <a
            key={`${lineIndex}-${keyIndex++}`}
            href={match[1]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {match[1]}
          </a>
        );
      } else if (match[2]) {
        parts.push(
          <span key={`${lineIndex}-${keyIndex++}`} className="font-semibold text-foreground">
            {match[2]}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.slice(lastIndex));
    }

    if (isBullet) {
      elements.push(
        <div key={`line-${lineIndex}`} className="flex gap-2 items-start pl-1">
          <span className="text-accent mt-1.5 text-[6px] flex-shrink-0">●</span>
          <span>{parts}</span>
        </div>
      );
    } else {
      elements.push(
        <div key={`line-${lineIndex}`}>{parts}</div>
      );
    }
  }

  return <div className="flex flex-col gap-1">{elements}</div>;
}

/* Suggested quick-action prompts for visitors */
const QUICK_PROMPTS = [
  "What projects have you worked on?",
  "What technologies do you use?",
  "Tell me about your experience",
  "Are you available for work?",
];

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

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Use requestAnimationFrame for smooth scroll after DOM paint
      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (e?: React.FormEvent, overrideMessage?: string) => {
    if (e) e.preventDefault();
    const messageToSend = overrideMessage || input.trim();
    if (!messageToSend || isLoading) return;

    setInput("");
    
    const userMessage: Message = { role: "user", content: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn context
      const history = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          context: portfolioData,
          history,
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
        { role: "assistant", content: "I apologize, but I'm temporarily unavailable. Please try again shortly." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col overflow-hidden ${isInline
          ? "w-full h-full rounded-2xl bg-card/40 border border-border/60 backdrop-blur-2xl backdrop-saturate-150 [box-shadow:var(--base-shadow)]"
          : "h-full z-50"
        } ${className}`}
    >
      {/* Header — Professional gradient bar */}
      <div className="chat-header p-5 border-b border-border/30 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-foreground leading-tight">
              Bharath Kumar
            </h3>
            <p className="text-xs font-medium text-muted-foreground mt-0.5 tracking-wide uppercase">
              Personal Chat • Online
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close chat"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 chat-messages-scroll relative flex flex-col"
      >
        {/* Welcome state */}
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 chat-welcome-fade gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              Ask me anything about my projects or experience.
            </p>
            
            {/* Quick prompts */}
            <div className="flex flex-col gap-2 w-full max-w-[280px]">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(undefined, prompt)}
                  className="text-left px-4 py-3 rounded-xl text-sm font-medium text-foreground/80 bg-accent/10 border border-accent/20 hover:border-accent/40 hover:bg-accent/20 hover:text-accent transition-all duration-200 group"
                >
                  <span className="opacity-50 group-hover:opacity-80 mr-1.5 transition-opacity">→</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} chat-message-enter`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div
              className={`max-w-[85%] px-5 py-4 text-base leading-relaxed ${msg.role === "user"
                  ? "chat-bubble-user rounded-2xl rounded-br-md"
                  : "chat-bubble-assistant rounded-2xl rounded-bl-md"
                }`}
            >
              {formatMessage(msg.content)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start chat-message-enter">
            <div className="chat-bubble-assistant px-5 py-4 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5 items-center h-5">
                <div className="w-1.5 h-1.5 bg-accent/60 rounded-full chat-typing-dot" style={{ animationDelay: "0s" }} />
                <div className="w-1.5 h-1.5 bg-accent/60 rounded-full chat-typing-dot" style={{ animationDelay: "0.15s" }} />
                <div className="w-1.5 h-1.5 bg-accent/60 rounded-full chat-typing-dot" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-border/30 flex-shrink-0 chat-input-area"
      >
        <div className="flex gap-2.5 items-end">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my work..."
            className="flex-1 px-5 py-4 rounded-xl bg-foreground/[0.06] border border-border/50 focus:border-accent/40 focus:bg-foreground/[0.08] outline-none text-base font-medium transition-all duration-200 placeholder:text-muted-foreground/60"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 group/send flex-shrink-0"
            aria-label="Send message"
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-[18px] h-[18px] fill-current transition-transform duration-300 ${isLoading
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
