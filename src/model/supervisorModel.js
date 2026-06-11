import { pool } from '../config/db.js'

export class modelSupervisor{
    static async criarSupervisor(nome,cpf,telefone,usuario_id) {
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
    
    static async listarSupervisores() {
        const result = await pool.query(
            'SELECT * FROM supervisor'
        );
        return result.rows;
    }
    
    static async buscarSupervisorCPF(cpf) {
        const result = await pool.query(
            `
            SELECT * FROM supervisor
            WHERE cpf = $1
            `,
            [cpf]
        );
        return result.rows[0];
    }

    static async atualizarSupervisor(nome, cpf, telefone, usuario_id) {
        const result = await pool.query(
            `
            UPDATE supervisor
            SET nome = $1,
                telefone = $2,
                usuario_id = $3
            WHERE cpf = $4
            RETURNING *
            `,
            [nome, telefone, usuario_id, cpf]
        );
        return result.rows[0];
    }
    
    static async deletarSupervisor(cpf) {
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
}
