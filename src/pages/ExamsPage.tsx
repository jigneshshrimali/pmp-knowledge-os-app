import { examsService } from "@/services/content";
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

/**
 * NOTE: this is a read-only list view of the question bank — it does not
 * implement an exam-taking experience (timers, scoring, navigation
 * between questions). That's a deliberately separate future iteration.
 */
export function ExamsPage() {
  const { items, isLoading, error } = useContentCollection(examsService.getAll);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Exam Questions"
        description={
          <>
            Loaded from <code>data/exams/*.json</code> via the content service layer.
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
        <ErrorState title="Couldn't load exam questions" description={error.message} />
      )}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title="No exam questions yet"
          description={
            <>
              No exam question files found yet in <code>data/exams/</code>.
            </>
          }
        />
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((question) => (
            <Card key={question.id}>
              <CardTitle>{question.question}</CardTitle>
              <CardDescription>{question.options.length} options</CardDescription>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
