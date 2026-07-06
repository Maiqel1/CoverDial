import { Footer } from "@/components/layout/Footer";
import { GeneratorView } from "@/components/generator/GeneratorView";
import { GeneratorTour } from "@/components/tour/GeneratorTour";

export const metadata = {
  title: "Generator — CoverDial",
};

export default function GeneratorPage() {
  return (
    <>
      <header className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 md:px-10">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          Scale your applications.
        </h2>
        <GeneratorTour />
      </header>

      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-10 md:py-8">
        <GeneratorView />
      </div>

      <Footer variant="full" />
    </>
  );
}
