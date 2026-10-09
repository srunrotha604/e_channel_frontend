export function getEnv(key: string, fallback = ''): string {
  try {
    return (
      (
        import.meta as ImportMeta & {
          env?: Record<string, string | undefined>;
        }
      ).env?.[key] ?? fallback
    );
  } catch {
    return fallback;
  }
}
