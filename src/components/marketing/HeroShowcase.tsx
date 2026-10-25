import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Star, Calendar, Sparkles, MapPin, Video, Home } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { drArvindSen as arvindSen } from '@/data/mockData'
import { formatINR } from '@/lib/utils'
import type { TeachingFormat } from '@/types'

export function HeroShowcase() {
  const [activeFormat, setActiveFormat] = useState<TeachingFormat>('online')

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background soft ambient card */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-100 to-teal-50 opacity-70 blur-lg" />

      {/* Main Showcase Container */}
      <div className="relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg shadow-slate-900/5">
        {/* Top Format Switcher Demo */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Sparkles size={13} className="text-primary" />
            <span>Learning Format Demo</span>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-slate-100/90 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveFormat('online')}
              className={`rounded-md px-2 py-0.5 font-medium transition-all ${
                activeFormat === 'online'
                  ? 'bg-white text-primary shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Online
            </button>
            <button
              type="button"
              onClick={() => setActiveFormat('in-person-tutor')}
              className={`rounded-md px-2 py-0.5 font-medium transition-all ${
                activeFormat === 'in-person-tutor'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveFormat('in-person-student')}
              className={`rounded-md px-2 py-0.5 font-medium transition-all ${
                activeFormat === 'in-person-student'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In-Home
            </button>
          </div>
        </div>

        {/* Featured Tutor Profile Snapshot */}
        <div className="flex items-start gap-3.5">
          <Avatar
            src={arvindSen.avatarUrl}
            name={arvindSen.name}
            size="md"
            className="h-12 w-12 rounded-full ring-2 ring-indigo-50"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-900">{arvindSen.name}</span>
              <CheckCircle2 size={14} className="fill-indigo-50 text-primary" />
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{arvindSen.headline}</p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-800">{arvindSen.rating}</span>
                <span className="text-slate-400">({arvindSen.reviewCount})</span>
              </div>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{arvindSen.yearsExperience} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Dynamic Context Card based on active format */}
        <div className="mt-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
          {activeFormat === 'online' && (
            <div className="flex items-start gap-2 text-slate-600">
              <Video size={14} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-900">HD Online Classroom:</span> Live 1-on-1 audio/video with shared code scratchpad and consensual AI transcript.
              </div>
            </div>
          )}
          {activeFormat === 'in-person-tutor' && (
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-900">Dr. Sen's Studio:</span> TechHive Learning Studio, Koramangala 5th Block, Bengaluru. High-speed fiber & computational lab setup.
              </div>
            </div>
          )}
          {activeFormat === 'in-person-student' && (
            <div className="flex items-start gap-2 text-slate-600">
              <Home size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-900">In-Home Tutoring:</span> Tutor travels up to 12km across Bengaluru directly to your residence or library.
              </div>
            </div>
          )}
        </div>

        {/* AI Learning Memory Snippet */}
        <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-900">
            <span className="flex items-center gap-1">
              <Sparkles size={11} className="text-primary" />
              AI Learning Memory · Lesson #4 Brief
            </span>
            <span className="text-emerald-700 font-medium">+14% Retention</span>
          </div>
          <p className="mt-1 text-xs text-indigo-950/80 leading-relaxed">
            "Mastered: Dynamic programming recurrence relations. Next focus: Graph cycle detection."
          </p>
        </div>

        {/* CTA Footer */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-sm font-bold text-slate-900">{formatINR(arvindSen.pricePerHour)}</span>
            <span className="text-xs text-slate-500"> / hr</span>
          </div>
          <Link
            to={`/book/${arvindSen.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors"
          >
            <Calendar size={13} />
            Book with Dr. Sen
          </Link>
        </div>
      </div>
    </div>
  )
}
