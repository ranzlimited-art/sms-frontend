interface StaleDataBannerProps {
  cachedAt: Date | null;
}

export function StaleDataBanner({ cachedAt }: StaleDataBannerProps) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
      <span className="h-2 w-2 rounded-full bg-amber-500" />
      You're offline — showing saved data
      {cachedAt && <span className="text-amber-500">(as of {cachedAt.toLocaleString()})</span>}
    </div>
  );
}