import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Star, TrendingUp, CheckCircle } from 'lucide-react';

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
}

interface ProfileData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    portfolio: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: string[];
}

interface JobsPageProps {
  profileData: ProfileData;
  onUpdateProfileData: (data: ProfileData) => void;
  appliedJobs: Job[];
  onApplyToJob: (job: Job) => void;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Desarrollador Frontend Senior',
    company: 'TechCorp',
    location: 'Madrid, España',
    salary: '45.000€ - 60.000€',
    type: 'Tiempo completo',
    postedDate: '2026-03-01',
    description: 'Buscamos un desarrollador frontend con experiencia en React y TypeScript para unirse a nuestro equipo.',
    requirements: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
  },
  {
    id: '2',
    title: 'Ingeniero de Software Full Stack',
    company: 'InnovateSoft',
    location: 'Barcelona, España',
    salary: '50.000€ - 70.000€',
    type: 'Tiempo completo',
    postedDate: '2026-02-28',
    description: 'Únete a nuestro equipo para desarrollar aplicaciones web escalables usando tecnologías modernas.',
    requirements: ['Node.js', 'React', 'MongoDB', 'AWS', 'Docker'],
  },
  {
    id: '3',
    title: 'Diseñador UX/UI',
    company: 'DesignHub',
    location: 'Remoto',
    salary: '35.000€ - 50.000€',
    type: 'Tiempo completo',
    postedDate: '2026-02-25',
    description: 'Buscamos un diseñador creativo para mejorar la experiencia de usuario de nuestros productos.',
    requirements: ['Figma', 'Adobe XD', 'Diseño de interfaces', 'Prototipado', 'Investigación de usuarios'],
  },
  {
    id: '4',
    title: 'Analista de Datos',
    company: 'DataInsights',
    location: 'Valencia, España',
    salary: '40.000€ - 55.000€',
    type: 'Tiempo completo',
    postedDate: '2026-03-02',
    description: 'Analiza grandes conjuntos de datos para proporcionar insights accionables al negocio.',
    requirements: ['Python', 'SQL', 'Tableau', 'Excel', 'Estadística'],
  },
  {
    id: '5',
    title: 'Desarrollador Mobile React Native',
    company: 'MobileFirst',
    location: 'Sevilla, España',
    salary: '42.000€ - 58.000€',
    type: 'Tiempo completo',
    postedDate: '2026-02-20',
    description: 'Desarrolla aplicaciones móviles innovadoras para iOS y Android usando React Native.',
    requirements: ['React Native', 'JavaScript', 'iOS', 'Android', 'API REST'],
  },
  {
    id: '6',
    title: 'Gerente de Producto Digital',
    company: 'ProductLab',
    location: 'Madrid, España',
    salary: '55.000€ - 75.000€',
    type: 'Tiempo completo',
    postedDate: '2026-02-27',
    description: 'Lidera el desarrollo de productos digitales desde la concepción hasta el lanzamiento.',
    requirements: ['Gestión de productos', 'Agile', 'Scrum', 'Comunicación', 'Análisis de mercado'],
  },
];

