import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Send, MessageSquare, Compass } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button, buttonClasses } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { allTutors } from '@/data/mockData'
import { useAuth } from '@/context/AuthContext'
import { getBookings } from '@/lib/marketplaceStore'

interface Message {
  id: string
  sender: 'tutor' | 'student'
  text: string
  timestamp: string
}

interface Thread {
  tutorId: string
  unread: boolean
  lastMessage: string
  messages: Message[]
}

export function MessagesPage() {
  const { user } = useAuth()
  const studentId = user?.id || ''
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeTutorId, setActiveTutorId] = useState<string>('')
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    if (!studentId) return

    const raw = localStorage.getItem(`threadline_threads_${studentId}`)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Thread[]
        setThreads(parsed)
        if (parsed.length > 0) setActiveTutorId(parsed[0].tutorId)
        return
      } catch {
        // fallback
      }
    }

    // Initialize threads from user's actual bookings
    const userBookings = getBookings(studentId)
    const uniqueTutorIds = Array.from(new Set(userBookings.map((b) => b.tutorId)))

    if (uniqueTutorIds.length > 0) {
      const generatedThreads: Thread[] = uniqueTutorIds.map((tid) => {
        const tutor = allTutors.find((t) => t.id === tid)
        return {
          tutorId: tid,
          unread: false,
          lastMessage: `Confirmed booking for ${tutor?.specialties[0] || 'Lesson'}. Coordinate format details here.`,
          messages: [
            {
              id: `m-init-${tid}`,
              sender: 'tutor',
              text: `Hello ${user?.name || 'there'}! I received your booking. Please let me know if you have specific goals or topics you would like to prioritize.`,
              timestamp: 'Recently',
            },
          ],
        }
      })
      setThreads(generatedThreads)
      setActiveTutorId(generatedThreads[0].tutorId)
      localStorage.setItem(`threadline_threads_${studentId}`, JSON.stringify(generatedThreads))
    }
  }, [studentId, user?.name])

  const activeThread = threads.find((t) => t.tutorId === activeTutorId) || threads[0]
  const activeTutor = activeThread ? allTutors.find((t) => t.id === activeThread.tutorId) : null

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!inputText.trim() || !activeTutorId) return

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'student',
      text: inputText.trim(),
      timestamp: 'Just now',
    }

    const updated = threads.map((t) =>
      t.tutorId === activeTutorId
        ? {
            ...t,
            lastMessage: newMsg.text,
            messages: [...t.messages, newMsg],
          }
        : t,
    )

    setThreads(updated)
    if (studentId) {
      localStorage.setItem(`threadline_threads_${studentId}`, JSON.stringify(updated))
    }
    setInputText('')
  }

  return (
    <div className="flex h-[calc(100vh-9.5rem)] flex-col gap-4 pb-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Messages & Coordination</h1>
        <p className="mt-1 text-sm text-slate-500">
          Direct communication with your educators regarding lesson prep, studio directions, or learning follow-ups.
        </p>
      </div>

      {threads.length > 0 && activeTutor && activeThread ? (
        <div className="flex flex-1 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
          {/* Left: Threads List */}
          <div className="w-80 shrink-0 border-r border-slate-200/80 bg-slate-50/50 flex flex-col">
            <div className="border-b border-slate-200/80 px-4 py-3 bg-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Conversations ({threads.length})</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {threads.map((t) => {
                const tutor = allTutors.find((tut) => tut.id === t.tutorId)
                if (!tutor) return null
                const isActive = t.tutorId === activeTutorId

                return (
                  <button
                    key={t.tutorId}
                    type="button"
                    onClick={() => setActiveTutorId(t.tutorId)}
                    className={`flex w-full items-start gap-3 p-4 text-left transition-colors ${
                      isActive ? 'bg-white shadow-xs' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <Avatar src={tutor.avatarUrl} name={tutor.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-sm">{tutor.name}</span>
                        {t.unread && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
                      </div>
                      <p className="line-clamp-1 text-xs text-slate-500">{tutor.specialties[0]}</p>
                      <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-600">
                        {t.lastMessage}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Active Chat Window */}
          <div className="flex flex-1 flex-col justify-between bg-white">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-3.5">
              <div className="flex items-center gap-3">
                <Avatar src={activeTutor.avatarUrl} name={activeTutor.name} size="md" />
                <div>
                  <Link to={`/tutors/${activeTutor.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                    {activeTutor.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">{activeTutor.headline}</span>
                    <span className="text-slate-300">·</span>
                    <div className="flex gap-1">
                      {activeTutor.formats.map((f) => (
                        <FormatBadge key={f} format={f} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to={`/book/${activeTutor.id}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
              >
                Book New Slot
              </Link>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-slate-50/30">
              <div className="mx-auto rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-xs">
                Threadline Direct Tutor Communication
              </div>

              {activeThread.messages.map((m) => {
                const isMe = m.sender === 'student'
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col gap-1 max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? 'rounded-2xl rounded-br-xs bg-indigo-600 text-white'
                          : 'rounded-2xl rounded-bl-xs bg-white text-slate-800 border border-slate-200/80'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[11px] text-slate-400 px-1">{m.timestamp}</span>
                  </div>
                )
              })}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-200/80 p-4 flex gap-3 items-center bg-white">
              <input
                type="text"
                placeholder={`Message ${activeTutor.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
              />
              <Button size="md" type="submit" disabled={!inputText.trim()}>
                <Send size={15} />
                Send
              </Button>
            </form>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
            <MessageSquare size={22} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No active conversations</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            When you book a lesson or coordinate in-person studio details with a tutor, your messages will appear here.
          </p>
          <Link to="/tutors" className={buttonClasses('primary', 'sm', 'mt-4')}>
            <Compass size={14} />
            Find a Tutor
          </Link>
        </div>
      )}
    </div>
  )
}
