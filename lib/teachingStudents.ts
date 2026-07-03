import teachingStudentData from "./teachingStudents.json";

export type StudentOffering = {
  code: string;
  term: string;
  students: number;
};

export const studentOfferings: StudentOffering[] = teachingStudentData.offerings;

const studentLookup = new Map(
  studentOfferings.map((o) => [`${o.code}|${o.term}`, o.students])
);

export function getStudentsForCourse(code: string, term: string): number {
  return studentLookup.get(`${code}|${term}`) ?? 0;
}

export function getStudentsByYearTopic(
  records: { code: string; term: string; year: number; topic: string }[]
): Map<string, number> {
  const map = new Map<string, number>();
  records.forEach((r) => {
    const students = getStudentsForCourse(r.code, r.term);
    if (students <= 0) return;
    const key = `${r.year}|${r.topic}`;
    map.set(key, (map.get(key) ?? 0) + students);
  });
  return map;
}
