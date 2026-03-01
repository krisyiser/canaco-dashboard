import { fetchFinanzas } from '@/app/actions';
import { FinanzasTable } from '@/components/finanzas/FinanzasTable';
import { MovimientoFinanciero } from '@/types';

export const revalidate = 60;

export default async function FinanzasPage() {
    let data: MovimientoFinanciero[] = [];
    try {
        data = await fetchFinanzas();
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="max-w-7xl mx-auto">
            <FinanzasTable data={data} />
        </div>
    );
}
