import { pool } from '../config/db.js';

/**
 * Inicializa Admin Master no banco de dados
 * Se não existir, cria com credenciais do .env
 */
export async function initAdmin() {
    try {
        // Verifica se Admin já existe
        const result = await pool.query(
            "SELECT * FROM usuario WHERE cpf = $1",
            [process.env.ADMIN_CPF]
        );

        if (result.rows.length > 0) {
            console.log('✓ Admin Master já existe');
            return;
        }

        // Cria Admin
        await pool.query(
            "INSERT INTO usuario(cpf, senha, tipo_usuario) VALUES ($1, $2, $3)",
            [process.env.ADMIN_CPF, process.env.ADMIN_SENHA, 'Admin']
        );

        console.log('✓ Admin Master criado com sucesso!');
        console.log(`  CPF: ${process.env.ADMIN_CPF}`);

    } catch (error) {
        console.error('Erro ao inicializar Admin:', error.message);
    }
}
