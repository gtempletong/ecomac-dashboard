'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Building2, TrendingUp, Users, DollarSign, Download } from 'lucide-react';

interface Fondo {
  'Código Fondo': string;
  'Nombre': string;
  'Tipo': string;
  'Cuotas Comprometidas': number;
  'Capital Comprometido ($)': number;
  'Cuotas Pagadas': number;
  'Equity Aportado': number;
  'Aportes Acumulados': string;
  'Estado': string;
}

interface Serie {
  'Fondo': string;
  'Serie': string;
  'Cuotas Comprometidas': number;
  'Capital Comprometido ($)': number;
  'Cuotas Pagadas': number;
  'Equity Aportado': number;
  'Aportes Acumulados': string | number;
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
  'Cuotas Pagadas': number;
  'Equity Aportado': number;
  'Aportes Acumulados': string | number;
  'Estado': string;
}

interface Inmobiliaria {
  'ID Inmobiliaria': string;
  'Nombre': string;
}

interface Proyecto {
  'ID Inmobiliaria': string;
  'Nombre Inmobiliaria': string;
  'ID Proyecto': string;
  'FIP': string;
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
  'UH Totales'?: number;
  'UH Promesadas': number;
  'UH Escrituradas'?: number;
  'UH Stock': number;
  'Avance Ventas (%)': number | string;
  'Avance Obra (%)'?: number | string;
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
  'Fecha Llamado': string;
  'Monto Total (UF)': number;
  'Monto Total ($)': number;
  'Tipo': string;
  'Estado': string;
  'Descripción': string;
}

interface AporteAportante {
  'ID Llamado': number;
  'Fondo': string;
  'Serie': string;
  'ID Aportante': string;
  'NOMBRE APORTANTE': string;
  'TIPO': string;
  'MONTO (CLP)': number;
  'Monto (UF)': number;
  'Cuotas': number;
  '% PROMESA': string | number;
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
  const [sortCompromisosBy, setSortCompromisosBy] = useState<'fondo' | 'aportante' | null>(null);
  const [sortCompromisosOrder, setSortCompromisosOrder] = useState<'asc' | 'desc'>('asc');
  const [filterLlamadoPool, setFilterLlamadoPool] = useState<string>('Todos');
  const [filterLlamadoTipo, setFilterLlamadoTipo] = useState<string>('Todos');
  const [expandedAportantes, setExpandedAportantes] = useState<Set<string>>(new Set());
  const [filtrosAportante, setFiltrosAportante] = useState<Record<string, { fondo: string; tipo: string }>>({});

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
      setAvanceObra([]); // Ya no usamos avance obra separado
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

  let compromisosFiltrados = selectedFondo
    ? compromisos.filter(compromiso => compromiso['Fondo'] === selectedFondo)
    : compromisos;

  // Aplicar ordenamiento
  if (sortCompromisosBy) {
    compromisosFiltrados = [...compromisosFiltrados].sort((a, b) => {
      let compareValue = 0;
      
      if (sortCompromisosBy === 'fondo') {
        compareValue = a['Fondo'].localeCompare(b['Fondo']);
      } else if (sortCompromisosBy === 'aportante') {
        compareValue = a['Nombre Aportante'].localeCompare(b['Nombre Aportante']);
      }
      
      return sortCompromisosOrder === 'asc' ? compareValue : -compareValue;
    });
  }

  // Para usuarios no-admin: obtener los pools de sus fondos
  const poolsDelUsuario = isAdmin 
    ? poolFondos 
    : fondosUnicos.length > 0 
      ? poolFondos.filter(pool => fondosUnicos.includes(pool['Fondo']))
      : [];

  console.log('🔍 DEBUG Pool Fondos:', {
    isAdmin,
    poolFondosLength: poolFondos.length,
    poolsDelUsuarioLength: poolsDelUsuario.length,
    poolFondos: poolFondos,
    poolsDelUsuario: poolsDelUsuario
  });

