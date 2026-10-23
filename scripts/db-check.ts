import 'dotenv/config'
import { db } from '../src/server/db.ts'

const rows = await db().$queryRaw`SELECT current_database() AS database, version() AS version`
console.log(rows)
await db().$disconnect()
