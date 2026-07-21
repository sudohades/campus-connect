// ============================================================
// CampusConnect — Shared Types
// ============================================================

export type UserRole = "buyer" | "seller" | "service_provider" | "admin";

export type VerificationStatus = "verified" | "pending" | "unverified";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  studentId: string;
  email: string;
  password: string;
  avatar: string;
  verified: VerificationStatus;
  rating: number;
  ratingCount: number;
  transactionIds: string[];
  createdAt: string;
  bio?: string;
  location?: string;
}

export type ListingCategory =
  | "electronics"
  | "books"
  | "furniture"
  | "clothing"
  | "sports"
  | "stationery"
  | "tickets"
  | "other";

export type ListingCondition =
  | "new"
  | "like_new"
  | "good"
  | "fair"
  | "worn";

export type ListingStatus = "active" | "pending" | "sold" | "removed";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  condition: ListingCondition;
  images: string[];
  sellerId: string;
  location: string;
  status: ListingStatus;
  createdAt: string;
  views: number;
  favorites: number;
}

export type ServiceCategory =
  | "tutoring"
  | "design"
  | "printing"
  | "repair"
  | "delivery"
  | "photography"
  | "coding"
  | "events";

export type ServiceStatus = "active" | "paused" | "removed";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: "fixed" | "hourly" | "per_session";
  category: ServiceCategory;
  providerId: string;
  images: string[];
  status: ServiceStatus;
  durationMinutes: number;
  createdAt: string;
  bookingsCompleted: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participantIds: string[];
  listingId?: string;
  serviceId?: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface Review {
  id: string;
  targetUserId: string;
  authorId: string;
  listingId?: string;
  serviceId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type NotificationType =
  | "message"
  | "purchase"
  | "sale"
  | "booking"
  | "review"
  | "system"
  | "admin";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export type PaymentMethod = "mpesa" | "airtel_money" | "card";

export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId?: string;
  serviceId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  createdAt: string;
}

export type OrderStatus =
  | "placed"
  | "accepted"
  | "dispatched"
  | "delivered"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  transactionId: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  status: OrderStatus;
  deliveryRequestId?: string;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryStatus =
  | "unassigned"
  | "rider_assigned"
  | "picked_up"
  | "in_transit"
  | "delivered";

export interface DeliveryRequest {
  id: string;
  orderId: string;
  riderName?: string;
  riderPhone?: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: DeliveryStatus;
  estimatedMinutes: number;
  createdAt: string;
}

export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export interface AdminReport {
  id: string;
  reporterId: string;
  targetType: "user" | "listing" | "service";
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

export type DisputeStatus = "open" | "investigating" | "resolved";

export interface Dispute {
  id: string;
  transactionId: string;
  raisedById: string;
  againstId: string;
  reason: string;
  status: DisputeStatus;
  resolution?: string;
  createdAt: string;
}

export interface Session {
  userId: string | null;
  loggedInAt: string | null;
}
