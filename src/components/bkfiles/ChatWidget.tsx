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
                <div className="fixed bottom-24 right-6 w-96 h-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col z-40">
                    {/* Header */}
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Chat with me</h3>
                            <p className="text-xs text-zinc-500">Ask about my work & skills</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-zinc-500 hover:text-zinc-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-zinc-500 text-sm">
                                👋 Hi! Ask me about my projects, skills, or experience.
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === "user"
                                        ? "bg-violet-600 text-white"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                                        }`}
                                >
                                    <p className="text-sm">{formatMessage(msg.content)}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-50 text-sm"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
            >
                {isOpen ? "✕" : "💬"}
            </button>
        </>
    );
}
