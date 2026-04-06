/* ===========================
   Portfolio Data (Final Version)
   =========================== */

export const personalData = {
  name: "Yash Redkar",
  tagline:
    "Full-Stack Developer building scalable systems and production-ready applications.",
  flag: "🇮🇳",
  location: "Mumbai, India",
  rating: null,
  activeSince: 2024,

  bio: `I build real-world applications and scalable systems, not just interfaces. My focus is on clean architecture, efficient backend design, and delivering products that solve practical problems. I enjoy working across the full stack — from intuitive user experiences to reliable APIs and systems.`,

  philosophy:
    "I focus on building systems that are scalable, maintainable, and solve real-world problems.",
};

/* ===========================
   Skills
   =========================== */

export const skills = [
  {
    line: "Core Stack",
    items: [
      { name: "React", depth: "solid" },
      { name: "Next.js", depth: "solid" },
      { name: "JavaScript", depth: "deep" },
      { name: "TypeScript", depth: "solid" },
    ],
  },
  {
    line: "Backend & APIs",
    items: [
      { name: "Node.js", depth: "deep" },
      { name: "Express.js", depth: "deep" },
      { name: "REST APIs", depth: "deep" },
      { name: "Authentication & Authorization", depth: "solid" },
    ],
  },
  {
    line: "Databases",
    items: [
      { name: "MongoDB", depth: "solid" },
      { name: "SQL", depth: "solid" },
      { name: "DBMS Concepts", depth: "solid" },
    ],
  },
  {
    line: "Languages",
    items: [
      { name: "Java", depth: "solid" },
      { name: "C", depth: "solid" },
      { name: "Python", depth: "solid" },
    ],
  },
  {
    line: "Currently Improving",
    items: [
      { name: "DSA", depth: "solid" },
      { name: "System Design", depth: "studying" },
      { name: "AI/ML Fundamentals", depth: "studying" },
    ],
  },
];

/* ===========================
   Projects
   =========================== */

export const projects = [
  {
    name: "TeamForge",
    difficulty: 5,
    desc: "A full-stack SaaS project management platform designed for real-world team collaboration. Features include multi-workspace architecture, role-based access control, task hierarchies, activity tracking, notifications, and real-time updates using Socket.IO.",
    stack: ["Next.js", "TypeScript", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "https://team-forge-nine.vercel.app/",
    repoUrl: "https://github.com/yash-redkar/TeamForge",
  },
  {
    name: "Monastery360",
    difficulty: 4,
    desc: "A tourism and heritage platform focused on immersive storytelling, featuring dynamic monastery pages, interactive maps, and an admin dashboard for managing content and cultural data.",
    stack: ["HTML", "CSS", "JavaScript", "Express.js", "MongoDB"],
    liveUrl: "#",
    repoUrl: "https://github.com/yash-redkar/Monastery360",
  },
  {
    name: "Winner Predictor",
    difficulty: 4,
    desc: "A full-stack web application that predicts the winner and runner-up among players using Two-Scan and Tournament (Divide & Conquer) algorithms. Designed to compare algorithm efficiency through score-based evaluation, player generation, and tracked comparison counts.",
    stack: ["HTML", "JavaScript", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "#",
    repoUrl: "https://github.com/yash-redkar/Winner-Predictor",
  },
  {
    name: "Car Rental System",
    difficulty: 3,
    desc: "A desktop car rental application built with Java Swing that allows users to select vehicles, calculate rental costs based on hours, and confirm bookings with booking details stored in a text file.",
    stack: ["Java", "Swing", "File Handling"],
    liveUrl: "#",
    repoUrl: "#",
  },
];

/* ===========================
   Experience
   =========================== */

export const experience = [
  {
    round: 1,
    total: 3,
    period: "Virtual Experience",
    company: "Deloitte",
    title: "Technology Virtual Experience Participant",
    venue: "Forage Program · March 2026",
    barFill: 65,
    annotations: [
      {
        symbol: "!!",
        text: "Completed Deloitte Technology Virtual Experience Program with hands-on development and coding tasks",
      },
      {
        symbol: "!",
        text: "Worked on practical engineering tasks focused on coding and development workflows",
      },
      {
        symbol: "!",
        text: "Gained exposure to real-world problem solving and industry-level software development practices",
      },
    ],
  },
  {
    round: 2,
    total: 3,
    period: "Hackathon Experience",
    company: "Smart India Hackathon (SIH)",
    title: "Participant",
    venue: "Team Collaboration · Project Development",
    barFill: 75,
    annotations: [
      {
        symbol: "!!",
        text: "Built Monastery360 as part of SIH Hackathon, focusing on tourism platform design and user experience",
      },
      {
        symbol: "!",
        text: "Worked on project ideation, structuring, and implementation under time constraints",
      },
      {
        symbol: "!",
        text: "Improved teamwork, communication, and practical problem-solving skills through hackathon experience",
      },
    ],
  },
  {
    round: 3,
    total: 3,
    period: "Project Experience",
    company: "Personal Projects",
    title: "Full-Stack Developer",
    venue: "Projects · Portfolio · Practice",
    barFill: 90,
    annotations: [
      {
        symbol: "!!",
        text: "Built TeamForge, a full-stack SaaS platform with multi-workspace architecture and role-based access control",
      },
      {
        symbol: "!",
        text: "Developed APIs, authentication systems, database schemas, and interactive frontend interfaces",
      },
      {
        symbol: "!",
        text: "Built projects including Winner Predictor, Monastery360, and Car Rental System to strengthen real-world development skills",
      },
    ],
  },
];

/* ===========================
   Contact Links
   =========================== */

export const contactLinks = [
  {
    icon: "📧",
    label: "Email",
    response: "Send Message",
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=redkar19yash%40gmail.com&su=Portfolio%20Inquiry",
  },
  {
    icon: "💼",
    label: "LinkedIn",
    response: "View Profile",
    url: "https://www.linkedin.com/in/yash-redkar-248392388",
  },
  {
    icon: "🐙",
    label: "GitHub",
    response: "Explore Work",
    url: "https://github.com/yash-redkar",
  },
  {
    icon: "📄",
    label: "Resume",
    response: "Download CV",
    url: "/resume.pdf",
  },
];

/* ===========================
   Heatmap (unchanged)
   =========================== */

export const heatmapData = (() => {
  const data = [];
  const now = new Date();
  for (let i = 63; i >= 0; i--) {
    const weekDate = new Date(now);
    weekDate.setDate(weekDate.getDate() - i * 7);
    data.push({
      week: weekDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      contributions: Math.floor(Math.random() * 35) + (i < 10 ? 15 : 3),
    });
  }
  return data;
})();
