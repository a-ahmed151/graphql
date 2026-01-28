import { useAuth } from "../auth";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm } from "@/components/login-form";

const fallback = "/profile";

export const Route = createFileRoute("/login")({
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
  password: z.string().min(6),
});

type FormInputs = z.infer<typeof schema>;

function RouteComponent() {
  const { register, handleSubmit } = useForm<FormInputs>({
    resolver: zodResolver(schema),
  });
  const auth = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (v) => {
    const success = await auth.login(v.email, v.password);
    if (success) {
      navigate({ to: "/profile" });
    }
  };
  return <LoginForm onSubmit={handleSubmit(onSubmit)} register={register} />;
}
