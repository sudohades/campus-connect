"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import { currentState } from "@/lib/state";
import { getCurrentUser, login as apiLogin, logout as apiLogout, switchUser as apiSwitchUser } from "@/lib/auth";
import { getNotifications } from "@/lib/api";

interface SessionContextValue {
  user: User | null;
  loading: boolean;
  unreadCount: number;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => Promise<void>;
  refresh: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser() ?? null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback(async (userId: string) => {
    const notifications = await getNotifications(userId);
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      const result = await apiLogin(email, password);
      setLoading(false);
      if (result.success && result.user) {
        setUser(result.user);
        refreshUnread(result.user.id);
      }
      return { success: result.success, error: result.error };
    },
    [refreshUnread],
  );

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setUnreadCount(0);
  }, []);

  const switchUser = useCallback(
    async (userId: string) => {
      setLoading(true);
      const result = await apiSwitchUser(userId);
      setLoading(false);
      if (result.success && result.user) {
        setUser(result.user);
        refreshUnread(result.user.id);
      }
    },
    [refreshUnread],
  );

  const refresh = useCallback(() => {
    setUser(getCurrentUser() ?? null);
    const current = currentState.session.userId;
    if (current) refreshUnread(current);
  }, [refreshUnread]);

  const value = useMemo(
    () => ({ user, loading, unreadCount, login, logout, switchUser, refresh }),
    [user, loading, unreadCount, login, logout, switchUser, refresh],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
