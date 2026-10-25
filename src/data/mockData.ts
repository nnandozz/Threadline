import type {
  Tutor,
  Student,
  Lesson,
  HomeworkItem,
  VocabularyWord,
  RecurringError,
  ProgressPoint,
  Course,
  Booking,
  StudentLearningPreferences,
  AIMemoryPrivacySettings,
} from '@/types'

// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH — THREADLINE UNIFIED MARKETPLACE
//
// Every screen (Student dashboard, Tutor dashboard, Explore,
// Course catalogs, Lesson summaries, Booking flows...)
// reads from this unified dataset.
// ─────────────────────────────────────────────────────────────

export const CURRENT_STUDENT_ID = 'student-ananya'
export const CURRENT_TUTOR_ID = 'tutor-rohan'

export const rohanMehta: Tutor = {
  id: CURRENT_TUTOR_ID,
  role: 'tutor',
  name: 'Rohan Mehta',
  avatarUrl: 'https://i.pravatar.cc/200?img=13',
  headline: 'Spoken English, IELTS & Interview Communication Coach',
  bio: 'I help working professionals and students move from hesitant English to confident, natural conversation. 7 years coaching IELTS aspirants and corporate professionals across Delhi NCR, with a focus on speaking fluency and real-world grammar.',
  rating: 4.9,
  reviewCount: 214,
  languages: ['English (Fluent)', 'Hindi (Native)'],
  specialties: ['Conversational English', 'IELTS Speaking', 'Interview Prep', 'Grammar Foundations'],
  subjectCategories: ['Languages', 'Business'],
  educationLevels: ['Intermediate', 'Upper Intermediate', 'Advanced', 'Professional'],
  teachingStyle: 'Structured but conversational — every session builds on the previous one, with real dialogue over rote drills.',
  pricePerHour: 600,
  yearsExperience: 7,
  formats: ['online', 'hybrid'],
  location: {
    city: 'Delhi NCR',
    area: 'Connaught Place',
    country: 'India',
    travelRadiusKm: 10,
    offersInPersonStudent: false,
    offersInPersonTutor: true,
    travelFee: 0,
    addressGeneral: 'Language Lab Studio, Connaught Place, New Delhi',
  },
  qualifications: ['CELTA Certified (British Council India)', 'MA English (Delhi University)'],
  verificationStatus: 'verified',
  badges: ['Top Rated', 'Super Tutor', 'Fast Responder'],
  packageOffers: [
    {
      id: 'pkg-rohan-5',
      title: '5-Session Confidence Sprint',
      lessonCount: 5,
      durationMinutes: 45,
      discountPercent: 10,
      price: 2700, // ₹600 × 5 × 0.9
      format: 'online',
    },
    {
      id: 'pkg-rohan-10',
      title: '10-Session Fluency & IELTS Package',
      lessonCount: 10,
      durationMinutes: 60,
      discountPercent: 15,
      price: 5100, // ₹600 × 10 × 0.85
      format: 'hybrid',
    },
  ],
  availability: [
    { date: '2026-08-11', times: ['09:00', '14:00', '19:00'] },
    { date: '2026-08-12', times: ['10:00', '17:30'] },
    { date: '2026-08-13', times: ['09:00', '13:00', '19:00'] },
    { date: '2026-08-14', times: ['11:00', '16:00', '19:00'] },
    { date: '2026-08-15', times: ['10:00', '14:00'] },
  ],
}

export const priyaSharma: Tutor = {
  id: 'tutor-priya',
  role: 'tutor',
  name: 'Priya Sharma',
  avatarUrl: 'https://i.pravatar.cc/200?img=32',
  headline: 'Corporate English & Executive Communication Coach',
  bio: 'Former corporate trainer at a Big 4 firm turned English tutor. I help professionals at MNCs and Indian companies sound polished and precise in meetings, negotiations, and client presentations — because clarity wins deals.',
  rating: 4.8,
  reviewCount: 156,
  languages: ['English (Fluent)', 'Hindi (Native)', 'Marathi (Native)'],
  specialties: ['Business English', 'IELTS Speaking', 'Interview Prep', 'Presentation Skills'],
  subjectCategories: ['Languages', 'Business'],
  educationLevels: ['Intermediate', 'Advanced', 'Professional'],
  teachingStyle: 'Direct and goal-oriented — we set a measurable target each session and track progress honestly.',
  pricePerHour: 750,
  yearsExperience: 9,
  formats: ['online'],
  location: {
    city: 'Mumbai',
    area: 'Bandra West',
    country: 'India',
    travelRadiusKm: 0,
    offersInPersonStudent: false,
    offersInPersonTutor: false,
  },
  qualifications: ['MA Applied Linguistics (Mumbai University)', 'Certified Business Communication Trainer'],
  verificationStatus: 'verified',
  badges: ['Corporate Trainer', 'IELTS Specialist'],
  availability: [
    { date: '2026-08-12', times: ['08:00', '12:00', '18:00'] },
    { date: '2026-08-13', times: ['08:00', '15:00'] },
    { date: '2026-08-14', times: ['08:00', '12:00', '18:00'] },
    { date: '2026-08-16', times: ['09:00', '13:00'] },
  ],
}

export const ishaanMalhotra: Tutor = {
  id: 'tutor-ishaan',
  role: 'tutor',
  name: 'Ishaan Malhotra',
  avatarUrl: 'https://i.pravatar.cc/200?img=51',
  headline: 'Spoken English, Pronunciation & Accent Training Coach',
  bio: 'I work on the sounds that trip up Hindi and regional-language speakers most — TH sounds, vowel length, word stress, and connected speech — inside real conversation, not isolated drills. Patient, practical, and detail-oriented.',
  rating: 4.7,
  reviewCount: 98,
  languages: ['English (Fluent)', 'Hindi (Native)', 'Punjabi (Native)'],
  specialties: ['Pronunciation & Accent', 'Spoken English', 'Grammar Foundations'],
  subjectCategories: ['Languages'],
  educationLevels: ['Beginner', 'Elementary', 'Intermediate'],
  teachingStyle: 'Warm and encouraging, with specific, actionable correction that does not interrupt your conversational flow.',
  pricePerHour: 500,
  yearsExperience: 5,
  formats: ['online', 'in-person-student'],
  location: {
    city: 'Pune',
    area: 'Kothrud',
    country: 'India',
    travelRadiusKm: 8,
    offersInPersonStudent: true,
    offersInPersonTutor: false,
    travelFee: 100,
    addressGeneral: 'Available for in-home lessons across Pune (Kothrud, Karve Nagar, Bavdhan)',
  },
  qualifications: ['BA Linguistics & Phonetics (Pune University)', 'TESOL Certified'],
  verificationStatus: 'verified',
  availability: [
    { date: '2026-08-11', times: ['16:00', '20:00'] },
    { date: '2026-08-13', times: ['10:00', '16:00', '20:00'] },
    { date: '2026-08-15', times: ['11:00', '15:00', '18:00'] },
  ],
}

