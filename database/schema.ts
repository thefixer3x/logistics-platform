// Export the SQL schema from schema.sql
import { readFileSync } from 'fs'
import { join } from 'path'

const schemaPath = join(process.cwd(), 'database/schema.sql')
const sql = readFileSync(schemaPath, 'utf8')

export { sql }
