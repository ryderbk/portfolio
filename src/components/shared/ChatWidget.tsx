import { useState, useRef, useEffect } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

// Helper updated back to content property
function formatMessage(content: string): React.ReactNode {
    const lines = content.split('\n');
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
                    </a>
                );
            } else if (match[2]) {
                parts.push(
                    <span key={`${lineIndex}-${keyIndex++}`} className="font-semibold">
                        {match[2]}
                    </span>
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
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-10rem)] glass-card flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 chat-panel shadow-2xl">
                    <ChatInterface onClose={() => setIsOpen(false)} />
                </div>
            )}

            {/* Chat Button — Premium Glass Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 h-14 rounded-full transition-all duration-500 flex items-center justify-center z-50 group border border-white/10 glass-card hover:border-accent/50 ${isOpen ? 'w-14 px-0' : 'w-40 px-6 gap-3'} backdrop-blur-xl`}
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`relative flex items-center justify-center ${isOpen ? 'rotate-90' : 'rotate-0'} transition-transform duration-500`}>
                    {isOpen ? (
                        <span className="text-xl font-light text-foreground">✕</span>
                    ) : (
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-accent">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        </svg>
                    )}
                </div>
                
                {!isOpen && (
                    <span className="text-sm font-semibold text-foreground tracking-wide whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-500">
                        Chat with me
                    </span>
                )}
            </button>
        </>
    );


}
