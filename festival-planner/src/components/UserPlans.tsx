"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Festival {
    id: string;
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
    location: string | null;
}

interface Set {
    id: string;
    artist: string;
    startTime: string;
    endTime: string;
    stage: {
        name: string;
    };
}

interface PlanItem {
    set: Set;
}

interface PlanShare {
    sharedWithUser: {
        id: string;
        name: string | null;
        username: string | null;
    };
}

interface Plan {
    id: string;
    name: string | null;
    description: string | null;
    isPublic: boolean;
    shareCode: string | null;
    createdAt: string;
    updatedAt: string;
    festival: Festival;
    items: PlanItem[];
    shares: PlanShare[];
}

interface UserPlansProps {
    plans: Plan[];
}

export function UserPlans({ plans }: UserPlansProps) {
    const [showShareModal, setShowShareModal] = useState<string | null>(null);
    const [shareEmail, setShareEmail] = useState("");
    const [isSharing, setIsSharing] = useState(false);
    const router = useRouter();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleSharePlan = async (planId: string) => {
        if (!shareEmail.trim()) return;

        setIsSharing(true);
        try {
            const response = await fetch('/api/plans/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    planId,
                    email: shareEmail,
                    permission: 'view'
                })
            });

            if (response.ok) {
                alert('Plan shared successfully!');
                setShowShareModal(null);
                setShareEmail("");
                router.refresh();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to share plan');
            }
        } catch (error) {
            console.error('Failed to share plan:', error);
            alert('Failed to share plan');
        } finally {
            setIsSharing(false);
        }
    };

    const handleTogglePublic = async (planId: string, isCurrentlyPublic: boolean) => {
        try {
            const response = await fetch(`/api/plans/${planId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isPublic: !isCurrentlyPublic
                })
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to update plan visibility');
            }
        } catch (error) {
            console.error('Failed to update plan:', error);
            alert('Failed to update plan');
        }
    };

    const handleDeletePlan = async (planId: string, planName: string) => {
        if (!confirm(`Are you sure you want to delete "${planName || 'this plan'}"?`)) return;

        try {
            const response = await fetch(`/api/plans/${planId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to delete plan');
            }
        } catch (error) {
            console.error('Failed to delete plan:', error);
            alert('Failed to delete plan');
        }
    };

    const copyShareLink = (planId: string, shareCode: string) => {
        const shareUrl = `${window.location.origin}/shared/${shareCode}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Share link copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy link');
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">My Plans ({plans.length})</h2>
                <Link
                    href="/festivals"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                    Create New Plan
                </Link>
            </div>

            {plans.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No festival plans yet</p>
                    <p className="text-sm text-gray-400 mb-4">
                        Start planning your festival experience!
                    </p>
                    <Link
                        href="/festivals"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Browse Festivals
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {plans.map((plan) => (
                        <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="font-semibold text-lg">
                                            {plan.festival.name}
                                        </h3>
                                        {plan.isPublic && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                Public
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {plan.name || 'My Plan'}
                                    </p>
                                    {plan.description && (
                                        <p className="text-sm text-gray-500 mb-2">
                                            {plan.description}
                                        </p>
                                    )}
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span>
                                            {formatDate(plan.festival.startDate)} - {formatDate(plan.festival.endDate)}
                                        </span>
                                        {plan.festival.location && (
                                            <span>{plan.festival.location}</span>
                                        )}
                                        <span>{plan.items.length} artists</span>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2 ml-4">
                                    <Link
                                        href={`/my/${plan.festival.slug}`}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                        View Plan
                                    </Link>
                                    <button
                                        onClick={() => setShowShareModal(plan.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                        Share
                                    </button>
                                    <button
                                        onClick={() => handleTogglePublic(plan.id, plan.isPublic)}
                                        className={`px-3 py-1 rounded text-sm ${
                                            plan.isPublic 
                                                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                                                : 'bg-gray-600 text-white hover:bg-gray-700'
                                        }`}
                                    >
                                        {plan.isPublic ? 'Make Private' : 'Make Public'}
                                    </button>
                                    <button
                                        onClick={() => handleDeletePlan(plan.id, plan.name)}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Plan Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-3">
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-blue-600">
                                        {plan.items.length}
                                    </div>
                                    <div className="text-xs text-gray-500">Artists</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-green-600">
                                        {new Set(plan.items.map(item => item.set.stage.name)).size}
                                    </div>
                                    <div className="text-xs text-gray-500">Stages</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-purple-600">
                                        {plan.shares.length}
                                    </div>
                                    <div className="text-xs text-gray-500">Shared With</div>
                                </div>
                            </div>

                            {/* Shared With List */}
                            {plan.shares.length > 0 && (
                                <div className="border-t pt-3">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Shared with:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {plan.shares.map((share, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                {share.sharedWithUser.name || share.sharedWithUser.username || 'Anonymous'}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Public Share Link */}
                            {plan.isPublic && plan.shareCode && (
                                <div className="border-t pt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Public share link:</span>
                                        <button
                                            onClick={() => copyShareLink(plan.id, plan.shareCode!)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            Copy Link
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Share Plan</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                                placeholder="friend@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleSharePlan(showShareModal)}
                                disabled={isSharing || !shareEmail.trim()}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSharing ? 'Sharing...' : 'Share Plan'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowShareModal(null);
                                    setShareEmail("");
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}