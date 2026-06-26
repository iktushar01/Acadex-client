import type { Flashcard, FlashcardDeck } from "./flashcards.types";

export const STORAGE_KEY = "acadex-flashcards";

export const uid = () => crypto.randomUUID();

export const defaultFlashcardState = (): { decks: FlashcardDeck[]; activeDeckId: string | null } => ({
  decks: [],
  activeDeckId: null,
});

/** Parse pasted text into Q/A pairs */
export const parseTextToCards = (text: string): { front: string; back: string }[] => {
  const cards: { front: string; back: string }[] = [];
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const qa = line.match(/^Q:\s*(.+?)\s*A:\s*(.+)$/i);
    if (qa) {
      cards.push({ front: qa[1].trim(), back: qa[2].trim() });
      continue;
    }

    const colon = line.match(/^(.+?):\s*(.+)$/);
    if (colon && colon[1].length < 80) {
      cards.push({ front: colon[1].trim(), back: colon[2].trim() });
      continue;
    }

    const bullet = line.match(/^[-*•]\s*(.+?)\s*[-–—]\s*(.+)$/);
    if (bullet) {
      cards.push({ front: bullet[1].trim(), back: bullet[2].trim() });
    }
  }

  return cards;
};

export const deckStats = (cards: Flashcard[]) => {
  const mastered = cards.filter((c) => c.level === "easy").length;
  const needReview = cards.filter((c) => c.level === "again" || c.level === "hard").length;
  return { mastered, needReview, total: cards.length };
};

export const shuffle = <T,>(arr: T[]) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const exportDeckCsv = (deck: FlashcardDeck) => {
  const rows = [["front", "back", "tags"], ...deck.cards.map((c) => [c.front, c.back, c.tags.join(";")])];
  return rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
};

export const exportDeckJson = (deck: FlashcardDeck) => JSON.stringify(deck, null, 2);

export const makeQuizOptions = (correct: Flashcard, all: Flashcard[]) => {
  const distractors = shuffle(all.filter((c) => c.id !== correct.id)).slice(0, 3).map((c) => c.back);
  const options = shuffle([correct.back, ...distractors]);
  return options;
};
