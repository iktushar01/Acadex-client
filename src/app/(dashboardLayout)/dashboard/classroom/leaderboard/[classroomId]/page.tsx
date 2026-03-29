import ClassroomLeaderboardDetailsPage from "@/components/modules/classroom/leaderboard/ClassroomLeaderboardDetailsPage";

const LeaderboardDetailsRoutePage = async ({
  params,
}: {
  params: Promise<{ classroomId: string }>;
}) => {
  const { classroomId } = await params;

  return <ClassroomLeaderboardDetailsPage classroomId={classroomId} />;
};

export default LeaderboardDetailsRoutePage;
