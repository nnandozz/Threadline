import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  Compass,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonClasses } from '@/components/ui/Button'
import { allTutors } from '@/data/mockData'
import { useAuth } from '@/context/AuthContext'
import { getUserHomework, toggleHomeworkCompleted } from '@/lib/userDataStore'
import { formatShortDate } from '@/lib/utils'
import type { HomeworkItem } from '@/types'

export function HomeworkPage() {
  const { user } = useAuth()
  const studentId = user?.id || ''
  const [items, setItems] = useState<HomeworkItem[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [selectedItem, setSelectedItem] = useState<HomeworkItem | null>(null)
  const [submissionText, setSubmissionText] = useState('')
  const [submittedFeedback, setSubmittedFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!studentId) return
    setItems(getUserHomework(studentId))
  }, [studentId])

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.completed
    if (filter === 'completed') return item.completed
    return true
  })

  const completedCount = items.filter((i) => i.completed).length

  function handleToggleComplete(id: string) {
    toggleHomeworkCompleted(id, studentId)
    setItems(getUserHomework(studentId))
  }

  function handlePracticeSubmit() {
    if (!submissionText.trim()) return
    setSubmittedFeedback('Submission recorded! Your tutor will review this prior to your next session.')
    if (selectedItem) {
      handleToggleComplete(selectedItem.id)
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Homework & Practice Hub
        </h1>
        <p className="text-sm text-slate-500">
          Targeted tasks generated directly from your lessons to reinforce new concepts before your next session.
        </p>
      </div>

      {items.length > 0 ? (
        <>
          {/* Progress Metric Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Weekly Practice Momentum</p>
                <p className="text-xs text-slate-500">
                  {completedCount} of {items.length} tasks completed ({Math.round((completedCount / items.length) * 100)}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                All ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                Pending ({items.length - completedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          {/* Homework List & Practice Modal/Panel */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Tasks List (7 cols) */}
            <div className="flex flex-col gap-3 lg:col-span-7">
              {filteredItems.map((item) => {
                const tutor = allTutors.find((t) => t.id === item.tutorId)

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all ${
                      item.completed ? 'opacity-70 bg-slate-50/50' : 'hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(item.id)}
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                            item.completed
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 hover:border-primary'
                          }`}
                          aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {item.completed && <CheckCircle2 size={14} />}
                        </button>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                            <Badge tone={item.type === 'speaking' ? 'accent' : 'neutral'}>
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {item.durationMinutes} min
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Due {formatShortDate(item.dueDate)}
                            </span>
                            {tutor && (
                              <>
                                <span>·</span>
                                <span>Assigned by {tutor.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={selectedItem?.id === item.id ? 'primary' : 'secondary'}
                        onClick={() => {
                          setSelectedItem(item)
                          setSubmittedFeedback(null)
                          setSubmissionText('')
                        }}
                      >
                        Practice
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Practice Workstation Panel (5 cols) */}
            <div className="lg:col-span-5">
              <Card className="sticky top-20 p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <h3 className="text-sm font-semibold text-slate-900">Practice Workstation</h3>
                  </div>
                  {selectedItem && (
                    <Badge tone="accent">{selectedItem.type}</Badge>
                  )}
                </div>

                {selectedItem ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{selectedItem.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{selectedItem.description}</p>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Your Practice Response or Notes:
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Type your response, reflection, or paste code here..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none"
                      />
                    </div>

                    {submittedFeedback ? (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800">
                        {submittedFeedback}
                      </div>
                    ) : (
                      <Button
                        size="md"
                        variant="primary"
                        onClick={handlePracticeSubmit}
                        disabled={!submissionText.trim()}
                        className="w-full mt-1"
                      >
                        Submit Response for Tutor
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Select a homework task on the left to start your practice session.
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      ) : (
        /* Clean Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
            <CheckCircle2 size={22} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No homework assigned yet</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            When you complete lessons, your tutors assign targeted homework, writing prompts, or problem sets designed to reinforce diagnosed gaps.
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
