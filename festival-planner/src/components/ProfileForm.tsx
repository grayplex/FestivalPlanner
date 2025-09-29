"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    username: string | null;
    bio: string | null;
    location: string | null;
    isPublic: boolean;
}

interface ProfileFormProps {
    user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        isPublic: user.isPublic
    });

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            username: user.username || '',
            bio: user.bio || '',
            location: user.location || '',
            isPublic: user.isPublic
        });
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Profile Settings</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Choose a unique username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="City, Country"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                            className="mr-2"
                        />
                        <label htmlFor="isPublic" className="text-sm text-gray-700">
                            Make my profile public (allow others to find and add me)
                        </label>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-3">
                    <div>
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900">{user.email}</p>
                    </div>
                    
                    {user.username && (
                        <div>
                            <span className="text-sm font-medium text-gray-700">Username:</span>
                            <p className="text-gray-900">@{user.username}</p>
                        </div>
                    )}
                    
                    {user.bio && (
                        <div>
                            <span className="text-sm font-medium text-gray-700">Bio:</span>
                            <p className="text-gray-900">{user.bio}</p>
                        </div>
                    )}
                    
                    {user.location && (
                        <div>
                            <span className="text-sm font-medium text-gray-700">Location:</span>
                            <p className="text-gray-900">{user.location}</p>
                        </div>
                    )}
                    
                    <div>
                        <span className="text-sm font-medium text-gray-700">Profile Visibility:</span>
                        <p className="text-gray-900">
                            {user.isPublic ? 'Public' : 'Private'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}