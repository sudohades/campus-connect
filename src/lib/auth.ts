import type { User } from "@/types";
import { currentState, setSession } from "@/lib/state";
import { delay, generateId, isUniversityEmail } from "@/lib/utils";
import { DELAY } from "@/lib/constants";

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/** Simulated login against the in-memory mock database. */
export async function login(email: string, password: string): Promise<AuthResult> {
  await delay(DELAY.medium);

  const user = currentState.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!user) {
    return { success: false, error: "No account found with that email." };
  }
  if (user.password !== password) {
    return { success: false, error: "Incorrect password." };
  }

  setSession({ userId: user.id, loggedInAt: new Date().toISOString() });
  return { success: true, user };
}

export function logout(): void {
  setSession({ userId: null, loggedInAt: null });
}

export function getCurrentUser(): User | undefined {
  const { userId } = currentState.session;
  if (!userId) return undefined;
  return currentState.users.find((u) => u.id === userId);
}

/** Dev-mode helper: end the current session and log in as someone else instantly. */
export async function switchUser(userId: string): Promise<AuthResult> {
  await delay(DELAY.short);
  const user = currentState.users.find((u) => u.id === userId);
  if (!user) return { success: false, error: "Unknown demo account." };
  setSession({ userId: user.id, loggedInAt: new Date().toISOString() });
  return { success: true, user };
}

export interface RegistrationStep {
  label: string;
  done: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  studentId: string;
  password: string;
  role: User["role"];
}

export interface RegisterResult {
  success: boolean;
  error?: string;
  user?: User;
}

/**
 * Simulates the registration workflow end-to-end with realistic checkpoints.
 * onStep fires after each checkpoint so the UI can show progress.
 */
export async function register(
  input: RegisterInput,
  onStep?: (step: string) => void,
): Promise<RegisterResult> {
  if (!isUniversityEmail(input.email)) {
    return {
      success: false,
      error: "Please register using your official ANU student email address.",
    };
  }

  const existing = currentState.users.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase(),
  );
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  onStep?.("Checking university records...");
  await delay(DELAY.medium);

  onStep?.("Verifying student ID...");
  await delay(DELAY.medium);

  onStep?.("Creating account...");
  await delay(DELAY.short);

  onStep?.("Registration successful");

  // Demonstration only — the account is not persisted to the mock database.
  const newUser: User = {
    id: generateId("user"),
    name: input.name,
    role: input.role,
    studentId: input.studentId,
    email: input.email,
    password: input.password,
    avatar: "/avatars/default.png",
    verified: "pending",
    rating: 0,
    ratingCount: 0,
    transactionIds: [],
    createdAt: new Date().toISOString(),
  };

  onStep?.("Registration Successful");
  return { success: true, user: newUser };
}