export const drArvindSen: Tutor = {
  id: 'tutor-arvind',
  role: 'tutor',
  name: 'Dr. Arvind Sen',
  avatarUrl: 'https://i.pravatar.cc/200?img=68',
  headline: 'DSA, System Design & AI Specialist (Ex-Google / IIT Delhi Ph.D.)',
  bio: 'IIT Delhi Ph.D. in Computer Science with 8 years building ML systems in industry at Google and Flipkart. I mentor B.Tech students and software engineers through data structures, algorithm design, system architecture, and modern PyTorch deep learning for FAANG and product company placements.',
  rating: 5.0,
  reviewCount: 312,
  languages: ['English (Fluent)', 'Hindi (Native)', 'Bengali (Native)'],
  specialties: ['Data Structures & Algorithms', 'Machine Learning', 'Python & C++', 'System Design', 'Competitive Programming'],
  subjectCategories: ['Programming & CS', 'Mathematics', 'Competitive Exams'],
  educationLevels: ['University', 'Professional', 'Advanced'],
  teachingStyle: 'First-principles intuition followed by rigorous coding and whiteboard-style breakdown. No hand-waving — you will understand the why, not just the how.',
  pricePerHour: 1200,
  yearsExperience: 8,
  formats: ['online', 'in-person-tutor', 'hybrid', 'group'],
  location: {
    city: 'Bengaluru',
    area: 'Koramangala',
    country: 'India',
    travelRadiusKm: 12,
    offersInPersonStudent: false,
    offersInPersonTutor: true,
    travelFee: 0,
    addressGeneral: 'TechHive Learning Studio, Koramangala 5th Block, Bengaluru',
  },
  qualifications: ['Ph.D. Computer Science (IIT Delhi)', 'Former Senior ML Engineer at Google India', 'ICPC Asia Regional Medalist'],
  verificationStatus: 'verified',
  badges: ['Distinguished Educator', 'Top CS Tutor', 'FAANG Mentor'],
  packageOffers: [
    {
      id: 'pkg-arvind-placement',
      title: 'DSA & Interview Sprint (6 Sessions)',
      lessonCount: 6,
      durationMinutes: 60,
      discountPercent: 12,
      price: 6336, // ₹1200 × 6 × 0.88
      format: 'hybrid',
    },
    {
      id: 'pkg-arvind-ai',
      title: 'ML & System Design Deep Dive (10 Sessions)',
      lessonCount: 10,
      durationMinutes: 60,
      discountPercent: 15,
      price: 10200, // ₹1200 × 10 × 0.85
      format: 'online',
    },
  ],
  availability: [
    { date: '2026-08-12', times: ['11:00', '15:00', '18:00'] },
    { date: '2026-08-14', times: ['10:00', '14:00', '17:00'] },
    { date: '2026-08-16', times: ['12:00', '16:00', '19:00'] },
    { date: '2026-08-18', times: ['10:00', '15:00'] },
    { date: '2026-08-22', times: ['11:00', '14:00', '17:00'] },
  ],
}

export const aditiVerma: Tutor = {
  id: 'tutor-aditi',
  role: 'tutor',
  name: 'Aditi Verma',
  avatarUrl: 'https://i.pravatar.cc/200?img=44',
  headline: 'JEE Advanced & Olympiad Mathematics Coach (IIT Bombay M.Sc.)',
  bio: 'Specialist in JEE Main/Advanced, Class 11-12 CBSE/ICSE Mathematics, calculus, linear algebra, and competitive math olympiads. IIT Bombay M.Sc. alumni. I teach both online and in-person across Chandigarh, travelling directly to students\'  homes.',
  rating: 4.9,
  reviewCount: 184,
  languages: ['English (Fluent)', 'Hindi (Native)', 'Punjabi (Conversational)'],
  specialties: ['JEE Advanced Mathematics', 'Calculus & Analysis', 'Linear Algebra', 'Olympiad Mathematics', 'Probability & Statistics'],
  subjectCategories: ['Mathematics', 'Competitive Exams', 'Science'],
  educationLevels: ['School (Class 11-12)', 'JEE/NEET Prep', 'University'],
  teachingStyle: 'Visual geometric intuition backed by step-by-step rigorous proof mechanics. Encouraging and uncompromising on conceptual clarity.',
  pricePerHour: 800,
  yearsExperience: 6,
  formats: ['online', 'in-person-student', 'in-person-tutor', 'hybrid'],
  location: {
    city: 'Chandigarh',
    area: 'Sector 35 & Sector 17',
    country: 'India',
    travelRadiusKm: 15,
    offersInPersonStudent: true,
    offersInPersonTutor: true,
    travelFee: 150,
    addressGeneral: 'Math Olympiad Hub, Sector 35C, Chandigarh & in-home visits across Tricity (Chandigarh, Mohali, Panchkula)',
  },
  qualifications: ['M.Sc. Mathematics (IIT Bombay)', 'B.Sc. Mathematics with Distinction (Panjab University)', 'National Mathematics Olympiad Gold Medalist'],
  verificationStatus: 'verified',
  badges: ['Olympiad Coach', 'JEE Expert'],
  packageOffers: [
    {
      id: 'pkg-aditi-exam',
      title: 'JEE Advanced Exam Intensive (8 Sessions)',
      lessonCount: 8,
      durationMinutes: 60,
      discountPercent: 10,
      price: 5760, // ₹800 × 8 × 0.9
      format: 'hybrid',
    },
  ],
  availability: [
    { date: '2026-08-13', times: ['10:00', '14:00', '18:00'] },
    { date: '2026-08-15', times: ['09:30', '13:00', '17:00'] },
    { date: '2026-08-18', times: ['11:00', '15:00', '19:00'] },
    { date: '2026-08-20', times: ['10:00', '16:00'] },
  ],
}

