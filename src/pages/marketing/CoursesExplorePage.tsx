import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, BookOpen, Users, Sparkles, X } from 'lucide-react'
import { CourseCard } from '@/components/course/CourseCard'
import { Input } from '@/components/ui/Input'
import { Button, buttonClasses } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { allCourses } from '@/data/mockData'
import type { TeachingFormat } from '@/types'

const CATEGORIES = ['All Categories', 'Programming & CS', 'Mathematics', 'Languages']

export function CoursesExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedFormat, setSelectedFormat] = useState<TeachingFormat | 'all'>('all')

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = course.title.toLowerCase().includes(q)
        const matchesSubtitle = course.subtitle.toLowerCase().includes(q)
        const matchesSubject = course.subject.toLowerCase().includes(q)
        if (!matchesTitle && !matchesSubtitle && !matchesSubject) return false
      }

      if (selectedCategory !== 'All Categories' && course.category !== selectedCategory) {
        return false
      }

      if (selectedFormat !== 'all' && course.format !== selectedFormat) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedCategory, selectedFormat])

  function resetFilters() {
    setSearchQuery('')
    setSelectedCategory('All Categories')
    setSelectedFormat('all')
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-label font-bold uppercase tracking-wider text-accent-hover mb-1">
              <BookOpen size={14} />
              Structured Learning Programmes
            </div>
            <h1 className="text-h1">Explore Cohort & Mentor Courses</h1>
            <p className="mt-1 max-w-2xl text-body text-ink-secondary">
              Learn in structured multi-week programmes led by expert practitioners. Live sessions,
              weekly problem sets, interactive peer cohorts, and direct 1-on-1 mentor guidance.
            </p>
          </div>

          <Link to="/tutors" className={buttonClasses('secondary', 'md')}>
            <Users size={16} />
            Find 1-on-1 Tutors Instead
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <Input
              type="text"
              placeholder="Search courses by topic (e.g. DSA, Python, Calculus, Deep Learning, IELTS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-slate-200 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as TeachingFormat | 'all')}
              aria-label="Filter courses by format"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:border-primary focus:outline-none"
            >
              <option value="all">All Formats</option>
              <option value="online">Online Live Cohorts</option>
              <option value="group">Collaborative Group</option>
              <option value="hybrid">Hybrid (Seminar + Online)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}

          {(searchQuery || selectedCategory !== 'All Categories' || selectedFormat !== 'all') && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-small font-medium text-ink-secondary hover:text-primary transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Course List */}
      <div>
        <p className="mb-4 text-small font-medium text-ink-secondary">
          Showing <span className="font-semibold text-ink">{filteredCourses.length}</span> structured programmes
        </p>

        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No courses match your filter"
            description="Try choosing a different category or clearing your search term."
            action={
              <Button size="sm" onClick={resetFilters}>
                Clear filters
              </Button>
            }
          />
        )}
      </div>

      {/* Cohort vs 1-on-1 explainer */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-h3">Cohort Learning</h3>
              <p className="text-small text-ink-secondary">Structured syllabi & peer discussions</p>
            </div>
          </div>
          <p className="mt-3 text-small text-ink-secondary leading-relaxed">
            Follow a curated path from start to finish with fixed schedules, shared milestones, and collaborative code or essay reviews. Best for comprehensive curriculum mastery.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-light text-accent-hover">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-h3">1-on-1 Mentorship</h3>
              <p className="text-small text-ink-secondary">Tailored pacing & personalized feedback</p>
            </div>
          </div>
          <p className="mt-3 text-small text-ink-secondary leading-relaxed">
            Need customized attention on a specific exam topic or urgent project? Book private sessions with any tutor online or in-person at your convenience.
          </p>
        </div>
      </div>
    </div>
  )
}
