import { FileText, Zap, Shield, Download } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: 'login' | 'profile') => void;
  isLoggedIn: boolean;
}

export function HomePage({ onNavigate, isLoggedIn }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6">QuickApply - Automatiza tus Aplicaciones de Empleo</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ahorra tiempo y aplica a más empleos. Nuestra extensión de navegador llena automáticamente
            formularios de empleo con tu información guardada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate(isLoggedIn ? 'profile' : 'login')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {isLoggedIn ? 'Ir a Mi Perfil' : 'Comenzar Ahora'}
            </button>
            <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
              <Download size={20} />
              Descargar Extensión
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-12">¿Por qué QuickApply?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="mb-3">Rápido y Eficiente</h3>
              <p className="text-muted-foreground">
                Completa formularios en segundos en lugar de minutos. Aplica a más trabajos en menos tiempo.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="mb-3">Seguro y Privado</h3>
              <p className="text-muted-foreground">
                Tu información se almacena de forma segura y encriptada. Solo tú tienes acceso a tus datos.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-primary" size={24} />
              </div>
              <h3 className="mb-3">Información Personalizada</h3>
              <p className="text-muted-foreground">
                Guarda múltiples versiones de tu CV y carta de presentación para diferentes tipos de trabajos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center mb-12">Cómo Funciona</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="mb-2">Instala la Extensión</h3>
                <p className="text-muted-foreground">
                  Descarga e instala QuickApply desde la tienda de extensiones de tu navegador.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="mb-2">Crea tu Perfil</h3>
                <p className="text-muted-foreground">
                  Ingresa tu información personal, experiencia laboral, educación y habilidades una sola vez.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="mb-2">Aplica Automáticamente</h3>
                <p className="text-muted-foreground">
                  Cuando encuentres un trabajo, activa la extensión y observa cómo se completan los formularios automáticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6">Listo para Empezar?</h2>
          <p className="text-muted-foreground mb-8">
            Únete a miles de personas que ya están ahorrando tiempo en sus búsquedas de empleo.
          </p>
          <button
            onClick={() => onNavigate(isLoggedIn ? 'profile' : 'login')}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            {isLoggedIn ? 'Configurar Mi Perfil' : 'Crear Cuenta Gratis'}
          </button>
        </div>
      </section>
    </div>
  );
}
