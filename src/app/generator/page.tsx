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
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            Create a cover letter
          </h2>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Tailored to the role, from your resume — in seconds.
          </p>
        </div>
        <GeneratorTour />
      </header>

      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-10 md:py-8">
        <GeneratorView />
      </div>

      <Footer variant="full" />
    </>
  );
}
