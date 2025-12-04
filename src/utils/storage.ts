const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function getPublicUrl(path?: string | null, bucket?: string) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (!SUPABASE_URL || !bucket) return null;

  const trimmedPath = path.replace(/^\/+/, "");
  const encodedPath = trimmedPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodedPath}`;
}