  // Obtener IDs únicos de pools
  const poolIdsUnicos = Array.from(new Set(poolsDelUsuario.map(p => p['ID Pool'])));
  
  // Para usuarios: filtrar proyectos, características, avances por pool
  const proyectosFiltrados = isAdmin 
    ? proyectos 
    : compromisos.length > 0
      ? proyectos.filter(proyecto => fondosUnicos.includes(proyecto['Fondo']))
      : [];
  
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

  const proyectosSinDuplicar = Array.from(
    new Map(
      proyectosFiltrados.map((proyecto) => {
        const key = proyecto['ID Proyecto'] || proyecto['Nombre Proyecto'];
        return [key, proyecto];
      })
    ).values()
  );

  const formatNumber = (value: number | string | undefined) => {
    if (value === undefined || value === null || value === '') {
      return '-';
    }
    const numericValue = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(numericValue)) {
      return numericValue.toLocaleString();
    }
    return String(value);
  };

  const parseChileanNumber = (value: string | number) => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const cleaned = String(value).replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned);
  };

  const descargarAportesExcel = async (aportes?: AporteAportante[], nombreArchivo?: string) => {
    const XLSX = await import('xlsx');
    
    const datosAExportar = aportes || aportesAportante;
    
    const normalizarNumero = (valor: string | number) => {
      const numero = parseChileanNumber(valor);
      return Number.isFinite(numero) ? numero : '';
    };

    const datosParaExportar = datosAExportar.map(aporte => ({
      'ID Llamado': aporte['ID Llamado'],
      'Fondo': aporte['Fondo'],
      'Serie': aporte['Serie'],
      'ID Aportante': aporte['ID Aportante'],
      'Nombre Aportante': aporte['NOMBRE APORTANTE'],
      'Tipo': aporte['TIPO'],
      'Monto (CLP)': normalizarNumero(aporte['MONTO (CLP)']),
      'Monto (UF)': normalizarNumero(aporte['Monto (UF)']),
      'Cuotas': normalizarNumero(aporte['Cuotas']),
      '% Promesa': aporte['% PROMESA'],
      'Fecha Pago': aporte['Fecha Pago'],
      'Estado': aporte['Estado']
    }));

    const ws = XLSX.utils.json_to_sheet(datosParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Aportes');

    const fecha = new Date().toISOString().split('T')[0];
    const archivo = nombreArchivo || `Aportes_Todos_${fecha}.xlsx`;
    XLSX.writeFile(wb, archivo);
  };

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
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código Fondo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas Comprometidas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital Comprometido ($)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas Pagadas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Equity Aportado</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aportes Acumulados</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fondosFiltrados.map((fondo, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fondo['Código Fondo']}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{fondo['Nombre']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{fondo['Tipo']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{fondo['Cuotas Comprometidas']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${fondo['Capital Comprometido ($)']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{fondo['Cuotas Pagadas']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${fondo['Equity Aportado']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{fondo['Aportes Acumulados']}</td>
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital Comprometido ($)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas Pagadas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Equity Aportado</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aportes Acumulados</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{serie['Cuotas Pagadas']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${serie['Equity Aportado']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{typeof serie['Aportes Acumulados'] === 'number' ? `${(serie['Aportes Acumulados'] * 100).toFixed(2)}%` : serie['Aportes Acumulados']}</td>
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
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Compromisos por Aportante {selectedFondo ? `- ${selectedFondo}` : ''}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (sortCompromisosBy === 'aportante' && sortCompromisosOrder === 'asc') {
                    setSortCompromisosOrder('desc');
                  } else {
                    setSortCompromisosBy('aportante');
                    setSortCompromisosOrder('asc');
                  }
                }}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  sortCompromisosBy === 'aportante' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ordenar por Nombre {sortCompromisosBy === 'aportante' ? (sortCompromisosOrder === 'asc' ? 'A-Z ↓' : 'Z-A ↑') : ''}
              </button>
              {sortCompromisosBy && (
                <button
                  onClick={() => {
                    setSortCompromisosBy(null);
                    setSortCompromisosOrder('asc');
                  }}
                  className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fondo</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Serie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Aportante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RUT Aportante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Aportante</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas Comprometidas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital Comprometido ($)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas Pagadas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Equity Aportado</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aportes Acumulados</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {compromisosFiltrados.map((compromiso, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{compromiso['Fondo']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{compromiso['Serie']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{compromiso['ID Aportante']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{compromiso['RUT Aportante']}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{compromiso['Nombre Aportante']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{compromiso['Cuotas Comprometidas']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${compromiso['Capital Comprometido ($)']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{compromiso['Cuotas Pagadas']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">${compromiso['Equity Aportado']?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{typeof compromiso['Aportes Acumulados'] === 'number' ? `${(compromiso['Aportes Acumulados'] * 100).toFixed(2)}%` : compromiso['Aportes Acumulados']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        compromiso['Estado'] === 'VIGENTE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {compromiso['Estado']}
                      </span>
                    </td>
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
              <h3 className="text-lg font-semibold text-gray-900">Proyectos y Características</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inmobiliaria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comuna</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Región</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Edificios</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pisos</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Deptos/Piso</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">UH Totales</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Estacionamientos</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proyectosSinDuplicar.map((proyecto, index) => {
                    const caracteristica = caracteristicasFiltradas.find(c => c['ID Proyecto'] === proyecto['ID Proyecto']);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto['Nombre Proyecto']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto['Nombre Inmobiliaria']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto['Comuna']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proyecto['Región']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{formatNumber(caracteristica?.['Edificios'])}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{formatNumber(caracteristica?.['Pisos'])}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{formatNumber(caracteristica?.['Deptos/Piso'])}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatNumber(caracteristica?.['UH Totales'])}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatNumber(caracteristica?.['Estacionamientos'])}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de Avance Ventas y Obras */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Avance de Ventas y Obras</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">UH Totales</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">UH Promesadas</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">UH Escrituradas</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">UH Stock</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avance Ventas (%)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avance Obra (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {avanceVentasFiltradas.map((avance, index) => {
                    const proyecto = proyectosFiltrados.find(p => p['ID Proyecto'] === avance['ID Proyecto']);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto?.['Nombre Proyecto'] || avance['ID Proyecto']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatNumber(avance['UH Totales'])}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatNumber(avance['UH Promesadas'])}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatNumber(avance['UH Escrituradas'])}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatNumber(avance['UH Stock'])}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{avance['Avance Ventas (%)']}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{avance['Avance Obra (%)'] ? `${avance['Avance Obra (%)']}%` : '-'}</td>
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Llamados de Capital</h3>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Pool:</label>
                    <select
                      value={filterLlamadoPool}
                      onChange={(e) => setFilterLlamadoPool(e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Todos">Todos</option>
                      {Array.from(new Set(llamadosCapital.map(l => l['Fondo']))).sort().map(pool => (
                        <option key={pool} value={pool}>{pool}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Tipo:</label>
                    <select
                      value={filterLlamadoTipo}
                      onChange={(e) => setFilterLlamadoTipo(e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Todos">Todos</option>
                      <option value="LLAMADO">Llamado</option>
                      <option value="DEVOLUCIÓN">Devolución</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Llamado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fondo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Llamado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto Total (UF)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto Total ($)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    // Convertir strings con formato chileno a números
                    const parseChileanNumber = (value: string | number) => {
                      if (typeof value === 'number') return value;
                      if (!value) return 0;
                      const cleaned = String(value).replace(/\./g, '').replace(',', '.');
                      return parseFloat(cleaned);
                    };

                    // Filtrar llamados
                    const llamadosFiltrados = llamadosCapital.filter(llamado => {
                      const rolFilter = isAdmin || fondosUnicos.includes(llamado['Fondo']);
                      if (!rolFilter) return false;
                      const poolFilter = filterLlamadoPool === 'Todos' || llamado['Fondo'] === filterLlamadoPool;
                      const tipoFilter = filterLlamadoTipo === 'Todos' || llamado['Tipo'] === filterLlamadoTipo;
                      return poolFilter && tipoFilter;
                    });

                    // Calcular totales
                    const totalUF = llamadosFiltrados.reduce((sum, llamado) => 
                      sum + parseChileanNumber(llamado['Monto Total (UF)']), 0
                    );
                    const totalPesos = llamadosFiltrados.reduce((sum, llamado) => 
                      sum + parseChileanNumber(llamado['Monto Total ($)']), 0
                    );

                    return (
                      <>
                        {/* Fila de Totales */}
                        <tr className="bg-blue-50 font-bold border-b-2 border-blue-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900" colSpan={3}>
                            TOTALES ({llamadosFiltrados.length} registros)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <span className={`${totalUF < 0 ? 'text-red-600' : 'text-green-600'} font-bold`}>
                              {totalUF.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <span className={`${totalPesos < 0 ? 'text-red-600' : 'text-green-600'} font-bold`}>
                              ${totalPesos.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                        
                        {/* Filas de datos */}
                        {llamadosFiltrados.map((llamado, index) => {
                      // Convertir strings con formato chileno (coma decimal, punto miles) a números
                      const parseChileanNumber = (value: string | number) => {
                        if (typeof value === 'number') return value;
                        if (!value) return 0;
                        // Remover puntos (separador de miles) y reemplazar coma por punto (decimal)
                        const cleaned = String(value).replace(/\./g, '').replace(',', '.');
                        return parseFloat(cleaned);
                      };
                      
                      const montoUF = parseChileanNumber(llamado['Monto Total (UF)']);
                      const montoPesos = parseChileanNumber(llamado['Monto Total ($)']);
                      const colorUF = montoUF < 0 ? 'text-red-600' : 'text-green-600';
                      const colorPesos = montoPesos < 0 ? 'text-red-600' : 'text-green-600';
                      
                      return (
                      <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{llamado['ID Llamado']}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{llamado['Fondo']}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{llamado['Fecha Llamado']}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`${colorUF} font-semibold`}>
                          {llamado['Monto Total (UF)']?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`${colorPesos} font-semibold`}>
                          ${llamado['Monto Total ($)']?.toLocaleString()}
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
                          llamado['Estado'] === 'REALIZADO' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {llamado['Estado']}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{llamado['Descripción']}</td>
                      </tr>
                      );
                    })}
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Tabla de Aportes por Aportante */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Aportes</h3>
              <button
                onClick={descargarAportesExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Descargar Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Aportante</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Aportes</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto Total (CLP)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto Total (UF)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cuotas Totales</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    // Agrupar aportes por aportante
                    const aportesAgrupados = aportesAportante.reduce((acc, aporte) => {
                      const idAportante = aporte['ID Aportante'];
                      const nombreAportante = aporte['NOMBRE APORTANTE'];
                      
                      if (!acc[idAportante]) {
                        acc[idAportante] = {
                          idAportante,
                          nombreAportante,
                          totalAportes: 0,
                          montoCLPTotal: 0,
                          montoUFTotal: 0,
                          cuotasTotales: 0,
                          detalles: []
                        };
                      }
                      
                      acc[idAportante].totalAportes++;
                      acc[idAportante].montoCLPTotal += parseChileanNumber(aporte['MONTO (CLP)']);
                      acc[idAportante].montoUFTotal += Number(aporte['Monto (UF)']) || 0;
                      acc[idAportante].cuotasTotales += parseChileanNumber(aporte['Cuotas']);
                      acc[idAportante].detalles.push(aporte);
                      
                      return acc;
                    }, {} as Record<string, {
                      idAportante: string;
                      nombreAportante: string;
                      totalAportes: number;
                      montoCLPTotal: number;
                      montoUFTotal: number;
                      cuotasTotales: number;
                      detalles: AporteAportante[];
                    }>);

                    const toggleAportante = (idAportante: string) => {
                      const newExpanded = new Set(expandedAportantes);
                      if (newExpanded.has(idAportante)) {
                        newExpanded.delete(idAportante);
                      } else {
                        newExpanded.add(idAportante);
                      }
                      setExpandedAportantes(newExpanded);
                    };

                    return Object.values(aportesAgrupados).map((grupo) => {
                      const isExpanded = expandedAportantes.has(grupo.idAportante);
                      
                      return (
                        <>
                          {/* Fila agrupada */}
                          <tr className="bg-gray-50 hover:bg-gray-100 font-semibold">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center cursor-pointer" onClick={() => toggleAportante(grupo.idAportante)}>
                              <span className="text-blue-600 text-lg">{isExpanded ? '▼' : '▶'}</span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => toggleAportante(grupo.idAportante)}>
                              <div className="flex items-center justify-between">
                                <span>{grupo.nombreAportante}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const fecha = new Date().toISOString().split('T')[0];
                                    const nombreLimpio = grupo.nombreAportante.replace(/[^a-zA-Z0-9]/g, '_');
                                    descargarAportesExcel(grupo.detalles, `Aportes_${nombreLimpio}_${fecha}.xlsx`);
                                  }}
                                  className="ml-3 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                                  title="Descargar aportes de este aportante"
                                >
                                  <Download className="h-3 w-3" />
                                  Excel
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 cursor-pointer" onClick={() => toggleAportante(grupo.idAportante)}>{grupo.totalAportes}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right cursor-pointer" onClick={() => toggleAportante(grupo.idAportante)}>
                              <span className={grupo.montoCLPTotal < 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                                ${grupo.montoCLPTotal.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right cursor-pointer" onClick={() => toggleAportante(grupo.idAportante)}>
                              <span className={grupo.montoUFTotal < 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                                {grupo.montoUFTotal.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 cursor-pointer" onClick={() => toggleAportante(grupo.idAportante)}>{grupo.cuotasTotales.toLocaleString()}</td>
                          </tr>
                          
                          {/* Filas de detalle */}
                          {isExpanded && (
                            <>
                              {/* Barra de filtros */}
                              <tr className="bg-gray-100">
                                <td></td>
                                <td colSpan={9} className="px-6 py-3">
                                  <div className="flex gap-3 items-center">
                                    <span className="text-sm font-medium text-gray-700">Filtrar:</span>
                                    <div className="flex items-center gap-2">
                                      <label className="text-xs text-gray-600">Fondo:</label>
                                      <select
                                        value={filtrosAportante[grupo.idAportante]?.fondo || 'Todos'}
                                        onChange={(e) => {
                                          setFiltrosAportante({
                                            ...filtrosAportante,
                                            [grupo.idAportante]: {
                                              ...filtrosAportante[grupo.idAportante],
                                              fondo: e.target.value,
                                              tipo: filtrosAportante[grupo.idAportante]?.tipo || 'Todos'
                                            }
                                          });
                                        }}
                                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <option value="Todos">Todos</option>
                                        {Array.from(new Set(grupo.detalles.map(d => d['Fondo']))).sort().map(fondo => (
                                          <option key={fondo} value={fondo}>{fondo}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <label className="text-xs text-gray-600">Tipo:</label>
                                      <select
                                        value={filtrosAportante[grupo.idAportante]?.tipo || 'Todos'}
                                        onChange={(e) => {
                                          setFiltrosAportante({
                                            ...filtrosAportante,
                                            [grupo.idAportante]: {
                                              ...filtrosAportante[grupo.idAportante],
                                              fondo: filtrosAportante[grupo.idAportante]?.fondo || 'Todos',
                                              tipo: e.target.value
                                            }
                                          });
                                        }}
                                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <option value="Todos">Todos</option>
                                        <option value="Llamado">Llamados (negativos)</option>
                                        <option value="Devolución">Devoluciones (positivos)</option>
                                      </select>
                                    </div>
                                    {(filtrosAportante[grupo.idAportante]?.fondo !== 'Todos' || filtrosAportante[grupo.idAportante]?.tipo !== 'Todos') && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const newFiltros = { ...filtrosAportante };
                                          delete newFiltros[grupo.idAportante];
                                          setFiltrosAportante(newFiltros);
                                        }}
                                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                      >
                                        Limpiar
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                              
                              {/* Encabezado de detalle */}
                              <tr className="bg-blue-50">
                                <td></td>
                                <td className="px-6 py-2 text-xs font-medium text-gray-600">Fondo</td>
                                <td className="px-6 py-2 text-xs font-medium text-gray-600 text-center">Serie</td>
                                <td className="px-6 py-2 text-xs font-medium text-gray-600 text-center">Tipo</td>
                                <td className="px-6 py-2 text-xs font-medium text-gray-600 text-right">Monto (CLP)</td>
                                <td className="px-6 py-2 text-xs font-medium text-gray-600 text-right">Monto (UF)</td>
                                <td className="px-6 py-2 text-xs font-medium text-gray-600 text-right">Cuotas</td>
                                <td className="px-6 py-2 text-xs font-medium text-gray-600 text-center">% Promesa</td>
                                <td className="px-6 py-2 text-xs font-medium text-gray-600">Fecha Pago</td>
                                <td className="px-6 py-2 text-xs font-medium text-gray-600 text-center">Estado</td>
                              </tr>
                              {grupo.detalles
                                .filter(aporte => {
                                  const filtro = filtrosAportante[grupo.idAportante];
                                  if (!filtro) return true;
                                  
                                  const fondoMatch = filtro.fondo === 'Todos' || aporte['Fondo'] === filtro.fondo;
                                  
                                  // Clasificar por signo del monto
                                  let tipoMatch = true;
                                  if (filtro.tipo !== 'Todos') {
                                    const montoUF = Number(aporte['Monto (UF)']) || 0;
                                    if (filtro.tipo === 'Llamado') {
                                      tipoMatch = montoUF < 0; // Negativos = Llamados
                                    } else if (filtro.tipo === 'Devolución') {
                                      tipoMatch = montoUF > 0; // Positivos = Devoluciones
                                    }
                                  }
                                  
                                  return fondoMatch && tipoMatch;
                                })
                                .map((aporte, index) => (
                                <tr key={`${grupo.idAportante}-${index}`} className="bg-white hover:bg-gray-50 border-l-4 border-blue-200">
                                  <td></td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{aporte['Fondo']}</td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-500">{aporte['Serie']}</td>
                                  <td className="px-6 py-3 whitespace-nowrap text-center">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      aporte['TIPO'] === 'Llamado de Capital' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                      {aporte['TIPO']}
                                    </span>
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right">
                                    {(() => {
                                      const montoCLP = parseChileanNumber(aporte['MONTO (CLP)']);
                                      return (
                                        <span className={montoCLP < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                                          ${montoCLP.toLocaleString()}
                                        </span>
                                      );
                                    })()}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right">
                                    <span className={Number(aporte['Monto (UF)']) < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                                      {Number(aporte['Monto (UF)'])?.toLocaleString()}
                                    </span>
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-500">{parseChileanNumber(aporte['Cuotas']).toLocaleString()}</td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-500">{aporte['% PROMESA']}</td>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{aporte['Fecha Pago']}</td>
                                  <td className="px-6 py-3 whitespace-nowrap text-center">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      aporte['Estado'] === 'PAGADO' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {aporte['Estado']}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}
                        </>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}