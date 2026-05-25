import { pool } from '../config/db.js'

export async function modelCriarSupervisor(nome,cpf,telefone,usuario_id) {
    const result = await pool.query(
        `
        INSERT INTO supervisor(nome,cpf,telefone,usuario_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [nome,cpf,telefone,usuario_id]
    );
    return result.rows[0];
}

export async function modelListarSupervisores() {
    const result = await pool.query(
        'SELECT * FROM supervisor'
    );
    return result.rows;
}

export async function modelBuscarSupervisorCPF(cpf) {
    const result = await pool.query(
        `
        SELECT * FROM supervisor
        WHERE cpf = $1
        `,
        [cpf]
    );
    return result.rows[0];
}

export async function modelDeletarSupervisor(cpf) {
    const result = await pool.query(
        `
        DELETE FROM supervisor
        WHERE cpf = $1
        RETURNING *
        `,
        [cpf]
    );
    return result.rows[0];
}