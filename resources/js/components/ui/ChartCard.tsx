import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartCardProps {
  title: string;
  isLoading: boolean;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, isLoading, children }) => {
  return (
    <Card className="bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle className="text-gray-700 dark:text-zinc-200 text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-md" />
        ) : (
          <div className="h-[300px]">{children}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
