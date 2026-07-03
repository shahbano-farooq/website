import json
import re
from pathlib import Path

import pandas as pd

EXCEL = Path(
    r"C:\Users\shahb\OneDrive\Desktop\Portfolio\Visualization Dashboard Example\An Instructor's Jounrey.xlsx"
)
OUT = Path(__file__).resolve().parent.parent / "lib" / "teachingStudents.json"

TERM_MAP = {
    "1": "Fall",
    "2": "Spring",
    "3": "Summer",
}


def normalize_code(course_id: str) -> str:
    parts = str(course_id).strip().upper().split("-")
    if len(parts) >= 2:
        return f"{parts[0]} {parts[1]}"
    return str(course_id).strip().upper()


def parse_term(term_val) -> tuple[int, str] | None:
    s = str(term_val).strip()
    m = re.match(r"(\d{4})(\d{2})$", s)
    if not m:
        return None
    year = int(m.group(1))
    suffix = m.group(2)
    season_digit = suffix[0]
    season = TERM_MAP.get(season_digit)
    if not season:
        return None
    if season == "Spring" and suffix == "21":
        year += 1
    if season == "Fall" and suffix in {"71", "81", "91"}:
        pass
    if suffix == "22":
        season = "Spring"
        year = int(m.group(1)) + (1 if m.group(1)[-2:] == "17" else 0)
    if suffix == "21":
        season = "Fall"
    return year, season


def main() -> None:
    df = pd.read_excel(EXCEL, sheet_name="Teaching")
    rows = []
    for _, row in df.iterrows():
        parsed = parse_term(row["Term"])
        if not parsed:
            continue
        year, semester = parsed
        code = normalize_code(row["Course ID"])
        students = int(row["Students"]) if pd.notna(row["Students"]) else 0
        rows.append(
            {
                "code": code,
                "title": str(row["Title"]).strip(),
                "year": year,
                "semester": semester,
                "term": f"{semester} {year}",
                "students": students,
                "crn": int(row["CRN"]) if pd.notna(row["CRN"]) else None,
            }
        )

    by_offering = {}
    for r in rows:
        key = f"{r['code']}|{r['term']}"
        by_offering[key] = by_offering.get(key, 0) + r["students"]

    offerings = [
        {
            "code": k.split("|")[0],
            "term": k.split("|")[1],
            "students": v,
        }
        for k, v in by_offering.items()
    ]

  # year/topic aggregates for streamgraph built in TS from offerings + records
    by_year = {}
    for o in offerings:
        year = int(o["term"].split()[-1])
        by_year.setdefault(year, {"year": year, "totalStudents": 0, "offerings": []})
        by_year[year]["totalStudents"] += o["students"]
        by_year[year]["offerings"].append(o)

    payload = {
        "offerings": offerings,
        "byYear": sorted(by_year.values(), key=lambda x: x["year"]),
    }
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {len(offerings)} offerings to {OUT}")


if __name__ == "__main__":
    main()
