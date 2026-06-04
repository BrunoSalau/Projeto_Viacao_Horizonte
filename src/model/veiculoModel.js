import { pool } from '../config/db.js'

export async function modelCriarVeiculo(placa, modelo, marca, ano, capacidade_passageiros){
    


const result = await pool.query(
    `INSERT INTO VEICULO (placa, modelo, marca, ano, capacidade_passageiros)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [placa, modelo, marca, ano, capacidade_passageiros]
);

return result.rows[0];
}

export async function modelListarVeiculos(){
        const result = await pool.query(
            `SELECT * FROM veiculo`
        );
        return result.rows;
}

export async function buscarVeiculoPlaca(placa){

    const result = await pool.query(
        `SELECT * FROM veiculo
        WHERE placa = $1`,
        [placa]
    );

    return result.rows[0];
}

export async function modelDeletarVeiculo(placa){


    const result = await pool.query(
        `DELETE FROM veiculo
        WHERE placa = $1
        RETURNING *
        `,
        [placa]
    );
    return result.rows[0];
}