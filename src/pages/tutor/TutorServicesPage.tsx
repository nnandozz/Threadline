import { useState } from 'react'
import {
  MapPin,
  Video,
  Home,
  Layers,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { useAuth } from '@/context/AuthContext'
import { getTutorById, patchTutorProfile } from '@/lib/marketplaceStore'
import { publishTutorProfile } from '@/lib/tutorProfile'
import { formatINR } from '@/lib/utils'
import type { TeachingFormat, TutorPackage } from '@/types'

export function TutorServicesPage() {
  const { user, updateProfile } = useAuth()
  const existing = user ? getTutorById(user.id) : undefined
  const [hourlyRate, setHourlyRate] = useState<number>(existing?.pricePerHour ?? user?.pricePerHour ?? 600)
  const [formats, setFormats] = useState<TeachingFormat[]>(existing?.formats ?? ['online'])
  const [travelRadius, setTravelRadius] = useState<number>(existing?.location?.travelRadiusKm || 10)
  const [travelFee, setTravelFee] = useState<number>(existing?.location?.travelFee || 0)
  const [packages] = useState<TutorPackage[]>(existing?.packageOffers || [])
  const [savedNotice, setSavedNotice] = useState(false)

  function toggleFormat(fmt: TeachingFormat) {
    if (formats.includes(fmt)) {
      setFormats(formats.filter((f) => f !== fmt))
    } else {
      setFormats([...formats, fmt])
    }
  }

  function handleSave() {
    if (!user) return

    const current = getTutorById(user.id) ?? publishTutorProfile(user, { pricePerHour: hourlyRate, formats })
    patchTutorProfile(user.id, {
      pricePerHour: hourlyRate,
      formats,
      location: {
        city: current.location?.city ?? '',
        area: current.location?.area ?? '',
        country: current.location?.country ?? '',
        offersInPersonStudent: formats.includes('in-person-student'),
        offersInPersonTutor: formats.includes('in-person-tutor'),
        travelRadiusKm: travelRadius,
        travelFee,
        addressGeneral: current.location?.addressGeneral,
      },
    })
    updateProfile({ pricePerHour: hourlyRate })
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 3000)
  }

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-h1 text-ink">My Teaching Services & Rates</h1>
        <p className="text-body text-ink-secondary">
          Configure your pricing, lesson packages, online tools, and in-person travel service area.
        </p>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-success-light p-4 text-small font-semibold text-success border border-success/20">
          <CheckCircle2 size={18} />
          Your services, formats, and rates have been saved successfully!
        </div>
      )}

      {/* 1. Base Pricing */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-h3 text-ink mb-4">Base Hourly Rate</h2>
        <div className="flex flex-col gap-2 max-w-xs">
          <label className="text-small font-medium text-ink">Rate per hour (₹)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-ink-secondary">₹</span>
            <Input
              type="number"
              min="200"
              max="3000"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="pl-8 text-body font-bold"
            />
          </div>
          <p className="text-label text-ink-secondary">
            Students see this as your standard starting rate across individual lessons.
          </p>
        </div>
      </section>

      {/* 2. Formats Offered & In-Person Area */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-h3 text-ink mb-2">Teaching Formats Offered</h2>
        <p className="text-small text-ink-secondary mb-5">
          Select all arrangements you support. Offline tutoring allows setting studio visits vs traveling to students.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              id: 'online' as TeachingFormat,
              title: 'Online Video Sessions',
              desc: 'Live interactive video sessions with real-time notes.',
              icon: Video,
            },
            {
              id: 'in-person-tutor' as TeachingFormat,
              title: "At Tutor's Studio",
              desc: 'Students travel to your verified studio space in South Extension.',
              icon: MapPin,
            },
            {
              id: 'in-person-student' as TeachingFormat,
              title: 'In-Person (Home Visits)',
              desc: 'You travel directly to the student’s residence or local library.',
              icon: Home,
            },
            {
              id: 'hybrid' as TeachingFormat,
              title: 'Hybrid Tutoring',
              desc: 'Students can alternate between online check-ins and in-person sessions.',
              icon: Layers,
            },
          ].map((item) => {
            const Icon = item.icon
            const isSelected = formats.includes(item.id)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleFormat(item.id)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                    : 'border-border bg-slate-50/50 hover:bg-slate-50 text-ink-secondary'
                }`}
              >
                <Icon size={20} className={isSelected ? 'text-primary' : 'text-ink-secondary'} />
                <div>
                  <p className="font-bold text-ink">{item.title}</p>
                  <p className="text-small text-ink-secondary mt-0.5">{item.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Offline travel radius & fees if in-person-student is selected */}
        {formats.includes('in-person-student') && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-body font-bold text-ink mb-1">In-Person Travel Settings</h3>
            <p className="text-small text-ink-secondary mb-4">
              Specify how far you are willing to travel from your base location in Delhi NCR.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-small font-medium text-ink block mb-1">
                  Maximum Travel Radius (km): <strong className="text-primary">{travelRadius} km</strong>
                </label>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={travelRadius}
                  onChange={(e) => setTravelRadius(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div>
                <label className="text-small font-medium text-ink block mb-1">Travel Surcharge Fee (₹)</label>
                <Input
                  type="number"
                  min="0"
                  max="500"
                  value={travelFee}
                  onChange={(e) => setTravelFee(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Lesson Packages & Discount Bundles */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-h3 text-ink mb-4">Lesson Packages & Discounts</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {packages.map((pkg) => (
            <div key={pkg.id} className="flex flex-col justify-between rounded-xl border border-border p-4 bg-slate-50/50">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-label uppercase tracking-wider font-bold text-primary">
                    {pkg.discountPercent}% Discount
                  </span>
                  <FormatBadge format={pkg.format} />
                </div>
                <h4 className="font-bold text-ink">{pkg.title}</h4>
                <p className="text-small text-ink-secondary">
                  {pkg.lessonCount} sessions ({pkg.durationMinutes} mins each)
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-h3 font-bold text-ink">{formatINR(pkg.price)}</span>
                <span className="text-label text-ink-secondary">Active on profile</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          <Save size={16} />
          Save Service Changes
        </Button>
      </div>
    </div>
  )
}
