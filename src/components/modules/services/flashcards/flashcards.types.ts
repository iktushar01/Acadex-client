export type RepetitionLevel = "again" | "hard" | "medium" | "easy" | "new";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  tags: string[];
  level: RepetitionLevel;
  favorite: boolean;
};

export type FlashcardDeck = {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: string;
};

export type StudyMode = "classic" | "quiz" | "write";

export type FlashcardState = {
  decks: FlashcardDeck[];
  activeDeckId: string | null;
};
