// Script to check environment variables before build

console.log('🔍 Checking environment variables...');

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.error('Please set a valid PostgreSQL connection string in your environment variables');
  process.exit(1);
}

// Validate the DATABASE_URL format
if (!process.env.DATABASE_URL.startsWith('postgresql://')) {
  console.error('❌ DATABASE_URL must be a PostgreSQL connection string (postgresql://...)');
  process.exit(1);
}

// Check for NEXTAUTH_SECRET
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️ NEXTAUTH_SECRET is not set. Authentication may not work properly.');
}

// Check for NEXTAUTH_URL
if (!process.env.NEXTAUTH_URL) {
  console.warn('⚠️ NEXTAUTH_URL is not set. This may cause authentication redirects to fail.');
}

console.log('✅ Environment validation passed');
process.exit(0); 