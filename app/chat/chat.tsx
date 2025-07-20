"use client"
 
import { useState, useRef, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Chat } from "@/components/ui/chat"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


// const MODELS = [
//   { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
//   { id: "deepseek-r1-distill-llama-70b", name: "Deepseek R1 70B" },
// ]

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type suggestions = string[]

type ChatDemoProps = {
  initialMessages?: Message[]
  containerClassName?: string
  containerStyle?: React.CSSProperties
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function ChatDemo(props: ChatDemoProps) {
  // const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [messages, setMessages] = useState<Message[]>(props.initialMessages || [])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [chatError, setChatError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<suggestions>([])
  const [isTyping, setIsTyping] = useState(false)

  // Get access token on client side
  useEffect(() => {
    setAccessToken(localStorage.getItem("access_token"))
  }, [])

  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken || ""}`,
  }), [accessToken])
  
  // Open chat on mount
  useEffect(() => {
    let ignore = false
    async function openChat() {
      if (!accessToken) return
      setChatError(null)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/chat/open`, { method: "POST" , headers})
        if (!res.ok) throw new Error("Failed to open chat")
        const data = await res.json()
        if (!ignore) setChatId(data.chat_id || data.id || data.chatId)
        setSuggestions(data.suggestions || [])
      } catch (err: any) {
        if (!ignore) setChatError("Failed to open chat session")
      }
    }
    openChat()
    return () => { ignore = true }
  }, [accessToken, headers])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e?: { preventDefault?: () => void }) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!chatId) return
    const trimmed = input.trim()
    if (!trimmed) return
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsTyping(true)
    await streamAssistantResponse([...messages, userMessage], chatId)
  }

  const streamAssistantResponse = async (allMessages: Message[], chat_id: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    let assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: "",
    }
    setMessages((prev) => [...prev, assistantMessage])
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/chat/${chat_id}/complete/stream`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          role: allMessages[allMessages.length - 1].role,
          content: allMessages[allMessages.length - 1].content,
        }),
        signal: abortController.signal,
      })
      if (!response.body) throw new Error("No response body")
      const reader = response.body.getReader()
      let done = false
      let fullText = ""
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const data = new TextDecoder().decode(value)
          console.log('data', data)
          
          // data format ---  list of these separted by \n\n data: {"role":"assistant","content":"You"}
          // clean the data to get the text
          const chunks = data.split("\n\n")
          for (const chunk of chunks) {
            // console.log('chunk', chunk)
            const text = chunk.split("data: ")[1]?.trim()
            if (text) {
              console.log('text', text)
              try {
                // load json from text
                const json = JSON.parse(text)
                if (json.role == "assistant") {
                  fullText += json.content
                }
              } catch (parseErr) {
                // Skip problematic parsing parts but continue processing
                console.error('Error parsing JSON:', parseErr, text)
                continue
              }
            }
            setMessages((prev) => {
              // Update the last assistant message
              const updated = [...prev]
              const lastIdx = updated.findIndex((m) => m.id === assistantMessage.id)
              if (lastIdx !== -1) {
                updated[lastIdx] = { ...assistantMessage, content: fullText }
              }
              return updated
            })
        }
      }
      }
    } catch (err: any) {
      console.error('Error receiving response:', err)
      setMessages((prev) => {
        // Update the last assistant message with error details, but keep partial content
        const updated = [...prev]
        const lastIdx = updated.findIndex((m) => m.id === assistantMessage.id)
        if (lastIdx !== -1) {
          // Show partial content and error message
          const prevContent = updated[lastIdx].content || ""
          updated[lastIdx] = {
            ...assistantMessage,
            content: `${prevContent}\n[Error receiving response: ${err?.message || err}]`,
          }
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      setIsTyping(false)
      abortControllerRef.current = null
    }
  }

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const append = (message: { role: "user"; content: string }) => {
    setInput(message.content)
  }

  // Transcribe function that calls the backend API
  const transcribeAudio = async (blob: Blob): Promise<string> => {
    // Create a form data object to send the audio file
    const formData = new FormData();
    formData.append('audio_file', blob, 'recording.wav');
    
    try {
      // Send the audio to the server for transcription
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/stt/transcribe`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${accessToken || ""}`,
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to transcribe audio');
      
      const data = await response.json();
      // Return the transcribed text from the response
      return data.text || ""; 
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return "Failed to transcribe audio. Please try again.";
    }
  };

  if (chatError) {
    return <div className="text-red-500">{chatError}</div>
  }
  if (!chatId) {
    return <div>Loading chat...</div>
  }

  return (
    <div 
      className={cn("flex flex-col", props.containerClassName)}
      style={{ height: "100%", ...props.containerStyle }}
    >
      {/* <div className={cn("flex", "justify-end", "mb-2")}>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
 
      <Chat
        className="grow flex flex-col"
        messages={messages}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
        stop={stop}
        append={append}
        setMessages={setMessages}
        suggestions={suggestions}
        isTyping={isTyping}
        transcribeAudio={transcribeAudio}
      />
    </div>
  )
}

export default function ChatPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <ChatDemo containerClassName="h-[500px]" />
    </div>
  )
}