import { Link, Outlet } from 'react-router-dom'
import { buttonClasses } from '@/components/ui/Button'
import { BookOpen, Search, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function MarketingLayout() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white shadow-xs">
              T
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Threadline</span>
          </Link>

          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-600 md:flex">
            <Link to="/tutors" className="hover:text-slate-900 flex items-center gap-1.5 transition-colors">
              <Search size={14} className="text-slate-400" />
              Find Tutors
            </Link>
            <Link to="/courses" className="hover:text-slate-900 flex items-center gap-1.5 transition-colors">
              <BookOpen size={14} className="text-slate-400" />
              Structured Courses
            </Link>
            <Link to="/#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === 'tutor' ? '/tutor/dashboard' : '/dashboard'}
                  className={buttonClasses('secondary', 'sm')}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-medium text-slate-600 hover:text-slate-900">
                  Log in
                </Link>
                <Link to="/signup" className={buttonClasses('primary', 'sm')}>
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white shadow-xs">
                  T
                </div>
                <span className="text-sm font-bold text-slate-900">Threadline</span>
              </div>
              <p className="max-w-xs text-xs text-slate-500 leading-relaxed">
                The continuous tutoring marketplace. Connect with expert educators across online, studio, and in-home formats with an AI Learning Memory that preserves your progress.
              </p>
            </div>

            <FooterColumn
              heading="Discover"
              links={[
                { label: 'Find Tutors', to: '/tutors' },
                { label: 'Explore Courses', to: '/courses' },
                { label: 'How It Works', to: '/#how-it-works' },
              ]}
            />
            <FooterColumn
              heading="Learning Formats"
              links={[
                { label: 'Online Video Tutoring', to: '/tutors?format=online' },
                { label: "Tutor's Private Studio", to: '/tutors?format=in-person-tutor' },
                { label: 'In-Home Tutoring', to: '/tutors?format=in-person-student' },
                { label: 'Cohort Programmes', to: '/courses' },
              ]}
            />
            <FooterColumn
              heading="Account"
              links={[
                { label: 'Sign In', to: '/login' },
                { label: 'Create Account', to: '/signup' },
                { label: 'Become a Tutor', to: '/signup' },
              ]}
            />
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
            <span>© {new Date().getFullYear()} Threadline Inc. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Privacy & AI Consent</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string
  links: Array<{ label: string; to: string }>
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-900">{heading}</p>
      <ul className="flex flex-col gap-2 text-xs text-slate-500">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link to={to} className="hover:text-slate-900 transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
