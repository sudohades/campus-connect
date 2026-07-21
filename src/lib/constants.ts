import type { ListingCategory, ListingCondition, ServiceCategory } from "@/types";

// ============================================================
// Brand palette (use via Tailwind arbitrary values or CSS vars
// wired up in the host project's globals.css)
// ============================================================
export const COLORS = {
  black: "#0f0f11",
  white: "#fafafa",
  deepRed: "#8B1E1E",
  goldenYellow: "#D9A441",
} as const;

export const APP_NAME = "CampusConnect";

export const UNIVERSITY_EMAIL_DOMAINS = [".edu", ".ac.ke"];

export const LISTING_CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "books", label: "Books" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "stationery", label: "Stationery" },
  { value: "tickets", label: "Tickets & Events" },
  { value: "other", label: "Other" },
];

export const LISTING_CONDITIONS: { value: ListingCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "worn", label: "Worn" },
];

export const SERVICE_CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: "tutoring", label: "Tutoring" },
  { value: "design", label: "Design" },
  { value: "printing", label: "Printing" },
  { value: "repair", label: "Repair" },
  { value: "delivery", label: "Delivery" },
  { value: "photography", label: "Photography" },
  { value: "coding", label: "Coding Help" },
  { value: "events", label: "Events" },
];

export const CAMPUS_LOCATIONS = [
  "Main Campus - Hostel A",
  "Main Campus - Hostel B",
  "Main Campus - Hostel C",
  "Engineering Block",
  "Student Center",
  "Library Annex",
  "North Gate",
  "South Gate",
  "Off-Campus - Kikuyu Rd",
];

export const RIDER_NAMES = [
  "Brian Otieno",
  "Faith Wanjiru",
  "Kevin Mwangi",
  "Sharon Achieng",
  "Dennis Kiprono",
];

// Simulated network delays (ms) so the demo feels believable
export const DELAY = {
  short: 450,
  medium: 900,
  long: 1600,
  payment: 2200,
};

export const DEV_MODE_QUERY_PARAM = "demo";
export const DEV_MODE_PATH = "/dev";
