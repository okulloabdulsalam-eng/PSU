"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const profileForm = useForm({ resolver: zodResolver(profileSchema), values: { name: session?.user.name || "", email: session?.user.email || "" } });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const onProfileSave = async (data: any) => {
    setProfileLoading(true);
    const res = await fetch("/api/user/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setProfileLoading(false);
    if (res.ok) { await update(data); toast.success("Profile updated!"); }
    else toast.error("Failed to update profile");
  };

  const onPasswordSave = async (data: any) => {
    setPasswordLoading(true);
    const res = await fetch("/api/user/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setPasswordLoading(false);
    if (res.ok) { toast.success("Password changed!"); passwordForm.reset(); }
    else { const d = await res.json(); toast.error(d.error || "Failed to change password"); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-sora text-3xl font-bold text-dark">Settings</h1>
        <p className="text-muted text-sm mt-1">Manage your account</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user.image || ""} />
              <AvatarFallback className="text-lg">{getInitials(session?.user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-dark">{session?.user.name}</p>
              <p className="text-sm text-muted">{session?.user.plan} plan</p>
            </div>
          </div>
          <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input className="mt-1" {...profileForm.register("name")} />
              {profileForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.name.message as string}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input className="mt-1" type="email" {...profileForm.register("email")} />
              {profileForm.formState.errors.email && <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.email.message as string}</p>}
            </div>
            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSave)} className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input className="mt-1" type="password" {...passwordForm.register("currentPassword")} />
            </div>
            <div>
              <Label>New Password</Label>
              <Input className="mt-1" type="password" {...passwordForm.register("newPassword")} />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input className="mt-1" type="password" {...passwordForm.register("confirmPassword")} />
              {passwordForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message as string}</p>}
            </div>
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
