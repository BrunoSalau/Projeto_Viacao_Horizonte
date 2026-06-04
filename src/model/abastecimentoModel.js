import { pool } from '../config/db.js'

export async function modelCriarAbastecimento(id_veiculo, litros, valor, data_abastecimento
){

    const result = await pool.query(
        `INSERT INTO abastecimento
        (id_veiculo, litros, valor, data_abastecimento)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [id_veiculo, litros, valor, data_abastecimento]
    );

    return result.rows[0];
}

export async function modelListarAbastecimentos(){

    const result = await pool.query(
        `SELECT * FROM abastecimento`
    );

    return result.rows;
}

export async function modelDeletarAbastecimento(id){

    const result = await pool.query(
        `DELETE FROM abastecimento
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
}