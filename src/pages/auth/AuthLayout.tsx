import { Link, Outlet } from 'react-router-dom'

// Centered, distraction-free layout for authentication and onboarding flows.
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-body font-bold text-white">
          T
        </div>
        <span className="text-h3 text-ink">Threadline</span>
      </Link>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
