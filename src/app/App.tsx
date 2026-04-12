import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { ProfilePage, type ProfileData } from './components/ProfilePage';
import { JobsPage } from './components/JobsPage';
import { DashboardPage } from './components/DashboardPage';

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

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'profile' | 'jobs' | 'dashboard'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
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
  });

  const handleLogin = (email: string, password: string) => {
    console.log('Login:', email, password);
    setIsLoggedIn(true);
    setCurrentView('jobs');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const handleNavigate = (view: 'home' | 'login' | 'profile' | 'jobs' | 'dashboard') => {
    setCurrentView(view);
  };

  const handleUpdateProfileData = (data: ProfileData) => {
    setProfileData(data);
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
      {currentView === 'login' && <LoginPage onLogin={handleLogin} />}
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
    </div>
  );
}