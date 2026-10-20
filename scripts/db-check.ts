import 'dotenv/config'
import { db } from '../server/db.ts'

const rows = await db().$queryRaw`SELECT current_database() AS database, version() AS version`
console.log(rows)
await db().$disconnect()
