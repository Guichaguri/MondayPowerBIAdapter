import { Client } from 'pg';
import { environment } from '../environment/environment';

export type DatabaseConnection = Client;

async function setupDatabase(db: DatabaseConnection) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS monday_tokens (
      token character varying(64) COLLATE pg_catalog."default" NOT NULL,
      monday_key character varying(400) COLLATE pg_catalog."default" NOT NULL,
      monday_board numeric(10,0) NOT NULL,
      CONSTRAINT monday_tokens_pkey PRIMARY KEY (token)
    )`);
}

export async function connectDatabase(): Promise<DatabaseConnection> {
  const db = new Client({
    connectionString: environment.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await db.connect();
  await setupDatabase(db);

  return db;
}
