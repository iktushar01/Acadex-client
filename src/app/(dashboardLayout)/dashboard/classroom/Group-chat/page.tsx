"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassroomChat } from "@/components/chat/ClassroomChat";
import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";
import { getCurrentUserAction } from "@/actions/_getCurrentUserAction";

type ClassroomOption = {
  id: string;
  name: string;
};

const GroupChatPage = () => {
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [classroomsResult, userResult] = await Promise.all([
          fetchMyClassroomsAction(),
          getCurrentUserAction(),
        ]);

        const options =
          classroomsResult.data?.map((membership: {
            classroom: { id: string; name: string };
          }) => ({
            id: membership.classroom.id,
            name: membership.classroom.name,
          })) ?? [];

        setClassrooms(options);
        setSelectedClassroomId(options[0]?.id ?? "");
        setCurrentUserId(userResult.data?.id);
      } catch (error) {
        console.error("Failed to load chat page data:", error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const selectedClassroom = classrooms.find(
    (item) => item.id === selectedClassroomId,
  );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link href="/dashboard/classroom">
            <Button variant="ghost" size="sm" className="mb-1 -ml-2 h-8 px-2">
              <ArrowLeft className="size-4" />
              Back to classrooms
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Classroom Chat
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time group chat for your enrolled classes.
          </p>
        </div>

        {classrooms.length > 1 && (
          <select
            value={selectedClassroomId}
            onChange={(event) => setSelectedClassroomId(event.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
          >
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed">
          <p className="text-sm text-muted-foreground">Loading chat...</p>
        </div>
      ) : classrooms.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Join a classroom to start chatting with your classmates.
          </p>
          <Link href="/dashboard/classroom/join">
            <Button>Join a classroom</Button>
          </Link>
        </div>
      ) : selectedClassroom ? (
        <ClassroomChat
          key={selectedClassroom.id}
          classroomId={selectedClassroom.id}
          classroomName={selectedClassroom.name}
          currentUserId={currentUserId}
        />
      ) : null}
    </div>
  );
};

export default GroupChatPage;
