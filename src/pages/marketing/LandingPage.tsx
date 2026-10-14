import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Target, TrendingUp, History, Library, ShieldCheck } from 'lucide-react'
import { buttonClasses } from '@/components/ui/Button'
import { ThreadDiagram } from '@/components/marketing/ThreadDiagram'
import { ComparisonFlow } from '@/components/marketing/ComparisonFlow'
import { HowItWorksSteps } from '@/components/marketing/HowItWorksSteps'
import { ProductPreviewMock } from '@/components/marketing/ProductPreviewMock'
import { StudentBriefPreview } from '@/components/marketing/StudentBriefPreview'
import { ProgressTrends } from '@/components/marketing/ProgressTrends'
import {
  sarahThompson,
  latestLesson,
  homeworkCompletion,
  upcomingLesson,
} from '@/data/mockData'

export function LandingPage() {
  const location = useLocation()

  // Supports the navbar/footer "How it works" link, which points at
  // "/#how-it-works" — react-router doesn't auto-scroll on hash navigation
  // the way a full page load would, so we do it ourselves on mount/update.
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  const recurringPatternLabels = sarahThompson.recurringErrors
    .filter((e) => e.status !== 'resolved')
    .map((e) => e.pattern.replace(' tense', '').replace(/\s*\(a \/ an \/ the\)/, ''))

  return (
    <div className="flex flex-col">
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="flex flex-col gap-6">
            <h1 className="text-h1 md:text-display">The tutoring platform that remembers.</h1>
            <p className="max-w-lg text-body text-ink-secondary">
              Every lesson builds on the last. Learn with real tutors while Threadline remembers what
              you've mastered, what you're struggling with, and what you should practice next.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/tutors" className={buttonClasses('primary', 'lg')}>
                Find a Tutor
                <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className={buttonClasses('secondary', 'lg')}>
                See How It Works
              </a>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <ThreadDiagram />
          </div>
        </div>
      </section>

      {/* ─────────────────── Problem / Differentiator ─────────────────── */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-10 flex flex-col gap-3">
            <h2 className="text-h2">Your lessons shouldn't start from zero.</h2>
          </div>
          <ComparisonFlow />
        </div>
      </section>

      {/* ───────────────────────── How it works ───────────────────────── */}
      <section id="how-it-works" className="scroll-mt-16 border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <h2 className="mb-14 text-h2">Every lesson makes the next one better.</h2>
          <HowItWorksSteps />
        </div>
      </section>

      {/* ───────────────────────── Product preview ───────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="flex flex-col gap-4">
            <h2 className="text-h2">See it as your tutor sees it.</h2>
            <p className="max-w-md text-body text-ink-secondary">
              This is a real screen from Threadline — built from the same lesson history, homework, and
              progress every student and tutor sees.
            </p>
          </div>
          <ProductPreviewMock />
        </div>
      </section>

      {/* ───────────────────────── Student benefits ───────────────────────── */}
      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-14 flex flex-col gap-3">
            <h2 className="text-h2">Know exactly what to work on next.</h2>
            <p className="text-body italic text-ink-secondary">"I know I'm improving."</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitItem icon={Target} title="Personalized practice" description="Homework generated from your actual lessons, not generic worksheets." />
            <BenefitItem icon={TrendingUp} title="Visible progress" description="Watch your grammar, vocabulary, and speaking trends move over time." />
            <BenefitItem icon={History} title="Learning history" description="Every past lesson, searchable, with what you covered and what to review." />
            <BenefitItem icon={Library} title="Vocabulary growth" description="Every new word you've learned, tracked from the lesson it came from." />
          </div>
        </div>
      </section>

      {/* ───────────────────────── Tutor benefits ───────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="flex flex-col gap-4">
            <h2 className="text-h2">Walk into every lesson prepared.</h2>
            <p className="max-w-md text-body text-ink-secondary">
              Before every lesson, tutors get a brief pulled from real lesson history — what to reinforce,
              what's improving, and what's still worth watching.
            </p>
            <p className="flex items-center gap-2 text-small font-medium text-ink-secondary">
              <ShieldCheck size={16} className="text-accent-hover" />
              AI assists the tutor — it never teaches the lesson.
            </p>
          </div>
          <StudentBriefPreview
            studentName={sarahThompson.name}
            studentAvatarUrl={sarahThompson.avatarUrl}
            studentLevelLabel={`${sarahThompson.level} ${sarahThompson.targetLanguage}`}
            lastLessonTitle={latestLesson?.title ?? ''}
            recurringPatterns={recurringPatternLabels}
            homeworkCompleted={homeworkCompletion.completed}
            homeworkTotal={homeworkCompletion.total}
            recommendedFocus={upcomingLesson?.topics.join(' · ') ?? ''}
          />
        </div>
      </section>

      {/* ───────────────────────── Progress ───────────────────────── */}
      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-14 flex flex-col gap-3">
            <h2 className="text-h2">See the progress your lessons create.</h2>
            <p className="max-w-lg text-body text-ink-secondary">
              These are trend indicators, not lab-precise measurements — a picture of direction over time,
              the same way a tutor would describe your progress in conversation.
            </p>
          </div>
          <ProgressTrends progressHistory={sarahThompson.progressHistory} />
        </div>
      </section>

      {/* ───────────────────────── Final CTA ───────────────────────── */}
      <section className="border-t border-border bg-primary">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
          <h2 className="text-h2 text-white">Stop starting over.</h2>
          <p className="max-w-lg text-body text-white/80">
            Start building a learning journey that remembers where you've been — and knows where to go
            next.
          </p>
          <Link to="/tutors" className={buttonClasses('secondary', 'lg')}>
            Find Your Tutor
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

function BenefitItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Target
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
        <Icon size={18} strokeWidth={2} />
      </div>
      <p className="text-body font-semibold text-ink">{title}</p>
      <p className="text-small text-ink-secondary">{description}</p>
    </div>
  )
}