export const arjunMehra: Tutor = {
  id: 'tutor-arjun',
  role: 'tutor',
  name: 'Arjun Mehra',
  avatarUrl: 'https://i.pravatar.cc/200?img=59',
  headline: 'Full-Stack Web Architect & Modern TypeScript / React Instructor',
  bio: 'Building web products for over a decade across Indian startups and product companies. I mentor students through end-to-end full-stack development with TypeScript, React, Node, and PostgreSQL. I also run interactive group cohorts with live code reviews focused on placement-ready projects.',
  rating: 4.9,
  reviewCount: 142,
  languages: ['English (Fluent)', 'Hindi (Native)'],
  specialties: ['React & Next.js', 'TypeScript & Node.js', 'Web Architecture', 'Database Design', 'Career Mentorship'],
  subjectCategories: ['Programming & CS', 'Business'],
  educationLevels: ['Beginner', 'Intermediate', 'Professional'],
  teachingStyle: 'Hands-on project development. We build real production-grade applications together from line one — no slides, only code.',
  pricePerHour: 900,
  yearsExperience: 10,
  formats: ['online', 'group', 'hybrid'],
  location: {
    city: 'Gurugram',
    area: 'Cyber City',
    country: 'India',
    travelRadiusKm: 10,
    offersInPersonStudent: false,
    offersInPersonTutor: true,
    addressGeneral: 'DevCraft Studio, DLF Cyber City, Gurugram, Haryana',
  },
  qualifications: ['B.Tech Computer Science (NIT Trichy)', 'Former Lead Frontend at Zomato', 'Open Source Contributor (React India)'],
  verificationStatus: 'verified',
  badges: ['Cohort Leader', 'Code Reviewer'],
  availability: [
    { date: '2026-08-12', times: ['17:00', '19:00'] },
    { date: '2026-08-14', times: ['14:00', '18:00', '20:00'] },
    { date: '2026-08-17', times: ['16:00', '19:00'] },
  ],
}

export const drTariqAhmed: Tutor = {
  id: 'tutor-tariq',
  role: 'tutor',
  name: 'Dr. Tariq Ahmed',
  avatarUrl: 'https://i.pravatar.cc/200?img=12',
  headline: 'JEE/NEET Physics & Engineering Mechanics Expert (IIT Kharagpur Ph.D.)',
  bio: 'Passionate about making physics intuitive for every student. Whether cracking JEE Advanced mechanics, NEET biophysics, or mastering Class 11-12 CBSE physics, I help students build crystal-clear conceptual frameworks through Socratic questioning and problem-solving sprints.',
  rating: 4.8,
  reviewCount: 95,
  languages: ['English (Fluent)', 'Hindi (Native)', 'Urdu (Native)'],
  specialties: ['Classical Mechanics', 'Electromagnetism', 'JEE Advanced Physics', 'NEET Physics', 'Engineering Mathematics'],
  subjectCategories: ['Science', 'Mathematics', 'Competitive Exams'],
  educationLevels: ['School (Class 11-12)', 'JEE/NEET Prep', 'University'],
  teachingStyle: 'Socratic questioning with conceptual diagrams, derivation walkthroughs, and past JEE/NEET problem sprints.',
  pricePerHour: 850,
  yearsExperience: 12,
  formats: ['online', 'in-person-student', 'in-person-tutor'],
  location: {
    city: 'Delhi NCR',
    area: 'Hauz Khas & South Delhi',
    country: 'India',
    travelRadiusKm: 14,
    offersInPersonStudent: true,
    offersInPersonTutor: true,
    travelFee: 200,
    addressGeneral: 'Physics Lab Studio, Hauz Khas Village, New Delhi & Home visits across South Delhi',
  },
  qualifications: ['Ph.D. Applied Physics (IIT Kharagpur)', 'M.Sc. Physics (AMU)', 'Former Faculty at FIITJEE Delhi'],
  verificationStatus: 'verified',
  badges: ['JEE Expert', 'NEET Specialist', 'STEM Mentor'],
  availability: [
    { date: '2026-08-13', times: ['14:00', '17:00'] },
    { date: '2026-08-15', times: ['10:00', '15:00'] },
    { date: '2026-08-19', times: ['13:00', '18:00'] },
  ],
}

export const kavyaIyer: Tutor = {
  id: 'tutor-kavya',
  role: 'tutor',
  name: 'Kavya Iyer',
  avatarUrl: 'https://i.pravatar.cc/200?img=49',
  headline: 'Classical & Contemporary Piano — Trinity College London & ABRSM Grades',
  bio: 'Carnatic-trained classical pianist and music educator. I offer private piano tuition at my Yamaha studio in Chennai for all grades, as well as online music theory, harmony, and Carnatic-Western fusion classes for students of all ages and backgrounds.',
  rating: 5.0,
  reviewCount: 88,
  languages: ['English (Fluent)', 'Tamil (Native)', 'Hindi (Conversational)'],
  specialties: ['Classical Piano (Grades 1-8 & Diploma)', 'Music Theory (Trinity/ABRSM)', 'Aural Skills', 'Carnatic Fusion', 'Composition'],
  subjectCategories: ['Music & Arts'],
  educationLevels: ['Beginner', 'Intermediate', 'Advanced', 'All Ages'],
  teachingStyle: 'Artistic sensitivity paired with ergonomic technique, rooted in Indian classical sensibility.',
  pricePerHour: 700,
  yearsExperience: 8,
  formats: ['in-person-tutor', 'online', 'hybrid'],
  location: {
    city: 'Chennai',
    area: 'Adyar & Besant Nagar',
    country: 'India',
    travelRadiusKm: 0,
    offersInPersonStudent: false,
    offersInPersonTutor: true,
    addressGeneral: 'Swaralaya Piano Studio, Adyar, Chennai',
  },
  qualifications: ['Diploma in Western Classical Piano (Trinity College London)', 'Grade 8 ABRSM with Distinction', 'Visiting Faculty — KM Music Conservatory, Chennai'],
  verificationStatus: 'verified',
  badges: ['Concert Artist', 'Trinity Examiner', 'ABRSM Specialist'],
  availability: [
    { date: '2026-08-12', times: ['10:00', '14:00', '16:00'] },
    { date: '2026-08-14', times: ['11:00', '15:00'] },
    { date: '2026-08-16', times: ['13:00', '17:00'] },
  ],
}

export const allTutors: Tutor[] = [
  rohanMehta,
  drArvindSen,
  aditiVerma,
  priyaSharma,
  arjunMehra,
  drTariqAhmed,
  kavyaIyer,
  ishaanMalhotra,
]

