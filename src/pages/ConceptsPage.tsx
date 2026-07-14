import { conceptsService } from "@/services/content";
import { useContentCollection } from "@/utils/useContentCollection";
import {
  Card,
  CardTitle,
  CardDescription,
  Badge,
  PageHeader,
  SkeletonCard,
  EmptyState,
  ErrorState,
} from "@/components/ui";

export function ConceptsPage() {
  const { items, isLoading, error } = useContentCollection(conceptsService.getAll);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Concepts"
        description={
          <>
            Loaded from <code>data/concepts/*.md</code> via the content service layer.
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
        <ErrorState
          title="Couldn't load concepts"
          description={error.message}
        />
      )}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title="No concepts yet"
          description={
            <>
              No concept files found yet in <code>data/concepts/</code>.
            </>
          }
        />
      )}

      {!isLoading && !error && items.length > 0 && (
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
      )}
    </div>
  );
}
