import { TrendingUp, Briefcase, CheckCircle, Clock, Target } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  description: string;
  requirements: string[];
  score?: number;
  applied?: boolean;
  appliedDate?: string;
  status?: 'pending' | 'reviewing' | 'interview' | 'rejected';
}

interface DashboardPageProps {
  appliedJobs: Job[];
}

export function DashboardPage({ appliedJobs }: DashboardPageProps) {
  const stats = {
    totalApplications: appliedJobs.length,
    pending: appliedJobs.filter(j => !j.status || j.status === 'pending').length,
    reviewing: appliedJobs.filter(j => j.status === 'reviewing').length,
    interviews: appliedJobs.filter(j => j.status === 'interview').length,
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'reviewing':
        return 'En revisión';
      case 'interview':
        return 'Entrevista';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  const getDaysAgo = (dateString?: string) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Tablero de Postulaciones</h1>
          <p className="text-muted-foreground">
            Rastrea el estado de todas tus aplicaciones de empleo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3>Total</h3>
              <Briefcase className="text-primary" size={24} />
            </div>
            <p className="text-3xl font-semibold">{stats.totalApplications}</p>
            <p className="text-muted-foreground text-sm mt-1">Postulaciones totales</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3>Pendientes</h3>
              <Clock className="text-yellow-600" size={24} />
            </div>
            <p className="text-3xl font-semibold">{stats.pending}</p>
            <p className="text-muted-foreground text-sm mt-1">Esperando respuesta</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3>En Revisión</h3>
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <p className="text-3xl font-semibold">{stats.reviewing}</p>
            <p className="text-muted-foreground text-sm mt-1">Siendo revisadas</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3>Entrevistas</h3>
              <Target className="text-green-600" size={24} />
            </div>
            <p className="text-3xl font-semibold">{stats.interviews}</p>
            <p className="text-muted-foreground text-sm mt-1">En proceso</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h2>Historial de Postulaciones</h2>
          </div>
          <div className="divide-y divide-border">
            {appliedJobs.length > 0 ? (
              appliedJobs.map(job => (
                <div key={job.id} className="p-6 hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1">{job.title}</h3>
                          <p className="text-muted-foreground mb-2">{job.company}</p>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.salary}</span>
                            <span>•</span>
                            <span>Aplicado hace {getDaysAgo(job.appliedDate || job.postedDate)} días</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-muted-foreground">Score:</span>
                          <span className="font-semibold">{job.score}%</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(job.status)}`}>
                          {getStatusText(job.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Briefcase size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">No hay postulaciones aún</h3>
                <p className="text-muted-foreground">
                  Comienza a postularte a vacantes para verlas aquí
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