// Legacy export aliases for backward compatibility with existing imports
export const alexMorgan = rohanMehta
export const drArisThorne = drArvindSen
export const elenaRostova = aditiVerma
export const devonVance = arjunMehra
export const drTariqAlMansoor = drTariqAhmed
export const marcusWebb = ishaanMalhotra
export const mayaLin = kavyaIyer

// ─────────────────────────────────────────────────────────────
// STRUCTURED COURSES & LEARNING PROGRAMMES
// ─────────────────────────────────────────────────────────────

export const courseDsa: Course = {
  id: 'course-dsa',
  tutorId: 'tutor-arvind',
  title: 'Data Structures & Algorithms: Placement & FAANG/Unicorn Mastery',
  subtitle: 'Master algorithmic problem solving, graph algorithms, and dynamic programming with live whiteboard coaching by an Ex-Google IIT mentor.',
  description: 'An intensive, live cohort programme designed for B.Tech students and practicing engineers preparing for top-tier technical interviews at FAANG and Indian unicorn companies (Flipkart, Swiggy, CRED, Razorpay). Each module blends algorithmic intuition, formal complexity proofs, and hands-on coding patterns in Python and C++.',
  subject: 'Computer Science',
  category: 'Programming & CS',
  level: 'Intermediate to Advanced',
  format: 'online',
  price: 4500,
  totalHours: 32,
  weeksDuration: 8,
  startDate: '2026-09-01',
  schedule: 'Tuesdays & Thursdays · 7:00 PM – 9:00 PM IST',
  maxCapacity: 16,
  enrolledCount: 11,
  rating: 4.9,
  reviewCount: 42,
  imageUrl: 'https://images.unsplash.com/photo-1516116211227-bbc8bebe9f76?auto=format&fit=crop&w=600&q=80',
  learningObjectives: [
    'Master Trees, Graphs, Heaps, and Dynamic Programming with time/space proofs',
    'Conquer LeetCode medium and hard patterns with systematic heuristics',
    'Simulate live FAANG coding whiteboard interviews with peer feedback',
    'Build intuition for concurrency and distributed data structures',
  ],
  prerequisites: ['Basic familiarity with any programming language (Python, C++, Java)', 'Basic high school algebra'],
  syllabus: [
    {
      id: 'mod-1',
      title: 'Module 1: Complexity, Arrays, Sliding Windows & Two Pointers',
      description: 'Asymptotic notation, amortized analysis, two pointers, prefix sums, and fast sliding window templates.',
      durationHours: 4,
      topics: ['Big-O Analysis', 'Two Pointers', 'Sliding Window', 'Binary Search Variants'],
    },
    {
      id: 'mod-2',
      title: 'Module 2: Linked Structures, Stacks, Queues & Monotonic Sequences',
      description: 'Pointer manipulation, memory cache-locality, monotonic stack architectures, and expression evaluation.',
      durationHours: 4,
      topics: ['Fast & Slow Pointers', 'Monotonic Stack', 'LRU Cache Design', 'Deque Applications'],
    },
    {
      id: 'mod-3',
      title: 'Module 3: Trees, Binary Search Trees & Trie Indexing',
      description: 'Recursive traversals, LCA algorithms, balanced trees, and prefix search data structures.',
      durationHours: 6,
      topics: ['DFS/BFS on Trees', 'Lowest Common Ancestor', 'BST Validation & Balancing', 'Trie Construction'],
    },
    {
      id: 'mod-4',
      title: 'Module 4: Graph Traversals, Topo Sort & Shortest Paths',
      description: 'Adjacency models, cycle detection, Kahn algorithm, Dijkstra, and Union-Find disjoint sets.',
      durationHours: 8,
      topics: ['Connected Components', 'Topological Sorting', 'Dijkstra & A*', 'Disjoint Set Union (DSU)'],
    },
    {
      id: 'mod-5',
      title: 'Module 5: Dynamic Programming & Memoization Patterns',
      description: 'Optimal substructure, overlapping subproblems, 1D/2D memoization grids, knapsack, and state compression.',
      durationHours: 10,
      topics: ['0/1 Knapsack', 'Longest Common Subsequence', 'Interval DP', 'Bitmask DP'],
    },
  ],
}

export const courseFullstack: Course = {
  id: 'course-fullstack',
  tutorId: 'tutor-arjun',
  title: 'Full-Stack Web Development: React, Node & TypeScript for Indian Builders',
  subtitle: 'Build and deploy scalable, production-grade web applications — from idea to deployment on AWS/Vercel.',
  description: 'A hands-on, project-driven cohort. You will build three real-world web apps with Indian context: a EdTech platform, a Zomato-style delivery dashboard, and a UPI payments integration service. Mentored by an ex-Zomato architect.',
  subject: 'Software Engineering',
  category: 'Programming & CS',
  level: 'Beginner to Intermediate',
  format: 'group',
  price: 3800,
  totalHours: 24,
  weeksDuration: 6,
  startDate: '2026-09-08',
  schedule: 'Mondays & Wednesdays · 8:00 PM – 10:00 PM IST',
  maxCapacity: 20,
  enrolledCount: 17,
  rating: 4.8,
  reviewCount: 38,
  imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
  learningObjectives: [
    'Deeply understand React 18, Server Components, and client state architecture',
    'Write clean, strictly-typed TypeScript across frontend and Node backend',
    'Design relational database schemas with PostgreSQL and Prisma',
    'Deploy containerized applications with automated CI/CD pipelines',
  ],
  prerequisites: ['Basic HTML/CSS and introductory JavaScript'],
  syllabus: [
    {
      id: 'fs-1',
      title: 'Modern TypeScript & Frontend Architecture',
      description: 'Generics, union types, component composition, and responsive Tailwind styling.',
      durationHours: 6,
      topics: ['TypeScript Foundations', 'React Hooks in Depth', 'Component Patterns'],
    },
    {
      id: 'fs-2',
      title: 'Backend Services, REST & GraphQL APIs',
      description: 'Express, Fastify, asynchronous processing, validation, and JWT authentication.',
      durationHours: 6,
      topics: ['Node.js Event Loop', 'RESTful API Design', 'Authentication & Sessions'],
    },
    {
      id: 'fs-3',
      title: 'Databases, ORMs & Cloud Deployment',
      description: 'Postgres migrations, index optimization, Docker packaging, and cloud hosting.',
      durationHours: 12,
      topics: ['PostgreSQL & Prisma', 'Data Integrity', 'Docker & CI/CD Deployment'],
    },
  ],
}

