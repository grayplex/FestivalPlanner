import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdatePlanSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    isPublic: z.boolean().optional()
});

export async function PATCH(
    req: Request,
    { params }: { params: { planId: string } }
) {
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

        const { planId } = params;
        const body = await req.json();
        const validatedData = UpdatePlanSchema.parse(body);

        // Check if plan exists and belongs to current user
        const plan = await prisma.plan.findFirst({
            where: {
                id: planId,
                userId: currentUser.id
            }
        });

        if (!plan) {
            return NextResponse.json({ error: "Plan not found or access denied" }, { status: 404 });
        }

        // Generate share code if making public and doesn't have one
        const updateData: any = { ...validatedData };
        if (validatedData.isPublic && !plan.shareCode) {
            updateData.shareCode = generateShareCode();
        }

        const updatedPlan = await prisma.plan.update({
            where: { id: planId },
            data: {
                ...updateData,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ 
            message: "Plan updated successfully",
            plan: updatedPlan 
        });

    } catch (error) {
        console.error("Update plan error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to update plan" 
        }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { planId: string } }
) {
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

        const { planId } = params;

        // Check if plan exists and belongs to current user
        const plan = await prisma.plan.findFirst({
            where: {
                id: planId,
                userId: currentUser.id
            }
        });

        if (!plan) {
            return NextResponse.json({ error: "Plan not found or access denied" }, { status: 404 });
        }

        // Delete plan (cascade will handle plan items and shares)
        await prisma.plan.delete({
            where: { id: planId }
        });

        return NextResponse.json({ 
            message: "Plan deleted successfully" 
        });

    } catch (error) {
        console.error("Delete plan error:", error);
        return NextResponse.json({ 
            error: "Failed to delete plan" 
        }, { status: 500 });
    }
}

// Helper function to generate share codes
function generateShareCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const { planId, email, permission } = SharePlanSchema.parse(body);

        // Check if plan exists and belongs to current user
        const plan = await prisma.plan.findFirst({
            where: {
                id: planId,
                userId: currentUser.id
            }
        });

        if (!plan) {
            return NextResponse.json({ error: "Plan not found or access denied" }, { status: 404 });
        }

        // Find target user
        const targetUser = await prisma.user.findUnique({
            where: { email }
        });

        if (!targetUser) {
            return NextResponse.json({ error: "User with this email not found" }, { status: 404 });
        }

        // Check if plan is already shared with this user
        const existingShare = await prisma.planShare.findFirst({
            where: {
                planId,
                sharedWithUserId: targetUser.id
            }
        });

        if (existingShare) {
            return NextResponse.json({ error: "Plan already shared with this user" }, { status: 400 });
        }

        // Create plan share
        const planShare = await prisma.planShare.create({
            data: {
                planId,
                sharedWithUserId: targetUser.id,
                sharedByUserId: currentUser.id,
                permission
            }
        });

        // Create notification
        await prisma.activity.create({
            data: {
                userId: targetUser.id,
                type: 'plan_shared',
                data: {
                    planId,
                    planName: plan.name,
                    sharedByName: currentUser.name,
                    sharedByUsername: currentUser.username,
                    permission
                }
            }
        });

        return NextResponse.json({ 
            message: "Plan shared successfully",
            planShare 
        });

    } catch (error) {
        console.error("Plan share error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to share plan" 
        }, { status: 500 });
    }
}