'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Building2, TrendingUp, Users, DollarSign } from 'lucide-react';

interface Fondo {
  'Código Fondo': string;
  'Nombre': string;
  'Tipo': string;
  'Total Cuotas Comprometidas': number;
  'Capital Comprometido ($)': number;
  'Total Cuotas Realizadas': number;
  'Capital Realizado ($)': number;
  'Avance Cuotas (%)': string;
  'Avance Capital (%)': string;
  'Estado': string;
}

interface Serie {
  'Fondo': string;
  'Serie': string;
  'Cuotas Comprometidas': number;
  'Capital Comprometido ($)': number;
  'Cuotas Realizadas': number;
  'Capital Realizado ($)': number;
  'Avance Cuotas (%)': string;
  'Avance Capital (%)': string;
  'Estado': string;
}

interface Aportante {
  'ID Aportante': string;
  'RUT': string;
  'Nombre': string;
  'Tipo': string;
  'Activo': string;
}

interface Compromiso {
  'Fondo': string;
  'Serie': string;
  'ID Aportante': string;
  'RUT Aportante': string;
  'Nombre Aportante': string;
  'Cuotas Comprometidas': number;
  'Capital Comprometido ($)': number;
  'Cuotas Realizadas': number;
  'Capital Realizado ($)': number;
  'Avance Cuotas (%)': string;
  'Avance Capital (%)': string;
  'Estado': string;
}

interface Inmobiliaria {
  'ID Inmobiliaria': string;
  'Nombre': string;
}

interface Proyecto {
  'ID Proyecto': string;
  'ID Inmobiliaria': string;
  'Fondo': string;
  'Nombre Proyecto': string;
  'Comuna': string;
  'Región': string;
}

interface Caracteristica {
  'ID Característica': number;
  'ID Proyecto': string;
  'Edificios': number;
  'Pisos': number;
  'Deptos/Piso': number;
  'UH Totales': number;
  'Estacionamientos': number;
}

interface AvanceVenta {
  'ID Avance': number;
  'ID Proyecto': string;
  'UH Promesadas': number;
  'UH Vendidas': number;
  'UH Stock': number;
  'Avance Ventas (%)': number;
}

interface AvanceObra {
  'ID Avance Obra': number;
  'ID Proyecto': string;
  'Avance Obra (%)': number;
}

interface PoolFondo {
  'ID Pool': string;
  'Nombre Pool': string;
  'Fondo': string;
  '% Participación': number;
}

interface LlamadoCapital {
  'ID Llamado': number;
  'Fondo': string;
  'Fecha': string;
  'Monto (UF)': number;
  'Tipo': string;
  'Estado': string;
  'Descripción': string;
}

