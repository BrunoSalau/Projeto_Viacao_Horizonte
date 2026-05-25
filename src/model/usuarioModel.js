import { pool } from '../config/db.js'

export async function modelCriarUsuario(cpf,senha,tipo_usuario) {
    const result = await pool.query(
        `
        INSERT INTO usuario(cpf,senha,tipo_usuario)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [cpf,senha,tipo_usuario]
    );
    return result.rows[0];
}

export async function modelListarUsuarios() {
    const result = await pool.query(
        'SELECT * FROM usuario'
    );
    return result.rows;
}

export async function buscarUsuarioCPF(cpf) {
    const result = await pool.query(
        `
        SELECT * FROM usuario
        WHERE cpf = $1
        `,
        [cpf]
    );
    return result.rows[0];
}

export async function modelDeletarUsuario(cpf) {
    const result = await pool.query(
        `
        DELETE FROM usuario
        WHERE cpf = $1
        RETURNING *
        `,
        [cpf]
    );
    return result.rows[0];
}