import { useAuth } from "../auth";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm } from "@/components/login-form";
import { DigitalCard } from "@/components/DigitalCard";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

const fallback = "/profile";

export const Route = createFileRoute("/")({
  validateSearch: z.object({ redirect: z.string().optional().catch("") }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: RouteComponent,
});

const schema = z.object({
  email: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormInputs = z.infer<typeof schema>;

function RouteComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
  });
  const [loginError, setLoginError] = useState<string>("");
  const auth = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (v) => {
    setLoginError("");
    const success = await auth.login(v.email, v.password);
    if (success === "") {
      navigate({ to: "/profile" });
    } else {
      setLoginError(success);
    }
  };
  return (
    <div className="flex min-h-screen flex-col place-items-center place-content-center relative p-4">
      {/* Mode Toggle Absolute Position */}
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <div className="mb-8 text-center space-y-2 z-10">
        <div className="flex justify-center mb-4">
          <div className="size-16 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-colors"></div>
            <svg
              className="size-8 text-primary relative z-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-widest uppercase">
          Tamer<span className="text-primary">.Gate</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-xs">SECURE CONNECTION ESTABLISHED</p>
      </div>

      {loginError && (
        <div className="mb-4 w-full max-w-md p-3 bg-red-500/10 border border-red-500/50 rounded-md backdrop-blur-sm">
          <p className="text-red-500 dark:text-red-400 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {loginError}
          </p>
        </div>
      )}

      <DigitalCard variant="neon" className="w-full max-w-md p-1 bg-card/80 backdrop-blur-xl border-border/50">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1">Identify Yourself</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Enter your digital signature to access the network.</p>
          </div>
          <LoginForm
            className="w-full"
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </div>
      </DigitalCard>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-600 font-mono">
          SYSTEM VERSION 2.0.4 <br />
          UNAUTHORIZED ACCESS IS PROHIBITED
        </p>
      </div>
    </div>
  );
}
