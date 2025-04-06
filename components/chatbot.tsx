"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"
import ChatbotService, { Message } from "@/services/chatbot.service"

export function Chatbot() {
  const [isVisible, setIsVisible] = useState(false)
  const [isWelcomeSent, setIsWelcomeSent] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const messageContainerRef = useRef<HTMLDivElement>(null)

  // Khởi tạo session ID khi component được mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatbot_session_id')
    if (storedSessionId) {
      setSessionId(storedSessionId)
    } else {
      const newSessionId = uuidv4()
      setSessionId(newSessionId)
      localStorage.setItem('chatbot_session_id', newSessionId)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [messages])

  const toggleChatbot = async () => {
    const newVisibility = !isVisible
    setIsVisible(newVisibility)
    
    if (newVisibility && !isWelcomeSent) {
      setIsLoading(true)
      try {
        const welcomeMessages = await ChatbotService.initializeChat(sessionId)
        setMessages(welcomeMessages)
        setIsWelcomeSent(true)
      } catch (error) {
        console.error("Error initializing chat:", error)
        setMessages([
          {
            sender: "bot",
            message: "Xin chào! Chúng tôi có thể giúp gì cho bạn?"
          }
        ])
        setIsWelcomeSent(true)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const addMessage = (sender: "user" | "bot", message: string) => {
    setMessages((prev) => [...prev, { sender, message }])
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (inputMessage.trim() === "") return

    // Add user message
    addMessage("user", inputMessage)

    // Clear input
    const userMessage = inputMessage
    setInputMessage("")

    // Get bot response
    setIsLoading(true)
    try {
      const botResponses = await ChatbotService.sendMessage(userMessage, sessionId)
      
      // Thêm từng tin nhắn từ bot vào danh sách tin nhắn
      botResponses.forEach(response => {
        addMessage(response.sender, response.message)
      })
    } catch (error) {
      console.error("Error getting chatbot response:", error)
      addMessage("bot", "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý khi người dùng nhấp vào một lựa chọn nhanh
  const handleQuickReply = async (payload: string) => {
    // Hiển thị lựa chọn của người dùng
    addMessage("user", payload)
    
    // Gửi payload đến Rasa
    setIsLoading(true)
    try {
      const botResponses = await ChatbotService.sendMessage(payload, sessionId)
      
      // Thêm từng tin nhắn từ bot vào danh sách tin nhắn
      botResponses.forEach(response => {
        addMessage(response.sender, response.message)
      })
    } catch (error) {
      console.error("Error getting chatbot response:", error)
      addMessage("bot", "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Hàm để hiển thị tin nhắn với định dạng
  const renderMessage = (message: string) => {
    // Tách tin nhắn thành các phần: văn bản thông thường và các lựa chọn nhanh
    if (message.includes("Các lựa chọn:")) {
      const parts = message.split("Các lựa chọn:");
      const mainText = parts[0];
      const options = parts[1]
        .split("\n")
        .filter(line => line.trim().startsWith("-"))
        .map(line => line.trim().substring(2));

      return (
        <>
          <div>{mainText}</div>
          {options.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm hover:bg-teal-200 transition-colors"
                  onClick={() => handleQuickReply(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </>
      );
    }

    // Xử lý hiển thị hình ảnh nếu có
    if (message.includes("[Hình ảnh:")) {
      const parts = message.split("[Hình ảnh:");
      const mainText = parts[0];
      const imageUrl = parts[1].split("]")[0].trim();

      return (
        <>
          <div>{mainText}</div>
          <img src={imageUrl} alt="Bot image" className="mt-2 max-w-full rounded-md" />
        </>
      );
    }

    // Trả về tin nhắn thông thường
    return message;
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={toggleChatbot} className="h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg">
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>

      {/* Chatbot container */}
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border">
          {/* Header */}
          <div className="bg-teal-600 text-white p-3 flex items-center justify-between">
            <h3 className="font-bold text-sm">Mi chat</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-white hover:bg-teal-700"
              onClick={toggleChatbot}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages container */}
          <div
            ref={messageContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg max-w-[80%] break-words",
                  msg.sender === "user" ? "bg-teal-600 text-white self-end" : "bg-gray-200 text-gray-800 self-start",
                )}
              >
                {renderMessage(msg.message)}
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-200 text-gray-800 self-start p-3 rounded-lg">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Soạn tin nhắn..."
                className="min-h-[44px] max-h-[120px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 rounded-full shrink-0 bg-teal-600 hover:bg-teal-700"
                disabled={isLoading || inputMessage.trim() === ""}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
