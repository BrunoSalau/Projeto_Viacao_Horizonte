import { pool } from '../config/db.js'
export class modelRota{

    static async criarRota(origem, destino, distancia_km){
    
        const result = await pool.query(
            `INSERT INTO rota (origem, destino, distancia_km)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [origem, destino, distancia_km]
        );
    
        return result.rows[0];
    }
    
    static async listarRotas(){
    
        const result = await pool.query(
            `SELECT * FROM rota`
        );
    
        return result.rows;
    }

    static async buscarRota(origem, destino){

    const result = await pool.query(
        `SELECT * FROM rota
        WHERE origem = $1
        AND destino = $2`,
        [origem, destino]
    );

    return result.rows[0];
}

    static async atualizarRota(origem, destino, distancia_km, id){

    const result = await pool.query(
        `UPDATE rota
        SET origem = $1,
            destino = $2,
            distancia_km = $3
        WHERE id = $4
        RETURNING *`,
        [origem, destino, distancia_km, id]
    );

    return result.rows[0];
}
    
    static async deletarRota(id){
    
        const result = await pool.query(
            `DELETE FROM rota
            WHERE id = $1
            RETURNING *`,
            [id]
        );
    
        return result.rows[0];
    }
}