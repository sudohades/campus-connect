import type { AdminReport, Dispute } from "@/types";

export const MOCK_ADMIN_REPORTS: AdminReport[] = [
  {
    id: "report_001",
    reporterId: "user_buyer_01",
    targetType: "listing",
    targetId: "listing_019",
    reason: "Description doesn't match the photos shown.",
    status: "open",
    createdAt: "2025-06-18T08:00:00.000Z",
  },
  {
    id: "report_002",
    reporterId: "user_seller_01",
    targetType: "user",
    targetId: "user_provider_01",
    reason: "Buyer did not show up for scheduled meetup twice.",
    status: "reviewing",
    createdAt: "2025-06-15T10:00:00.000Z",
  },
  {
    id: "report_003",
    reporterId: "user_provider_01",
    targetType: "service",
    targetId: "service_008",
    reason: "Service listing pricing seems inconsistent with description.",
    status: "resolved",
    createdAt: "2025-06-10T14:00:00.000Z",
  },
];

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "dispute_001",
    transactionId: "txn_004",
    raisedById: "user_buyer_01",
    againstId: "user_provider_01",
    reason: "Payment was deducted but ticket was not received.",
    status: "investigating",
    createdAt: "2025-06-21T09:00:00.000Z",
  },
];

// Pending student verifications shown on the admin dashboard.
export const MOCK_PENDING_VERIFICATIONS = [
  {
    id: "verify_001",
    name: "Grace Achieng",
    studentId: "SCE/2210/22",
    email: "grace.achieng@students.university.ac.ke",
    submittedAt: "2025-06-19T09:00:00.000Z",
  },
  {
    id: "verify_002",
    name: "Michael Kamau",
    studentId: "SBA/2098/21",
    email: "michael.kamau@students.university.ac.ke",
    submittedAt: "2025-06-20T11:00:00.000Z",
  },
];
