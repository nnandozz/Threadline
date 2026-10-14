import { Link, Outlet } from 'react-router-dom'
import { buttonClasses } from '@/components/ui/Button'

// Lightweight header/footer for logged-out, public pages.
// Deliberately separate from AppShell — public pages shouldn't
// carry authenticated-app chrome (sidebar, notifications, etc.)
export function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-small font-bold text-white">
              T
            </div>
            <span className="text-body font-semibold text-ink">Threadline</span>
          </Link>
          <nav className="hidden items-center gap-6 text-small font-medium text-ink-secondary md:flex">
            <Link to="/#how-it-works" className="hover:text-ink">
              How it works
            </Link>
            <Link to="/tutors" className="hover:text-ink">
              Find a tutor
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-small font-medium text-ink-secondary hover:text-ink">
              Log in
            </Link>
            <Link to="/signup" className={buttonClasses('primary', 'sm')}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-label font-bold text-white">
                  T
                </div>
                <span className="text-body font-semibold text-ink">Threadline</span>
              </div>
              <p className="max-w-xs text-small text-ink-secondary">Every lesson builds on the last.</p>
            </div>

            <FooterColumn
              heading="Product"
              links={[
                { label: 'How it works', to: '/#how-it-works' },
                { label: 'Find tutors', to: '/tutors' },
              ]}
            />
            {/* "Become a tutor", "About", "Contact", "Privacy", and "Terms" don't have
                real pages yet — listed as plain text rather than dead links, since a
                link to a page that doesn't exist is worse than no link at all. */}
            <FooterColumn heading="For tutors" links={[]} plainLabels={['Become a tutor']} />
            <FooterColumn heading="Company" links={[]} plainLabels={['About', 'Contact']} />
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-small text-ink-secondary md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Threadline, Inc.</p>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FooterColumnProps {
  heading: string
  links: { label: string; to: string }[]
  plainLabels?: string[]
}

function FooterColumn({ heading, links, plainLabels = [] }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-label uppercase text-ink-secondary">{heading}</p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-small text-ink-secondary hover:text-ink">
              {link.label}
            </Link>
          </li>
        ))}
        {plainLabels.map((label) => (
          <li key={label} className="text-small text-ink-secondary">
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
