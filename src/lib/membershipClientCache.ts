type MembershipItem = {
  classroom: { id: string; name: string };
  memberRole: string;
};

type MembershipCache = {
  data: MembershipItem[];
  fetchedAt: number;
};

const CACHE_TTL_MS = 60_000;
let memoryCache: MembershipCache | null = null;
let inflight: Promise<MembershipItem[] | null> | null = null;

export async function getClientMemberships(
  fetcher: () => Promise<{
    success: boolean;
    data?: MembershipItem[];
  }>,
): Promise<MembershipItem[] | null> {
  const now = Date.now();

  if (memoryCache && now - memoryCache.fetchedAt < CACHE_TTL_MS) {
    return memoryCache.data;
  }

  if (!inflight) {
    inflight = fetcher()
      .then((result) => {
        if (result.success && result.data) {
          memoryCache = { data: result.data, fetchedAt: Date.now() };
          return result.data;
        }
        return null;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}

export function clearMembershipCache() {
  memoryCache = null;
}
