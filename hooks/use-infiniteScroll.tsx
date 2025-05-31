import { useCallback, useEffect } from "react";

const defaultOptions: IntersectionObserverInit = {
  threshold: 0.3,
};

export function useInfiniteScroll<IntersectionObserverType>({
  observerRef,
  fetchMore,
  hasMore,
  options = defaultOptions,
}: {
  observerRef: React.RefObject<IntersectionObserverType>;
  fetchMore: () => void;
  hasMore: boolean;
  options?: IntersectionObserverInit;
}) {
  const onScroll: IntersectionObserverCallback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMore();
      }
    },
    [fetchMore, hasMore]
  );

  useEffect(() => {
    if (!observerRef) return;
    const observer = new IntersectionObserver(onScroll, options);
    observer.observe(observerRef.current as Element);
    if (!hasMore) observer.unobserve(observerRef.current as Element);
    return () => observer.disconnect();
  }, [observerRef, onScroll, options, hasMore]);
}
