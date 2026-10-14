import { Routes, Route } from 'react-router-dom'
import { MarketingLayout } from '@/pages/marketing/MarketingLayout'
import { LandingPage } from '@/pages/marketing/LandingPage'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { OnboardingPage } from '@/pages/auth/OnboardingPage'
import { StudentLayout } from '@/pages/student/StudentLayout'
import { StudentDashboard } from '@/pages/student/StudentDashboard'
import { TutorLayout } from '@/pages/tutor/TutorLayout'
import { Placeholder } from '@/pages/Placeholder'

// ─────────────────────────────────────────────────────────────
// Route tree — matches the approved information architecture.
//
// Every route is wired up now; most render <Placeholder /> until
// built in a later step. Real pages replace the Placeholder one
// at a time — the route itself never has to change.
// ─────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Routes>
      {/* Public / marketing */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<Placeholder pageName="How It Works" />} />
        <Route path="/tutors" element={<Placeholder pageName="Tutor marketplace" />} />
        <Route path="/tutors/:tutorId" element={<Placeholder pageName="Tutor profile" />} />
        <Route path="/book/:tutorId" element={<Placeholder pageName="Booking flow" />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<Placeholder pageName="Forgot password" />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>

      {/* Student (authenticated) */}
      <Route element={<StudentLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/lessons" element={<Placeholder pageName="Lessons" />} />
        <Route path="/lessons/:lessonId" element={<Placeholder pageName="Lesson summary" />} />
        <Route path="/lesson/:lessonId/live" element={<Placeholder pageName="Live lesson" />} />
        <Route path="/homework" element={<Placeholder pageName="Homework" />} />
        <Route path="/progress" element={<Placeholder pageName="Progress dashboard" />} />
        <Route path="/vocabulary" element={<Placeholder pageName="Vocabulary" />} />
        <Route path="/messages" element={<Placeholder pageName="Messages" />} />
        <Route path="/settings" element={<Placeholder pageName="Settings" />} />
      </Route>

      {/* Tutor (authenticated) */}
      <Route element={<TutorLayout />}>
        <Route path="/tutor/dashboard" element={<Placeholder pageName="Tutor dashboard" />} />
        <Route path="/tutor/schedule" element={<Placeholder pageName="Tutor schedule" />} />
        <Route path="/tutor/students" element={<Placeholder pageName="Students" />} />
        <Route path="/tutor/students/:studentId" element={<Placeholder pageName="Student brief" />} />
        <Route path="/tutor/lesson/:lessonId/live" element={<Placeholder pageName="Live lesson (tutor)" />} />
        <Route path="/tutor/lesson/:lessonId/notes" element={<Placeholder pageName="Lesson notes" />} />
        <Route path="/tutor/earnings" element={<Placeholder pageName="Earnings" />} />
        <Route path="/tutor/messages" element={<Placeholder pageName="Tutor messages" />} />
        <Route path="/tutor/settings" element={<Placeholder pageName="Tutor settings" />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Placeholder pageName="Page not found" />} />
    </Routes>
  )
}
