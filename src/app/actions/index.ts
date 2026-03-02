'use server';

import { getSociosCanaco, getSociosSiem, getFinanzas, addSocioCanaco as addCanacoDS, addSocioSiem as addSiemDS, addMovimientoFinanciero as addFinanzasDS } from '@/services/dataService';
import { Socio, MovimientoFinanciero } from '@/types';
import { revalidatePath } from 'next/cache';

// Reemplazar con el ID por defecto para pruebas o traerlo de env/DB
const DEFAULT_CANACO_SHEET_ID = process.env.GOOGLE_SHEET_ID_SOCIOS || '';
const DEFAULT_SIEM_SHEET_ID = process.env.GOOGLE_SHEET_ID_SIEM || '';
const DEFAULT_FINANZAS_SHEET_ID = process.env.GOOGLE_SHEET_ID_FINANZAS || '';

// Canaco Actions
export async function fetchSociosCanaco(sheetId?: string) {
    const id = sheetId || DEFAULT_CANACO_SHEET_ID;
    if (!id) throw new Error("No Spreadsheet ID provided for CANACO.");
    return await getSociosCanaco(id);
}

export async function createSocioCanaco(socio: Socio, sheetId?: string) {
    const id = sheetId || DEFAULT_CANACO_SHEET_ID;
    if (!id) throw new Error("No Spreadsheet ID provided for CANACO.");
    await addCanacoDS(id, socio);

    // Forzar revalidación de caché en todas partes
    revalidatePath('/', 'layout');
}

// Siem Actions
export async function fetchSociosSiem(sheetId?: string) {
    const id = sheetId || DEFAULT_SIEM_SHEET_ID;
    if (!id) throw new Error("No Spreadsheet ID provided for SIEM.");
    return await getSociosSiem(id);
}

export async function createSocioSiem(socio: Socio, sheetId?: string) {
    const id = sheetId || DEFAULT_SIEM_SHEET_ID;
    if (!id) throw new Error("No Spreadsheet ID provided for SIEM.");
    await addSiemDS(id, socio);

    revalidatePath('/', 'layout');
}

// Finanzas Actions
export async function fetchFinanzas(sheetId?: string) {
    const id = sheetId || DEFAULT_FINANZAS_SHEET_ID;
    if (!id) throw new Error("No Spreadsheet ID provided for FINANZAS.");
    return await getFinanzas(id);
}

export async function createMovimiento(mov: MovimientoFinanciero, sheetId?: string) {
    const id = sheetId || DEFAULT_FINANZAS_SHEET_ID;
    if (!id) throw new Error("No Spreadsheet ID provided for FINANZAS.");
    await addFinanzasDS(id, mov);

    revalidatePath('/', 'layout');
}

import { getGoogleSheetsClient } from '@/lib/googleSheets';

export async function testConnection() {
    try {
        await getGoogleSheetsClient();
        return { success: true, message: "Autenticación exitosa con API de Google Sheets." };
    } catch (e: unknown) {
        return { success: false, message: e instanceof Error ? e.message : "Error desconocido en auth de Google Sheets." };
    }
}
