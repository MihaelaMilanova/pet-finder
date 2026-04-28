import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Messages() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  useEffect(() => {
    fetchConversations().then(convs => {
      const receiverId = searchParams.get('to')
      if (receiverId) {
        const existing = convs?.find(c => c.user.id === parseInt(receiverId))
        if (existing) {
          openConversation(existing.user)
        } else {
  api.get(`/messages/user/${receiverId}`).then(res => {
    setActiveUser(res.data)
  })
  setMessages([])
}
      }
    })
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations')
      setConversations(res.data)
      return res.data
    } catch (err) {
      console.error(err)
    }
  }

  const openConversation = async (otherUser) => {
    setActiveUser(otherUser)
    try {
      const res = await api.get(`/messages/${otherUser.id}`)
      setMessages(res.data)
      fetchConversations()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeUser) return
    try {
      const res = await api.post('/messages', {
        receiverId: activeUser.id,
        content: newMessage
      })
      setMessages(prev => [...prev, res.data])
      setNewMessage('')
      fetchConversations()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex gap-4 h-[70vh]">
      <div className="w-72 bg-white rounded-xl shadow overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-700">Съобщения</h3>
        </div>
        {conversations.length === 0 ? (
          <p className="text-gray-400 text-sm p-4">Няма разговори</p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.user.id}
              onClick={() => openConversation(conv.user)}
              className={`p-4 cursor-pointer hover:bg-orange-50 transition border-b border-gray-50 ${
                activeUser?.id === conv.user.id ? 'bg-orange-50' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-700">{conv.user.name}</p>
                {conv.unread > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate mt-1">{conv.lastMessage.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex-1 bg-white rounded-xl shadow flex flex-col">
        {activeUser ? (
          <>
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-700">{activeUser.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.length === 0 && (
                <p className="text-gray-400 text-sm text-center mt-8">Започни разговора!</p>
              )}
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                    m.sender.id === user.id
                      ? 'bg-orange-500 text-white self-end'
                      : 'bg-gray-100 text-gray-700 self-start'
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Напиши съобщение..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Изпрати
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Избери разговор
          </div>
        )}
      </div>
    </div>
  )
}