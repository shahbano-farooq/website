import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { courses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Teaching",
};

const roleColors: Record<(typeof courses)[number]["role"], string> = {
  Instructor: "bg-accent text-white",
  "Teaching Assistant": "bg-accent-light text-accent",
  "Guest Lecturer": "bg-background text-muted border border-border",
};

export default function TeachingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading
        title="Teaching"
        subtitle="Courses, workshops, and mentoring experience."
      />

      <div className="space-y-6">
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-accent">{course.code}</p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-foreground">
                  {course.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{course.term}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${roleColors[course.role]}`}
              >
                {course.role}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{course.description}</p>
          </article>
        ))}
      </div>

      <section className="mt-12 rounded-lg border border-border bg-accent-light/40 p-6">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          Mentoring
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          I have mentored 4 undergraduate researchers on visualization and HCI
          projects, including two who went on to present at university research
          symposia. I am open to supervising motivated students interested in
          empirical visualization research.
        </p>
      </section>
    </div>
  );
}
