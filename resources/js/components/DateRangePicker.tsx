import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const DateRangePicker: React.FC = () => {
    return (
        <Button variant="outline" className="text-gray-600 dark:text-gray-300">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
        </Button>
    );
};

export default DateRangePicker;
