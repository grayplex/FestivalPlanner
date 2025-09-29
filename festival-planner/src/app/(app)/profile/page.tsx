import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import { FriendsList } from "@/components/FriendsList";
import { SharedPlans } from "@/components/SharedPlans";
import { UserPlans } from "@/components/UserPlans";

export default async function ProfilePage() {
    const session = await getServerSession();
    if (!session?.user?.email) {
        redirect("/api/auth/signin?callbackUrl=/profile");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            plans: {
                include: {
                    festival: true,
                    items: {
                        include: {
                            set: {
                                include: {
                                    stage: true
                                }
                            }
                        }
                    },
                    shares: {
                        include: {
                            sharedWithUser: true
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            },
            sharedPlans: {
                include: {
                    plan: {
                        include: {
                            festival: true,
                            user: true,
                            items: {
                                include: {
                                    set: {
                                        include: {
                                            stage: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            sentFriendRequests: {
                where: {
                    status: 'accepted'
                },
                include: {
                    addressee: true
                }
            },
            receivedFriendRequests: {
                where: {
                    status: 'accepted'
                },
                include: {
                    requester: true
                }
            }
        }
    });

    if (!user) {
        redirect("/api/auth/signin?callbackUrl=/profile");
    }

    // Get pending friend requests
    const pendingRequests = await prisma.friendship.findMany({
        where: {
            addresseeId: user.id,
            status: 'pending'
        },
        include: {
            requester: true
        }
    });

    // Combine friends from both directions
    const friends = [
        ...user.sentFriendRequests.map(f => f.addressee),
        ...user.receivedFriendRequests.map(f => f.requester)
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-4">
                    {user.image && (
                        <img 
                            src={user.image} 
                            alt={user.name || 'Profile'} 
                            className="w-16 h-16 rounded-full"
                        />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">
                            {user.name || 'Anonymous User'}
                        </h1>
                        {user.username && (
                            <p className="text-gray-600">@{user.username}</p>
                        )}
                        {user.location && (
                            <p className="text-gray-500">{user.location}</p>
                        )}
                    </div>
                </div>
                {user.bio && (
                    <p className="mt-4 text-gray-700">{user.bio}</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Settings */}
                <div className="space-y-6">
                    <ProfileForm user={user} />
                    <FriendsList 
                        friends={friends} 
                        pendingRequests={pendingRequests}
                        currentUserId={user.id}
                    />
                </div>

                {/* Right Column - Plans */}
                <div className="lg:col-span-2 space-y-6">
                    <UserPlans plans={user.plans} />
                    <SharedPlans sharedPlans={user.sharedPlans} />
                </div>
            </div>
        </div>
    );
}