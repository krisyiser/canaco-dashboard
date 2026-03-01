import { SocioForm } from '@/components/socios/SocioForm';

export default function NuevoCanacoPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">Nuevo Socio CANACO</h1>
                <p className="text-slate-400">Registra un nuevo integrante al padrón CANACO.</p>
            </div>
            <SocioForm type="CANACO" />
        </div>
    );
}
