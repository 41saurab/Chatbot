import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatText = (text) => {
        const sections = text.split(/\n(?=\*)/);

        return sections.map((section, index) => {
            if (section.startsWith("*")) {
                const [heading, ...content] = section.split("\n");
                return (
                    <div key={index} className="mb-4">
                        <h2 className="text-lg font-bold mb-2">{heading.replace("* ", "")}</h2>
                        <div className="pl-4">
                            {content.map((line, lineIndex) => (
                                <p key={lineIndex} className="mb-2">
                                    {line.replace("* ", "• ")}
                                </p>
                            ))}
                        </div>
                    </div>
                );
            }
            return (
                <p key={index} className="mb-2">
                    {section}
                </p>
            );
        });
    };

    const handleAsk = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setMessages((prev) => [...prev, { sender: "user", text: question }]);
        setQuestion("");
        try {
            const res = await axios.post("http://127.0.0.1:8000/ask", { text: question });
            let refinedResponse = res.data.answer
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .replace(/\*(.*?)\*/g, "$1")
                .replace(/- /g, "• ");
            setMessages((prev) => [...prev, { sender: "bot", text: refinedResponse }]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: "bot", text: "An error occurred. Please try again." }]);
        }
        setLoading(false);
    };

    return (
        <div className="bg-gray-50 flex h-screen">
            <div className="w-full h-full bg-white flex flex-col">
                <div className="bg-[#0096FF] text-white p-4 shrink-0">
                    <h1 className="text-xl font-semibold">Gemini AI</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hidden">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] px-6 py-3 rounded-2xl ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                                {msg.sender === "bot" ? formatText(msg.text) : msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="border-t bg-white p-4 shrink-0">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Type your message..."
                            value={question}
                            disabled={loading}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                        />
                        <button
                            className={`px-6 py-2 rounded-lg font-medium ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
