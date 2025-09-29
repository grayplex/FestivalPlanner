import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Search for users by username or email
        // Only return public profiles or exact email matches
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: currentUser.id } }, // Exclude current user
                    {
                        OR: [
                            {
                                AND: [
                                    { isPublic: true },
                                    {
                                        OR: [
                                            { username: { contains: query, mode: 'insensitive' } },
                                            { name: { contains: query, mode: 'insensitive' } }
                                        ]
                                    }
                                ]
                            },
                            { email: { equals: query, mode: 'insensitive' } } // Exact email match
                        ]
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                image: true,
                isPublic: true
            },
            take: 20 // Limit results
        });

        return NextResponse.json(users);

    } catch (error) {
        console.error("User search error:", error);
        return NextResponse.json({ 
            error: "Failed to search users" 
        }, { status: 500 });
    }
}