import { flashcardsService } from "@/services/content";
import { useContentCollection } from "@/utils/useContentCollection";
import {
  Card,
  CardTitle,
  CardDescription,
  PageHeader,
  SkeletonCard,
  EmptyState,
  ErrorState,
} from "@/components/ui";

export function FlashcardsPage() {
  const { items, isLoading, error } = useContentCollection(flashcardsService.getAll);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Flashcards"
        description={
          <>
            Loaded from <code>data/flashcards/*.json</code> via the content service layer.
          </>
        }
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {error && (
        <ErrorState title="Couldn't load flashcards" description={error.message} />
      )}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title="No flashcards yet"
          description={
            <>
              No flashcard files found yet in <code>data/flashcards/</code>.
            </>
          }
        />
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((card) => (
            <Card key={card.id}>
              <CardTitle>{card.question}</CardTitle>
              <CardDescription>{card.answer}</CardDescription>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
