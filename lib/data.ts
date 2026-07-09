export const siteConfig = {
  name: "Shahbano Farooq",
  title: "PhD Student",
  department: "School of Interactive Arts & Technology",
  institution: "Simon Fraser University",
  university: "Vancouver, BC, Canada",
  email: "shahbano_farooq@hotmail.com",
  emailSfu: "shahbano_farooq@sfu.ca",
  phone: "+1-778-918-4655",
  office: "SIAT, SFU Surrey Campus",
  github: "https://github.com/shahbano-farooq",
  scholar: "https://scholar.google.com",
  linkedin: "https://www.linkedin.com/in/shahbanofarooq",
  orcid: "https://orcid.org",
  tagline:
    "Exploring collaborative visualization design, data empowerment for the marginalized, and data storytelling to help people understand complex information.",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/publications", label: "Publications" },
  { href: "/teaching", label: "Teaching" },
  { href: "/cv", label: "CV" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export const researchInterests = [
  "Information Visualization",
  "Human-Computer Interaction",
  "Collaborative Design",
  "Visual Analytics",
  "Data Storytelling",
  "Immersive Learning",
];

export const news = [
  {
    date: "Jan 2026",
    text: "Research Assistant with the Transforming Arts Impact Initiative (TAIP) at SFU.",
  },
  {
    date: "Sep 2025",
    text: "Started PhD in Interactive Arts & Technology at Simon Fraser University.",
  },
  {
    date: "2025",
    text: "Co-authored The Object-Oriented Approach to Problem Solving and Machine Learning with Python (CRC Press).",
  },
  {
    date: "2020",
    text: "Awarded HEA Fellowship from AdvanceHE for innovative, student-centered pedagogy.",
  },
];

export type LifeCategory = "education" | "industry" | "teaching" | "research";

export type LifeEvent = {
  id: string;
  title: string;
  subtitle: string;
  startYear: number;
  endYear: number;
  category: LifeCategory;
  location: string;
  description: string;
  highlight?: boolean;
  /** Milestone still unfolding — no fixed panel illustration */
  ongoing?: boolean;
  /** Extra journey filters this milestone appears under (e.g. B.Sc. on Research path) */
  journeyGroups?: LifeCategory[];
};

export const lifeEvents: LifeEvent[] = [
  {
    id: "bsc",
    title: "B.Sc. Computer Science (Honors)",
    subtitle: "Kinnaird College for Women",
    startYear: 1999,
    endYear: 2002,
    category: "education",
    location: "Lahore, Pakistan",
    description:
      "Graduated 1st in class; awarded the K.K. Aziz Gold Medal. Final project: Urdu dictation system using Markov models for speech recognition.",
    highlight: true,
    journeyGroups: ["research"],
  },
  {
    id: "esp-gits",
    title: "System Analyst / Programmer",
    subtitle: "ESP GITS",
    startYear: 2002,
    endYear: 2003,
    category: "industry",
    location: "Pakistan",
    description:
      "Full-stack development for MCB bank credit approval automation and educational messenger applications.",
  },
  {
    id: "emircom",
    title: "Software Development Engineer",
    subtitle: "Emircom",
    startYear: 2003,
    endYear: 2004,
    category: "industry",
    location: "UAE",
    description:
      "Built a three-tier help desk system with J2EE, JSP, and MS SQL Server for customer service management.",
  },
  {
    id: "etisalat",
    title: "Technical Content Developer",
    subtitle: "Etisalat",
    startYear: 2004,
    endYear: 2006,
    category: "industry",
    location: "UAE",
    description:
      "Functional specifications, web development, training materials, and an Appraisal Management System in MS Access/VBA.",
  },
  {
    id: "msc",
    title: "M.Sc. Computer Science",
    subtitle: "University of Calgary",
    startYear: 2012,
    endYear: 2014,
    category: "education",
    location: "Calgary, AB, Canada",
    description:
      "Thesis: Design and Discussion of Visualizations in Pairs — co-design tool PairedVis for domain experts and visualization designers.",
    highlight: true,
    journeyGroups: ["research"],
  },
  {
    id: "ucalgary-ta",
    title: "Teaching Assistant",
    subtitle: "University of Calgary",
    startYear: 2012,
    endYear: 2013,
    category: "teaching",
    location: "Calgary, AB, Canada",
    description:
      "Taught Haskell functional programming and Alice object-oriented visual programming in lab settings.",
  },
  {
    id: "zayed",
    title: "Instructor",
    subtitle: "Zayed University",
    startYear: 2014,
    endYear: 2025,
    category: "teaching",
    location: "UAE",
    description:
      "Taught programming, data structures, machine learning, and IT fundamentals. Course coordinator, internship supervisor, and HEA Fellow.",
    highlight: true,
  },
  {
    id: "research-zayed",
    title: "Research & Publications",
    subtitle: "Zayed University & Collaborators",
    startYear: 2021,
    endYear: 2025,
    category: "research",
    location: "UAE",
    description:
      "Co-authored systematic reviews on visual programming, immersive learning, chatbot usability, and mental health chatbots.",
    journeyGroups: ["research"],
  },
  {
    id: "phd",
    title: "PhD Student",
    subtitle: "Simon Fraser University — SIAT",
    startYear: 2025,
    endYear: 2026,
    category: "research",
    location: "Vancouver, BC, Canada",
    description:
      "Research focus on HCI and visualization — generative tools for co-design and community impact.",
    highlight: true,
    ongoing: true,
    journeyGroups: ["education"],
  },
  {
    id: "taip",
    title: "Research Assistant",
    subtitle: "Transforming Arts Impact Initiative (TAIP)",
    startYear: 2026,
    endYear: 2026,
    category: "research",
    location: "SFU",
    description:
      "An ongoing exploration — helping arts communities articulate cultural impact and secure funding support. The path ahead is still unfolding.",
    ongoing: true,
  },
];

export const categoryColors: Record<LifeCategory, string> = {
  education: "#2d5a7b",
  industry: "#6b7c93",
  teaching: "#c47d3a",
  research: "#3d7a5e",
};

export const categoryLabels: Record<LifeCategory, string> = {
  education: "Education",
  industry: "Industry",
  teaching: "Teaching",
  research: "Research",
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  tags: string[];
  description: string;
  highlights: string[];
  technologies: string[];
  href: string;
  image?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "bird-migration",
    title: "Bird Migration Visualization",
    subtitle: "Information Visualization — D3.js",
    year: "2025",
    tags: ["D3.js", "Streamgraph", "Geospatial", "Interactive"],
    description:
      "An interactive multi-view visualization exploring historical bird migration data collected from ornithological literature. The system combines a streamgraph of seasonal migration patterns, geospatial route maps, temperature overlays, and detailed route inspection panels.",
    highlights: [
      "Linked streamgraph and world map views with cross-filtering by bird category",
      "Seasonal migration ribbons with temperature and direction encodings",
      "Interactive route details with decluttered node layouts",
      "Multi-tab interface for bird timeline and geographic perspectives",
    ],
    technologies: ["D3.js v7", "GeoJSON", "SVG", "CSV"],
    href: "/projects/bird-migration",
    image: "/projects/bird-migration/thumbnail.png",
    featured: true,
  },
  {
    id: "pairedvis",
    title: "PairedVis — Co-Design of Visualizations",
    subtitle: "M.Sc. Thesis — University of Calgary",
    year: "2014",
    tags: ["Co-Design", "Tabletop", "Sensemaking", "M.Sc. Thesis"],
    description:
      "PairedVis is an interactive tabletop system that supports collaborative visualization design between domain experts and visualization designers. The tool provides four integrated panels — data view, concept mapping, visual design, and code generation — to facilitate knowledge exchange and iterative sensemaking.",
    highlights: [
      "Mind-mapping relationships between data columns to elicit domain expertise",
      "Mapping visualization templates and visual variables to data attributes",
      "Structured co-design sessions supporting communication and negotiation",
      "Published in SurfNet: Designing Digital Surface Applications",
    ],
    technologies: ["Java", "Tabletop Interface", "Visualization Design"],
    href: "/projects/pairedvis",
    image: "/projects/pairedvis/thumbnail.png",
    featured: true,
  },
];

export type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: "journal" | "conference" | "workshop" | "thesis" | "book" | "chapter";
  links?: { label: string; href: string }[];
};

