import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateProfileSchema = z.object({
    username: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens").optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
    isPublic: z.boolean().optional()
});

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const validatedData = UpdateProfileSchema.parse(body);

        // Check if username is taken (if provided and different from current)
        if (validatedData.username && validatedData.username !== user.username) {
            const existingUser = await prisma.user.findUnique({
                where: { username: validatedData.username }
            });
            
            if (existingUser) {
                return NextResponse.json({ error: "Username already taken" }, { status: 400 });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...validatedData,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ 
            message: "Profile updated successfully",
            user: updatedUser 
        });

    } catch (error) {
        console.error("Profile update error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to update profile" 
        }, { status: 500 });
    }
}