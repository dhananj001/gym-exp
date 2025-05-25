import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <Card className="bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-shadow duration-200 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-300">
          {title}
        </CardTitle>
        <div className={colorClass}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-gray-700 dark:text-zinc-200">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
