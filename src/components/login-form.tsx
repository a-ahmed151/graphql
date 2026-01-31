import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  onSubmit,
  register,
  errors,
  isSubmitting,
  ...props
}: React.ComponentProps<"div"> & {
  onSubmit: (e: React.FormEvent) => void;
  register: any;
  errors?: any;
  isSubmitting?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
                {errors?.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" placeholder="Enter your password" required {...register("password")} />
                {errors?.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Login"}</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
