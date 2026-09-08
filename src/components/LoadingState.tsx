interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export function LoadingState({ loading, error, children }: LoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        <span className="ml-3 text-sm">Loading…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        Couldn't load this page: {error}
      </div>
    );
  }

  return <>{children}</>;
}

