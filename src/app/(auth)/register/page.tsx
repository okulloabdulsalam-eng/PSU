"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Chrome, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });
    const result = await res.json();
    if (!res.ok) {
      toast.error(result.error || "Registration failed");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    router.push("/dashboard");
    router.refresh();
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl border border-border shadow-card p-8"
    >
      <h1 className="font-sora text-2xl font-bold text-dark mb-1">Create your account</h1>
      <p className="text-muted text-sm mb-6">Start preparing for your pharmacy licensing exam today</p>

      <Button variant="outline" className="w-full mb-4" onClick={() => { setGoogleLoading(true); signIn("google", { callbackUrl: "/dashboard" }); }} disabled={googleLoading}>
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Chrome className="h-4 w-4" />}
        Sign up with Google
      </Button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs text-muted bg-surface px-2">or sign up with email</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Aisha Nakato" className="mt-1" {...register("name")} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@example.com" className="mt-1" {...register("email")} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Input id="password" type={showPass ? "text" : "password"} placeholder="Min 8 characters" {...register("password")} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" placeholder="Repeat password" className="mt-1" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Create Account
        </Button>
      </form>

      <p className="text-center text-xs text-muted mt-4">
        By registering, you agree to our{" "}
        <Link href="/terms" className="text-primary-500 hover:underline">Terms</Link> and{" "}
        <Link href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>.
      </p>

      <p className="text-center text-sm text-muted mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
      </p>
    </motion.div>
  );
}
