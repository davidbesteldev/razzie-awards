> ⚠️ **Note:** This project was developed exclusively for technical evaluation purposes as part of a recruitment process.

# 🏆 Razzie Awards

API to import and analyze Golden Raspberry Awards data.

## 📋 Prerequisites

- **Node.js** (v22.14 or higher)
- **NPM**

---

## ⚙️ Initial Setup

```bash
# Create the .env file according to the .env.example
cp .env.example .env

# Install dependencies
npm install

# Run database migrations
npm run prisma:migrate:dev

# Generate Prisma Client
npm run prisma:generate
```

## 🚀 Running the Application

```bash
# Start in watch mode
npm run start:dev

# Start in debug mode
npm run start:debug
```

## 🧪 Tests

```bash
# Unit tests
npm run test:unit

# Prepare (E2E) test
npm run pretest:e2e

# Integration (E2E) tests
npm run test:e2e
```

## 📖 Development Utilities

Helpful tools to assist development:

- API Documentation (Swagger): Access http://localhost:3000/docs (check the port in the ".env" file)
- Prisma Studio: Visual interface to inspect and manage database data

  ```bash
  npm run prisma:studio
  ```

- Full Database Reset **(⚠️ Destructive operation)** This command **irreversibly deletes all data**, recreates the database schema, and runs the seed automatically.

  > ❗ **Use only in local development environments.** ❗

  ```bash
  npx prisma migrate reset
  ```

## 🛠️ Technologies

This project was built using the following technologies:

- **[NestJS](https://nestjs.com/)**: Progressive Node.js framework for building efficient and scalable applications.
- **[TypeScript](https://www.typescriptlang.org/)**: JavaScript superset that adds static typing.
- **[Prisma](https://www.prisma.io/)**: Modern and high-performance ORM.
- **[SQLite](https://www.sqlite.org/)**: Lightweight, file-based relational database.
- **[Jest](https://jestjs.io/)**: Testing framework focused on simplicity and reliability.
- **[Swagger](https://swagger.io/)**: API documentation and testing tool (OpenAPI).
