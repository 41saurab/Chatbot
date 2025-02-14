import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if (!question.trim()) return;
        setLoading(true);

        setMessages((prev) => [...prev, { sender: "user", text: question }]);

        try {
            const res = await axios.post("http://127.0.0.1:8000/ask", { text: question });
            setMessages((prev) => [...prev, { sender: "bot", text: res.data.answer }]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: "bot", text: "An error occurred. Please try again." }]);
        }

        setQuestion("");
        setLoading(false);
    };

    return (
        <div className="bg-gray-50 flex ">
            <div className="w-full min-h-screen bg-white flex flex-col">
                <div className="bg-green-700 text-white p-4">
                    <h1 className="text-xl font-semibold">Openai Chatbot</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] px-6 py-3 rounded-2xl ${msg.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"}`}>{msg.text}</div>
                        </div>
                    ))}
                </div>

                <div className="border-t bg-white p-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Type your message..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                        />
                        <button
                            className={`px-6 py-2 rounded-lg font-medium ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                            } text-white transition-colors`}
                            onClick={handleAsk}
                            disabled={loading}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
