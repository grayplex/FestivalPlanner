import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const LeavePlanSchema = z.object({
    shareId: z.string().min(1)
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
        const { shareId } = LeavePlanSchema.parse(body);

        // Find the plan share
        const planShare = await prisma.planShare.findFirst({
            where: {
                id: shareId,
                sharedWithUserId: currentUser.id
            }
        });

        if (!planShare) {
            return NextResponse.json({ error: "Plan share not found" }, { status: 404 });
        }

        // Delete the plan share
        await prisma.planShare.delete({
            where: { id: shareId }
        });

        return NextResponse.json({ 
            message: "Successfully left plan" 
        });

    } catch (error) {
        console.error("Leave plan error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to leave plan" 
        }, { status: 500 });
    }
}