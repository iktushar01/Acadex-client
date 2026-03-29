"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Crown,
  Loader2,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { getClassroomMembersAction, updateClassroomMemberRoleAction } from "@/actions/classroomActions/_manageClassroomActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ClassroomManageMembersPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const classroomId = params?.id as string;

  const membersQuery = useQuery({
    queryKey: ["classroom-members", classroomId],
    queryFn: async () => getClassroomMembersAction(classroomId),
    enabled: Boolean(classroomId),
  });

  const roleMutation = useMutation({
    mutationFn: ({
      targetUserId,
      role,
    }: {
      targetUserId: string;
      role: "STUDENT" | "CR";
    }) => updateClassroomMemberRoleAction(classroomId, targetUserId, role),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      await queryClient.invalidateQueries({ queryKey: ["classroom-members", classroomId] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const classroom = membersQuery.data?.data;
  const crCount = useMemo(
    () => classroom?.memberships.filter((member) => member.role === "CR").length ?? 0,
    [classroom?.memberships],
  );

  if (membersQuery.isLoading) {
    return <ClassroomManageMembersSkeleton />;
  }

  if (!membersQuery.data?.success || !classroom) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-10 text-center">
          <p className="text-lg font-black text-destructive">Failed to load classroom members.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {membersQuery.data?.error || "Only CR can open this page."}
          </p>
          <Button onClick={() => router.back()} className="mt-6 rounded-2xl font-bold">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Badge className="rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em]">
                CR Control
              </Badge>
              <h1 className="text-4xl font-black tracking-tighter">{classroom.name}</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Manage who leads this classroom. You can promote members to CR and demote CRs back to regular members, but the last remaining CR cannot be removed.
              </p>
            </div>

            <Button variant="outline" onClick={() => router.push("/dashboard/classroom")} className="rounded-2xl font-bold">
              <ArrowLeft className="mr-2 size-4" />
              Back to Classrooms
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Total Members" value={classroom.memberships.length} icon={<Users className="size-5" />} />
          <SummaryCard label="Current CR" value={crCount} icon={<Crown className="size-5" />} />
          <SummaryCard label="Institution" value={classroom.institutionName} icon={<ShieldCheck className="size-5" />} />
        </div>

        <div className="space-y-4">
          {classroom.memberships.map((member) => {
            const nextRole = member.role === "CR" ? "STUDENT" : "CR";
            const isLastCR = member.role === "CR" && crCount <= 1;
            const isPending =
              roleMutation.isPending && roleMutation.variables?.targetUserId === member.user.id;

            return (
              <Card key={member.user.id} className="rounded-[2rem] border-border/50 bg-card/60 p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar className="h-14 w-14 border border-border">
                      <AvatarImage src={member.user.image} />
                      <AvatarFallback className="text-sm font-black">
                        {member.user.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-lg font-black tracking-tight">{member.user.name}</p>
                        <Badge variant={member.role === "CR" ? "default" : "outline"}>
                          {member.role}
                        </Badge>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">{member.user.email}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      roleMutation.mutate({
                        targetUserId: member.user.id,
                        role: nextRole,
                      })
                    }
                    disabled={isPending || isLastCR}
                    className="rounded-2xl font-bold"
                    variant={member.role === "CR" ? "outline" : "default"}
                  >
                    {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <UserRound className="mr-2 size-4" />}
                    {member.role === "CR" ? "Make Member" : "Make CR"}
                  </Button>
                </div>

                {isLastCR && (
                  <p className="mt-3 text-xs font-medium text-orange-500">
                    This CR cannot be demoted until another member is promoted to CR.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <Card className="rounded-[2rem] border-border/50 bg-card/50 p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
        <p className="text-xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  </Card>
);

const ClassroomManageMembersSkeleton = () => (
  <div className="min-h-screen bg-background p-6 md:p-10 animate-pulse">
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
        <div className="space-y-4">
          <div className="h-6 w-28 rounded-full bg-muted" />
          <div className="h-12 w-72 rounded-2xl bg-muted" />
          <div className="h-5 w-full max-w-2xl rounded-xl bg-muted" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 rounded-[2rem] border border-border bg-card" />
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-28 rounded-[2rem] border border-border bg-card" />
        ))}
      </div>
    </div>
  </div>
);

export default ClassroomManageMembersPage;
