import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button, inputCls, Logo } from "@/components/proof/primitives";
import { useProof } from "@/lib/proof/store";

const search = z.object({ mode: z.enum(["login", "signup", "forgot"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Sign in — Proof." },
      { name: "description", content: "Sign in or create your Proof. account." },
      { property: "og:title", content: "Sign in — Proof." },
      { property: "og:description", content: "Sign in or create your Proof. account." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const { mode = "login" } = Route.useSearch();
  const nav = useNavigate();
  const { signIn } = useProof();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const titles = {
    login: ["Welcome back.", "Your commitments are waiting."],
    signup: ["Make it binding.", "Create an account to lock your first commitment."],
    forgot: ["Reset password.", "We'll email you a reset link."],
  } as const;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      toast("If that email exists, a reset link is on its way.");
      return;
    }
    signIn(name || undefined, email || undefined);
    nav({ to: "/app" });
  };

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/">
          <Logo />
        </Link>
        <h1 className="display mt-14 text-4xl">{titles[mode][0]}</h1>
        <p className="mt-3 text-muted-foreground">{titles[mode][1]}</p>
        <form onSubmit={submit} className="mt-10 space-y-3">
          {mode === "signup" && <input className={inputCls} placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} />}
          <input className={inputCls} type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {mode !== "forgot" && <input className={inputCls} type="password" required minLength={6} placeholder="Password" />}
          <Button type="submit" size="lg" className="w-full">
            {mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Send reset link"}
          </Button>
          {mode !== "forgot" && (
            <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => { signIn(); nav({ to: "/app" }); }}>
              Continue with Google
            </Button>
          )}
        </form>
        <div className="mt-8 flex justify-between text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              <Link to="/auth" search={{ mode: "signup" }} className="hover:text-foreground">Create account</Link>
              <Link to="/auth" search={{ mode: "forgot" }} className="hover:text-foreground">Forgot password?</Link>
            </>
          ) : (
            <Link to="/auth" search={{ mode: "login" }} className="hover:text-foreground">Already have an account? Log in</Link>
          )}
        </div>
      </div>
    </div>
  );
}
