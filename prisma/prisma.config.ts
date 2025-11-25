// prisma/prisma.config.ts
import 'dotenv/config'; // Required to load environment variables from .env file
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  // Specifies the path to your Prisma schema file.
  // By default, it's 'prisma/schema.prisma', but you can change it if needed.
  schema: 'prisma/schema.prisma',

  // Defines the database connection details.
  datasource: {
    // The 'url' field typically reads the database connection string
    // from an environment variable, like DATABASE_URL.
    // The 'env' helper ensures type safety and throws an error if the variable is missing.
    url: env(process.env.DATABASE_URL!),
  },
  migrations: {
    path: 'prisma/migrations'
  }

  // You can also configure other aspects here, such as generators or driver adapters (in Prisma v7).
  // For example, if using a driver adapter:
  // client: {
  //   adapter: '@prisma/adapter-pg', // Example for PostgreSQL driver adapter
  // },
});
