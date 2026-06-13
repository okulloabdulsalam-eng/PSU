import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const subjects = [
  {
    name: "Pharmacology",
    slug: "pharmacology",
    icon: "💊",
    description: "Study of drug actions, mechanisms, and therapeutic uses",
    color: "#1A56DB",
    displayOrder: 1,
  },
  {
    name: "Pharmaceutical Chemistry",
    slug: "pharmaceutical-chemistry",
    icon: "⚗️",
    description:
      "Chemical properties and analysis of drugs and pharmaceuticals",
    color: "#7C3AED",
    displayOrder: 2,
  },
  {
    name: "Pharmacognosy",
    slug: "pharmacognosy",
    icon: "🌿",
    description: "Natural products, herbal medicines, and plant-based drugs",
    color: "#16A34A",
    displayOrder: 3,
  },
  {
    name: "Pharmacy Practice",
    slug: "pharmacy-practice",
    icon: "🏥",
    description: "Clinical practice, dispensing, and patient counselling",
    color: "#F59E0B",
    displayOrder: 4,
  },
  {
    name: "Pharmaceutics",
    slug: "pharmaceutics",
    icon: "🧪",
    description: "Drug formulation, dosage forms, and delivery systems",
    color: "#EC4899",
    displayOrder: 5,
  },
  {
    name: "Pharmaceutical Microbiology",
    slug: "pharmaceutical-microbiology",
    icon: "🦠",
    description:
      "Microbial contamination, sterility, and antimicrobial testing",
    color: "#EF4444",
    displayOrder: 6,
  },
  {
    name: "Clinical Pharmacy",
    slug: "clinical-pharmacy",
    icon: "🩺",
    description: "Patient-centered medication management and pharmacotherapy",
    color: "#06B6D4",
    displayOrder: 7,
  },
  {
    name: "Pharmacokinetics",
    slug: "pharmacokinetics",
    icon: "📈",
    description: "Drug absorption, distribution, metabolism, and excretion",
    color: "#F97316",
    displayOrder: 8,
  },
  {
    name: "Pharmaceutical Jurisprudence",
    slug: "pharmaceutical-jurisprudence",
    icon: "⚖️",
    description:
      "Pharmacy laws, regulations, and professional ethics in Uganda",
    color: "#6366F1",
    displayOrder: 9,
  },
  {
    name: "Biochemistry",
    slug: "biochemistry",
    icon: "🧬",
    description: "Chemical processes and substances in living organisms",
    color: "#14B8A6",
    displayOrder: 10,
  },
  {
    name: "Anatomy and Physiology",
    slug: "anatomy-and-physiology",
    icon: "❤️",
    description:
      "Human body structure, organ systems, and physiological processes",
    color: "#F43F5E",
    displayOrder: 11,
  },
  {
    name: "NDA Regulations Uganda",
    slug: "nda-regulations-uganda",
    icon: "🇺🇬",
    description:
      "National Drug Authority regulations, policies, and drug registration in Uganda",
    color: "#16A34A",
    displayOrder: 12,
  },
];

const topicsTemplate = [
  {
    suffix: "Fundamentals",
    descSuffix: "Core principles and foundational concepts",
  },
  {
    suffix: "Clinical Applications",
    descSuffix: "Applied clinical scenarios and case studies",
  },
  {
    suffix: "Exam Focus Topics",
    descSuffix: "High-yield topics commonly tested in licensing exams",
  },
];

