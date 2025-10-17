'use client';

import { useState, useEffect } from 'react';
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
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [aportantes, setAportantes] = useState<Aportante[]>([]);
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
  const [selectedFondo, setSelectedFondo] = useState<string | null>(null);
  const [selectedAportante, setSelectedAportante] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      const aportesAportanteData = await aportesAportanteRes.json();

      setFondos(fondosData.fondos || []);
      setSeries(seriesData.series || []);
      setAportantes(aportantesData.aportantes || []);
      setCompromisos(compromisosData.compromisos || []);
      setInmobiliarias(inmobiliariasData.inmobiliarias || []);
      setProyectos(proyectosData.proyectos || []);
      setCaracteristicas(caracteristicasData.caracteristicas || []);
      setAvanceVentas(avanceVentasData.avanceVentas || []);
      setAvanceObra(avanceObraData.avanceObra || []);
      setPoolFondos(Array.isArray(poolFondosData) ? poolFondosData : []);
      setLlamadosCapital(Array.isArray(llamadosCapitalData) ? llamadosCapitalData : []);
      setAportesAportante(Array.isArray(aportesAportanteData) ? aportesAportanteData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas generales
  const totalFondos = fondos.length;
  const totalSeries = series.length;
  const totalAportantes = aportantes.length;
  const capitalTotalComprometido = fondos.reduce((sum, fondo) => sum + (fondo['Capital Comprometido ($)'] || 0), 0);
  const capitalTotalRealizado = fondos.reduce((sum, fondo) => sum + (fondo['Capital Realizado ($)'] || 0), 0);
  const avanceGeneral = capitalTotalComprometido > 0 ? (capitalTotalRealizado / capitalTotalComprometido) * 100 : 0;

  // Filtrar series y compromisos por fondo seleccionado
  const seriesFiltradas = selectedFondo 
    ? series.filter(serie => serie['Fondo'] === selectedFondo)
    : series;

  const compromisosFiltrados = selectedFondo
    ? compromisos.filter(compromiso => compromiso['Fondo'] === selectedFondo)
    : compromisos;

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
            <div className="text-sm text-gray-500">
              Sistema de Gestión de Fondos de Inversión
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
                <p className="text-sm font-medium text-gray-500">Aportantes</p>
                <p className="text-2xl font-semibold text-gray-900">{totalAportantes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avance General</p>
                <p className="text-2xl font-semibold text-gray-900">{avanceGeneral.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtro por Fondo */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFondo(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                selectedFondo === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos los Fondos
            </button>
            {fondos.map(fondo => (
              <button
                key={fondo['Código Fondo']}
                onClick={() => setSelectedFondo(fondo['Código Fondo'])}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  selectedFondo === fondo['Código Fondo']
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {fondo['Código Fondo']}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Fondos */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Fondos</h2>
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
                {fondos.map((fondo, index) => (
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

        {/* Sección de Subyacentes */}
        <div className="border-t-4 border-blue-600 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Subyacentes</h2>

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
                  {proyectos.map((proyecto, index) => {
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
                  {caracteristicas.map((caracteristica, index) => {
                    const proyecto = proyectos.find(p => p['ID Proyecto'] === caracteristica['ID Proyecto']);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto?.Nombre || caracteristica['ID Proyecto']}</td>
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
                  {avanceVentas.map((avance, index) => {
                    const proyecto = proyectos.find(p => p['ID Proyecto'] === avance['ID Proyecto']);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto?.Nombre || avance['ID Proyecto']}</td>
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
                  {avanceObra.map((avance, index) => {
                    const proyecto = proyectos.find(p => p['ID Proyecto'] === avance['ID Proyecto']);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto?.Nombre || avance['ID Proyecto']}</td>
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

          {/* Tabla de Pool Fondos */}
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
                  {poolFondos.map((pool, index) => (
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

          {/* Tabla de Llamados de Capital */}
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
                  {llamadosCapital.map((llamado, index) => (
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

          {/* Filtro por Aportante */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar Aportes por Aportante</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedAportante(null)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  selectedAportante === null
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todos los Aportantes
              </button>
              {aportantes.map(aportante => (
                <button
                  key={aportante['ID Aportante']}
                  onClick={() => setSelectedAportante(aportante['ID Aportante'])}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    selectedAportante === aportante['ID Aportante']
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {aportante['Nombre']}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Aportes por Aportante */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Aportes por Aportante {selectedAportante ? `- ${aportantes.find(a => a['ID Aportante'] === selectedAportante)?.Nombre}` : ''}
              </h3>
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
                  {aportesAportante
                    .filter(aporte => !selectedAportante || aporte['ID Aportante'] === selectedAportante)
                    .map((aporte, index) => {
                      const aportante = aportantes.find(a => a['ID Aportante'] === aporte['ID Aportante']);
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aporte['ID Llamado']}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aporte['Fondo']}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{aporte['Serie']}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{aportante?.Nombre || aporte['ID Aportante']}</td>
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