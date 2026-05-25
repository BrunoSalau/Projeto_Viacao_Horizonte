import fs from 'fs';
import { pool } from './config/db.js';

const sql = fs.readFileSync(
    './src/database/schema.sql',
    'utf8'
);

await pool.query(sql);

console.log('Tabela criada com sucesso');

await pool.end();