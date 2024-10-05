import { z } from "zod";
import dotenv from "dotenv";
import logger from './logger';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
});

const validatedEnv = envSchema.safeParse(process.env);

if (!validatedEnv.success) {
  logger.error("❌ Variables de entorno inválidas:");
  logger.error(validatedEnv.error.format());
  throw new Error("Configuración de variables de entorno inválida");
}

const env = validatedEnv.data;

export { env };

