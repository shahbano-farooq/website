export const siteConfig = {
  name: "Shahbano Farooq",
  title: "PhD Candidate",
  department: "Human-Computer Interaction & Visualization",
  institution: "Department of Computer Science",
  university: "University of Example",
  email: "shahbano.farooq@university.edu",
  office: "Room 412, Visualization Lab",
  github: "https://github.com/shahbano-farooq",
  scholar: "https://scholar.google.com",
  linkedin: "https://linkedin.com",
  orcid: "https://orcid.org",
  tagline:
    "Designing interactive visualizations that help people explore, understand, and act on complex data.",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/teaching", label: "Teaching" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export const researchInterests = [
  "Information Visualization",
  "Human-Computer Interaction",
  "Visual Analytics",
  "Data Storytelling",
  "Accessibility in Data Viz",
  "Mixed-Initiative Systems",
];

export const news = [
  {
    date: "Jun 2025",
    text: "Paper accepted to IEEE VIS 2025 — \"Sensemaking with Uncertainty-Aware Visualizations.\"",
  },
  {
    date: "Apr 2025",
    text: "Received the Graduate Research Fellowship for work on accessible visualization design.",
  },
  {
    date: "Feb 2025",
    text: "Presented a demo at CHI 2025 on collaborative sensemaking in multi-user dashboards.",
  },
];

export type ResearchProject = {
  id: string;
  title: string;
  status: "ongoing" | "completed";
  description: string;
  tags: string[];
  collaborators?: string[];
  links?: { label: string; href: string }[];
};

export const researchProjects: ResearchProject[] = [
  {
    id: "uncertainty-viz",
    title: "Uncertainty-Aware Visual Analytics",
    status: "ongoing",
    description:
      "Developing visualization techniques that communicate statistical uncertainty without overwhelming non-expert users. We combine controlled experiments with design probes to understand how people interpret confidence intervals, prediction bands, and probabilistic glyphs in real-world decision tasks.",
    tags: ["Visual Analytics", "Uncertainty", "Empirical Study"],
    collaborators: ["Prof. Jane Smith", "Dr. Alex Chen"],
    links: [
      { label: "Project Page", href: "#" },
      { label: "Preprint", href: "#" },
    ],
  },
  {
    id: "accessible-viz",
    title: "Accessible Data Visualization",
    status: "ongoing",
    description:
      "Investigating how screen reader users interact with data visualizations on the web. We are building design guidelines and open-source tools that make charts, maps, and dashboards more usable for people with visual impairments.",
    tags: ["Accessibility", "Web", "Design Guidelines"],
    collaborators: ["Prof. Jane Smith"],
    links: [{ label: "GitHub", href: "https://github.com/shahbano-farooq" }],
  },
  {
    id: "collab-sensemaking",
    title: "Collaborative Sensemaking Dashboards",
    status: "completed",
    description:
      "Designed and evaluated a multi-user dashboard system that supports asynchronous annotation and shared hypothesis tracking during exploratory data analysis. Published at CHI 2025.",
    tags: ["Collaboration", "Dashboards", "CHI"],
    collaborators: ["Dr. Alex Chen", "Prof. Maria Lopez"],
    links: [
      { label: "Paper", href: "#" },
      { label: "Demo Video", href: "#" },
    ],
  },
  {
    id: "narrative-viz",
    title: "Narrative Structures in Data Storytelling",
    status: "completed",
    description:
      "Explored how narrative framing affects comprehension and recall in scrollytelling visualizations. Findings inform a taxonomy of narrative patterns for data journalists and visualization designers.",
    tags: ["Data Storytelling", "Scrollytelling", "Empirical Study"],
    links: [{ label: "Paper", href: "#" }],
  },
];

export type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: "journal" | "conference" | "workshop" | "thesis";
  award?: string;
  links?: { label: string; href: string }[];
};

