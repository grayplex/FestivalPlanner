import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RemoveFriendSchema = z.object({
    friendId: z.string().min(1)
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
        const { friendId } = RemoveFriendSchema.parse(body);

        // Find the friendship
        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: currentUser.id, addresseeId: friendId },
                    { requesterId: friendId, addresseeId: currentUser.id }
                ],
                status: 'accepted'
            }
        });

        if (!friendship) {
            return NextResponse.json({ error: "Friendship not found" }, { status: 404 });
        }

        // Delete the friendship
        await prisma.friendship.delete({
            where: { id: friendship.id }
        });

        return NextResponse.json({ 
            message: "Friend removed successfully" 
        });

    } catch (error) {
        console.error("Remove friend error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to remove friend" 
        }, { status: 500 });
    }
}