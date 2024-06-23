export interface RunnerParsed {
    ID: number;
    Numero_de_corredor: string;
    Nombre: string;
    Email: string;
    Edad: string;
    DNI: string;
    Genero: string;
    Talle: string;
    Fecha_Nac: string; // You might want to use a Date type here if needed
    Nro_Socio_MM: string;
    Categoria: string;
    Valor_Categoria: number;
    Status: string;
    Monto_Abonado: number;
    Descuento: string;
    Tipo_de_descuento: string;
    Codigo_de_descuento: string | null;
    Fecha_Creado: string; // You might want to use a Date type here if needed
  }