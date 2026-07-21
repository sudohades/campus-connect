"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, User as UserIcon, LogOut, Menu, X } from "lucide-react";
import { useSession } from "@/lib/session-context";
import { cn, initials } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/services", label: "Services" },
  { href: "/chats", label: "Messages" },
];

export function SiteHeader() {
  const { user, unreadCount, logout } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 glass border-b border-neutral-800/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-crimson to-crimson-hover text-xs font-bold text-white shadow-glow-crimson/30 transition-default group-hover:shadow-glow-crimson/60">
              CC
            </span>
            <span className="text-sm font-semibold tracking-tight text-neutral-50">
              {APP_NAME}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3 py-1.5 text-sm transition-all duration-150",
                    active
                      ? "font-medium text-crimson-light bg-crimson/10"
                      : "text-neutral-400 hover:text-neutral-100 hover:bg-surface-elevated",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {user && (
            <>
              <Link
                href="/notifications"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-default hover:bg-surface-elevated hover:text-neutral-200"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold shadow-glow-gold/40 animate-glow-pulse" />
                )}
              </Link>
              <Link
                href="/chats"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-default hover:bg-surface-elevated hover:text-neutral-200"
                aria-label="Messages"
              >
                <MessageSquare className="h-4 w-4" />
              </Link>
            </>
          )}

          <div className="relative" ref={menuRef}>
            {user ? (
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-crimson to-crimson-hover text-xs font-medium text-white shadow-soft transition-default hover:shadow-medium"
                aria-label="Account menu"
              >
                {initials(user.name)}
              </button>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 transition-default hover:text-neutral-100 hover:bg-surface-elevated"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn-crimson !px-3.5 !py-1.5 !text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
            {!user && (
              <button
                type="button"
                onClick={() => setMobileNavOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-default hover:bg-surface-elevated sm:hidden"
                aria-label="Toggle navigation"
              >
                {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            )}
            {menuOpen && user && (
              <div className="absolute right-0 top-10 w-52 rounded-xl border border-neutral-700 bg-surface-overlay py-1.5 shadow-large animate-scale-in">
                <div className="border-b border-neutral-800 px-3.5 pb-2.5 pt-1.5">
                  <p className="text-sm font-medium text-neutral-50 truncate">{user.name}</p>
                  <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="mx-1.5 mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-300 transition-default hover:bg-surface-elevated"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserIcon className="h-4 w-4 text-neutral-500" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="mx-1.5 flex w-[calc(100%-12px)] items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-crimson-light transition-default hover:bg-crimson/10"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileNavOpen && !user && (
        <div className="border-t border-neutral-800/60 px-4 py-3 sm:hidden animate-slide-down">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm transition-default",
                  pathname?.startsWith(link.href)
                    ? "font-medium text-crimson-light bg-crimson/10"
                    : "text-neutral-400 hover:bg-surface-elevated",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-1 h-px bg-neutral-800" />
            <Link
              href="/login"
              onClick={() => setMobileNavOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:bg-surface-elevated"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileNavOpen(false)}
              className="btn-crimson !text-sm justify-center"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
