import type { Chat } from "@/types";

export const MOCK_CHATS: Chat[] = [
  {
    id: "chat_001",
    participantIds: ["user_buyer_01", "user_seller_01"],
    listingId: "listing_001",
    updatedAt: "2025-06-20T10:05:00.000Z",
    messages: [
      {
        id: "msg_001",
        chatId: "chat_001",
        senderId: "user_buyer_01",
        text: "Hi, is the TI-84 calculator still available?",
        createdAt: "2025-06-20T09:58:00.000Z",
        read: true,
      },
      {
        id: "msg_002",
        chatId: "chat_001",
        senderId: "user_seller_01",
        text: "Yes it is! I'm around the Engineering Block most afternoons if you want to check it out.",
        createdAt: "2025-06-20T10:01:00.000Z",
        read: true,
      },
      {
        id: "msg_003",
        chatId: "chat_001",
        senderId: "user_buyer_01",
        text: "Perfect, I'll place the order now.",
        createdAt: "2025-06-20T10:05:00.000Z",
        read: false,
      },
    ],
  },
  {
    id: "chat_002",
    participantIds: ["user_buyer_01", "user_provider_01"],
    serviceId: "service_001",
    updatedAt: "2025-06-19T15:30:00.000Z",
    messages: [
      {
        id: "msg_004",
        chatId: "chat_002",
        senderId: "user_buyer_01",
        text: "Do you have any tutoring slots open this week for stats?",
        createdAt: "2025-06-19T15:20:00.000Z",
        read: true,
      },
      {
        id: "msg_005",
        chatId: "chat_002",
        senderId: "user_provider_01",
        text: "Yes, Thursday 4pm works. I'll confirm the booking on my end.",
        createdAt: "2025-06-19T15:30:00.000Z",
        read: true,
      },
    ],
  },
];
