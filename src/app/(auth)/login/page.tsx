import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="h-96 animate-pulse bg-surface rounded-2xl" />}
    >
      <LoginForm />
    </Suspense>
  );
}
