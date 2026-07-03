import type { Metadata } from "next";
import TeachingDashboard from "@/components/TeachingDashboard";
import SectionHeading from "@/components/SectionHeading";
import { teachingRecords } from "@/lib/data";

export const metadata: Metadata = {
  title: "Teaching",
};

const roleColors = {
  Instructor: "bg-accent text-white",
  "Teaching Assistant": "bg-accent-light text-accent",
} as const;

export default function TeachingPage() {
  const recentCourses = [...teachingRecords]
    .sort((a, b) => b.year - a.year || b.term.localeCompare(a.term))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading
        title="Teaching"
        subtitle="Nine years of university instruction at Zayed University, plus graduate teaching at the University of Calgary — visualized as relational constellations and flowing streams."
      />

      <TeachingDashboard />

      <section className="mt-12">
        <h3 className="mb-6 font-serif text-xl font-semibold text-foreground">
          Recent Courses
        </h3>
        <div className="space-y-4">
          {recentCourses.map((course) => (
            <article
              key={course.id}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-accent">{course.code}</p>
                  <h4 className="mt-1 font-medium text-foreground">{course.title}</h4>
                  <p className="mt-1 text-sm text-muted">
                    {course.term} · {course.institution}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${roleColors[course.role]}`}
                >
                  {course.role}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-border bg-accent-light/40 p-6">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          Teaching Philosophy
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          I design courses around authentic learning experiences and experiential
          pedagogy — scaffolding from foundational concepts toward higher-order
          thinking. As an HEA Fellow, I apply evidence-based, student-centered
          approaches and leverage technology-enhanced learning to foster engagement,
          accessibility, and inclusive classrooms.
        </p>
      </section>
    </div>
  );
}
