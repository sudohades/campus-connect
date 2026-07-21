import type { Review } from "@/types";

export const MOCK_REVIEWS: Review[] = [
  {
    id: "review_001",
    targetUserId: "user_seller_01",
    authorId: "user_buyer_01",
    listingId: "listing_002",
    rating: 5,
    comment: "Book was exactly as described, quick meetup at the Engineering Block.",
    createdAt: "2025-05-20T12:00:00.000Z",
  },
  {
    id: "review_002",
    targetUserId: "user_provider_01",
    authorId: "user_buyer_01",
    serviceId: "service_001",
    rating: 5,
    comment: "Faith explained the stats concepts really clearly, highly recommend.",
    createdAt: "2025-05-22T09:30:00.000Z",
  },
  {
    id: "review_003",
    targetUserId: "user_seller_01",
    authorId: "user_provider_01",
    listingId: "listing_012",
    rating: 4,
    comment: "Good condition keyboard, minor delay in response time but smooth pickup.",
    createdAt: "2025-05-25T14:15:00.000Z",
  },
];
