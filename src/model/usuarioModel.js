import { pool } from '../config/db.js'

export class modelUsuario{

    static async criarUsuario(cpf,senha,tipo_usuario) {
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
    
    static async listarUsuarios() {
        const result = await pool.query(
            'SELECT * FROM usuario'
        );
        return result.rows;
    }
    
    static async buscarUsuarioCPF(cpf) {
        const result = await pool.query(
            `
            SELECT * FROM usuario
            WHERE cpf = $1
            `,
            [cpf]
        );
        return result.rows[0];
    }

    static async buscarUsuarioPorId(id) {
    const result = await pool.query(
        `SELECT * FROM usuario WHERE id = $1`,
        [id]
    );
    return result.rows[0];
    }

    static async atualizarUsuario(cpf, senha, tipo_usuario) {
    const result = await pool.query(
        `
        UPDATE usuario
        SET senha = $1,
            tipo_usuario = $2
        WHERE cpf = $3
        RETURNING *
        `,
        [senha, tipo_usuario, cpf]
    );
    return result.rows[0];
}
    
    static async deletarUsuario(cpf) {
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
}
