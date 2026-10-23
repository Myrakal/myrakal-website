import 'dotenv/config'
import { db } from '../src/server/db.ts'

const rows = await db().$queryRaw`SELECT current_database() AS database, version() AS version`
console.log(rows)
const [chats, messages, comments] = await Promise.all([db().chat.count(), db().message.count(), db().comment.count()])
console.log({ chats, messages, comments })
await db().$disconnect()
