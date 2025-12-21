"use client";

import { User, UserRole } from "@/lib/types";

interface UserManagementProps {
    users: User[];
    onUpdateRole: (id: string, role: UserRole) => void;
}

export default function UserManagement({ users, onUpdateRole }: UserManagementProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#0047AB]/20">
            <h2 className="text-2xl font-semibold mb-4 text-[#000080]">User Management</h2>
            <p className="text-gray-600 mb-4">Manage user roles (admin, reviewer, etc.) - Only showing approved users.</p>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-[#f0f4ff] transition-colors">
                    <div>
                        <p className="font-semibold text-[#000080]">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30 rounded font-semibold capitalize">
                        {user.role}
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}
