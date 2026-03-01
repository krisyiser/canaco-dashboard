'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const user = formData.get('usuario') as string;
    const pass = formData.get('password') as string;

    let role = '';
    if (user === 'presidente' && pass === 'presidente123') role = 'presidente';
    else if (user === 'oficina' && pass === 'oficina123') role = 'oficina';
    else if (user === 'consejo' && pass === 'consejo123') role = 'consejo';

    if (!role) {
        return { error: 'Credenciales inválidas' };
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_user', role, { secure: true, httpOnly: true, path: '/' });

    return { success: true, role };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_user');
    redirect('/login');
}
