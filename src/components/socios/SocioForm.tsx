'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSocioCanaco, createSocioSiem } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const formSchema = z.object({
    CLAVE_SOCIO: z.string().optional(),
    ID_NEGOCIO: z.string().optional(),
    FOLIO: z.string().optional(),
    RFC: z.string().min(1, 'RFC requerido'),
    APELLIDO_PAT: z.string().min(1, 'Apellido Paterno requerido'),
    APELLIDO_MAT: z.string().optional(),
    NOMBRE: z.string().min(1, 'Nombre requerido'),
    NOMBRE_DEL_NEGOCIO: z.string().min(1, 'Nombre del Negocio requerido'),
    GIRO: z.string().min(1, 'Giro requerido'),
    TIPO_DE_AFILIACION: z.string().optional(),
    PROMOTOR: z.string().optional(),
    CALLE: z.string().optional(),
    NUMERO: z.string().optional(),
    COLONIA: z.string().optional(),
    LOCALIDAD: z.string().optional(),
    MUNICIPIO: z.string().min(1, 'Municipio requerido'),
    TELEFONO: z.string().optional(),
    WHATSAPP: z.string().optional(),
    CORREO_ELECTRONICO: z.string().email('Correo inválido').or(z.literal('')).optional(),
    FECHA_AFILIACION: z.string().min(1, 'Fecha requerida'),
    AÑO: z.string().min(4, 'Año inválido'),
    ESTATUS_SOCIO: z.string().min(1, 'Estatus requerido'),
    IMPORTE: z.string().optional(),
});

interface SocioFormProps {
    type: 'CANACO' | 'SIEM';
}

export function SocioForm({ type }: SocioFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            CLAVE_SOCIO: '',
            ID_NEGOCIO: '',
            FOLIO: '',
            RFC: '',
            APELLIDO_PAT: '',
            APELLIDO_MAT: '',
            NOMBRE: '',
            NOMBRE_DEL_NEGOCIO: '',
            GIRO: '',
            TIPO_DE_AFILIACION: '',
            PROMOTOR: '',
            CALLE: '',
            NUMERO: '',
            COLONIA: '',
            LOCALIDAD: '',
            MUNICIPIO: '',
            TELEFONO: '',
            WHATSAPP: '',
            CORREO_ELECTRONICO: '',
            FECHA_AFILIACION: new Date().toISOString().split('T')[0],
            AÑO: new Date().getFullYear().toString(),
            ESTATUS_SOCIO: 'ACTIVO',
            IMPORTE: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            if (type === 'CANACO') {
                await createSocioCanaco(values as unknown as import('@/types').Socio);
            } else {
                await createSocioSiem(values as unknown as import('@/types').Socio);
            }
            toast.success(`Socio ${type} guardado correctamente.`);
            router.push(`/socios/${type.toLowerCase()}`);
        } catch (error) {
            console.error(error);
            toast.error(`Error al guardar socio ${type}. Revisa las credenciales de Google Sheets.`);
        } finally {
            setLoading(false);
        }
    }

    const fields = [
        { name: 'CLAVE_SOCIO', label: 'Clave Socio' },
        { name: 'ID_NEGOCIO', label: 'ID Negocio' },
        { name: 'FOLIO', label: 'Folio' },
        { name: 'RFC', label: 'RFC (*)' },
        { name: 'NOMBRE_DEL_NEGOCIO', label: 'Nombre del Negocio (*)' },
        { name: 'GIRO', label: 'Giro (*)' },
        { name: 'NOMBRE', label: 'Nombre (*)' },
        { name: 'APELLIDO_PAT', label: 'Apellido Paterno (*)' },
        { name: 'APELLIDO_MAT', label: 'Apellido Materno' },
        { name: 'TIPO_DE_AFILIACION', label: 'Tipo Afiliación' },
        { name: 'PROMOTOR', label: 'Promotor' },
        { name: 'CALLE', label: 'Calle' },
        { name: 'NUMERO', label: 'Número' },
        { name: 'COLONIA', label: 'Colonia' },
        { name: 'LOCALIDAD', label: 'Localidad' },
        { name: 'MUNICIPIO', label: 'Municipio (*)' },
        { name: 'TELEFONO', label: 'Teléfono' },
        { name: 'WHATSAPP', label: 'WhatsApp' },
        { name: 'CORREO_ELECTRONICO', label: 'Correo Electrónico' },
        { name: 'FECHA_AFILIACION', label: 'Fecha Afiliación (*)', type: 'date' },
        { name: 'AÑO', label: 'Año (*)' },
        { name: 'ESTATUS_SOCIO', label: 'Estatus (*)' },
        { name: 'IMPORTE', label: 'Importe' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-slate-900 border border-slate-800 rounded-xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Nuevo Socio {type}</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fields.map((f) => (
                            <FormField
                                key={f.name}
                                control={form.control}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                name={f.name as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">{f.label}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type={f.type || 'text'}
                                                placeholder={f.label}
                                                className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-rose-500" />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            className="text-slate-300 border-slate-700 hover:bg-slate-800"
                            onClick={() => router.push(`/socios/${type.toLowerCase()}`)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white min-w-32">
                            {loading ? 'Guardando...' : 'Guardar Socio'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
