'use client';

export default function NotFound() {
  return (
    <html>
      <body suppressHydrationWarning>
        <div style={{ 
          fontFamily: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#FAF8F5',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', fontWeight: 'bold' }}>404</h1>
          <p style={{ margin: '0 0 2rem 0', color: '#666' }}>Page not found / Page introuvable</p>
          <a href="/" style={{ 
            backgroundColor: '#000', 
            color: '#fff', 
            padding: '1rem 2rem', 
            textDecoration: 'none', 
            textTransform: 'uppercase', 
            fontSize: '0.75rem', 
            letterSpacing: '0.1em',
            fontWeight: 'bold' 
          }}>
            Go to Home / Retour à l'accueil
          </a>
        </div>
      </body>
    </html>
  );
}
