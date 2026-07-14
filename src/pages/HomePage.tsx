import { NavLink } from "react-router-dom";
import { primaryNavItems } from "@/data/navigation";
import { siteConfig } from "@/data/siteConfig";
import { Card, CardTitle, CardDescription, PageHeader } from "@/components/ui";

export function HomePage() {
  const contentSections = primaryNavItems.filter((item) => item.path !== "/");

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={siteConfig.name} description={siteConfig.description} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contentSections.map((item) => (
          <NavLink key={item.path} to={item.path}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardTitle>{item.label}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </NavLink>
        ))}
      </section>
    </div>
  );
}
