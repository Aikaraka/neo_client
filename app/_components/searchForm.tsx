import { saveSearchTerm } from "@/app/_api/search.server";
import { Button } from "@/components/ui/button";
import { Form, InputFormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const search = z.object({
  query: z.string().nonempty(),
});

export default function SeacrhForm() {
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
    onMutate: () => router.push(`/search/${form.getValues().query}`),
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
          className="rounded-full m-0"
          control={form.control}
          name="query"
          showErrorMessage={false}
          icon={
            <Button variant={"ghost"}>
              <Search className="cursor-pointer" />
            </Button>
          }
        />
      </form>
    </Form>
  );
}
