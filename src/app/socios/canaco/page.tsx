import { fetchSociosCanaco } from '@/app/actions';
import { SociosTable } from '@/components/socios/SociosTable';
import { Socio } from '@/types';

export const revalidate = 60;

export default async function CanacoPage() {
    let data: Socio[] = [];
    try {
        data = await fetchSociosCanaco();
    } catch (error) {
        console.error(error);
    }

    return <SociosTable data={data} type="CANACO" />;
}
