export interface Service {
  id?: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
}

export const FAKE_SERVICES: Service[] = [
  { nombre: '',        descripcion: 'Limpieza de casas y oficinas',         categoria: 'Aseo',        precio:  50000 },
  { nombre: 'Asesoría Legal',           descripcion: 'Consultas jurídicas y trámites legales', categoria: 'Derecho',     precio: 120000 },
  { nombre: 'Soporte Técnico',          descripcion: 'Mantenimiento de computadoras',          categoria: 'Tecnología',  precio:  80000 },
  { nombre: 'Desarrollo de Software',   descripcion: 'Apps web y móviles a medida',            categoria: 'Desarrollo',  precio: 300000 },
  /* …otros servicios… */
];
