/** Derives a stable, URL-friendly id from a content file's path. */
export function idFromPath(path: string): string {
  const fileName = path.split("/").pop() ?? path;
  return fileName.replace(/\.(md|json)$/i, "");
}
