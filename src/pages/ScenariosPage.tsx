import { scenariosService } from "@/services/content";
import { useContentCollection } from "@/utils/useContentCollection";
import { Card, CardTitle, CardDescription } from "@/components/ui";

export function ScenariosPage() {
  const { items, isLoading, error } = useContentCollection(scenariosService.getAll);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scenarios</h1>
        <p className="mt-1 text-[var(--color-foreground)]/70">
          Loaded from <code>data/scenarios/*.md</code> via the content service layer.
        </p>
      </div>

      {isLoading && <p className="text-sm text-[var(--color-foreground)]/60">Loading scenarios…</p>}

      {error && (
        <p className="text-sm text-red-500">Couldn't load scenarios: {error.message}</p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-sm text-[var(--color-foreground)]/60">
          No scenario files found yet in <code>data/scenarios/</code>.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((scenario) => (
          <Card key={scenario.id}>
            <CardTitle>{scenario.title}</CardTitle>
            {scenario.prompt && <CardDescription>{scenario.prompt}</CardDescription>}
          </Card>
        ))}
      </div>
    </div>
  );
}
