import { KpiCard } from '@/components/dashboard/KpiCard';
import { OverviewCharts } from '@/components/dashboard/OverviewCharts';
import { SectorCharts } from '@/components/dashboard/SectorCharts';
import { PromotorRanking } from '@/components/dashboard/PromotorRanking';
import { fetchSociosCanaco, fetchSociosSiem, fetchFinanzas } from '@/app/actions';
import { Users, Briefcase, PlusCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { MovimientoFinanciero, Socio } from '@/types';

export const revalidate = 60; // Cache de 60 segundos

export default async function Home() {
  let canaco: Socio[] = [];
  let siem: Socio[] = [];
  let finanzas: MovimientoFinanciero[] = [];

  try {
    canaco = await fetchSociosCanaco();
  } catch (e) {
    console.warn("Fallo lectura CANACO", e);
  }

  try {
    siem = await fetchSociosSiem();
  } catch (e) {
    console.warn("Fallo lectura SIEM", e);
  }

  try {
    finanzas = await fetchFinanzas();
  } catch (e) {
    console.warn("Fallo lectura FINANZAS", e);
  }

  // Cálculos KPIs
  const currentMonth = new Date().getMonth(); // 0-11
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Manejo enero -> diciembre
  const currentYear = new Date().getFullYear().toString();
  const prevYear = currentMonth === 0 ? (new Date().getFullYear() - 1).toString() : currentYear;

  const totalCanaco = canaco.length;
  const totalSiem = siem.length;

  const isCurrentMonthAndYear = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr.trim());
    if (isNaN(date.getTime())) return false;
    return date.getFullYear().toString() === currentYear && date.getMonth() === currentMonth;
  };

  const isCurrentYearAndMonthIndex = (dateStr: string, monthIndex: number) => {
    if (!dateStr) return false;
    const date = new Date(dateStr.trim());
    if (isNaN(date.getTime())) return false;
    return date.getFullYear().toString() === currentYear && date.getMonth() === monthIndex;
  };

  const isSpecificMonthAndYear = (dateStr: string, monthIndex: number, yearStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr.trim());
    if (isNaN(date.getTime())) return false;
    return date.getFullYear().toString() === yearStr && date.getMonth() === monthIndex;
  };

  const altasCanacoMes = canaco.filter(s => isCurrentMonthAndYear(s.FECHA_AFILIACION)).length;
  const altasSiemMes = siem.filter(s => isCurrentMonthAndYear(s.FECHA_AFILIACION)).length;
  const totalAltas = altasCanacoMes + altasSiemMes;

  let ingresosMes = 0;
  let egresosMes = 0;

  finanzas.forEach(mov => {
    if (isCurrentMonthAndYear(mov.FECHA)) {
      const monto = parseFloat(mov.MONTO.replace(/[^0-9.-]+/g, "")) || 0;
      if (mov.TIPO_MOVIMIENTO?.trim().toUpperCase() === 'INGRESO') {
        ingresosMes += monto;
      } else if (mov.TIPO_MOVIMIENTO?.trim().toUpperCase() === 'EGRESO') {
        egresosMes += monto;
      }
    }
  });

  const balance = ingresosMes - egresosMes;

  // Chart Data format
  // Para las gráficas, agruparemos por mes del año actual.
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const financeData = meses.map((m, i) => {
    let ing = 0; let eg = 0;
    finanzas.forEach(mov => {
      if (isCurrentYearAndMonthIndex(mov.FECHA, i)) {
        const mVal = parseFloat(mov.MONTO.replace(/[^0-9.-]+/g, "")) || 0;
        if (mov.TIPO_MOVIMIENTO?.trim().toUpperCase() === 'INGRESO') ing += mVal;
        else if (mov.TIPO_MOVIMIENTO?.trim().toUpperCase() === 'EGRESO') eg += mVal;
      }
    });
    return { name: m, ingresos: ing, egresos: eg };
  });

  const affiliateData = meses.map((m, i) => {
    const c = canaco.filter(s => isCurrentYearAndMonthIndex(s.FECHA_AFILIACION, i)).length;
    const s = siem.filter(s => isCurrentYearAndMonthIndex(s.FECHA_AFILIACION, i)).length;
    return { name: m, CANACO: c, SIEM: s };
  });

  // Datos para rankings
  const currentMonthPromotoresFunc = (s: Socio) => isCurrentMonthAndYear(s.FECHA_AFILIACION);
  const prevMonthPromotoresFunc = (s: Socio) => isSpecificMonthAndYear(s.FECHA_AFILIACION, prevMonth, prevYear);

  const currentMonthPromotoresData = [...canaco, ...siem]
    .filter(currentMonthPromotoresFunc)
    .map(s => ({ PROMOTOR: s.PROMOTOR, MONTO: s.IMPORTE }));

  const previousMonthPromotoresData = [...canaco, ...siem]
    .filter(prevMonthPromotoresFunc)
    .map(s => ({ PROMOTOR: s.PROMOTOR, MONTO: s.IMPORTE }));

  // Tablas resumidas
  const ultimosMovimientos = [...finanzas].reverse().slice(0, 5);
  const ultimosSocios = [...canaco, ...siem]
    .filter(s => s.FECHA_AFILIACION)
    .sort((a, b) => new Date(b.FECHA_AFILIACION).getTime() - new Date(a.FECHA_AFILIACION).getTime())
    .slice(0, 5);

  const formatMoney = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  const movCols: ColumnDef<MovimientoFinanciero>[] = [
    { accessorKey: 'FECHA', header: 'Fecha' },
    { accessorKey: 'CONCEPTO', header: 'Concepto' },
    { accessorKey: 'TIPO_MOVIMIENTO', header: 'Tipo' },
    { accessorKey: 'MONTO', header: 'Monto' }
  ];

  const socCols: ColumnDef<Socio>[] = [
    { accessorKey: 'NOMBRE_DEL_NEGOCIO', header: 'Negocio' },
    { accessorKey: 'FECHA_AFILIACION', header: 'Fecha' },
    { accessorKey: 'MUNICIPIO', header: 'Municipio' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 break-words">Executive Overview</h1>
          <p className="text-slate-400">Resumen y estado general de la organización.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="Total CANACO" value={totalCanaco} icon={Users} />
        <KpiCard title="Total SIEM" value={totalSiem} icon={Briefcase} />
        <KpiCard
          title="Altas del Mes"
          value={totalAltas}
          icon={PlusCircle}
          trend={totalAltas > 0 ? 'up' : 'neutral'}
          description="CANACO + SIEM"
        />
        <KpiCard
          title="Ingresos"
          value={formatMoney(ingresosMes)}
          icon={TrendingUp}
          trend="up"
        />
        <KpiCard
          title="Egresos"
          value={formatMoney(egresosMes)}
          icon={TrendingDown}
          trend="down"
        />
        <KpiCard
          title="Balance"
          value={formatMoney(balance)}
          icon={DollarSign}
          trend={balance >= 0 ? 'up' : 'down'}
        />
      </div>

      <OverviewCharts financeData={financeData} affiliateData={affiliateData} />

      {/* Nuevas Gráficas de Pastel y Rankings Top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SectorCharts canacoData={canaco} siemData={siem} />
        <PromotorRanking
          currentMonthData={currentMonthPromotoresData}
          previousMonthData={previousMonthPromotoresData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/50">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Últimos Movimientos</h3>
          <DataTable columns={movCols} data={ultimosMovimientos} searchPlaceholder="Buscar movimientos..." />
        </div>
        <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/50">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Nuevos Socios</h3>
          <DataTable columns={socCols} data={ultimosSocios} searchPlaceholder="Buscar socios..." />
        </div>
      </div>
    </div>
  );
}
