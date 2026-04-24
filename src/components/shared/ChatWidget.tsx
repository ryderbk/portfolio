import { useState } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ChatInterface } from "./ChatInterface";

export default function ChatWidget() {
    const { config } = useSiteConfig();
    const [isOpen, setIsOpen] = useState(false);

    // Visibility Check
    if (config && config.chatbotVisibility === false) {
        return null;
    }

    return (
        <>
            {/* Chat Panel */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-10rem)] z-50 chat-panel chat-panel-enter"
                    style={{
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid hsl(var(--border) / 0.4)',
                        background: 'hsl(var(--card))',
                        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px hsl(var(--border) / 0.1)',
                    }}
                >
                    <ChatInterface onClose={() => setIsOpen(false)} />
                </div>
            )}

            {/* Chat Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 group chat-trigger-btn"
                aria-label={isOpen ? "Close chat" : "Chat with Bharath's portfolio assistant"}
                style={{
                    width: isOpen ? '52px' : '160px',
                    height: '52px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isOpen ? '0' : '10px',
                    background: isOpen ? 'hsl(var(--card))' : 'hsl(var(--accent))',
                    color: isOpen ? 'hsl(var(--foreground))' : 'hsl(var(--accent-foreground))',
                    border: isOpen ? '1px solid hsl(var(--border) / 0.5)' : '1px solid hsl(var(--accent) / 0.8)',
                    boxShadow: isOpen
                        ? 'var(--base-shadow)'
                        : '0 8px 32px -8px hsl(var(--accent) / 0.4), 0 0 0 1px hsl(var(--accent) / 0.2)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                }}
            >
                {/* Hover glow */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        borderRadius: '16px',
                        background: isOpen
                            ? 'hsl(var(--foreground) / 0.03)'
                            : 'linear-gradient(135deg, hsl(var(--accent) / 0.2) 0%, transparent 100%)',
                    }}
                />

                {/* Icon */}
                <div
                    className="relative z-10 flex items-center justify-center transition-transform duration-400"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                    {isOpen ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        </svg>
                    )}
                </div>

                {/* Label */}
                {!isOpen && (
                    <span
                        className="relative z-10 text-sm font-semibold tracking-wide whitespace-nowrap"
                        style={{
                            animation: 'chatLabelFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
                        }}
                    >
                        Ask me
                    </span>
                )}
            </button>
        </>
    );
}
