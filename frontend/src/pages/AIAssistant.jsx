import { useState } from "react";
import api from "../services/api";

function AIAssistant() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            setLoading(true);

            const result = await api.post(
                "/api/v1/ai/chat",
                {
                    message
                }
            );

            setResponse(
                result.data.response
            );
        } catch (error) {
            console.log(error);

            setResponse(
                "AI Assistant unavailable."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1>
                ShopSmart AI Assistant
            </h1>

            <div className="card p-4 mt-4">
                <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Ask about products..."
                    value={message}
                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }
                />

                <button
                    className="btn btn-primary mt-3"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>

            <div className="card mt-4 p-4">
                <h4>AI Response</h4>

                {loading ? (
                    <p>Thinking...</p>
                ) : (
                    <p>{response}</p>
                )}
            </div>
        </div>
    );
}

export default AIAssistant;