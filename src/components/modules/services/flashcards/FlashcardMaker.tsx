"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Heart,
  Layers,
  Plus,
  RotateCcw,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServicePageHeader } from "../shared/ServicePageHeader";
import { useLocalStorageState } from "../shared/useLocalStorageState";
import type { Flashcard, RepetitionLevel, StudyMode } from "./flashcards.types";
import {
  STORAGE_KEY,
  deckStats,
  defaultFlashcardState,
  exportDeckCsv,
  exportDeckJson,
  makeQuizOptions,
  parseTextToCards,
  shuffle,
  uid,
} from "./flashcards.utils";

const LEVELS: RepetitionLevel[] = ["again", "hard", "medium", "easy"];

export default function FlashcardMaker() {
  const [state, setState, hydrated] = useLocalStorageState(STORAGE_KEY, defaultFlashcardState());
  const [pasteText, setPasteText] = useState("");
  const [deckName, setDeckName] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [tags, setTags] = useState("");
  const [mode, setMode] = useState<StudyMode>("classic");
  const [studyIndex, setStudyIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [writeAnswer, setWriteAnswer] = useState("");
  const [writeFeedback, setWriteFeedback] = useState<string | null>(null);

  const activeDeck = state.decks.find((d) => d.id === state.activeDeckId) ?? state.decks[0] ?? null;
  const stats = activeDeck ? deckStats(activeDeck.cards) : { mastered: 0, needReview: 0, total: 0 };
  const studyCards = useMemo(
    () => (activeDeck ? shuffle(activeDeck.cards) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reshuffle when deck changes
    [activeDeck?.id, activeDeck?.cards.length],
  );
  const currentCard = studyCards[studyIndex];

  const createDeckFromPaste = () => {
    const parsed = parseTextToCards(pasteText);
    if (parsed.length === 0) {
      toast.error("No cards found. Use Q: ... A: ... or Term: definition format.");
      return;
    }
    const deck = {
      id: uid(),
      name: deckName || `Deck ${state.decks.length + 1}`,
      createdAt: new Date().toISOString(),
      cards: parsed.map((p) => ({
        id: uid(),
        front: p.front,
        back: p.back,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        level: "new" as RepetitionLevel,
        favorite: false,
      })),
    };
    setState((prev) => ({
      decks: [...prev.decks, deck],
      activeDeckId: deck.id,
    }));
    setPasteText("");
    setDeckName("");
    toast.success(`Created ${parsed.length} flashcards.`);
  };

  const addManualCard = () => {
    if (!activeDeck || !front.trim() || !back.trim()) {
      toast.error("Select a deck and fill front/back.");
      return;
    }
    const card: Flashcard = {
      id: uid(),
      front: front.trim(),
      back: back.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      level: "new",
      favorite: false,
    };
    setState((prev) => ({
      ...prev,
      decks: prev.decks.map((d) =>
        d.id === activeDeck.id ? { ...d, cards: [...d.cards, card] } : d,
      ),
    }));
    setFront("");
    setBack("");
  };

  const setCardLevel = (cardId: string, level: RepetitionLevel) => {
    if (!activeDeck) return;
    setState((prev) => ({
      ...prev,
      decks: prev.decks.map((d) =>
        d.id === activeDeck.id
          ? {
              ...d,
              cards: d.cards.map((c) => (c.id === cardId ? { ...c, level } : c)),
            }
          : d,
      ),
    }));
    advanceStudy();
  };

  const advanceStudy = () => {
    setRevealed(false);
    setWriteAnswer("");
    setWriteFeedback(null);
    const next = studyIndex + 1;
    if (next >= studyCards.length) {
      setStudyIndex(0);
      toast.success("Deck complete! Restarting.");
    } else {
      setStudyIndex(next);
    }
    if (mode === "quiz" && studyCards[next]) {
      setQuizOptions(makeQuizOptions(studyCards[next], studyCards));
    }
  };

  const startQuiz = () => {
    if (!currentCard) return;
    setQuizOptions(makeQuizOptions(currentCard, studyCards));
    setRevealed(false);
  };

  const checkWriteAnswer = () => {
    if (!currentCard) return;
    const ok =
      writeAnswer.trim().toLowerCase() === currentCard.back.trim().toLowerCase();
    setWriteFeedback(ok ? "Correct!" : `Answer: ${currentCard.back}`);
    if (ok) setTimeout(advanceStudy, 800);
  };

  const downloadExport = (type: "csv" | "json") => {
    if (!activeDeck) return;
    const content = type === "csv" ? exportDeckCsv(activeDeck) : exportDeckJson(activeDeck);
    const blob = new Blob([content], { type: type === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDeck.name}.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!hydrated) {
    return <div className="mx-auto max-w-5xl animate-pulse p-8 text-muted-foreground">Loading flashcards…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500 pb-12">
      <ServicePageHeader
        badge="Study tools"
        title="Flashcard Maker"
        description="Turn notes into flashcards. Paste text, study with classic, quiz, or write modes — with spaced repetition."
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="rounded-full">
          <Star className="mr-1 h-3 w-3" />
          Mastered: {stats.mastered}
        </Badge>
        <Badge variant="outline" className="rounded-full">
          Need review: {stats.needReview}
        </Badge>
        <Badge variant="outline" className="rounded-full">
          Total: {stats.total}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate from text
            </CardTitle>
            <CardDescription>
              One card per line: <code className="text-xs">Q: question A: answer</code> or{" "}
              <code className="text-xs">Term: definition</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Deck name"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="rounded-xl"
            />
            <Textarea
              rows={8}
              placeholder={`Q: What is Encapsulation? A: Hiding data with private members.\nConstructor: Special method to initialize objects.`}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="rounded-xl font-mono text-sm"
            />
            <Input
              placeholder="Tags (comma separated): OOP, DLD"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="rounded-xl"
            />
            <Button onClick={createDeckFromPaste} className="w-full rounded-2xl font-bold">
              <Layers className="mr-2 h-4 w-4" />
              Create deck
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Add card manually</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.decks.length > 0 && (
              <select
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                value={activeDeck?.id ?? ""}
                onChange={(e) => setState((p) => ({ ...p, activeDeckId: e.target.value }))}
              >
                {state.decks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.cards.length})
                  </option>
                ))}
              </select>
            )}
            <Input
              placeholder="Front / question"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="rounded-xl"
            />
            <Textarea
              placeholder="Back / answer"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="rounded-xl"
            />
            <Button
              onClick={addManualCard}
              disabled={!activeDeck}
              variant="outline"
              className="w-full rounded-2xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add card
            </Button>
          </CardContent>
        </Card>
      </div>

      {activeDeck && activeDeck.cards.length > 0 && (
        <>
          <Card className="rounded-[2rem] border-primary/20">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Study: {activeDeck.name}</CardTitle>
                <CardDescription>
                  Card {studyIndex + 1} of {studyCards.length}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["classic", "quiz", "write"] as StudyMode[]).map((m) => (
                  <Button
                    key={m}
                    size="sm"
                    variant={mode === m ? "default" : "outline"}
                    className="rounded-xl capitalize"
                    onClick={() => {
                      setMode(m);
                      setStudyIndex(0);
                      setRevealed(false);
                      if (m === "quiz") startQuiz();
                    }}
                  >
                    {m}
                  </Button>
                ))}
                <Button size="sm" variant="ghost" onClick={() => setStudyIndex(0)}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCard && mode === "classic" && (
                <>
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => !r)}
                    className="flex min-h-[160px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-muted/30 p-6 text-center transition-colors hover:bg-muted/50"
                  >
                    <p className="text-lg font-bold">{revealed ? currentCard.back : currentCard.front}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {revealed ? "Answer" : "Tap to reveal"}
                    </p>
                  </button>
                  {revealed && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {LEVELS.map((l) => (
                        <Button
                          key={l}
                          size="sm"
                          variant="outline"
                          className="rounded-xl capitalize"
                          onClick={() => setCardLevel(currentCard.id, l)}
                        >
                          {l}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {currentCard && mode === "quiz" && (
                <>
                  <p className="text-center text-lg font-bold">{currentCard.front}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(quizOptions.length ? quizOptions : makeQuizOptions(currentCard, studyCards)).map(
                      (opt) => (
                        <Button
                          key={opt}
                          variant="outline"
                          className="h-auto min-h-12 whitespace-normal rounded-xl py-3 text-left"
                          onClick={() => {
                            if (opt === currentCard.back) {
                              setCardLevel(currentCard.id, "easy");
                              toast.success("Correct!");
                            } else {
                              setCardLevel(currentCard.id, "again");
                              toast.error("Try again next round.");
                              advanceStudy();
                            }
                          }}
                        >
                          {opt}
                        </Button>
                      ),
                    )}
                  </div>
                </>
              )}

              {currentCard && mode === "write" && (
                <>
                  <p className="text-center text-lg font-bold">{currentCard.front}</p>
                  <Input
                    placeholder="Type your answer"
                    value={writeAnswer}
                    onChange={(e) => setWriteAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && checkWriteAnswer()}
                    className="rounded-xl"
                  />
                  <Button onClick={checkWriteAnswer} className="w-full rounded-xl">
                    Check
                  </Button>
                  {writeFeedback && (
                    <p className="text-center text-sm font-medium">{writeFeedback}</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">All cards</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => downloadExport("csv")}>
                  <Download className="mr-1 h-4 w-4" />
                  CSV
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => downloadExport("json")}>
                  JSON
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="max-h-64 space-y-2 overflow-y-auto">
                {activeDeck.cards.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start justify-between gap-2 rounded-xl border border-border/50 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">{c.front}</p>
                      <p className="text-muted-foreground">{c.back}</p>
                      {c.tags.length > 0 && (
                        <div className="mt-1 flex gap-1">
                          {c.tags.map((t) => (
                            <Badge key={t} variant="secondary" className="text-[10px]">
                              #{t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            decks: prev.decks.map((d) =>
                              d.id === activeDeck.id
                                ? {
                                    ...d,
                                    cards: d.cards.map((x) =>
                                      x.id === c.id ? { ...x, favorite: !x.favorite } : x,
                                    ),
                                  }
                                : d,
                            ),
                          }))
                        }
                      >
                        <Heart
                          className={`h-4 w-4 ${c.favorite ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            decks: prev.decks.map((d) =>
                              d.id === activeDeck.id
                                ? { ...d, cards: d.cards.filter((x) => x.id !== c.id) }
                                : d,
                            ),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
