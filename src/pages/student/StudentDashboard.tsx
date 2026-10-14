import { useNavigate, Link } from 'react-router-dom'
import { Flame, GraduationCap, Library, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressMetric } from '@/components/ui/ProgressMetric'
import { Sparkline } from '@/components/ui/Sparkline'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { LessonCard } from '@/components/lesson/LessonCard'
import { HomeworkCard } from '@/components/lesson/HomeworkCard'
import { InsightCard } from '@/components/lesson/InsightCard'
import { TutorCard } from '@/components/tutor/TutorCard'
import {
  sarahThompson,
  alexMorgan,
  lessons,
  upcomingLesson,
  latestLesson,
  homeworkItems,
  homeworkCompletion,
  recommendedTutorsForSarah,
} from '@/data/mockData'
import { formatLessonDateLabel, formatShortDate, getGreeting } from '@/lib/utils'

const SKILL_LABELS = {
  grammar: 'Grammar trend',
  vocabulary: 'Vocabulary growth',
  speaking: 'Speaking trend',
} as const

export function StudentDashboard() {
  const navigate = useNavigate()

  const firstName = sarahThompson.name.split(' ')[0]
  const openHomework = homeworkItems.find((h) => !h.completed)
  const recentHomework = [...homeworkItems]
    .sort((a, b) => (a.dateAssigned < b.dateAssigned ? 1 : -1))
    .slice(0, 3)
  const lessonsCompleted = lessons.filter(
    (l) => l.studentId === sarahThompson.id && l.status === 'completed',
  ).length
  const skillValues = Object.values(sarahThompson.skillLevels)
  const overallProgress = Math.round(skillValues.reduce((sum, v) => sum + v, 0) / skillValues.length)

  const grammarTrend = sarahThompson.progressHistory.map((p) => p.skillLevels.grammar)
  const vocabularyTrend = sarahThompson.progressHistory.map((p) => p.skillLevels.vocabulary)
  const speakingTrend = sarahThompson.progressHistory.map((p) => p.skillLevels.speaking)

  return (
    <div className="flex flex-col gap-10">
      {/* ───────────────────────── Greeting ───────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-body text-ink-secondary">Here's what's happening with your learning.</p>
      </div>

      {/* ───────────────────────── Learning overview ───────────────────────── */}
      <section aria-labelledby="overview-heading" className="flex flex-col gap-4">
        <h2 id="overview-heading" className="sr-only">
          Learning overview
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Flame size={18} />} label="Day streak" value={`${sarahThompson.currentStreakDays}`} />
          <StatCard icon={<GraduationCap size={18} />} label="Lessons completed" value={`${lessonsCompleted}`} />
          <StatCard
            icon={<Library size={18} />}
            label="Words learned"
            value={`${sarahThompson.totalVocabularyLearned}`}
          />
          <StatCard icon={<TrendingUp size={18} />} label="Overall progress" value={`${overallProgress}%`} />
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-10 lg:col-span-2">
          {/* ───────────────────────── Continue learning ───────────────────────── */}
          <section aria-labelledby="continue-heading" className="flex flex-col gap-4">
            <h2 id="continue-heading" className="text-h3">
              Continue learning
            </h2>
            {openHomework ? (
              <Card className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="accent">
                    {sarahThompson.targetLanguage} · {sarahThompson.level}
                  </Badge>
                  <span className="text-small text-ink-secondary">
                    Last lesson: {latestLesson?.title} · {latestLesson && formatShortDate(latestLesson.date)}
                  </span>
                </div>
                <div>
                  <p className="text-small text-ink-secondary">Up next</p>
                  <p className="text-h3">{openHomework.title}</p>
                  <p className="mt-1 text-small text-ink-secondary">{openHomework.description}</p>
                </div>
                <ProgressMetric
                  label="This week's homework"
                  value={Math.round((homeworkCompletion.completed / homeworkCompletion.total) * 100)}
                />
                <Button size="lg" onClick={() => navigate('/homework')} className="self-start">
                  Continue
                  <ArrowRight size={16} />
                </Button>
              </Card>
            ) : (
              <EmptyState
                title="You're all caught up"
                description="No open homework right now — check back after your next lesson."
                action={
                  <Button size="sm" onClick={() => navigate('/homework')}>
                    View homework
                  </Button>
                }
              />
            )}
          </section>

          {/* ───────────────────────── Upcoming lesson ───────────────────────── */}
          <section aria-labelledby="upcoming-heading" className="flex flex-col gap-4">
            <h2 id="upcoming-heading" className="text-h3">
              Upcoming lesson
            </h2>
            {upcomingLesson ? (
              <LessonCard
                title={upcomingLesson.title}
                withPersonName={alexMorgan.name}
                withPersonAvatarUrl={alexMorgan.avatarUrl}
                dateLabel={formatLessonDateLabel(upcomingLesson.date, upcomingLesson.time)}
                statusLabel="Upcoming"
                joinDisabled={false}
                onJoin={() => navigate(`/lesson/${upcomingLesson.id}/live`)}
              />
            ) : (
              <EmptyState
                title="No upcoming lessons"
                description="Book a lesson to keep your momentum going."
                action={
                  <Link to="/tutors" className="text-small font-medium text-primary hover:text-primary-hover">
                    Find a tutor
                  </Link>
                }
              />
            )}
          </section>

          {/* ───────────────────────── Homework ───────────────────────── */}
          <section aria-labelledby="homework-heading" className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 id="homework-heading" className="text-h3">
                Homework
              </h2>
              <Link
                to="/homework"
                className="flex items-center gap-1 text-small font-medium text-primary hover:text-primary-hover"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>
            {recentHomework.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentHomework.map((item) => (
                  <HomeworkCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    type={item.type}
                    durationMinutes={item.durationMinutes}
                    completed={item.completed}
                    dueDateLabel={`Due ${formatShortDate(item.dueDate)}`}
                    onStart={() => navigate('/homework')}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No homework yet" description="Homework appears here after your first lesson." />
            )}
          </section>
        </div>

        <div className="flex flex-col gap-10">
          {/* ───────────────────────── Recent progress ───────────────────────── */}
          <section aria-labelledby="progress-heading" className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 id="progress-heading" className="text-h3">
                Recent progress
              </h2>
              <Link
                to="/progress"
                className="flex items-center gap-1 text-small font-medium text-primary hover:text-primary-hover"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>
            <Card className="flex flex-col gap-5">
              <TrendRow label={SKILL_LABELS.grammar} values={grammarTrend} color="primary" />
              <TrendRow label={SKILL_LABELS.vocabulary} values={vocabularyTrend} color="accent" />
              <TrendRow label={SKILL_LABELS.speaking} values={speakingTrend} color="success" />
            </Card>
            <InsightCard>
              Present perfect accuracy improved from 62% to 74%. Keep practicing past experiences.
            </InsightCard>
          </section>

          {/* ───────────────────────── Recommended tutors ───────────────────────── */}
          <section aria-labelledby="recommended-heading" className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 id="recommended-heading" className="flex items-center gap-1.5 text-h3">
                <Sparkles size={16} className="text-accent-hover" />
                Recommended for you
              </h2>
              <Link
                to="/tutors"
                className="flex items-center gap-1 text-small font-medium text-primary hover:text-primary-hover"
              >
                See all
                <ArrowRight size={14} />
              </Link>
            </div>
            {recommendedTutorsForSarah.length > 0 ? (
              <div className="flex flex-col gap-4">
                {recommendedTutorsForSarah.slice(0, 3).map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} onView={() => navigate(`/tutors/${tutor.id}`)} />
                ))}
              </div>
            ) : (
              <EmptyState title="No recommendations yet" description="Check back after a few more lessons." />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function TrendRow({
  label,
  values,
  color,
}: {
  label: string
  values: number[]
  color: 'primary' | 'accent' | 'success'
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-small text-ink-secondary">{label}</p>
        <p className="text-h3 text-ink">
          {values[0]}% <span className="text-ink-secondary">→</span> {values.at(-1)}%
        </p>
      </div>
      <Sparkline values={values} color={color} width={100} height={36} className="shrink-0" />
    </div>
  )
}
