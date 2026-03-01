import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
}

export function KpiCard({ title, value, icon: Icon, description, trend, className }: KpiCardProps) {
    return (
        <Card className={cn("bg-slate-900 border-slate-800", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight text-slate-50">{value}</div>
                {description && (
                    <p className={cn(
                        "text-xs mt-1",
                        trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-rose-500" : "text-slate-500"
                    )}>
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
