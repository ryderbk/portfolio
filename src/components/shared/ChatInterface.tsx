"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Formats AI response text into rendered React nodes.
 * Strips markdown symbols (#, >, ---) and renders **bold**, URLs, bullets.
 */
function formatMessage(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    let line = lines[lineIndex];

    // Skip empty lines but add spacing
    if (line.trim() === "") {
      if (lineIndex > 0) elements.push(<div key={`sp-${lineIndex}`} className="h-2" />);
      continue;
    }

    // Strip horizontal rules
    if (/^\s*---+\s*$/.test(line) || /^\s*===+\s*$/.test(line)) continue;

    // Strip markdown headings (#, ##, ###) → treat as bold prose
    const headingMatch = line.match(/^#{1,6}\s+(.+)/);
    if (headingMatch) {
      line = `**${headingMatch[1]}**`;
    }

    // Strip blockquote prefix (> )
    line = line.replace(/^\s*>\s?/, "");

    // Detect bullet points (- item or * item or • item or numbered 1. item)
    const isBullet = /^\s*[-•]\s+/.test(line) || /^\s*\d+\.\s+/.test(line);
    let cleanLine = line;
    if (isBullet) {
      cleanLine = line.replace(/^\s*[-•]\s+/, "").replace(/^\s*\d+\.\s+/, "");
    }

    // Strip lone * or _ used for italic (not part of **)
    // e.g.  *word* → word,  _word_ → word
    cleanLine = cleanLine.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, "$1");
    cleanLine = cleanLine.replace(/_([^_]+?)_/g, "$1");

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
        // URL
        parts.push(
          <a
            key={`${lineIndex}-${keyIndex++}`}
            href={match[1]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--acc)", textDecoration: "underline", textUnderlineOffset: "2px" }}
          >
            {match[1]}
          </a>
        );
      } else if (match[2]) {
        // Bold
        parts.push(
          <strong
            key={`${lineIndex}-${keyIndex++}`}
            style={{ fontWeight: 600, color: "var(--fg)" }}
          >
            {match[2]}
          </strong>
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
          <span style={{ color: "var(--acc)", marginTop: "6px", fontSize: "6px", flexShrink: 0 }}>●</span>
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
  "Say Hi!",
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
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Auto-focus logic: Focus input when typing starts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        e.metaKey || e.ctrlKey || e.altKey
      ) {
        return;
      }
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
      if (!isVirtual) return;
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

  const scrollToLastMessage = useCallback((isAssistant: boolean) => {
    if (scrollContainerRef.current && lastMessageRef.current) {
      const container = scrollContainerRef.current;
      const lastMsg = lastMessageRef.current;
      
      requestAnimationFrame(() => {
        if (isAssistant) {
          // Scroll to the top of the AI response
          const topPos = lastMsg.offsetTop - 10;
          container.scrollTo({
            top: topPos,
            behavior: "smooth",
          });
        } else {
          // Scroll to bottom for user messages
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      scrollToLastMessage(lastMessage.role === "assistant");
    }
  }, [messages, scrollToLastMessage]);

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
      data-lenis-prevent
      className={`flex flex-col overflow-hidden ${
        isInline
          ? "c-open-chat w-full h-full"
          : "h-full z-50 rounded-2xl bg-[var(--bg-2)] border border-[var(--line)] shadow-2xl"
      } ${className}`}
    >
      {/* Title / Header */}
      <div className={`flex items-center justify-between flex-shrink-0 ${isInline ? "pb-4" : "p-4 border-b border-[var(--line)]"}`}>
        <div className="flex items-center gap-2.5">
          <span className="c-open-dot" aria-hidden="true" />
          <span className="c-open-title !p-0">Ask Anything</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[rgba(var(--fg-rgb),0.08)] text-[var(--mute)] hover:text-[var(--fg)] transition-colors"
            aria-label="Close chat"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto c-open-scroll relative flex flex-col py-2"
        style={{ gap: "22px" }}
      >
        {/* Welcome state */}
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex flex-col justify-end items-start text-left pb-8 chat-welcome-fade gap-6">
            <h4
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(1.4rem, 2.2vw, 1.75rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--fg)",
                lineHeight: 1.25,
                maxWidth: "340px",
              }}
            >
              Ask me anything about my projects or{" "}
              <em
                style={{
                  fontFamily: "var(--f-serif)",
                  fontStyle: "italic",
                  color: "var(--acc)",
                  fontWeight: 400,
                }}
              >
                experience
              </em>
              .
            </h4>

            {/* Quick prompts */}
            <div className="flex flex-col items-start gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(undefined, "Hi")}
                  className="c-open-pill group"
                >
                  <span className="c-open-pill-arrow mr-1">→</span>
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message items */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            ref={idx === messages.length - 1 ? lastMessageRef : null}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            } chat-message-enter`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <span className="c-open-role">
              {msg.role === "user" ? "YOU" : "BK-AI"}
            </span>
            <div
              className={`max-w-[90%] ${
                msg.role === "user" ? "c-open-msg-user" : "c-open-msg-assistant"
              }`}
            >
              {formatMessage(msg.content)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex flex-col items-start chat-message-enter">
            <span className="c-open-role">BK-AI</span>
            <div className="flex gap-1.5 items-center h-5 py-1">
              <div className="c-open-dot-anim" style={{ animationDelay: "0s" }} />
              <div className="c-open-dot-anim" style={{ animationDelay: "0.15s" }} />
              <div className="c-open-dot-anim" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="pt-2">
        <div className="c-open-input-row">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my work..."
            className="c-open-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="c-open-send group/send"
            aria-label="Send message"
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 fill-current transition-transform duration-300 ${
                isLoading
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
