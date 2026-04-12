import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logoImage from 'figma:asset/1d0c3ab6a7370d91ecf7903a3f2fa35d01415719.png';

interface HeaderProps {
  currentView: 'home' | 'login' | 'profile' | 'jobs' | 'dashboard';
  onNavigate: (view: 'home' | 'login' | 'profile' | 'jobs' | 'dashboard') => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function Header({ currentView, onNavigate, isLoggedIn, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <img src={logoImage} alt="QuickApply" className="h-10 w-auto" />
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-primary transition-colors ${
                currentView === 'home' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Inicio
            </button>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onNavigate('jobs')}
                  className={`hover:text-primary transition-colors ${
                    currentView === 'jobs' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Vacantes
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`hover:text-primary transition-colors ${
                    currentView === 'dashboard' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Mis Postulaciones
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className={`hover:text-primary transition-colors ${
                    currentView === 'profile' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Mi Perfil
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 transition-opacity"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Iniciar Sesión
              </button>
            )}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`text-left ${
                  currentView === 'home' ? 'text-primary' : 'text-foreground'
                }`}
              >
                Inicio
              </button>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate('jobs');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left ${
                      currentView === 'jobs' ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    Vacantes
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left ${
                      currentView === 'dashboard' ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    Mis Postulaciones
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left ${
                      currentView === 'profile' ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Iniciar Sesión
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
