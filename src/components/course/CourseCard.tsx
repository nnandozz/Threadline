import { Link } from 'react-router-dom'
import { Calendar, Clock, Users, Star, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { getTutorById, isCourseEnrolled } from '@/lib/marketplaceStore'
import { allTutors } from '@/data/mockData'
import { cn, formatINR } from '@/lib/utils'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
  className?: string
}

export function CourseCard({ course, className }: CourseCardProps) {
  const tutor = getTutorById(course.tutorId) ?? allTutors.find((t) => t.id === course.tutorId)
  const isEnrolled = isCourseEnrolled(course.id)
  const seatsLeft = Math.max(0, course.maxCapacity - course.enrolledCount)

  return (
    <Card className={cn('group flex flex-col justify-between overflow-hidden p-0 border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all duration-200', className)}>
      <div>
        {/* Course cover header */}
        <div className="relative h-40 w-full overflow-hidden bg-slate-900">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-85"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-800 text-white font-semibold text-base">
              {course.subject}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Badges on top */}
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
            <FormatBadge format={course.format} />
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700 backdrop-blur-xs">
              {course.category}
            </span>
          </div>

          {/* Seats left indicator */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1 font-medium text-slate-200">
              <Users size={13} />
              {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Cohort full'}
            </span>
            <div className="flex items-center gap-1 font-medium">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{course.rating}</span>
              <span className="text-slate-300 font-normal">({course.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="flex flex-col gap-2.5 p-4.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-teal-700 uppercase tracking-wider text-[11px]">
              {course.level}
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {course.weeksDuration} wks ({course.totalHours} hrs)
            </span>
          </div>

          <div>
            <Link to={`/courses/${course.id}`} className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
              {course.title}
            </Link>
            <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed mt-1">{course.subtitle}</p>
          </div>

          {/* Tutor Info */}
          {tutor && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-50/80 p-2 border border-slate-100">
              <Avatar src={tutor.avatarUrl} name={tutor.name} size="sm" className="h-7 w-7" />
              <div className="min-w-0">
                <p className="line-clamp-1 text-xs font-semibold text-slate-800">{tutor.name}</p>
                <p className="line-clamp-1 text-[11px] text-slate-500">{tutor.headline}</p>
              </div>
            </div>
          )}

          {/* Schedule note */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar size={12} className="shrink-0 text-slate-400" />
            <span className="line-clamp-1">{course.schedule}</span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Enrollment */}
      <div className="flex items-center justify-between border-t border-slate-100 px-4.5 py-3 bg-slate-50/40">
        <div>
          <span className="text-base font-bold text-slate-900">{formatINR(course.price)}</span>
          <span className="text-xs text-slate-500 font-normal"> total</span>
        </div>

        <div className="flex items-center gap-2">
          {isEnrolled ? (
            <Badge tone="success" className="px-2.5 py-1 text-xs">
              Enrolled
            </Badge>
          ) : (
            <Link to={`/courses/${course.id}`} className={buttonClasses('primary', 'sm')}>
              Enroll
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
