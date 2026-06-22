import { pool } from '../config/db.js'
export class modelManutencao{

     static async criarManutencao(id_veiculo, descricao, data_manutencao){
    
        const result = await pool.query(
            `INSERT INTO manutencao
            (id_veiculo, descricao, data_manutencao)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [id_veiculo, descricao, data_manutencao]
        );
    
        return result.rows[0];
    }
    
    static async  listarManutencoes(){
    
        const result = await pool.query(
            `SELECT
                man.id,
                man.id_veiculo,
                man.descricao,
                man.data_manutencao,
                ve.placa,
                ve.modelo,
                ve.marca
            FROM manutencao man
            LEFT JOIN veiculo ve ON man.id_veiculo = ve.id
            ORDER BY man.data_manutencao DESC, man.id DESC`
        );
    
        return result.rows;
    }

    static async buscarManutencaoPorId(id){

        const result = await pool.query(
            `SELECT * FROM manutencao
            WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    }

    static async atualizarManutencao(id, id_veiculo, descricao, data_manutencao){

        const result = await pool.query(
            `UPDATE manutencao
            SET id_veiculo = $1,
                descricao = $2,
                data_manutencao = $3
            WHERE id = $4
            RETURNING *`,
            [id_veiculo, descricao, data_manutencao, id]
        );

        return result.rows[0];
    }
    
    static async deletarManutencao(id){
    
        const result = await pool.query(
            `DELETE FROM manutencao
            WHERE id = $1
            RETURNING *`,
            [id]
        );
    
        return result.rows[0];
    }
}
