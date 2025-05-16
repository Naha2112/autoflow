export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Welcome to AutoFlow</h1>
      <p className="text-lg mb-4">Your automated invoicing and client management system</p>
      <div className="mt-8">
        <a 
          href="/api/health" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Check API Health
        </a>
      </div>
    </main>
  );
}
