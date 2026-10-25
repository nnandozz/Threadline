import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookMarked,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  Compass,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonClasses } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { getUserVocabulary, saveUserVocabulary } from '@/lib/userDataStore'
import type { VocabularyWord, MasteryState } from '@/types'

export function VocabularyPage() {
  const { user } = useAuth()
  const studentId = user?.id || ''
  const [words, setWords] = useState<VocabularyWord[]>([])
  const [filter, setFilter] = useState<MasteryState | 'all'>('all')
  const [practiceMode, setPracticeMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!studentId) return
    const load = () => setWords(getUserVocabulary(studentId))
    load()
    window.addEventListener('threadline_user_data_updated', load)
    return () => window.removeEventListener('threadline_user_data_updated', load)
  }, [studentId])

  const filteredWords = words.filter((w) => filter === 'all' || w.mastery === filter)

  function updateMastery(id: string, newMastery: MasteryState) {
    const word = words.find((w) => w.id === id)
    if (word) {
      const updated = { ...word, mastery: newMastery }
      saveUserVocabulary(updated, studentId)
      setWords(getUserVocabulary(studentId))
    }
  }

  const currentWord = filteredWords[currentIndex] || filteredWords[0]

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <BookMarked size={13} />
            <span>Vocabulary Continuity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Active Vocabulary & Concept Bank
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Words and technical terminology extracted from your lessons. Practice with spaced repetition.
          </p>
        </div>

        {words.length > 0 && (
          <Button
            size="md"
            variant={practiceMode ? 'secondary' : 'primary'}
            onClick={() => {
              setPracticeMode(!practiceMode)
              setFlipped(false)
              setCurrentIndex(0)
            }}
          >
            {practiceMode ? 'Exit Practice' : 'Flashcard Practice Mode'}
          </Button>
        )}
      </div>

      {words.length > 0 ? (
        <>
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'mastered', 'learning', 'new'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setFilter(s)
                    setCurrentIndex(0)
                    setFlipped(false)
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    filter === s
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {s} ({s === 'all' ? words.length : words.filter((w) => w.mastery === s).length})
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">{filteredWords.length}</span> terms
            </span>
          </div>

          {/* Interactive Flashcard Practice Mode */}
          {practiceMode ? (
            <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-6">
              {currentWord ? (
                <div className="flex w-full flex-col items-center gap-6">
                  {/* Card Face */}
                  <div
                    onClick={() => setFlipped(!flipped)}
                    className="flex min-h-[260px] w-full cursor-pointer flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-8 text-center shadow-xs transition-all hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Card {currentIndex + 1} of {filteredWords.length}</span>
                      <Badge tone={currentWord.mastery === 'mastered' ? 'success' : 'accent'}>
                        {currentWord.mastery}
                      </Badge>
                    </div>

                    <div className="my-auto py-6">
                      {!flipped ? (
                        <div>
                          <h2 className="text-3xl font-bold text-slate-900">{currentWord.word}</h2>
                          <p className="mt-3 text-xs text-slate-400">Click anywhere to flip</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <p className="text-base font-medium text-slate-800">{currentWord.definition}</p>
                          <p className="text-xs italic text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            "{currentWord.exampleSentence}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                      <RotateCw size={13} />
                      <span>{flipped ? 'Showing Definition' : 'Showing Term'}</span>
                    </div>
                  </div>

                  {/* Navigation & Mastery Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={currentIndex === 0}
                      onClick={() => {
                        setCurrentIndex((i) => Math.max(0, i - 1))
                        setFlipped(false)
                      }}
                    >
                      <ArrowLeft size={15} />
                      Previous
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateMastery(currentWord.id, 'learning')}
                    >
                      Needs Practice
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateMastery(currentWord.id, 'mastered')}
                    >
                      Mastered
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={currentIndex >= filteredWords.length - 1}
                      onClick={() => {
                        setCurrentIndex((i) => Math.min(filteredWords.length - 1, i + 1))
                        setFlipped(false)
                      }}
                    >
                      Next
                      <ArrowRight size={15} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">No terms match this filter.</div>
              )}
            </div>
          ) : (
            /* Grid of Word Cards */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWords.map((w) => (
                <Card key={w.id} className="flex flex-col justify-between gap-3 p-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">{w.word}</h3>
                      <Badge tone={w.mastery === 'mastered' ? 'success' : w.mastery === 'learning' ? 'accent' : 'neutral'}>
                        {w.mastery}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">{w.definition}</p>
                    <p className="rounded-lg bg-slate-50/80 p-2 text-xs italic text-slate-500 border border-slate-100">
                      "{w.exampleSentence}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-slate-400">Added {w.dateAdded}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateMastery(w.id, 'learning')}
                        className="text-slate-500 hover:text-teal-700 font-medium"
                      >
                        Learning
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() => updateMastery(w.id, 'mastered')}
                        className="text-slate-500 hover:text-emerald-700 font-medium"
                      >
                        Mastered
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Clean Empty State for New Account */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
            <BookMarked size={22} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Your vocabulary bank is empty</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            As you attend tutoring lessons, newly acquired vocabulary, formulas, and technical terminology
            will automatically be saved here for spaced-repetition flashcard practice.
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
