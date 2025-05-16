# AutoFlow

An automated invoicing and client management system built with Next.js, Prisma, and PostgreSQL.

## Features

- Client management
- Invoice creation and tracking
- Email templates
- Automation workflows
- User authentication

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your local PostgreSQL database in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/autoflow"
   ```
4. Run database migrations:
   ```bash
   npm run prisma:deploy
   ```
5. Seed the database:
   ```bash
   npm run prisma:seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment on Vercel

1. Create a PostgreSQL database (use Vercel Postgres or external provider)
2. Add the following environment variables in Vercel:
   - `DATABASE_URL` - Your PostgreSQL connection string in format: `postgresql://username:password@host:port/database`
   - `NEXTAUTH_SECRET` - A random string for authentication (min 32 chars)
   - `NEXTAUTH_URL` - Your deployed application URL
   - `CRON_SECRET` - A random string for cron jobs
   - Email configuration if required

3. Ensure your DATABASE_URL is properly formatted and accessible from Vercel

4. Deploy the application:
   ```bash
   vercel deploy
   ```

## Troubleshooting Deployment Issues

If you encounter Prisma or PostgreSQL errors during deployment:

1. **Check DATABASE_URL format**
   Make sure your DATABASE_URL is properly formatted as a PostgreSQL connection string:
   ```
   postgresql://username:password@host:port/database
   ```

2. **Manually run migrations**
   You can manually apply migrations using Vercel CLI:
   ```bash
   vercel env pull    # Pull environment variables
   npm run db:migrate # Run migrations
   ```

3. **Force database schema**
   If migrations fail due to conflicts, you can force the schema:
   ```bash
   npm run db:migrate:force
   ```
   Note: This may result in data loss if your schema changes are incompatible.

4. **Check PostgreSQL connection**
   Ensure your PostgreSQL server accepts connections from Vercel's IP ranges.
   If using a managed database, check firewall settings or IP allowlists.

5. **Check logs**
   View deployment logs in the Vercel dashboard for specific error messages.

6. **Reinitialize database (last resort)**
   For a clean start, you can reset your database:
   ```bash
   npx prisma migrate reset
   ```
   Warning: This will delete all data!

## Database Migration

When making changes to the schema:

1. Update the schema in `prisma/schema.prisma`
2. Run:
   ```bash
   npx prisma migrate dev --name [migration-name]
   ```

## License

MIT 