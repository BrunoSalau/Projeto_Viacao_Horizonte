import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:Number(process.env.DB_PORT),

    ssl: {
        rejectUnauthorized: false,
    },
})
