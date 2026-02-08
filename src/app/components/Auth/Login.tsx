import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";

type LoginForm = {
  email: string;
  password: string;
};

export function Login() {
  const methods = useForm<LoginForm>({ mode: "onBlur" });
  const { register, handleSubmit, formState } = methods;
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  async function onSubmit(values: LoginForm) {
    setError(null);
    try {
      await auth.login(values.email, values.password);
      // redirect to requested page or default
      const from = (location.state as any)?.from?.pathname || "/chat";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message ? String(err.message) : "Login failed");
    }
  }

  return (
    <div className="w-full">
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...register("email", { required: "Email required" })}
                  type="email"
                  placeholder="you@university.edu"
                  aria-label="Email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...register("password", { required: "Password required" })}
                  type="password"
                  placeholder="••••••••"
                  aria-label="Password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="flex items-center justify-between gap-2">
              <Button type="submit" className="flex-1">
                {formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/signup" className="text-primary underline">
                Create an account
              </Link>
            </p>
          </form>
        </Form>
      </div>
  );
}

export default Login;

