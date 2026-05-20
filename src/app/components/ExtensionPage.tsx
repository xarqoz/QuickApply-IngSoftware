export function ExtensionPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Extensión QuickApply</h1>
          <p className="text-muted-foreground">
            Esta extensión te permite autocompletar formularios desde el navegador usando tu perfil guardado.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <section>
            <h2 className="mb-3">Cómo usarla</h2>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>Ejecuta el backend local con <code>pnpm run server</code>.</li>
              <li>Inicia la aplicación web con <code>pnpm run dev</code> y accede con tu cuenta.</li>
              <li>Instala la extensión desde la carpeta <code>extension/</code> en el modo de desarrollador de tu navegador.</li>
              <li>Abre una oferta de empleo, haz clic en el icono de la extensión y pulsa <strong>Autocompletar formulario</strong>.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3">Qué hace la extensión</h2>
            <p className="text-muted-foreground">
              La extensión consulta tu perfil almacenado en el backend y usa heurísticas automáticas para emparejar campos de formulario relevantes.
            </p>
            <p className="text-muted-foreground">
              Si configuras una clave de OpenAI en <code>OPENAI_API_KEY</code>, el backend intentará generar sugerencias de mapeo con IA.
            </p>
          </section>

          <section>
            <h2 className="mb-3">Requisitos</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Node.js 18+</li>
              <li>Backend ejecutándose en <code>http://localhost:3000</code></li>
              <li>Aplicación web abierta en <code>http://localhost:5173</code></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
