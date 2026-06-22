import { pool } from '../config/db.js'
export class modelAbastecimento{

    static async criarAbastecimento(id_veiculo, litros, valor, data_abastecimento
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
    
    static async listarAbastecimentos(){
    
        const result = await pool.query(
            `SELECT
                ab.id,
                ab.id_veiculo,
                ab.litros,
                ab.valor,
                ab.data_abastecimento,
                ve.placa,
                ve.modelo,
                ve.marca
            FROM abastecimento ab
            LEFT JOIN veiculo ve ON ab.id_veiculo = ve.id
            ORDER BY ab.data_abastecimento DESC, ab.id DESC`
        );
    
        return result.rows;
    }

    static async buscarAbastecimentoPorId(id){

        const result = await pool.query(
            `SELECT * FROM abastecimento
            WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    }

    static async atualizarAbastecimento(id, id_veiculo, litros, valor, data_abastecimento){

        const result = await pool.query(
            `UPDATE abastecimento
            SET id_veiculo = $1,
                litros = $2,
                valor = $3,
                data_abastecimento = $4
            WHERE id = $5
            RETURNING *`,
            [id_veiculo, litros, valor, data_abastecimento, id]
        );

    return result.rows[0];
}
    
    static async deletarAbastecimento(id){
    
        const result = await pool.query(
            `DELETE FROM abastecimento
            WHERE id = $1
            RETURNING *`,
            [id]
        );
    
        return result.rows[0];
    }
}