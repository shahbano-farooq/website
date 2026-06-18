import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ResearchCard from "@/components/ResearchCard";
import { researchProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Research",
};

export default function ResearchPage() {
  const ongoing = researchProjects.filter((p) => p.status === "ongoing");
  const completed = researchProjects.filter((p) => p.status === "completed");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading
        title="Research"
        subtitle="Projects exploring how people perceive, interact with, and make decisions from data visualizations."
      />

      <section className="mb-12">
        <h3 className="mb-4 font-serif text-xl font-semibold text-foreground">
          Current Projects
        </h3>
        <div className="grid gap-6">
          {ongoing.map((project) => (
            <ResearchCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 font-serif text-xl font-semibold text-foreground">
          Past Projects
        </h3>
        <div className="grid gap-6">
          {completed.map((project) => (
            <ResearchCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
