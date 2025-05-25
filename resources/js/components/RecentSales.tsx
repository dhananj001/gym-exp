
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@inertiajs/react';

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
    membership_fee: string;
    created_at: string;
}

interface RecentSalesProps {
    members: Member[];
}

const RecentSales: React.FC<RecentSalesProps> = ({ members }) => {
    return (
        <div className="space-y-6">
            {members.map((member) => (
                <Link key={member.id} href={`/members/${member.id}`} className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${member.name}`} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.email || 'N/A'}</p>
                    </div>
                    <div className="ml-auto font-medium text-gray-900 dark:text-gray-100">₹{member.membership_fee}</div>
                </Link>
            ))}
        </div>
    );
};

export default RecentSales;