export const publications: Publication[] = [
  {
    id: "mental-health-chatbots",
    title: "A systematic review on mental health chatbots: Trends, design principles, evaluation methods, and future research agenda",
    authors: "Kuhail, M. A., Al-Shamaileh, O., Farooq, S., et al.",
    venue: "Human Behavior and Emerging Technologies",
    year: 2025,
    type: "journal",
    links: [{ label: "DOI", href: "https://doi.org/10.1155/hbe2/9942295" }],
  },
  {
    id: "oo-python-book",
    title: "The Object-Oriented Approach to Problem Solving and Machine Learning with Python",
    authors: "Mathew, S. S., Kuhail, M. A., Hadid, M., & Farooq, S.",
    venue: "CRC Press",
    year: 2025,
    type: "book",
    links: [{ label: "Publisher", href: "https://doi.org/10.1201/9781032668321" }],
  },
  {
    id: "chatbot-usability",
    title: "Recent Developments in Chatbot Usability and Design Methodologies",
    authors: "Kuhail, M. A., Farooq, S., & Almutairi, S.",
    venue: "Trends, Applications, and Challenges of Chatbot Technology",
    year: 2023,
    type: "chapter",
    links: [{ label: "DOI", href: "https://doi.org/10.4018/978-1-6684-6234-8.ch001" }],
  },
  {
    id: "immersive-learning",
    title: "Exploring Immersive Learning Experiences: A Survey",
    authors: "Kuhail, M. A., ElSayary, A., Farooq, S., & Alghamdi, A.",
    venue: "Informatics",
    year: 2022,
    type: "journal",
    links: [{ label: "DOI", href: "https://doi.org/10.3390/informatics9040075" }],
  },
  {
    id: "visual-programming",
    title: "Characterizing Visual Programming Approaches for End-User Developers: A Systematic Review",
    authors: "Kuhail, M. A., Farooq, S., Hammad, R., & Bahja, M.",
    venue: "IEEE Access",
    year: 2021,
    type: "journal",
    links: [{ label: "DOI", href: "https://doi.org/10.1109/ACCESS.2021.3051043" }],
  },
  {
    id: "pairedvis-chapter",
    title: "Pairing for Designing Visualizations",
    authors: "Farooq, S., Carpendale, S., & Maurer, F.",
    venue: "Designing Digital Surface Applications (SurfNet)",
    year: 2016,
    type: "chapter",
    links: [{ label: "Book", href: "https://doi.org/10.11575/prism/35574" }],
  },
  {
    id: "masters-thesis",
    title: "Design and Discussion of Visualizations in Pairs",
    authors: "S. Farooq",
    venue: "M.Sc. Thesis, University of Calgary",
    year: 2014,
    type: "thesis",
    links: [{ label: "PRISM", href: "https://doi.org/10.11575/prism/25566" }],
  },
];

