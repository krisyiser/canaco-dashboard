'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, User, Lock } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await login(formData);

        if (res?.error) {
            toast.error(res.error);
            setLoading(false);
        } else if (res?.success) {
            toast.success(`Bienvenido(a)`);
            if (res.role === 'oficina') router.push('/socios/canaco');
            else router.push('/');
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 relative overflow-hidden w-full m-0 !ml-0 border-none">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px]" />
                <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-xl z-10 p-8 flex flex-col items-center">
                <div className="mb-6 flex flex-col items-center">
                    <img src="/canaco.png" alt="CANACO" className="h-28 w-auto mb-4 object-contain filter drop-shadow-lg" />
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Iniciar Sesión</h1>
                    <p className="text-sm text-slate-400 text-center">Ingresa tus credenciales para acceder al dashboard empresarial.</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Usuario</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                name="usuario"
                                placeholder="Ej: presidente"
                                className="bg-slate-950 border-slate-800 pl-10 text-slate-200 focus-visible:ring-amber-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400 ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-slate-950 border-slate-800 pl-10 text-slate-200 focus-visible:ring-amber-500"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-4 font-medium transition-colors">
                        {loading ? 'Verificando...' : 'Acceder'}
                    </Button>
                </form>

                <div className="mt-8 flex items-center justify-center text-xs text-slate-500 bg-slate-950/50 py-2 px-4 rounded-full border border-slate-800/50">
                    <Shield className="w-3 h-3 mr-2 text-amber-500" />
                    Acceso seguro
                </div>
            </div>
        </div>
    );
}
