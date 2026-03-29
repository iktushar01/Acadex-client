import { ClassroomLeaderboardSkeleton } from "@/components/modules/classroom/leaderboard/ClassroomLeaderboardSkeleton";
import { Input } from "@/components/ui/input";

const LeaderboardLoadingPage = () => {
  return (
    <div className="min-h-screen bg-background/50 p-4 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 rounded-full bg-primary" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">
                Hall of Fame
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-none tracking-tighter md:text-6xl">
              Track your <span className="text-muted-foreground">Classroom</span> Standing.
            </h1>

            <p className="max-w-xl font-medium leading-relaxed text-muted-foreground">
              Access detailed podium rankings and contribution stats for every classroom you are part of.
            </p>
          </div>

          <div className="max-w-md">
            <Input
              disabled
              placeholder="Filter by classroom or school..."
              className="h-14 rounded-2xl border-border/50 bg-card/50 pl-12 shadow-sm backdrop-blur-md"
            />
          </div>
        </header>

        <ClassroomLeaderboardSkeleton />
      </div>
    </div>
  );
};

export default LeaderboardLoadingPage;
