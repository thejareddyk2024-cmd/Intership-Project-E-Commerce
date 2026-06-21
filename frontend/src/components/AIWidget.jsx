import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

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

    const [allProducts, setAllProducts] =
        useState([]);

    const [
        recommendedProducts,
        setRecommendedProducts
    ] = useState([]);

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [chat, loading]);

    useEffect(() => {
        fetchProducts();
    }, []);
    const navigate = useNavigate();
    const fetchProducts = async () => {
        try {

            const response =
                await api.get(
                    "/api/v1/products"
                );

            setAllProducts(
                response.data
            );

        } catch (error) {

            console.log(error);

        }
    };

    const sendMessage = async () => {

        if (!message.trim()) return;

        const userText = message;

        setChat(prev => [
            ...prev,
            {
                sender: "user",
                text: userText
            }
        ]);

        setMessage("");

        try {

            setLoading(true);

            const response =
                await api.post(
                    "/api/v1/ai/chat",
                    {
                        message: userText
                    }
                );

            const aiText =
                response.data.response;

            setChat(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: aiText
                }
            ]);

            const matches =
                allProducts.filter(
                    product =>
                        aiText.includes(
                            product.name
                        )
                );

            setRecommendedProducts(
                matches
            );

        } catch (error) {

            console.log(error);

            setChat(prev => [
                ...prev,
                {
                    sender: "ai",
                    text:
                        "❌ AI Assistant is currently unavailable."
                }
            ]);

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <button
                onClick={() =>
                    setOpen(!open)
                }
                style={{
                    position: "fixed",
                    bottom: "25px",
                    right: "25px",
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    border: "none",
                    fontSize: "30px",
                    cursor: "pointer",
                    zIndex: 9999,
                    background:
                        "linear-gradient(135deg,#4f46e5,#7c3aed)",
                    color: "white",
                    boxShadow:
                        "0 0 25px rgba(124,58,237,0.7)"
                }}
            >
                🤖
            </button>

            <div
                style={{
                    position: "fixed",
                    bottom: "105px",
                    right: "25px",
                    width: "400px",
                    height: "600px",
                    background:
                        "rgba(20,20,25,0.96)",
                    backdropFilter: "blur(20px)",
                    border:
                        "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "20px",
                    boxShadow:
                        "0 0 40px rgba(0,0,0,0.4)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 9999,
                    opacity: open ? 1 : 0,
                    transform:
                        open
                            ? "translateY(0)"
                            : "translateY(25px)",
                    pointerEvents:
                        open
                            ? "auto"
                            : "none",
                    transition:
                        "all 0.3s ease"
                }}
            >
                <div
                    style={{
                        padding: "16px",
                        background:
                            "linear-gradient(135deg,#4f46e5,#7c3aed)",
                        color: "white",
                        fontWeight: "bold",
                        borderTopLeftRadius:
                            "20px",
                        borderTopRightRadius:
                            "20px"
                    }}
                >
                    🤖 ShopSmart AI
                </div>

                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "15px"
                    }}
                >
                    {chat.map(
                        (msg, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom:
                                        "14px",
                                    textAlign:
                                        msg.sender ===
                                        "user"
                                            ? "right"
                                            : "left"
                                }}
                            >
                                <div
                                    style={{
                                        display:
                                            "inline-block",
                                        maxWidth:
                                            "80%",
                                        padding:
                                            "12px 14px",
                                        borderRadius:
                                            "14px",
                                        whiteSpace:
                                            "pre-wrap",
                                        background:
                                            msg.sender ===
                                            "user"
                                                ? "linear-gradient(135deg,#2563eb,#4f46e5)"
                                                : "rgba(255,255,255,0.08)",
                                        color:
                                            "white"
                                    }}
                                >
                                    <ReactMarkdown>
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )
                    )}

                    {loading && (
                        <div
                            className="mb-3"
                        >
                            <div
                                style={{
                                    display:
                                        "inline-block",
                                    padding:
                                        "10px 14px",
                                    borderRadius:
                                        "12px",
                                    background:
                                        "rgba(255,255,255,0.08)",
                                    color:
                                        "white"
                                }}
                            >
                                🤖 Thinking...
                            </div>
                        </div>
                    )}

                    {recommendedProducts.length > 0 && (

                        <div
                            className="mt-3"
                        >
                            <h6
                                style={{
                                    color:
                                        "white",
                                    marginBottom:
                                        "12px"
                                }}
                            >
                                Recommended Products
                            </h6>

                            {recommendedProducts.map(
                                (
                                    product
                                ) => (
                                    <div
                                        key={
                                            product.id
                                        }
                                        style={{
                                            background:
                                                "rgba(255,255,255,0.08)",
                                            padding:
                                                "12px",
                                            borderRadius:
                                                "12px",
                                            marginBottom:
                                                "10px",
                                            border:
                                                "1px solid rgba(255,255,255,0.08)"
                                        }}
                                    >
                                        <h6
                                            style={{
                                                color:
                                                    "white"
                                            }}
                                        >
                                            {
                                                product.name
                                            }
                                        </h6>

                                        <p
                                            style={{
                                                color:
                                                    "#ccc",
                                                marginBottom:
                                                    "4px"
                                            }}
                                        >
                                            💰 $
                                            {
                                                product.price
                                            }
                                        </p>

                                        <p
                                            style={{
                                                color:
                                                    "#ccc",
                                                marginBottom:
                                                    "8px"
                                            }}
                                        >
                                            📦 Stock:
                                            {" "}
                                            {
                                                product.stock_quantity
                                            }
                                        </p>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() =>
                                                navigate(
                                                    `/product/${product.id}`
                                                )
                                            }
                                        >
                                            View Product
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                    )}

                    <div
                        ref={
                            chatEndRef
                        }
                    ></div>
                </div>

                <div
                    style={{
                        padding: "12px",
                        borderTop:
                            "1px solid rgba(255,255,255,0.08)"
                    }}
                >
                    <input
                        className="form-control"
                        value={message}
                        onChange={(
                            e
                        ) =>
                            setMessage(
                                e.target.value
                            )
                        }
                        onKeyDown={(
                            e
                        ) => {
                            if (
                                e.key ===
                                    "Enter" &&
                                !loading
                            ) {
                                sendMessage();
                            }
                        }}
                        placeholder="Ask ShopSmart AI..."
                    />

                    <button
                        className="btn btn-primary w-100 mt-2"
                        onClick={
                            sendMessage
                        }
                        disabled={
                            loading
                        }
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}

export default AIWidget;