import { scenariosService } from "@/services/content";
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

export function ScenariosPage() {
  const { items, isLoading, error } = useContentCollection(scenariosService.getAll);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Scenarios"
        description={
          <>
            Loaded from <code>data/scenarios/*.md</code> via the content service layer.
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
        <ErrorState title="Couldn't load scenarios" description={error.message} />
      )}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState
          title="No scenarios yet"
          description={
            <>
              No scenario files found yet in <code>data/scenarios/</code>.
            </>
          }
        />
      )}

      {!isLoading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((scenario) => (
            <Card key={scenario.id}>
              <CardTitle>{scenario.title}</CardTitle>
              {scenario.prompt && <CardDescription>{scenario.prompt}</CardDescription>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
