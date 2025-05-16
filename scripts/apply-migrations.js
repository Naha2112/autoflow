const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔄 Starting PostgreSQL migration script');

// Ensure we have the required DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Try to apply migrations
  console.log('🗄️ Applying database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  console.log('✅ Database migrations applied successfully');
  
  // Optionally seed the database if requested
  if (process.argv.includes('--seed')) {
    console.log('🌱 Seeding the database...');
    execSync('npx ts-node --compiler-options \'{"module":"CommonJS"}\' prisma/seed.ts', { stdio: 'inherit' });
    console.log('✅ Database seeded successfully');
  }
  
  process.exit(0);
} catch (error) {
  console.error('❌ Error applying migrations:', error.message);
  
  // If migrations failed, try a riskier approach with db push
  if (process.argv.includes('--force')) {
    console.log('⚠️ Attempting to force schema push with db push...');
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      console.log('✅ Schema pushed successfully with potential data loss');
      process.exit(0);
    } catch (pushError) {
      console.error('❌ Error forcing schema push:', pushError.message);
      process.exit(1);
    }
  } else {
    console.log('💡 Tip: Use --force flag to attempt db push as a fallback');
    process.exit(1);
  }
} 