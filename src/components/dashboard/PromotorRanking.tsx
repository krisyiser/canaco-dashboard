'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface PromotorRankingProps {
    currentMonthData: { PROMOTOR: string; MONTO: string }[];
    previousMonthData: { PROMOTOR: string; MONTO: string }[];
}

export function PromotorRanking({ currentMonthData, previousMonthData }: PromotorRankingProps) {
    const calculateTotals = (data: { PROMOTOR: string; MONTO: string }[]) => {
        const totals: Record<string, number> = {};
        data.forEach(item => {
            // Filtrar proms vacíos
            const promotor = item.PROMOTOR?.trim() || 'SIN ASIGNAR';
            const monto = parseFloat(item.MONTO.replace(/[^0-9.-]+/g, "")) || 0;
            totals[promotor] = (totals[promotor] || 0) + monto;
        });
        return totals;
    };

    const currentTotals = calculateTotals(currentMonthData);
    const previousTotals = calculateTotals(previousMonthData);

    // Ordenar promotores por los que más vendieron este mes
    const ranking = Object.keys(currentTotals).sort((a, b) => currentTotals[b] - currentTotals[a]);

    const formatMoney = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
                <CardTitle className="text-slate-200">Ranking Promotores (Mes Actual)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {ranking.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">No hay datos suficientes este mes</p>
                    ) : (
                        ranking.map((promotor, index) => {
                            const currentSales = currentTotals[promotor];
                            const previousSales = previousTotals[promotor] || 0;
                            const difference = currentSales - previousSales;
                            const percentChange = previousSales === 0 ? 100 : (difference / previousSales) * 100;

                            const isTop = index === 0;

                            return (
                                <div key={promotor} className="flex items-center justify-between p-3 rounded-lg border border-slate-800/60 bg-slate-950/20 hover:bg-slate-800/40 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isTop ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/50' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-medium text-slate-200 text-sm">{promotor}</h4>
                                            <p className="text-xs text-slate-500">Ventas: {formatMoney(currentSales)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`flex items-center justify-end gap-1 text-xs font-medium ${difference > 0 ? 'text-emerald-500' : difference < 0 ? 'text-rose-500' : 'text-slate-400'
                                            }`}>
                                            {difference > 0 ? <ArrowUpRight className="h-4 w-4" /> : difference < 0 ? <ArrowDownRight className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                                            <span className="tabular-nums">
                                                {previousSales === 0 ? 'N/A' : `${Math.abs(percentChange).toFixed(1)}%`}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-500">vs Mes Pasado</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
