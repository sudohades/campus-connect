import type {
  Listing,
  ListingCategory,
  Service,
  ServiceCategory,
  Chat,
  ChatMessage,
  Review,
  Notification,
  Transaction,
  Order,
  DeliveryRequest,
  PaymentMethod,
  AdminReport,
  Dispute,
} from "@/types";
import { currentState, setCurrentState } from "@/lib/state";
import { delay, generateId } from "@/lib/utils";
import { DELAY, RIDER_NAMES } from "@/lib/constants";

// ============================================================
// Listings
// ============================================================

export interface ListingFilters {
  query?: string;
  category?: ListingCategory | "all";
  minPrice?: number;
  maxPrice?: number;
}

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  await delay(DELAY.short);
  let results = currentState.listings.filter((l) => l.status === "active");

  if (filters.category && filters.category !== "all") {
    results = results.filter((l) => l.category === filters.category);
  }
  if (typeof filters.minPrice === "number") {
    results = results.filter((l) => l.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number") {
    results = results.filter((l) => l.price <= filters.maxPrice!);
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q),
    );
  }

  return results;
}

export async function getListing(id: string): Promise<Listing | undefined> {
  await delay(DELAY.short);
  return currentState.listings.find((l) => l.id === id);
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  condition: Listing["condition"];
  location: string;
  sellerId: string;
  images: string[];
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  await delay(DELAY.medium);
  const listing: Listing = {
    ...input,
    id: generateId("listing"),
    status: "active",
    createdAt: new Date().toISOString(),
    views: 0,
    favorites: 0,
  };
  setCurrentState({ ...currentState, listings: [listing, ...currentState.listings] });
  return listing;
}

export async function updateListingStatus(
  listingId: string,
  status: Listing["status"],
): Promise<Listing | undefined> {
  await delay(DELAY.short);
  const listings = currentState.listings.map((l) =>
    l.id === listingId ? { ...l, status } : l,
  );
  setCurrentState({ ...currentState, listings });
  return listings.find((l) => l.id === listingId);
}

// ============================================================
// Services
// ============================================================

export interface ServiceFilters {
  query?: string;
  category?: ServiceCategory | "all";
}

export async function getServices(filters: ServiceFilters = {}): Promise<Service[]> {
  await delay(DELAY.short);
  let results = currentState.services.filter((s) => s.status === "active");

  if (filters.category && filters.category !== "all") {
    results = results.filter((s) => s.category === filters.category);
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
    );
  }

  return results;
}

export async function getService(id: string): Promise<Service | undefined> {
  await delay(DELAY.short);
  return currentState.services.find((s) => s.id === id);
}

// ============================================================
// Chat
// ============================================================

