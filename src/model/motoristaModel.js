import { pool } from '../config/db.js'

export async function modelCriarMotorista(nome,cpf,cnh,telefone,usuario_id) {
    const result = await pool.query(
        `
        INSERT INTO motorista(nome,cpf,cnh,telefone,usuario_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [nome,cpf,cnh,telefone,usuario_id]
    );
    return result.rows[0];
}

export async function modelListarMotoristas() {
    const result = await pool.query(
        'SELECT * FROM motorista'
    );
    return result.rows;
}

export async function buscarMotoristaCPF(cpf) {
    const result = await pool.query(
        `
        SELECT * FROM motorista
        WHERE cpf = $1
        `,
        [cpf]
    );
    return result.rows[0];
}

export async function modelDeletarMotorista(cpf) {
    const result = await pool.query(
        `
        DELETE FROM motorista
        WHERE cpf = $1
        RETURNING *
        `,
        [cpf]
    );
    return result.rows[0];
}