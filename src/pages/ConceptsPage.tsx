import { conceptsService } from "@/services/content";
import { useContentCollection } from "@/utils/useContentCollection";
import { Card, CardTitle, CardDescription, Badge } from "@/components/ui";

export function ConceptsPage() {
  const { items, isLoading, error } = useContentCollection(conceptsService.getAll);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Concepts</h1>
        <p className="mt-1 text-[var(--color-foreground)]/70">
          Loaded from <code>data/concepts/*.md</code> via the content service layer.
        </p>
      </div>

      {isLoading && <p className="text-sm text-[var(--color-foreground)]/60">Loading concepts…</p>}

      {error && (
        <p className="text-sm text-red-500">Couldn't load concepts: {error.message}</p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-sm text-[var(--color-foreground)]/60">
          No concept files found yet in <code>data/concepts/</code>.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((concept) => (
          <Card key={concept.id}>
            <CardTitle>{concept.title}</CardTitle>
            {concept.summary && <CardDescription>{concept.summary}</CardDescription>}
            {concept.tags && concept.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {concept.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