interface AporteAportante {
  'ID Aporte': number;
  'ID Llamado': number;
  'Fondo': string;
  'Serie': string;
  'ID Aportante': string;
  'Monto (UF)': number;
  'Cuotas': number;
  '% Respecto Promesa': string;
  'Fecha Pago': string;
  'Estado': string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, string> | null>(null);
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [, setAportantes] = useState<Aportante[]>([]);
  const [compromisos, setCompromisos] = useState<Compromiso[]>([]);
  const [inmobiliarias, setInmobiliarias] = useState<Inmobiliaria[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
  const [avanceVentas, setAvanceVentas] = useState<AvanceVenta[]>([]);
  const [avanceObra, setAvanceObra] = useState<AvanceObra[]>([]);
  const [poolFondos, setPoolFondos] = useState<PoolFondo[]>([]);
  const [llamadosCapital, setLlamadosCapital] = useState<LlamadoCapital[]>([]);
  const [aportesAportante, setAportesAportante] = useState<AporteAportante[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFondo] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay sesión en sessionStorage (específico por pestaña)
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchData(parsedUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (currentUser?: Record<string, string>) => {
    try {
      const [
        fondosRes, 
        seriesRes, 
        aportantesRes, 
        compromisosRes,
        inmobiliariasRes,
        proyectosRes,
        caracteristicasRes,
        avanceVentasRes,
        avanceObraRes,
        poolFondosRes,
        llamadosCapitalRes,
        aportesAportanteRes
      ] = await Promise.all([
        fetch('/api/fondos'),
        fetch('/api/series'),
        fetch('/api/aportantes'),
        fetch('/api/compromisos'),
        fetch('/api/inmobiliarias'),
        fetch('/api/proyectos'),
        fetch('/api/caracteristicas-proyectos'),
        fetch('/api/avance-ventas'),
        fetch('/api/avance-obra'),
        fetch('/api/pool-fondos'),
        fetch('/api/llamados-capital'),
        fetch('/api/aportes-aportante')
      ]);

      const fondosData = await fondosRes.json();
      const seriesData = await seriesRes.json();
      const aportantesData = await aportantesRes.json();
      const compromisosData = await compromisosRes.json();
      const inmobiliariasData = await inmobiliariasRes.json();
      const proyectosData = await proyectosRes.json();
      const caracteristicasData = await caracteristicasRes.json();
      const avanceVentasData = await avanceVentasRes.json();
      const avanceObraData = await avanceObraRes.json();
      const poolFondosData = await poolFondosRes.json();
      const llamadosCapitalData = await llamadosCapitalRes.json();
      
      // El endpoint devuelve directamente el array, no un objeto
      const aportesAportanteDataRaw = await aportesAportanteRes.json();
      const aportesAportanteData = Array.isArray(aportesAportanteDataRaw) ? aportesAportanteDataRaw : [];

      // Si el usuario es "usuario" (no admin), filtrar datos por su RUT
      const userRut = currentUser?.rut;
      const isAdmin = currentUser?.role === 'admin';

      setFondos(fondosData.fondos || []);
      setSeries(seriesData.series || []);
      
      // Filtrar por RUT si no es admin
      if (isAdmin) {
        setAportantes(aportantesData.aportantes || []);
        setCompromisos(compromisosData.compromisos || []);
      } else {
        // Filtrar compromisos por RUT del usuario
        const compromisosFiltrados = compromisosData.compromisos?.filter((c: Record<string, string | number>) => {
          const rutAportante = String(c['RUT Aportante']).trim();
          const userRutStr = String(userRut).trim();
          return rutAportante === userRutStr;
        }) || [];
        setCompromisos(compromisosFiltrados);
        setAportantes([]); // No mostrar otros aportantes
      }
      setInmobiliarias(inmobiliariasData.inmobiliarias || []);
      setProyectos(proyectosData.proyectos || []);
      setCaracteristicas(caracteristicasData.caracteristicas || []);
      setAvanceVentas(avanceVentasData.avanceVentas || []);
      setAvanceObra(avanceObraData.avanceObra || []);
      setPoolFondos(Array.isArray(poolFondosData) ? poolFondosData : []);
      setLlamadosCapital(Array.isArray(llamadosCapitalData) ? llamadosCapitalData : []);
      
      // Filtrar aportes por aportante si no es admin
      if (isAdmin) {
        setAportesAportante(aportesAportanteData);
      } else {
        // Filtrar aportes por RUT del usuario
        const aportesFiltrados = (aportesAportanteData || []).filter((a: Record<string, string | number>) => {
          // Buscar el aportante en la tabla de aportantes
          const aportante = (aportantesData.aportantes || []).find((ap: Record<string, string | number>) => a['ID Aportante'] === ap['ID Aportante']);
          return aportante && String(aportante['RUT']) === String(userRut);
        });
        setAportesAportante(aportesFiltrados);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas generales
  const isAdmin = user?.role === 'admin';
  
  // Para usuarios no-admin, calcular métricas basadas solo en sus fondos
  const fondosUnicos = compromisos.length > 0 
    ? Array.from(new Set(compromisos.map(c => c['Fondo'])))
    : [];
  const seriesDelUsuario = compromisos.length > 0
    ? Array.from(new Set(compromisos.map(c => `${c['Fondo']}-${c['Serie']}`)))
    : [];
  
  const totalFondos = isAdmin ? fondos.length : fondosUnicos.length;
  const totalSeries = isAdmin ? series.length : seriesDelUsuario.length;
  
  // Capital comprometido basado en compromisos del usuario
  const capitalTotalComprometido = isAdmin 
    ? fondos.reduce((sum, fondo) => sum + (fondo['Capital Comprometido ($)'] || 0), 0)
    : compromisos.length > 0 
      ? compromisos.reduce((sum, c) => sum + (Number(c['Capital Comprometido ($)']) || 0), 0)
      : 0;
  
  // Capital pagado = suma de todos los aportes (montos positivos) hasta la fecha
  const capitalPagado = isAdmin
    ? aportesAportante.reduce((sum, aporte) => sum + (aporte['Monto (UF)'] > 0 ? Number(aporte['Monto (UF)']) : 0), 0)
    : aportesAportante.reduce((sum, aporte) => sum + (aporte['Monto (UF)'] > 0 ? Number(aporte['Monto (UF)']) : 0), 0);
  
  // Para la tarjeta de aportantes, mostrar el total de capital comprometido
  const totalAportantesCapital = capitalTotalComprometido;

  // Filtrar fondos solo para usuarios no-admin (admin ve todos)
  const fondosFiltrados = isAdmin 
    ? fondos 
    : compromisos.length > 0
      ? fondos.filter(fondo => fondosUnicos.includes(fondo['Código Fondo']))
      : [];
  
  // Filtrar series por fondo seleccionado Y por compromisos del usuario (para no-admin)
  const seriesUnicasDelUsuario = Array.from(new Set(compromisos.map(c => `${c['Fondo']}-${c['Serie']}`)));
  
  let seriesFiltradas;
  if (isAdmin) {
    // Admin: filtrar solo por fondo seleccionado
    seriesFiltradas = selectedFondo 
      ? series.filter(serie => serie['Fondo'] === selectedFondo)
      : series;
  } else {
    // Usuario: filtrar por sus compromisos Y por fondo seleccionado
    const baseFilter = series.filter(serie => seriesUnicasDelUsuario.includes(`${serie['Fondo']}-${serie['Serie']}`));
    
    if (selectedFondo) {
      seriesFiltradas = baseFilter.filter(serie => serie['Fondo'] === selectedFondo);
    } else {
      seriesFiltradas = baseFilter;
    }
  }

  const compromisosFiltrados = selectedFondo
    ? compromisos.filter(compromiso => compromiso['Fondo'] === selectedFondo)
    : compromisos;

  // Para usuarios no-admin: obtener los pools de sus fondos
  const poolsDelUsuario = isAdmin 
    ? poolFondos 
    : fondosUnicos.length > 0 
      ? poolFondos.filter(pool => fondosUnicos.includes(pool['Fondo']))
      : [];

  // Obtener IDs únicos de pools
  const poolIdsUnicos = Array.from(new Set(poolsDelUsuario.map(p => p['ID Pool'])));
  
  // Para usuarios: filtrar proyectos, características, avances por pool
  const proyectosFiltrados = isAdmin 
    ? proyectos 
    : proyectos; // Mostrar todos los proyectos por ahora
  
  const caracteristicasFiltradas = isAdmin 
    ? caracteristicas 
    : caracteristicas.filter(c => 
      proyectosFiltrados.some(p => p['ID Proyecto'] === c['ID Proyecto'])
    );
  
  const avanceVentasFiltradas = isAdmin 
    ? avanceVentas 
    : avanceVentas.filter(a => 
      proyectosFiltrados.some(p => p['ID Proyecto'] === a['ID Proyecto'])
    );
  
  const avanceObraFiltradas = isAdmin 
    ? avanceObra 
    : avanceObra.filter(a => 
      proyectosFiltrados.some(p => p['ID Proyecto'] === a['ID Proyecto'])
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">ECOMAC Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
                {user?.nombre} ({user?.role})
              </div>
              <button
                onClick={() => {
                  sessionStorage.removeItem('user');
                  router.push('/login');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Fondos</p>
                <p className="text-2xl font-semibold text-gray-900">{totalFondos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Series</p>
                <p className="text-2xl font-semibold text-gray-900">{totalSeries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Capital Comprometido</p>
                <p className="text-2xl font-semibold text-gray-900">${totalAportantesCapital.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Capital Pagado</p>
                <p className="text-2xl font-semibold text-gray-900">{capitalPagado.toLocaleString()} UF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Fondos */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Fondos {!isAdmin ? 'del Usuario' : ''}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas Comprometidas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital Comprometido</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avance</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fondosFiltrados.map((fondo, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fondo['Código Fondo']}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{fondo['Nombre']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{fondo['Total Cuotas Comprometidas']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${fondo['Capital Comprometido ($)']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{fondo['Avance Capital (%)']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        fondo['Estado'] === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {fondo['Estado']}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de Series */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Series {selectedFondo ? `- ${selectedFondo}` : ''}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fondo</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Serie</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas Comprometidas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital Comprometido</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avance</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seriesFiltradas.map((serie, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{serie['Fondo']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{serie['Serie']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{serie['Cuotas Comprometidas']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${serie['Capital Comprometido ($)']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{serie['Avance Capital (%)']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        serie['Estado'] === 'ACTIVA' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {serie['Estado']}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de Compromisos */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Compromisos por Aportante {selectedFondo ? `- ${selectedFondo}` : ''}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fondo</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Serie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aportante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RUT</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {compromisosFiltrados.map((compromiso, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{compromiso['Fondo']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{compromiso['Serie']}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{compromiso['Nombre Aportante']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{compromiso['RUT Aportante']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{compromiso['Cuotas Comprometidas']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${compromiso['Capital Comprometido ($)']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{compromiso['Avance Capital (%)']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Imagen de Estructura Pool 4 */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Estructura Pool 4</h2>
          <div className="flex justify-center">
            <Image 
              src="/estructura-pool-4.png" 
              alt="Estructura Pool 4" 
              width={1200}
              height={800}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Sección de Subyacentes - Filtrada por pool del usuario */}
        <div className="border-t-4 border-blue-600 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Subyacentes {!isAdmin && poolsDelUsuario.length > 0 ? `- Pool ${poolIdsUnicos.join(', ')}` : ''}
          </h2>

        {/* Tabla de Proyectos */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Proyectos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inmobiliaria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comuna</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Región</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proyectosFiltrados.map((proyecto, index) => {
                    const inmobiliaria = inmobiliarias.find(i => i['ID Inmobiliaria'] === proyecto['ID Inmobiliaria']);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto['Nombre Proyecto']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inmobiliaria?.Nombre || proyecto['ID Inmobiliaria']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto['Comuna']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto['Región']}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de Características */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Características de Proyectos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Edificios</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pisos</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Deptos/Piso</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">UH Totales</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Estacionamientos</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {caracteristicasFiltradas.map((caracteristica, index) => {
                    const proyecto = proyectosFiltrados.find(p => p['ID Proyecto'] === caracteristica['ID Proyecto']);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto?.['Nombre Proyecto'] || caracteristica['ID Proyecto']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{caracteristica['Edificios']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{caracteristica['Pisos']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{caracteristica['Deptos/Piso']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{caracteristica['UH Totales']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{caracteristica['Estacionamientos']}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de Avance Ventas */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Avance de Ventas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">UH Promesadas</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">UH Vendidas</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">UH Stock</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avance (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {avanceVentasFiltradas.map((avance, index) => {
                    const proyecto = proyectosFiltrados.find(p => p['ID Proyecto'] === avance['ID Proyecto']);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto?.['Nombre Proyecto'] || avance['ID Proyecto']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{avance['UH Promesadas']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{avance['UH Vendidas']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{avance['UH Stock']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{avance['Avance Ventas (%)']}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de Avance Obra */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Avance de Obra</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avance (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {avanceObraFiltradas.map((avance, index) => {
                    const proyecto = proyectosFiltrados.find(p => p['ID Proyecto'] === avance['ID Proyecto']);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto?.['Nombre Proyecto'] || avance['ID Proyecto']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{avance['Avance Obra (%)']}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sección de Capital Calls */}
        <div className="border-t-4 border-green-600 pt-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Capital Calls & Returns</h2>

          {/* Tabla de Pool Fondos - Solo para admin */}
          {isAdmin && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Pool Fondos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pool</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fondo</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">% Participación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {poolsDelUsuario.map((pool, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pool['ID Pool']}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pool['Fondo']}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{pool['% Participación']}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Tabla de Llamados de Capital - Solo para admin */}
          {isAdmin && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Llamados de Capital</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pool</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto (UF)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {llamadosCapital
                    .filter(llamado => isAdmin || fondosUnicos.includes(llamado['Fondo']))
                    .map((llamado, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{llamado['ID Llamado']}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{llamado['Fondo']}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{llamado['Fecha']}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        <span className={llamado['Monto (UF)'] < 0 ? 'text-red-600' : 'text-green-600'}>
                          {llamado['Monto (UF)']?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          llamado['Tipo'] === 'LLAMADO' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {llamado['Tipo']}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          llamado['Estado'] === 'PAGADO' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {llamado['Estado']}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{llamado['Descripción']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Tabla de Aportes por Aportante */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Aportes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Llamado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fondo</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Serie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aportante</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto (UF)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">% Promesa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Pago</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {aportesAportante.map((aporte, index) => {
                      // Buscar el aportante en la tabla de compromisos si no está en aportantes
                      const compromiso = compromisos.find(c => c['ID Aportante'] === aporte['ID Aportante']);
                      const nombreAportante = compromiso?.['Nombre Aportante'] || aporte['ID Aportante'];
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aporte['ID Llamado']}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aporte['Fondo']}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{aporte['Serie']}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{nombreAportante}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <span className={aporte['Monto (UF)'] < 0 ? 'text-red-600' : 'text-green-600'}>
                              {aporte['Monto (UF)']?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{aporte['Cuotas']?.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{aporte['% Respecto Promesa']}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aporte['Fecha Pago']}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              aporte['Estado'] === 'PAGADO' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {aporte['Estado']}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}