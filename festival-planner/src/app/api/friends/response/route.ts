import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RespondRequestSchema = z.object({
    requestId: z.string().min(1),
    action: z.enum(['accept', 'decline'])
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
        const { requestId, action } = RespondRequestSchema.parse(body);

        // Find the friend request
        const friendship = await prisma.friendship.findFirst({
            where: {
                id: requestId,
                addresseeId: currentUser.id,
                status: 'pending'
            },
            include: {
                requester: true
            }
        });

        if (!friendship) {
            return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
        }

        // Update friendship status
        const updatedFriendship = await prisma.friendship.update({
            where: { id: requestId },
            data: { 
                status: action === 'accept' ? 'accepted' : 'declined',
                updatedAt: new Date()
            }
        });

        // Create notification for the requester
        await prisma.activity.create({
            data: {
                userId: friendship.requesterId,
                type: action === 'accept' ? 'friend_request_accepted' : 'friend_request_declined',
                data: {
                    addresseeId: currentUser.id,
                    addresseeName: currentUser.name,
                    addresseeUsername: currentUser.username
                }
            }
        });

        return NextResponse.json({ 
            message: `Friend request ${action}ed successfully`,
            friendship: updatedFriendship 
        });

    } catch (error) {
        console.error("Friend response error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: "Failed to respond to friend request" 
        }, { status: 500 });
    }
}