import { examsService } from "@/services/content";
import { useContentCollection } from "@/utils/useContentCollection";
import { Card, CardTitle, CardDescription } from "@/components/ui";

/**
 * NOTE: this is a read-only list view of the question bank — it does not
 * implement an exam-taking experience (timers, scoring, navigation
 * between questions). That's a deliberately separate future iteration.
 */
export function ExamsPage() {
  const { items, isLoading, error } = useContentCollection(examsService.getAll);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Exam Questions</h1>
        <p className="mt-1 text-[var(--color-foreground)]/70">
          Loaded from <code>data/exams/*.json</code> via the content service layer.
        </p>
      </div>

      {isLoading && <p className="text-sm text-[var(--color-foreground)]/60">Loading questions…</p>}

      {error && (
        <p className="text-sm text-red-500">Couldn't load exam questions: {error.message}</p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-sm text-[var(--color-foreground)]/60">
          No exam question files found yet in <code>data/exams/</code>.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((question) => (
          <Card key={question.id}>
            <CardTitle>{question.question}</CardTitle>
            <CardDescription>{question.options.length} options</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}
