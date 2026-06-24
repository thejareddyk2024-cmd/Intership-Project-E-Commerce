import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, ArrowRight, Loader2 } from "lucide-react";

function AIWidget() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        {
            sender: "ai",
            text: "👋 Hi! I'm ShopSmart AI. Ask me about products, recommendations, pricing, stock availability, or comparisons."
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat, loading, open]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get("/api/v1/products");
            setAllProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;
        const userText = message;
        setChat(prev => [...prev, { sender: "user", text: userText }]);
        setMessage("");

        try {
            setLoading(true);
            const response = await api.post("/api/v1/ai/chat", { message: userText });
            const aiText = response.data.response;
            setChat(prev => [...prev, { sender: "ai", text: aiText }]);

            const matches = allProducts.filter(product => aiText.includes(product.name));
            setRecommendedProducts(matches);
        } catch (error) {
            console.log(error);
            setChat(prev => [...prev, { sender: "ai", text: "❌ AI Assistant is currently unavailable." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-xl shadow-brand-500/30 flex items-center justify-center z-[9999] hover:shadow-brand-500/50 transition-shadow"
                onClick={() => setOpen(!open)}
            >
                {open ? <X size={28} /> : <Bot size={28} />}
                {!open && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-ping" />
                )}
                {!open && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
                )}
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-[100px] right-6 w-[380px] h-[600px] max-h-[80vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl flex flex-col z-[9999] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-4 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <Sparkles size={20} className="text-brand-50" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">ShopSmart AI</h3>
                                    <p className="text-brand-100 text-xs font-medium">Your personal shopping assistant</p>
                                </div>
                            </div>
                            <button onClick={() => setOpen(false)} className="text-brand-100 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 scrollbar-hide">
                            {chat.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl ${
                                            msg.sender === "user"
                                                ? "bg-brand-600 text-white rounded-br-sm"
                                                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm"
                                        }`}
                                    >
                                        {msg.sender === "ai" && index > 0 && (
                                            <div className="flex items-center gap-1.5 mb-1 text-brand-500 text-xs font-bold uppercase tracking-wider">
                                                <Bot size={12} /> AI Agent
                                            </div>
                                        )}
                                        <div className={`prose prose-sm ${msg.sender === "user" ? "prose-invert" : "dark:prose-invert"} max-w-none`}>
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 p-3.5 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-brand-500" />
                                        <span className="text-sm font-medium">Thinking...</span>
                                    </div>
                                </div>
                            )}

                            {recommendedProducts.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-sm font-bold uppercase tracking-wider mb-3 px-1">
                                        <Sparkles size={14} /> Recommended for you
                                    </div>
                                    <div className="space-y-2">
                                        {recommendedProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer"
                                                onClick={() => navigate(`/product/${product.id}`)}
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No img</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h6 className="font-bold text-slate-900 dark:text-white text-sm truncate">{product.name}</h6>
                                                    <p className="text-brand-600 dark:text-brand-400 font-extrabold text-sm">${product.price}</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef}></div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-4 pr-12 py-3.5 bg-slate-100 dark:bg-slate-800 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500 rounded-xl text-sm transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                                    placeholder="Ask anything..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !loading) sendMessage();
                                    }}
                                />
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={sendMessage}
                                    disabled={loading || !message.trim()}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default AIWidget;