export function JobsPage({ profileData, onUpdateProfileData, appliedJobs, onApplyToJob }: JobsPageProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'matched' | 'applied'>('all');

  useEffect(() => {
    const scoredJobs = calculateJobScores(mockJobs, profileData);
    const jobsWithAppliedStatus = scoredJobs.map(job => ({
      ...job,
      applied: appliedJobs.some(appliedJob => appliedJob.id === job.id)
    }));
    setJobs(jobsWithAppliedStatus);
  }, [profileData, appliedJobs]);

  const calculateJobScores = (jobsList: Job[], profile: ProfileData): Job[] => {
    return jobsList.map(job => {
      let score = 0;
      const maxScore = 100;

      const userSkills = profile.skills.map(s => s.toLowerCase());
      const jobRequirements = job.requirements.map(r => r.toLowerCase());

      const matchedSkills = jobRequirements.filter(req =>
        userSkills.some(skill => skill.includes(req) || req.includes(skill))
      );
      const skillScore = (matchedSkills.length / jobRequirements.length) * 50;
      score += skillScore;

      if (profile.experience.length > 0) {
        score += 20;
        const hasRelevantExperience = profile.experience.some(exp =>
          exp.position.toLowerCase().includes(job.title.toLowerCase().split(' ')[0]) ||
          job.title.toLowerCase().includes(exp.position.toLowerCase().split(' ')[0])
        );
        if (hasRelevantExperience) {
          score += 15;
        }
      }

      if (profile.education.length > 0) {
        score += 10;
      }

      if (profile.personalInfo.location && job.location.includes(profile.personalInfo.location.split(',')[0])) {
        score += 5;
      }

      return {
        ...job,
        score: Math.min(Math.round(score), maxScore),
      };
    }).sort((a, b) => (b.score || 0) - (a.score || 0));
  };

  const handleApply = (jobId: string) => {
    const isValid = validateProfile(profileData);

    if (!isValid.valid) {
      alert(`Por favor completa la siguiente información antes de postularte:\n${isValid.missing.join('\n')}`);
      return;
    }

    const jobToApply = jobs.find(job => job.id === jobId);
    if (jobToApply) {
      onApplyToJob(jobToApply);
      alert('¡Postulación registrada exitosamente! La extensión autocompletará el formulario cuando visites la página de la empresa.');
    }
  };

  const validateProfile = (profile: ProfileData): { valid: boolean; missing: string[] } => {
    const missing: string[] = [];

    if (!profile.personalInfo.fullName) missing.push('- Nombre completo');
    if (!profile.personalInfo.email) missing.push('- Correo electrónico');
    if (!profile.personalInfo.phone) missing.push('- Teléfono');
    if (profile.experience.length === 0) missing.push('- Al menos una experiencia laboral');
    if (profile.skills.length === 0) missing.push('- Al menos una habilidad');

    return {
      valid: missing.length === 0,
      missing,
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 75) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredJobs = jobs.filter(job => {
    if (filterType === 'matched') return (job.score || 0) >= 50;
    if (filterType === 'applied') return job.applied;
    return true;
  });

  const getDaysAgo = (dateString: string) => {
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
          <h1 className="mb-2">Vacantes Disponibles</h1>
          <p className="text-muted-foreground">
            Encuentra trabajos que coincidan con tu perfil. El score indica qué tan bien encajas.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:opacity-80'
            }`}
          >
            Todas ({jobs.length})
          </button>
          <button
            onClick={() => setFilterType('matched')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'matched'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:opacity-80'
            }`}
          >
            Alta coincidencia ({jobs.filter(j => (j.score || 0) >= 50).length})
          </button>
          <button
            onClick={() => setFilterType('applied')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'applied'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:opacity-80'
            }`}
          >
            Postuladas ({jobs.filter(j => j.applied).length})
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className={`bg-card border rounded-lg p-6 cursor-pointer transition-all ${
                  selectedJob?.id === job.id
                    ? 'border-primary shadow-lg'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="flex-1">{job.title}</h3>
                      {job.applied && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          <CheckCircle size={16} />
                          <span className="text-sm">Postulado</span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{job.company}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getScoreBadgeColor(job.score || 0)}`}>
                    <div className="flex items-center gap-1">
                      <Star size={16} />
                      <span>{job.score}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    Hace {getDaysAgo(job.postedDate)} días
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.requirements.slice(0, 4).map((req, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm ${
                        profileData.skills.some(s =>
                          s.toLowerCase().includes(req.toLowerCase()) ||
                          req.toLowerCase().includes(s.toLowerCase())
                        )
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {req}
                    </span>
                  ))}
                  {job.requirements.length > 4 && (
                    <span className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                      +{job.requirements.length - 4} más
                    </span>
                  )}
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground">
                  No se encontraron vacantes para este filtro.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedJob ? (
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="mb-4">Detalles de la Vacante</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="mb-2">Score de Coincidencia</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${
                            (selectedJob.score || 0) >= 75
                              ? 'bg-green-600'
                              : (selectedJob.score || 0) >= 50
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${selectedJob.score}%` }}
                        />
                      </div>
                      <span className={`font-semibold ${getScoreColor(selectedJob.score || 0)}`}>
                        {selectedJob.score}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2">Descripción</h4>
                    <p className="text-muted-foreground text-sm">{selectedJob.description}</p>
                  </div>

                  <div>
                    <h4 className="mb-2">Requisitos</h4>
                    <div className="space-y-2">
                      {selectedJob.requirements.map((req, idx) => {
                        const matches = profileData.skills.some(s =>
                          s.toLowerCase().includes(req.toLowerCase()) ||
                          req.toLowerCase().includes(s.toLowerCase())
                        );
                        return (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {matches ? (
                              <CheckCircle size={16} className="text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-muted rounded-full" />
                            )}
                            <span className={matches ? 'text-foreground' : 'text-muted-foreground'}>
                              {req}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                      <TrendingUp size={16} className="mt-0.5" />
                      <p>
                        {(selectedJob.score || 0) >= 75
                          ? 'Excelente coincidencia! Tu perfil encaja muy bien con esta vacante.'
                          : (selectedJob.score || 0) >= 50
                          ? 'Buena coincidencia. Cumples con varios de los requisitos.'
                          : 'Baja coincidencia. Considera mejorar tu perfil agregando más habilidades relevantes.'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={selectedJob.applied}
                  className={`w-full py-3 rounded-lg transition-opacity ${
                    selectedJob.applied
                      ? 'bg-secondary text-secondary-foreground cursor-not-allowed opacity-60'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {selectedJob.applied ? 'Ya postulaste a esta vacante' : 'Postularme'}
                </button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center sticky top-24">
                <Briefcase size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Selecciona una vacante para ver los detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
