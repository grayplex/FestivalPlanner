import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const FriendRequestSchema = z.object({
    userId: z.string().min(1)
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
        const { userId } = FriendRequestSchema.parse(body);

        // Check if target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!targetUser) {
            return NextResponse.json({ error: "Target user not found" }, { status: 404 });
        }

        // Check if friendship already exists
        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: currentUser.id, addresseeId: userId },
                    { requesterId: userId, addresseeId: currentUser.id }
                ]
            }
        });

        if (existingFriendship) {
            return NextResponse.json({ 
                error: "Friendship request already exists or you're already friends" 
            }, { status: 400 });
        }

        // Create friend request
        const friendship = await prisma.friendship.create({
            data: {
                requesterId: currentUser.id,
                addresseeId: userId,
                status: 'pending'
            }
        });

        // Create notification for the target user
        await prisma.activity.create({
            data: {
                userId: userId,
                type: 'friend_request',
                data: {
                    requesterId: currentUser.id,
                    requesterName: currentUser.name,
                    requesterUsername: currentUser.username
                }
            }
        });

        return NextResponse.json({ 
            message: "Friend request sent successfully",
            friendship 
        });

    } catch (error) {
        console.error("Friend request error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to send friend request" 
        }, { status: 500 });
    }
}