export const courseCalculus: Course = {
  id: 'course-calculus',
  tutorId: 'tutor-aditi',
  title: 'JEE Advanced Mathematics & Calculus: Complete Mastery Programme',
  subtitle: 'Multivariable calculus, vectors, matrix diagonalization, and JEE/university-level proof writing.',
  description: 'Designed for Class 11-12 students targeting JEE Advanced and B.Tech/B.Sc STEM undergraduates. Combines weekly live online problem-solving sessions with in-person workshop weekends in Chandigarh. Covers the full JEE Advanced Mathematics syllabus and beyond.',
  subject: 'Mathematics',
  category: 'Mathematics',
  level: 'Class 11-12 / JEE Advanced',
  format: 'hybrid',
  price: 3500,
  totalHours: 20,
  weeksDuration: 6,
  startDate: '2026-09-12',
  schedule: 'Saturdays (Workshop) 10:00 AM IST + Wednesdays (Online) 7:00 PM IST',
  maxCapacity: 12,
  enrolledCount: 8,
  rating: 4.9,
  reviewCount: 29,
  imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
  learningObjectives: [
    'Master partial differentiation, gradient fields, and Lagrange multipliers',
    'Solve double and triple integrals with polar, cylindrical, and spherical coordinates',
    'Understand eigenvalues, eigenvectors, and singular value decomposition (SVD)',
    'Formulate clear, logically irrefutable mathematical proofs',
  ],
  prerequisites: ['Single-variable calculus (differentiation & integration)', 'Basic algebra'],
  syllabus: [
    {
      id: 'calc-1',
      title: 'Multivariable Derivatives & Optimization',
      description: 'Directional derivatives, tangent planes, Hessian matrices, and constrained optimization.',
      durationHours: 6,
      topics: ['Gradient Vectors', 'Lagrange Multipliers', 'Taylor Series in Several Variables'],
    },
    {
      id: 'calc-2',
      title: 'Multiple Integrals & Vector Analysis',
      description: 'Green theorem, Stokes theorem, and divergence theorem.',
      durationHours: 7,
      topics: ['Surface Integrals', 'Flux & Circulation', 'Stokes & Divergence Theorems'],
    },
    {
      id: 'calc-3',
      title: 'Linear Spaces, Eigenvalues & Spectral Theory',
      description: 'Vector spaces, kernel/image, orthogonal projections, and spectral decomposition.',
      durationHours: 7,
      topics: ['Inner Product Spaces', 'Gram-Schmidt Process', 'Eigendecomposition & SVD'],
    },
  ],
}

export const courseBusinessEnglish: Course = {
  id: 'course-business-english',
  tutorId: 'tutor-rohan',
  title: 'Executive Communication & High-Stakes Business English',
  subtitle: 'Speak with authority in global client meetings, investor pitches, and IELTS OET interviews.',
  description: 'For Indian corporate managers, startup founders, and tech leads who want to present ideas in English with precision, diplomatic subtlety, and executive confidence — whether addressing a global boardroom or an IELTS examiner.',
  subject: 'Business English',
  category: 'Languages',
  level: 'Intermediate to Advanced',
  format: 'online',
  price: 2800,
  totalHours: 16,
  weeksDuration: 4,
  startDate: '2026-09-05',
  schedule: 'Tuesdays & Thursdays · 8:00 PM – 10:00 PM IST',
  maxCapacity: 10,
  enrolledCount: 7,
  rating: 4.9,
  reviewCount: 31,
  imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
  learningObjectives: [
    'Diplomatic phrasing and negotiation rhetoric for tense discussions',
    'Concise executive summaries and structured impromptu responses',
    'Eliminating filler words, hesitations, and awkward idioms',
    'Pitching complex technical or business proposals persuasively',
  ],
  prerequisites: ['Intermediate English conversational ability (B2+)'],
  syllabus: [
    {
      id: 'be-1',
      title: 'Diplomatic Language & Strategic Negotiation',
      description: 'Softening assertions, disagreeing constructively, and guiding meetings.',
      durationHours: 4,
      topics: ['Hedging & Softeners', 'Tactful Disagreement', 'Agenda Control'],
    },
    {
      id: 'be-2',
      title: 'Presentation Delivery & Vocal Dynamics',
      description: 'Stress patterns, pacing, pausing, and slide narration.',
      durationHours: 6,
      topics: ['Storytelling Structures', 'Slide Walkthroughs', 'Q&A Defense'],
    },
    {
      id: 'be-3',
      title: 'Executive Written Communication & Rapid Synthesis',
      description: 'Crafting high-impact memos, proposals, and handling tough stakeholder inquiries.',
      durationHours: 6,
      topics: ['High-Stakes Emails', 'Crisp Status Reports', 'Impromptu Speaking'],
    },
  ],
}

export const courseAiPytorch: Course = {
  id: 'course-ai-pytorch',
  tutorId: 'tutor-arvind',
  title: 'Deep Learning & Neural Networks with PyTorch — From Scratch',
  subtitle: 'Build CNNs, Transformers, and LLMs with hands-on GPU training and real Indian dataset projects.',
  description: 'Go beyond boilerplate APIs. Implement backpropagation, tensor mechanics, attention mechanisms, and fine-tune open-weights LLMs on Indian-context datasets (regional language NLP, healthcare AI, e-commerce recommendations). Designed for B.Tech CS/ECE students and software engineers targeting AI/ML roles.',
  subject: 'Artificial Intelligence',
  category: 'Programming & CS',
  level: 'Intermediate',
  format: 'online',
  price: 5000,
  totalHours: 32,
  weeksDuration: 8,
  startDate: '2026-09-15',
  schedule: 'Wednesdays · 7:00 PM – 11:00 PM IST',
  maxCapacity: 14,
  enrolledCount: 12,
  rating: 5.0,
  reviewCount: 35,
  imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
  learningObjectives: [
    'Implement neural network tensors and autograd from mathematical principles',
    'Build and train Vision Transformers (ViT) and sequence models in PyTorch',
    'Understand Scaled Dot-Product Attention and Multi-Head Attention architecture',
    'Fine-tune open-source models using LoRA and parameter-efficient techniques',
  ],
  prerequisites: ['Proficient in Python', 'Introductory calculus and matrix algebra'],
  syllabus: [
    {
      id: 'ai-1',
      title: 'Tensors, Autograd & Building a Mini-PyTorch Engine',
      description: 'Computation graphs, reverse-mode autodiff, loss landscapes, and stochastic gradient descent.',
      durationHours: 8,
      topics: ['Computational Graphs', 'Backpropagation', 'Optimizers (AdamW, RMSprop)'],
    },
    {
      id: 'ai-2',
      title: 'Convolutional & Recurrent Neural Architectures',
      description: 'Convolutions, receptive fields, residual connections, and sequence processing.',
      durationHours: 8,
      topics: ['ResNet Architectures', 'Normalization Layers', 'Sequence Embeddings'],
    },
    {
      id: 'ai-3',
      title: 'Transformers, Self-Attention & LLM Fine-Tuning',
      description: 'Positional encodings, causal masks, KV cache, and Low-Rank Adaptation (LoRA).',
      durationHours: 16,
      topics: ['Multi-Head Attention', 'Causal Language Modeling', 'LoRA & PEFT Fine-Tuning'],
    },
  ],
}

