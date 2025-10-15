import { saveSearchTerm } from "@/app/_api/search.server";
import { Button } from "@/components/ui/button";
import { Form, InputFormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const search = z.object({
  query: z.string().nonempty(),
});

export default function SeacrhForm({
  onSearch,
}: {
  onSearch?: () => void;
}) {
  const form = useForm<z.infer<typeof search>>({
    resolver: zodResolver(search),
    defaultValues: {
      query: "",
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: saveSearchTerm,
    onMutate: (query) => {
      router.push(`/search/${encodeURIComponent(query)}`);
      onSearch?.(); // 검색 실행 시 onSearch 콜백 호출
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["search"] }),
  });
  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(({ query }) => {
          mutate(query);
        })}
      >
        <InputFormField
          className="rounded-full bg-[#F1F1F1] border-[0.45px] border-[#94959A] m-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          control={form.control}
          name="query"
          showErrorMessage={false}
          icon={
            <Button variant={"ghost"} className="[&_svg]:size-5">
              <Search className="cursor-pointer" />
            </Button>
          }
        />
      </form>
    </Form>
  );
}
