import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-800/60 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-neutral-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-crimson text-[9px] font-bold text-white">
            CC
          </span>
          <span>&copy; {new Date().getFullYear()} {APP_NAME}. A student marketplace prototype.</span>
        </div>
        <p className="text-neutral-600">Built for and by students.</p>
      </div>
    </footer>
  );
}
