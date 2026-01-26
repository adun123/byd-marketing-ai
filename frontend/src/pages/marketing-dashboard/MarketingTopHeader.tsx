
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Coins, Menu } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

export default function MarketingTopHeader({
  title = "AI Marketing Platform",
  subtitle,
  credits = 2500,
  notifications = 3,
  userInitials = "JD",
  onBack,
  onOpenMenu, //  NEW
  className,
}: {
  title?: string;
  subtitle?: string;
  credits?: number;
  notifications?: number;
  userInitials?: string;
  onBack?: () => void;
  onOpenMenu?: () => void; //  NEW
  className?: string;
}) {
  const navigate = useNavigate();

  function handleBack() {
    if (onBack) return onBack();
    navigate(-1);
  }

  return (
    <header className={cn("h-16 border-b border-slate-200 bg-white/85 backdrop-blur", className)}>
      <div className="h-[2px] w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      {/* kasih tinggi konsisten biar calc sidebar bener */}
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-2.5">
          {/* MOBILE menu button */}
          <button
            type="button"
            onClick={onOpenMenu}
            className={cn(
              "md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white",
              "h-9 w-9 hover:bg-slate-50"
            )}
            aria-label="Open menu"
            title="Menu"
          >
            <Menu className="h-4 w-4 text-slate-700" />
          </button>

          <button
            type="button"
            onClick={handleBack}
            className={cn(
              "inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white",
              "h-9 w-9 hover:bg-slate-50"
            )}
            aria-label="Back"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4 text-slate-700" />
          </button>

          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-slate-900">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-0.5 truncate text-[11px] text-slate-500">
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700">
            <Coins className="h-4 w-4 text-[#068773]" />
            <span className="tabular-nums">{credits.toLocaleString("en-US")}</span>
            <span className="text-slate-500 font-medium">credits</span>
          </div>

          <button
            type="button"
            className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-[#068773] px-1 text-[10px] font-semibold text-white">
                {notifications}
              </span>
            )}
          </button>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200"
            aria-label="User menu"
          >
            {userInitials}
          </button>
        </div>
      </div>
    </header>
  );
}
