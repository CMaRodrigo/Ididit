import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Activity, Home, Layers, Plus, Settings, User } from "lucide-react";
import { btn, Logo } from "@/components/proof/primitives";
import { cn } from "@/lib/utils";
import { useProof } from "@/lib/proof/store";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

const main = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/commitments", label: "Commitments", icon: Layers, exact: false },
  { to: "/app/activity", label: "Activity", icon: Activity, exact: false },
] as const;

function NavItem({ to, label, icon: Icon, exact }: { to: string; label: string; icon: typeof Home; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: !!exact }}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      activeProps={{ className: "bg-secondary !text-foreground font-medium" }}
    >
      <Icon className="size-4" strokeWidth={1.75} />
      {label}
    </Link>
  );
}

function AppShell() {
  const { user } = useProof();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border px-4 py-6 lg:flex">
        <Link to="/" className="px-3">
          <Logo />
        </Link>
        <Link to="/app/new" className={cn(btn({ variant: "primary", size: "md" }), "mt-8 w-full justify-start")}>
          <Plus className="size-4" /> New commitment
        </Link>
        <nav className="mt-6 space-y-0.5">
          {main.map((m) => (
            <NavItem key={m.to} {...m} />
          ))}
        </nav>
        <div className="mt-auto space-y-0.5">
          <NavItem to="/app/settings" label="Profile" icon={User} />
          <NavItem to="/app/settings" label="Settings" icon={Settings} />
          <div className="mt-4 flex items-center gap-3 border-t border-border px-3 pt-4">
            <div className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{user.name[0]}</div>
            <div className="min-w-0 text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-5 py-3.5 backdrop-blur lg:hidden">
        <Link to="/app">
          <Logo />
        </Link>
        <Link to="/app/settings" className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {user.name[0]}
        </Link>
      </header>

      <main className="pb-28 lg:pb-0">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {main.map(({ to, label, icon: Icon, exact }) => (
          <Link key={to} to={to} activeOptions={{ exact: !!exact }} className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground" activeProps={{ className: "!text-foreground" }}>
            <Icon className="size-5" strokeWidth={1.75} />
            {label}
          </Link>
        ))}
        <Link to="/app/new" className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-accent">
          <Plus className="size-5" strokeWidth={2} />
          New
        </Link>
      </nav>
    </div>
  );
}
