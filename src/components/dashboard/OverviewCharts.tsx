'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OverviewChartsProps {
    financeData: { name: string; ingresos: number; egresos: number }[];
    affiliateData: { name: string; CANACO: number; SIEM: number }[];
}

export function OverviewCharts({ financeData, affiliateData }: OverviewChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Ingresos vs Egresos */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-200">Ingresos vs Egresos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full mt-4 min-h-[300px] min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={financeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tickMargin={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="ingresos"
                                    name="Ingresos"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#10b981' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="egresos"
                                    name="Egresos"
                                    stroke="#f43f5e"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#f43f5e' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Altas CANACO vs SIEM */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-200">Altas Mensuales por Padrón</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full mt-4 min-h-[300px] min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={affiliateData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tickMargin={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    cursor={{ fill: '#1e293b' }}
                                />
                                <Legend />
                                <Bar dataKey="CANACO" name="CANACO" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="SIEM" name="SIEM" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
