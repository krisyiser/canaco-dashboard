'use client';

import { Socio } from '@/types';
import { DataTable } from '@/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import Link from 'next/link';

interface SociosTableProps {
    data: Socio[];
    type: 'CANACO' | 'SIEM';
}

export function SociosTable({ data, type }: SociosTableProps) {
    const columns: ColumnDef<Socio>[] = [
        { accessorKey: 'CLAVE_SOCIO', header: 'Clave' },
        { accessorKey: 'NOMBRE_DEL_NEGOCIO', header: 'Negocio' },
        { accessorKey: 'RFC', header: 'RFC' },
        { accessorKey: 'MUNICIPIO', header: 'Municipio' },
        { accessorKey: 'GIRO', header: 'Giro' },
        { accessorKey: 'ESTATUS_SOCIO', header: 'Estatus' },
        { accessorKey: 'FECHA_AFILIACION', header: 'Fecha Afiliación' },
        { accessorKey: 'AÑO', header: 'Año' },
    ];

    const handleExportCSV = () => {
        if (!data.length) return;
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj =>
            Object.values(obj).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Padron_${type}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100">Padrón {type}</h1>
                    <p className="text-slate-400">Directorio completo de afiliados {type}.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" onClick={handleExportCSV} className="text-slate-200 border-slate-700 hover:bg-slate-800 w-full sm:w-auto">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar CSV
                    </Button>
                    <Link href={`/socios/${type.toLowerCase()}/nuevo`} className="w-full sm:w-auto block">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Socio {type}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/50">
                <DataTable columns={columns} data={data} searchPlaceholder="Buscar socios..." />
            </div>
        </div>
    );
}
