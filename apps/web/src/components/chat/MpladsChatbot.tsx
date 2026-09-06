import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Database,
  HelpCircle,
} from "lucide-react";
import api from "../../services/api";

interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    sourceName: string;
    sourceType: string;
    coveragePeriod: string;
    recordCount?: number;
    sampleIds?: string[];
  }>;
  suggestedPrompts?: string[];
}

const INITIAL_PROMPTS = [
  "What is the total allocation across all works?",
  "How are anomaly signals detected?",
  "Show top projects in Uttar Pradesh",
  "Why are contractor names null in some records?",
];

export const MpladsChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "**Welcome to the MPLADS Intelligence Assistant.**\n\nI can assist you with querying verified MoSPI public records, explaining dashboard KPIs, understanding anomaly rules, or tracing specific project records across all 33 States.",
      suggestedPrompts: INITIAL_PROMPTS,
      sources: [
        {
          sourceName: "Canonical MoSPI Public Snapshot",
          sourceType: "PUBLIC_SOURCE_SNAPSHOT",
          coveragePeriod: "2023–2024",
          recordCount: 60359,
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.post("/chat", {
        message: textToSend.trim(),
        history,
      });

      if (res.data?.data) {
        const assistantMsg: ChatMessageItem = {
          id: `ast-${Date.now()}`,
          role: "assistant",
          content: res.data.data.answer,
          sources: res.data.data.sources || [],
          suggestedPrompts: res.data.data.suggestedPrompts || [],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "Unable to query the MPLADS intelligence service. Please verify that the backend API is active.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[99999]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-[#1F2A5A] hover:bg-[#18224B] text-white rounded-full shadow-xl border-2 border-amber-400/50 focus:outline-hidden focus:ring-4 focus:ring-indigo-300 transition-all cursor-pointer"
          title="MPLADS Intelligence Assistant"
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Close</span>
            </>
          ) : (
            <>
              <Bot className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">MPLADS Assistant</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Expandable Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-[99999] w-[95vw] sm:w-[450px] h-[min(560px,calc(100vh-120px))] bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#1F2A5A] text-white flex items-center justify-between shadow-xs shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 border border-white/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                    MPLADS Intelligence Assistant
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      GROUNDED
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    60,359 MoSPI Public Works Records
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                      m.role === "user"
                        ? "bg-[#1F2A5A] text-white rounded-br-none"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700/60"
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed font-sans">
                      {m.content}
                    </div>

                    {/* Source citation */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <Database className="w-3 h-3 text-indigo-500" />
                        <span>Source:</span>
                        {m.sources.map((s, idx) => (
                          <span
                            key={idx}
                            className="font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                          >
                            {s.sourceName} ({s.coveragePeriod})
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Suggested prompts chips */}
                    {m.suggestedPrompts && m.suggestedPrompts.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {m.suggestedPrompts.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSend(p)}
                            className="text-[11px] text-left px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start items-center text-slate-400 text-xs">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl text-[11px] italic">
                    Retrieving canonical records & calculating statistical metrics...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about works, allocations, anomalies, or KPIs..."
                  className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 bg-[#1F2A5A] hover:bg-[#18224B] disabled:opacity-50 text-white rounded-xl transition shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

