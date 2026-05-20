import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { JobsPage } from './components/JobsPage';
import { DashboardPage } from './components/DashboardPage';
import { ExtensionPage } from './components/ExtensionPage';
import {
  authLogin,
  authRegister,
  getProfile,
  getApplications,
  createApplication,
  saveProfile,
  type ProfileData,
} from './services/api';

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

const DEFAULT_PROFILE: ProfileData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
  },
  experience: [],
  education: [],
  skills: [],
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'profile' | 'jobs' | 'dashboard' | 'extension'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);

  useEffect(() => {
    const storedId = localStorage.getItem('quickapplyUserId');
    if (storedId) {
      setUserId(storedId);
      setIsLoggedIn(true);
      loadUserData(storedId);
    }
  }, []);

  const loadUserData = async (id: string) => {
    try {
      const profileResponse = await getProfile(id);
      if (profileResponse.profile) {
        setProfileData(profileResponse.profile);
      }
      const applicationsResponse = await getApplications(id);
      setAppliedJobs(
        applicationsResponse.applications.map((item: any) => ({
          ...item.jobData,
          appliedDate: item.appliedDate,
          status: item.status,
          score: item.score,
        })),
      );
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  };

  const handleLogin = async (email: string, password: string, isRegister: boolean) => {
    try {
      const response = isRegister
        ? await authRegister(email, password)
        : await authLogin(email, password);
      localStorage.setItem('quickapplyUserId', response.userId);
      setUserId(response.userId);
      setIsLoggedIn(true);
      setCurrentView('jobs');
      await loadUserData(response.userId);
    } catch (error: any) {
      alert(error.message || 'Error de autenticación');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('quickapplyUserId');
    setUserId(null);
    setProfileData(DEFAULT_PROFILE);
    setAppliedJobs([]);
    setCurrentView('home');
  };

  const handleNavigate = (view: 'home' | 'login' | 'profile' | 'jobs' | 'dashboard' | 'extension') => {
    setCurrentView(view);
  };

  const handleUpdateProfileData = (data: ProfileData) => {
    setProfileData(data);
    if (!userId) return;
    saveProfile(userId, data).catch((error) => {
      console.error('Error guardando perfil:', error);
    });
  };

  return (
    <div className="size-full">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      {currentView === 'home' && (
        <HomePage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />
      )}
      {currentView === 'login' && <LoginPage onAuth={handleLogin} />}
      {currentView === 'profile' && (
        <ProfilePage
          profileData={profileData}
          onUpdateProfileData={handleUpdateProfileData}
        />
      )}
      {currentView === 'jobs' && (
        <JobsPage
          profileData={profileData}
          onUpdateProfileData={handleUpdateProfileData}
          appliedJobs={appliedJobs}
          onApplyToJob={(job) => {
            setAppliedJobs([...appliedJobs, { ...job, appliedDate: new Date().toISOString(), status: 'pending' }]);
          }}
        />
      )}
      {currentView === 'dashboard' && (
        <DashboardPage appliedJobs={appliedJobs} />
      )}
      {currentView === 'extension' && <ExtensionPage />}
    </div>
  );
}