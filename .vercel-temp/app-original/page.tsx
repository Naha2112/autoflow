export default function Home() {
  return (
    <main style={{ 
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <h1 style={{ 
        fontSize: '2.25rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}>
        Welcome to AutoFlow
      </h1>
      <p style={{ 
        fontSize: '1.125rem',
        marginBottom: '1rem'
      }}>
        Your automated invoicing and client management system
      </p>
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/api/health" 
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none'
          }}
        >
          Check API Health
        </a>
      </div>
    </main>
  );
}
