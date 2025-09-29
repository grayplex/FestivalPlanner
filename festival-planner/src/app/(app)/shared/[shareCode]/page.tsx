import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: { shareCode: string } };

export default async function SharedPlanPage({ params }: Props) {
    const session = await getServerSession();
    const { shareCode } = params;

    // Find the plan by share code
    const plan = await prisma.plan.findFirst({
        where: {
            OR: [
                { shareCode }, // Public share code
                { id: shareCode } // Direct plan ID (for backwards compatibility)
            ]
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            },
            festival: true,
            items: {
                include: {
                    set: {
                        include: {
                            stage: true
                        }
                    }
                },
                orderBy: {
                    set: {
                        startTime: 'asc'
                    }
                }
            },
            shares: {
                include: {
                    sharedWithUser: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                }
            }
        }
    });

    if (!plan) {
        notFound();
    }

    // Check access permissions
    let hasAccess = false;
    let canEdit = false;
    let currentUserId: string | null = null;

    if (session?.user?.email) {
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });
        currentUserId = currentUser?.id || null;

        if (currentUserId) {
            // Owner has full access
            if (plan.userId === currentUserId) {
                hasAccess = true;
                canEdit = true;
            } else {
                // Check if plan is shared with user
                const userShare = plan.shares.find(share => share.sharedWithUserId === currentUserId);
                if (userShare) {
                    hasAccess = true;
                    canEdit = userShare.permission === 'edit';
                } else if (plan.isPublic) {
                    hasAccess = true;
                    canEdit = false;
                }
            }
        }
    } else if (plan.isPublic) {
        hasAccess = true;
        canEdit = false;
    }

    if (!hasAccess) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Access Denied
                </h1>
                <p className="text-gray-600 mb-6">
                    This plan is private and you don't have permission to view it.
                </p>
                {!session && (
                    <Link
                        href="/api/auth/signin"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Sign In to Access
                    </Link>
                )}
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Group items by day
    const itemsByDay = plan.items.reduce((acc, item) => {
        const day = formatDate(item.set.date);
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
    }, {} as Record<string, typeof plan.items>);

    return (
        <main className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-bold">
                                {plan.festival.name}
                            </h1>
                            {plan.isPublic && (
                                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                                    Public
                                </span>
                            )}
                            {canEdit && (
                                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                    Can Edit
                                </span>
                            )}
                        </div>
                        
                        <h2 className="text-xl text-gray-700 mb-2">
                            {plan.name || 'Untitled Plan'}
                        </h2>
                        
                        {plan.description && (
                            <p className="text-gray-600 mb-3">
                                {plan.description}
                            </p>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                                {formatDate(plan.festival.startDate)} - {formatDate(plan.festival.endDate)}
                            </span>
                            {plan.festival.location && (
                                <span>{plan.festival.location}</span>
                            )}
                            <span>{plan.items.length} artists</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                        {/* Plan Owner */}
                        <div className="flex items-center space-x-2">
                            {plan.user.image ? (
                                <img 
                                    src={plan.user.image} 
                                    alt={plan.user.name || 'User'} 
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">
                                        {plan.user.name?.[0] || '?'}
                                    </span>
                                </div>
                            )}
                            <span className="text-sm text-gray-600">
                                Created by {plan.user.name || plan.user.username || 'Anonymous'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                            {currentUserId && currentUserId !== plan.userId && (
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await fetch('/api/plans/copy', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    originalPlanId: plan.id,
                                                    festivalId: plan.festival.id
                                                })
                                            });
                                            
                                            if (response.ok) {
                                                alert('Plan copied to your plans!');
                                            } else {
                                                const error = await response.json();
                                                alert(error.message || 'Failed to copy plan');
                                            }
                                        } catch (error) {
                                            alert('Failed to copy plan');
                                        }
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                >
                                    Copy to My Plans
                                </button>
                            )}
                            
                            {canEdit && (
                                <Link
                                    href={`/my/${plan.festival.slug}`}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Edit Plan
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{plan.items.length}</div>
                    <div className="text-sm opacity-90">Artists</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                        {new Set(plan.items.map(item => item.set.stage.name)).size}
                    </div>
                    <div className="text-sm opacity-90">Stages</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                        {Object.keys(itemsByDay).length}
                    </div>
                    <div className="text-sm opacity-90">Days</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{plan.shares.length}</div>
                    <div className="text-sm opacity-90">Shared With</div>
                </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-6">Schedule</h3>
                
                {plan.items.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No artists in this plan yet</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(itemsByDay).map(([day, dayItems]) => (
                            <div key={day}>
                                <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
                                    {day}
                                </h4>
                                <div className="grid gap-3">
                                    {dayItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h5 className="font-semibold text-lg">
                                                    {item.set.artist}
                                                </h5>
                                                <p className="text-gray-600">
                                                    {item.set.stage.name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {formatTime(item.set.startTime)} - {formatTime(item.set.endTime)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Shared With */}
            {plan.shares.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-4">Shared With</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {plan.shares.map((share) => (
                            <div key={share.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {share.sharedWithUser.name?.[0] || '?'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">
                                        {share.sharedWithUser.name || share.sharedWithUser.username || 'Anonymous'}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {share.permission === 'edit' ? 'Can edit' : 'View only'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}