export type TeachingRecord = {
  id: string;
  code: string;
  title: string;
  term: string;
  year: number;
  semester: "Spring" | "Fall" | "Winter" | "Summer";
  role: "Instructor" | "Teaching Assistant";
  institution: string;
  topic: TeachingTopic;
};

export type TeachingTopic =
  | "Programming"
  | "Algorithms"
  | "Machine Learning"
  | "IT & Data";

export const teachingTopicColors: Record<TeachingTopic, string> = {
  Programming: "#3d6b8c",
  Algorithms: "#5a8f6e",
  "Machine Learning": "#5c2e0e",
  "IT & Data": "#7a6b9b",
};

function topicFromCode(code: string, title: string): TeachingTopic {
  if (
    code.startsWith("ICS 351") ||
    code.startsWith("ICS 352") ||
    title.toLowerCase().includes("machine learning") ||
    title.toLowerCase().includes("neural network")
  )
    return "Machine Learning";
  if (code.startsWith("ICS 221") || code.startsWith("ICB 103")) return "Algorithms";
  if (
    code.startsWith("ICS 220") ||
    code.startsWith("SWE") ||
    title.toLowerCase().includes("programming")
  )
    return "Programming";
  if (code.startsWith("CPSC 449") || title.toLowerCase().includes("haskell"))
    return "Programming";
  return "IT & Data";
}

