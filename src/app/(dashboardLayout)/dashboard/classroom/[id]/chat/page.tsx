"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassroomChat } from "@/components/chat/ClassroomChat";
import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";
import { getCurrentUserAction } from "@/actions/_getCurrentUserAction";

const ClassroomChatRoutePage = () => {
  const { id } = useParams();
  const classroomId = id as string;

  const [classroomName, setClassroomName] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!classroomId) return;

      try {
        const [classroomsResult, userResult] = await Promise.all([
          fetchMyClassroomsAction(),
          getCurrentUserAction(),
        ]);

        const membership = classroomsResult.data?.find(
          (item: { classroom: { id: string; name: string } }) =>
            item.classroom.id === classroomId,
        );

        if (!membership) {
          setError("You are not a member of this classroom.");
          return;
        }

        setClassroomName(membership.classroom.name);
        setCurrentUserId(userResult.data?.id);
      } catch (loadError) {
        console.error("Failed to load classroom chat:", loadError);
        setError("Failed to load classroom chat.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [classroomId]);

  return (
    <div className="mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="space-y-1">
        <Link href={`/dashboard/classroom/${classroomId}`}>
          <Button variant="ghost" size="sm" className="mb-1 -ml-2 h-8 px-2">
            <ArrowLeft className="size-4" />
            Back to classroom
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {classroomName ? `${classroomName} Chat` : "Classroom Chat"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Real-time group chat for this classroom.
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed">
          <p className="text-sm text-muted-foreground">Loading chat...</p>
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link href="/dashboard/classroom">
            <Button variant="outline">Go to classrooms</Button>
          </Link>
        </div>
      ) : (
        <ClassroomChat
          classroomId={classroomId}
          classroomName={classroomName}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default ClassroomChatRoutePage;
