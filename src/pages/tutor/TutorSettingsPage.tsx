import { useState } from 'react'
import {
  User,
  MapPin,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { getTutorById, patchTutorProfile } from '@/lib/marketplaceStore'
import { publishTutorProfile } from '@/lib/tutorProfile'

export function TutorSettingsPage() {
  const { user, updateProfile } = useAuth()
  const existing = user ? getTutorById(user.id) : undefined
  const [headline, setHeadline] = useState(existing?.headline ?? user?.headline ?? '')
  const [bio, setBio] = useState(existing?.bio ?? user?.bio ?? '')
  const [studioAddress, setStudioAddress] = useState(existing?.location?.addressGeneral || '')
  const [savedNotice, setSavedNotice] = useState(false)

  function handleSave() {
    if (!user) return
    updateProfile({ headline, bio })
    const current = getTutorById(user.id) ?? publishTutorProfile(user, { bio })
    patchTutorProfile(user.id, {
      headline,
      bio,
      location: {
        city: current.location?.city ?? '',
        area: current.location?.area ?? '',
        country: current.location?.country ?? '',
        offersInPersonStudent: current.location?.offersInPersonStudent ?? false,
        offersInPersonTutor: current.location?.offersInPersonTutor ?? false,
        travelRadiusKm: current.location?.travelRadiusKm,
        travelFee: current.location?.travelFee,
        addressGeneral: studioAddress,
      },
    })
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-h1 text-ink">Tutor Profile & Studio Settings</h1>
        <p className="text-body text-ink-secondary">
          Update your public marketplace profile, instructor bio, qualifications, and teaching premises.
        </p>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-success-light p-4 text-small font-semibold text-success border border-success/20">
          <CheckCircle2 size={18} />
          Your tutor settings have been updated and synced to the marketplace.
        </div>
      )}

      {/* 1. Public Profile Card */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
          <User className="text-primary" size={20} />
          <h2 className="text-h3 text-ink">Marketplace Profile</h2>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatarUrl} name={user?.name || 'Tutor'} size="lg" className="h-20 w-20" />
            <div>
              <p className="font-bold text-ink text-body">{user?.name}</p>
              <p className="text-small text-ink-secondary">
                {existing?.yearsExperience
                  ? `${existing.yearsExperience} Years Experience`
                  : 'Marketplace tutor profile'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-small font-semibold text-ink block mb-1">Professional Headline</label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Conversational English & Exam Prep Specialist"
            />
          </div>

          <div>
            <label className="text-small font-semibold text-ink block mb-1">Public Bio & Teaching Philosophy</label>
            <Textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell prospective students about your methodology..."
            />
          </div>
        </div>
      </section>

      {/* 2. Studio Space & Teaching Location */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
          <MapPin className="text-success" size={20} />
          <h2 className="text-h3 text-ink">In-Person Teaching Studio</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-small font-semibold text-ink block mb-1">
              General Studio Area (Shown on Public Profile)
            </label>
            <Input
              value={studioAddress}
              onChange={(e) => setStudioAddress(e.target.value)}
              placeholder="e.g. South Extension Studio & Learning Space, New Delhi"
            />
            <p className="text-label text-ink-secondary mt-1">
              For privacy and safety, students only receive exact room details upon booking confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          <Save size={16} />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
