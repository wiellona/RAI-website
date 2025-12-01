"use client";

import { User, UserRole } from "@/lib/types";

interface UserManagementProps {
    users: User[];
    onUpdateRole: (id: string, role: UserRole) => void;
}

export default function UserManagement({ users, onUpdateRole }: UserManagementProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">Manage user roles (admin, reviewer, etc.) - Only showing approved users.</p>
            <div className="space-y-3">
            {users.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <select 
                        defaultValue={user.role} 
                        onChange={(e) => onUpdateRole(user.id, e.target.value as UserRole)}
                        className="border border-gray-300 rounded p-1"
                    >
                        <option value="user">User</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            ))}
            </div>
        </div>
    );
}