export const allCourses: Course[] = [
  courseDsa,
  courseFullstack,
  courseCalculus,
  courseBusinessEnglish,
  courseAiPytorch,
]

// ─────────────────────────────────────────────────────────────
// INITIAL MOCK BOOKINGS & ENROLLMENTS FOR ANANYA SHARMA
// ─────────────────────────────────────────────────────────────

export const initialBookings: Booking[] = [
  {
    id: 'booking-upcoming-online',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    type: 'single',
    subject: 'Conversational English',
    format: 'online',
    date: '2026-08-14',
    time: '19:00',
    durationMinutes: 30,
    price: 600, // ₹600/hr × 0.5hr
    status: 'confirmed',
    onlineMeetingUrl: '/lesson/lesson-aug14/live',
    notes: 'Focus on storytelling and narrating past project experiences using present perfect naturally.',
    createdAt: '2026-08-10',
  },
  {
    id: 'booking-upcoming-inperson',
    studentId: CURRENT_STUDENT_ID,
    tutorId: 'tutor-aditi',
    type: 'single',
    subject: 'JEE Advanced Mathematics & Calculus',
    format: 'in-person-student',
    date: '2026-08-18',
    time: '15:00',
    durationMinutes: 60,
    price: 950, // ₹800/hr + ₹150 travel fee
    status: 'confirmed',
    locationDetails: 'Student residence (South Extension, Delhi NCR)',
    notes: 'Review multivariable partial differentiation and JEE gradient problem sets.',
    createdAt: '2026-08-11',
  },
  {
    id: 'booking-upcoming-cs',
    studentId: CURRENT_STUDENT_ID,
    tutorId: 'tutor-arvind',
    type: 'single',
    subject: 'Algorithms & Data Structures',
    format: 'online',
    date: '2026-08-22',
    time: '11:00',
    durationMinutes: 60,
    price: 1200, // ₹1200/hr
    status: 'confirmed',
    onlineMeetingUrl: '/lesson/lesson-algo-live/live',
    notes: 'Walkthrough of binary search variations and sliding window patterns for placement prep.',
    createdAt: '2026-08-12',
  },
]

export const initialEnrolledCourseIds: string[] = ['course-dsa']
export const initialSavedTutorIds: string[] = ['tutor-arvind', 'tutor-aditi']

export const defaultLearningPreferences: StudentLearningPreferences = {
  targetSubjects: ['English', 'Programming & CS', 'Mathematics'],
  educationLevel: 'B.Tech / University',
  preferredFormats: ['online', 'in-person-student', 'hybrid'],
  city: 'Delhi NCR',
  area: 'South Delhi & Gurugram',
  maxBudgetPerHour: 1500,
  weeklyAvailability: ['Weekday evenings', 'Weekend mornings'],
  learningGoal: 'Master DSA algorithms for FAANG/unicorn placement while building confident English communication skills for corporate and client-facing roles.',
}

export const defaultAiPrivacySettings: AIMemoryPrivacySettings = {
  shareGoals: true,
  shareRecurringErrors: true,
  shareVocabulary: true,
  shareAssessmentNotes: false, // private notes require explicit consent
  allowLessonAudioAnalysisConsent: true,
}

// ─────────────────────────────────────────────────────────────
// VOCABULARY, ERRORS & MEMORY DATA
// ─────────────────────────────────────────────────────────────

export const sarahVocabulary: VocabularyWord[] = [
  {
    id: 'vocab-1',
    word: 'itinerary',
    definition: 'A planned route or schedule for a journey.',
    exampleSentence: 'Our itinerary includes three days in Lisbon before heading south.',
    mastery: 'learning',
    sourceLessonId: 'lesson-aug10',
    dateAdded: '2026-08-10',
  },
  {
    id: 'vocab-2',
    word: 'reservation',
    definition: 'An arrangement to have a table, room, or seat kept for you.',
    exampleSentence: 'I made a reservation for two at seven o’clock.',
    mastery: 'mastered',
    sourceLessonId: 'lesson-aug04',
    dateAdded: '2026-08-04',
  },
  {
    id: 'vocab-3',
    word: 'destination',
    definition: 'The place someone is travelling to.',
    exampleSentence: 'Kyoto has become a popular destination for autumn travel.',
    mastery: 'learning',
    sourceLessonId: 'lesson-aug10',
    dateAdded: '2026-08-10',
  },
  {
    id: 'vocab-4',
    word: 'commute',
    definition: 'To travel regularly between home and work.',
    exampleSentence: 'She commutes forty minutes each way by train.',
    mastery: 'mastered',
    sourceLessonId: 'lesson-jul28',
    dateAdded: '2026-07-28',
  },
  {
    id: 'vocab-5',
    word: 'colleague',
    definition: 'A person you work with.',
    exampleSentence: 'I grabbed lunch with a colleague from the marketing team.',
    mastery: 'mastered',
    sourceLessonId: 'lesson-jul28',
    dateAdded: '2026-07-28',
  },
  {
    id: 'vocab-6',
    word: 'overwhelmed',
    definition: 'Feeling like you have too much to deal with.',
    exampleSentence: 'I felt a bit overwhelmed on my first day at the new job.',
    mastery: 'new',
    sourceLessonId: 'lesson-aug10',
    dateAdded: '2026-08-10',
  },
  {
    id: 'vocab-7',
    word: 'amortized',
    definition: 'Average cost of an operation calculated over a sequence of operations.',
    exampleSentence: 'Vector dynamic array append operation takes O(1) amortized time.',
    mastery: 'learning',
    sourceLessonId: 'lesson-aug10',
    dateAdded: '2026-08-11',
  },
]

