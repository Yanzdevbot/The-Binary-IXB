"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { getGitHubFile, updateGitHubFile } from "../lib/github"

function Chat() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const [userIp, setUserIp] = useState("")
  const [messageCount, setMessageCount] = useState(0)
  const [isSending, setIsSending] = useState(false) // State untuk menunjukkan pengiriman pesan

  const messagesEndRef = useRef(null)

  const CHATS_FILE_PATH = "data/chats.json"
  const BLOCKED_IPS_FILE_PATH = "data/blocked_ips.json"

  const fetchBlockedIPs = async () => {
    try {
      const { content } = await getGitHubFile(BLOCKED_IPS_FILE_PATH)
      const blockedIPsData = JSON.parse(content)
      return blockedIPsData.map((item) => item.ipAddress)
    } catch (error) {
      console.error("Gagal mengambil daftar IP yang diblokir dari GitHub:", error)
      return []
    }
  }

  const fetchMessages = async () => {
    console.log("Fetching chat messages...")
    try {
      const { content } = await getGitHubFile(CHATS_FILE_PATH)
      const parsedMessages = JSON.parse(content)
      setMessages(parsedMessages)
      if (shouldScrollToBottom) {
        scrollToBottom()
      }
      console.log("Chat messages fetched successfully:", parsedMessages.length, "messages.")
    } catch (error) {
      console.error("Gagal mengambil pesan dari GitHub:", error)
      setMessages([]) // Ensure messages is an empty array on error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load messages. Please check your internet connection or GitHub token.",
        customClass: {
          container: "sweet-alert-container",
        },
      })
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [shouldScrollToBottom])

  useEffect(() => {
    getUserIp()
    checkMessageCount()
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
    }, 100)
  }

  const getUserIp = async () => {
    try {
      const cachedIp = localStorage.getItem("userIp")
      const ipExpiration = localStorage.getItem("ipExpiration")

      if (cachedIp && ipExpiration && new Date().getTime() < Number(ipExpiration)) {
        setUserIp(cachedIp)
        return
      }
      const response = await axios.get("https://ipapi.co/json")
      const newUserIp = response.data.network
      setUserIp(newUserIp)
      // Store IP for 1 hour
      const expirationTime = new Date().getTime() + 60 * 60 * 1000
      localStorage.setItem("userIp", newUserIp)
      localStorage.setItem("ipExpiration", expirationTime.toString())
    } catch (error) {
      console.error("Gagal mendapatkan alamat IP:", error)
      Swal.fire({
        icon: "warning",
        title: "IP Address Error",
        text: "Could not get your IP address. Some features might be limited.",
        customClass: {
          container: "sweet-alert-container",
        },
      })
    }
  }

  const checkMessageCount = () => {
    const userIpAddress = userIp
    const currentDate = new Date()
    const currentDateString = currentDate.toDateString()
    const storedDateString = localStorage.getItem("messageCountDate")

    if (currentDateString === storedDateString) {
      const userSentMessageCount = Number.parseInt(localStorage.getItem(userIpAddress)) || 0
      if (userSentMessageCount >= 20) {
        Swal.fire({
          icon: "error",
          title: "Message limit exceeded",
          text: "You have reached your daily message limit.",
          customClass: {
            container: "sweet-alert-container",
          },
        })
      } else {
        setMessageCount(userSentMessageCount)
      }
    } else {
      localStorage.removeItem(userIpAddress)
      localStorage.setItem("messageCountDate", currentDateString)
      setMessageCount(0) // Reset count for new day
    }
  }

  const isIpBlocked = async () => {
    const blockedIPs = await fetchBlockedIPs()
    return blockedIPs.includes(userIp)
  }

  const sendMessage = async () => {
    if (message.trim() === "" || isSending) {
      return // Jangan kirim pesan kosong atau jika sedang dalam proses pengiriman
    }

    setIsSending(true) // Set status pengiriman menjadi true

    const isBlocked = await isIpBlocked()

    if (isBlocked) {
      Swal.fire({
        icon: "error",
        title: "Blocked",
        text: "You are blocked from sending messages.",
        customClass: {
          container: "sweet-alert-container",
        },
      })
      setIsSending(false) // Reset status pengiriman
      return
    }

    const trimmedMessage = message.trim().substring(0, 60)
    const userIpAddress = userIp

    if (messageCount >= 20) {
      Swal.fire({
        icon: "error",
        title: "Message limit exceeded",
        text: "You have reached your daily message limit.",
        customClass: {
          container: "sweet-alert-container",
        },
      })
      setIsSending(false) // Reset status pengiriman
      return
    }

    try {
      console.log("Attempting to send message...")
      // Fetch current messages and SHA
      const { content: currentContent, sha: currentSha } = await getGitHubFile(CHATS_FILE_PATH)
      const currentMessages = JSON.parse(currentContent)

      const newMessage = {
        message: trimmedMessage,
        sender: {
          image: "/AnonimUser.png", // Default anonymous user image
        },
        timestamp: new Date().toISOString(), // Use ISO string for consistent date format
        userIp: userIp,
      }

      const updatedMessages = [...currentMessages, newMessage]

      await updateGitHubFile(
        CHATS_FILE_PATH,
        JSON.stringify(updatedMessages, null, 2),
        currentSha, // Pastikan SHA dikirim untuk update
        `Add new chat message from ${userIpAddress}`,
      )

      const updatedSentMessageCount = messageCount + 1
      localStorage.setItem(userIpAddress, updatedSentMessageCount.toString())
      setMessageCount(updatedSentMessageCount)

      setMessage("")
      // Re-fetch messages to update UI after successful send
      await fetchMessages()
      setTimeout(() => {
        setShouldScrollToBottom(true)
      }, 100)
      console.log("Message sent successfully!")
    } catch (error) {
      console.error("Error sending message to GitHub:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to send message. Please try again. Details: ${error.message}`, // Tampilkan detail error
        customClass: {
          container: "sweet-alert-container",
        },
      })
    } finally {
      setIsSending(false) // Reset status pengiriman setelah selesai (berhasil atau gagal)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="" id="ChatAnonim">
      <div className="text-center text-4xl font-semibold" id="Glow">
        Text Anonim
      </div>

      <div className="mt-5" id="KotakPesan" style={{ overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start text-sm py-[1%]">
            <img src={msg.sender.image || "/placeholder.svg"} alt="User Profile" className="h-7 w-7 mr-2 " />
            <div className="relative top-[0.30rem]">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div id="InputChat" className="flex items-center mt-5">
        <input
          className="bg-transparent flex-grow pr-4 w-4 placeholder:text-white placeholder:opacity-60"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isSending ? "Sending..." : "Ketik pesan Anda..."} // Tampilkan status pengiriman
          maxLength={60}
          disabled={isSending} // Nonaktifkan input saat mengirim
        />
        <button onClick={sendMessage} className="ml-2" disabled={isSending}>
          <img src="/paper-plane.png" alt="" className="h-4 w-4 lg:h-6 lg:w-6" />
        </button>
      </div>
    </div>
  )
}

export default Chat
