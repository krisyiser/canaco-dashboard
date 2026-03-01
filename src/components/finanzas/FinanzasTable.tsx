'use client';

import { MovimientoFinanciero } from '@/types';
import { DataTable } from '@/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FinanzasTableProps {
    data: MovimientoFinanciero[];
}

export function FinanzasTable({ data }: FinanzasTableProps) {
    const formatMoney = (val: string) => {
        const num = parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0;
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);
    };

    const columns: ColumnDef<MovimientoFinanciero>[] = [
        { accessorKey: 'FECHA', header: 'Fecha' },
        {
            accessorKey: 'TIPO_MOVIMIENTO', header: 'Tipo', cell: ({ row }) => {
                const isIngreso = row.getValue('TIPO_MOVIMIENTO') === 'INGRESO';
                return <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", isIngreso ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500")}>{row.getValue('TIPO_MOVIMIENTO')}</span>;
            }
        },
        { accessorKey: 'CONCEPTO', header: 'Concepto' },
        { accessorKey: 'CLASIFICACION_GENERAL', header: 'Clasificación' },
        { accessorKey: 'FORMA_PAGO', header: 'Forma de Pago' },
        {
            accessorKey: 'MONTO', header: 'Monto', cell: ({ row }) => {
                return <span className="font-medium text-slate-200">{formatMoney(row.getValue('MONTO') || '0')}</span>;
            }
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100">Finanzas</h1>
                    <p className="text-slate-400">Control de ingresos y egresos.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/finanzas/nuevo">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Movimiento
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/50">
                <DataTable columns={columns} data={data} searchPlaceholder="Buscar por concepto o tipo..." />
            </div>
        </div>
    );
}
