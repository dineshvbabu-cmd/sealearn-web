import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

export default defineConfig({
  datasourceUrl: process.env.DATABASE_URL,
})