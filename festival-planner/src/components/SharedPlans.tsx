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

interface User {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
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
    user: User;
}

interface SharedPlan {
    id: string;
    permission: string; // 'view' or 'edit'
    createdAt: string;
    plan: Plan;
}

interface SharedPlansProps {
    sharedPlans: SharedPlan[];
}

export function SharedPlans({ sharedPlans }: SharedPlansProps) {
    const [shareCode, setShareCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const router = useRouter();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleJoinPlanByCode = async () => {
        if (!shareCode.trim()) return;

        setIsJoining(true);
        try {
            const response = await fetch('/api/plans/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ shareCode })
            });

            if (response.ok) {
                alert('Successfully joined plan!');
                setShareCode("");
                router.refresh();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to join plan');
            }
        } catch (error) {
            console.error('Failed to join plan:', error);
            alert('Failed to join plan');
        } finally {
            setIsJoining(false);
        }
    };

    const handleLeavePlan = async (shareId: string, planName: string) => {
        if (!confirm(`Are you sure you want to leave "${planName || 'this plan'}"?`)) return;

        try {
            const response = await fetch(`/api/plans/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ shareId })
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to leave plan');
            }
        } catch (error) {
            console.error('Failed to leave plan:', error);
            alert('Failed to leave plan');
        }
    };

    const copyPlanToMyPlans = async (originalPlanId: string, festivalId: string) => {
        try {
            const response = await fetch('/api/plans/copy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    originalPlanId,
                    festivalId
                })
            });

            if (response.ok) {
                alert('Plan copied to your plans!');
                router.refresh();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to copy plan');
            }
        } catch (error) {
            console.error('Failed to copy plan:', error);
            alert('Failed to copy plan');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                    Shared With Me ({sharedPlans.length})
                </h2>
            </div>

            {/* Join Plan by Code */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-3">Join a Plan</h3>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={shareCode}
                        onChange={(e) => setShareCode(e.target.value)}
                        placeholder="Enter share code..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleJoinPlanByCode()}
                    />
                    <button
                        onClick={handleJoinPlanByCode}
                        disabled={isJoining || !shareCode.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isJoining ? 'Joining...' : 'Join Plan'}
                    </button>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                    Ask your friends for their plan share code to view their festival schedules
                </p>
            </div>

            {sharedPlans.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No shared plans yet</p>
                    <p className="text-sm text-gray-400">
                        When friends share their festival plans with you, they&apos;ll appear here
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sharedPlans.map((sharedPlan) => (
                        <div key={sharedPlan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="font-semibold text-lg">
                                            {sharedPlan.plan.festival.name}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            sharedPlan.permission === 'edit' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {sharedPlan.permission === 'edit' ? 'Can Edit' : 'View Only'}
                                        </span>
                                        {sharedPlan.plan.isPublic && (
                                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                                Public
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {sharedPlan.plan.name || 'Untitled Plan'}
                                    </p>
                                    {sharedPlan.plan.description && (
                                        <p className="text-sm text-gray-500 mb-2">
                                            {sharedPlan.plan.description}
                                        </p>
                                    )}
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                                        <span>
                                            {formatDate(sharedPlan.plan.festival.startDate)} - {formatDate(sharedPlan.plan.festival.endDate)}
                                        </span>
                                        {sharedPlan.plan.festival.location && (
                                            <span>{sharedPlan.plan.festival.location}</span>
                                        )}
                                        <span>{sharedPlan.plan.items.length} artists</span>
                                    </div>
                                    
                                    {/* Plan Owner */}
                                    <div className="flex items-center space-x-2">
                                        {sharedPlan.plan.user.image ? (
                                            <img 
                                                src={sharedPlan.plan.user.image} 
                                                alt={sharedPlan.plan.user.name || 'User'} 
                                                className="w-6 h-6 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-xs font-medium text-gray-600">
                                                    {sharedPlan.plan.user.name?.[0] || '?'}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-600">
                                            Shared by {sharedPlan.plan.user.name || sharedPlan.plan.user.username || 'Anonymous'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col space-y-2 ml-4">
                                    <Link
                                        href={`/shared/${sharedPlan.plan.shareCode || sharedPlan.plan.id}`}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 text-center"
                                    >
                                        View Plan
                                    </Link>
                                    <button
                                        onClick={() => copyPlanToMyPlans(sharedPlan.plan.id, sharedPlan.plan.festival.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                        Copy to My Plans
                                    </button>
                                    <button
                                        onClick={() => handleLeavePlan(sharedPlan.id, sharedPlan.plan.name)}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                        Leave Plan
                                    </button>
                                </div>
                            </div>

                            {/* Plan Stats */}
                            <div className="grid grid-cols-4 gap-4 mb-3 pt-3 border-t">
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-blue-600">
                                        {sharedPlan.plan.items.length}
                                    </div>
                                    <div className="text-xs text-gray-500">Artists</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-green-600">
                                        {new Set(sharedPlan.plan.items.map(item => item.set.stage.name)).size}
                                    </div>
                                    <div className="text-xs text-gray-500">Stages</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-purple-600">
                                        {new Set(sharedPlan.plan.items.map(item => 
                                            new Date(item.set.startTime).toDateString()
                                        )).size}
                                    </div>
                                    <div className="text-xs text-gray-500">Days</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-orange-600">
                                        {formatDate(sharedPlan.createdAt)}
                                    </div>
                                    <div className="text-xs text-gray-500">Shared</div>
                                </div>
                            </div>

                            {/* Recent Artists Preview */}
                            {sharedPlan.plan.items.length > 0 && (
                                <div className="border-t pt-3">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Featured Artists:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {sharedPlan.plan.items.slice(0, 6).map((item, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                {item.set.artist}
                                            </span>
                                        ))}
                                        {sharedPlan.plan.items.length > 6 && (
                                            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                                                +{sharedPlan.plan.items.length - 6} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}