"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserAction, type UserProfile } from "@/actions/_getCurrentUserAction";
import { updateProfileAction } from "@/actions/authActions/_updateProfileAction";
import {
  BadgeCheck,
  Globe,
  Loader2,
  MailCheck,
  Pencil,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  Save,
  Calendar,
  Mail,
  Camera,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProfileFormState = {
  name: string;
  contactNumber: string;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "";
};

const mapUserToForm = (user: UserProfile): ProfileFormState => ({
  name: user.name ?? "",
  contactNumber: user.student?.contactNumber ?? user.admin?.contactNumber ?? "",
  address: user.student?.address ?? "",
  gender: (user.student?.gender as ProfileFormState["gender"]) ?? "",
});

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await getCurrentUserAction(),
  });

  const user = data?.data;
  const [draft, setDraft] = useState<ProfileFormState | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateMutation = useMutation({
    mutationFn: updateProfileAction,
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setDraft(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setSelectedImage(null);
      setImagePreview(null);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4 p-12 rounded-[2.5rem] border border-destructive/20 bg-destructive/5 backdrop-blur-md">
          <ShieldCheck className="h-12 w-12 text-destructive mx-auto opacity-50" />
          <h2 className="text-2xl font-black italic tracking-tighter">Access Denied</h2>
          <p className="text-sm text-muted-foreground font-medium">
            {error?.message || "Internal system sync failure."}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-2xl border-destructive/20 hover:bg-destructive/10 font-bold"
          >
            Re-authenticate
          </Button>
        </div>
      </div>
    );
  }

  const isStudent = user.role === "STUDENT";
  const isSaving = updateMutation.isPending;
  const form = draft ?? mapUserToForm(user);
  const previewImage =
    imagePreview ||
    user.student?.profilePhoto ||
    user.admin?.profilePhoto ||
    user.image ||
    undefined;

  const handleImageChange = (file: File | null) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(nextPreview);
  };

  const handleFieldChange = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setDraft((current) => ({ ...(current ?? form), [key]: value }));
  };

  const handleSave = async () => {
    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("contactNumber", form.contactNumber.trim());
    if (isStudent) {
      payload.append("address", form.address.trim());
      payload.append("gender", form.gender);
    }
    if (selectedImage) {
      payload.append("image", selectedImage);
    }

    await updateMutation.mutateAsync(payload);
  };

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-[3rem] border border-border bg-card p-8 shadow-premium">
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              <div className="relative">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full border-[8px] border-background shadow-2xl group"
                >
                  {previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewImage} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-primary text-primary-foreground text-5xl font-black">
                        {user.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="size-8 text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 rounded-2xl border-4 border-background bg-primary p-3 text-primary-foreground shadow-xl"
                >
                  <Pencil className="size-5" />
                </button>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={() => handleImageChange(null)}
                    className="absolute -right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white shadow-lg"
                  >
                    <X className="size-4" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-black tracking-tighter md:text-5xl">{user.name}</h1>
                    {user.emailVerified && <BadgeCheck className="size-8 text-primary fill-primary/10" />}
                  </div>
                  <p className="flex items-center gap-2 font-bold text-muted-foreground">
                    <Mail className="size-4" />
                    {user.email}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-xl bg-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground">
                    {user.role}
                  </Badge>
                  <Badge variant="outline" className="rounded-xl border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[3rem] bg-primary p-8 text-primary-foreground shadow-glow">
            <div className="flex items-start justify-between">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
                <ShieldCheck className="size-6" />
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                variant="ghost"
                className="rounded-2xl bg-white/10 text-white hover:bg-white/20"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Profile Control</p>
              <h3 className="text-3xl font-black tracking-tighter">Keep Your Details Fresh</h3>
              <p className="text-sm font-medium leading-tight opacity-80">
                Update the fields below and save to sync your profile across Acadex.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">Editable Profile</h3>
            <div className="grid grid-cols-1 gap-4 rounded-[2.5rem] border border-border bg-card p-6 shadow-sm md:grid-cols-2">
              <ProfileField label="Full Name" icon={<User className="size-4" />}>
                <Input
                  value={form.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="h-11 rounded-2xl"
                  placeholder="Your full name"
                />
              </ProfileField>

              <ProfileField label="Contact Number" icon={<Phone className="size-4" />}>
                <Input
                  value={form.contactNumber}
                  onChange={(e) => handleFieldChange("contactNumber", e.target.value)}
                  className="h-11 rounded-2xl"
                  placeholder="+8801..."
                />
              </ProfileField>

              <ProfileField label="Profile Photo" icon={<Camera className="size-4" />}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-11 w-full items-center justify-between rounded-2xl border border-input bg-transparent px-4 text-sm transition-colors hover:border-primary/50 hover:bg-muted/40"
                >
                  <span className="truncate text-left">
                    {selectedImage ? selectedImage.name : "Choose a new profile image"}
                  </span>
                  <span className="font-bold text-primary">Browse</span>
                </button>
              </ProfileField>

              {isStudent && (
                <ProfileField label="Gender" icon={<User className="size-4" />}>
                  <Select
                    value={form.gender || "__empty__"}
                    onValueChange={(value) =>
                      handleFieldChange("gender", value === "__empty__" ? "" : (value as ProfileFormState["gender"]))
                    }
                  >
                    <SelectTrigger className="h-11 w-full rounded-2xl">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty__">Not set</SelectItem>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </ProfileField>
              )}

              {isStudent && (
                <div className="md:col-span-2">
                  <ProfileField label="Address" icon={<MapPin className="size-4" />}>
                    <Textarea
                      value={form.address}
                      onChange={(e) => handleFieldChange("address", e.target.value)}
                      className="min-h-28 rounded-[1.5rem] px-4 py-3"
                      placeholder="Add your address"
                    />
                  </ProfileField>
                </div>
              )}

              <div className="md:col-span-2 flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-12 rounded-2xl bg-orange-500 px-6 font-black text-white hover:bg-orange-600"
                >
                  {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Integration</h3>

            <div className="space-y-4">
              <StatusCard
                icon={<MailCheck className="size-6" />}
                title="Email Status"
                value={user.emailVerified ? "Primary Verified" : "Verification Pending"}
                tone="success"
              />

              <StatusCard
                icon={<Globe className="size-6" />}
                title="Joined"
                value={joinedDate}
                tone="default"
              />

              <div className="rounded-[2.5rem] border border-border bg-muted/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-card p-3 shadow-sm">
                    <Calendar className="size-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Email</p>
                    <p className="font-bold">{user.email}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email editing is intentionally locked because it is tied to your authentication identity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 px-1">
      <span className="rounded-xl bg-primary/10 p-2 text-primary">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
    </div>
    {children}
  </div>
);

const StatusCard = ({
  icon,
  title,
  value,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  tone: "success" | "default";
}) => (
  <div className="rounded-[2.5rem] border border-border bg-card/50 p-6 backdrop-blur-sm">
    <div className="flex items-center gap-4">
      <div
        className={
          tone === "success"
            ? "rounded-2xl bg-green-500/10 p-3 text-green-600"
            : "rounded-2xl bg-primary/10 p-3 text-primary"
        }
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const ProfilePageSkeleton = () => (
  <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12 animate-pulse">
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[3rem] border border-border bg-card p-8 shadow-premium">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="h-40 w-40 rounded-full bg-muted" />
            <div className="flex-1 space-y-4">
              <div className="h-12 w-64 rounded-2xl bg-muted" />
              <div className="h-5 w-72 rounded-xl bg-muted" />
              <div className="flex gap-3">
                <div className="h-8 w-24 rounded-xl bg-muted" />
                <div className="h-8 w-24 rounded-xl bg-muted" />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[3rem] bg-card p-8 shadow-premium">
          <div className="flex items-start justify-between">
            <div className="h-12 w-12 rounded-2xl bg-muted" />
            <div className="h-10 w-24 rounded-2xl bg-muted" />
          </div>
          <div className="mt-20 space-y-3">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-10 w-56 rounded-2xl bg-muted" />
            <div className="h-5 w-full rounded-xl bg-muted" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-3 w-32 rounded bg-muted" />
          <div className="grid grid-cols-1 gap-4 rounded-[2.5rem] border border-border bg-card p-6 shadow-sm md:grid-cols-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={index === 4 ? "md:col-span-2 space-y-2" : "space-y-2"}>
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-11 w-full rounded-2xl bg-muted" />
              </div>
            ))}
            <div className="md:col-span-2 flex justify-end">
              <div className="h-12 w-40 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-3 w-36 rounded bg-muted" />
          <div className="space-y-4">
            <div className="h-28 rounded-[2.5rem] bg-card" />
            <div className="h-28 rounded-[2.5rem] bg-card" />
            <div className="h-40 rounded-[2.5rem] bg-card" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePage;
