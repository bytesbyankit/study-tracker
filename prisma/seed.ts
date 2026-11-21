import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialSubjects = [
  { name: "Mathematics", icon: "📐", color: "blue" },
  { name: "Science", icon: "🔬", color: "emerald" },
  { name: "English", icon: "📖", color: "amber" },
  { name: "Hindi", icon: "✍️", color: "rose" },
  { name: "Social Science", icon: "🌍", color: "purple" },
  { name: "Computer", icon: "💻", color: "cyan" },
  { name: "General Knowledge", icon: "💡", color: "yellow" },
];

async function main() {
  console.log("Seeding subjects...");
  for (const s of initialSubjects) {
    await prisma.subject.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }
  console.log("Subjects seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

