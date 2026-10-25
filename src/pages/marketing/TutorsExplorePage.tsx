import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Bookmark, Sparkles, BookOpen } from 'lucide-react'
import { TutorCard } from '@/components/tutor/TutorCard'
import { Input } from '@/components/ui/Input'
import { Button, buttonClasses } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { getSavedTutorIds, useCatalog } from '@/lib/marketplaceStore'
import { formatINR } from '@/lib/utils'
import type { TeachingFormat } from '@/types'

const CATEGORIES = [
  'All Subjects',
  'Programming & CS',
  'Mathematics',
  'Languages',
  'Science',
  'Business',
  'Music & Arts',
  'Competitive Exams',
]

const FORMAT_OPTIONS: { label: string; value: TeachingFormat | 'all' }[] = [
  { label: 'All Formats', value: 'all' },
  { label: 'Online Video', value: 'online' },
  { label: 'In-Person (Tutor’s Studio)', value: 'in-person-tutor' },
  { label: 'In-Person (Your Home)', value: 'in-person-student' },
  { label: 'Hybrid', value: 'hybrid' },
]

export function TutorsExplorePage() {
  const { tutors } = useCatalog()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Subjects')
  const [selectedFormat, setSelectedFormat] = useState<TeachingFormat | 'all'>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [maxPrice, setMaxPrice] = useState<number>(2500)
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price-asc' | 'price-desc'>('recommended')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    setSavedIds(getSavedTutorIds())
    const handleUpdate = () => setSavedIds(getSavedTutorIds())
    window.addEventListener('threadline_store_updated', handleUpdate)
    return () => window.removeEventListener('threadline_store_updated', handleUpdate)
  }, [])

  // Filter tutors
  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      // Saved only filter
      if (showSavedOnly && !savedIds.includes(tutor.id)) {
        return false
      }

      // Text query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = tutor.name.toLowerCase().includes(q)
        const matchesHeadline = tutor.headline.toLowerCase().includes(q)
        const matchesBio = tutor.bio.toLowerCase().includes(q)
        const matchesSpecialties = tutor.specialties.some((s) => s.toLowerCase().includes(q))
        const matchesSubjects = tutor.subjectCategories.some((cat) => cat.toLowerCase().includes(q))
        const matchesLocation = tutor.location?.city.toLowerCase().includes(q) || tutor.location?.area.toLowerCase().includes(q)

        if (!matchesName && !matchesHeadline && !matchesBio && !matchesSpecialties && !matchesSubjects && !matchesLocation) {
          return false
        }
      }

      // Category match
      if (selectedCategory !== 'All Subjects') {
        const matchesCategory = tutor.subjectCategories.includes(selectedCategory)
        if (!matchesCategory) return false
      }

      // Format match
      if (selectedFormat !== 'all') {
        const matchesFormat = tutor.formats.includes(selectedFormat)
        if (!matchesFormat) return false
      }

      // City match (only applies if in-person is involved or tutor is based there)
      if (selectedCity !== 'all') {
        if (!tutor.location || tutor.location.city !== selectedCity) {
          return false
        }
      }

      // Price filter
      if (tutor.pricePerHour > maxPrice) {
        return false
      }

      // Rating filter
      if (tutor.rating < minRating) {
        return false
      }

      return true
    })
  }, [tutors, searchQuery, selectedCategory, selectedFormat, selectedCity, maxPrice, minRating, showSavedOnly, savedIds])

  // Sort tutors
  const sortedTutors = useMemo(() => {
    const list = [...filteredTutors]
    switch (sortBy) {
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      case 'price-asc':
        return list.sort((a, b) => a.pricePerHour - b.pricePerHour)
      case 'price-desc':
        return list.sort((a, b) => b.pricePerHour - a.pricePerHour)
      case 'recommended':
      default:
        // Rank by combination of rating, review count, and badge count
        return list.sort((a, b) => (b.rating * 10 + b.reviewCount * 0.1) - (a.rating * 10 + a.reviewCount * 0.1))
    }
  }, [filteredTutors, sortBy])

  function resetFilters() {
    setSearchQuery('')
    setSelectedCategory('All Subjects')
    setSelectedFormat('all')
    setSelectedCity('all')
    setMaxPrice(2500)
    setMinRating(0)
    setShowSavedOnly(false)
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All Subjects' ||
    selectedFormat !== 'all' ||
    selectedCity !== 'all' ||
    maxPrice < 2500 ||
    minRating > 0 ||
    showSavedOnly

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      {/* Page Title & Mission */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-h1">Find the Right Tutor</h1>
            <p className="mt-1 text-body text-ink-secondary">
              Discover verified mentors for school, university, programming, languages, and exams.
              Learn online or in-person at your chosen location.
            </p>
          </div>

          <Link to="/courses" className={buttonClasses('secondary', 'md')}>
            <BookOpen size={16} />
            Browse Structured Courses
          </Link>
        </div>
      </div>

      {/* Search Bar & Primary Controls */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <Input
              type="text"
              placeholder="Search by subject, skill (e.g. Python, Calculus, IELTS, Piano), or tutor name..."
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Format Dropdown */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as TeachingFormat | 'all')}
              aria-label="Filter by teaching format"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:border-primary focus:outline-none"
            >
              {FORMAT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* Location / City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Filter by location city"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 focus:border-primary focus:outline-none"
            >
              <option value="all">Any Location</option>
              <option value="Delhi NCR">Delhi NCR (South Delhi, Gurugram, Noida)</option>
              <option value="Mumbai">Mumbai (Bandra, Andheri, South Mumbai)</option>
              <option value="Bengaluru">Bengaluru (Koramangala, HSR, Indiranagar)</option>
              <option value="Pune">Pune (Kothrud, Viman Nagar, Hinjewadi)</option>
              <option value="Chennai">Chennai (Adyar, Anna Nagar, T. Nagar)</option>
              <option value="Chandigarh">Chandigarh (Sector 17, Mohali, Panchkula)</option>
              <option value="Gurugram">Gurugram (Cyber City, Golf Course Rd)</option>
            </select>

            {/* Saved Tutors Toggle */}
            <button
              type="button"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${
                showSavedOnly
                  ? 'border-indigo-200 bg-indigo-50 text-primary'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Bookmark size={14} className={showSavedOnly ? 'fill-primary' : ''} />
              Saved ({savedIds.length})
            </button>
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
        </div>

        {/* Secondary Filter Bar: Price, Rating, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-small">
          <div className="flex flex-wrap items-center gap-6">
            {/* Max price filter */}
            <div className="flex items-center gap-2">
              <span className="text-ink-secondary">Max Rate:</span>
              <span className="font-semibold text-ink">{formatINR(maxPrice)}/hr</span>
              <input
                type="range"
                min="300"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum hourly price"
                className="h-1.5 w-24 accent-primary cursor-pointer"
              />
            </div>

            {/* Min Rating */}
            <div className="flex items-center gap-2">
              <span className="text-ink-secondary">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                aria-label="Minimum rating"
                className="h-8 rounded border border-border bg-white px-2 text-small text-ink focus:outline-none"
              >
                <option value={0}>All Ratings</option>
                <option value={4.7}>4.7+ ★</option>
                <option value={4.9}>4.9+ ★</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-small font-medium text-ink-secondary hover:text-primary transition-colors"
              >
                Reset filters
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <span className="text-ink-secondary">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recommended' | 'rating' | 'price-asc' | 'price-desc')}
                aria-label="Sort tutors by"
                className="h-8 rounded border border-border bg-white px-2 text-small font-medium text-ink focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-small font-medium text-ink-secondary">
          Showing <span className="font-semibold text-ink">{sortedTutors.length}</span> educators
          {selectedCategory !== 'All Subjects' && ` in ${selectedCategory}`}
          {selectedFormat !== 'all' && ` · ${selectedFormat}`}
        </p>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Marketplace Discovery · Curated Mentor Directory</span>
        </div>
      </div>

      {/* Tutors Grid */}
      {sortedTutors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {sortedTutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tutors found matching your criteria"
          description="Try broadening your subject filter, raising your maximum hourly rate, or removing format restrictions."
          action={
            <Button size="sm" onClick={resetFilters}>
              Clear All Filters
            </Button>
          }
        />
      )}

      {/* Bottom Educational Callout */}
      <section className="rounded-2xl border border-primary/20 bg-primary-light/40 p-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 text-label font-bold uppercase tracking-wider text-primary">
              <Sparkles size={14} />
              AI Learning Continuity
            </div>
            <h2 className="text-h2 text-ink">Learn with any tutor. Your progress stays with you.</h2>
            <p className="text-body text-ink-secondary">
              Threadline keeps track of the concepts you've mastered, misconceptions you're working through, and
              vocabulary you've acquired—so you never have to start from zero when switching tutors or learning a new topic.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link to="/courses" className={buttonClasses('primary', 'lg')}>
              Explore Structured Courses
            </Link>
            <p className="text-small text-ink-secondary">Live cohorts with dedicated mentor feedback</p>
          </div>
        </div>
      </section>
    </div>
  )
}
