import { google } from 'googleapis';

// Dónde poner credenciales:
// En el archivo .env.local (o en Vercel Environment Variables):
// GOOGLE_SERVICE_ACCOUNT_EMAIL="tu-service-account@...iam.gserviceaccount.com"
// GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...=\n-----END PRIVATE KEY-----\n"
// 
// Opcionalmente:
// GOOGLE_SERVICE_ACCOUNT_JSON_BASE64="ey..." (el JSON descargado de Google Cloud, codificado en base64)

export async function getGoogleSheetsClient() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const jsonBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;

    let credentials: Record<string, string> = {};

    if (jsonBase64) {
        const jsonStr = Buffer.from(jsonBase64, 'base64').toString('utf8');
        credentials = JSON.parse(jsonStr);
    } else if (email && privateKey) {
        // Es importante reemplazar los \n escapados si vienen como string en .env
        privateKey = privateKey.replace(/\\n/g, '\n');
        credentials = {
            client_email: email,
            private_key: privateKey,
        };
    } else {
        throw new Error('Google Service Account credentials not provided in environment variables.');
    }

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });

    return sheets;
}

/**
 * Lee todas las filas de un rango.
 * 
 * @param spreadsheetId El ID del spreadsheet (lo sacas de la URL, https://docs.google.com/spreadsheets/d/<ID>/edit)
 * @param range El rango a leer, por ejemplo "PADRON CANACO!A1:W"
 * @returns Array de arrays (filas y columnas)
 */
export async function getRows(spreadsheetId: string, range: string) {
    try {
        const sheets = await getGoogleSheetsClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        return response.data.values || [];
    } catch (error) {
        console.error('Error fetching rows from Google Sheets:', error);
        throw error;
    }
}

/**
 * Añade una nueva fila al final de los datos en un rango.
 * @param spreadsheetId ID del sheet
 * @param range Rango (ej. "PADRON CANACO!A:A") - Google Sheets busca la última fila vacía en este rango para insertar
 * @param values Arreglo de strings con los valores a insertar en las columnas.
 */
export async function appendRow(spreadsheetId: string, range: string, values: string[]) {
    try {
        const sheets = await getGoogleSheetsClient();
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [values],
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error appending row to Google Sheets:', error);
        throw error;
    }
}
