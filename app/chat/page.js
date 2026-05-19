"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const { data: session } = useSession();
  const initialMessage = {
    id: 1,
    role: "assistant",
    content: `Hello ${session?.user?.name || "Farmer"}! I'm KrishiSmart AI, your personal agricultural assistant. How can I help you today? You can ask me about crop diseases, soil health, or best farming practices.`,
    timestamp: new Date().toISOString(),
  };

  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "Best fertilizer for Rice?",
    "How to improve soil PH?",
    "Organic pest control for Tomato?",
    "What crops grow in summer?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async (e, customInput = null) => {
    if (e) e.preventDefault();
    const messageText = customInput || input;
    if (!messageText.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to get response from AI");
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      let errorMessageContent = `**Error:** ${error.message}. Please check your API key and connection.`;
      
      if (error.message.includes("429") || error.message.includes("quota")) {
        errorMessageContent = "⚠️ **Rate Limit Reached:** You've sent too many messages too quickly. Please wait about 15-30 seconds and try again. This is a limit of the free API tier.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: errorMessageContent,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the conversation?")) {
      setMessages([initialMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Head>
        <title>KrishiSmart AI Chat</title>
      </Head>

      <Navbar />

      <main className="flex-1 pt-20 pb-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col h-[calc(100vh-2rem)]">
        {/* Chat Header */}
        <div className="bg-white rounded-t-3xl border-x border-t border-slate-200 p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="KrishiSmart AI" className="w-12 h-12 rounded-2xl shadow-lg shadow-emerald-500/20 object-cover" />
            <div>
              <h1 className="font-bold text-slate-900 text-lg">KrishiSmart AI Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by Gemini 2.0</span>
              </div>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Clear Conversation"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-6 py-4 shadow-sm ${
                msg.role === "user" 
                ? "bg-slate-900 text-white rounded-tr-none" 
                : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
              }`}>
                <div className={`text-[15px] leading-relaxed prose ${msg.role === "user" ? "prose-invert" : "prose-slate"}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <div className={`text-[10px] mt-2 font-medium ${msg.role === "user" ? "text-slate-400" : "text-slate-400"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-50 rounded-3xl rounded-tl-none px-6 py-4 border border-slate-100 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="bg-white border-x border-slate-200 px-6 py-2 flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(null, q)}
                className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        )}



        <div className="bg-white rounded-b-3xl border-x border-b border-slate-200 p-4 shadow-sm">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <button 
              type="button" 
              onClick={startListening}
              className={`p-2 rounded-xl transition-all ${isListening ? "text-red-600 bg-red-50 animate-pulse" : "text-slate-400 hover:text-emerald-600 hover:bg-slate-50"}`}
              title="Voice Input"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask anything about farming..."} 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
          <p className="text-[9px] text-center text-slate-400 mt-2 font-medium uppercase tracking-wider">
            Krishi AI can make mistakes. Verify important agricultural data.
          </p>
        </div>
      </main>
    </div>
  );
}
