import { SocioForm } from '@/components/socios/SocioForm';

export default function NuevoSiemPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">Nuevo Socio SIEM</h1>
                <p className="text-slate-400">Registra un nuevo integrante al padrón SIEM.</p>
            </div>
            <SocioForm type="SIEM" />
        </div>
    );
}