function withTopic(
  record: Omit<TeachingRecord, "topic">
): TeachingRecord {
  return { ...record, topic: topicFromCode(record.code, record.title) };
}

export const teachingRecords: TeachingRecord[] = (
  [
  { id: "ics221", code: "ICS 221", title: "Data Structures and Algorithms", term: "Spring 2025", year: 2025, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "ics340", code: "ICS 340", title: "Database Systems", term: "Spring 2025", year: 2025, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "ics352-s25", code: "ICS 352", title: "Neural Networks", term: "Spring 2025", year: 2025, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "ics351", code: "ICS 351", title: "Machine Learning", term: "Fall 2024", year: 2024, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "ics352-f24", code: "ICS 352", title: "Neural Networks", term: "Fall 2024", year: 2024, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "icb103-f24", code: "ICB 103", title: "Applied Algorithmic Thinking", term: "Fall 2024", year: 2024, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "ics220-s24", code: "ICS 220", title: "Programming Fundamentals", term: "Spring 2024", year: 2024, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "ics220-f23", code: "ICS 220", title: "Programming Fundamentals", term: "Fall 2023", year: 2023, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "icb103-s23", code: "ICB 103", title: "Applied Algorithmic Thinking", term: "Spring 2023", year: 2023, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "swe321-s23", code: "SWE 321", title: "Object Oriented Programming Lab", term: "Spring 2023", year: 2023, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "swe225", code: "SWE 225", title: "Intro to Programming and Problem Solving", term: "Fall 2022", year: 2022, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "swe321-f22", code: "SWE 321", title: "Object Oriented Programming Lab", term: "Fall 2022", year: 2022, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "cit210-f22", code: "CIT 210", title: "Essentials of IT and Infrastructure", term: "Fall 2022", year: 2022, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "swe321-s22", code: "SWE 321", title: "Object Oriented Programming Lab", term: "Spring 2022", year: 2022, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "cit210-s22", code: "CIT 210", title: "Essentials of IT and Infrastructure", term: "Spring 2022", year: 2022, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "swe321-f21", code: "SWE 321", title: "Object Oriented Programming Lab", term: "Fall 2021", year: 2021, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "cit210-f21", code: "CIT 210", title: "Essentials of IT and Infrastructure", term: "Fall 2021", year: 2021, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "cit210-s21", code: "CIT 210", title: "Essentials of IT and Infrastructure", term: "Spring 2021", year: 2021, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "swe321-s21", code: "SWE 321", title: "Object Oriented Programming Lab", term: "Spring 2021", year: 2021, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "cit210-f20", code: "CIT 210", title: "Essentials of IT and Infrastructure", term: "Fall 2020", year: 2020, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "gen110-f20", code: "GEN 110", title: "Data Management and Analysis", term: "Fall 2020", year: 2020, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "gen110-f19", code: "GEN 110", title: "Data Management and Analysis", term: "Fall 2019", year: 2019, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "cit210-s19", code: "CIT 210", title: "Essentials of IT and Infrastructure", term: "Spring 2019", year: 2019, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "cit210-f19", code: "CIT 210", title: "Essentials of IT and Infrastructure", term: "Fall 2019", year: 2019, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "gen175-f18", code: "GEN 175", title: "Introduction to Information and Technology", term: "Fall 2018", year: 2018, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "gen175-s18", code: "GEN 175", title: "Introduction to Information and Technology", term: "Spring 2018", year: 2018, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "gen175-f17", code: "GEN 175", title: "Introduction to Information and Technology", term: "Fall 2017", year: 2017, semester: "Fall", role: "Instructor", institution: "Zayed University" },
  { id: "gen175-s17", code: "GEN 175", title: "Introduction to Information and Technology", term: "Spring 2017", year: 2017, semester: "Spring", role: "Instructor", institution: "Zayed University" },
  { id: "cpsc203", code: "CPSC 203", title: "Intro to Problem Solving using Application Software", term: "Fall 2012", year: 2012, semester: "Fall", role: "Teaching Assistant", institution: "University of Calgary" },
  { id: "cpsc449", code: "CPSC 449", title: "Programming Language Paradigms", term: "Winter 2012", year: 2012, semester: "Winter", role: "Teaching Assistant", institution: "University of Calgary" },
  { id: "cpsc449-w13", code: "CPSC 449", title: "Programming Language Paradigms", term: "Winter 2013", year: 2013, semester: "Winter", role: "Teaching Assistant", institution: "University of Calgary" },
  ] satisfies Omit<TeachingRecord, "topic">[]
).map(withTopic);

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
        heading: "Ph.D. in Interactive Arts & Technology",
        subheading: "Simon Fraser University",
        period: "2025 – Present",
        details: ["Focus: Human-Computer Interaction & Visualization"],
      },
      {
        heading: "M.Sc. in Computer Science",
        subheading: "University of Calgary",
        period: "2012 – 2014",
        details: [
          "Thesis: Design and Discussion of Visualizations in Pairs",
          "Queen Elizabeth II Scholarship",
        ],
      },
      {
        heading: "B.Sc. (Honors) in Computer Science",
        subheading: "Kinnaird College for Women, Lahore",
        period: "1999 – 2002",
        details: ["K.K. Aziz Gold Medal — 1st position"],
      },
    ],
  },
  {
    title: "Experience",
    items: [
      {
        heading: "Research Assistant — TAIP",
        subheading: "Simon Fraser University",
        period: "2026 – Present",
        details: ["Transforming Arts Impact Initiative"],
      },
      {
        heading: "Instructor",
        subheading: "Zayed University, UAE",
        period: "2017 – 2025",
        details: [
          "Programming, data structures, machine learning, and IT courses",
          "Course coordinator and internship supervisor",
        ],
      },
      {
        heading: "Teaching Assistant",
        subheading: "University of Calgary",
        period: "2012 – 2013",
        details: ["Haskell and Alice visual programming labs"],
      },
      {
        heading: "Technical Content Developer",
        subheading: "Etisalat, UAE",
        period: "2005 – 2007",
      },
      {
        heading: "Software Development Engineer",
        subheading: "Emircom, UAE",
        period: "2003 – 2004",
      },
      {
        heading: "System Analyst / Programmer",
        subheading: "ESP GITS, Pakistan",
        period: "2002 – 2003",
      },
    ],
  },
  {
    title: "Awards & Certifications",
    items: [
      { heading: "HEA Fellowship", subheading: "AdvanceHE, London", period: "2020" },
      { heading: "Blackboard Academy Certified Associate", subheading: "Zayed University", period: "2021" },
      { heading: "Queen Elizabeth II Scholarship", subheading: "University of Calgary", period: "2013" },
      { heading: "K.K. Aziz Gold Medal", subheading: "Kinnaird College for Women", period: "2002" },
      { heading: "Outstanding Support Award", subheading: "Student Accessibility Center, Zayed University", period: "2023" },
    ],
  },
  {
    title: "Skills",
    items: [
      {
        heading: "Research",
        period: "",
        details: [
          "Collaborative visualization design, co-design studies, systematic reviews",
          "Controlled experiments, interviews, usability evaluation",
        ],
      },
      {
        heading: "Technical",
        period: "",
        details: [
          "D3.js, React, TypeScript, Python, Java, Haskell, Power BI, LaTeX",
        ],
      },
    ],
  },
];
