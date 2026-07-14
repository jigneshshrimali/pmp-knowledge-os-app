import type { ComponentType, SVGProps } from "react";

export interface NavItem {
  label: string;
  path: string;
  /** Optional icon component, kept generic so any icon set can be used later. */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  description?: string;
}
