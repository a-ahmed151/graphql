import { useAuth } from "../auth";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm } from "@/components/login-form";
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
    formState: { errors,isSubmitting },
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
    <div className="flex min-h-screen flex-col place-items-center place-content-center">
      {loginError && (
        <div className="mb-4 w-screen max-w-md p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{loginError}</p>
        </div>
      )}
      <LoginForm
        className="w-screen max-w-md"
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
