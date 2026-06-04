import { pool } from '../config/db.js'

export async function modelCriarViagem(id_veiculo, id_rota, data_viagem){

    const result = await pool.query(
        `INSERT INTO viagem
        (id_veiculo, id_rota, data_viagem)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [id_veiculo, id_rota, data_viagem]
    );

    return result.rows[0];
}

export async function modelListarViagens(){

    const result = await pool.query(
        `SELECT * FROM viagem`
    );

    return result.rows;
}

export async function modelDeletarViagem(id){

    const result = await pool.query(
        `DELETE FROM viagem
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
}