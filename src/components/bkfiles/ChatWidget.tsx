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

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300); // Wait for open animation to finish
            
            // Close on scroll outside
            const handleScroll = () => {
                setIsOpen(false);
            };
            
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [isOpen]);

    // Fetch projects context on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { getFirestoreDb } = await import("@/lib/firebase");
                const { collection, getDocs, query, orderBy, limit } = await import("firebase/firestore");
                const db = getFirestoreDb();
                const q = query(collection(db, "projects"), orderBy("displayOrder"), limit(10));
                const snap = await getDocs(q);
                setProjects(snap.docs.map(doc => ({
                    title: doc.data().title,
                    description: doc.data().description,
                    technologies: doc.data().technologiesUsed || [],
                })));
            } catch (err) {
                console.error("Error fetching projects for chat:", err);
            }
        };
        fetchProjects();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        console.log("💬 Sending message:", userMessage);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    projects: projects
                }),
            });

            const data = await response.json();
            console.log("API RESPONSE:", data);

            if (!data || !data.reply) {
                throw new Error("Invalid response");
            }

            setMessages((prev) => [
                ...prev, 
                { role: "assistant", content: data.reply }
            ]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev, 
                { role: "assistant", content: "AI is temporarily unavailable." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] glass-card flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div>
                            <h3 className="font-display font-semibold text-foreground">Chat with Bharath</h3>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Developer & Portfolio Assistant</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-sm text-muted-foreground">
                                    👋 Hi! I'm Bharath. Ask me anything about my projects, skills, or experience.
                                </p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-accent/10 border border-accent/20 text-foreground"
                                        : "glass-card bg-white/5 border-white/10 text-foreground"
                                        }`}
                                >
                                    {formatMessage(msg.content)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="glass-card bg-white/5 border-white/10 px-4 py-3 rounded-2xl rounded-bl-none">
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
                    <form onSubmit={handleSendMessage} className="p-5 bg-white/5 border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me something..."
                                className="flex-1 px-4 py-2.5 rounded-xl glass-input text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-30 transition-all active:scale-90 shadow-md shadow-accent/20 group/send"
                            >
                                <svg 
                                    viewBox="0 0 24 24" 
                                    className={`w-5 h-5 fill-current transition-transform duration-300 ${isLoading ? 'animate-pulse' : 'group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5'}`}
                                >
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Chat Button — Premium Glass Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 h-14 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center z-50 group border border-white/10 glass-card hover:border-accent/50 ${isOpen ? 'w-14 px-0' : 'w-40 px-6 gap-3'}`}
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
