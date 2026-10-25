import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MarketingLayout } from '@/pages/marketing/MarketingLayout'
import { LandingPage } from '@/pages/marketing/LandingPage'
import { TutorsExplorePage } from '@/pages/marketing/TutorsExplorePage'
import { CoursesExplorePage } from '@/pages/marketing/CoursesExplorePage'
import { TutorProfilePage } from '@/pages/marketing/TutorProfilePage'
import { CourseDetailPage } from '@/pages/marketing/CourseDetailPage'
import { BookingPage } from '@/pages/marketing/BookingPage'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { OnboardingPage } from '@/pages/auth/OnboardingPage'
import { StudentLayout } from '@/pages/student/StudentLayout'
import { StudentDashboard } from '@/pages/student/StudentDashboard'
import { MyLearningPage } from '@/pages/student/MyLearningPage'
import { LessonSummaryPage } from '@/pages/student/LessonSummaryPage'
import { LiveLessonPage } from '@/pages/student/LiveLessonPage'
import { HomeworkPage } from '@/pages/student/HomeworkPage'
import { ProgressDashboard } from '@/pages/student/ProgressDashboard'
import { VocabularyPage } from '@/pages/student/VocabularyPage'
import { MessagesPage } from '@/pages/student/MessagesPage'
import { StudentSettingsPage } from '@/pages/student/StudentSettingsPage'
import { TutorLayout } from '@/pages/tutor/TutorLayout'
import { TutorDashboard } from '@/pages/tutor/TutorDashboard'
import { TutorSchedulePage } from '@/pages/tutor/TutorSchedulePage'
import { TutorStudentsPage } from '@/pages/tutor/TutorStudentsPage'
import { TutorServicesPage } from '@/pages/tutor/TutorServicesPage'
import { TutorCoursesPage } from '@/pages/tutor/TutorCoursesPage'
import { TutorEarningsPage } from '@/pages/tutor/TutorEarningsPage'
import { TutorSettingsPage } from '@/pages/tutor/TutorSettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public / marketing */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<LandingPage />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Student & Explore routes (shares StudentLayout for persistent sidebar navigation) */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/tutors" element={<TutorsExplorePage />} />
          <Route path="/tutors/:tutorId" element={<TutorProfilePage />} />
          <Route path="/courses" element={<CoursesExplorePage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/book/:tutorId" element={<BookingPage />} />
          <Route path="/lessons" element={<MyLearningPage />} />
          <Route path="/lessons/:lessonId" element={<LessonSummaryPage />} />
          <Route path="/lesson/:lessonId/live" element={<LiveLessonPage />} />
          <Route path="/homework" element={<HomeworkPage />} />
          <Route path="/progress" element={<ProgressDashboard />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/settings" element={<StudentSettingsPage />} />
        </Route>

        {/* Tutor (authenticated) */}
        <Route
          element={
            <ProtectedRoute requiredRole="tutor">
              <TutorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
          <Route path="/tutor/schedule" element={<TutorSchedulePage />} />
          <Route path="/tutor/students" element={<TutorStudentsPage />} />
          <Route path="/tutor/students/:studentId" element={<TutorStudentsPage />} />
          <Route path="/tutor/services" element={<TutorServicesPage />} />
          <Route path="/tutor/courses" element={<TutorCoursesPage />} />
          <Route path="/tutor/earnings" element={<TutorEarningsPage />} />
          <Route path="/tutor/messages" element={<MessagesPage />} />
          <Route path="/tutor/lesson/:lessonId/live" element={<LiveLessonPage />} />
          <Route path="/tutor/lesson/:lessonId/notes" element={<LessonSummaryPage />} />
          <Route path="/tutor/settings" element={<TutorSettingsPage />} />
        </Route>

        {/* 404 fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
