import { flashcardsService } from "@/services/content";
import { useContentCollection } from "@/utils/useContentCollection";
import { Card, CardTitle, CardDescription } from "@/components/ui";

export function FlashcardsPage() {
  const { items, isLoading, error } = useContentCollection(flashcardsService.getAll);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flashcards</h1>
        <p className="mt-1 text-[var(--color-foreground)]/70">
          Loaded from <code>data/flashcards/*.json</code> via the content service layer.
        </p>
      </div>

      {isLoading && <p className="text-sm text-[var(--color-foreground)]/60">Loading flashcards…</p>}

      {error && (
        <p className="text-sm text-red-500">Couldn't load flashcards: {error.message}</p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-sm text-[var(--color-foreground)]/60">
          No flashcard files found yet in <code>data/flashcards/</code>.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((card) => (
          <Card key={card.id}>
            <CardTitle>{card.question}</CardTitle>
            <CardDescription>{card.answer}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}
