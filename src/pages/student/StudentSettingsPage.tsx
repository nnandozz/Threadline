import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Sparkles,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  User,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import {
  getLearningPreferences,
  updateLearningPreferences,
  getAiPrivacySettings,
  updateAiPrivacySettings,
} from '@/lib/marketplaceStore'
import { useAuth } from '@/context/AuthContext'
import { formatINR } from '@/lib/utils'
import type { TeachingFormat } from '@/types'

export function StudentSettingsPage() {
  const { user, updateProfile, isLoading } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [learningGoal, setLearningGoal] = useState('')
  const [prefs, setPrefs] = useState(() => getLearningPreferences(user?.id))
  const [privacy, setPrivacy] = useState(() => getAiPrivacySettings(user?.id))

  const [isSaving, setIsSaving] = useState(false)
  const [savedNotice, setSavedNotice] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Sync state when authenticated user profile loads or refreshes
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      const goalsText =
        user.learningGoals && user.learningGoals.length > 0
          ? user.learningGoals.join(', ')
          : getLearningPreferences(user.id).learningGoal || ''
      setLearningGoal(goalsText)
      setPrefs(getLearningPreferences(user.id))
      setPrivacy(getAiPrivacySettings(user.id))
    }
  }, [user])

  function toggleFormat(fmt: TeachingFormat) {
    const current = prefs.preferredFormats
    const updated = current.includes(fmt)
      ? current.filter((f) => f !== fmt)
      : [...current, fmt]
    setPrefs({ ...prefs, preferredFormats: updated })
  }

  async function handleSave() {
    if (!user) return

    setIsSaving(true)
    setErrorMessage(null)
    setSavedNotice(false)

    try {
      // 1. Persist genuine profile fields (name and learning_goals) to Supabase
      const trimmedName = name.trim()
      const goalsArray = learningGoal
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean)

      const profileRes = await updateProfile({
        name: trimmedName || user.name,
        learningGoals: goalsArray.length > 0 ? goalsArray : (learningGoal.trim() ? [learningGoal.trim()] : []),
      })

      if (!profileRes.success) {
        setErrorMessage(profileRes.error || 'Failed to update profile in database.')
        setIsSaving(false)
        return
      }

      // 2. Persist user-scoped preferences and AI privacy to user-specific localStorage keys
      updateLearningPreferences(
        {
          ...prefs,
          learningGoal: learningGoal.trim(),
        },
        user.id,
      )

      updateAiPrivacySettings(privacy, user.id)

      setSavedNotice(true)
      setTimeout(() => setSavedNotice(false), 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred while saving.'
      setErrorMessage(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <Loader2 size={24} className="animate-spin text-primary" />
        <span className="text-xs text-slate-500">Loading student profile…</span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-h1 text-ink">Student Settings & Preferences</h1>
        <p className="text-body text-ink-secondary">
          Manage your student profile identity, preferred learning formats, budget, and Threadline AI Continuity sharing permissions.
        </p>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-success-light p-4 text-small font-semibold text-success border border-success/20">
          <CheckCircle2 size={18} />
          Your profile and preferences have been updated and synchronized successfully!
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-small font-semibold text-red-600 border border-red-200">
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      {/* 1. Learning Profile & Goals */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <User className="text-primary" size={20} />
            <h2 className="text-h3 text-ink">Learning Goals & Profile</h2>
          </div>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            Cloud Synchronized
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-small font-semibold text-ink block mb-1">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-small font-semibold text-ink block mb-1">Account Email</label>
              <Input
                value={user?.email || ''}
                disabled
                className="bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-ink-secondary mt-1">
                Verified login identity. Protected against direct client mutation.
              </p>
            </div>
          </div>

          <div>
            <label className="text-small font-semibold text-ink block mb-1">
              Primary Learning Objective
            </label>
            <Textarea
              rows={2}
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="e.g. Master algorithms and executive communication"
            />
            <p className="text-label text-ink-secondary mt-1">
              This objective informs tutor match recommendations and is persisted to your Supabase profile.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Teaching Format & Location Preferences */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="text-success" size={20} />
            <h2 className="text-h3 text-ink">Teaching Format & In-Person Location</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
            Device Preference
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label className="text-small font-semibold text-ink block mb-2">
              Preferred Teaching Arrangements
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: 'online' as TeachingFormat, label: 'Online Video Sessions' },
                { id: 'in-person-student' as TeachingFormat, label: "In-Person (Tutor travels to my home)" },
                { id: 'in-person-tutor' as TeachingFormat, label: "In-Person (I visit tutor's studio)" },
                { id: 'hybrid' as TeachingFormat, label: 'Hybrid (Online + In-Person)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleFormat(item.id)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-small font-medium transition-colors ${
                    prefs.preferredFormats.includes(item.id)
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border bg-slate-50 text-ink-secondary hover:text-ink'
                  }`}
                >
                  <span>{item.label}</span>
                  {prefs.preferredFormats.includes(item.id) && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-small font-semibold text-ink block mb-1">City / Region</label>
              <select
                value={prefs.city || 'Delhi NCR'}
                onChange={(e) => setPrefs({ ...prefs, city: e.target.value })}
                aria-label="Preferred city"
                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-small text-ink focus:border-primary focus:outline-none"
              >
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Gurugram">Gurugram</option>
              </select>
            </div>

            <div>
              <label className="text-small font-semibold text-ink block mb-1">
                Neighborhood / Area (For offline search)
              </label>
              <Input
                value={prefs.area || ''}
                onChange={(e) => setPrefs({ ...prefs, area: e.target.value })}
                placeholder="e.g. South Delhi & Gurugram"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-small font-semibold text-ink">
                Max Hourly Budget: <span className="text-primary">{formatINR(prefs.maxBudgetPerHour)}/hour</span>
              </label>
            </div>
            <input
              type="range"
              min="300"
              max="2500"
              step="50"
              value={prefs.maxBudgetPerHour}
              onChange={(e) => setPrefs({ ...prefs, maxBudgetPerHour: Number(e.target.value) })}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 3. AI Learning Memory & Privacy Controls */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={20} />
            <h2 className="text-h3 text-ink">AI Learning Continuity & Privacy Controls</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
              Device Preference
            </span>
            <ShieldCheck size={20} className="text-success" />
          </div>
        </div>

        <p className="text-small text-ink-secondary mb-5">
          You have full control over what learning history is shared across tutors and subjects.
          Threadline never sells data or records without active participant consent.
        </p>

        <div className="flex flex-col gap-4">
          <label className="flex items-start gap-3 rounded-xl border border-border p-4 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.shareGoals}
              onChange={(e) => setPrivacy({ ...privacy, shareGoals: e.target.checked })}
              className="mt-1 accent-primary"
            />
            <div>
              <span className="text-body font-semibold text-ink">Share Learning Objectives with Tutors</span>
              <p className="text-small text-ink-secondary mt-0.5">
                Allows newly booked tutors to review your core target before lesson one.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-border p-4 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.shareRecurringErrors}
              onChange={(e) => setPrivacy({ ...privacy, shareRecurringErrors: e.target.checked })}
              className="mt-1 accent-primary"
            />
            <div>
              <span className="text-body font-semibold text-ink">Share Recurring Error Patterns</span>
              <p className="text-small text-ink-secondary mt-0.5">
                Helps subsequent tutors reinforce known stumbling blocks without rediscovering them from scratch.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-border p-4 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.shareVocabulary}
              onChange={(e) => setPrivacy({ ...privacy, shareVocabulary: e.target.checked })}
              className="mt-1 accent-primary"
            />
            <div>
              <span className="text-body font-semibold text-ink">Share Vocabulary Bank Across Instructors</span>
              <p className="text-small text-ink-secondary mt-0.5">
                Ensures past vocabulary exposure is visible to conversation coaches.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-border p-4 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.shareAssessmentNotes}
              onChange={(e) => setPrivacy({ ...privacy, shareAssessmentNotes: e.target.checked })}
              className="mt-1 accent-primary"
            />
            <div>
              <span className="text-body font-semibold text-ink">Share Private Tutor Assessment Notes</span>
              <p className="text-small text-ink-secondary mt-0.5">
                Strict privacy opt-in: Keep tutor personal notes private or share across instructors.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-border p-4 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.allowLessonAudioAnalysisConsent}
              onChange={(e) => setPrivacy({ ...privacy, allowLessonAudioAnalysisConsent: e.target.checked })}
              className="mt-1 accent-primary"
            />
            <div>
              <span className="text-body font-semibold text-ink">Consensual Live AI Session Transcription</span>
              <p className="text-small text-ink-secondary mt-0.5">
                Enable automated lesson outline transcription during live sessions with explicit consent.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving Changes…' : 'Save All Preferences'}
        </Button>
      </div>
    </div>
  )
}
