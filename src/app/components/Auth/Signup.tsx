import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { authSignup, getInstitutions, getDepartments } from "../../../lib/api";

type SignupForm = {
  email: string;
  password: string;
  full_name?: string;
  institution_id?: number | null;
  department_id?: string | null;
  is_student: boolean;
};

export function Signup() {
  const methods = useForm<SignupForm>({ mode: "onBlur", defaultValues: { is_student: false } });
  const { register, handleSubmit, watch, setValue, formState } = methods;
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const isStudent = watch("is_student");
  const institutionId = watch("institution_id");
  const [institutions, setInstitutions] = React.useState<Array<{ id: number; name: string }>>([]);
  const [departments, setDepartments] = React.useState<Array<{ department_id: string; name: string }>>([]);
  const [loadingInstitutions, setLoadingInstitutions] = React.useState(false);
  const [loadingDepartments, setLoadingDepartments] = React.useState(false);

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

  React.useEffect(() => {
    let cancelled = false;
    setValue("department_id", "");
    if (institutionId == null) {
      setDepartments([]);
      return;
    }
    setLoadingDepartments(true);
    setDepartments([]);
    getDepartments(institutionId)
      .then((list) => {
        if (!cancelled) setDepartments(list || []);
      })
      .catch(() => {
        if (!cancelled) setDepartments([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingDepartments(false);
      });
    return () => {
      cancelled = true;
    };
  }, [institutionId]);

  async function onSubmit(values: SignupForm) {
    setError(null);
    if (!values.is_student) {
      setError("Signup is allowed only for students. Please confirm.");
      return;
    }
    if (values.institution_id != null && !values.department_id) {
      setError("Please select a department when signing up with an institution.");
      return;
    }

    try {
      // backend expects institution_id maybe null
      const payload = {
        email: values.email,
        password: values.password,
        full_name: values.full_name || null,
        institution_id: values.institution_id || null,
        department_id: values.department_id || null,
      };

      await authSignup(payload);
      // after signup user will be in pending status; redirect to login
      navigate("/login");
      try {
        const { showSuccess } = await import("../../../app/lib/toast");
        showSuccess("Account created — pending approval by your institution.");
      } catch {
        // ignore
      }
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
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Loading institutions…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__loading__">Loading institutions…</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={institutionId != null ? String(institutionId) : "__none__"}
                    onValueChange={(v) =>
                      setValue("institution_id", v === "__none__" ? undefined : Number(v))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {institutions.map((i) => (
                        <SelectItem key={i.id} value={String(i.id)}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Department (required when institution selected)</FormLabel>
              <FormControl>
                {loadingDepartments && institutionId ? (
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Loading departments…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__loading__">Loading departments…</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={watch("department_id") || "__none__"}
                    onValueChange={(v) => setValue("department_id", v === "__none__" ? "" : v)}
                    disabled={!institutionId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          institutionId ? "Select department" : "Select institution first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">
                        {institutionId ? "Select department" : "Select institution first"}
                      </SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={d.department_id} value={d.department_id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

