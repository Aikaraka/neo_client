"use client";

import CoverImageGenerator from "@/app/create/_components/coverImageEditor/CoverImageGenerator";
import {
  fontThemes,
  useCoverImageContext,
} from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import { CoverImageUploader } from "@/app/create/_components/coverImageEditor/CoverImageUploader";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Rnd } from "react-rnd";
import { twMerge } from "tailwind-merge";

const FONT_NAME: Record<(typeof editFontList)[number], string> = {
  bombaram: "봄바람체",
  heiroOfLight: "빛의 계승자체",
};

export default function CoverImageEditor() {
  const { coverImageRef, imageSrc } = useCoverImageContext();

  return (
    <>
      <div
        ref={coverImageRef}
        className="border w-[210px] h-[270px] self-center relative"
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt="novel cover Image"
            width={210}
            height={270}
            className="w-full h-full object-fill"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        )}
        <TextEdit />
      </div>
      <CoverImageUploader />
      <CoverImageGenerator />
    </>
  );
}

function TextEdit() {
  const { getValues } = useFormContext<CreateNovelForm>();
  const title = getValues("title");
  const { fontTheme } = useCoverImageContext();

  return (
    <Rnd
      default={{
        x: 0,
        y: 100,
        width: 200,
        height: 100,
      }}
      bounds="parent"
      enableResizing={{
        bottomRight: true,
        right: true,
        bottom: true,
        top: true,
        left: true,
        topRight: true,
      }}
      dragHandleClassName="text-box"
      className="absolute text-black text-2xl font-bold  cursor-pointer z-10 hover:border border-purple-400 p-1"
    >
      <div
        className={`text-box w-full h-full break-words overflow-auto cursor-pointer text-transparent text-2xl font-bold ${fontThemes[fontTheme]}`}
      >
        {title}
      </div>
    </Rnd>
  );
}

// function ColorSelect() {
// //   const { changeFontColor } = useCoverImageContext();
//   return (
//     <div className="flex gap-2 self-center">
//       {Object.keys(fontColorStyles).map((color) => (
//         <Button
//           type="button"
//           variant="outline"
//           className={`${
//             fontColorStyles[color as FontColor]
//           } rounded-full w-5 h-5`}
//           onClick={() => changeFontColor(color as FontColor)}
//         ></Button>
//       ))}
//     </div>
//   );
// }

// function FontSelect() {
//   const { canvasRef, changeTitleFont, selectedFont } = useCoverImageContext();
//   return (
//     <div className="flex gap-2 self-center">
//       {editFontList.map((font) => (
//         <Button
//           type="button"
//           style={{ fontFamily: font }}
//           variant={selectedFont === font ? "default" : "outline"}
//           onClick={() => {
//             changeTitleFont(font);
//           }}
//         >
//           {FONT_NAME[font]}
//         </Button>
//       ))}
//     </div>
//   );
// }
