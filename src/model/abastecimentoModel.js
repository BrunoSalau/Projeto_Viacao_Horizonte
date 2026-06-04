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
            `SELECT * FROM abastecimento`
        );
    
        return result.rows;
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