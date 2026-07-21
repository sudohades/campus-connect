import type {
  User,
  Listing,
  Service,
  Chat,
  Review,
  Notification,
  Transaction,
  Order,
  DeliveryRequest,
  AdminReport,
  Dispute,
  Session,
} from "@/types";
import { MOCK_USERS } from "@/data/users";
import { MOCK_LISTINGS } from "@/data/listings";
import { MOCK_SERVICES } from "@/data/services";
import { MOCK_CHATS } from "@/data/chats";
import { MOCK_REVIEWS } from "@/data/reviews";
import { MOCK_NOTIFICATIONS } from "@/data/notifications";
import {
  MOCK_TRANSACTIONS,
  MOCK_ORDERS,
  MOCK_DELIVERY_REQUESTS,
} from "@/data/transactions";
import { MOCK_ADMIN_REPORTS, MOCK_DISPUTES } from "@/data/admin";
import { deepClone } from "@/lib/utils";

export interface AppState {
  users: User[];
  listings: Listing[];
  services: Service[];
  chats: Chat[];
  reviews: Review[];
  notifications: Notification[];
  transactions: Transaction[];
  orders: Order[];
  deliveryRequests: DeliveryRequest[];
  adminReports: AdminReport[];
  disputes: Dispute[];
  session: Session;
}

function buildInitialState(): AppState {
  return {
    users: deepClone(MOCK_USERS),
    listings: deepClone(MOCK_LISTINGS),
    services: deepClone(MOCK_SERVICES),
    chats: deepClone(MOCK_CHATS),
    reviews: deepClone(MOCK_REVIEWS),
    notifications: deepClone(MOCK_NOTIFICATIONS),
    transactions: deepClone(MOCK_TRANSACTIONS),
    orders: deepClone(MOCK_ORDERS),
    deliveryRequests: deepClone(MOCK_DELIVERY_REQUESTS),
    adminReports: deepClone(MOCK_ADMIN_REPORTS),
    disputes: deepClone(MOCK_DISPUTES),
    session: { userId: null, loggedInAt: null },
  };
}

// The pristine copy — never mutated. Used to power "Reset" in Developer Mode.
export const initialState: AppState = buildInitialState();

// The live, mutable working copy the rest of the app reads and writes.
export let currentState: AppState = deepClone(initialState);

/** Replaces the whole working state (used by resets and by state loaders). */
export function setCurrentState(next: AppState): void {
  currentState = next;
}

/** Restores everything back to the pristine demo data, including session. */
export function resetAll(): AppState {
  currentState = deepClone(initialState);
  return currentState;
}

/** Restores a single slice of state (e.g. just listings) without touching the rest. */
export function resetSlice<K extends keyof AppState>(key: K): AppState {
  currentState = {
    ...currentState,
    [key]: deepClone(initialState[key]),
  };
  return currentState;
}

export function getSession(): Session {
  return currentState.session;
}

export function setSession(session: Session): void {
  currentState = { ...currentState, session };
}
