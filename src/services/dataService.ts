import { getRows, appendRow } from '@/lib/googleSheets';
import { Socio, MovimientoFinanciero } from '@/types';

// Ojo: Si usas cache de Next.js puedes envolver llamadas o usar revalidate
// Para el demo usamos getRows y mapeamos las cabeceras.

function parseSocioRow(row: string[], headers: string[]): Socio {
    const socio: Record<string, string> = {};
    headers.forEach((h, index) => {
        socio[h] = row[index] || '';
    });
    return socio as unknown as Socio;
}

function parseFinanzasRow(row: string[], headers: string[]): MovimientoFinanciero {
    const rawData: Record<string, string> = {};
    headers.forEach((h, index) => {
        rawData[h] = row[index] || '';
    });
    return {
        FECHA: rawData['FECHA'] || '',
        TIPO_MOVIMIENTO: rawData['TIPO'] || rawData['TIPO_MOVIMIENTO'] || '',
        CONCEPTO: rawData['CONCEPTO'] || '',
        MONTO: rawData['MONTO'] || '',
        FORMA_PAGO: rawData['METODO_PAGO'] || rawData['FORMA_PAGO'] || '',
        OBSERVACIONES: rawData['NOTAS'] || rawData['OBSERVACIONES'] || '',
        REGISTRADO_POR: rawData['REGISTRADO_POR'] || '',
        CLASIFICACION_GENERAL: rawData['CATEGORIA'] || rawData['CLASIFICACION_GENERAL'] || ''
    };
}

export async function getSociosCanaco(spreadsheetId: string, range: string = 'socios!A1:W'): Promise<Socio[]> {
    const rows = await getRows(spreadsheetId, range);
    if (!rows || rows.length === 0) return [];
    const headers = rows[0];
    const dataRows = rows.slice(1);
    return dataRows.map(row => parseSocioRow(row, headers));
}

export async function getSociosSiem(spreadsheetId: string, range: string = 'padron_siem!A1:W'): Promise<Socio[]> {
    const rows = await getRows(spreadsheetId, range);
    if (!rows || rows.length === 0) return [];
    const headers = rows[0];
    const dataRows = rows.slice(1);
    return dataRows.map(row => parseSocioRow(row, headers));
}

export async function getFinanzas(spreadsheetId: string, range: string = 'movimientos!A1:Z'): Promise<MovimientoFinanciero[]> {
    const rows = await getRows(spreadsheetId, range);
    if (!rows || rows.length === 0) return [];
    const headers = rows[0];
    const dataRows = rows.slice(1);
    return dataRows.map(row => parseFinanzasRow(row, headers));
}

export async function addSocioCanaco(spreadsheetId: string, socio: Socio, range: string = 'socios!A:W') {
    // Convertimos el objeto en array en el mismo orden de las columnas esperadas
    const values = [
        socio.CLAVE_SOCIO, socio.ID_NEGOCIO, socio.FOLIO, socio.RFC,
        socio.APELLIDO_PAT, socio.APELLIDO_MAT, socio.NOMBRE, socio.NOMBRE_DEL_NEGOCIO,
        socio.GIRO, socio.TIPO_DE_AFILIACION, socio.PROMOTOR, socio.CALLE,
        socio.NUMERO, socio.COLONIA, socio.LOCALIDAD, socio.MUNICIPIO,
        socio.TELEFONO, socio.WHATSAPP, socio.CORREO_ELECTRONICO,
        socio.FECHA_AFILIACION, socio.AÑO, socio.ESTATUS_SOCIO, socio.IMPORTE
    ];
    return await appendRow(spreadsheetId, range, values);
}

export async function addSocioSiem(spreadsheetId: string, socio: Socio, range: string = 'padron_siem!A:W') {
    const values = [
        socio.CLAVE_SOCIO, socio.ID_NEGOCIO, socio.FOLIO, socio.RFC,
        socio.APELLIDO_PAT, socio.APELLIDO_MAT, socio.NOMBRE, socio.NOMBRE_DEL_NEGOCIO,
        socio.GIRO, socio.TIPO_DE_AFILIACION, socio.PROMOTOR, socio.CALLE,
        socio.NUMERO, socio.COLONIA, socio.LOCALIDAD, socio.MUNICIPIO,
        socio.TELEFONO, socio.WHATSAPP, socio.CORREO_ELECTRONICO,
        socio.FECHA_AFILIACION, socio.AÑO, socio.ESTATUS_SOCIO, socio.IMPORTE
    ];
    return await appendRow(spreadsheetId, range, values);
}

export async function addMovimientoFinanciero(spreadsheetId: string, mov: MovimientoFinanciero, range: string = 'movimientos!A:O') {
    const values = [
        '', // ID_TRANSACCION
        mov.FECHA,
        '', // ANIO
        '', // MES
        '', // SEMANA
        mov.TIPO_MOVIMIENTO,
        mov.CONCEPTO,
        mov.CLASIFICACION_GENERAL || '', // CATEGORIA
        '', // SUBCATEGORIA
        mov.MONTO,
        mov.FORMA_PAGO, // METODO_PAGO
        '', // REFERENCIA
        mov.OBSERVACIONES || '', // NOTAS
        'DASHBOARD', // ORIGEN
        '' // NIVEL
    ];
    return await appendRow(spreadsheetId, range, values);
}