export async function getChatsForUser(userId: string): Promise<Chat[]> {
  await delay(DELAY.short);
  return currentState.chats
    .filter((c) => c.participantIds.includes(userId))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getOrCreateChat(
  userAId: string,
  userBId: string,
  opts: { listingId?: string; serviceId?: string } = {},
): Promise<Chat> {
  await delay(DELAY.short);
  const existing = currentState.chats.find(
    (c) =>
      c.participantIds.includes(userAId) &&
      c.participantIds.includes(userBId) &&
      c.listingId === opts.listingId &&
      c.serviceId === opts.serviceId,
  );
  if (existing) return existing;

  const chat: Chat = {
    id: generateId("chat"),
    participantIds: [userAId, userBId],
    listingId: opts.listingId,
    serviceId: opts.serviceId,
    messages: [],
    updatedAt: new Date().toISOString(),
  };
  setCurrentState({ ...currentState, chats: [chat, ...currentState.chats] });
  return chat;
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string,
): Promise<ChatMessage> {
  await delay(DELAY.short);
  const message: ChatMessage = {
    id: generateId("msg"),
    chatId,
    senderId,
    text,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const chats = currentState.chats.map((c) =>
    c.id === chatId
      ? { ...c, messages: [...c.messages, message], updatedAt: message.createdAt }
      : c,
  );
  setCurrentState({ ...currentState, chats });
  return message;
}

// ============================================================
// Reviews
// ============================================================

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  await delay(DELAY.short);
  return currentState.reviews.filter((r) => r.targetUserId === userId);
}

export async function addReview(
  input: Omit<Review, "id" | "createdAt">,
): Promise<Review> {
  await delay(DELAY.medium);
  const review: Review = {
    ...input,
    id: generateId("review"),
    createdAt: new Date().toISOString(),
  };
  setCurrentState({ ...currentState, reviews: [review, ...currentState.reviews] });
  return review;
}

// ============================================================
// Notifications
// ============================================================

export async function getNotifications(userId: string): Promise<Notification[]> {
  await delay(DELAY.short);
  return currentState.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function markNotificationRead(id: string): Promise<void> {
  const notifications = currentState.notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n,
  );
  setCurrentState({ ...currentState, notifications });
}

function pushNotification(input: Omit<Notification, "id" | "createdAt" | "read">) {
  const notification: Notification = {
    ...input,
    id: generateId("notif"),
    read: false,
    createdAt: new Date().toISOString(),
  };
  setCurrentState({
    ...currentState,
    notifications: [notification, ...currentState.notifications],
  });
  return notification;
}

// ============================================================
// Purchases (transaction -> order -> delivery)
// ============================================================

export interface PurchaseInput {
  buyerId: string;
  listingId: string;
  paymentMethod: PaymentMethod;
  deliverToLocation: string;
}

export interface PurchaseResult {
  transaction: Transaction;
  order: Order;
  deliveryRequest: DeliveryRequest;
}

/** Simulates payment processing, then order placement and rider assignment. */
export async function purchaseListing(input: PurchaseInput): Promise<PurchaseResult> {
  const listing = currentState.listings.find((l) => l.id === input.listingId);
  if (!listing) throw new Error("Listing not found");

  // Simulated payment processing delay.
  await delay(DELAY.payment);

  const transaction: Transaction = {
    id: generateId("txn"),
    buyerId: input.buyerId,
    sellerId: listing.sellerId,
    listingId: listing.id,
    amount: listing.price,
    paymentMethod: input.paymentMethod,
    status: "completed",
    createdAt: new Date().toISOString(),
  };

  const order: Order = {
    id: generateId("order"),
    transactionId: transaction.id,
    buyerId: input.buyerId,
    sellerId: listing.sellerId,
    listingId: listing.id,
    status: "placed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await delay(DELAY.short);

  const deliveryRequest: DeliveryRequest = {
    id: generateId("delivery"),
    orderId: order.id,
    pickupLocation: listing.location,
    dropoffLocation: input.deliverToLocation,
    status: "rider_assigned",
    riderName: RIDER_NAMES[Math.floor(Math.random() * RIDER_NAMES.length)],
    riderPhone: `07${Math.floor(10000000 + Math.random() * 89999999)}`,
    estimatedMinutes: 10 + Math.floor(Math.random() * 20),
    createdAt: new Date().toISOString(),
  };

  const listings = currentState.listings.map((l) =>
    l.id === listing.id ? { ...l, status: "sold" as const } : l,
  );

  setCurrentState({
    ...currentState,
    listings,
    transactions: [transaction, ...currentState.transactions],
    orders: [order, ...currentState.orders],
    deliveryRequests: [deliveryRequest, ...currentState.deliveryRequests],
  });

  pushNotification({
    userId: listing.sellerId,
    type: "sale",
    title: "New order received",
    body: `Your listing "${listing.title}" was purchased.`,
    link: "/dashboard/orders",
  });
  pushNotification({
    userId: input.buyerId,
    type: "purchase",
    title: "Purchase confirmed",
    body: `Your order for "${listing.title}" is on its way.`,
      link: "/dashboard/orders",
  });

  return { transaction, order, deliveryRequest };
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<Order | undefined> {
  await delay(DELAY.short);
  const orders = currentState.orders.map((o) =>
    o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o,
  );
  setCurrentState({ ...currentState, orders });
  const order = orders.find((o) => o.id === orderId);

  if (order && status === "dispatched") {
    pushNotification({
      userId: order.buyerId,
      type: "system",
      title: "Order dispatched",
      body: "Your order is on its way. Track the rider from your orders page.",
    link: "/dashboard/orders",
    });
  }

  return order;
}

export async function getOrdersForUser(userId: string, as: "buyer" | "seller") {
  await delay(DELAY.short);
  return currentState.orders.filter((o) =>
    as === "buyer" ? o.buyerId === userId : o.sellerId === userId,
  );
}

// ============================================================
// Service bookings (reuses Transaction/Order shape via serviceId)
// ============================================================

export interface BookServiceInput {
  buyerId: string;
  serviceId: string;
  paymentMethod: PaymentMethod;
}

export async function bookService(input: BookServiceInput): Promise<Transaction> {
  const service = currentState.services.find((s) => s.id === input.serviceId);
  if (!service) throw new Error("Service not found");

  await delay(DELAY.payment);

  const transaction: Transaction = {
    id: generateId("txn"),
    buyerId: input.buyerId,
    sellerId: service.providerId,
    serviceId: service.id,
    amount: service.price,
    paymentMethod: input.paymentMethod,
    status: "completed",
    createdAt: new Date().toISOString(),
  };

  setCurrentState({
    ...currentState,
    transactions: [transaction, ...currentState.transactions],
  });

  pushNotification({
    userId: service.providerId,
    type: "booking",
    title: "New booking",
    body: `You have a new booking for "${service.title}".`,
    link: "/dashboard/bookings",
  });

  return transaction;
}

// ============================================================
// Admin
// ============================================================

export async function getAdminReports(): Promise<AdminReport[]> {
  await delay(DELAY.short);
  return currentState.adminReports;
}

export async function resolveReport(
  reportId: string,
  status: AdminReport["status"],
): Promise<void> {
  await delay(DELAY.medium);
  const adminReports = currentState.adminReports.map((r) =>
    r.id === reportId ? { ...r, status } : r,
  );
  setCurrentState({ ...currentState, adminReports });
}

export async function getDisputes(): Promise<Dispute[]> {
  await delay(DELAY.short);
  return currentState.disputes;
}

export async function resolveDispute(
  disputeId: string,
  resolution: string,
): Promise<void> {
  await delay(DELAY.medium);
  const disputes = currentState.disputes.map((d) =>
    d.id === disputeId ? { ...d, status: "resolved" as const, resolution } : d,
  );
  setCurrentState({ ...currentState, disputes });
}

export async function approveStudentVerification(userId: string): Promise<void> {
  await delay(DELAY.medium);
  const users = currentState.users.map((u) =>
    u.id === userId ? { ...u, verified: "verified" as const } : u,
  );
  setCurrentState({ ...currentState, users });
}
