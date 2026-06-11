import { pool } from '../config/db.js'
export class modelViagem{

    static async criarViagem(id_veiculo, id_rota, data_viagem){
    
        const result = await pool.query(
            `INSERT INTO viagem
            (id_veiculo, id_rota, data_viagem)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [id_veiculo, id_rota, data_viagem]
        );
    
        return result.rows[0];
    }
    
    static async listarViagens(){
    
        const result = await pool.query(
            `SELECT * FROM viagem`
        );
    
        return result.rows;
    }

    static async atualizarViagem(id, id_veiculo, id_rota, data_viagem){
    
        const result = await pool.query(
            `UPDATE viagem
            SET id_veiculo = $1,
                id_rota = $2,
                data_viagem = $3
            WHERE id = $4
            RETURNING *`,
            [id_veiculo, id_rota, data_viagem, id]
        );
    
        return result.rows[0];
    }
    
    static async deletarViagem(id){
    
        const result = await pool.query(
            `DELETE FROM viagem
            WHERE id = $1
            RETURNING *`,
            [id]
        );
    
        return result.rows[0];
    }
}