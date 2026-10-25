import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { allTutors, lessons } from '@/data/mockData'

export function LiveLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()

  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [activeTab, setActiveTab] = useState<'scratchpad' | 'outline' | 'ai'>('scratchpad')
  const [scratchpadText, setScratchpadText] = useState(
    `// Threadline Live Workspace\n// Shared between Ananya Sharma & Rohan Mehta\n\n1. Reviewing past trips using Present Perfect:\n   - "I have visited Lisbon twice." (Correct)\n   - Common trap: Don't specify an exact past point with present perfect.\n   - Incorrect: "I have visited Lisbon last year."\n   - Correct: "I visited Lisbon last year." (Past Simple)\n\n2. Next: Let's construct 3 storytelling sentences about recent travels.`
  )
  const [agendaChecked, setAgendaChecked] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false,
  })
  const [aiConsentEnabled, setAiConsentEnabled] = useState(true)
  const [elapsedSeconds, setElapsedSeconds] = useState(1450)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const lesson = lessons.find((l) => l.id === lessonId) || lessons[4]
  const tutor = allTutors.find((t) => t.id === lesson.tutorId) || allTutors[0]

  const formatTimer = (total: number) => {
    const mins = Math.floor(total / 60)
    const secs = total % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const agendaItems = [
    'Greeting & quick conversational warmup',
    'Present perfect tense vs. past simple distinction',
    'Interactive role-play: Describing life experiences',
    'Wrap-up, new vocabulary reinforcement & homework assignment',
  ]

  function toggleAgenda(idx: number) {
    setAgendaChecked((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const { user } = useAuth()
  const studentName = user?.name || 'You'
  const studentAvatar = user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(studentName)}`

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-950 text-white overflow-hidden">
      {/* Top Session Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <span className="text-small font-bold uppercase tracking-wider text-slate-200">
            LIVE CLASSROOM
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-small font-medium text-slate-300">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-full bg-slate-800 px-3 py-1 font-mono text-small text-slate-300">
            {formatTimer(elapsedSeconds)}
          </div>
          <Badge tone="accent">Encrypted Channel</Badge>
        </div>
      </header>

      {/* Main Grid: Video Stream + Interactive Workspace */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-3">
        {/* Left Column (2 cols): Video Stage */}
        <div className="relative flex flex-col justify-between p-4 lg:col-span-2">
          {/* Video Frames */}
          <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
            {/* Tutor Video Box */}
            <div className="relative flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt={tutor.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1 text-small backdrop-blur-sm">
                <span className="font-semibold">{tutor.name}</span>
                <span className="text-label text-slate-300">(Tutor)</span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/50 px-2 py-0.5 text-label text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> HD 1080p
              </div>
            </div>

            {/* Student Video Box */}
            <div className="relative flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
              {cameraOn ? (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="You"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Avatar src={studentAvatar} name={studentName} size="lg" className="h-24 w-24 text-h1" />
                  <p className="text-small text-slate-400">Camera turned off</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1 text-small backdrop-blur-sm">
                <span className="font-semibold">{studentName}</span>
                {!micOn && <MicOff size={14} className="text-red-400" />}
              </div>
            </div>
          </div>

          {/* Bottom Floating Call Controls */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setMicOn(!micOn)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white hover:bg-red-500'
              }`}
              title={micOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              type="button"
              onClick={() => setCameraOn(!cameraOn)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                cameraOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white hover:bg-red-500'
              }`}
              title={cameraOn ? 'Turn camera off' : 'Turn camera on'}
            >
              {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                  navigator.mediaDevices.getDisplayMedia({ video: true }).catch(() => {})
                }
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              title="Share screen"
            >
              <Share2 size={20} />
            </button>

            <button
              type="button"
              onClick={() => navigate(`/lesson/${lesson.id}/summary`)}
              className="flex h-12 items-center gap-2 rounded-full bg-red-600 px-6 font-semibold text-white hover:bg-red-500 transition-colors shadow-lg"
            >
              <PhoneOff size={18} />
              End & Review AI Summary
            </button>
          </div>
        </div>

        {/* Right Column (1 col): Interactive Workspace */}
        <div className="flex flex-col border-l border-slate-800 bg-slate-900">
          {/* Workspace Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('scratchpad')}
              className={`flex-1 py-3 text-small font-semibold border-b-2 transition-colors ${
                activeTab === 'scratchpad'
                  ? 'border-primary text-white bg-slate-800/50'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Shared Notes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('outline')}
              className={`flex-1 py-3 text-small font-semibold border-b-2 transition-colors ${
                activeTab === 'outline'
                  ? 'border-primary text-white bg-slate-800/50'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Agenda
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 text-small font-semibold border-b-2 transition-colors ${
                activeTab === 'ai'
                  ? 'border-primary text-white bg-slate-800/50'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              AI Assistant
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'scratchpad' && (
              <div className="flex h-full flex-col gap-2">
                <span className="text-label text-slate-400">
                  Shared real-time scratchpad (both tutor & student can type):
                </span>
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  className="h-full flex-1 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-small text-slate-200 focus:border-primary focus:outline-none resize-none leading-relaxed"
                />
              </div>
            )}

            {activeTab === 'outline' && (
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-small font-bold text-slate-200">Today's Lesson Plan</h4>
                  <p className="text-label text-slate-400">Checked items are automatically documented in summary.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {agendaItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleAgenda(idx)}
                      className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-left transition-colors hover:bg-slate-800"
                    >
                      <div className="mt-0.5">
                        {agendaChecked[idx] ? (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        ) : (
                          <div className="h-4.5 w-4.5 rounded border border-slate-600" />
                        )}
                      </div>
                      <span className={`text-small ${agendaChecked[idx] ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-small font-bold text-primary-light">
                      <Sparkles size={16} />
                      AI Live Memory Note-Taker
                    </span>
                    <input
                      type="checkbox"
                      checked={aiConsentEnabled}
                      onChange={(e) => setAiConsentEnabled(e.target.checked)}
                      aria-label="Toggle consensual live AI summary"
                      className="accent-primary"
                    />
                  </div>
                  <p className="text-label text-slate-300">
                    Explicit consent active. Threadline transcribes session notes only with both participants' affirmative consent.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-small">
                    <p className="text-label uppercase tracking-wider text-slate-500 font-bold mb-1">Live Concept Tag</p>
                    <p className="text-slate-300 font-medium">Topic: Present Perfect vs. Past Simple</p>
                    <p className="mt-1 text-label text-slate-400">Captured at 18:32 · Confidence: 98%</p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-small">
                    <p className="text-label uppercase tracking-wider text-slate-500 font-bold mb-1">New Term Identified</p>
                    <p className="text-slate-300 font-medium">Word: "Itinerary" · Definition: Planned route of journey</p>
                    <p className="mt-1 text-label text-slate-400">Queued for post-session flashcard review</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
