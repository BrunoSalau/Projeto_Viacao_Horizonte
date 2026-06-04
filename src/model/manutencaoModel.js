import { pool } from '../config/db.js'

export async function modelCriarManutencao(id_veiculo, descricao, data_manutencao){

    const result = await pool.query(
        `INSERT INTO manutencao
        (id_veiculo, descricao, data_manutencao)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [id_veiculo, descricao, data_manutencao]
    );

    return result.rows[0];
}

export async function modelListarManutencoes(){

    const result = await pool.query(
        `SELECT * FROM manutencao`
    );

    return result.rows;
}

export async function modelDeletarManutencao(id){

    const result = await pool.query(
        `DELETE FROM manutencao
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
}