const noteContent = (subject: string, topic: string, index: number) => `
<h1>${subject} – ${topic}</h1>
<p>This comprehensive note covers the essential concepts of <strong>${topic}</strong> in ${subject}. Understanding these principles is critical for your PSU licensing examination.</p>

<h2>Key Concepts</h2>
<p>The study of ${topic} encompasses several important areas that are frequently tested in the pharmacy licensing examination. These include the fundamental principles, mechanisms, and clinical applications relevant to Ugandan pharmacy practice.</p>

<h2>Important Definitions</h2>
<ul>
  <li><strong>Term 1:</strong> Definition relevant to ${subject} and ${topic}</li>
  <li><strong>Term 2:</strong> Another key definition you must know for the exam</li>
  <li><strong>Term 3:</strong> A third critical term tested in past PSU exams</li>
</ul>

<h2>Core Mechanisms</h2>
<p>When studying ${topic}, it is essential to understand the underlying mechanisms. These mechanisms form the basis of exam questions and clinical practice in Uganda.</p>

<h2>Clinical Relevance</h2>
<p>In Ugandan pharmacy practice, ${topic} is applied in the following clinical contexts:</p>
<ol>
  <li>Patient counselling and medication management</li>
  <li>Drug interaction assessments in community pharmacy</li>
  <li>Hospital pharmacy practice at national referral hospitals</li>
</ol>

<h2>Summary Table</h2>
<table>
  <thead><tr><th>Parameter</th><th>Value/Description</th><th>Clinical Significance</th></tr></thead>
  <tbody>
    <tr><td>Key Factor 1</td><td>Description 1</td><td>Significance 1</td></tr>
    <tr><td>Key Factor 2</td><td>Description 2</td><td>Significance 2</td></tr>
    <tr><td>Key Factor 3</td><td>Description 3</td><td>Significance 3</td></tr>
  </tbody>
</table>

<h2>Exam Tips</h2>
<blockquote>
  Focus on the high-yield facts for this topic. The PSU exam frequently tests clinical application of ${topic} in the Ugandan healthcare setting.
</blockquote>

<p><strong>Remember:</strong> Practice questions and mock exams are the best way to consolidate your knowledge of ${topic}.</p>
`;

