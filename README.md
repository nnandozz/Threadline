# Threadline

The tutoring marketplace with memory.

## Getting started

```bash
npm install
npm run dev
```

This will start Vite's dev server (default `http://localhost:5173`). Every route currently renders a placeholder except where noted — this is intentional; see "Current stage" below.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (design tokens in `tailwind.config.ts`)
- React Router v6
- lucide-react (icons)

No backend, no AI API, no WebRTC, no payments yet — everything currently renders from static mock data in `src/data/mockData.ts`.

## Architecture

```
src/
  components/
    ui/            Design-system primitives (Button, Input, Badge, Avatar, Card,
                    ProgressMetric, SkillTag, EmptyState, LoadingState, ErrorState)
    lesson/         LessonCard, HomeworkCard, InsightCard, Timeline
    tutor/          TutorCard
    layout/         AppShell, Sidebar (role-aware), Header
  pages/
    marketing/      MarketingLayout (public site chrome)
    auth/           AuthLayout (login/signup/onboarding chrome)
    student/        StudentLayout (authenticated student chrome)
    tutor/          TutorLayout (authenticated tutor chrome)
    Placeholder.tsx Temporary stand-in for routes not yet built
  data/
    mockData.ts     Single source of truth: Sarah (student), Alex (tutor),
                    lessons, homework, vocabulary, recurring errors, progress history
  types/
    index.ts        Domain model — the shape a real API should eventually match
  lib/
    utils.ts        cn() class-merge helper
  App.tsx           Full route tree
  main.tsx          Entry point
```

### Why one mock data file

Every screen — Sarah's dashboard, her lesson history, her progress page, Alex's tutor
dashboard, Alex's student brief — reads from the same `mockData.ts`. IDs cross-reference
each other (e.g. a `HomeworkItem.sourceLessonId` points at a real `Lesson.id`). This is
what will make Threadline's "memory" demonstrable rather than decorative once real pages
are built on top of it: change a value once, see it everywhere consistently.

### Why routes exist before pages

Every route in the approved information architecture is wired up now and renders
`<Placeholder />`. This means later steps replace one `element={...}` at a time without
touching routing, layouts, or navigation — the app is never in a "half-wired" state.

## Design tokens

Colors, type scale, radii, and shadows are defined once in `tailwind.config.ts` and
consumed via Tailwind utility classes (`bg-primary`, `text-ink-secondary`, `text-h2`,
etc.) — never hardcoded hex values in components.

## Current stage

**Foundation only:** design system, reusable components, AppShell, routing, and mock
data. No feature pages (landing, marketplace, dashboards, live lesson, etc.) have been
built yet — that's the next step.
