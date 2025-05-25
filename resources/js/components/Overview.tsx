import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartDataPoint {
    month: string;
    members: number;
}

interface OverviewProps {
    chartData: ChartDataPoint[];
}

const Overview: React.FC<OverviewProps> = ({ chartData }) => {
    const data = {
        labels: chartData.map((d) => d.month),
        datasets: [
            {
                label: 'New Members',
                data: chartData.map((d) => d.members),
                backgroundColor: 'rgba(79, 70, 229, 0.5)', // Indigo shade
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#111827', // Gray-900
                    font: { size: 12 },
                },
            },
            title: {
                display: true,
                text: 'New Members (Last 6 Months)',
                color: '#111827',
                font: { size: 16 },
            },
        },
        scales: {
            x: {
                ticks: { color: '#111827' },
                grid: { display: false },
            },
            y: {
                ticks: { color: '#111827' },
                grid: { color: '#e5e7eb' },
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default Overview;