const mcqTemplates = (subject: string, topic: string, num: number) => [
  {
    text: `Which of the following best describes the primary mechanism of action relevant to ${topic} in ${subject}?`,
    explanation: `The correct answer relates to the fundamental mechanism of ${topic}. This is a frequently tested concept in PSU examinations. Understanding the mechanism helps in predicting drug effects, interactions, and therapeutic applications in clinical practice.`,
    options: [
      {
        text: `Mechanism A – direct receptor agonism relevant to ${topic}`,
        isCorrect: true,
      },
      { text: `Mechanism B – enzyme inhibition pathway`, isCorrect: false },
      { text: `Mechanism C – ion channel blockade`, isCorrect: false },
      { text: `Mechanism D – DNA intercalation process`, isCorrect: false },
    ],
  },
  {
    text: `A patient presents with symptoms consistent with ${topic}-related pathology. Which intervention is MOST appropriate according to ${subject} principles?`,
    explanation: `The correct intervention follows standard ${subject} guidelines. This question tests your ability to apply ${topic} knowledge to clinical scenarios, which is a key component of the PSU post-internship examination.`,
    options: [
      { text: `First-line treatment option A`, isCorrect: false },
      {
        text: `Appropriate intervention based on ${topic} guidelines`,
        isCorrect: true,
      },
      { text: `Contraindicated option in this scenario`, isCorrect: false },
      {
        text: `Alternative with significant adverse effects`,
        isCorrect: false,
      },
    ],
  },
  {
    text: `In the context of ${topic}, which parameter is MOST important for monitoring therapeutic efficacy?`,
    explanation: `Monitoring the correct parameter ensures therapeutic efficacy and safety. This concept is directly applicable to pharmacy practice in Uganda and is commonly tested in both pre-licensure and post-internship examinations.`,
    options: [
      { text: `Non-specific laboratory parameter`, isCorrect: false },
      { text: `Irrelevant clinical marker`, isCorrect: false },
      { text: `Specific monitoring parameter for ${topic}`, isCorrect: true },
      { text: `Parameter used for a different condition`, isCorrect: false },
    ],
  },
  {
    text: `According to ${subject} principles, which of the following statements about ${topic} is CORRECT?`,
    explanation: `This statement accurately reflects the current understanding of ${topic} in ${subject}. Knowledge of correct principles helps differentiate true from false statements, a common exam format in PSU licensing examinations.`,
    options: [
      { text: `Incorrect statement A about ${topic}`, isCorrect: false },
      {
        text: `Correct factual statement about ${topic} in ${subject}`,
        isCorrect: true,
      },
      { text: `Incorrect statement B about ${topic}`, isCorrect: false },
      {
        text: `Partially correct but ultimately wrong statement`,
        isCorrect: false,
      },
    ],
  },
  {
    text: `Which of the following is a recognised complication or adverse effect associated with ${topic} in ${subject}?`,
    explanation: `Recognising adverse effects is critical for patient safety. This adverse effect is well-documented in the literature and has been tested in multiple past PSU examinations. Always consider patient safety when applying ${topic} knowledge.`,
    options: [
      {
        text: `Unrelated adverse effect from a different drug class`,
        isCorrect: false,
      },
      {
        text: `Minor side effect not typically associated with ${topic}`,
        isCorrect: false,
      },
      {
        text: `Recognised adverse effect of ${topic} in clinical practice`,
        isCorrect: true,
      },
      { text: `Contraindication rather than adverse effect`, isCorrect: false },
    ],
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.quizAttempt.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.video.deleteMany();
  await prisma.note.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@1234", 12);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@pharmaprep.ug",
      hashedPassword: adminPassword,
      role: "ADMIN",
      plan: "PREMIUM",
    },
  });
  console.log("✅ Created admin user: admin@pharmaprep.ug / Admin@1234");

  // Create sample students
  const studentPassword = await bcrypt.hash("Student@1234", 12);
  const students = [
    { name: "Aisha Nakato", email: "aisha@student.ug" },
    { name: "David Ssemwogerere", email: "david@student.ug" },
    { name: "Patience Atuhaire", email: "patience@student.ug" },
  ];
  for (const s of students) {
    await prisma.user.create({
      data: {
        ...s,
        hashedPassword: studentPassword,
        role: "STUDENT",
        plan: "FREE",
      },
    });
  }
  console.log("✅ Created 3 sample students");

  // Create subjects with topics, notes, videos, questions
  for (const subjectData of subjects) {
    console.log(`📚 Seeding subject: ${subjectData.name}`);
    const subject = await prisma.subject.create({ data: subjectData });

    for (let ti = 0; ti < topicsTemplate.length; ti++) {
      const tmpl = topicsTemplate[ti];
      const topicTitle = `${subjectData.name} ${tmpl.suffix}`;
      const topicSlug = `${subjectData.slug}-${tmpl.suffix.toLowerCase().replace(/\s+/g, "-")}`;

      const topic = await prisma.topic.create({
        data: {
          subjectId: subject.id,
          title: topicTitle,
          slug: topicSlug,
          description: `${tmpl.descSuffix} for ${subjectData.name}`,
          isPremium: ti === 2,
          displayOrder: ti + 1,
        },
      });

      // 2 notes per topic (1 free, 1 premium)
      await prisma.note.create({
        data: {
          topicId: topic.id,
          title: `${topicTitle} – Free Overview`,
          content: noteContent(subjectData.name, topicTitle, 0),
          isPremium: false,
        },
      });
      await prisma.note.create({
        data: {
          topicId: topic.id,
          title: `${topicTitle} – Comprehensive Guide`,
          content: noteContent(subjectData.name, topicTitle, 1),
          isPremium: true,
        },
      });

      // 3 videos per topic
      const ytIds = ["dQw4w9WgXcQ", "9bZkp7q19f0", "kXYiU_JCYtU"];
      for (let vi = 0; vi < 3; vi++) {
        await prisma.video.create({
          data: {
            topicId: topic.id,
            title: `${topicTitle} – Lecture ${vi + 1}`,
            youtubeId: ytIds[vi],
            description: `Video lecture ${vi + 1} covering ${topicTitle}`,
            durationSecs: 600 + vi * 180,
            isPremium: false,
            displayOrder: vi + 1,
          },
        });
      }

      // 10 questions per topic (5 free, 5 premium)
      const qTemplates = mcqTemplates(subjectData.name, topicTitle, 10);
      for (let qi = 0; qi < 10; qi++) {
        const tmplQ = qTemplates[qi % qTemplates.length];
        const difficulty = qi < 3 ? "EASY" : qi < 7 ? "MEDIUM" : "HARD";
        const year = qi < 5 ? 2023 : qi < 8 ? 2022 : undefined;

        await prisma.question.create({
          data: {
            topicId: topic.id,
            text: `[${subjectData.name} Q${qi + 1}] ${tmplQ.text}`,
            explanation: tmplQ.explanation,
            isPremium: qi >= 5,
            difficulty,
            type: "MCQ",
            pastExamYear: year,
            options: {
              create: tmplQ.options.map((o, oi) => ({
                text: o.text,
                isCorrect: o.isCorrect,
                displayOrder: oi,
              })),
            },
          },
        });
      }
    }
  }

  console.log("✅ All subjects, topics, notes, videos, and questions seeded!");
  console.log("\n🎉 Seed complete!");
  console.log("   Admin: admin@pharmaprep.ug / Admin@1234");
  console.log("   Student: aisha@student.ug / Student@1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
