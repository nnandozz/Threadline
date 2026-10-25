import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { useAuth } from '@/context/AuthContext'
import { listCoursesByTutor, upsertCourse } from '@/lib/marketplaceStore'
import { formatINR } from '@/lib/utils'
import type { Course, TeachingFormat } from '@/types'

export function TutorCoursesPage() {
  const { user } = useAuth()
  const tutorId = user?.id || ''
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    function load() {
      if (tutorId) setCourses(listCoursesByTutor(tutorId))
    }
    load()
    window.addEventListener('threadline_store_updated', load)
    return () => window.removeEventListener('threadline_store_updated', load)
  }, [tutorId])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [newPrice, setNewPrice] = useState('2400')
  const [newFormat, setNewFormat] = useState<TeachingFormat>('online')
  const [newCapacity, setNewCapacity] = useState('12')

  function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault()
    if (!tutorId) return
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      tutorId,
      title: newTitle,
      subtitle: newSubtitle,
      description: 'Comprehensive curriculum cohort with weekly live lectures, peer coding, and mentor reviews.',
      subject: 'Conversational Fluency',
      category: 'Languages',
      level: 'Intermediate',
      format: newFormat,
      price: Number(newPrice),
      totalHours: 16,
      weeksDuration: 4,
      startDate: '2026-10-01',
      schedule: 'Mondays & Thursdays · 7:00 PM IST',
      maxCapacity: Number(newCapacity),
      enrolledCount: 1,
      syllabus: [
        {
          id: 'mod-1',
          title: 'Module 1: Foundations & Diagnostic Assessment',
          description: 'Baseline speaking assessments and personalized feedback.',
          durationHours: 4,
          topics: ['Speaking Diagnostics', 'Active Listening'],
        },
      ],
      learningObjectives: ['Achieve conversational fluency in everyday situations', 'Eliminate hesitation'],
      prerequisites: ['Basic conversational knowledge'],
      rating: 5.0,
      reviewCount: 1,
    }

    upsertCourse(newCourse)
    setCourses(listCoursesByTutor(tutorId))
    setShowCreateModal(false)
    setNewTitle('')
    setNewSubtitle('')
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-ink">My Courses & Programmes</h1>
          <p className="text-body text-ink-secondary">
            Create and lead structured cohorts, manage syllabi, and track student enrollment.
          </p>
        </div>

        <Button size="md" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          Create New Course
        </Button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xl">
            <h3 className="text-h3 text-ink">Create New Cohort Programme</h3>
            <form onSubmit={handleCreateCourse} className="flex flex-col gap-4">
              <div>
                <label className="text-small font-medium text-ink block mb-1">Course Title</label>
                <Input
                  required
                  placeholder="e.g. Masterclass in Technical English & Writing"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-small font-medium text-ink block mb-1">Subtitle / Summary</label>
                <Input
                  required
                  placeholder="e.g. 4-week intensive sprint for professionals"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-small font-medium text-ink block mb-1">Price (₹)</label>
                  <Input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-small font-medium text-ink block mb-1">Max Seats</label>
                  <Input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-small font-medium text-ink block mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as TeachingFormat)}
                    className="w-full h-10 rounded-lg border border-border p-2 text-small text-ink focus:outline-none"
                  >
                    <option value="online">Online Live</option>
                    <option value="group">Group Workshop</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <Button variant="secondary" size="md" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button size="md" type="submit">
                  Publish Programme
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col justify-between gap-5 p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <FormatBadge format={course.format} />
                <Badge tone="neutral">{course.category}</Badge>
              </div>

              <h2 className="text-h3 text-ink font-bold">{course.title}</h2>
              <p className="text-small text-ink-secondary">{course.subtitle}</p>

              <div className="mt-2 flex flex-col gap-1.5 rounded-xl bg-slate-50 p-3 text-small border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-ink-secondary">Schedule:</span>
                  <span className="font-semibold text-ink">{course.schedule}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-secondary">Enrollment:</span>
                  <span className="font-semibold text-primary">
                    {course.enrolledCount} / {course.maxCapacity} students
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-secondary">Price per student:</span>
                  <span className="font-bold text-ink">{formatINR(course.price)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-label text-ink-secondary">
                {course.syllabus.length} Syllabus Modules
              </span>
              <Button size="sm" variant="secondary">
                Manage Syllabus
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
