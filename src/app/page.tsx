'use client';

import { useState, useEffect } from 'react';
import { Building2, MapPin, TrendingUp } from 'lucide-react';
import ProjectTable from '@/components/ProjectTable';
import ProjectModal from '@/components/ProjectModal';
import type { Project, Sector } from '@/types/project';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectors = async (projectName: string) => {
    try {
      const response = await fetch(`/api/sectors?project=${encodeURIComponent(projectName)}`);
      const data = await response.json();
      setSectors(data.sectors || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    await fetchSectors(project.proyecto);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
    setSectors([]);
  };

  // Calcular métricas generales
  const totalUnits = projects.reduce((sum, project) => sum + project.uh_totales, 0);
  const totalBuildings = projects.reduce((sum, project) => sum + project.edificios, 0);
  const avgSalesProgress = projects.length > 0 
    ? projects.reduce((sum, project) => sum + project.avance_ventas, 0) / projects.length 
    : 0;
  const totalCities = new Set(projects.map(p => p.ciudad)).size;

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
              <h1 className="ml-3 text-2xl font-bold text-gray-900">ECOMAC II</h1>
            </div>
            <div className="text-sm text-gray-500">
              Dashboard de Proyectos Inmobiliarios
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
                <p className="text-sm font-medium text-gray-500">Total UH</p>
                <p className="text-2xl font-semibold text-gray-900">{totalUnits.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Edificios</p>
                <p className="text-2xl font-semibold text-gray-900">{totalBuildings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avance Promedio</p>
                <p className="text-2xl font-semibold text-gray-900">{avgSalesProgress.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ciudades</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCities}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Proyectos */}
        <ProjectTable 
          projects={projects} 
          onProjectClick={handleProjectClick}
        />
      </main>

      {/* Modal */}
      {modalOpen && selectedProject && (
        <ProjectModal
          project={selectedProject}
          sectors={sectors}
          onClose={closeModal}
        />
      )}
    </div>
  );
}