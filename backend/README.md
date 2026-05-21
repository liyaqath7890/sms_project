# Backend Setup Instructions

## Prerequisites

1. **Node.js** (v16 or higher) - Already installed
2. **PostgreSQL** (v12 or higher)

## PostgreSQL Setup

### Windows Installation
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Note down the password you set during installation

### Database Setup
1. Open pgAdmin or command line
2. Create a new database named `edustrem_sms`
3. Run the schema file to create tables:

```bash
psql -U postgres -d edustrem_sms -f backend/config/schema.sql
```

## Environment Configuration

1. Copy `.env` file and update the database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edustrem_sms
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password
JWT_SECRET=your_super_secret_jwt_key_here_change_this
```

## Running the Backend

```bash
# Development mode with auto-restart
npm run server:dev

# Production mode
npm run server
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password

### Health Check
- `GET /health` - Server health check
- `GET /api/test-db` - Database connection test

## Testing

1. Start the server: `npm run server:dev`
2. Test health: `curl http://localhost:3001/health`
3. Test DB: `curl http://localhost:3001/api/test-db`

## Next Steps

1. Set up PostgreSQL and run schema
2. Test authentication endpoints
3. Implement remaining API routes (students, teachers, etc.)
4. Update frontend to use real API instead of mock data