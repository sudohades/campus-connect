import type { User } from "@/types";
import { currentState } from "@/lib/state";

export const MOCK_USERS: User[] = [
  {
    id: "user_buyer_01",
    name: "Aisha Njeri",
    role: "buyer",
    studentId: "SCE/2201/21",
    email: "aisha.njeri@students.university.ac.ke",
    password: "buyer123",
    avatar: "/avatars/aisha.png",
    verified: "verified",
    rating: 4.6,
    ratingCount: 12,
    transactionIds: ["txn_001", "txn_004"],
    createdAt: "2024-09-02T08:12:00.000Z",
    bio: "Second-year Computer Science student. Always hunting for a good deal on textbooks.",
    location: "Main Campus - Hostel B",
  },
  {
    id: "user_seller_01",
    name: "Brian Otieno",
    role: "seller",
    studentId: "SCE/1987/20",
    email: "brian.otieno@students.university.ac.ke",
    password: "seller123",
    avatar: "/avatars/brian.png",
    verified: "verified",
    rating: 4.8,
    ratingCount: 34,
    transactionIds: ["txn_001", "txn_002", "txn_003"],
    createdAt: "2024-06-14T10:05:00.000Z",
    bio: "Graduating engineering student clearing out gear before finals. Fast responder.",
    location: "Engineering Block",
  },
  {
    id: "user_provider_01",
    name: "Faith Wanjiru",
    role: "service_provider",
    studentId: "SBA/2054/21",
    email: "faith.wanjiru@students.university.ac.ke",
    password: "provider123",
    avatar: "/avatars/faith.png",
    verified: "verified",
    rating: 4.9,
    ratingCount: 51,
    transactionIds: ["txn_005"],
    createdAt: "2024-05-20T07:40:00.000Z",
    bio: "Graphic design & tutoring services. CAT and assignment help for first-years.",
    location: "Student Center",
  },
  {
    id: "user_admin_01",
    name: "Dennis Kiprono",
    role: "admin",
    studentId: "STAFF/0042",
    email: "dennis.kiprono@university.ac.ke",
    password: "admin123",
    avatar: "/avatars/dennis.png",
    verified: "verified",
    rating: 5.0,
    ratingCount: 0,
    transactionIds: [],
    createdAt: "2023-01-10T09:00:00.000Z",
    bio: "Student affairs office — platform administrator.",
    location: "Admin Block",
  },
];

export function findUserById(id: string): User | undefined {
  return currentState.users.find((u) => u.id === id);
}

export function findUserByEmail(email: string): User | undefined {
  return currentState.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
