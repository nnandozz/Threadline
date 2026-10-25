import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Search,
  Video,
  MapPin,
  Home,
  Users,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Brain,
  History,
  Target,
  GraduationCap,
} from 'lucide-react'
import { buttonClasses } from '@/components/ui/Button'
import { TutorCard } from '@/components/tutor/TutorCard'
import { CourseCard } from '@/components/course/CourseCard'
import { allCourses } from '@/data/mockData'
import { useCatalog } from '@/lib/marketplaceStore'

export function LandingPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tutors?query=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/tutors')
    }
  }

  const { tutors } = useCatalog()
  const featuredTutors = tutors.slice(0, 4)
  const featuredCourses = allCourses.slice(0, 3)

  return (
    <div className="flex flex-col bg-background">
      {/* ───────────────────────── 1. Hero Section ───────────────────────── */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles size={13} />
              <span>The Continuous Tutoring Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
              Find the right tutor. <br />
              <span className="text-primary">Learn with continuous context.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
              Connect with verified tutors and cohort programmes across online, studio, and in-home formats.
              Threadline's AI Learning Memory tracks your progress, mastered concepts, and recurring mistakes so every lesson builds on the last.
            </p>

            {/* Direct Search Form */}
            <form onSubmit={handleSearch} className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="flex flex-1 items-center gap-2.5 px-3">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Subject, exam, or goal (e.g. Calculus, IELTS, Python, Piano)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button type="submit" className={buttonClasses('primary', 'md')}>
                Search Tutors
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular:</span>
              {['Calculus & Analysis', 'Computer Science', 'Business English', 'JEE & NEET Prep', 'Classical Piano', 'Physics'].map((term) => (
                <Link
                  key={term}
                  to={`/tutors?query=${encodeURIComponent(term)}`}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link to="/signup" className={buttonClasses('primary', 'lg')}>
                Get Started
                <ArrowRight size={16} />
              </Link>
              <Link to="/tutors" className={buttonClasses('secondary', 'lg')}>
                Browse All Tutors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 2. How Finding & Booking Works ───────────────────────── */}
      <section id="how-it-works" className="border-b border-slate-200/80 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Simple & Transparent
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How Threadline Works
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              From finding the ideal educator to retaining key concepts between sessions, Threadline makes private tutoring seamless.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <StepItem
              number="01"
              title="Search by Goal"
              description="Filter tutors by academic subject, specific curriculum, exam preparation, or particular skill hurdle."
            />
            <StepItem
              number="02"
              title="Choose Format"
              description="Select online video from anywhere, private studio sessions, or in-home visits directly to your residence."
            />
            <StepItem
              number="03"
              title="Book Available Slot"
              description="Pick from live tutor availability. Confirm your session with transparent pricing and no hidden booking fees."
            />
            <StepItem
              number="04"
              title="Learn with Continuity"
              description="Every lesson notes key vocabulary, formulas, and errors so your next session picks up without diagnostic delays."
            />
          </div>
        </div>
      </section>

      {/* ───────────────────────── 3. Multiple Learning Formats ───────────────────────── */}
      <section className="border-b border-slate-200/80 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Flexibility
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Learn in the Environment That Suits You
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Different disciplines require different teaching contexts. Threadline accommodates all major tutoring formats on a single platform.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FormatCard
              icon={Video}
              title="Online Video Tutoring"
              description="Interactive 1-on-1 sessions with collaborative notes and consensual audio/transcript synthesis."
              badgeTone="indigo"
            />
            <FormatCard
              icon={MapPin}
              title="At Tutor's Studio"
              description="Visit professional teaching facilities equipped for piano instruments, science laboratories, or quiet study."
              badgeTone="teal"
            />
            <FormatCard
              icon={Home}
              title="In-Home Tutoring"
              description="Verified tutors travel directly to your home within their specified travel radius. Locations are shared safely."
              badgeTone="slate"
            />
            <FormatCard
              icon={Users}
              title="Cohort Programmes"
              description="Structured multi-week intensive courses with peer study groups, scheduled syllabi, and 1-on-1 mentor reviews."
              badgeTone="amber"
            />
          </div>
        </div>
      </section>

      {/* ───────────────────────── 4. The AI Learning Memory Differentiator ───────────────────────── */}
      <section className="border-b border-slate-200/80 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-primary">
                <Brain size={13} />
                <span>AI Learning Memory</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                No more starting from zero every time you take a lesson.
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Traditional private tutoring has a major flaw: context is lost between lessons. Tutors often spend the first 15 minutes asking "what did you cover last time?"
              </p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Threadline's AI Learning Memory maintains learning continuity between your lessons with consensual, privacy-first note capture:
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <MemoryFeature
                  icon={History}
                  title="Persistent Mistake Tracking"
                  description="Flags recurring misconceptions (such as past participle agreement, off-by-one errors, or eigenvalue properties) until they are consistently resolved."
                />
                <MemoryFeature
                  icon={BookOpen}
                  title="Curated Concept & Vocabulary Bank"
                  description="Automatically saves new technical terms and formulas introduced during lessons into interactive spaced-repetition flashcards."
                />
                <MemoryFeature
                  icon={Target}
                  title="Tutor Brief Handover"
                  description="Before your lesson, your tutor receives a concise overview of what you have mastered and what needs practice, allowing them to personalize immediately."
                />
              </div>
            </div>

            {/* Educational Visual Composition */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                    <Brain size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Learning Continuity Dossier</h3>
                    <p className="text-[11px] text-slate-400">Generated automatically following validated lessons</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Active Sync
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Diagnosed Error Pattern</span>
                  <p className="text-xs font-semibold text-slate-800 mt-1">Present Perfect vs. Past Simple with definite time references</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Example: "I have visited Rome last year" → "I visited Rome last year"</p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Concepts Mastered</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-700 font-medium">Sliding Window Pattern</span>
                    <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-700 font-medium">Vector Dot Products</span>
                    <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-700 font-medium">Conditional Tense</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Actionable Homework Next Step</span>
                  <p className="text-xs text-slate-700 mt-1">3 short conversational voice recordings applying corrected past tense constructions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 5. Dual Value Proposition ───────────────────────── */}
      <section className="border-b border-slate-200/80 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Built for Learning
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Value for Students and Tutors
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Student Value Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary mb-5">
                  <GraduationCap size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">For Students & Parents</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Get matched with top tutors and make measurable progress with zero wasted time.
                </p>

                <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Find tutors for specific exams (JEE Advanced, NEET, CBSE/ICSE, IELTS) or goals</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Choose online video, tutor studio visits, or in-home sessions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Never repeat diagnostics when switching instructors or resuming after a pause</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Transparent hourly rates with no hidden platform subscription fees</span>
                  </li>
                </ul>
              </div>

              <Link to="/signup" className={buttonClasses('primary', 'md', 'mt-8 w-fit')}>
                Create Student Account
              </Link>
            </div>

            {/* Tutor Value Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 mb-5">
                  <Users size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">For Professional Educators</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Focus on delivering high-impact teaching while Threadline handles scheduling and automated student dossiers.
                </p>

                <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                    <span>Walk into every lesson with automated pre-session student summaries</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                    <span>Set your own hourly pricing, travel radius, studio address, and packages</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                    <span>Launch structured multi-week cohort courses for group learning</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                    <span>Direct client communication and simple calendar slot management</span>
                  </li>
                </ul>
              </div>

              <Link to="/signup" className={buttonClasses('secondary', 'md', 'mt-8 w-fit')}>
                Apply to Teach on Threadline
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 6. Featured Marketplace Directory ───────────────────────── */}
      <section className="border-b border-slate-200/80 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Verified Educators
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                Featured Tutors
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore qualified tutors offering online, in-studio, and in-home lessons.
              </p>
            </div>
            <Link to="/tutors" className={buttonClasses('secondary', 'md')}>
              Browse All Tutors →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── 7. Featured Structured Courses ───────────────────────── */}
      <section className="border-b border-slate-200/80 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Structured Programmes
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                Cohort & Mentor Courses
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Master complex skills in multi-week cohorts with scheduled live sessions and weekly mentor reviews.
              </p>
            </div>
            <Link to="/courses" className={buttonClasses('secondary', 'md')}>
              View All Courses →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── 8. Final Call to Action ───────────────────────── */}
      <section className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center flex flex-col items-center gap-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Start learning with the right mentor today.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Whether you need weekly calculus in-home, online coding mentorship, or conservatory piano tuition,
            Threadline connects you with the right educator.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/signup" className={buttonClasses('primary', 'lg')}>
              Create Your Account
              <ArrowRight size={16} />
            </Link>
            <Link to="/tutors" className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-750 transition-colors">
              Find Tutors
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function StepItem({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <span className="text-xs font-bold text-primary font-mono">{number}</span>
      <h3 className="text-base font-semibold text-slate-900 mt-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{description}</p>
    </div>
  )
}

function FormatCard({
  icon: Icon,
  title,
  description,
  badgeTone,
}: {
  icon: typeof Video
  title: string
  description: string
  badgeTone: 'indigo' | 'teal' | 'slate' | 'amber'
}) {
  const bgClasses = {
    indigo: 'bg-indigo-50 text-primary',
    teal: 'bg-teal-50 text-teal-700',
    slate: 'bg-slate-100 text-slate-700',
    amber: 'bg-amber-50 text-amber-700',
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-slate-300 transition-all">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgClasses[badgeTone]}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  )
}

function MemoryFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof History
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-primary shrink-0 mt-0.5">
        <Icon size={16} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
