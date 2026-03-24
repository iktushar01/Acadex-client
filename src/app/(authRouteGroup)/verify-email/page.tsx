"use client";

import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Verify Email</h1>
        
        {email && (
          <p className="text-sm text-muted-foreground mb-4">
            Verification email sent to: <span className="font-semibold">{email}</span>
          </p>
        )}
        
        <div className="p-6 border rounded-lg bg-card">
          <p className="text-muted-foreground">
            Email verification form component coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
