import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    host:'db.ziydelbghsajrxedjxis.supabase.co',
    user:'postgres',
    password:'8RWUTanjVPBkMRyD',
    database:'postgres',
    port: 5432,

    ssl: {
        rejectUnauthorized: false,
    },
})
