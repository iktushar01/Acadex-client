"use client";

import { useState, useEffect, useCallback } from "react";
import {
  toggleFavoriteAction,
  getFavoriteStatusAction,
} from "@/actions/_notedetailactions";

export function useNoteFavorite(noteId: string) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  // Fetch initial state
  useEffect(() => {
    let cancelled = false;
    getFavoriteStatusAction(noteId).then((res) => {
      if (!cancelled) {
        setIsFavorited(res.isFavorited);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [noteId]);

  const toggle = useCallback(async () => {
    if (toggling || !noteId) return;
    // Optimistic update
    setIsFavorited((prev) => !prev);
    setToggling(true);

    const res = await toggleFavoriteAction(noteId);
    if (!res.success) {
      // Rollback on failure
      setIsFavorited((prev) => !prev);
    } else {
      setIsFavorited(res.isFavorited);
    }
    setToggling(false);
  }, [noteId, toggling]);

  return { isFavorited, loading, toggling, toggle };
}
