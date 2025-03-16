import { getRecentSearchTerms } from "@/app/_api/search.server";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function RecentSearchTerms() {
  const router = useRouter();
  const { data: terms } = useQuery({
    queryKey: ["search"],
    queryFn: () => getRecentSearchTerms(5),
  });

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hidden h-10">
      {terms?.map(({ search_term }) => (
        <Button
          variant={"outline"}
          className="rounded-full"
          key={search_term}
          onClick={() => router.push(`/search/${search_term}`)}
        >
          {search_term}
        </Button>
      ))}
    </div>
  );
}
