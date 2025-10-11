'use client';

import { useState } from 'react';
import { X, Building2, MapPin, Car } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Project, Sector } from '@/types/project';

interface ProjectModalProps {
  project: Project;
  sectors: Sector[];
  onClose: () => void;
}

export default function ProjectModal({ project, sectors, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'sectors'>('details');

  const sectorColors = {
    'Altos': '#3B82F6',
    'Medios': '#10B981', 
    'Populares': '#F59E0B'
  };

  const sectorChartData = sectors.map(sector => ({
    name: sector.sector,
    value: sector.cantidad,
    color: sectorColors[sector.sector as keyof typeof sectorColors] || '#6B7280'
  }));

  const salesData = sectors.map(sector => ({
    sector: sector.sector,
    ventas: sector.ventas,
    stock: sector.stock
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.proyecto}</h2>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {project.ciudad}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detalles del Proyecto
            </button>
            <button
              onClick={() => setActiveTab('sectors')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sectors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Análisis por Sectores
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Métricas Principales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Unidades Habitacionales</p>
                      <p className="text-2xl font-bold text-blue-900">{project.uh_totales.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Edificios</p>
                      <p className="text-2xl font-bold text-green-900">{project.edificios}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Car className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600">Estacionamientos</p>
                      <p className="text-2xl font-bold text-purple-900">{project.estacionamientos}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles Técnicos */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles Técnicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pisos por Edificio:</span>
                    <span className="font-medium">{project.pisos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avance de Ventas:</span>
                    <span className="font-medium">{project.avance_ventas.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avance de Obra:</span>
                    <span className="font-medium">{project.avance_obra.toFixed(1)}%</span>
                  </div>
                  {project.tir && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">TIR:</span>
                      <span className="font-medium">{project.tir.toFixed(2)}%</span>
                    </div>
                  )}
                  {project.dividendos && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dividendos:</span>
                      <span className="font-medium">${project.dividendos.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Barras de Progreso */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Avance de Ventas</span>
                    <span>{project.avance_ventas.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${project.avance_ventas}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Avance de Obra</span>
                    <span>{project.avance_obra.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${project.avance_obra}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sectors' && (
            <div className="space-y-6">
              {/* Gráfico de Distribución por Sectores */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Sectores</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Cantidad de Unidades</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={sectorChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: unknown) => {
                            const { name, percent } = props as { name: string; percent: number };
                            return `${name} ${(percent * 100).toFixed(0)}%`;
                          }}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sectorChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Ventas vs Stock</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="sector" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="ventas" fill="#3B82F6" name="Ventas" />
                        <Bar dataKey="stock" fill="#EF4444" name="Stock" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Tabla de Sectores */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-900 p-6 pb-0">Detalle por Sectores</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sector
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Porcentaje
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ventas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sectors.map((sector, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div 
                                className="h-4 w-4 rounded-full mr-3"
                                style={{ backgroundColor: sectorColors[sector.sector as keyof typeof sectorColors] }}
                              ></div>
                              <span className="text-sm font-medium text-gray-900">{sector.sector}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sector.cantidad}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sector.porcentaje.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sector.ventas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sector.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
