import { pool } from '../config/db.js'

export async function modelCriarRota(origem, destino, parada, distancia_km){

    const result = await pool.query(
        `INSERT INTO rota (origem, destino, parada, distancia_km)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [origem, destino, parada, distancia_km]
    );

    return result.rows[0];
}

export async function modelListarRotas(){

    const result = await pool.query(
        `SELECT * FROM rota`
    );

    return result.rows;
}

export async function modelDeletarRota(id){

    const result = await pool.query(
        `DELETE FROM rota
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
}