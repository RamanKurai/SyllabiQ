import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { authSignup, getInstitutions } from "../../../lib/api";

type SignupForm = {
  email: string;
  password: string;
  full_name?: string;
  institution_id?: number | null;
  is_student: boolean;
};

export function Signup() {
  const methods = useForm<SignupForm>({ mode: "onBlur", defaultValues: { is_student: false } });
  const { register, handleSubmit, watch, formState } = methods;
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const isStudent = watch("is_student");
  const [institutions, setInstitutions] = React.useState<Array<{ id: number; name: string }>>([]);
  const [loadingInstitutions, setLoadingInstitutions] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoadingInstitutions(true);
    getInstitutions()
      .then((list) => {
        if (!cancelled) setInstitutions(list || []);
      })
      .catch(() => {
        if (!cancelled) setInstitutions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingInstitutions(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(values: SignupForm) {
    setError(null);
    if (!values.is_student) {
      setError("Signup is allowed only for students. Please confirm.");
      return;
    }

    try {
      // backend expects institution_id maybe null
      const payload = {
        email: values.email,
        password: values.password,
        full_name: values.full_name || null,
        institution_id: values.institution_id || null,
      };

      await authSignup(payload);
      // after signup user will be in pending status; redirect to login
      navigate("/login");
    } catch (err: any) {
      setError(err?.message ? String(err.message) : "Signup failed");
    }
  }

  return (
    <div className="w-full">
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...register("full_name")} type="text" placeholder="Your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...register("email", { required: "Email required" })} type="email" placeholder="you@university.edu" />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...register("password", { required: "Password required", minLength: { value: 6, message: "Password too short" } })} type="password" placeholder="Choose a secure password" />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Institution (optional)</FormLabel>
              <FormControl>
                {loadingInstitutions ? (
                  <select
                    disabled
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input box-border flex h-9 w-full min-w-0 rounded-md border px-4 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  >
                    <option>Loading institutions…</option>
                  </select>
                ) : (
                  <select
                    {...register("institution_id", { valueAsNumber: true })}
                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input box-border flex h-9 w-full min-w-0 rounded-md border px-4 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  >
                    <option value="">None</option>
                    {institutions.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className="flex items-center gap-2">
              <input
                id="is_student"
                {...register("is_student")}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="is_student" className="text-sm">
                I confirm I am a student (required)
              </label>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="flex items-center justify-between gap-2">
              <Button type="submit" className="flex-1" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Creating..." : "Create account"}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Already registered?{" "}
              <Link to="/login" className="text-primary underline">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </div>
  );
}

export default Signup;

