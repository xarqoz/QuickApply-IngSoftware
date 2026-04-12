import { useState } from 'react';
import { User, Briefcase, GraduationCap, Award, Phone, MapPin, Globe } from 'lucide-react';

export interface ProfileData {
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

interface ProfilePageProps {
  profileData: ProfileData;
  onUpdateProfileData: (data: ProfileData) => void;
}

export function ProfilePage({ profileData, onUpdateProfileData }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');

  const [newSkill, setNewSkill] = useState('');

  const addExperience = () => {
    const updatedData = {
      ...profileData,
      experience: [
        ...profileData.experience,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    };
    onUpdateProfileData(updatedData);
  };

  const updateExperience = (id: string, field: string, value: string) => {
    const updatedData = {
      ...profileData,
      experience: profileData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    };
    onUpdateProfileData(updatedData);
  };

  const removeExperience = (id: string) => {
    const updatedData = {
      ...profileData,
      experience: profileData.experience.filter((exp) => exp.id !== id),
    };
    onUpdateProfileData(updatedData);
  };

  const addEducation = () => {
    const updatedData = {
      ...profileData,
      education: [
        ...profileData.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          year: '',
        },
      ],
    };
    onUpdateProfileData(updatedData);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    const updatedData = {
      ...profileData,
      education: profileData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    };
    onUpdateProfileData(updatedData);
  };

  const removeEducation = (id: string) => {
    const updatedData = {
      ...profileData,
      education: profileData.education.filter((edu) => edu.id !== id),
    };
    onUpdateProfileData(updatedData);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      const updatedData = {
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      };
      onUpdateProfileData(updatedData);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    const updatedData = {
      ...profileData,
      skills: profileData.skills.filter((s) => s !== skill),
    };
    onUpdateProfileData(updatedData);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    const updatedData = {
      ...profileData,
      personalInfo: { ...profileData.personalInfo, [field]: value },
    };
    onUpdateProfileData(updatedData);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Mi Perfil Profesional</h1>
          <p className="text-muted-foreground">
            Completa tu información para que la extensión pueda llenar formularios automáticamente
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <nav className="bg-card border border-border rounded-lg p-4 space-y-2">
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'personal'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <User size={20} />
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'experience'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <Briefcase size={20} />
                Experiencia Laboral
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'education'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <GraduationCap size={20} />
                Educación
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'skills'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <Award size={20} />
                Habilidades
              </button>
            </nav>
          </div>

          <div className="flex-1">
            <div className="bg-card border border-border rounded-lg p-6">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3>Información Personal</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        value={profileData.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Correo Electrónico</label>
                      <input
                        type="email"
                        value={profileData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        <Phone size={16} className="inline mr-1" />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={profileData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="+34 123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        <MapPin size={16} className="inline mr-1" />
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={profileData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Madrid, España"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={profileData.personalInfo.linkedIn}
                        onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="linkedin.com/in/tu-perfil"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">
                        <Globe size={16} className="inline mr-1" />
                        Portfolio
                      </label>
                      <input
                        type="url"
                        value={profileData.personalInfo.portfolio}
                        onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="www.tu-portfolio.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3>Experiencia Laboral</h3>
                    <button
                      onClick={addExperience}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                    >
                      Agregar Experiencia
                    </button>
                  </div>
                  <div className="space-y-6">
                    {profileData.experience.map((exp) => (
                      <div key={exp.id} className="border border-border rounded-lg p-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2">Empresa</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Nombre de la empresa"
                            />
                          </div>
                          <div>
                            <label className="block mb-2">Puesto</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Tu puesto"
                            />
                          </div>
                          <div>
                            <label className="block mb-2">Fecha de Inicio</label>
                            <input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <div>
                            <label className="block mb-2">Fecha de Fin</label>
                            <input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-2">Descripción</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-24"
                            placeholder="Describe tus responsabilidades y logros..."
                          />
                        </div>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-destructive hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    {profileData.experience.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        No hay experiencia laboral agregada. Haz clic en "Agregar Experiencia" para comenzar.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3>Educación</h3>
                    <button
                      onClick={addEducation}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                    >
                      Agregar Educación
                    </button>
                  </div>
                  <div className="space-y-6">
                    {profileData.education.map((edu) => (
                      <div key={edu.id} className="border border-border rounded-lg p-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2">Institución</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Universidad o institución"
                            />
                          </div>
                          <div>
                            <label className="block mb-2">Título</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Licenciatura, Maestría, etc."
                            />
                          </div>
                          <div>
                            <label className="block mb-2">Campo de Estudio</label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="Ingeniería, Administración, etc."
                            />
                          </div>
                          <div>
                            <label className="block mb-2">Año de Graduación</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                              placeholder="2020"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-destructive hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    {profileData.education.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        No hay educación agregada. Haz clic en "Agregar Educación" para comenzar.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <h3>Habilidades</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Agregar una habilidad (Ej: JavaScript, Comunicación)"
                    />
                    <button
                      onClick={addSkill}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                    >
                      Agregar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill) => (
                      <div
                        key={skill}
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {profileData.skills.length === 0 && (
                      <p className="text-muted-foreground text-center py-8 w-full">
                        No hay habilidades agregadas. Ingresa tus habilidades técnicas y blandas.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={() => alert('Cambios guardados exitosamente')}
                  className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
