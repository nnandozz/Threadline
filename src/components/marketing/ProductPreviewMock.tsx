import { Avatar } from '@/components/ui/Avatar'
import { ProgressMetric } from '@/components/ui/ProgressMetric'
import { InsightCard } from '@/components/lesson/InsightCard'
import { LessonCard } from '@/components/lesson/LessonCard'
import { HomeworkCard } from '@/components/lesson/HomeworkCard'
import { sarahThompson, alexMorgan, upcomingLesson, homeworkItems } from '@/data/mockData'
import { formatLessonDateLabel } from '@/lib/utils'

// A real preview of the actual product surface, built from the same
// components and mock data the authenticated dashboard will use — not a
// separately-drawn mockup. If mockData changes, this changes with it.
export function ProductPreviewMock() {
  const openHomework = homeworkItems.find((h) => !h.completed)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-raised">
      {/* Minimal browser-style chrome to frame this as a product screen, not a floating card */}
      <div className="flex items-center gap-1.5 border-b border-border bg-slate-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
      </div>

      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <Avatar src={sarahThompson.avatarUrl} name={sarahThompson.name} size="md" />
          <div>
            <p className="text-body font-semibold text-ink">{sarahThompson.name}</p>
            <p className="text-small text-ink-secondary">{sarahThompson.level} · {sarahThompson.targetLanguage}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 rounded-lg bg-background p-4">
          <div className="flex flex-col gap-1">
            <p className="text-h3 text-ink">+{sarahThompson.totalVocabularyLearned}</p>
            <p className="text-small text-ink-secondary">Words learned</p>
          </div>
          <ProgressMetric label="Grammar" value={sarahThompson.skillLevels.grammar} />
          <ProgressMetric label="Speaking" value={sarahThompson.skillLevels.speaking} />
        </div>

        <InsightCard>
          Present perfect accuracy improved from 62% to 74%. Keep practicing past experiences.
        </InsightCard>

        {upcomingLesson && (
          <LessonCard
            title={upcomingLesson.title}
            withPersonName={alexMorgan.name}
            withPersonAvatarUrl={alexMorgan.avatarUrl}
            dateLabel={formatLessonDateLabel(upcomingLesson.date, upcomingLesson.time)}
          />
        )}

        {openHomework && (
          <HomeworkCard
            title={openHomework.title}
            description={openHomework.description}
            type={openHomework.type}
            durationMinutes={openHomework.durationMinutes}
            completed={openHomework.completed}
          />
        )}
      </div>
    </div>
  )
}
