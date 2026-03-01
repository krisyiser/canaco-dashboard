'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMovimiento } from '@/app/actions';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const formSchema = z.object({
    FECHA: z.string().min(1, 'Fecha requerida'),
    TIPO_MOVIMIENTO: z.enum(['INGRESO', 'EGRESO'], { message: 'Tipo requerido' }),
    CONCEPTO: z.string().min(1, 'Concepto requerido'),
    CLASIFICACION_GENERAL: z.string().optional(),
    MONTO: z.string().min(1, 'Monto requerido'),
    FORMA_PAGO: z.string().min(1, 'Forma de pago requerida'),
    OBSERVACIONES: z.string().optional(),
    REGISTRADO_POR: z.string().optional(),
});

export function MovimientoForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            FECHA: new Date().toISOString().split('T')[0],
            TIPO_MOVIMIENTO: 'EGRESO',
            CONCEPTO: '',
            CLASIFICACION_GENERAL: '',
            MONTO: '',
            FORMA_PAGO: 'EFECTIVO',
            OBSERVACIONES: '',
            REGISTRADO_POR: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await createMovimiento(values as unknown as import('@/types').MovimientoFinanciero);
            toast.success(`Movimiento guardado correctamente.`);
            router.push(`/finanzas`);
        } catch (error) {
            console.error(error);
            toast.error(`Error al guardar movimiento. Revisa las credenciales.`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8 bg-slate-900 border border-slate-800 rounded-xl mt-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Nuevo Movimiento</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <FormField
                            control={form.control}
                            name="TIPO_MOVIMIENTO"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Tipo de Movimiento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 focus:ring-amber-500">
                                                <SelectValue placeholder="Selecciona un tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="INGRESO" className="font-semibold text-emerald-500">Ingreso</SelectItem>
                                            <SelectItem value="EGRESO" className="font-semibold text-rose-500">Egreso</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="FECHA"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Fecha</FormLabel>
                                    <FormControl>
                                        <Input type="date" className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="CONCEPTO"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-slate-300">Concepto (Texto libre)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Pago de luz, Inscripción anual..." className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="CLASIFICACION_GENERAL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Clasificación General (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Operativo, Nómina..." className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="MONTO"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Monto</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="Ej. 1500.00" className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="FORMA_PAGO"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Forma de Pago</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100 focus:ring-amber-500">
                                                <SelectValue placeholder="Selecciona una forma de pago" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                                            <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                                            <SelectItem value="TARJETA">Tarjeta</SelectItem>
                                            <SelectItem value="CHEQUE">Cheque</SelectItem>
                                            <SelectItem value="OTRO">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="REGISTRADO_POR"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Registrado por (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre de quien registra" className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="OBSERVACIONES"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-slate-300">Observaciones (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Comentarios extra..." className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            className="text-slate-300 border-slate-700 hover:bg-slate-800"
                            onClick={() => router.push(`/finanzas`)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white min-w-32">
                            {loading ? 'Guardando...' : 'Guardar Movimiento'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
