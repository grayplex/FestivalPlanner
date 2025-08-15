import { prisma } from "@/lib/prisma";
import data from "./initial-festival.json"; // transform your Festival.html arrays into this JSON

async function main() {
    const festival = await prisma.festival.upsert({
        where: { slug: data.slug },
        update: {},
        create: {
            name: data.name,
            slug: data.slug,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            location: data.location,
            city: "Vancouver", // Add appropriate city
            country: "Canada", // Add appropriate country
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop", // Add a festival image
        }
    });

    // Clear existing stages for this festival to avoid duplicates
    await prisma.set.deleteMany({ where: { festivalId: festival.id } });
    await prisma.stage.deleteMany({ where: { festivalId: festival.id } });

    const stageMap = new Map<string, string>();
    for (const s of data.stages) {
        const stage = await prisma.stage.create({ data: { name: s, festivalId: festival.id } });
        stageMap.set(s, stage.id);
    }

    for (const set of data.sets) {
        const start = new Date(`${set.date}T${set.startTime}:00`);
        const end = new Date(`${set.date}T${set.endTime === "00:00" ? "23:59" : set.endTime}:00`);
        await prisma.set.create({
            data: {
                artist: set.name,
                date: new Date(`${set.date}T00:00:00`),
                startTime: start,
                endTime: end,
                stageId: stageMap.get(set.stage)!,
                festivalId: festival.id
            }
        });
    }

    console.log(`✅ Seeded festival: ${festival.name}`);
    console.log(`📍 Location: ${festival.location}`);
    console.log(`🎵 Stages: ${data.stages.length}`);
    console.log(`🎭 Sets: ${data.sets.length}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });