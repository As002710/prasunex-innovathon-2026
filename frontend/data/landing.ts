export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface FeatureItem {
  id: string;
  iconName: string;
  title: string;
  tagline: string;
  description: string;
}

export interface RoleCardItem {
  id: string;
  role: string;
  tagline: string;
  image: string;
  href: string;
  actionText: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  title: string;
  avatar: string;
  badge: string;
}

// 🏛️ STATS STRIP CONSTANTS (Editable placeholder constants in config)
export const STATS_DATA: StatItem[] = [
  {
    icon: "Building2",
    value: "100+",
    label: "Institutions Trust Us",
  },
  {
    icon: "GraduationCap",
    value: "1M+",
    label: "Students Empowered",
  },
  {
    icon: "TrendingUp",
    value: "95%",
    label: "Accuracy in Predictions",
  },
  {
    icon: "ShieldCheck",
    value: "99.9%",
    label: "Data Security",
  },
];

// 🧠 3x2 GRID OF FEATURE CARDS
export const FEATURES_DATA: FeatureItem[] = [
  {
    id: "academic-insights",
    iconName: "Brain",
    title: "AI-Powered Academic Insights",
    tagline: "DKT-Graph & Root Cause",
    description: "Traces weak marks back to fundamental concept prerequisites rather than recording a simple failure.",
  },
  {
    id: "smart-grading",
    iconName: "FileSpreadsheet",
    title: "Smart Grading & IRT Audit",
    tagline: "Item Response Theory",
    description: "Evaluates question discrimination, curve models, and catches misleading test questions automatically.",
  },
  {
    id: "predictive-analytics",
    iconName: "LineChart",
    title: "Predictive Analytics",
    tagline: "Grade Time Machine",
    description: "Simulates student outcomes under varied study hours and forecasts semester performance early.",
  },
  {
    id: "grievance-redressal",
    iconName: "ShieldAlert",
    title: "Grievance Redressal & Safety Alerts",
    tagline: "ZK-Proof Anonymous Whistleblowing",
    description: "Zero-knowledge cryptographic credentials let students report ragging and bias safely without identity exposure.",
  },
  {
    id: "exam-scheduling",
    iconName: "CalendarClock",
    title: "Optimised Exam Scheduling",
    tagline: "CP-SAT Constraint Engine",
    description: "Eliminates student test clustering and multi-cohort timetable clashes with automated room balancing.",
  },
  {
    id: "equipment-forecasting",
    iconName: "Wrench",
    title: "Equipment Forecasting",
    tagline: "Weibull Failure Risk",
    description: "14-day predictive maintenance rankings prevent lab instrument breakdowns before practical examinations.",
  },
];

// 👥 FOR EVERY ROLE SECTION
export const ROLE_CARDS: RoleCardItem[] = [
  {
    id: "student",
    role: "Student",
    tagline: "Learn. Improve. Grow.",
    image: "/images/student.svg",
    href: "/student/dashboard",
    actionText: "Launch Student Portal",
  },
  {
    id: "professor",
    role: "Professor",
    tagline: "Analyse. Guide. Support.",
    image: "/images/professor.svg",
    href: "/student/dashboard?view=grading",
    actionText: "Open Professor Studio",
  },
  {
    id: "admin",
    role: "Admin",
    tagline: "Manage. Optimise. Ensure.",
    image: "/images/admin.svg",
    href: "/student/dashboard?view=facilities",
    actionText: "Explore Admin Console",
  },
];

// 💬 TESTIMONIALS DATA
export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "CAMPUS-NEXUS has completely transformed how we manage our campus. The insights are incredible!",
    author: "College Administrator",
    title: "Dean of Academic Affairs, Northstar Institute",
    avatar: "/images/admin.svg",
    badge: "Enterprise Campus",
  },
  {
    quote: "The DKT-Graph helped our computer science faculty spot prerequisite recursion gaps 3 weeks before midterms.",
    author: "Dr. Arvind Sharma",
    title: "Head of Computer Science & Engineering",
    avatar: "/images/professor.svg",
    badge: "OBE Accreditation Lead",
  },
  {
    quote: "Being able to submit anonymous safety concerns with zero-knowledge proof gives students real peace of mind.",
    author: "Student Council Representative",
    title: "4th Year Undergraduate",
    avatar: "/images/student.svg",
    badge: "Verified Student Voice",
  },
];

// 🧭 NAV LINKS
export const NAV_LINKS = [
  { name: "Home", href: "/", active: true },
  { name: "Features", href: "#features", hasDropdown: true },
  { name: "Portals", href: "#portals", hasDropdown: true },
  { name: "AI Insights", href: "#insights" },
  { name: "About", href: "#about" },
  { name: "Resources", href: "#resources", hasDropdown: true },
];
