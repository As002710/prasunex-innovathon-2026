import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "campus-nexus-v2-super-secret-jwt-key-2026-hackathon";

export interface UserRecord {
  id: string;
  tenant_id: string;
  college_name: string;
  college_code: string;
  tier: string;
  tier_name: string;
  features: Record<string, boolean>;
  email: string;
  full_name: string;
  name: string;
  role: string;
  normalized_role: "student" | "faculty" | "admin" | "other";
  department: string;
  passwordHash: string;
  cgpa?: number;
  karma_points?: number;
  opt_in_recruiter?: boolean;
  is_new_account?: boolean;
}

// In-memory data store for serverless execution
export const SEED_USERS: UserRecord[] = [
  {
    id: "usr-admin",
    tenant_id: "northstar",
    college_name: "Northstar Institute of Technology",
    college_code: "NITX",
    tier: "autonomous_enterprise",
    tier_name: "Autonomous Enterprise",
    features: { zk_grievance: true, bkt_diagnostics: true, relative_grading: true, early_warning: true },
    email: "admin@nitx.demo",
    full_name: "Chief Administrator",
    name: "Chief Administrator",
    role: "admin",
    normalized_role: "admin",
    department: "Administration",
    passwordHash: bcrypt.hashSync("Admin@123", 10),
  },
  {
    id: "usr-faculty",
    tenant_id: "northstar",
    college_name: "Northstar Institute of Technology",
    college_code: "NITX",
    tier: "autonomous_enterprise",
    tier_name: "Autonomous Enterprise",
    features: { zk_grievance: true, bkt_diagnostics: true, relative_grading: true, early_warning: true },
    email: "faculty@nitx.demo",
    full_name: "Prof. Vikram Sen",
    name: "Prof. Vikram Sen",
    role: "faculty",
    normalized_role: "faculty",
    department: "CSE",
    passwordHash: bcrypt.hashSync("Faculty@123", 10),
  },
  {
    id: "usr-student-001",
    tenant_id: "northstar",
    college_name: "Northstar Institute of Technology",
    college_code: "NITX",
    tier: "autonomous_enterprise",
    tier_name: "Autonomous Enterprise",
    features: { zk_grievance: true, bkt_diagnostics: true, relative_grading: true, early_warning: true },
    email: "student@nitx.demo",
    full_name: "Aarav Sharma",
    name: "Aarav Sharma",
    role: "student",
    normalized_role: "student",
    department: "CSE",
    cgpa: 9.4,
    karma_points: 140,
    opt_in_recruiter: true,
    passwordHash: bcrypt.hashSync("Student@123", 10),
  },
  {
    id: "usr-staff",
    tenant_id: "northstar",
    college_name: "Northstar Institute of Technology",
    college_code: "NITX",
    tier: "autonomous_enterprise",
    tier_name: "Autonomous Enterprise",
    features: { zk_grievance: true, bkt_diagnostics: true, relative_grading: true, early_warning: true },
    email: "staff@nitx.demo",
    full_name: "Sunil Verma (Lab Warden)",
    name: "Sunil Verma (Lab Warden)",
    role: "other",
    normalized_role: "other",
    department: "Facilities",
    passwordHash: bcrypt.hashSync("Staff@123", 10),
  },
  // Legacy Aliases
  {
    id: "usr-legacy-prof",
    tenant_id: "northstar",
    college_name: "Northstar Institute of Technology",
    college_code: "NITX",
    tier: "autonomous_enterprise",
    tier_name: "Autonomous Enterprise",
    features: { zk_grievance: true, bkt_diagnostics: true, relative_grading: true, early_warning: true },
    email: "professor@nitx.demo",
    full_name: "Prof. Priya Mehta",
    name: "Prof. Priya Mehta",
    role: "faculty",
    normalized_role: "faculty",
    department: "CSE",
    passwordHash: bcrypt.hashSync("professor", 10),
  },
  {
    id: "usr-legacy-std",
    tenant_id: "northstar",
    college_name: "Northstar Institute of Technology",
    college_code: "NITX",
    tier: "autonomous_enterprise",
    tier_name: "Autonomous Enterprise",
    features: { zk_grievance: true, bkt_diagnostics: true, relative_grading: true, early_warning: true },
    email: "student001@nitx.demo",
    full_name: "Student Demo",
    name: "Student Demo",
    role: "student",
    normalized_role: "student",
    department: "CSE",
    cgpa: 8.8,
    karma_points: 90,
    passwordHash: bcrypt.hashSync("student123", 10),
  },
];

declare global {
  var __campusNexusRuntimeUsers: UserRecord[] | undefined;
}

// Keep one user store across independently bundled Next.js route handlers.
const runtimeUsers =
  globalThis.__campusNexusRuntimeUsers ||
  (globalThis.__campusNexusRuntimeUsers = [...SEED_USERS]);

export function findUserByEmail(email: string): UserRecord | undefined {
  const normEmail = email.trim().toLowerCase();
  return runtimeUsers.find((u) => u.email.toLowerCase() === normEmail);
}

export function addUser(user: UserRecord): void {
  runtimeUsers.push(user);
}

export async function verifyUserPassword(rawPassword: string, user: UserRecord): Promise<boolean> {
  if (await bcrypt.compare(rawPassword, user.passwordHash)) {
    return true;
  }
  // Dual-credential aliases
  const aliasMap: Record<string, string[]> = {
    "admin@nitx.demo": ["Admin@123", "admin"],
    "faculty@nitx.demo": ["Faculty@123", "faculty123"],
    "professor@nitx.demo": ["Faculty@123", "professor"],
    "student@nitx.demo": ["Student@123", "student123"],
    "student001@nitx.demo": ["Student@123", "student123"],
    "staff@nitx.demo": ["Staff@123", "technician"],
  };
  const aliases = aliasMap[user.email.toLowerCase()] || [];
  return aliases.includes(rawPassword);
}

export function createJWT(user: UserRecord): { accessToken: string; refreshToken: string } {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    normalized_role: user.normalized_role,
    tenant_id: user.tenant_id,
  };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function verifyJWT(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
