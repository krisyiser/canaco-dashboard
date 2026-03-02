import { fetchSociosSiem } from '@/app/actions';
import { SociosTable } from '@/components/socios/SociosTable';
import { Socio } from '@/types';

export const dynamic = 'force-dynamic';

export default async function SiemPage() {
    let data: Socio[] = [];
    try {
        data = await fetchSociosSiem();
    } catch (error) {
        console.error(error);
    }

    return <SociosTable data={data} type="SIEM" />;
}
