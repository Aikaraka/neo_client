import { twMerge } from "tailwind-merge";

const MainContent = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={twMerge(
        `md:w-[966px] md:max-h-[703px] h-full md:bg-white md:rounded-xl overflow-y-auto w-full bg-white`,
        className || ""
      )}
      {...props}
    >
      {children}
    </section>
  );
};

MainContent.displayName = "MainContent";
export { MainContent };
