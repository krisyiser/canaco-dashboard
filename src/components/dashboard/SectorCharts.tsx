'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Socio {
    GIRO: string;
}

interface SectorChartsProps {
    canacoData: Socio[];
    siemData: Socio[];
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1', '#14b8a6', '#f97316'];

export function SectorCharts({ canacoData, siemData }: SectorChartsProps) {
    const [activeTab, setActiveTab] = useState<'CANACO' | 'SIEM'>('CANACO');

    const processData = (data: Socio[]) => {
        const counts: Record<string, number> = {};
        data.forEach(s => {
            const giro = s.GIRO?.trim() || 'NO ESPECIFICADO';
            counts[giro] = (counts[giro] || 0) + 1;
        });

        const sortedData = Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort highest first

        // Agrupar los restantes en "OTROS" para no saturar la gráfica (Top 6)
        if (sortedData.length > 7) {
            const topSix = sortedData.slice(0, 6);
            const othersCount = sortedData.slice(6).reduce((acc, curr) => acc + curr.value, 0);
            topSix.push({ name: 'OTROS GIROS', value: othersCount });
            return topSix;
        }

        return sortedData;
    };

    const currentData = activeTab === 'CANACO' ? processData(canacoData) : processData(siemData);

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-slate-200">Giros de Negocio</CardTitle>
                <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('CANACO')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'CANACO'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        CANACO
                    </button>
                    <button
                        onClick={() => setActiveTab('SIEM')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'SIEM'
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        SIEM
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4 min-h-[300px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={currentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {currentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.5rem' }}
                                itemStyle={{ color: '#f8fafc' }}
                                formatter={(value: number | undefined, name: string | undefined) => [`${value || 0} negocios`, name || '']}
                            />
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
