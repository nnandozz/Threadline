import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, Bookmark, CheckCircle2, Calendar } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Button, buttonClasses } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { isTutorSaved, toggleSaveTutor } from '@/lib/marketplaceStore'
import { cn, formatINR } from '@/lib/utils'
import type { Tutor } from '@/types'

interface TutorCardProps {
  tutor: Tutor
  onView?: () => void
  className?: string
  showBookButton?: boolean
}

export function TutorCard({ tutor, onView, className, showBookButton = true }: TutorCardProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isTutorSaved(tutor.id))
    const handleUpdate = () => setSaved(isTutorSaved(tutor.id))
    window.addEventListener('threadline_store_updated', handleUpdate)
    return () => window.removeEventListener('threadline_store_updated', handleUpdate)
  }, [tutor.id])

  const hasInPerson = tutor.formats.some((f) => f === 'in-person-tutor' || f === 'in-person-student' || f === 'hybrid')

  return (
    <Card className={cn('group relative flex flex-col justify-between gap-4 p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200', className)}>
      <div className="flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <Link to={`/tutors/${tutor.id}`} className="shrink-0 relative">
              <Avatar
                src={tutor.avatarUrl}
                name={tutor.name}
                size="md"
                className="h-12 w-12 rounded-full ring-1 ring-slate-200/80 transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link to={`/tutors/${tutor.id}`} className="text-sm font-semibold text-slate-900 hover:text-primary transition-colors">
                  {tutor.name}
                </Link>
                {tutor.verificationStatus === 'verified' && (
                  <span title="Verified tutor credentials" className="text-primary" aria-label="Verified tutor">
                    <CheckCircle2 size={14} className="fill-indigo-50 text-primary" />
                  </span>
                )}
              </div>
              <p className="line-clamp-1 text-xs text-slate-500 font-normal mt-0.5">{tutor.headline}</p>

              <div className="mt-1 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-900">{tutor.rating}</span>
                  <span className="text-slate-400 font-normal">({tutor.reviewCount})</span>
                </div>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-normal">{tutor.yearsExperience} yrs exp</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              const newState = toggleSaveTutor(tutor.id)
              setSaved(newState)
            }}
            aria-label={saved ? 'Remove from saved tutors' : 'Save tutor'}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full transition-colors shrink-0',
              saved ? 'bg-indigo-50 text-primary' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            )}
          >
            <Bookmark size={15} className={cn(saved && 'fill-primary text-primary')} />
          </button>
        </div>

        {/* Formats badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {tutor.formats.map((format) => (
            <FormatBadge key={format} format={format} />
          ))}
        </div>

        {/* Location info if in-person supported */}
        {hasInPerson && tutor.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span className="line-clamp-1">
              {tutor.location.area}, {tutor.location.city}
              {tutor.location.travelRadiusKm ? ` · Travels up to ${tutor.location.travelRadiusKm}km` : ''}
            </span>
          </div>
        )}

        {/* Bio snippet */}
        <p className="line-clamp-2 text-xs text-slate-600 leading-relaxed">{tutor.bio}</p>

        {/* Specialties / Subject tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {tutor.specialties.slice(0, 3).map((s) => (
            <span key={s} className="rounded-md bg-slate-100/80 px-2 py-0.5 text-xs font-medium text-slate-600">
              {s}
            </span>
          ))}
          {tutor.specialties.length > 3 && (
            <span className="text-xs text-slate-400 self-center font-medium">+{tutor.specialties.length - 3}</span>
          )}
        </div>
      </div>

      {/* Footer row: pricing & actions */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
        <div>
          <span className="text-base font-bold text-slate-900">{formatINR(tutor.pricePerHour)}</span>
          <span className="text-xs font-normal text-slate-500"> / hr</span>
        </div>

        <div className="flex items-center gap-2">
          {onView ? (
            <Button size="sm" variant="secondary" onClick={onView}>
              Profile
            </Button>
          ) : (
            <Link to={`/tutors/${tutor.id}`} className={buttonClasses('secondary', 'sm')}>
              Profile
            </Link>
          )}

          {showBookButton && (
            <Link to={`/book/${tutor.id}`} className={buttonClasses('primary', 'sm')}>
              <Calendar size={13} />
              Book
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
