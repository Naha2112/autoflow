export default function HomePage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Welcome to AutoFlow
      </h1>
      <p style={{ marginBottom: '2rem' }}>
        Your automated invoicing and client management system
      </p>
      <a
        href="/api/health"
        style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.25rem',
        }}
      >
        Check API Health
      </a>
    </main>
  );
} 