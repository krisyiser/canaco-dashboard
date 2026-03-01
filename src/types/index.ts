export interface Socio {
  CLAVE_SOCIO: string;
  ID_NEGOCIO: string;
  FOLIO: string;
  RFC: string;
  APELLIDO_PAT: string;
  APELLIDO_MAT: string;
  NOMBRE: string;
  NOMBRE_DEL_NEGOCIO: string;
  GIRO: string;
  TIPO_DE_AFILIACION: string;
  PROMOTOR: string;
  CALLE: string;
  NUMERO: string;
  COLONIA: string;
  LOCALIDAD: string;
  MUNICIPIO: string;
  TELEFONO: string;
  WHATSAPP: string;
  CORREO_ELECTRONICO: string;
  FECHA_AFILIACION: string;
  AÑO: string;
  ESTATUS_SOCIO: string;
  IMPORTE: string;
}

export interface MovimientoFinanciero {
  FECHA: string;
  TIPO_MOVIMIENTO: string; // INGRESO / EGRESO
  CONCEPTO: string;
  MONTO: string; // Mantenido como string al leer de sheets
  FORMA_PAGO: string;
  OBSERVACIONES?: string;
  REGISTRADO_POR?: string;
  CLASIFICACION_GENERAL?: string; // Para gráficos si existe
}
