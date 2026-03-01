'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ShieldCheck, RefreshCw } from 'lucide-react';
import { testConnection } from '@/app/actions';
import { toast } from 'sonner';

export default function ConfiguracionPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [details, setDetails] = useState('');

    const handleTestConnection = async () => {
        setLoading(true);
        setStatus('idle');
        setDetails('');
        try {
            const res = await testConnection();
            if (res.success) {
                setStatus('success');
                toast.success('Conexión con Google Sheets exitosa.');
                setDetails(res.message);
            } else {
                setStatus('error');
                toast.error('Error al conectar con Google Sheets.');
                setDetails(res.message);
            }
        } catch (e: unknown) {
            setStatus('error');
            toast.error('Excepción al conectar con Google Sheets.');
            setDetails(e instanceof Error ? e.message : 'Error desconocido.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">Configuración</h1>
                <p className="text-slate-400">Gestión de credenciales y variables de entorno.</p>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-200">Estado de la Integración (Google Sheets)</CardTitle>
                    <CardDescription className="text-slate-400">
                        Asegúrate de haber configurado las variables de entorno en tu archivo <code className="bg-slate-800 px-1 rounded">.env.local</code> o en tu plataforma de despliegue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="list-disc pl-5 text-sm text-slate-400 space-y-2">
                        <li><code className="text-slate-300 bg-slate-800 px-1 rounded">GOOGLE_SERVICE_ACCOUNT_EMAIL</code></li>
                        <li><code className="text-slate-300 bg-slate-800 px-1 rounded">GOOGLE_PRIVATE_KEY</code></li>
                        <li><code className="text-slate-300 bg-slate-800 px-1 rounded">CANACO_SHEET_ID</code></li>
                        <li><code className="text-slate-300 bg-slate-800 px-1 rounded">SIEM_SHEET_ID</code></li>
                        <li><code className="text-slate-300 bg-slate-800 px-1 rounded">FINANZAS_SHEET_ID</code></li>
                    </ul>

                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <h3 className="text-lg font-medium text-slate-200 mb-4">Probar Conexión</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Realiza una prueba de lectura rápida hacia Google Sheets (Auth Check).
                        </p>
                        <div className="flex items-center gap-4">
                            <Button onClick={handleTestConnection} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white">
                                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                                {loading ? 'Probando...' : 'Test Connection'}
                            </Button>

                            {status === 'success' && (
                                <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-md text-sm">
                                    <ShieldCheck className="w-4 h-4 mr-2" /> Conexión verificada
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="flex items-center text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-md text-sm">
                                    <ShieldAlert className="w-4 h-4 mr-2" /> Error de conexión
                                </div>
                            )}
                        </div>

                        {details && (
                            <div className="mt-4 p-4 bg-slate-950 rounded-md border border-slate-800 text-xs text-slate-400 whitespace-pre-wrap font-mono">
                                {details}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
