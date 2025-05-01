import { Character } from "@/types/novel";
import { Tables } from "@/utils/supabase/types/database.types";
import { BookOpen, ChevronDown, ContactRound } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

const NovelPlot = ({ plot }: { plot: Tables<"novels">["plot"] }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <h2 className="text-base font-bold flex items-center gap-1">
        <BookOpen />
        소설 줄거리
      </h2>
      <div className="p-4 border rounded-xl">
        {(plot || "줄거리 정보가 없습니다.").split("\n").map((line, idx) => (
          <span key={idx}>
            {line}
            <br />
          </span>
        ))}
      </div>
    </div>
  );
};

const NovelCharacters = ({ characters }: { characters?: Character[] }) => {
  if (!characters || characters.length === 0) return null;
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h2 className="text-base font-bold flex items-center gap-1">
        <ContactRound />
        소설 등장인물
      </h2>
      <div className="">
        <Accordion.Root type="multiple" className="space-y-2">
          {characters.map((character, idx) => (
            <Accordion.Item
              value={`character-${idx}`}
              key={`character-${idx}`}
              className="overflow-hidden border rounded-lg bg-white"
            >
              <Accordion.Trigger
                className={cn(
                  "AccordionTrigger flex justify-between items-center w-full px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
                )}
              >
                {character.name} / {character.age}세
                <ChevronDown className="AccordionChevron h-4 w-4 transition-transform " />
              </Accordion.Trigger>

              <Accordion.Content
                className={cn(
                  "overflow-hidden px-4 pt-2 pb-4 text-sm text-muted-foreground transition-all",
                  "data-[state=open]:animate-accordion-down",
                  "data-[state=closed]:animate-accordion-up"
                )}
              >
                <p className="mt-1">{character.description}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
};

export { NovelPlot, NovelCharacters };
