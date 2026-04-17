# AdFlow Pro - Clean Architecture

## Folder Structure

```
src/
├── architecture/
│   ├── controllers/       # Request/Response handlers
│   ├── services/          # Business logic
│   ├── repositories/      # Database access layer
│   ├── middleware/        # Auth, RBAC, validation
│   ├── utils/             # Helpers, error handling
│   ├── cron/              # Scheduled jobs
│   └── config/            # Configuration
├── models/                # MongoDB Schemas
├── api/                   # API Routes (Next.js App Router)
└── types/                 # TypeScript types
```

## Architecture Layers

1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Business logic implementation
3. **Repositories** - Database operations
4. **Middleware** - Authentication, authorization, validation
5. **Utils** - Shared utilities, error handling
6. **Cron** - Background jobs and automation

## Data Flow

Request → Middleware → Controller → Service → Repository → Database
