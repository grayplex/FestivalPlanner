// src/app/api/plans/share/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SharePlanSchema = z.object({
    planId: z.string().min(1),
    email: z.string().email(),
    permission: z.enum(['view', 'edit']).default('view')
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
        const { originalPlanId, festivalId } = CopyPlanSchema.parse(body);

        // Check if user has access to the original plan
        const originalPlan = await prisma.plan.findFirst({
            where: {
                id: originalPlanId,
                OR: [
                    { userId: currentUser.id }, // Own plan
                    { 
                        shares: {
                            some: {
                                sharedWithUserId: currentUser.id
                            }
                        }
                    }, // Shared plan
                    { isPublic: true } // Public plan
                ]
            },
            include: {
                items: true
            }
        });

        if (!originalPlan) {
            return NextResponse.json({ error: "Original plan not found or access denied" }, { status: 404 });
        }

        // Check if user already has a plan for this festival
        const existingPlan = await prisma.plan.findFirst({
            where: {
                userId: currentUser.id,
                festivalId
            }
        });

        if (existingPlan) {
            return NextResponse.json({ error: "You already have a plan for this festival" }, { status: 400 });
        }

        // Create new plan
        const newPlan = await prisma.plan.create({
            data: {
                name: `${originalPlan.name || 'Copied Plan'}`,
                description: `Copied from ${originalPlan.name || 'another plan'}`,
                userId: currentUser.id,
                festivalId,
                isPublic: false
            }
        });

        // Copy plan items
        if (originalPlan.items.length > 0) {
            await prisma.planItem.createMany({
                data: originalPlan.items.map(item => ({
                    planId: newPlan.id,
                    setId: item.setId
                }))
            });
        }

        return NextResponse.json({ 
            message: "Plan copied successfully",
            plan: newPlan 
        });

    } catch (error) {
        console.error("Copy plan error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to copy plan" 
        }, { status: 500 });
    }
}