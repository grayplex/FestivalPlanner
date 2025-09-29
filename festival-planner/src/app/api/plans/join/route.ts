import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const JoinPlanSchema = z.object({
    shareCode: z.string().min(1)
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const { shareCode } = JoinPlanSchema.parse(body);

        // Find plan by share code
        const plan = await prisma.plan.findFirst({
            where: {
                shareCode,
                isPublic: true
            },
            include: {
                user: true
            }
        });

        if (!plan) {
            return NextResponse.json({ error: "Invalid share code or plan not public" }, { status: 404 });
        }

        // Check if user is trying to join their own plan
        if (plan.userId === currentUser.id) {
            return NextResponse.json({ error: "Cannot join your own plan" }, { status: 400 });
        }

        // Check if already joined
        const existingShare = await prisma.planShare.findFirst({
            where: {
                planId: plan.id,
                sharedWithUserId: currentUser.id
            }
        });

        if (existingShare) {
            return NextResponse.json({ error: "You already have access to this plan" }, { status: 400 });
        }

        // Create plan share
        const planShare = await prisma.planShare.create({
            data: {
                planId: plan.id,
                sharedWithUserId: currentUser.id,
                sharedByUserId: plan.userId,
                permission: 'view'
            }
        });

        return NextResponse.json({ 
            message: "Successfully joined plan",
            planShare 
        });

    } catch (error) {
        console.error("Join plan error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to join plan" 
        }, { status: 500 });
    }
}
