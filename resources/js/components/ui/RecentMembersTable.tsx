import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Member {
  id: number;
  name: string;
  membership_type: string;
  start_date: string;
  expiry_date: string;
}

interface RecentMembersTableProps {
  members: Member[];
}

const RecentMembersTable: React.FC<RecentMembersTableProps> = ({ members }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">Recent Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableHead className="text-gray-900 dark:text-gray-100">Name</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Membership Type</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Start Date</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell className="text-gray-900 dark:text-gray-100">{member.name}</TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {member.membership_type === '1_month' ? '1 Month' :
                   member.membership_type === '3_months' ? '3 Months' :
                   member.membership_type === '6_months' ? '6 Months' :
                   member.membership_type === '1_year' ? '1 Year' : 'Custom'}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{member.start_date}</TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{member.expiry_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentMembersTable;
