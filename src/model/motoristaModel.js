import { pool } from '../config/db.js'

export class modelMotorista{

        static async criarMotorista(nome,cpf,cnh,telefone,usuario_id) {
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

        static async listarMotoristas() {
            const result = await pool.query(
                'SELECT * FROM motorista'
            );
            return result.rows;
        }
    
        static async buscarMotoristaCPF(cpf) {
            const result = await pool.query(
                `
                SELECT * FROM motorista
                WHERE cpf = $1
                `,
                [cpf]
            );
            return result.rows[0];
        }

        static async atualizarMotorista(nome, cpf, cnh, telefone, usuario_id) {
            const result = await pool.query(
                `
                UPDATE motorista
                SET nome = $1,
                    cnh = $2,
                    telefone = $3,
                    usuario_id = $4
                WHERE cpf = $5
                RETURNING *
                `,
                [nome, cnh, telefone, usuario_id, cpf]
            );
            return result.rows[0];
        }

        static async deletarMotorista(cpf) {
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
}



