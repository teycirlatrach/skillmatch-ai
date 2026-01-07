import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ✅ Models (selon ta capture backend/models)
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";

import Skill from "../models/Skill.js";

import Career from "../models/Career.js";
import CareerSkill from "../models/CareerSkill.js";

import Formation from "../models/Formation.js";
import FormationSkill from "../models/FormationSkill.js";

import PfeTopic from "../models/PfeTopic.js";
import StudentSkill from "../models/StudentSkill.js";

// --- helpers ---
function pick(arr, names) {
  const map = new Map(arr.map((x) => [x.name, x]));
  return names.map((n) => map.get(n)).filter(Boolean);
}

async function main() {
  const DROP = process.argv.includes("--drop");

  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!MONGO_URI) {
    console.error("❌ Missing MONGO_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected for seeding");

  if (DROP) {
    console.log("🧹 Dropping collections...");
    await Promise.allSettled([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Skill.deleteMany({}),
      Career.deleteMany({}),
      CareerSkill.deleteMany({}),
      Formation.deleteMany({}),
      FormationSkill.deleteMany({}),
      PfeTopic.deleteMany({}),
      StudentSkill.deleteMany({}),
    ]);
  }

  // 1) Skills
  const skillsData = [
    // Web
    { name: "HTML", category: "Web" },
    { name: "CSS", category: "Web" },
    { name: "JavaScript", category: "Web" },
    { name: "TypeScript", category: "Web" },
    { name: "React", category: "Web" },
    { name: "Node.js", category: "Web" },
    { name: "Express", category: "Web" },
    { name: "REST API", category: "Web" },
    { name: "Git", category: "Tools" },
    { name: "Docker", category: "Tools" },

    // Data / BI
    { name: "SQL", category: "Data" },
    { name: "Power BI", category: "BI" },
    { name: "Tableau", category: "BI" },
    { name: "Python", category: "Data" },
    { name: "Pandas", category: "Data" },
    { name: "ETL", category: "Data" },
    { name: "Data Warehouse", category: "Data" },
    { name: "Star Schema", category: "Data" },
    { name: "DAX", category: "BI" },

    // AI / ML
    { name: "Machine Learning", category: "AI" },
    { name: "NLP", category: "AI" },
    { name: "Recommendation Systems", category: "AI" },

    // Cyber
    { name: "Linux", category: "Cyber" },
    { name: "Networking", category: "Cyber" },
    { name: "Web Security", category: "Cyber" },
    { name: "OWASP Top 10", category: "Cyber" },
    { name: "Pentesting Basics", category: "Cyber" },

    // Cloud
    { name: "Cloud Basics", category: "Cloud" },
    { name: "CI/CD", category: "DevOps" },
    { name: "Testing", category: "QA" },
  ];

  // upsert skills (avoid duplicates)
  for (const s of skillsData) {
    await Skill.updateOne({ name: s.name }, { $set: s }, { upsert: true });
  }
  const skills = await Skill.find({});
  console.log("✅ Skills:", skills.length);

  // 2) Careers
  const careersData = [
    {
      title: "Data Analyst",
      domain: "BI / Data",
      description: "Analyze data, build dashboards, answer business questions.",
      req: [
        ["SQL", 0.35],
        ["Power BI", 0.30],
        ["DAX", 0.15],
        ["Python", 0.20],
      ],
    },
    {
      title: "Data Engineer",
      domain: "Data / ETL",
      description: "Build pipelines, warehouses, and reliable data systems.",
      req: [
        ["SQL", 0.25],
        ["Python", 0.20],
        ["ETL", 0.25],
        ["Data Warehouse", 0.20],
        ["Docker", 0.10],
      ],
    },
    {
      title: "Full Stack Developer",
      domain: "Web",
      description: "Build web apps with frontend + backend.",
      req: [
        ["JavaScript", 0.20],
        ["React", 0.25],
        ["Node.js", 0.20],
        ["Express", 0.15],
        ["REST API", 0.10],
        ["Git", 0.10],
      ],
    },
    {
      title: "Cybersecurity Analyst (SOC)",
      domain: "Cyber",
      description: "Monitor alerts, investigate incidents, improve security.",
      req: [
        ["Linux", 0.25],
        ["Networking", 0.25],
        ["Web Security", 0.15],
        ["OWASP Top 10", 0.20],
        ["Git", 0.15],
      ],
    },
    {
      title: "Pentester Junior",
      domain: "Cyber",
      description: "Test security of systems and report vulnerabilities.",
      req: [
        ["Linux", 0.20],
        ["Networking", 0.20],
        ["Web Security", 0.20],
        ["OWASP Top 10", 0.20],
        ["Pentesting Basics", 0.20],
      ],
    },
    {
      title: "ML Engineer (Junior)",
      domain: "AI",
      description: "Build ML models, evaluate, and deploy.",
      req: [
        ["Python", 0.30],
        ["Pandas", 0.15],
        ["Machine Learning", 0.30],
        ["Docker", 0.10],
        ["Git", 0.15],
      ],
    },
    {
      title: "BI Developer",
      domain: "BI",
      description: "Design semantic models + dashboards for decision making.",
      req: [
        ["SQL", 0.30],
        ["Power BI", 0.30],
        ["DAX", 0.20],
        ["Star Schema", 0.20],
      ],
    },
    {
      title: "DevOps Junior",
      domain: "DevOps",
      description: "Automate deployments and improve reliability.",
      req: [
        ["Linux", 0.20],
        ["Docker", 0.25],
        ["CI/CD", 0.25],
        ["Git", 0.15],
        ["Cloud Basics", 0.15],
      ],
    },
  ];

  // create careers
  await Career.deleteMany({});
  await CareerSkill.deleteMany({});
  const careers = await Career.insertMany(
    careersData.map((c) => ({
      title: c.title,
      domain: c.domain,
      description: c.description,
    }))
  );

  // attach CareerSkill
  for (const c of careersData) {
    const career = careers.find((x) => x.title === c.title);
    const reqSkills = c.req;
    for (const [skillName, weight] of reqSkills) {
      const skill = skills.find((s) => s.name === skillName);
      if (!skill) continue;
      await CareerSkill.create({
        careerId: career._id,
        skillId: skill._id,
        weight,
      });
    }
  }
  console.log("✅ Careers:", careers.length);

  // 3) Formations
  const formationsData = [
    {
      title: "Bootcamp Fullstack MERN",
      provider: "Online",
      durationWeeks: 8,
      req: [
        ["JavaScript", 0.25],
        ["React", 0.25],
        ["Node.js", 0.20],
        ["Express", 0.15],
        ["REST API", 0.10],
        ["Git", 0.05],
      ],
    },
    {
      title: "Formation BI (Power BI + DAX)",
      provider: "Local",
      durationWeeks: 6,
      req: [
        ["SQL", 0.30],
        ["Power BI", 0.40],
        ["DAX", 0.20],
        ["Star Schema", 0.10],
      ],
    },
    {
      title: "Python for Data",
      provider: "Online",
      durationWeeks: 6,
      req: [
        ["Python", 0.40],
        ["Pandas", 0.25],
        ["SQL", 0.20],
        ["Machine Learning", 0.15],
      ],
    },
    {
      title: "Cybersecurity Fundamentals",
      provider: "Online",
      durationWeeks: 6,
      req: [
        ["Linux", 0.25],
        ["Networking", 0.25],
        ["Web Security", 0.20],
        ["OWASP Top 10", 0.20],
        ["Pentesting Basics", 0.10],
      ],
    },
    {
      title: "DevOps Starter",
      provider: "Online",
      durationWeeks: 6,
      req: [
        ["Linux", 0.20],
        ["Docker", 0.30],
        ["CI/CD", 0.25],
        ["Git", 0.15],
        ["Cloud Basics", 0.10],
      ],
    },
    {
      title: "Data Engineering Basics",
      provider: "Online",
      durationWeeks: 8,
      req: [
        ["SQL", 0.25],
        ["ETL", 0.30],
        ["Data Warehouse", 0.25],
        ["Python", 0.20],
      ],
    },
    {
      title: "Web Security (OWASP)",
      provider: "Online",
      durationWeeks: 4,
      req: [
        ["Web Security", 0.35],
        ["OWASP Top 10", 0.35],
        ["Linux", 0.15],
        ["Networking", 0.15],
      ],
    },
    {
      title: "DWH Modeling (Star Schema)",
      provider: "Local",
      durationWeeks: 4,
      req: [
        ["Data Warehouse", 0.30],
        ["Star Schema", 0.40],
        ["SQL", 0.30],
      ],
    },
  ];

  await Formation.deleteMany({});
  await FormationSkill.deleteMany({});
  const formations = await Formation.insertMany(
    formationsData.map((f) => ({
      title: f.title,
      provider: f.provider,
      durationWeeks: f.durationWeeks,
    }))
  );

  for (const f of formationsData) {
    const formation = formations.find((x) => x.title === f.title);
    for (const [skillName, weight] of f.req) {
      const skill = skills.find((s) => s.name === skillName);
      if (!skill) continue;
      await FormationSkill.create({
        formationId: formation._id,
        skillId: skill._id,
        weight,
      });
    }
  }
  console.log("✅ Formations:", formations.length);

  // 4) PFE Topics (linked to Career)
  await PfeTopic.deleteMany({});
  const byTitle = new Map(careers.map((c) => [c.title, c]));

  const pfeTopicsData = [
    {
      title: "BI Dashboard for Sales Performance",
      description: "Build a star schema + Power BI dashboards + DAX measures.",
      career: "BI Developer",
      stack: ["SQL", "Power BI", "DAX"],
    },
    {
      title: "ETL Pipeline + Data Warehouse for Healthcare",
      description: "Design ETL + warehouse + KPIs for healthcare domain.",
      career: "Data Engineer",
      stack: ["Python", "SQL", "ETL", "Data Warehouse"],
    },
    {
      title: "SkillMatch AI – Student Orientation Platform",
      description: "MERN platform for skills-based recommendations with scoring.",
      career: "Full Stack Developer",
      stack: ["React", "Node.js", "MongoDB"],
    },
    {
      title: "SOC Mini SIEM + Alert Dashboard",
      description: "Collect logs + alerts + visualization and triage workflow.",
      career: "Cybersecurity Analyst (SOC)",
      stack: ["Linux", "Networking", "Web Security"],
    },
    {
      title: "OWASP Web Security Audit Toolkit",
      description: "Audit a web app, build checklist, and report vulnerabilities.",
      career: "Pentester Junior",
      stack: ["OWASP Top 10", "Web Security", "Linux"],
    },
    {
      title: "Recommendation Engine for Courses",
      description: "Content-based recommendations using skills and weights.",
      career: "ML Engineer (Junior)",
      stack: ["Python", "Machine Learning", "Recommendation Systems"],
    },
    {
      title: "MERN E-commerce Analytics Dashboard",
      description: "Fullstack + tracking + BI dashboard for product KPIs.",
      career: "Data Analyst",
      stack: ["React", "Node.js", "SQL", "Power BI"],
    },
    {
      title: "CI/CD Pipeline for MERN App",
      description: "Dockerize + CI/CD + deploy with best practices.",
      career: "DevOps Junior",
      stack: ["Docker", "CI/CD", "Git", "Cloud Basics"],
    },
    {
      title: "Data Quality Monitoring for ETL",
      description: "Rules, checks, alerts for data warehouse pipelines.",
      career: "Data Engineer",
      stack: ["ETL", "SQL", "Python"],
    },
    {
      title: "Pentest Report Generator (Web)",
      description: "Web app to generate pentest reports with templates.",
      career: "Pentester Junior",
      stack: ["React", "Node.js", "OWASP Top 10"],
    },
    {
      title: "Power BI Template for University KPIs",
      description: "Reusable BI templates for education KPIs.",
      career: "BI Developer",
      stack: ["Power BI", "DAX", "SQL"],
    },
    {
      title: "Threat Intelligence Mini Platform",
      description: "Collect feeds + simple scoring + dashboard.",
      career: "Cybersecurity Analyst (SOC)",
      stack: ["Linux", "Python", "Networking"],
    },
  ];

  await PfeTopic.insertMany(
    pfeTopicsData.map((t) => ({
      title: t.title,
      description: t.description,
      careerId: byTitle.get(t.career)?._id,
      stack: t.stack,
    }))
  );
  console.log("✅ PFE Topics:", pfeTopicsData.length);

  // 5) Demo users
  // delete existing demo users if any
  await User.deleteMany({ email: { $in: ["admin@demo.tn", "student@demo.tn"] } });

  const adminPass = await bcrypt.hash("Admin123!", 10);
  const studentPass = await bcrypt.hash("Student123!", 10);

  const admin = await User.create({
  email: "admin@demo.tn",
  passwordHash: adminPass,
  role: "ADMIN",
});

const student = await User.create({
  email: "student@demo.tn",
  passwordHash: studentPass,
  role: "STUDENT",
});



  const profile = await StudentProfile.create({
    userId: student._id,
    fullName: "Student Demo",
    goal: "BI",
    major: "Business Intelligence",
    level: "5ème année",
    location: "Sousse",
    interests: ["data", "bi", "dashboards"],
  });

  // Give student some skills so recommendations are not 0%
  const sSQL = skills.find((s) => s.name === "SQL");
  const sPBI = skills.find((s) => s.name === "Power BI");
  const sDAX = skills.find((s) => s.name === "DAX");
  const sPython = skills.find((s) => s.name === "Python");
  const sGit = skills.find((s) => s.name === "Git");

  await StudentSkill.deleteMany({ profileId: profile._id });

  await StudentSkill.insertMany([
    { profileId: profile._id, skillId: sSQL?._id, level: 4 },
    { profileId: profile._id, skillId: sPBI?._id, level: 4 },
    { profileId: profile._id, skillId: sDAX?._id, level: 3 },
    { profileId: profile._id, skillId: sPython?._id, level: 3 },
    { profileId: profile._id, skillId: sGit?._id, level: 3 },
  ].filter(x => x.skillId));

  console.log("✅ Demo accounts created:");
  console.log("ADMIN   -> admin@demo.tn   / Admin123!");
  console.log("STUDENT -> student@demo.tn / Student123!");

  await mongoose.disconnect();
  console.log("✅ Seed done");
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
