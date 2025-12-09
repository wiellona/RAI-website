export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const formatScore = (n: number) => `${n.toFixed(0)}`;

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