export const publications: Publication[] = [
  {
    id: "vis2025-uncertainty",
    title: "Sensemaking with Uncertainty-Aware Visualizations",
    authors: "S. Farooq, J. Smith, A. Chen",
    venue: "IEEE Transactions on Visualization and Computer Graphics (VIS)",
    year: 2025,
    type: "conference",
    links: [
      { label: "PDF", href: "#" },
      { label: "DOI", href: "#" },
      { label: "BibTeX", href: "#" },
    ],
  },
  {
    id: "chi2025-collab",
    title: "Supporting Collaborative Sensemaking through Shared Hypothesis Tracking",
    authors: "S. Farooq, A. Chen, M. Lopez",
    venue: "ACM Conference on Human Factors in Computing Systems (CHI)",
    year: 2025,
    type: "conference",
    award: "Honorable Mention",
    links: [
      { label: "PDF", href: "#" },
      { label: "ACM DL", href: "#" },
      { label: "BibTeX", href: "#" },
    ],
  },
  {
    id: "infovis2024-accessible",
    title: "Design Guidelines for Screen-Reader Accessible Web Visualizations",
    authors: "S. Farooq, J. Smith",
    venue: "IEEE Information Visualization Conference (InfoVis)",
    year: 2024,
    type: "conference",
    links: [
      { label: "PDF", href: "#" },
      { label: "BibTeX", href: "#" },
    ],
  },
  {
    id: "vis2024-narrative",
    title: "Narrative Patterns in Scrollytelling: A Comparative Study",
    authors: "S. Farooq, M. Lopez",
    venue: "IEEE Pacific Visualization Symposium (PacificVis)",
    year: 2024,
    type: "conference",
    links: [
      { label: "PDF", href: "#" },
      { label: "BibTeX", href: "#" },
    ],
  },
  {
    id: "chi2024-workshop",
    title: "Toward Inclusive Visualization Design: Open Challenges and Opportunities",
    authors: "S. Farooq et al.",
    venue: "CHI Workshop on Visualization for All",
    year: 2024,
    type: "workshop",
    links: [{ label: "PDF", href: "#" }],
  },
  {
    id: "masters-thesis",
    title: "Interactive Techniques for Exploring High-Dimensional Data",
    authors: "S. Farooq",
    venue: "M.Sc. Thesis, University of Example",
    year: 2022,
    type: "thesis",
    links: [{ label: "PDF", href: "#" }],
  },
];

export type Course = {
  id: string;
  code: string;
  title: string;
  term: string;
  role: "Instructor" | "Teaching Assistant" | "Guest Lecturer";
  description: string;
};

export const courses: Course[] = [
  {
    id: "cs4470",
    code: "CS 4470",
    title: "Information Visualization",
    term: "Fall 2024",
    role: "Teaching Assistant",
    description:
      "Supported weekly labs on D3.js, Vega-Lite, and visual design principles. Held office hours and graded assignments for 80+ students.",
  },
  {
    id: "cs1301",
    code: "CS 1301",
    title: "Introduction to Computing",
    term: "Spring 2024",
    role: "Teaching Assistant",
    description:
      "Led recitation sections covering Python fundamentals, data structures, and introductory programming concepts.",
  },
  {
    id: "vis-workshop",
    code: "Workshop",
    title: "Data Visualization for Social Good",
    term: "Summer 2023",
    role: "Guest Lecturer",
    description:
      "Designed and delivered a two-day workshop on visualization ethics and design for community nonprofit partners.",
  },
];

export type CVSection = {
  title: string;
  items: {
    heading: string;
    subheading?: string;
    period: string;
    details?: string[];
  }[];
};

export const cvSections: CVSection[] = [
  {
    title: "Education",
    items: [
      {
        heading: "Ph.D. in Computer Science",
        subheading: "University of Example",
        period: "2022 – Present",
        details: [
          "Focus: Human-Computer Interaction & Visualization",
          "Advisor: Prof. Jane Smith",
        ],
      },
      {
        heading: "M.Sc. in Computer Science",
        subheading: "University of Example",
        period: "2020 – 2022",
        details: ["Thesis: Interactive Techniques for Exploring High-Dimensional Data"],
      },
      {
        heading: "B.Sc. in Computer Science",
        subheading: "State University",
        period: "2016 – 2020",
        details: ["Summa Cum Laude"],
      },
    ],
  },
  {
    title: "Experience",
    items: [
      {
        heading: "Research Intern",
        subheading: "Visualization Research Group, Industry Lab",
        period: "Summer 2024",
        details: [
          "Prototyped uncertainty visualization widgets for an internal analytics platform.",
        ],
      },
      {
        heading: "Graduate Research Assistant",
        subheading: "Visualization Lab, University of Example",
        period: "2022 – Present",
        details: [
          "Lead author on 3 peer-reviewed publications in top-tier HCI and visualization venues.",
        ],
      },
    ],
  },
  {
    title: "Awards & Honors",
    items: [
      {
        heading: "Graduate Research Fellowship",
        subheading: "University of Example",
        period: "2025",
      },
      {
        heading: "CHI Honorable Mention",
        subheading: "ACM CHI 2025",
        period: "2025",
      },
      {
        heading: "Best Poster Award",
        subheading: "IEEE VIS 2023",
        period: "2023",
      },
    ],
  },
  {
    title: "Skills",
    items: [
      {
        heading: "Research Methods",
        period: "",
        details: [
          "Controlled experiments, interviews, think-aloud studies, survey design",
        ],
      },
      {
        heading: "Technical",
        period: "",
        details: [
          "D3.js, Vega-Lite, React, TypeScript, Python, R, LaTeX",
        ],
      },
    ],
  },
];
