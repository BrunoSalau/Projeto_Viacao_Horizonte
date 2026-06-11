import { pool } from '../config/db.js'
export class modelVeiculo{

    static async criarVeiculo(placa, modelo, marca, ano, capacidade_passageiros, quilometragem, status, imagem){
        

    const result = await pool.query(
        `INSERT INTO VEICULO (placa, modelo, marca, ano, capacidade_passageiros, quilometragem, status, imagem)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [placa, modelo, marca, ano, capacidade_passageiros, quilometragem, status, imagem]
    );
    
    return result.rows[0];
    }
    
    static async listarVeiculos(){
            const result = await pool.query(
                `SELECT * FROM veiculo`
            );
            return result.rows;
    }
    
    static async buscarVeiculoPlaca(placa){
    
        const result = await pool.query(
            `SELECT * FROM veiculo
            WHERE placa = $1`,
            [placa]
        );
    
        return result.rows[0];
    }

    static async atualizarVeiculo(placa, modelo, marca, ano, capacidade_passageiros, quilometragem, status, imagem){

    const result = await pool.query(
        `UPDATE veiculo
        SET modelo = $1,
            marca = $2,
            ano = $3,
            capacidade_passageiros = $4,
            quilometragem = $5,
            status = $6,
            imagem = $7
        WHERE placa = $8
        RETURNING *`,
        [modelo, marca, ano, capacidade_passageiros, quilometragem, status, imagem, placa]
    );

    return result.rows[0];
}
    
    static async deletarVeiculo(placa){
    
    
        const result = await pool.query(
            `DELETE FROM veiculo
            WHERE placa = $1
            RETURNING *
            `,
            [placa]
        );
        return result.rows[0];
    }
}