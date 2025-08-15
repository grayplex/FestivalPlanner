// src/app/(public)/festivals/[slug]/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function toggleSetInPlan(festivalSlug: string, setId: string) {
    const session = await getServerSession();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const festival = await prisma.festival.findUnique({ where: { slug: festivalSlug } });
    if (!user || !festival) throw new Error("Invalid");

    let plan = await prisma.plan.findFirst({ where: { userId: user.id, festivalId: festival.id } });
    if (!plan) plan = await prisma.plan.create({ data: { userId: user.id, festivalId: festival.id, name: "My Plan" } });

    const existing = await prisma.planItem.findFirst({ where: { planId: plan.id, setId } });

    if (existing) {
        await prisma.planItem.delete({ where: { id: existing.id } });
    } else {
        await prisma.planItem.create({ data: { planId: plan.id, setId } });
    }

    revalidatePath(`/my/${festivalSlug}`);
    revalidatePath(`/festivals/${festivalSlug}`);
}