export const sarahRecurringErrors: RecurringError[] = [
  {
    id: 'error-present-perfect',
    pattern: 'Present perfect tense',
    example: '"I have went to the store yesterday."',
    category: 'grammar',
    firstSeenLessonId: 'lesson-jul28',
    lastSeenLessonId: 'lesson-aug10',
    occurrences: 6,
    status: 'improving',
  },
  {
    id: 'error-articles',
    pattern: 'Article usage (a / an / the)',
    example: '"I went to store to buy a bread."',
    category: 'grammar',
    firstSeenLessonId: 'lesson-aug04',
    lastSeenLessonId: 'lesson-aug10',
    occurrences: 4,
    status: 'active',
  },
  {
    id: 'error-th-sound',
    pattern: 'TH pronunciation',
    example: '"tink" instead of "think"',
    category: 'pronunciation',
    firstSeenLessonId: 'lesson-jul28',
    lastSeenLessonId: 'lesson-aug10',
    occurrences: 4,
    status: 'active',
  },
]

export const sarahProgressHistory: ProgressPoint[] = [
  { date: '2026-07-14', skillLevels: { grammar: 55, vocabulary: 61, speaking: 53, listening: 75, pronunciation: 54 } },
  { date: '2026-07-21', skillLevels: { grammar: 59, vocabulary: 66, speaking: 56, listening: 78, pronunciation: 55 } },
  { date: '2026-07-28', skillLevels: { grammar: 62, vocabulary: 66, speaking: 60, listening: 78, pronunciation: 55 } },
  { date: '2026-08-04', skillLevels: { grammar: 62, vocabulary: 71, speaking: 60, listening: 81, pronunciation: 55 } },
  { date: '2026-08-07', skillLevels: { grammar: 62, vocabulary: 74, speaking: 63, listening: 81, pronunciation: 55 } },
  { date: '2026-08-10', skillLevels: { grammar: 74, vocabulary: 77, speaking: 65, listening: 81, pronunciation: 55 } },
]

export const lessons: Lesson[] = [
  {
    id: 'lesson-jul28',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'Daily Conversation',
    date: '2026-07-28',
    time: '19:00',
    durationMinutes: 30,
    status: 'completed',
    topics: ['Present tense', 'Hobbies', 'Talking about routines'],
    format: 'online',
    summary: {
      topicsCovered: ['Daily routines', 'Present simple vs. present continuous', 'Hobbies vocabulary'],
      strengths: ['Confident with present simple', 'Strong hobby-related vocabulary'],
      needsPractice: ['Present perfect tense', 'TH pronunciation'],
      newVocabularyIds: ['vocab-5', 'vocab-4'],
      tutorNotes: 'Ananya communicates clearly about routine topics. Starting to introduce present perfect next lesson since she reached for past simple where perfect was needed a few times.',
      aiDraftNotes: 'Student showed strong command of present simple constructions and routine vocabulary. Present perfect tense appeared as an area to introduce gradually. TH sounds in "think" and "three" showed some difficulty — common pattern for Hindi-native speakers.',
      notesApproved: true,
      skillDeltas: { grammar: 3, speaking: 4 },
    },
  },
  {
    id: 'lesson-aug04',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'Restaurant Conversation',
    date: '2026-08-04',
    time: '19:00',
    durationMinutes: 30,
    status: 'completed',
    topics: ['Food vocabulary', 'Ordering food', 'Making reservations'],
    format: 'online',
    summary: {
      topicsCovered: ['Ordering at a restaurant', 'Making a reservation', 'Food vocabulary'],
      strengths: ['Picked up reservation vocabulary quickly', 'Good listening comprehension'],
      needsPractice: ['Article usage', 'Present perfect tense'],
      newVocabularyIds: ['vocab-2'],
      tutorNotes: 'Great engagement today — picked up "reservation" quickly and used it unprompted by the end. Article mistakes ("a bread", "the lunch") are becoming the more pressing pattern.',
      aiDraftNotes: 'Vocabulary retention for food and dining terms was strong. Article usage (a/an/the) surfaced as a recurring pattern across several sentences. Present perfect tense continues to appear as an area for continued practice.',
      notesApproved: true,
      skillDeltas: { vocabulary: 5, listening: 3 },
    },
  },
  {
    id: 'lesson-aug07',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'Restaurant Role-play & Polite Requests',
    date: '2026-08-07',
    time: '19:00',
    durationMinutes: 30,
    status: 'completed',
    topics: ['Food vocabulary', 'Ordering food'],
    format: 'online',
    summary: {
      topicsCovered: ['Restaurant role-play', 'Ordering food', 'Polite requests'],
      strengths: ['Natural use of polite request forms', 'Reservation vocabulary now solid'],
      needsPractice: ['Present perfect tense', 'TH pronunciation'],
      newVocabularyIds: [],
      tutorNotes: '"Reservation" is fully mastered now — used it correctly three times without prompting. Present perfect is still the main gap heading into next lesson.',
      aiDraftNotes: 'Reservation-related vocabulary from the previous lesson was recalled and used correctly without prompting. Present perfect tense remains an observed area for continued focus.',
      notesApproved: true,
      skillDeltas: { vocabulary: 3, speaking: 3 },
    },
  },
  {
    id: 'lesson-aug10',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'Travel Conversations & Past Stories',
    date: '2026-08-10',
    time: '19:00',
    durationMinutes: 30,
    status: 'completed',
    topics: ['Travel vocabulary', 'Past experiences', 'Present perfect'],
    format: 'online',
    summary: {
      topicsCovered: ['Travel vocabulary', 'Talking about past trips', 'Present perfect practice'],
      strengths: ['Vocabulary recall', 'Conversational confidence when talking about travel'],
      needsPractice: ['Present perfect', 'Articles', 'TH pronunciation'],
      newVocabularyIds: ['vocab-1', 'vocab-3', 'vocab-6'],
      tutorNotes: 'Noticeable improvement on present perfect today compared to two weeks ago — fewer slips into past simple when describing life experiences. Keep reinforcing with storytelling practice.',
      aiDraftNotes: 'Present perfect usage showed a marked improvement over the previous two lessons when describing past travel experiences. Article usage and TH pronunciation remain observed practice areas. Three new travel-related vocabulary items were introduced.',
      notesApproved: true,
      skillDeltas: { grammar: 12, vocabulary: 3, speaking: 2 },
    },
  },
  {
    id: 'lesson-aug14',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'English Conversation: Storytelling Mastery',
    date: '2026-08-14',
    time: '19:00',
    durationMinutes: 30,
    status: 'upcoming',
    topics: ['Present perfect practice', 'Travel storytelling'],
    format: 'online',
    meetingUrl: '/lesson/lesson-aug14/live',
  },
]

export const homeworkItems: HomeworkItem[] = [
  {
    id: 'hw-1',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug10',
    type: 'grammar',
    title: 'Present Perfect Story Practice',
    description: 'Speak for 10 minutes about three things you have done this year, focusing on present perfect forms.',
    durationMinutes: 10,
    completed: true,
    dateAssigned: '2026-08-10',
    dueDate: '2026-08-14',
    tutorId: CURRENT_TUTOR_ID,
  },
  {
    id: 'hw-2',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug10',
    type: 'vocabulary',
    title: 'Travel Vocabulary Review',
    description: 'Review and use this lesson’s 3 new travel words in original sentences.',
    durationMinutes: 8,
    completed: true,
    dateAssigned: '2026-08-10',
    dueDate: '2026-08-14',
    tutorId: CURRENT_TUTOR_ID,
  },
  {
    id: 'hw-3',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug10',
    type: 'speaking',
    title: 'Tell a Story About Your Last Trip',
    description: 'Record yourself talking for 5 minutes about your most recent trip, using present perfect where it fits naturally.',
    durationMinutes: 5,
    completed: false,
    dateAssigned: '2026-08-10',
    dueDate: '2026-08-14',
    tutorId: CURRENT_TUTOR_ID,
  },
  {
    id: 'hw-4',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug07',
    type: 'flashcards',
    title: 'Review Words You Hesitated On',
    description: 'Quick flashcard review of vocabulary you paused on during the restaurant conversation lesson.',
    durationMinutes: 6,
    completed: true,
    dateAssigned: '2026-08-07',
    dueDate: '2026-08-10',
    tutorId: CURRENT_TUTOR_ID,
  },
  {
    id: 'hw-5',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug04',
    type: 'grammar',
    title: 'Article Usage Drill',
    description: 'Short exercise practicing a / an / the in everyday sentences.',
    durationMinutes: 8,
    completed: true,
    dateAssigned: '2026-08-04',
    dueDate: '2026-08-07',
    tutorId: CURRENT_TUTOR_ID,
  },
]

export const ananyaSharma: Student = {
  id: CURRENT_STUDENT_ID,
  role: 'student',
  name: 'Ananya Sharma',
  avatarUrl: 'https://i.pravatar.cc/200?img=47',
  targetLanguage: 'English',
  level: 'Intermediate',
  goal: 'Speak confidently in client meetings and interviews, master DSA for FAANG placement, and build strong calculus foundations for B.Tech',
  tutorId: CURRENT_TUTOR_ID,
  skillLevels: { grammar: 74, vocabulary: 77, speaking: 65, listening: 81, pronunciation: 55 },
  totalVocabularyLearned: 432,
  currentStreakDays: 6,
  masteredConcepts: ['Business vocabulary', 'Present tense', 'Professional phrases', 'Email writing', 'Array Sliding Window basics'],
  needsPractice: ['Present perfect', 'Articles (a / an / the)', 'TH & V/W pronunciation', 'Tree Recursion & LCA'],
  recurringErrors: sarahRecurringErrors,
  vocabulary: sarahVocabulary,
  progressHistory: sarahProgressHistory,
  learningPreferences: defaultLearningPreferences,
  aiPrivacySettings: defaultAiPrivacySettings,
}

/** @deprecated Use ananyaSharma. Legacy alias kept for imports not yet migrated. */
export const sarahThompson = ananyaSharma

export const latestLesson = lessons
  .filter((l) => l.status === 'completed')
  .sort((a, b) => (a.date < b.date ? 1 : -1))[0]

export const upcomingLesson = lessons.find((l) => l.status === 'upcoming')

export const homeworkCompletion = {
  completed: homeworkItems.filter((h) => h.completed).length,
  total: homeworkItems.length,
}

// ─────────────────────────────────────────────────────────────
// TRANSPARENT TUTOR RECOMMENDATION LOGIC
// ─────────────────────────────────────────────────────────────

export interface TutorMatchReason {
  tutor: Tutor
  matchReasons: string[]
  score: number
}

export function getRecommendedTutors(
  student: Student = ananyaSharma,
  limit = 4,
): TutorMatchReason[] {
  const prefs = student.learningPreferences ?? defaultLearningPreferences

  const scored = allTutors
    .filter((t) => t.id !== student.tutorId)
    .map((tutor) => {
      const matchReasons: string[] = []
      let score = 0

      // Subject overlap
      const hasSubjectMatch = tutor.subjectCategories.some((cat) =>
        prefs.targetSubjects.some((s) => s.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(s.toLowerCase())),
      )
      if (hasSubjectMatch) {
        matchReasons.push(`Teaches your subjects: ${tutor.subjectCategories.join(', ')}`)
        score += 40
      }

      // Teaching format match
      const commonFormats = tutor.formats.filter((f) => prefs.preferredFormats.includes(f))
      if (commonFormats.length > 0) {
        if (commonFormats.includes('in-person-student') && tutor.location && tutor.location.city === prefs.city) {
          matchReasons.push(`Can travel to your location in ${prefs.city} (${tutor.location.travelRadiusKm ?? 10}km radius)`)
          score += 30
        } else if (commonFormats.includes('in-person-tutor') && tutor.location && tutor.location.city === prefs.city) {
          matchReasons.push(`Studio located in ${tutor.location.area}, ${tutor.location.city}`)
          score += 25
        } else if (commonFormats.includes('online')) {
          matchReasons.push('Offers flexible online video sessions')
          score += 20
        }
      }

      // Budget fit
      if (tutor.pricePerHour <= prefs.maxBudgetPerHour) {
        matchReasons.push(`Within your budget (\u20b9${tutor.pricePerHour}/hr vs max \u20b9${prefs.maxBudgetPerHour}/hr)`)
        score += 15
      }

      // High rating
      if (tutor.rating >= 4.9) {
        matchReasons.push(`Exceptional ${tutor.rating}★ rating from ${tutor.reviewCount} student reviews`)
        score += 10
      }

      return { tutor, matchReasons, score }
    })
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit)
}

export const recommendedTutorsForAnanya = allTutors.filter(
  (tutor) =>
    tutor.id !== ananyaSharma.tutorId &&
    (tutor.subjectCategories.includes('Programming & CS') ||
      tutor.subjectCategories.includes('Mathematics') ||
      tutor.languages.some((lang) => lang.toLowerCase().startsWith('english'))),
)

/** @deprecated Use recommendedTutorsForAnanya */
export const recommendedTutorsForSarah = recommendedTutorsForAnanya
