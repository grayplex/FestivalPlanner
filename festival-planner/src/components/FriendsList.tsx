"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    username: string | null;
    image: string | null;
}

interface FriendRequest {
    id: string;
    requester: User;
}

interface FriendsListProps {
    friends: User[];
    pendingRequests: FriendRequest[];
    currentUserId: string;
}

export function FriendsList({ friends, pendingRequests, currentUserId }: FriendsListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const router = useRouter();

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const users = await response.json();
                // Filter out current user and existing friends
                const filteredUsers = users.filter((user: User) => 
                    user.id !== currentUserId && 
                    !friends.some(friend => friend.id === user.id)
                );
                setSearchResults(filteredUsers);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSendFriendRequest = async (userId: string) => {
        try {
            const response = await fetch('/api/friends/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                alert('Friend request sent!');
                setSearchResults(prev => prev.filter(user => user.id !== userId));
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to send friend request');
            }
        } catch (error) {
            console.error('Failed to send friend request:', error);
            alert('Failed to send friend request');
        }
    };

    const handleFriendRequest = async (requestId: string, action: 'accept' | 'decline') => {
        try {
            const response = await fetch('/api/friends/respond', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requestId, action })
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to respond to friend request');
            }
        } catch (error) {
            console.error('Failed to respond to friend request:', error);
            alert('Failed to respond to friend request');
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        if (!confirm('Are you sure you want to remove this friend?')) return;

        try {
            const response = await fetch('/api/friends/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendId })
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to remove friend');
            }
        } catch (error) {
            console.error('Failed to remove friend:', error);
            alert('Failed to remove friend');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                    Friends ({friends.length})
                </h2>
                <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    {showSearch ? 'Cancel' : 'Add Friends'}
                </button>
            </div>

            {/* Pending Friend Requests */}
            {pendingRequests.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-700 mb-3">
                        Pending Requests ({pendingRequests.length})
                    </h3>
                    <div className="space-y-2">
                        {pendingRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    {request.requester.image ? (
                                        <img 
                                            src={request.requester.image} 
                                            alt={request.requester.name || 'User'} 
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-xs font-medium text-gray-600">
                                                {request.requester.name?.[0] || '?'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-sm">
                                            {request.requester.name || 'Anonymous User'}
                                        </p>
                                        {request.requester.username && (
                                            <p className="text-xs text-gray-600">
                                                @{request.requester.username}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleFriendRequest(request.id, 'accept')}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleFriendRequest(request.id, 'decline')}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Friend Search */}
            {showSearch && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex space-x-2 mb-3">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by username or email..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearching || !searchQuery.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                    
                    {searchResults.length > 0 && (
                        <div className="space-y-2">
                            {searchResults.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                    <div className="flex items-center space-x-3">
                                        {user.image ? (
                                            <img 
                                                src={user.image} 
                                                alt={user.name || 'User'} 
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-xs font-medium text-gray-600">
                                                    {user.name?.[0] || '?'}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">
                                                {user.name || 'Anonymous User'}
                                            </p>
                                            {user.username && (
                                                <p className="text-xs text-gray-600">
                                                    @{user.username}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSendFriendRequest(user.id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                    >
                                        Add Friend
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {searchQuery && searchResults.length === 0 && !isSearching && (
                        <p className="text-gray-500 text-sm">No users found</p>
                    )}
                </div>
            )}

            {/* Friends List */}
            {friends.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No friends yet</p>
                    <p className="text-sm text-gray-400">
                        Add friends to share your festival plans and discover new music together!
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {friends.map((friend) => (
                        <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {friend.image ? (
                                    <img 
                                        src={friend.image} 
                                        alt={friend.name || 'Friend'} 
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">
                                            {friend.name?.[0] || '?'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">
                                        {friend.name || 'Anonymous User'}
                                    </p>
                                    {friend.username && (
                                        <p className="text-sm text-gray-600">
                                            @{friend.username}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => window.location.href = `/profile/${friend.username || friend.id}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    View Profile
                                </button>
                                <button
                                    onClick={() => handleRemoveFriend(friend.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}